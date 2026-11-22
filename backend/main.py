import os
import time
import uuid
import base64
from typing import Optional, List, Dict, Any
from datetime import datetime

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse

from quality_analyzer import analyze_image_quality
from image_processor import process_image, PRESETS

app = FastAPI(
    title="WarrantyClarity AI Backend",
    description="Intelligent Product Photo Restoration and Quality Assessment API for Warranty Support",
    version="1.0.0"
)

# CORS configuration to allow local Vite frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Maximum upload limit: 20 MB
MAX_FILE_SIZE = 20 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)

# In-memory history for the current session (lightweight and privacy-friendly)
SESSION_HISTORY: List[Dict[str, Any]] = []

SAMPLE_CATALOG = [
    {
        "id": "sample-1",
        "title": "Blurry Serial & IMEI Label",
        "category": "Laptops & Mobile",
        "defect_type": "Defocus Blur & Unreadable Barcode",
        "filename": "sample1_blurry_serial_label.jpg",
        "recommended_preset": "blurry",
        "description": "Warranty serial sticker photographed with camera focus error. Barcode and IMEI numbers are severely degraded."
    },
    {
        "id": "sample-2",
        "title": "Low-Light Earbuds Hinge Crack",
        "category": "Audio & Accessories",
        "defect_type": "Severe Underexposure & Physical Fracture",
        "filename": "sample2_lowlight_earbuds_damage.jpg",
        "recommended_preset": "low_light",
        "description": "Customer photographed cracked earbud hinge in a dark room. Shadow occlusion hides mechanical stress fracture."
    },
    {
        "id": "sample-3",
        "title": "High-Noise Cracked Screen",
        "category": "Smartphones & Tablets",
        "defect_type": "High ISO Grain & Impact Fracture",
        "filename": "sample3_noisy_cracked_screen.jpg",
        "recommended_preset": "noise_removal",
        "description": "Phone screen impact spider crack photographed in dim lighting with extreme digital sensor grain."
    },
    {
        "id": "sample-4",
        "title": "Burnt Circuit Board Component",
        "category": "PCBs & Power Electronics",
        "defect_type": "Color Tint & Low Micro-Contrast",
        "filename": "sample4_circuit_board_burn.jpg",
        "recommended_preset": "detail_enhancement",
        "description": "Motherboard capacitor burn defect obscured by harsh tungsten yellow light and low contrast."
    }
]

def encode_image_base64(image: np.ndarray, ext: str = ".jpg") -> str:
    """Encodes a BGR OpenCV image into a base64 Data URI."""
    if ext.lower() in [".png"]:
        mime = "image/png"
        _, buffer = cv2.imencode(".png", image, [cv2.IMWRITE_PNG_COMPRESSION, 4])
    else:
        mime = "image/jpeg"
        _, buffer = cv2.imencode(".jpg", image, [cv2.IMWRITE_JPEG_QUALITY, 92])
    encoded = base64.b64encode(buffer).decode("utf-8")
    return f"data:{mime};base64,{encoded}"

def decode_image_bytes(image_bytes: bytes) -> np.ndarray:
    """Decodes raw bytes into a BGR numpy array using OpenCV."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode image bytes. The file may be corrupted.")
    return image

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "WarrantyClarity AI",
        "version": "1.0.0",
        "modules": {
            "opencv": cv2.__version__,
            "quality_analyzer": "active",
            "image_processor": "active",
            "privacy_guard": "in-memory session (no persistent photo retention)"
        },
        "presets": list(PRESETS.keys())
    }

@app.get("/api/samples")
def list_samples():
    """Returns sample images with metadata for quick demonstration."""
    samples_with_status = []
    for s in SAMPLE_CATALOG:
        filepath = os.path.join(SAMPLES_DIR, s["filename"])
        available = os.path.exists(filepath)
        samples_with_status.append({**s, "available": available})
    return {"samples": samples_with_status}

@app.get("/api/samples/{sample_id}/image")
def get_sample_image(sample_id: str):
    """Retrieves the raw image file for a given sample."""
    sample = next((s for s in SAMPLE_CATALOG if s["id"] == sample_id), None)
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    filepath = os.path.join(SAMPLES_DIR, sample["filename"])
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Sample image file not found on disk")
    return FileResponse(filepath, media_type="image/jpeg", filename=sample["filename"])

@app.post("/api/analyze")
def analyze_image(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    """
    Analyzes an uploaded image or sample and returns objective quality metrics:
    resolution, brightness, RMS contrast, Laplacian sharpness, and blind noise.
    """
    raw_bytes = None
    filename = "image.jpg"

    if hasattr(sample_id, "default"):
        sample_id = sample_id.default
    if hasattr(file, "default"):
        file = file.default

    if sample_id:
        sample = next((s for s in SAMPLE_CATALOG if s["id"] == sample_id), None)
        if not sample:
            raise HTTPException(status_code=404, detail="Sample not found")
        filepath = os.path.join(SAMPLES_DIR, sample["filename"])
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Sample file missing")
        with open(filepath, "rb") as f:
            raw_bytes = f.read()
        filename = sample["filename"]
    elif file and hasattr(file, "filename") and file.filename:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Please upload a JPG, JPEG, PNG, or WEBP image."
            )
        raw_bytes = file.file.read()
        filename = file.filename
        if len(raw_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds maximum allowed limit (20MB).")
        if len(raw_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    else:
        raise HTTPException(status_code=400, detail="No file or sample_id provided.")

    try:
        image = decode_image_bytes(raw_bytes)
        analysis = analyze_image_quality(image, file_size_bytes=len(raw_bytes))
        return {
            "filename": filename,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@app.post("/api/enhance")
def enhance_image_endpoint(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    preset: Optional[str] = Form(None),
    brightness: float = Form(0.0),
    contrast: float = Form(0.0),
    sharpness: float = Form(0.0),
    denoise: float = Form(0.0),
    saturation: float = Form(0.0),
    upscale: int = Form(1),
    auto_wb: bool = Form(True),
    output_format: str = Form("jpeg")
):
    """
    Main image restoration endpoint. Processes customer product photos using selected
    enhancement algorithms, computes before-and-after metrics, and returns the result.
    """
    start_time = time.perf_counter()
    raw_bytes = None
    filename = "product_image.jpg"

    # Normalize parameters if invoked directly in test routines
    if hasattr(output_format, "default"):
        output_format = output_format.default
    if hasattr(preset, "default"):
        preset = preset.default
    if hasattr(brightness, "default"):
        brightness = brightness.default
    if hasattr(contrast, "default"):
        contrast = contrast.default
    if hasattr(sharpness, "default"):
        sharpness = sharpness.default
    if hasattr(denoise, "default"):
        denoise = denoise.default
    if hasattr(saturation, "default"):
        saturation = saturation.default
    if hasattr(upscale, "default"):
        upscale = upscale.default
    if hasattr(auto_wb, "default"):
        auto_wb = auto_wb.default
    if hasattr(sample_id, "default"):
        sample_id = sample_id.default
    if hasattr(file, "default"):
        file = file.default

    if sample_id:
        sample = next((s for s in SAMPLE_CATALOG if s["id"] == sample_id), None)
        if not sample:
            raise HTTPException(status_code=404, detail="Sample not found")
        filepath = os.path.join(SAMPLES_DIR, sample["filename"])
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Sample image file not found")
        with open(filepath, "rb") as f:
            raw_bytes = f.read()
        filename = sample["filename"]
    elif file and hasattr(file, "filename") and file.filename:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported format '{ext}'. Supported formats: JPG, JPEG, PNG, WEBP."
            )
        raw_bytes = file.file.read()
        filename = file.filename
        if len(raw_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 20MB limit.")
        if len(raw_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    else:
        raise HTTPException(status_code=400, detail="Please upload an image file or choose a sample.")

    try:
        original_img = decode_image_bytes(raw_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read image: {str(e)}")

    # Determine processing parameters: preset vs custom sliders
    used_preset_name = None
    final_brightness = brightness
    final_contrast = contrast
    final_sharpness = sharpness
    final_denoise = denoise
    final_saturation = saturation
    final_upscale = upscale

    if preset and preset in PRESETS:
        p_info = PRESETS[preset]
        used_preset_name = p_info["name"]
        final_brightness = p_info["params"]["brightness"]
        final_contrast = p_info["params"]["contrast"]
        final_sharpness = p_info["params"]["sharpness"]
        final_denoise = p_info["params"]["denoise"]
        final_saturation = p_info["params"]["saturation"]
        final_upscale = p_info["params"].get("upscale", 1)

    # Validate upscale factor
    final_upscale = max(1, min(4, int(final_upscale)))

    # Perform Image Enhancement
    try:
        enhanced_img, applied_ops = process_image(
            image=original_img,
            brightness=final_brightness,
            contrast=final_contrast,
            sharpness=final_sharpness,
            denoise=final_denoise,
            saturation=final_saturation,
            upscale=final_upscale,
            auto_wb=auto_wb
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement error during processing: {str(e)}")

    processing_time_ms = round((time.perf_counter() - start_time) * 1000.0, 1)

    # Encode enhanced image
    ext_out = ".png" if output_format.lower() == "png" else ".jpg"
    enhanced_data_uri = encode_image_base64(enhanced_img, ext=ext_out)
    original_data_uri = encode_image_base64(original_img, ext=".jpg")

    # Calculate actual bytes of enhanced image
    if ext_out == ".png":
        _, enc_buf = cv2.imencode(".png", enhanced_img, [cv2.IMWRITE_PNG_COMPRESSION, 4])
    else:
        _, enc_buf = cv2.imencode(".jpg", enhanced_img, [cv2.IMWRITE_JPEG_QUALITY, 92])
    enhanced_bytes_len = len(enc_buf)

    # Quality metrics before and after
    before_metrics = analyze_image_quality(original_img, file_size_bytes=len(raw_bytes))
    after_metrics = analyze_image_quality(enhanced_img, file_size_bytes=enhanced_bytes_len)

    item_id = str(uuid.uuid4())
    record = {
        "id": item_id,
        "filename": filename,
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "preset": used_preset_name,
        "processing_time_ms": processing_time_ms,
        "dimensions_before": f"{before_metrics['dimensions']['width']}x{before_metrics['dimensions']['height']}",
        "dimensions_after": f"{after_metrics['dimensions']['width']}x{after_metrics['dimensions']['height']}",
        "file_size_before_kb": before_metrics["file_size_kb"],
        "file_size_after_kb": after_metrics["file_size_kb"],
        "sharpness_before": before_metrics["sharpness"]["score"],
        "sharpness_after": after_metrics["sharpness"]["score"],
        "contrast_before": before_metrics["contrast"]["rms_value"],
        "contrast_after": after_metrics["contrast"]["rms_value"],
        "brightness_before": before_metrics["brightness"]["value"],
        "brightness_after": after_metrics["brightness"]["value"],
        "noise_before": before_metrics["noise"]["sigma"],
        "noise_after": after_metrics["noise"]["sigma"],
        "applied_operations": applied_ops,
        "thumbnail_data_uri": enhanced_data_uri  # Available for session reload
    }

    # Maintain maximum 15 items in session history
    SESSION_HISTORY.insert(0, record)
    if len(SESSION_HISTORY) > 15:
        SESSION_HISTORY.pop()

    return {
        "id": item_id,
        "filename": filename,
        "original_data_uri": original_data_uri,
        "enhanced_data_uri": enhanced_data_uri,
        "processing_time_ms": processing_time_ms,
        "applied_operations": applied_ops,
        "preset_used": used_preset_name,
        "params_used": {
            "brightness": final_brightness,
            "contrast": final_contrast,
            "sharpness": final_sharpness,
            "denoise": final_denoise,
            "saturation": final_saturation,
            "upscale": final_upscale,
            "auto_wb": auto_wb
        },
        "before_metrics": before_metrics,
        "after_metrics": after_metrics
    }

@app.get("/api/history")
def get_history():
    """Returns the list of recently enhanced images during this session."""
    return {"history": SESSION_HISTORY}

@app.delete("/api/history")
def clear_history():
    """Clears the session history."""
    SESSION_HISTORY.clear()
    return {"message": "Session history cleared successfully"}

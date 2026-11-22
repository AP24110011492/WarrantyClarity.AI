import cv2
import numpy as np
from typing import Dict, Any, List

def analyze_image_quality(image: np.ndarray, file_size_bytes: int = 0) -> Dict[str, Any]:
    """
    Performs objective image quality analysis on an input image (BGR numpy array).
    Calculates resolution, brightness, RMS contrast, Laplacian sharpness, and blind noise estimation.
    """
    if image is None or image.size == 0:
        raise ValueError("Invalid or empty image provided for quality analysis")

    height, width = image.shape[:2]
    channels = image.shape[2] if len(image.shape) > 2 else 1
    megapixels = round((width * height) / 1_000_000.0, 3)

    # Convert to grayscale for luminance & spatial analysis
    if channels == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()

    # 1. Average Brightness (0 - 255) and percentage (0 - 100%)
    mean_brightness = float(np.mean(gray))
    brightness_pct = round((mean_brightness / 255.0) * 100.0, 1)

    if mean_brightness < 60:
        brightness_status = "Very Dark / Underexposed"
    elif mean_brightness < 95:
        brightness_status = "Low Light"
    elif mean_brightness > 195:
        brightness_status = "Overexposed / Blown Highlights"
    else:
        brightness_status = "Well Balanced"

    # 2. Contrast Indicator: Root Mean Square (RMS) Contrast
    # RMS contrast is the standard deviation of pixel intensities
    rms_contrast = float(np.std(gray))
    rms_contrast_pct = round(min(100.0, (rms_contrast / 128.0) * 100.0), 1)

    if rms_contrast < 35:
        contrast_status = "Low / Washed Out"
    elif rms_contrast < 55:
        contrast_status = "Moderate"
    else:
        contrast_status = "High Dynamic Range"

    # 3. Sharpness Estimation using Variance of the Laplacian
    # A classic, robust metric in computer vision for blur detection (Pech-Pacheco et al.)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    sharpness_score = float(laplacian.var())
    sharpness_rounded = round(sharpness_score, 1)

    if sharpness_score < 80:
        sharpness_status = "Severe Blur / Out of Focus"
    elif sharpness_score < 250:
        sharpness_status = "Slightly Blurry / Soft Edges"
    elif sharpness_score < 750:
        sharpness_status = "Acceptable Clarity"
    else:
        sharpness_status = "High Sharpness / Crisp"

    # 4. Blind Noise Estimation: Immerkaer's Fast Noise Variance Formulation
    # Uses a high-frequency Laplacian-like 3x3 kernel
    immerkaer_kernel = np.array([
        [1, -2,  1],
        [-2,  4, -2],
        [1, -2,  1]
    ], dtype=np.float64)

    filtered = cv2.filter2D(gray.astype(np.float64), -1, immerkaer_kernel)
    h, w = gray.shape
    noise_sigma = 0.0
    if h > 2 and w > 2:
        sum_abs = np.sum(np.abs(filtered[1:-1, 1:-1]))
        noise_sigma = float((np.sqrt(0.5 * np.pi) / (6.0 * (w - 2) * (h - 2))) * sum_abs)

    noise_score = round(noise_sigma, 2)
    if noise_score < 3.0:
        noise_status = "Clean / Minimal Grain"
    elif noise_score < 7.5:
        noise_status = "Moderate Sensor Grain"
    else:
        noise_status = "High Noise / Grainy"

    # 5. Detected Issues & Recommendations for Warranty Inspectors
    issues: List[str] = []
    if mean_brightness < 85:
        issues.append("Poor lighting obscuring surface details")
    elif mean_brightness > 200:
        issues.append("Excessive reflection or overexposed highlights")

    if rms_contrast < 42:
        issues.append("Low contrast makes cracks or scratches hard to discern")

    if sharpness_score < 180:
        issues.append("Blurry or soft edges prevent reading labels or micro-cracks")

    if noise_score > 6.0:
        issues.append("Digital noise artifacts mask fine material defects")

    if not issues:
        issues.append("Image has standard baseline quality")

    file_size_kb = round(file_size_bytes / 1024.0, 1) if file_size_bytes > 0 else None

    return {
        "dimensions": {
            "width": width,
            "height": height,
            "channels": channels,
            "aspect_ratio": round(width / height, 2) if height > 0 else 1.0,
            "megapixels": megapixels
        },
        "file_size_bytes": file_size_bytes,
        "file_size_kb": file_size_kb,
        "brightness": {
            "value": round(mean_brightness, 1),
            "percentage": brightness_pct,
            "status": brightness_status
        },
        "contrast": {
            "rms_value": round(rms_contrast, 1),
            "percentage": rms_contrast_pct,
            "status": contrast_status
        },
        "sharpness": {
            "score": sharpness_rounded,
            "status": sharpness_status
        },
        "noise": {
            "sigma": noise_score,
            "status": noise_status
        },
        "detected_issues": issues
    }

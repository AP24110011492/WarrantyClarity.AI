import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional

def remove_noise(image: np.ndarray, strength: float = 50.0) -> np.ndarray:
    """
    Applies edge-preserving noise reduction using OpenCV Bilateral Filtering.
    For high strength values, blends with Non-Local Means Denoising.
    """
    if strength <= 0:
        return image.copy()

    # Normalize strength between 0 and 100
    strength = max(0.0, min(100.0, float(strength)))

    # Bilateral filter parameters
    # d: Diameter of each pixel neighborhood (3 to 9)
    # sigmaColor: Filter sigma in color space (10 to 100)
    # sigmaSpace: Filter sigma in coordinate space (10 to 100)
    d = int(3 + (strength / 100.0) * 6)
    if d % 2 == 0:
        d += 1
    sigma_color = 15.0 + (strength / 100.0) * 65.0
    sigma_space = 15.0 + (strength / 100.0) * 65.0

    denoised = cv2.bilateralFilter(image, d=d, sigmaColor=sigma_color, sigmaSpace=sigma_space)

    # For heavy noise (> 65), blend with Fast Non-Local Means
    if strength > 65.0:
        h = (strength - 65.0) / 35.0 * 8.0 + 3.0
        # fastNlMeansDenoisingColored is more computationally intensive but very effective
        try:
            nlm = cv2.fastNlMeansDenoisingColored(image, None, h=h, hColor=h, templateWindowSize=7, searchWindowSize=15)
            blend_factor = (strength - 65.0) / 70.0
            denoised = cv2.addWeighted(denoised, 1.0 - blend_factor, nlm, blend_factor, 0)
        except Exception:
            pass  # Fallback to bilateral filter if NLM fails

    return denoised

def sharpen_image(image: np.ndarray, strength: float = 50.0) -> np.ndarray:
    """
    Sharpens image edges and text details using Unsharp Masking.
    Formula: Sharpened = Original + alpha * (Original - GaussianBlur)
    """
    if strength <= 0:
        return image.copy()

    strength = max(0.0, min(100.0, float(strength)))
    alpha = (strength / 100.0) * 2.0  # Weight from 0 to 2.0

    # Gaussian blur kernel size and sigma
    sigma = 1.0 + (strength / 100.0) * 1.5
    blurred = cv2.GaussianBlur(image, (0, 0), sigmaX=sigma, sigmaY=sigma)

    # Calculate unsharp mask: image + alpha * (image - blurred)
    sharpened = cv2.addWeighted(image, 1.0 + alpha, blurred, -alpha, 0)

    # For high strength, add a subtle edge boost kernel to emphasize fine serial labels
    if strength > 70.0:
        edge_kernel = np.array([
            [ 0, -0.5,  0],
            [-0.5, 3.0, -0.5],
            [ 0, -0.5,  0]
        ], dtype=np.float32)
        boosted = cv2.filter2D(sharpened, -1, edge_kernel)
        blend = (strength - 70.0) / 60.0
        sharpened = cv2.addWeighted(sharpened, 1.0 - blend, boosted, blend, 0)

    return np.clip(sharpened, 0, 255).astype(np.uint8)

def adjust_brightness(image: np.ndarray, value: float = 0.0) -> np.ndarray:
    """
    Adjusts brightness naturally. Positive values use a gamma-like curve
    to lift underexposed shadows without blowing out already bright areas.
    Value range: -100 to +100
    """
    if abs(value) < 0.5:
        return image.copy()

    value = max(-100.0, min(100.0, float(value)))

    if value > 0:
        # Non-linear shadow lifting (gamma curve)
        # gamma < 1.0 brightens shadows while compressing highlights
        gamma = 1.0 / (1.0 + (value / 100.0) * 0.9)
        inv_gamma = 1.0 / gamma
        table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype(np.uint8)
        adjusted = cv2.LUT(image, table)
        # Add slight linear offset
        linear_offset = int(value * 0.25)
        adjusted = cv2.convertScaleAbs(adjusted, alpha=1.0, beta=linear_offset)
    else:
        # Darkening
        factor = 1.0 + (value / 100.0) * 0.75
        adjusted = cv2.convertScaleAbs(image, alpha=factor, beta=int(value * 0.2))

    return adjusted

def enhance_contrast(image: np.ndarray, clip_limit: float = 2.0, tile_grid_size: Tuple[int, int] = (8, 8)) -> np.ndarray:
    """
    Enhances local contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization)
    applied exclusively to the Lightness (L) channel in LAB color space.
    This prevents color distortion and halos.
    """
    if clip_limit <= 0.5:
        return image.copy()

    # Convert BGR to LAB color space
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l_chan, a_chan, b_chan = cv2.split(lab)

    # Apply CLAHE to L-channel
    clahe = cv2.createCLAHE(clipLimit=float(clip_limit), tileGridSize=tile_grid_size)
    enhanced_l = clahe.apply(l_chan)

    # Merge channels and convert back to BGR
    merged_lab = cv2.merge((enhanced_l, a_chan, b_chan))
    enhanced_bgr = cv2.cvtColor(merged_lab, cv2.COLOR_LAB2BGR)
    return enhanced_bgr

def correct_colors(image: np.ndarray, saturation_factor: float = 1.0, auto_white_balance: bool = True) -> np.ndarray:
    """
    Performs color correction:
    1. Simple White Balance (Gray World algorithm) to neutralize yellow/blue color casts.
    2. HSV Saturation scaling to improve vividness without creating oversaturated artifacts.
    """
    result = image.copy()

    if auto_white_balance:
        # Gray World White Balance
        # Assumes the average reflectance in the scene is achromatic (gray)
        b, g, r = cv2.split(result)
        mean_b = np.mean(b) + 1e-5
        mean_g = np.mean(g) + 1e-5
        mean_r = np.mean(r) + 1e-5

        # Target gray value
        gray_mean = (mean_b + mean_g + mean_r) / 3.0

        # Scale each channel moderately (damping factor 0.6 to prevent over-correction)
        kb = 1.0 + 0.6 * ((gray_mean / mean_b) - 1.0)
        kg = 1.0 + 0.6 * ((gray_mean / mean_g) - 1.0)
        kr = 1.0 + 0.6 * ((gray_mean / mean_r) - 1.0)

        b_adj = np.clip(b.astype(np.float32) * kb, 0, 255).astype(np.uint8)
        g_adj = np.clip(g.astype(np.float32) * kg, 0, 255).astype(np.uint8)
        r_adj = np.clip(r.astype(np.float32) * kr, 0, 255).astype(np.uint8)

        result = cv2.merge((b_adj, g_adj, r_adj))

    if abs(saturation_factor - 1.0) > 0.05:
        # Adjust saturation in HSV space
        hsv = cv2.cvtColor(result, cv2.COLOR_BGR2HSV).astype(np.float32)
        h, s, v = cv2.split(hsv)
        s = np.clip(s * float(saturation_factor), 0, 255)
        hsv_adjusted = cv2.merge((h, s, v)).astype(np.uint8)
        result = cv2.cvtColor(hsv_adjusted, cv2.COLOR_HSV2BGR)

    return result

def upscale_image(image: np.ndarray, scale_factor: int = 2, method: str = "lanczos_edge_preserving") -> Tuple[np.ndarray, str]:
    """
    Resolution Enhancement / Super-Resolution module.
    Scales image by scale_factor (e.g. 2x, 4x) using high-order Lanczos-4 or Bicubic interpolation,
    combined with a directional edge-gradient sharpening pass to preserve fine lines and serial barcodes.
    Clearly specifies method used.
    """
    if scale_factor <= 1:
        return image.copy(), "Original Resolution (1x)"

    height, width = image.shape[:2]
    new_w = int(width * scale_factor)
    new_h = int(height * scale_factor)

    # Step 1: High-fidelity interpolation
    upscaled = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

    # Step 2: Edge-enhancement pass to prevent interpolation softening
    # Subtle unsharp masking calibrated specifically for upscaled pixel pitch
    gaussian = cv2.GaussianBlur(upscaled, (0, 0), sigmaX=1.2, sigmaY=1.2)
    sharpened = cv2.addWeighted(upscaled, 1.35, gaussian, -0.35, 0)
    result = np.clip(sharpened, 0, 255).astype(np.uint8)

    description = f"Lanczos-4 High-Fidelity Upscale ({scale_factor}x) with Edge Reinforcement"
    return result, description

# ==============================================================================
# PRESETS FOR WARRANTY CLAIM WORKFLOWS
# ==============================================================================

PRESETS = {
    "auto": {
        "name": "Auto Enhance",
        "description": "Balanced restoration correcting contrast, noise, and softness for standard warranty claims.",
        "params": {
            "brightness": 15,
            "contrast": 25,
            "sharpness": 45,
            "denoise": 30,
            "saturation": 10,
            "upscale": 1
        }
    },
    "low_light": {
        "name": "Low Light Correction",
        "description": "Lifts dark shadows, reveals obscured serial numbers and internal chassis defects.",
        "params": {
            "brightness": 45,
            "contrast": 35,
            "sharpness": 40,
            "denoise": 40,
            "saturation": 15,
            "upscale": 1
        }
    },
    "blurry": {
        "name": "Blurry Image Improvement",
        "description": "Aggressive unsharp masking and edge recovery for out-of-focus camera shots.",
        "params": {
            "brightness": 5,
            "contrast": 20,
            "sharpness": 80,
            "denoise": 20,
            "saturation": 5,
            "upscale": 1
        }
    },
    "noise_removal": {
        "name": "Noise Removal",
        "description": "Reduces high-ISO sensor grain while preserving text labels and crack boundaries.",
        "params": {
            "brightness": 5,
            "contrast": 15,
            "sharpness": 25,
            "denoise": 75,
            "saturation": 0,
            "upscale": 1
        }
    },
    "detail_enhancement": {
        "name": "Detail Enhancement",
        "description": "Micro-contrast boost (CLAHE) and high-boost filtering for hair-line cracks and component inspection.",
        "params": {
            "brightness": 10,
            "contrast": 50,
            "sharpness": 70,
            "denoise": 25,
            "saturation": 10,
            "upscale": 1
        }
    },
    "balanced": {
        "name": "Balanced Enhancement",
        "description": "Subtle natural enhancement maintaining authentic product appearance for claim records.",
        "params": {
            "brightness": 10,
            "contrast": 20,
            "sharpness": 35,
            "denoise": 25,
            "saturation": 5,
            "upscale": 1
        }
    }
}

def process_image(
    image: np.ndarray,
    brightness: float = 0.0,
    contrast: float = 0.0,
    sharpness: float = 0.0,
    denoise: float = 0.0,
    saturation: float = 0.0,
    upscale: int = 1,
    auto_wb: bool = True
) -> Tuple[np.ndarray, list]:
    """
    Main image processing pipeline. Applies operations in mathematically sound order:
    1. Upscale (if requested, so subsequent spatial filters work at output resolution)
    2. Denoise (smooth noise first before sharpening to prevent noise amplification)
    3. Brightness & Contrast (CLAHE and gamma curve)
    4. Color balance & Saturation
    5. Sharpening (applied last to yield crisp, noise-free edges)
    """
    processed = image.copy()
    applied_operations = []

    # 1. Upscale if scale > 1
    if upscale > 1:
        processed, desc = upscale_image(processed, scale_factor=upscale)
        applied_operations.append(f"Resolution Upscale: {upscale}x ({processed.shape[1]}x{processed.shape[0]})")

    # 2. Denoise
    if denoise > 5:
        processed = remove_noise(processed, strength=denoise)
        applied_operations.append(f"Edge-Preserving Noise Reduction (Strength: {round(denoise)}%)")

    # 3. Brightness
    if abs(brightness) > 2:
        processed = adjust_brightness(processed, value=brightness)
        applied_operations.append(f"Dynamic Brightness Adjustment ({'+' if brightness > 0 else ''}{round(brightness)})")

    # 4. Contrast
    if abs(contrast) > 2:
        # Map contrast (-100 to 100) to CLAHE clipLimit (1.0 to 4.5)
        clip_limit = 1.0 + (max(0.0, contrast) / 100.0) * 3.5
        processed = enhance_contrast(processed, clip_limit=clip_limit)
        applied_operations.append(f"Adaptive CLAHE Contrast Enhancement (Clip: {round(clip_limit, 2)})")

    # 5. Color Correction & Saturation
    sat_factor = 1.0 + (saturation / 100.0) * 0.8  # Maps -100..100 to 0.2..1.8
    if auto_wb or abs(saturation) > 2:
        processed = correct_colors(processed, saturation_factor=sat_factor, auto_white_balance=auto_wb)
        ops = []
        if auto_wb:
            ops.append("Gray-World White Balance")
        if abs(saturation) > 2:
            ops.append(f"Saturation ({'+' if saturation > 0 else ''}{round(saturation)}%)")
        applied_operations.append("Color Correction: " + ", ".join(ops))

    # 6. Sharpening
    if sharpness > 5:
        processed = sharpen_image(processed, strength=sharpness)
        applied_operations.append(f"Unsharp Masking Sharpening (Strength: {round(sharpness)}%)")

    if not applied_operations:
        applied_operations.append("Baseline Passthrough (No adjustments applied)")

    return processed, applied_operations

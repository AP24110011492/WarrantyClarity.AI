import os
import unittest
import cv2
import numpy as np
from fastapi import HTTPException, UploadFile
import io

from main import (
    app,
    health_check,
    list_samples,
    get_sample_image,
    analyze_image,
    enhance_image_endpoint,
    get_history,
    clear_history
)
from quality_analyzer import analyze_image_quality
from image_processor import (
    remove_noise,
    sharpen_image,
    adjust_brightness,
    enhance_contrast,
    correct_colors,
    upscale_image,
    process_image,
    PRESETS
)

class TestWarrantyClarityEngine(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Create test synthetic degraded image
        cls.test_img = np.zeros((300, 400, 3), dtype=np.uint8)
        cv2.putText(cls.test_img, "MODEL: TEST-1234", (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 2)
        cv2.rectangle(cls.test_img, (30, 100), (370, 200), (100, 150, 200), -1)
        
        # Add blur
        cls.blurry_img = cv2.GaussianBlur(cls.test_img, (11, 11), 3.0)
        
        # Add noise
        noise = np.random.normal(0, 25, cls.test_img.shape).astype(np.float32)
        cls.noisy_img = np.clip(cls.test_img.astype(np.float32) + noise, 0, 255).astype(np.uint8)
        
        # Real sample 2 for low contrast / dark testing
        cls.sample2_img = cv2.imread("samples/sample2_lowlight_earbuds_damage.jpg")

    def test_01_quality_analyzer_metrics(self):
        """Verify quality analyzer computes valid spatial and frequency metrics."""
        q = analyze_image_quality(self.blurry_img, 25000)
        self.assertIn("dimensions", q)
        self.assertIn("brightness", q)
        self.assertIn("contrast", q)
        self.assertIn("sharpness", q)
        self.assertIn("noise", q)
        self.assertEqual(q["dimensions"]["width"], 400)
        self.assertEqual(q["dimensions"]["height"], 300)
        self.assertGreaterEqual(q["sharpness"]["score"], 0)
        print("✓ Quality analyzer calculated dimensions, contrast, sharpness, and noise correctly.")

    def test_02_sharpening_increases_laplacian_variance(self):
        """Verify unsharp masking increases Laplacian sharpness score."""
        q_before = analyze_image_quality(self.blurry_img)
        sharpened = sharpen_image(self.blurry_img, strength=75)
        q_after = analyze_image_quality(sharpened)
        self.assertGreater(q_after["sharpness"]["score"], q_before["sharpness"]["score"])
        print(f"✓ Sharpening verified: Sharpness increased from {q_before['sharpness']['score']} to {q_after['sharpness']['score']}")

    def test_03_denoising_reduces_immerkaer_noise(self):
        """Verify bilateral filter reduces noise standard deviation."""
        q_before = analyze_image_quality(self.noisy_img)
        denoised = remove_noise(self.noisy_img, strength=80)
        q_after = analyze_image_quality(denoised)
        self.assertLess(q_after["noise"]["sigma"], q_before["noise"]["sigma"])
        print(f"✓ Denoising verified: Noise sigma reduced from {q_before['noise']['sigma']} to {q_after['noise']['sigma']}")

    def test_04_clahe_contrast_enhancement(self):
        """Verify CLAHE enhances contrast on real sample image."""
        q_before = analyze_image_quality(self.sample2_img)
        enhanced = enhance_contrast(self.sample2_img, clip_limit=3.0)
        q_after = analyze_image_quality(enhanced)
        self.assertGreater(q_after["contrast"]["rms_value"], q_before["contrast"]["rms_value"])
        print(f"✓ CLAHE verified: RMS contrast increased from {q_before['contrast']['rms_value']} to {q_after['contrast']['rms_value']}")

    def test_05_brightness_adjustment(self):
        """Verify brightness adjustment increases mean luminance."""
        brightened = adjust_brightness(self.sample2_img, value=40)
        mean_orig = float(np.mean(self.sample2_img))
        mean_adj = float(np.mean(brightened))
        self.assertGreater(mean_adj, mean_orig)
        print(f"✓ Brightness adjustment verified: Mean luminance increased from {mean_orig:.1f} to {mean_adj:.1f}")

    def test_06_upscaling(self):
        """Verify Lanczos-4 upscaling doubles dimensions."""
        upscaled, desc = upscale_image(self.test_img, scale_factor=2)
        self.assertEqual(upscaled.shape[0], 600)
        self.assertEqual(upscaled.shape[1], 800)
        self.assertIn("Lanczos-4", desc)
        print(f"✓ Resolution upscale verified: {self.test_img.shape[:2]} -> {upscaled.shape[:2]}")

    def test_07_api_health(self):
        """Test GET /api/health endpoint."""
        res = health_check()
        self.assertEqual(res["status"], "healthy")
        self.assertEqual(res["system"], "WarrantyClarity AI")
        self.assertIn("opencv", res["modules"])
        print("✓ Health endpoint returned healthy status.")

    def test_08_api_samples_catalog(self):
        """Test GET /api/samples and sample image retrieval."""
        res = list_samples()
        samples = res["samples"]
        self.assertGreaterEqual(len(samples), 4)
        
        # Test retrieving sample-1 image
        img_res = get_sample_image(samples[0]["id"])
        self.assertTrue(os.path.exists(img_res.path))
        print(f"✓ Samples catalog verified ({len(samples)} samples available).")

    def test_09_api_analyze(self):
        """Test POST /api/analyze endpoint with sample."""
        res = analyze_image(sample_id="sample-1")
        self.assertIn("analysis", res)
        self.assertIn("sharpness", res["analysis"])
        self.assertEqual(res["filename"], "sample1_blurry_serial_label.jpg")
        print("✓ API Analyze endpoint verified.")

    def test_10_api_validation_rejections(self):
        """Verify validation: reject unsupported extension, missing file, empty payload."""
        # Missing both file and sample_id
        with self.assertRaises(HTTPException) as ctx:
            analyze_image()
        self.assertEqual(ctx.exception.status_code, 400)

        # Invalid format
        fake_bad_file = UploadFile(filename="corrupt.txt", file=io.BytesIO(b"dummy text"))
        with self.assertRaises(HTTPException) as ctx:
            analyze_image(file=fake_bad_file)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Unsupported", ctx.exception.detail)

        # Empty image
        fake_empty_file = UploadFile(filename="empty.jpg", file=io.BytesIO(b""))
        with self.assertRaises(HTTPException) as ctx:
            analyze_image(file=fake_empty_file)
        self.assertEqual(ctx.exception.status_code, 400)
        print("✓ Upload validation successfully rejects invalid formats and empty payloads.")

    def test_11_api_enhance_presets_and_custom(self):
        """Test POST /api/enhance with each preset and with custom sliders."""
        for preset_name in ["auto", "low_light", "blurry", "noise_removal", "detail_enhancement", "balanced"]:
            data = enhance_image_endpoint(sample_id="sample-1", preset=preset_name)
            self.assertIn("enhanced_data_uri", data)
            self.assertTrue(data["enhanced_data_uri"].startswith("data:image/"))
            self.assertGreater(data["processing_time_ms"], 0)
            self.assertIn("before_metrics", data)
            self.assertIn("after_metrics", data)

        # Custom sliders with PNG and 2x upscale
        custom_data = enhance_image_endpoint(
            sample_id="sample-2",
            brightness=25.0,
            contrast=30.0,
            sharpness=50.0,
            denoise=40.0,
            saturation=10.0,
            upscale=2,
            output_format="png"
        )
        self.assertTrue(custom_data["enhanced_data_uri"].startswith("data:image/png;base64,"))
        self.assertEqual(custom_data["after_metrics"]["dimensions"]["width"], 1400)
        print("✓ All 6 presets and custom sliders verified with valid base64 data URIs and metrics.")

    def test_12_api_session_history(self):
        """Test session history storage and clearing."""
        hist_res = get_history()
        history = hist_res["history"]
        self.assertGreater(len(history), 0)

        # Clear history
        clear_history()
        hist_res_empty = get_history()
        self.assertEqual(len(hist_res_empty["history"]), 0)
        print("✓ Session history storage and clearing verified.")

if __name__ == "__main__":
    unittest.main()

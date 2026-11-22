# WarrantyClarity AI – Intelligent Product Photo Restoration and Enhancement System

**Academic Capstone Project &bull; B.Tech Computer Science & Engineering**  
**Specialization Domain:** Digital Image Processing (DIP) & Computer Vision  
**Target Industry:** Consumer Electronics Warranty Support & Claim Verification  

---

## 1. Executive Summary & Problem Formulation

Customer support and warranty verification teams in the consumer electronics sector routinely receive digital photographs submitted by customers filing warranty claims, damage replacements, and authenticity disputes. 

These photographs are taken on varied consumer smartphones under suboptimal conditions, frequently suffering from:
- **Macro Defocus and Motion Blur:** Camera lens focus errors when attempting to photograph tiny IMEI barcodes, MAC addresses, or serial number stickers.
- **Severe Underexposure & Deep Shadows:** Photographs taken in dim rooms obscuring hairline chassis fractures, internal stress cracks, and hinge damage.
- **High-ISO Digital Noise:** Mobile camera sensors amplifying electronic noise in low-light environments, masking hairline glass cracks and water damage indicators.
- **Low Dynamic Range & Color Distortion:** Tungsten or warm indoor incandescent lighting washing out contrast and obscuring burned electronic traces on PCBs.

These optical defects lead to:
1. High claim rejection rates or prolonged inspection delays.
2. Unnecessary physical shipping costs for units that could have been diagnosed visually.
3. Frustrated customers and increased warranty support overhead.

### The Objective
> *"To develop an intelligent, mathematically sound image enhancement system that improves the clarity, quality, brightness, sharpness, and visibility of product photographs, helping warranty support teams perform faster, more accurate visual assessments."*

---

## 2. Technology Stack

### Frontend
- **React.js 19:** Modern Single Page Application (SPA) architecture with reactive state.
- **Vite:** High-performance build tool with sub-second Hot Module Replacement (HMR).
- **Tailwind CSS 3.4:** Modern SaaS dashboard UI design system with responsive layouts.
- **Lucide React:** Consistent technical iconography.
- **Custom HTML5 Canvas & Draggable Split Slider:** Zero-latency before-and-after visual inspection divider with touch and pointer support.

### Backend
- **Python 3.14:** High-performance backend runtime.
- **FastAPI:** Asynchronous, OpenAPI-compliant REST API framework.
- **OpenCV (cv2) 5.1:** C++ optimized digital image processing and spatial filtering engine.
- **NumPy 2.5:** Matrix calculations and multi-dimensional image arrays.
- **Pillow (PIL) 13.0:** Image decoding, format conversions, and metadata inspection.
- **Uvicorn:** Production-grade ASGI server.

### Privacy & Security
- **In-Memory Session Processing:** Customer photos are processed in memory and never permanently persisted to disk without consent.
- **Upload Validation:** Strict MIME type checking (JPG, JPEG, PNG, WEBP) and payload size limit (20 MB).

---

## 3. System Architecture & Workflow

```
┌───────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 19 + Vite)                       │
│  - Home / Landing Page: Problem statement, workflow, interactive demo │
│  - Enhancement Dashboard: Drag-and-drop uploader, sample selector     │
│  - Draggable Split Comparison Slider, Side-by-Side & Flip views       │
│  - Presets & Fine-Tuning Sliders, Technical Metric Audit Report       │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │ HTTP / Multipart Form-Data
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + Uvicorn)                       │
│  - POST /api/analyze       -> Spatial & Frequency Quality Analysis   │
│  - POST /api/enhance       -> Multi-Stage OpenCV Pipeline             │
│  - GET  /api/samples       -> Pre-loaded Consumer Electronics Cases   │
│  - GET  /api/history       -> In-Memory Session History               │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │ Matrix Arrays (numpy.ndarray)
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                  OPENCV IMAGE RESTORATION PIPELINE                     │
│  1. Pre-Analysis:  Laplacian Blur (σ²) + RMS Contrast + Noise Sigma   │
│  2. Super-Res:     Lanczos-4 Sinc Interpolation (2x, 4x)              │
│  3. Denoising:     Bilateral Edge-Preserving Filter + Fast NLM        │
│  4. Dynamic Range: CIE LAB Color Space -> CLAHE on Lightness (L)      │
│  5. Brightness:    Non-Linear Gamma Shadow Lifting Curve              │
│  6. Color Balance: Gray-World Auto White Balance + HSV Saturation     │
│  7. Sharpening:    Gaussian Spatial Filter + High-Boost Unsharp Mask  │
│  8. Post-Analysis: Objective quality metric verification & JSON audit │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 4. Mathematical Foundations & Algorithms

### A. Contrast Limited Adaptive Histogram Equalization (CLAHE)
Global histogram equalization produces unnatural contrast over-amplification in uniform areas. CLAHE operates on localized rectangular tiles (e.g., $8 \times 8$). Within each tile, the histogram is clipped at limit $N_{clip}$ to restrict gradient amplification:
$$N_{clip} = \frac{M \times N}{L} \cdot \left(1 + \frac{\alpha_{clip}}{100} (S_{max} - 1)\right)$$
To eliminate color shifts, our implementation converts the BGR image to the **CIE LAB color space**, applying CLAHE strictly to the $L$ (Lightness) channel while preserving chromaticity ($A$ and $B$).

### B. Unsharp Masking (USM) Edge Sharpening
To restore defocused serial numbers and barcode edges, a high-frequency unsharp mask is generated by subtracting a Gaussian low-pass filtered representation $G_\sigma * I$ from the input image $I$:
$$I_{sharp}(x,y) = I(x,y) + \alpha \cdot \left[ I(x,y) - (G_\sigma * I)(x,y) \right]$$
Where $\alpha \in [0.2, 2.0]$ controls boost intensity and $\sigma \in [1.0, 2.5]$ controls the Gaussian kernel radius. For high sharpness demands ($> 70\%$), a secondary directional high-pass filter kernel is blended.

### C. Edge-Preserving Bilateral Filtering
Unlike Gaussian blur which smooths across edges, the bilateral filter calculates kernel weights as the product of spatial distance and radiometric (color) intensity differences:
$$I^{filtered}(x) = \frac{1}{W_p} \sum_{x_i \in \Omega} I(x_i) \exp\left(-\frac{\|x_i - x\|^2}{2\sigma_s^2}\right) \exp\left(-\frac{\|I(x_i) - I(x)\|^2}{2\sigma_r^2}\right)$$
This preserves the sharp boundaries of physical chassis fractures while eliminating high-ISO sensor grain.

### D. Objective Quality Metrics (No Fake Percentages)
1. **Laplacian Variance Blur Metric ($\sigma^2_{\nabla^2}$):**
   $$\nabla^2 I = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2}, \quad \text{Var}(\nabla^2 I) = \frac{1}{MN} \sum (L(x,y) - \bar{L})^2$$
   Images with $\sigma^2 < 80$ indicate severe blur; $\sigma^2 > 250$ indicates acceptable edge clarity.
2. **Root-Mean-Square (RMS) Contrast:** Standard deviation of pixel intensities $\sigma_{gray}$ measuring dynamic range.
3. **Immerkaer Fast Blind Noise Estimation:** Computes the standard deviation of noise $\sigma_n$ using a discrete $3 \times 3$ Laplacian mask without needing clean ground-truth reference images.

---

## 5. Project Folder Structure

```
WarrantyClarity-AI/
│
├── backend/
│   ├── main.py                 # FastAPI application, endpoints, and session management
│   ├── image_processor.py      # OpenCV restoration algorithms, presets, and filters
│   ├── quality_analyzer.py     # Laplacian blur, RMS contrast, and Immerkaer noise metrics
│   ├── generate_samples.py     # Generator script for 4 realistic warranty defect test cases
│   ├── test_system.py          # Automated verification test suite (12 unit & API tests)
│   ├── requirements.txt        # Python backend dependencies
│   ├── samples/                # Built-in degraded warranty test cases
│   │   ├── sample1_blurry_serial_label.jpg
│   │   ├── sample2_lowlight_earbuds_damage.jpg
│   │   ├── sample3_noisy_cracked_screen.jpg
│   │   └── sample4_circuit_board_burn.jpg
│   └── uploads/                # Temporary working directory for file validation
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Responsive header with live API connection indicator
│   │   │   ├── ImageUploader.jsx       # Drag-and-drop zone with built-in sample demo selector
│   │   │   ├── ComparisonSlider.jsx    # Interactive draggable split slider & view modes
│   │   │   ├── EnhancementControls.jsx # 6 presets and real-time fine-tuning sliders
│   │   │   ├── QualityReport.jsx       # Objective spatial/frequency metrics report & download
│   │   │   ├── SessionHistory.jsx      # In-memory session history cards and reload
│   │   │   └── Footer.jsx              # Academic project credentials & privacy statement
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Landing page with live scenario demo and workflow
│   │   │   ├── Dashboard.jsx           # Core image restoration inspection workspace
│   │   │   └── About.jsx               # Academic report, mathematical formulas & architecture
│   │   │
│   │   ├── services/
│   │   │   └── api.js                  # Asynchronous REST API service layer
│   │   │
│   │   ├── App.jsx                     # Root application component with client routing
│   │   ├── main.jsx                    # React 19 entry point
│   │   └── index.css                   # Tailwind CSS base and custom utilities
│   │
│   ├── index.html                      # HTML template with SEO meta and Inter font
│   ├── package.json                    # Frontend dependencies and build scripts
│   ├── vite.config.js                  # Vite configuration with API proxy to localhost:8000
│   └── tailwind.config.js              # Custom SaaS color palette and typography
│
├── start_backend.bat           # One-click Windows startup script for FastAPI
├── start_frontend.bat          # One-click Windows startup script for Vite
├── README.md                   # Complete B.Tech project documentation
└── .gitignore                  # Git ignore rules
```

---

## 6. Installation & Execution Guide

### Prerequisites
- **Python 3.10+** (verified on Python 3.14)
- **Node.js 18+** and **npm**

### Step 1: Backend Setup
```powershell
# Navigate to backend directory
cd WarrantyClarity-AI/backend

# Install backend dependencies
pip install -r requirements.txt

# (Optional) Run the automated test suite to verify OpenCV and algorithms
python test_system.py

# Start the FastAPI server on port 8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be accessible at: `http://127.0.0.1:8000`  
Swagger API Docs available at: `http://127.0.0.1:8000/docs`

### Step 2: Frontend Setup
```powershell
# Navigate to frontend directory
cd WarrantyClarity-AI/frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```
Frontend application will be accessible at: `http://localhost:5173`

---

## 7. REST API Endpoints

| Method | Endpoint | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and engine version | None | JSON with status and OpenCV version |
| `GET` | `/api/samples` | List built-in demonstration cases | None | JSON array of 4 defect cases |
| `GET` | `/api/samples/{id}/image`| Retrieve sample JPEG file | Path parameter | Raw image file |
| `POST` | `/api/analyze` | Calculate objective quality metrics | Multipart Form (`file` or `sample_id`) | JSON with resolution, brightness, RMS contrast, Laplacian sharpness, noise |
| `POST` | `/api/enhance` | Execute image restoration pipeline | Multipart Form (`file`/`sample_id`, `preset`, sliders, `upscale`, `output_format`) | Enhanced Base64 data URI, processing time (ms), before/after metrics, applied ops |
| `GET` | `/api/history` | Retrieve current session history | None | JSON array of processed items |
| `DELETE` | `/api/history` | Clear in-memory session records | None | Success confirmation |

---

## 8. Built-in Demonstration Test Cases

To facilitate faculty evaluation without requiring manual image searches, the system provides 4 pre-loaded consumer electronics defect scenarios:

1. **Blurry Serial & Barcode Label (Laptops & Mobile):** Focus error on macro barcode sticker. Restored using the *Blurry Improvement* preset (Unsharp Masking + High-Boost filtering).
2. **Low-Light Earbuds Hinge Crack (Audio & Accessories):** Broken earbud hinge photographed in dim lighting. Restored using the *Low Light Correction* preset (CLAHE + Gamma shadow lift).
3. **High-Noise Cracked Screen (Smartphones):** Severe camera sensor grain obscuring spiderweb glass fractures. Restored using the *Noise Removal* preset (Bilateral filtering + NLM).
4. **Burnt Circuit Board Component (Power Electronics):** Discolored capacitor burn obscured by tungsten yellow cast. Restored using the *Detail Enhancement* preset (LAB CLAHE + White Balance).

---

## 9. Verification & Test Results

The backend includes a comprehensive automated test suite in `backend/test_system.py`:

```
Ran 12 tests in 1.385s: OK

✓ Quality analyzer calculated dimensions, contrast, sharpness, and noise correctly.
✓ Sharpening verified: Sharpness increased from 2.4 to 7.2
✓ Denoising verified: Noise sigma reduced from 11.79 to 3.79
✓ CLAHE verified: RMS contrast increased from 4.4 to 7.7
✓ Brightness adjustment verified: Mean luminance increased from 8.0 to 11.9
✓ Resolution upscale verified: (300, 400) -> (600, 800)
✓ Health endpoint returned healthy status.
✓ Samples catalog verified (4 samples available).
✓ API Analyze endpoint verified.
✓ Upload validation successfully rejects invalid formats and empty payloads.
✓ All 6 presets and custom sliders verified with valid base64 data URIs and metrics.
✓ Session history storage and clearing verified.
```

---

## 10. Limitations & Future Work

1. **AI Super-Resolution:** The current release implements high-order Lanczos-4 interpolation with directional edge reinforcement to ensure fast execution on standard CPU hardware. Integration of PyTorch-based Real-ESRGAN or EDSR models with GPU acceleration is planned for server deployments.
2. **Automated Defect Segmentation:** Future versions will incorporate lightweight YOLOv10 / SegFormer models to automatically isolate the physical defect bounding box (e.g., crack contour or burn mark).
3. **Embedded Barcode / OCR Decoding:** Direct optical character recognition (Tesseract OCR) on the restored serial number label for automated claim database matching.

---

## 11. Academic Evaluation Information

- **Degree:** Bachelor of Technology (B.Tech)
- **Department:** Computer Science & Engineering
- **Project Domain:** Digital Image Processing, Computer Vision & Full-Stack Systems
- **System Verification Status:** Fully functional, verified end-to-end with unit test suite and production build.

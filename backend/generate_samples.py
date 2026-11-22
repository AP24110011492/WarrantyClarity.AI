import cv2
import numpy as np
import os

os.makedirs("samples", exist_ok=True)

def create_sample_1_blurry_serial():
    # Smartphone label with serial number, barcode, model info, but blurred
    img = np.full((500, 700, 3), 240, dtype=np.uint8)
    
    # Outer device chassis background
    cv2.rectangle(img, (20, 20), (680, 480), (45, 45, 48), -1)
    # Inner metallic label sticker
    cv2.rectangle(img, (60, 60), (640, 440), (220, 225, 230), -1)
    cv2.rectangle(img, (60, 60), (640, 440), (120, 125, 130), 2)
    
    # Text headers
    cv2.putText(img, "APEX DIGITAL ELECTRONICS CORP.", (80, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (30, 30, 30), 2)
    cv2.putText(img, "WARRANTY IDENTIFICATION & COMPLIANCE LABEL", (80, 135), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (80, 80, 80), 1)
    
    # Barcode simulation
    barcode_x = 80
    np.random.seed(42)
    for _ in range(48):
        w = np.random.choice([2, 4, 6])
        cv2.rectangle(img, (barcode_x, 160), (barcode_x + w, 240), (10, 10, 10), -1)
        barcode_x += w + np.random.choice([2, 4, 5])
        if barcode_x > 620:
            break
            
    # Serial numbers
    cv2.putText(img, "MODEL: APX-UltraBook-Pro 15", (80, 275), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (20, 20, 20), 2)
    cv2.putText(img, "SERIAL NO: SN-98421-E887-QC", (80, 310), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (10, 10, 80), 2)
    cv2.putText(img, "IMEI: 864920048194021", (80, 345), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (30, 30, 30), 2)
    cv2.putText(img, "WARRANTY EXPIRY: 11/2026", (80, 380), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (150, 20, 20), 2)
    cv2.putText(img, "WARNING: VOID IF SEAL IS BROKEN OR REMOVED", (80, 415), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (160, 20, 20), 1)
    
    # Add defocus blur
    blurred = cv2.GaussianBlur(img, (15, 15), 4.5)
    cv2.imwrite("samples/sample1_blurry_serial_label.jpg", blurred, [cv2.IMWRITE_JPEG_QUALITY, 85])
    print("Created sample1_blurry_serial_label.jpg")

def create_sample_2_low_light():
    # Earbuds charging case with cracked hinge, taken in very dark room
    img = np.full((500, 700, 3), 30, dtype=np.uint8)
    
    # Dark desk surface with subtle wood grain
    for y in range(0, 500, 4):
        cv2.line(img, (0, y), (700, y), (32 + (y % 6), 28, 24), 1)
        
    # Earbuds case
    cv2.ellipse(img, (350, 250), (180, 120), 15, 0, 360, (55, 58, 62), -1)
    cv2.ellipse(img, (350, 250), (180, 120), 15, 0, 360, (75, 80, 85), 3)
    
    # Hinge and lid seam
    cv2.line(img, (200, 240), (500, 270), (20, 20, 25), 4)
    
    # Physical crack on casing (jagged line)
    crack_pts = np.array([[290, 200], [310, 215], [305, 230], [330, 245], [320, 265], [345, 280]], dtype=np.int32)
    cv2.polylines(img, [crack_pts], False, (140, 140, 150), 3)
    cv2.polylines(img, [crack_pts], False, (10, 10, 15), 1)
    
    # Brand logo barely visible
    cv2.putText(img, "SONIC AUDIO PRO", (270, 230), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (65, 70, 75), 1)
    cv2.putText(img, "DAMAGE POINT: CRACKED HINGE", (240, 420), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (60, 60, 65), 1)
    
    # Strong underexposure darkening
    dark = cv2.convertScaleAbs(img, alpha=0.35, beta=-5)
    cv2.imwrite("samples/sample2_lowlight_earbuds_damage.jpg", dark, [cv2.IMWRITE_JPEG_QUALITY, 85])
    print("Created sample2_lowlight_earbuds_damage.jpg")

def create_sample_3_noisy_cracked_screen():
    # Smartphone screen with impact spider crack and severe sensor noise (high ISO)
    img = np.full((500, 700, 3), 40, dtype=np.uint8)
    
    # Phone body
    cv2.rectangle(img, (150, 30), (550, 470), (25, 25, 28), -1)
    cv2.rectangle(img, (170, 50), (530, 450), (15, 20, 30), -1)
    
    # Screen display content (battery icon, error text)
    cv2.putText(img, "SYSTEM ERROR: HARDWARE DEFECT", (190, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 80, 80), 2)
    cv2.putText(img, "TOUCH DIGITIZER UNRESPONSIVE", (190, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (160, 160, 170), 1)
    cv2.putText(img, "DEVICE ID: D-4019-X9", (190, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (120, 120, 130), 1)
    
    # Spiderweb crack lines radiating from impact center (350, 300)
    impact = (350, 300)
    cv2.circle(img, impact, 12, (240, 240, 250), -1)
    cv2.circle(img, impact, 25, (200, 200, 220), 2)
    
    crack_branches = [
        [(350, 300), (320, 250), (280, 210), (220, 180)],
        [(350, 300), (380, 240), (420, 190), (460, 150), (500, 130)],
        [(350, 300), (400, 340), (450, 380), (510, 420)],
        [(350, 300), (330, 360), (310, 410), (290, 440)],
        [(350, 300), (290, 310), (240, 330), (190, 350)],
        [(350, 300), (370, 280), (410, 270), (480, 260)]
    ]
    for branch in crack_branches:
        pts = np.array(branch, dtype=np.int32)
        cv2.polylines(img, [pts], False, (230, 235, 245), 2)
        
    # Add severe high ISO Gaussian and salt-and-pepper noise
    noise = np.random.normal(0, 28, img.shape).astype(np.float32)
    noisy = np.clip(img.astype(np.float32) + noise, 0, 255).astype(np.uint8)
    
    cv2.imwrite("samples/sample3_noisy_cracked_screen.jpg", noisy, [cv2.IMWRITE_JPEG_QUALITY, 80])
    print("Created sample3_noisy_cracked_screen.jpg")

def create_sample_4_circuit_burn():
    # Circuit board PCB with burnt capacitor, low contrast and poor color balance (yellow cast)
    img = np.full((500, 700, 3), (35, 95, 45), dtype=np.uint8) # Green PCB
    
    # Copper traces
    for i in range(12):
        y = 60 + i * 32
        cv2.line(img, (50, y), (300, y), (50, 170, 210), 3)
        cv2.line(img, (300, y), (350, y + 20), (50, 170, 210), 3)
        cv2.line(img, (350, y + 20), (650, y + 20), (50, 170, 210), 3)
        
    # IC Chip
    cv2.rectangle(img, (180, 140), (320, 260), (25, 25, 25), -1)
    cv2.putText(img, "STM32F407", (195, 195), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 2)
    cv2.putText(img, "ARM CORTEX", (205, 225), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (160, 160, 160), 1)
    
    # Burnt power capacitor at (450, 220)
    cv2.ellipse(img, (450, 220), (40, 25), 0, 0, 360, (20, 30, 40), -1)
    # Burn marks / discoloration
    cv2.circle(img, (450, 220), 65, (10, 15, 20), -1)
    cv2.circle(img, (450, 220), 45, (20, 40, 80), -1)
    cv2.putText(img, "BURN DEFECT C14", (390, 320), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (30, 30, 30), 2)
    
    # Degrade: Add heavy yellow/brown color cast (poor indoor tungsten lighting) & washed out contrast
    b, g, r = cv2.split(img.astype(np.float32))
    b = b * 0.55  # Cut blue
    r = r * 1.35  # Boost red
    g = g * 1.15  # Boost green
    cast = cv2.merge((b, g, r))
    cast = np.clip(cast, 0, 255).astype(np.uint8)
    
    # Compress dynamic range (low contrast)
    low_contrast = cv2.convertScaleAbs(cast, alpha=0.6, beta=50)
    cv2.imwrite("samples/sample4_circuit_board_burn.jpg", low_contrast, [cv2.IMWRITE_JPEG_QUALITY, 85])
    print("Created sample4_circuit_board_burn.jpg")

if __name__ == "__main__":
    create_sample_1_blurry_serial()
    create_sample_2_low_light()
    create_sample_3_noisy_cracked_screen()
    create_sample_4_circuit_burn()
    print("All 4 sample warranty defect images generated successfully!")

Add-Type -AssemblyName System.Drawing

$p1 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-1.jpg"
$img1 = [System.Drawing.Bitmap]::FromFile($p1)

# Check Orange Saree (X: 0 to 530, Y: 0 to 1024)
# Let's inspect where the model's head and body are.
# In the previous crop, we took 0, 0, 530, 1024.
# Notice the table on the left is X: 0 to ~120.
# The model's body is around X: 100 to 520, Y: 30 to 1000.
Write-Host "Orange model bounds in X: 0 to 530, Y: 0 to 1024"

# Check Ivory Saree (Top Right):
# X: 538 to 1024 (width 486), Y: 0 to 506 (height 506)
# Notice: In this photo, the model's head is at Y ~ 30, her chin is in her hand at Y ~ 150,
# her elbow is on the sofa at Y ~ 280, and her saree covers the sofa down to Y = 506.
# If we keep her at the top/center and extend the sofa/saree or frame her comfortably:
Write-Host "Ivory model size: 486 x 506"

# Check Mustard Saree (Bottom Right):
# X: 538 to 1024 (width 486), Y: 514 to 1024 (height 510)
Write-Host "Mustard model size: 486 x 510"

$img1.Dispose()

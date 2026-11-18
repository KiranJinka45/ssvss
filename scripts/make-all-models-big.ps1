Add-Type -AssemblyName System.Drawing

$p1 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-1.jpg"
$p2 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-2.jpg"

$img1 = [System.Drawing.Bitmap]::FromFile($p1)
$img2 = [System.Drawing.Bitmap]::FromFile($p2)

$targetW = 512
$targetH = 935

# High quality image saver
function Save-Jpg($bmp, $path) {
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = new-object System.Drawing.Imaging.EncoderParameters 1
    $encoderParams.Param[0] = new-object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]95)
    $bmp.Save($path, $codec, $encoderParams)
    Write-Host "Saved $path ($($bmp.Width)x$($bmp.Height))"
}

# --- 1. MODEL 4 (Rust Saree - Already Big): 512 x 935 ---
$bmp4 = new-object System.Drawing.Bitmap $targetW, $targetH
$g4 = [System.Drawing.Graphics]::FromImage($bmp4)
$g4.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$srcRect4 = new-object System.Drawing.Rectangle 0, 0, 512, 935
$dstRect = new-object System.Drawing.Rectangle 0, 0, $targetW, $targetH
$g4.DrawImage($img2, $dstRect, $srcRect4, [System.Drawing.GraphicsUnit]::Pixel)
$g4.Dispose()
Save-Jpg $bmp4 "public/images/models/model-saree-4.jpg"
$bmp4.Dispose()

# --- 2. MODEL 5 (Magenta Saree - Already Big): 512 x 935 ---
$bmp5 = new-object System.Drawing.Bitmap $targetW, $targetH
$g5 = [System.Drawing.Graphics]::FromImage($bmp5)
$g5.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$srcRect5 = new-object System.Drawing.Rectangle 512, 0, 512, 935
$g5.DrawImage($img2, $dstRect, $srcRect5, [System.Drawing.GraphicsUnit]::Pixel)
$g5.Dispose()
Save-Jpg $bmp5 "public/images/models/model-saree-5.jpg"
$bmp5.Dispose()

# --- 3. MODEL 1 (Orange Saree - Make BIG to match Models 4 & 5): 512 x 935 ---
# In Collage 1, Orange saree is in 0..530 x 0..1024.
# The model is seated. If we take from X=40, Y=10, W=480, H=880 and scale to 512x935:
# The model fills the frame, her head and body become nice and BIG like Model 4 & 5!
$bmp1 = new-object System.Drawing.Bitmap $targetW, $targetH
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$srcRect1 = new-object System.Drawing.Rectangle 30, 10, 485, 890
$g1.DrawImage($img1, $dstRect, $srcRect1, [System.Drawing.GraphicsUnit]::Pixel)
$g1.Dispose()
Save-Jpg $bmp1 "public/images/models/model-saree-1.jpg"
$bmp1.Dispose()

# --- 4. MODEL 3 (Ivory Cream Saree - Top Right of Collage 1): 512 x 935 ---
# Source is X: 538 to 1024 (W: 486), Y: 0 to 506 (H: 506).
# In this crop, the model is seated, head near top (Y ~ 20), saree reaching Y=506.
# To make her BIG like Model 4 & 5 on a 512x935 canvas:
# We scale the image so the model width is ~490-512px and height ~530px.
# She is anchored at the bottom (so saree rests on floor) or slightly lifted,
# and the studio wall color extends smoothly to the top (like a studio portrait).
$bmp3 = new-object System.Drawing.Bitmap $targetW, $targetH
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Background studio wall color: R=228, G=214, B=200
$wallBrush3 = new-object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(228, 214, 200))
$g3.FillRectangle($wallBrush3, 0, 0, $targetW, $targetH)
$wallBrush3.Dispose()

# Crop of the model: X=538, Y=0, W=486, H=506
# We scale it to W=512, H=533, positioned at bottom: Y = 935 - 533 = 402, or scaled higher:
# If scaled to W=600, H=625, positioned at X=-44, Y=310, the model is significantly BIGGER!
# Let's scale: W = 580, H = 604, X = -34, Y = (935 - 604) = 331.
# And blend the top boundary smoothly into the wall color!
$srcRect3 = new-object System.Drawing.Rectangle 538, 0, 486, 506
$dstRect3 = new-object System.Drawing.Rectangle -34, 331, 580, 604
$g3.DrawImage($img1, $dstRect3, $srcRect3, [System.Drawing.GraphicsUnit]::Pixel)

# Smooth gradient blend over the top edge of the photo (around Y=331 to 370) so there is no hard seam
for ($y = 320; $y -lt 360; $y++) {
    $alpha = [int](255 * (1.0 - ($y - 320) / 40.0))
    if ($alpha -lt 0) { $alpha = 0 }
    if ($alpha -gt 255) { $alpha = 255 }
    $fadeBrush = new-object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($alpha, 228, 214, 200))
    $g3.FillRectangle($fadeBrush, 0, $y, $targetW, 1)
    $fadeBrush.Dispose()
}

$g3.Dispose()
Save-Jpg $bmp3 "public/images/models/model-saree-3.jpg"
$bmp3.Dispose()

# --- 5. MODEL 2 (Mustard Gold Saree - Bottom Right of Collage 1): 512 x 935 ---
# Source is X: 538 to 1024 (W: 486), Y: 514 to 1024 (H: 510).
# Model is seated, head near top (Y ~ 525), saree spread across lap down to Y=1024.
# Same approach: place her anchored at bottom, scale up so model is BIG!
$bmp2 = new-object System.Drawing.Bitmap $targetW, $targetH
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Background studio wall color: R=218, G=200, B=186
$wallBrush2 = new-object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(218, 200, 186))
$g2.FillRectangle($wallBrush2, 0, 0, $targetW, $targetH)
$wallBrush2.Dispose()

# Scale model up: W = 580, H = 608, X = -34, Y = (935 - 608) = 327
$srcRect2 = new-object System.Drawing.Rectangle 538, 514, 486, 510
$dstRect2 = new-object System.Drawing.Rectangle -34, 327, 580, 608
$g2.DrawImage($img1, $dstRect2, $srcRect2, [System.Drawing.GraphicsUnit]::Pixel)

# Smooth gradient blend over the top edge (Y=315 to 355)
for ($y = 315; $y -lt 355; $y++) {
    $alpha = [int](255 * (1.0 - ($y - 315) / 40.0))
    if ($alpha -lt 0) { $alpha = 0 }
    if ($alpha -gt 255) { $alpha = 255 }
    $fadeBrush = new-object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($alpha, 218, 200, 186))
    $g2.FillRectangle($fadeBrush, 0, $y, $targetW, 1)
    $fadeBrush.Dispose()
}

$g2.Dispose()
Save-Jpg $bmp2 "public/images/models/model-saree-2.jpg"
$bmp2.Dispose()

$img1.Dispose()
$img2.Dispose()

Write-Host "All 5 models are now standardized to 512x935 (Big and Consistent)!"

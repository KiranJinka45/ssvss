Add-Type -AssemblyName System.Drawing

$p1 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-1.jpg"
$p2 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-2.jpg"

$img1 = [System.Drawing.Bitmap]::FromFile($p1)
$img2 = [System.Drawing.Bitmap]::FromFile($p2)

function Save-Clean-Crop($srcImg, $rect, $destPath) {
    $bmp = new-object System.Drawing.Bitmap $rect.Width, $rect.Height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $dstRect = new-object System.Drawing.Rectangle 0, 0, $rect.Width, $rect.Height
    $g.DrawImage($srcImg, $dstRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = new-object System.Drawing.Imaging.EncoderParameters 1
    $encoderParams.Param[0] = new-object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]95)
    
    $bmp.Save($destPath, $codec, $encoderParams)
    $bmp.Dispose()
    Write-Host "Saved Clean: $destPath ($($rect.Width)x$($rect.Height))"
}

# 1. Sunset Orange Saree (Left of Collage 1): Full height 1024
$rect1 = new-object System.Drawing.Rectangle 0, 0, 528, 1024
Save-Clean-Crop $img1 $rect1 "public/images/models/model-saree-1.jpg"

# 2. Mustard Gold & Cyan (Bottom Right of Collage 1): 490 x 512
$rect2 = new-object System.Drawing.Rectangle 534, 512, 490, 512
Save-Clean-Crop $img1 $rect2 "public/images/models/model-saree-2.jpg"

# 3. Ivory Cream & Red (Top Right of Collage 1): 490 x 506
$rect3 = new-object System.Drawing.Rectangle 534, 0, 490, 506
Save-Clean-Crop $img1 $rect3 "public/images/models/model-saree-3.jpg"

# 4. Copper Rust Saree (Left of Collage 2): 510 x 935
$rect4 = new-object System.Drawing.Rectangle 0, 0, 510, 935
Save-Clean-Crop $img2 $rect4 "public/images/models/model-saree-4.jpg"

# 5. Royal Magenta Saree (Right of Collage 2): 510 x 935
$rect5 = new-object System.Drawing.Rectangle 514, 0, 510, 935
Save-Clean-Crop $img2 $rect5 "public/images/models/model-saree-5.jpg"

$img1.Dispose()
$img2.Dispose()

Write-Host "All 5 clean model photos saved successfully without artificial grey boxes!"

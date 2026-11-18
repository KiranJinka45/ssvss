Add-Type -AssemblyName System.Drawing

$p1 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-1.jpg"
$p2 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-2.jpg"

$img1 = [System.Drawing.Bitmap]::FromFile($p1)
$img2 = [System.Drawing.Bitmap]::FromFile($p2)

# Save sample test crops to inspect
function Save-Crop($src, $rect, $name) {
    $bmp = new-object System.Drawing.Bitmap $rect.Width, $rect.Height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, (new-object System.Drawing.Rectangle 0, 0, $rect.Width, $rect.Height), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save("public/images/models/$name", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Saved $name ($($rect.Width)x$($rect.Height))"
}

# Check dimensions of the subjects
# In Collage 2 (which the user calls "the 2 big images"):
# Saree 4: 0, 0, 512, 935
# Saree 5: 512, 0, 512, 935
Write-Host "Collage 2 models are 512x935"

$img1.Dispose()
$img2.Dispose()

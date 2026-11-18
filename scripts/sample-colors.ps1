Add-Type -AssemblyName System.Drawing

$p1 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-1.jpg"
$p2 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-2.jpg"

$img1 = [System.Drawing.Bitmap]::FromFile($p1)
$img2 = [System.Drawing.Bitmap]::FromFile($p2)

# Check colors of background at various points in collage 1
# Top-right (Ivory saree): X=538 to 1024, Y=0 to 506
# Let's sample pixel colors around borders
$cTopLeft = $img1.GetPixel(550, 20)
$cTopRight = $img1.GetPixel(1000, 20)
$cBottom = $img1.GetPixel(550, 500)
Write-Host "Ivory TopLeft: R=$($cTopLeft.R), G=$($cTopLeft.G), B=$($cTopLeft.B)"
Write-Host "Ivory TopRight: R=$($cTopRight.R), G=$($cTopRight.G), B=$($cTopRight.B)"
Write-Host "Ivory Bottom: R=$($cBottom.R), G=$($cBottom.G), B=$($cBottom.B)"

# Bottom-right (Mustard saree): X=538 to 1024, Y=514 to 1024
$cMTop = $img1.GetPixel(550, 530)
$cMBottom = $img1.GetPixel(550, 1010)
Write-Host "Mustard Top: R=$($cMTop.R), G=$($cMTop.G), B=$($cMTop.B)"
Write-Host "Mustard Bottom: R=$($cMBottom.R), G=$($cMBottom.G), B=$($cMBottom.B)"

$img1.Dispose()
$img2.Dispose()

Add-Type -AssemblyName System.Drawing

$p1 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-1.jpg"
$p2 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-2.jpg"

$img1 = [System.Drawing.Bitmap]::FromFile($p1)
$img2 = [System.Drawing.Bitmap]::FromFile($p2)

# Check colors along divider lines or bounding areas
Write-Host "Collage 1 size: $($img1.Width)x$($img1.Height)"
Write-Host "Collage 2 size: $($img2.Width)x$($img2.Height)"

$img1.Dispose()
$img2.Dispose()

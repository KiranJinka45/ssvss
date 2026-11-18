Add-Type -AssemblyName System.Drawing

$p1 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-1.jpg"
$p2 = "c:\Users\Kiran\OneDrive\Desktop\ssvss\public\images\models\collage-2.jpg"

$img1 = [System.Drawing.Bitmap]::FromFile($p1)
$img2 = [System.Drawing.Bitmap]::FromFile($p2)

# Save images at standard 512x935 or similar vertical portrait
# Let's inspect the two big images from Collage 2:
# Collage 2 is 1024 x 935
# Left model (Rust): X=0 to 512, Y=0 to 935
# Right model (Magenta): X=512 to 1024, Y=0 to 935
Write-Host "Collage 2 reference: 512 wide x 935 high"

# Now let's examine Collage 1:
# Left model (Orange Saree):
# Currently X=0, Y=0, W=530, H=1024
# Let's find where the model is inside this 530x1024 area.
# In the original collage, model sits around X=100 to 530.
# If we crop X=60 to 530 (W=470), and scale/pad to 512x935:
# The model will be much larger!

$img1.Dispose()
$img2.Dispose()

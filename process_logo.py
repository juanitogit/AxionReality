from PIL import Image
import numpy as np

img = Image.open('Design-Assets/artifacts/aaru/public/logo-cube.png').convert("RGBA")
data = np.array(img)

# Cut 15px from the right to remove text remnants
w = data.shape[1]
data = data[:, :w-15, :]

# Also clean up any remaining low-saturation artifacts
for y in range(data.shape[0]):
    for x in range(data.shape[1]):
        r, g, b, a = data[y, x]
        if a == 0:
            continue
        ri, gi, bi = int(r), int(g), int(b)
        saturation = max(ri,gi,bi) - min(ri,gi,bi)
        brightness = (ri + gi + bi) / 3
        # Remove grayish remnants
        if saturation < 20 and brightness > 100:
            data[y, x, 3] = 0

# Auto-trim again
alpha = data[:,:,3]
rows = np.any(alpha > 0, axis=1)
cols = np.any(alpha > 0, axis=0)
rmin, rmax = np.where(rows)[0][[0, -1]]
cmin, cmax = np.where(cols)[0][[0, -1]]
pad = 3
rmin = max(0, rmin - pad)
rmax = min(data.shape[0], rmax + pad)
cmin = max(0, cmin - pad)
cmax = min(data.shape[1], cmax + pad)

final = Image.fromarray(data[rmin:rmax, cmin:cmax])
final.save('Design-Assets/artifacts/aaru/public/logo-cube.png')
print("Done!", final.size)

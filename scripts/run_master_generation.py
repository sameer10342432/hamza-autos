import os
import json
import hashlib
from PIL import Image

with open('scripts/master_assignments.json', 'r', encoding='utf-8') as f:
    assignments = json.load(f)

def dhash(image, hash_size=8):
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    diff = []
    for row in range(hash_size):
        for col in range(hash_size):
            pixel_left = image.getpixel((col, row))
            pixel_right = image.getpixel((col + 1, row))
            diff.append(pixel_left > pixel_right)
    decimal_value = 0
    hex_string = []
    for index, value in enumerate(diff):
        if value:
            decimal_value += 2**(index % 8)
        if (index % 8) == 7:
            hex_string.append(hex(decimal_value)[2:].rjust(2, '0'))
            decimal_value = 0
    return ''.join(hex_string)

def process_image(src_path, target_width=1200, target_height=800):
    with Image.open(src_path) as img:
        img = img.convert('RGB')
        w, h = img.size
        target_aspect = target_width / target_height
        img_aspect = w / h
        
        if img_aspect > target_aspect:
            # image is wider than target: crop width
            new_width = int(h * target_aspect)
            left = (w - new_width) // 2
            box = (left, 0, left + new_width, h)
            img = img.crop(box)
        elif img_aspect < target_aspect:
            # image is taller than target: crop height
            new_height = int(w / target_aspect)
            top = (h - new_height) // 2
            box = (0, top, w, top + new_height)
            img = img.crop(box)
            
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        return img

output_records = []

for a in assignments:
    src_path = a['src']
    rel_path = a['fileRel'] # e.g. home/motorcycle-workshop-hero.jpg
    base_rel = os.path.splitext(rel_path)[0]
    
    pub_jpg = os.path.join('public', 'assets', 'images', base_rel + '.jpg')
    pub_webp = os.path.join('public', 'assets', 'images', base_rel + '.webp')
    src_jpg = os.path.join('src', 'assets', 'images', base_rel + '.jpg')
    src_webp = os.path.join('src', 'assets', 'images', base_rel + '.webp')
    
    os.makedirs(os.path.dirname(pub_jpg), exist_ok=True)
    os.makedirs(os.path.dirname(pub_webp), exist_ok=True)
    os.makedirs(os.path.dirname(src_jpg), exist_ok=True)
    os.makedirs(os.path.dirname(src_webp), exist_ok=True)
    
    img = process_image(src_path)
    
    # Save JPG
    img.save(pub_jpg, 'JPEG', quality=85, optimize=True)
    img.save(src_jpg, 'JPEG', quality=85, optimize=True)
    
    # Save WebP
    img.save(pub_webp, 'WEBP', quality=82)
    img.save(src_webp, 'WEBP', quality=82)
    
    with open(pub_jpg, 'rb') as f:
        data = f.read()
        sha256 = hashlib.sha256(data).hexdigest()
    
    h = dhash(img)
    
    record = {
        'id': a['id'],
        'route': a['route'],
        'section': a['section'],
        'fileRel': rel_path,
        'pub_jpg': pub_jpg.replace('\\', '/'),
        'pub_webp': pub_webp.replace('\\', '/'),
        'sha256': sha256[:12],
        'sha256_full': sha256,
        'dhash': h,
        'desc': a['desc'],
        'source': a['source'],
        'license': a['license'],
        'commercial': a['commercial']
    }
    output_records.append(record)
    print(f"Processed {a['id']}: {rel_path} -> sha:{sha256[:12]}, dhash:{h}")

with open('scripts/processed_41_records.json', 'w', encoding='utf-8') as f:
    json.dump(output_records, f, indent=2)

print('Successfully processed and saved all 41 images!')

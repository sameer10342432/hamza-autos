import json
import urllib.request

with open('scripts/processed_41_records.json', 'r', encoding='utf-8') as f:
    records = json.load(f)

base_url = 'http://localhost:3000'
errors = []

for r in records:
    jpg_rel = r['pub_jpg'].replace('\\', '/').replace('public/', '')
    webp_rel = r['pub_webp'].replace('\\', '/').replace('public/', '')
    
    pub_jpg_url = f"{base_url}/{jpg_rel}"
    pub_webp_url = f"{base_url}/{webp_rel}"
    
    for url in [pub_jpg_url, pub_webp_url]:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=3) as resp:
                code = resp.getcode()
                size = len(resp.read())
                if code != 200 or size == 0:
                    errors.append((url, code, size))
        except Exception as e:
            errors.append((url, str(e)))

print(f"Tested {len(records) * 2} URLs ({len(records)} JPG + {len(records)} WebP)")
if errors:
    print(f"Encountered {len(errors)} errors:")
    for err in errors:
        print(err)
else:
    print("ALL 82 IMAGE ENDPOINTS RETURNED HTTP 200 OK WITH VALID BYTES!")

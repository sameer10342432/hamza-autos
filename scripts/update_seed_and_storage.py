import json

with open('storage/blogs.json', 'r', encoding='utf-8') as f:
    blogs = json.load(f)

for b in blogs:
    img = b.get('image', '')
    if 'blog-engine-problems' in img:
        b['imageAlt'] = 'Four-stroke motorcycle engine pistons, wrist pins, and connecting rods for bore wear inspection'
    elif 'blog-oil-change-guide' in img:
        b['imageAlt'] = 'Side-by-side comparison of dirty used motorcycle oil filter saturated with old black oil vs clean yellow filter element'
    elif 'blog-fuel-economy-tuning' in img:
        b['imageAlt'] = 'Side-by-side comparison of brand-new spark plug vs carbon-fouled rich spark plug for fuel economy tuning'

with open('storage/blogs.json', 'w', encoding='utf-8') as f:
    json.dump(blogs, f, indent=2)

print('Updated storage/blogs.json successfully!')

with open('server/seedData.ts', 'r', encoding='utf-8') as f:
    seed = f.read()

seed = seed.replace(
    'imageAlt: "Motorcycle engine rebuild and cylinder bore diagnostics in Hamza Autos workshop bay Badami Bagh"',
    'imageAlt: "Four-stroke motorcycle engine pistons, wrist pins, and connecting rods for bore wear inspection"'
)
seed = seed.replace(
    'imageAlt: "Motorcycle maintenance and engine cooling inspection at Hamza Autos Badami Bagh"',
    'imageAlt: "Side-by-side comparison of dirty used motorcycle oil filter saturated with old black oil vs clean yellow filter element"'
)
seed = seed.replace(
    'imageAlt: "Motorcycle carburetor tuning and fuel jet adjustment at Hamza Autos"',
    'imageAlt: "Side-by-side comparison of brand-new spark plug vs carbon-fouled rich spark plug for fuel economy tuning"'
)

with open('server/seedData.ts', 'w', encoding='utf-8') as f:
    f.write(seed)

print('Updated server/seedData.ts successfully!')

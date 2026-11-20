with open('src/data/businessData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update services with imageAlt
service_alts = {
    'motorcycle-engine-repair.jpg': 'Motorcycle mechanic removing cylinder head and engine block with T-wrench on commuter bike',
    'bike-tuning.jpg': 'Mechanic installing and adjusting slide carburetor on 4-stroke commuter motorcycle for optimal fuel economy',
    'motorcycle-oil-change.jpg': 'Mechanic pouring 4T motorcycle engine oil directly into engine filler opening',
    'general-bike-repair.jpg': 'Pakistani commuter motorcycle Honda CD 70 with chrome chain guard and spoked wheels',
    'motorcycle-electrical-repair.jpg': 'Digital multimeter with probe leads diagnosing motorcycle electrical battery and circuit voltage',
    'bike-wiring-repair.jpg': 'Motorcycle handlebar switchgear assembly showing headlight beam switch, turn signal selector, and wiring conduit',
    'motorcycle-brake-repair.jpg': 'Motorcycle drum brake hub cutaway showing curved brake shoes, friction lining, and actuator cam',
    'bike-clutch-repair.jpg': 'Motorcycle multi-plate wet clutch friction discs soaking in oil tray beside clutch center hub',
    'motorcycle-tyre-repair.jpg': 'Mechanic levering motorcycle tyre bead and inner tube off wheel rim using tyre levers on workshop floor',
    'bike-puncture-repair.jpg': 'Pakistani roadside motorcycle puncture repair stall with air compressor, tyre stack, and commuter bikes',
    'motorcycle-spare-parts.jpg': 'Motorcycle spare parts market display with 4-stroke engines, front fork tubes, and brake rotors',
    'bike-modification.jpg': 'Mechanic mounting heavy-duty rear luggage carrier rack frame to motorcycle chassis',
    'motorcycle-general-maintenance.jpg': 'Technician applying aerosol chain lubricant directly onto motorcycle roller drive chain and sprocket'
}

for img_file, alt_text in service_alts.items():
    # Target: image: asset("assets/images/services/" + img_file)
    target = f'image: asset("assets/images/services/{img_file}")'
    replacement = f'image: asset("assets/images/services/{img_file}"),\n    imageAlt: "{alt_text}"'
    if target in content and f'imageAlt: "{alt_text}"' not in content:
        content = content.replace(target, replacement)
        print(f'Added imageAlt for {img_file}')

# 2. Update brand ALTs
brand_alts = {
    'honda-motorcycle.jpg': 'Brand-new Atlas Honda CD 70 red motorcycle on showroom stand in Pakistan',
    'yamaha-motorcycle.jpg': 'Yamaha YBR 125 commuter motorcycle with alloy wheels and front disc brake',
    'suzuki-motorcycle.jpg': 'Suzuki GS 150 red commuter motorcycle with spoked wheels and teardrop fuel tank',
    'united-chinese-bike.jpg': 'Red 70cc Pakistani commuter motorcycle (United / clone) parked outdoors',
    'road-prince-motorcycle.jpg': 'Classic red commuter motorcycles lineup with rectangular headlights and OHV engines',
    'super-power-motorcycle.jpg': 'Blue 125cc commuter motorcycle with single-cylinder OHV engine and spoked wheels',
    'chinese-commuter-bike.jpg': 'Hundreds of Pakistani 70cc commuter motorcycles parked at Lahore Railway Station'
}

for img_file, alt_text in brand_alts.items():
    import re
    pattern = rf'(image:\s*asset\("assets/images/brands/{img_file}"\),\s*\n\s*imageAlt:\s*")[^"]+(")'
    content = re.sub(pattern, rf'\g<1>{alt_text}\g<2>', content)

# 3. Update blog ALTs
blog_alts = {
    'blog-engine-problems.jpg': 'Four-stroke motorcycle engine pistons, wrist pins, and connecting rods for bore wear inspection',
    'blog-oil-change-guide.jpg': 'Side-by-side comparison of dirty used motorcycle oil filter saturated with old black oil vs clean yellow filter element',
    'blog-fuel-economy-tuning.jpg': 'Side-by-side comparison of brand-new spark plug vs carbon-fouled rich spark plug for fuel economy tuning',
    'blog-clutch-plate-guide.jpg': 'Motorcycle clutch basket gear, inner hub, and brand new friction plates and steel discs'
}

for img_file, alt_text in blog_alts.items():
    import re
    pattern = rf'(image:\s*asset\("assets/images/blog/{img_file}"\),\s*\n\s*imageAlt:\s*")[^"]+(")'
    content = re.sub(pattern, rf'\g<1>{alt_text}\g<2>', content)

# 4. Update gallery ALTs
gal_alts = {
    'gallery-service-bay.jpg': 'Motorcycle workshop service bay with hydraulic lift platforms, motorcycle tools, and bikes under service',
    'gallery-engine-rebuild.jpg': 'Commuter motorcycle rear assembly on workshop stand showing dual shock absorbers, drum brake hub, and exhaust',
    'gallery-carburetor-tuning.jpg': 'Mikuni constant-velocity motorcycle carburetor on workbench showing choke mechanism and idle speed adjuster',
    'gallery-oil-servicing.jpg': 'Brand new spin-on motorcycle oil filter and used filter with socket removal tool beside motorcycle center stand',
    'gallery-chain-sprocket.jpg': 'Macro view of motorcycle roller drive chain links meshing with rear sprocket teeth',
    'gallery-suspension-shocks.jpg': 'Pair of dual motorcycle rear coil-over shock absorbers with reservoir canisters',
    'gallery-brake-servicing.jpg': 'Motorcycle front disc brake caliper assembly with dual pistons and ventilated rotor disc',
    'gallery-electrical-diagnostics.jpg': 'Pair of motorcycle ignition coils showing primary low-voltage wiring terminals and spark plug lead sockets'
}

for img_file, alt_text in gal_alts.items():
    import re
    pattern = rf'(image:\s*asset\("assets/images/gallery/{img_file}"\),\s*\n\s*imageAlt:\s*")[^"]+(")'
    content = re.sub(pattern, rf'\g<1>{alt_text}\g<2>', content)

with open('src/data/businessData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated src/data/businessData.ts successfully!')

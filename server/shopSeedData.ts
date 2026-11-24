/**
 * Hamza Autos - Server-Side Seed Data for Complete Motorcycle Spare Parts E-Commerce System
 * Target Market: Nationwide Pakistan (Punjab, Sindh, KPK, Balochistan, ICT, GB, AJK)
 * Database-free JSON storage in storage/
 */

import { readJsonFile, writeJsonFileAtomic } from './fileStore';
import { 
  ShopCategory, 
  ShopProduct, 
  MotorcycleModelSpec, 
  ShopShippingSettings, 
  ShopSettings 
} from '../src/types/shop';

export async function ensureInitialShopStorageFiles(): Promise<void> {
  // 1. Categories
  await readJsonFile<ShopCategory[]>('shop-categories.json', [
    {
      id: 'scat-engine-parts',
      name: 'Engine Parts',
      slug: 'engine-parts',
      description: 'Pistons, cylinder kits, valves, rings, rocker arms, and gaskets for 70cc to 150cc commuter motorcycles.',
      image: '/assets/images/services/motorcycle-engine-repair.webp',
      iconName: 'Settings2',
      sortOrder: 1,
      isActive: true,
      productCount: 3
    },
    {
      id: 'scat-clutch-parts',
      name: 'Clutch Parts',
      slug: 'clutch-parts',
      description: 'Heavy-duty clutch friction plates, steel pressure plates, springs, and clutch hub assemblies.',
      image: '/assets/images/services/bike-clutch-repair.webp',
      iconName: 'Cog',
      sortOrder: 2,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-brake-parts',
      name: 'Brake Parts',
      slug: 'brake-parts',
      description: 'High-friction asbestos-free brake shoes, disc brake pads, return springs, and brake rods.',
      image: '/assets/images/services/motorcycle-brake-repair.webp',
      iconName: 'ShieldAlert',
      sortOrder: 3,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-electrical-parts',
      name: 'Electrical Parts',
      slug: 'electrical-parts',
      description: 'CDI units, stator coils, rectifiers, ignition coils, spark plugs, and wiring harnesses.',
      image: '/assets/images/services/motorcycle-electrical-repair.webp',
      iconName: 'Zap',
      sortOrder: 4,
      isActive: true,
      productCount: 3
    },
    {
      id: 'scat-carburetor-fuel',
      name: 'Carburettor & Fuel System',
      slug: 'carburettor-fuel-system',
      description: 'Standard carburetors, rebuild jet kits, fuel petcock taps, filters, and throttle slides.',
      image: '/assets/images/services/bike-tuning.webp',
      iconName: 'Gauge',
      sortOrder: 5,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-chain-sprocket',
      name: 'Chain & Sprocket',
      slug: 'chain-sprocket',
      description: 'Heavy duty 428H roller chains, front countershaft sprockets, and rear drive sprockets.',
      image: '/assets/images/gallery/gallery-chain-sprocket.webp',
      iconName: 'CircleDot',
      sortOrder: 6,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-tyres-tubes',
      name: 'Tyres & Tubes',
      slug: 'tyres-tubes',
      description: 'Durable Pakistani road-rated tyres, puncture-resistant tubes, and rim tape for daily commuting.',
      image: '/assets/images/services/motorcycle-tyre-repair.webp',
      iconName: 'LifeBuoy',
      sortOrder: 7,
      isActive: true,
      productCount: 1
    },
    {
      id: 'scat-filters',
      name: 'Filters',
      slug: 'filters',
      description: 'Foam and paper air filter elements, in-line petrol filters, and magnetic oil strainers.',
      image: '/assets/images/about/engine-overhaul-workbench.webp',
      iconName: 'Sliders',
      sortOrder: 8,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-cables-controls',
      name: 'Cables & Controls',
      slug: 'cables-controls',
      description: 'Smooth teflon-lined clutch cables, front brake cables, throttle cables, and speedometer cables.',
      image: '/assets/images/services/bike-wiring-repair.webp',
      iconName: 'Cable',
      sortOrder: 9,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-body-parts',
      name: 'Body Parts',
      slug: 'body-parts',
      description: 'Fuel tank caps, side covers, mudguards, chain covers, footrests, and frame brackets.',
      image: '/assets/images/services/general-bike-repair.webp',
      iconName: 'Wrench',
      sortOrder: 10,
      isActive: true,
      productCount: 1
    },
    {
      id: 'scat-lights-indicators',
      name: 'Lights & Indicators',
      slug: 'lights-indicators',
      description: 'Crystal headlamps, tail lights, flexible stem indicators, LED bulbs, and flasher relays.',
      image: '/assets/images/brands/honda-motorcycle.webp',
      iconName: 'Sparkles',
      sortOrder: 11,
      isActive: true,
      productCount: 1
    },
    {
      id: 'scat-mirrors',
      name: 'Mirrors',
      slug: 'mirrors',
      description: 'Vibration-resistant chrome and black rear-view side mirrors in 8mm and 10mm thread sizes.',
      image: '/assets/images/brands/yamaha-motorcycle.webp',
      iconName: 'Navigation',
      sortOrder: 12,
      isActive: true,
      productCount: 1
    },
    {
      id: 'scat-batteries',
      name: 'Batteries',
      slug: 'batteries',
      description: 'Maintenance-free 12V dry and lead-acid batteries with high cold cranking amperes.',
      image: '/assets/images/services/motorcycle-general-maintenance.webp',
      iconName: 'Zap',
      sortOrder: 13,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-bike-accessories',
      name: 'Bike Accessories',
      slug: 'bike-accessories',
      description: 'Leg guard safety bars, seat covers, grip covers, waterproof mobile holders, and helmet locks.',
      image: '/assets/images/services/bike-modification.webp',
      iconName: 'PackageCheck',
      sortOrder: 14,
      isActive: true,
      productCount: 1
    },
    {
      id: 'scat-oils-lubricants',
      name: 'Oils & Lubricants',
      slug: 'oils-lubricants',
      description: 'Genuine 20W-50 4T mineral and semi-synthetic engine oils, chain lubes, and fork oils.',
      image: '/assets/images/services/motorcycle-oil-change.webp',
      iconName: 'Droplets',
      sortOrder: 15,
      isActive: true,
      productCount: 2
    },
    {
      id: 'scat-other-spare-parts',
      name: 'Other Spare Parts',
      slug: 'other-spare-parts',
      description: 'Wheel hub rubber dampers, wheel bearings, axle bolts, silencer packing, and miscellaneous hardware.',
      image: '/assets/images/services/motorcycle-spare-parts.webp',
      iconName: 'Cog',
      sortOrder: 16,
      isActive: true,
      productCount: 1
    }
  ]);

  // 2. Supported Motorcycle Brands & Models
  await readJsonFile<MotorcycleModelSpec[]>('shop-brands-models.json', [
    // Honda
    { id: 'bm-honda-cd70', brand: 'Honda', modelName: 'CD 70', engineCc: '70cc', popularYears: '1995 - 2026', isPopularInPakistan: true },
    { id: 'bm-honda-cg125', brand: 'Honda', modelName: 'CG 125', engineCc: '125cc', popularYears: '1990 - 2026', isPopularInPakistan: true },
    { id: 'bm-honda-cg125se', brand: 'Honda', modelName: 'CG 125 Special Edition (Self Start)', engineCc: '125cc', popularYears: '2019 - 2026', isPopularInPakistan: true },
    { id: 'bm-honda-pridor', brand: 'Honda', modelName: 'Pridor', engineCc: '100cc', popularYears: '2012 - 2026', isPopularInPakistan: true },
    { id: 'bm-honda-cb125f', brand: 'Honda', modelName: 'CB 125F', engineCc: '125cc', popularYears: '2019 - 2026', isPopularInPakistan: true },
    { id: 'bm-honda-cb150f', brand: 'Honda', modelName: 'CB 150F', engineCc: '150cc', popularYears: '2017 - 2026', isPopularInPakistan: true },
    { id: 'bm-honda-cd70dream', brand: 'Honda', modelName: 'CD 70 Dream', engineCc: '70cc', popularYears: '2014 - 2026', isPopularInPakistan: true },

    // Yamaha
    { id: 'bm-yamaha-ybr125', brand: 'Yamaha', modelName: 'YBR 125', engineCc: '125cc', popularYears: '2015 - 2026', isPopularInPakistan: true },
    { id: 'bm-yamaha-ybr125g', brand: 'Yamaha', modelName: 'YBR 125G', engineCc: '125cc', popularYears: '2016 - 2026', isPopularInPakistan: true },
    { id: 'bm-yamaha-yb125z', brand: 'Yamaha', modelName: 'YB 125Z', engineCc: '125cc', popularYears: '2017 - 2026', isPopularInPakistan: true },
    { id: 'bm-yamaha-yb125zdx', brand: 'Yamaha', modelName: 'YB 125Z-DX', engineCc: '125cc', popularYears: '2020 - 2026', isPopularInPakistan: true },

    // Suzuki
    { id: 'bm-suzuki-gd110', brand: 'Suzuki', modelName: 'GD 110 / GD 110S', engineCc: '110cc', popularYears: '2013 - 2026', isPopularInPakistan: true },
    { id: 'bm-suzuki-gs150', brand: 'Suzuki', modelName: 'GS 150 / GS 150SE', engineCc: '150cc', popularYears: '2005 - 2026', isPopularInPakistan: true },
    { id: 'bm-suzuki-gr150', brand: 'Suzuki', modelName: 'GR 150', engineCc: '150cc', popularYears: '2018 - 2026', isPopularInPakistan: true },

    // United
    { id: 'bm-united-us70', brand: 'United', modelName: 'US 70', engineCc: '70cc', popularYears: '2005 - 2026', isPopularInPakistan: true },
    { id: 'bm-united-us100', brand: 'United', modelName: 'US 100', engineCc: '100cc', popularYears: '2010 - 2026', isPopularInPakistan: true },
    { id: 'bm-united-us125', brand: 'United', modelName: 'US 125', engineCc: '125cc', popularYears: '2012 - 2026', isPopularInPakistan: true },

    // Road Prince
    { id: 'bm-rp-classic70', brand: 'Road Prince', modelName: 'Classic 70', engineCc: '70cc', popularYears: '2007 - 2026', isPopularInPakistan: true },
    { id: 'bm-rp-passion70', brand: 'Road Prince', modelName: 'Passion 70', engineCc: '70cc', popularYears: '2012 - 2026', isPopularInPakistan: true },
    { id: 'bm-rp-weego150', brand: 'Road Prince', modelName: 'Wego 150', engineCc: '150cc', popularYears: '2016 - 2026', isPopularInPakistan: false },

    // Super Power
    { id: 'bm-sp-deluxe70', brand: 'Super Power', modelName: 'SP 70 Deluxe', engineCc: '70cc', popularYears: '2008 - 2026', isPopularInPakistan: true },
    { id: 'bm-sp-aroma100', brand: 'Super Power', modelName: 'SP 100', engineCc: '100cc', popularYears: '2010 - 2026', isPopularInPakistan: true },
    { id: 'bm-sp-sp125', brand: 'Super Power', modelName: 'SP 125', engineCc: '125cc', popularYears: '2011 - 2026', isPopularInPakistan: true },

    // Hi-Speed & Chinese
    { id: 'bm-hispeed-alpha70', brand: 'Hi-Speed', modelName: 'Alpha 70', engineCc: '70cc', popularYears: '2012 - 2026', isPopularInPakistan: true },
    { id: 'bm-chin-generic70', brand: 'Other Chinese Motorcycle Brands', modelName: 'Standard 70cc Commuter Replica', engineCc: '70cc', popularYears: '2000 - 2026', isPopularInPakistan: true }
  ]);

  // 3. Realistic Verified Spare Parts Products
  await readJsonFile<ShopProduct[]>('shop-products.json', [
    // 1. Crown Lifan Standard Cylinder Bore & Piston Kit
    {
      id: 'prod-cd70-cylinder-kit',
      name: 'Crown Lifan Complete Cylinder Block & Piston Kit – 70cc',
      slug: 'crown-lifan-cylinder-block-piston-kit-70cc',
      sku: 'HA-ENG-CD70-01',
      categoryId: 'scat-engine-parts',
      categoryName: 'Engine Parts',
      brand: 'Crown Lifan',
      condition: 'New (OEM / Genuine)',
      price: 2850,
      discountedPrice: 2650,
      stockQuantity: 18,
      lowStockThreshold: 4,
      availabilityStatus: 'In Stock',
      isFeatured: true,
      isPublished: true,
      rating: 4.9,
      reviewCount: 38,
      description: 'Factory-honed standard 47mm bore cylinder barrel block paired with a precision-cast piston, wrist pin, circlips, and standard RIK-grade compression rings. Restores compression and stops white exhaust smoke immediately.',
      shortDescription: 'Standard 47mm bore cylinder barrel block and piston kit for 70cc Pakistani commuter bikes.',
      specifications: {
        'Bore Diameter': '47.0 mm (Standard Standard Size)',
        'Displacement': '72 cc',
        'Material': 'High-density cast iron liner with aluminum heat-sink fins',
        'Inclusions': 'Cylinder Block, Piston, Pin, Circlips, Ring Set, Base Gasket',
        'Country of Origin': 'Crown Lifan Joint Venture Pakistan/China'
      },
      images: [
        {
          id: 'img-cyl-1',
          url: '/assets/images/about/engine-overhaul-workbench.webp',
          alt: 'Crown Lifan Cylinder Block and Piston Kit on Hamza Autos workbench',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc', notes: 'All Euro 1 and Euro 2 models' },
        { brand: 'Honda', model: 'CD 70 Dream', engineCc: '70cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' },
        { brand: 'Other Chinese Motorcycle Brands', model: 'Standard 70cc Commuter Replica', engineCc: '70cc' }
      ],
      weightKg: 2.4,
      warrantyText: '7-Day Return / Inspection Warranty. Must be uninstalled in original packing.',
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 2. Japanese RIK Piston Rings Set (Honda CG 125)
    {
      id: 'prod-cg125-rik-rings',
      name: 'RIK Japanese Piston Rings Set – Honda CG 125 Standard (56.5mm)',
      slug: 'rik-japanese-piston-rings-set-honda-cg125-standard',
      sku: 'HA-ENG-CG125-02',
      categoryId: 'scat-engine-parts',
      categoryName: 'Engine Parts',
      brand: 'RIK Japan',
      condition: 'New (OEM / Genuine)',
      price: 1450,
      stockQuantity: 24,
      lowStockThreshold: 5,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.8,
      reviewCount: 29,
      description: 'Authentic Riken (RIK) Japanese nitride-coated top compression ring, phosphate-coated second ring, and three-piece stainless steel oil scraper set for standard 56.5mm CG125 piston.',
      shortDescription: 'Standard 56.5mm genuine Japanese replacement piston rings for CG125 overhead-valve engines.',
      specifications: {
        'Ring Size': 'Standard (STD) 56.5 mm',
        'Top Ring Coating': 'Gas-nitrided ductile iron',
        'Oil Ring Type': 'Three-piece flex-vent scraper',
        'Engine Type': 'Overhead Valve (OHV) 124cc'
      },
      images: [
        {
          id: 'img-rik-1',
          url: '/assets/images/gallery/gallery-engine-rebuild.webp',
          alt: 'Japanese RIK Piston Rings Set for Honda CG 125',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc', notes: 'Point and CDI / Euro 2 models' },
        { brand: 'Honda', model: 'CG 125 Special Edition (Self Start)', engineCc: '125cc' },
        { brand: 'United', model: 'US 125', engineCc: '125cc' }
      ],
      weightKg: 0.15,
      warrantyText: 'Original Japanese import guarantee with security hologram.',
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 3. FCC Japan Heavy-Duty 5-Friction Clutch Plate Set (Honda CG 125)
    {
      id: 'prod-cg125-fcc-clutch',
      name: 'FCC Japan Heavy-Duty 5-Piece Clutch Friction Plates – Honda CG 125',
      slug: 'fcc-japan-clutch-friction-plates-honda-cg125',
      sku: 'HA-CLU-CG125-01',
      categoryId: 'scat-clutch-parts',
      categoryName: 'Clutch Parts',
      brand: 'FCC Japan',
      condition: 'New (OEM / Genuine)',
      price: 1850,
      discountedPrice: 1690,
      stockQuantity: 15,
      lowStockThreshold: 4,
      availabilityStatus: 'In Stock',
      isFeatured: true,
      isPublished: true,
      rating: 5.0,
      reviewCount: 44,
      description: 'Genuine FCC Japan cork-rubber composite friction clutch plates. Engineered specifically for high-torque launches and stop-and-go driving without slipping or oil overheating.',
      shortDescription: 'Heavy-duty 5-piece clutch friction plate set made by FCC Japan for Honda CG125.',
      specifications: {
        'Quantity in Set': '5 Friction Discs',
        'Friction Material': 'Carbon-Kevlar blend cork composite',
        'Heat Resistance': 'Up to 260°C operating temperature'
      },
      images: [
        {
          id: 'img-clutch-1',
          url: '/assets/images/blog/blog-clutch-plate-guide.webp',
          alt: 'FCC Japan Heavy Duty Clutch Plates on Hamza Autos inspection mat',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'Honda', model: 'CG 125 Special Edition (Self Start)', engineCc: '125cc' },
        { brand: 'United', model: 'US 125', engineCc: '125cc' },
        { brand: 'Super Power', model: 'SP 125', engineCc: '125cc' }
      ],
      weightKg: 0.65,
      warrantyText: 'Guaranteed genuine FCC Japan discs.',
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 4. Crown Lifan 4-Plate Clutch Friction Kit (Honda CD 70 / United 70)
    {
      id: 'prod-cd70-crown-clutch',
      name: 'Crown Lifan 4-Piece Clutch Plate Set – 70cc Commuter Bikes',
      slug: 'crown-lifan-clutch-plate-set-70cc-commuter',
      sku: 'HA-CLU-CD70-02',
      categoryId: 'scat-clutch-parts',
      categoryName: 'Clutch Parts',
      brand: 'Crown Lifan',
      condition: 'New (High-Grade Aftermarket)',
      price: 980,
      stockQuantity: 30,
      lowStockThreshold: 6,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.7,
      reviewCount: 22,
      description: 'Reliable replacement clutch plates with anti-fade friction lining. Delivers smooth gear shifts and crisp clutch engagement for 70cc motorcycles.',
      shortDescription: 'Complete 4-plate clutch set for 70cc commuter bikes in Pakistan.',
      specifications: {
        'Pack Count': '4 Friction Plates',
        'Compatibility': 'Single overhead cam 70cc horizontal engines'
      },
      images: [
        {
          id: 'img-clutch-2',
          url: '/assets/images/services/bike-clutch-repair.webp',
          alt: 'Crown Lifan 70cc clutch plates set',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'Honda', model: 'CD 70 Dream', engineCc: '70cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 0.45,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 5. Crown Lifan Asbestos-Free Premium Brake Shoe Set
    {
      id: 'prod-cd70-brake-shoe',
      name: 'Crown Lifan Heavy-Duty Brake Shoe Set (Front / Rear) – CD 70 & CG 125',
      slug: 'crown-lifan-heavy-duty-brake-shoe-set-cd70-cg125',
      sku: 'HA-BRK-CD70-01',
      categoryId: 'scat-brake-parts',
      categoryName: 'Brake Parts',
      brand: 'Crown Lifan',
      condition: 'New (OEM / Genuine)',
      price: 620,
      discountedPrice: 550,
      stockQuantity: 42,
      lowStockThreshold: 8,
      availabilityStatus: 'In Stock',
      isFeatured: true,
      isPublished: true,
      rating: 4.9,
      reviewCount: 51,
      description: 'Semi-metallic asbestos-free drum brake shoes with heat-treated return tension springs. Delivers strong bite and zero squeaking under wet or dry road conditions in Pakistan.',
      shortDescription: 'Universal drum brake shoe pair with springs for Honda CD70, CG125, and Chinese 70cc models.',
      specifications: {
        'Friction Material': 'Semi-metallic non-asbestos friction lining',
        'Included in Box': '2 Brake Shoes + 2 Heavy Duty Coil Springs',
        'Position': 'Fits Front Drum or Rear Drum'
      },
      images: [
        {
          id: 'img-brk-1',
          url: '/assets/images/gallery/gallery-brake-servicing.webp',
          alt: 'Crown Lifan Brake Shoe Set with heavy-duty return springs',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc', notes: 'Front & Rear' },
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc', notes: 'Fits Front & Rear drum brakes' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 0.35,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 6. Front Disc Brake Pad Set (Yamaha YBR 125 / Honda CB125F)
    {
      id: 'prod-ybr-disc-pads',
      name: 'High-Friction Hydraulic Front Disc Brake Pads – Yamaha YBR 125 / CB 125F',
      slug: 'front-disc-brake-pads-yamaha-ybr-125-honda-cb125f',
      sku: 'HA-BRK-YBR-02',
      categoryId: 'scat-brake-parts',
      categoryName: 'Brake Parts',
      brand: 'Crown Lifan',
      condition: 'New (OEM / Genuine)',
      price: 850,
      stockQuantity: 19,
      lowStockThreshold: 4,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.8,
      reviewCount: 17,
      description: 'Heat-resistant sintered metallic compound disc brake pads for twin-piston and single-piston hydraulic calipers. Provides progressive stopping power and protects rotors from gouging.',
      shortDescription: 'Front hydraulic disc brake pads for Yamaha YBR 125 and Honda CB 125F.',
      specifications: {
        'Caliper Type': 'Hydraulic Twin-Piston Caliper',
        'Compound': 'Sintered Semi-Metallic'
      },
      images: [
        {
          id: 'img-brk-2',
          url: '/assets/images/services/motorcycle-brake-repair.webp',
          alt: 'Hydraulic Disc Brake Pads for Yamaha YBR 125',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Yamaha', model: 'YBR 125', engineCc: '125cc' },
        { brand: 'Yamaha', model: 'YBR 125G', engineCc: '125cc' },
        { brand: 'Honda', model: 'CB 125F', engineCc: '125cc' },
        { brand: 'Suzuki', model: 'GR 150', engineCc: '150cc' }
      ],
      weightKg: 0.28,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 7. Keihin Standard 70cc Carburetor Assembly
    {
      id: 'prod-cd70-keihin-carb',
      name: 'Keihin Japanese Standard 70cc Carburetor Assembly – Honda CD 70 / Chinese 70cc',
      slug: 'keihin-japanese-carburetor-assembly-70cc',
      sku: 'HA-CARB-CD70-01',
      categoryId: 'scat-carburetor-fuel',
      categoryName: 'Carburettor & Fuel System',
      brand: 'Keihin',
      condition: 'New (OEM / Genuine)',
      price: 2650,
      discountedPrice: 2450,
      stockQuantity: 12,
      lowStockThreshold: 3,
      availabilityStatus: 'In Stock',
      isFeatured: true,
      isPublished: true,
      rating: 4.9,
      reviewCount: 33,
      description: 'Factory pre-calibrated carburetor featuring brass main #72 and pilot #35 jets. Guaranteed smooth idle, zero cold-start hesitation, and 60+ km/L fuel efficiency.',
      shortDescription: 'Complete brand-new 70cc carburetor pre-jetted for high fuel average on Pakistani roads.',
      specifications: {
        'Intake Venturi': '16.5 mm',
        'Main Jet': '#72 Standard',
        'Choke Type': 'Manual lever 2-position choke',
        'Flange Spacing': '48 mm center-to-center'
      },
      images: [
        {
          id: 'img-carb-1',
          url: '/assets/images/about/tuning-carburetor-setup.webp',
          alt: 'Keihin standard carburetor assembly on tuning bench',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'Honda', model: 'CD 70 Dream', engineCc: '70cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 0.85,
      warrantyText: 'Tested on Hamza Autos flow bench before dispatch.',
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 8. KMC / Crown Heavy Duty 428H Drive Chain & Sprocket Set (Honda CG 125)
    {
      id: 'prod-cg125-chain-sprocket',
      name: 'Heavy Duty 428H Gold Drive Chain & Sprocket Kit (15T-38T) – Honda CG 125',
      slug: 'heavy-duty-428h-drive-chain-sprocket-kit-honda-cg125',
      sku: 'HA-CHN-CG125-01',
      categoryId: 'scat-chain-sprocket',
      categoryName: 'Chain & Sprocket',
      brand: 'Crown Lifan',
      condition: 'New (OEM / Genuine)',
      price: 2250,
      discountedPrice: 2050,
      stockQuantity: 16,
      lowStockThreshold: 4,
      availabilityStatus: 'In Stock',
      isFeatured: true,
      isPublished: true,
      rating: 4.9,
      reviewCount: 39,
      description: 'Reinforced 428H high-tensile drive chain paired with induction-hardened 15-tooth front countershaft sprocket and 38-tooth rear sprocket. Eliminates slack stretch and power loss.',
      shortDescription: 'Complete 428H high-tensile chain and hardened sprocket set for Honda CG 125.',
      specifications: {
        'Chain Pitch': '428 Heavy Duty (428H)',
        'Chain Length': '108 Links with Connecting Master Link',
        'Front Sprocket': '15 Teeth',
        'Rear Sprocket': '38 Teeth (Induction Hardened Steel)'
      },
      images: [
        {
          id: 'img-chn-1',
          url: '/assets/images/gallery/gallery-chain-sprocket.webp',
          alt: 'Heavy duty 428H chain and sprocket kit',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'Honda', model: 'CG 125 Special Edition (Self Start)', engineCc: '125cc' },
        { brand: 'United', model: 'US 125', engineCc: '125cc' }
      ],
      weightKg: 2.1,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 9. NGK Nickel Spark Plug C7HSA
    {
      id: 'prod-ngk-c7hsa-plug',
      name: 'NGK Genuine Japanese Spark Plug C7HSA – 70cc to 100cc Commuter Bikes',
      slug: 'ngk-genuine-spark-plug-c7hsa-70cc',
      sku: 'HA-ELE-NGK-C7',
      categoryId: 'scat-electrical-parts',
      categoryName: 'Electrical Parts',
      brand: 'NGK Japan',
      condition: 'New (OEM / Genuine)',
      price: 380,
      stockQuantity: 65,
      lowStockThreshold: 10,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.9,
      reviewCount: 62,
      description: 'Original NGK C7HSA spark plug with solid copper core and alumina silicate ceramic insulator. Ensures instant cold starts and uniform flame kernel development.',
      shortDescription: 'Original NGK spark plug standard heat range 7 for 70cc bikes.',
      specifications: {
        'Thread Size': '10 mm',
        'Reach': '12.7 mm (1/2")',
        'Hex Size': '16 mm (5/8")',
        'Heat Range': '7 (Cold / Medium Commuter)'
      },
      images: [
        {
          id: 'img-ngk-1',
          url: '/assets/images/blog/blog-fuel-economy-tuning.webp',
          alt: 'NGK genuine spark plug C7HSA with genuine packaging',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'Honda', model: 'CD 70 Dream', engineCc: '70cc' },
        { brand: 'Honda', model: 'Pridor', engineCc: '100cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 0.08,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 10. Osaka 12V 2.5Ah Maintenance-Free Dry Motorcycle Battery
    {
      id: 'prod-osaka-12v-battery',
      name: 'Osaka 12V 2.5Ah Sealed Maintenance-Free Dry Battery – CD 70 / CG 125',
      slug: 'osaka-12v-2-5ah-sealed-dry-battery-cd70-cg125',
      sku: 'HA-BAT-OSA-12V',
      categoryId: 'scat-batteries',
      categoryName: 'Batteries',
      brand: 'Osaka Battery',
      condition: 'New (OEM / Genuine)',
      price: 2900,
      discountedPrice: 2750,
      stockQuantity: 14,
      lowStockThreshold: 3,
      availabilityStatus: 'In Stock',
      isFeatured: true,
      isPublished: true,
      rating: 4.8,
      reviewCount: 26,
      description: 'Factory-sealed AGM maintenance-free 12V battery. No acid refilling or water maintenance required. Powers loud dual horns, LED headlights, and indicators reliably.',
      shortDescription: '12 Volt 2.5Ah dry maintenance-free motorcycle battery for Honda CD70 and CG125.',
      specifications: {
        'Voltage': '12 Volts',
        'Capacity': '2.5 Ampere-Hours (Ah)',
        'Technology': 'Absorbent Glass Mat (AGM) Sealed Dry Cell',
        'Warranty': '6-Month Official Replacement Warranty Card Included'
      },
      images: [
        {
          id: 'img-bat-1',
          url: '/assets/images/services/motorcycle-electrical-repair.webp',
          alt: 'Osaka 12V dry battery for motorcycles',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc', notes: 'All 12V CDI models' },
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 1.1,
      warrantyText: '6-Month manufacturer warranty with stamped card.',
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 11. Caltex Havoline 4T 20W-50 Engine Oil 0.7L
    {
      id: 'prod-havoline-20w50-07l',
      name: 'Caltex Havoline Super 4T 20W-50 Motorcycle Engine Oil – 0.7 Litre Pack',
      slug: 'caltex-havoline-super-4t-20w50-engine-oil-0-7l',
      sku: 'HA-OIL-HAV-07L',
      categoryId: 'scat-oils-lubricants',
      categoryName: 'Oils & Lubricants',
      brand: 'Caltex Havoline',
      condition: 'New (OEM / Genuine)',
      price: 1180,
      stockQuantity: 40,
      lowStockThreshold: 8,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 5.0,
      reviewCount: 58,
      description: '100% Genuine Caltex Havoline mineral engine oil specially formulated with Havoline Shield Technology for air-cooled 70cc engines in extreme Pakistani summer heat.',
      shortDescription: '0.7L genuine Havoline 20W-50 oil for Honda CD70 and 70cc commuter bikes.',
      specifications: {
        'Viscosity': 'SAE 20W-50',
        'Volume': '0.7 Litres (Exact sump capacity for CD 70)',
        'Standards': 'API SL / JASO MA2 Certified (Wet Clutch Compatible)'
      },
      images: [
        {
          id: 'img-oil-1',
          url: '/assets/images/services/motorcycle-oil-change.webp',
          alt: 'Caltex Havoline 4T 20W-50 Engine Oil',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'Honda', model: 'CD 70 Dream', engineCc: '70cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 0.75,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 12. Shell Advance 4T AX5 20W-50 1.0L
    {
      id: 'prod-shell-advance-1l',
      name: 'Shell Advance 4T AX5 20W-50 Premium Mineral Motorcycle Engine Oil – 1.0L',
      slug: 'shell-advance-4t-ax5-20w50-engine-oil-1l',
      sku: 'HA-OIL-SHL-1L',
      categoryId: 'scat-oils-lubricants',
      categoryName: 'Oils & Lubricants',
      brand: 'Shell Pakistan',
      condition: 'New (OEM / Genuine)',
      price: 1450,
      stockQuantity: 28,
      lowStockThreshold: 6,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.9,
      reviewCount: 31,
      description: 'Active Cleansing Technology keeps piston deposits away, provides quiet gear shifts, and protects the camshaft under high temperatures on Ring Road and intercity journeys.',
      shortDescription: '1.0 Litre Shell Advance AX5 20W-50 for Honda CG125 and Yamaha YBR125.',
      specifications: {
        'Viscosity': 'SAE 20W-50',
        'Volume': '1.0 Litre',
        'Classification': 'API SL / JASO MA'
      },
      images: [
        {
          id: 'img-oil-2',
          url: '/assets/images/blog/blog-oil-change-guide.webp',
          alt: 'Shell Advance 4T motorcycle oil bottle at Hamza Autos oil station',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'Honda', model: 'CG 125 Special Edition (Self Start)', engineCc: '125cc' },
        { brand: 'Honda', model: 'CB 125F', engineCc: '125cc' },
        { brand: 'Yamaha', model: 'YBR 125', engineCc: '125cc' },
        { brand: 'Suzuki', model: 'GS 150 / GS 150SE', engineCc: '150cc' }
      ],
      weightKg: 1.05,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 13. Servis Cheetah Heavy-Duty Rear Tyre 2.50-17 6PR
    {
      id: 'prod-servis-tyre-250',
      name: 'Servis Cheetah Heavy-Duty 6-Ply Rear Motorcycle Tyre (2.50-17)',
      slug: 'servis-cheetah-heavy-duty-rear-tyre-250-17',
      sku: 'HA-TYR-SRV-250',
      categoryId: 'scat-tyres-tubes',
      categoryName: 'Tyres & Tubes',
      brand: 'Servis Tyres Pakistan',
      condition: 'New (OEM / Genuine)',
      price: 3850,
      discountedPrice: 3600,
      stockQuantity: 11,
      lowStockThreshold: 3,
      availabilityStatus: 'In Stock',
      isFeatured: true,
      isPublished: true,
      rating: 4.8,
      reviewCount: 24,
      description: 'Rugged 6-ply rated commuter tyre with deep directional tread blocks. Provides high puncture resistance, superior grip on wet asphalt, and excellent longevity.',
      shortDescription: '2.50-17 6-ply high durability rear tyre for Honda CD 70 and Chinese 70cc bikes.',
      specifications: {
        'Size': '2.50 - 17 Inch',
        'Ply Rating': '6 Ply Rating (Heavy Load Rating)',
        'Position': 'Rear Wheel',
        'Load / Speed Index': '38P'
      },
      images: [
        {
          id: 'img-tyr-1',
          url: '/assets/images/services/motorcycle-tyre-repair.webp',
          alt: 'Servis Cheetah rear motorcycle tyre 2.50-17',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 2.7,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 14. Flexible Stem Turn Signal Indicator Set 4-Piece
    {
      id: 'prod-cg125-indicators-4pc',
      name: 'Flexible Rubber-Stem Turn Signal Indicators Set (4-Piece Front & Rear)',
      slug: 'flexible-rubber-stem-turn-signal-indicators-set-4pc',
      sku: 'HA-LGT-IND-4PC',
      categoryId: 'scat-lights-indicators',
      categoryName: 'Lights & Indicators',
      brand: 'Crown Lifan',
      condition: 'New (OEM / Genuine)',
      price: 950,
      stockQuantity: 21,
      lowStockThreshold: 4,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.7,
      reviewCount: 19,
      description: 'Amber lens indicators with flexible rubber vibration mounts that bend without snapping when brushed against in tight parking or traffic.',
      shortDescription: 'Complete 4-piece indicator set with flexible rubber stems for Honda CG125 and CD70.',
      specifications: {
        'Mounting': 'M10 Flexible Rubber Stem',
        'Bulb Type': '12V 10W Amber Bulb Included',
        'Quantity': '4 Indicators (2 Front + 2 Rear)'
      },
      images: [
        {
          id: 'img-ind-1',
          url: '/assets/images/brands/honda-motorcycle.webp',
          alt: 'Flexible stem turn signal indicators',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'United', model: 'US 125', engineCc: '125cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' }
      ],
      weightKg: 0.4,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 15. Teflon-Lined Smooth Clutch Cable Assembly
    {
      id: 'prod-cg125-clutch-cable',
      name: 'Teflon-Lined Heavy Duty Clutch Cable Assembly – Honda CG 125',
      slug: 'teflon-lined-clutch-cable-honda-cg125',
      sku: 'HA-CBL-CLU-125',
      categoryId: 'scat-cables-controls',
      categoryName: 'Cables & Controls',
      brand: 'Crown Lifan',
      condition: 'New (OEM / Genuine)',
      price: 350,
      stockQuantity: 35,
      lowStockThreshold: 6,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.8,
      reviewCount: 22,
      description: 'Multi-strand braided stainless inner wire running through an ultra-slick PTFE teflon liner. Lightens clutch lever pull by 40% and resists inner rust.',
      shortDescription: 'Low-effort teflon-lined clutch cable for Honda CG 125.',
      specifications: {
        'Inner Wire': 'High-tensile stranded stainless steel',
        'Liner': 'Frictionless Teflon tube',
        'Outer Casing': 'Weatherproof PVC sleeve'
      },
      images: [
        {
          id: 'img-cbl-1',
          url: '/assets/images/services/bike-wiring-repair.webp',
          alt: 'Teflon-lined clutch cable assembly',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'Honda', model: 'CG 125 Special Edition (Self Start)', engineCc: '125cc' },
        { brand: 'United', model: 'US 125', engineCc: '125cc' }
      ],
      weightKg: 0.2,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 16. Washable High-Flow Air Filter Element
    {
      id: 'prod-cd70-air-filter',
      name: 'Dual-Stage Washable Air Filter Element – Honda CD 70 / United 70',
      slug: 'dual-stage-washable-air-filter-cd70-united70',
      sku: 'HA-FLT-AIR-70',
      categoryId: 'scat-filters',
      categoryName: 'Filters',
      brand: 'Crown Lifan',
      condition: 'New (High-Grade Aftermarket)',
      price: 250,
      stockQuantity: 45,
      lowStockThreshold: 10,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.7,
      reviewCount: 16,
      description: 'Polyurethane dual-density foam filter that traps airborne dust from Lahore roads while maximizing airflow into the carburetor.',
      shortDescription: 'Washable high-flow replacement air filter for 70cc commuter bikes.',
      specifications: {
        'Material': 'Dual-density reticulated foam',
        'Maintenance': 'Washable with petrol or soapy water'
      },
      images: [
        {
          id: 'img-flt-1',
          url: '/assets/images/about/engine-overhaul-workbench.webp',
          alt: 'Air filter element for 70cc bikes',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'Honda', model: 'CD 70 Dream', engineCc: '70cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 0.09,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 17. Heavy-Duty Steel Engine Crash Guard / Leg Protection Bar (Honda CG 125)
    {
      id: 'prod-cg125-leg-guard',
      name: 'Heavy-Duty Tubular Steel Engine Crash Guard / Leg Protector – Honda CG 125',
      slug: 'heavy-duty-tubular-steel-engine-crash-guard-honda-cg125',
      sku: 'HA-ACC-LEG-125',
      categoryId: 'scat-bike-accessories',
      categoryName: 'Bike Accessories',
      brand: 'Hamza Autos Custom Works',
      condition: 'New (OEM / Genuine)',
      price: 1650,
      stockQuantity: 8,
      lowStockThreshold: 3,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.9,
      reviewCount: 20,
      description: 'Thick-walled 1-inch MS pipe chassis guard finished in corrosion-resistant black powder coat. Shields the cylinder head, side engine casings, and rider legs during falls.',
      shortDescription: 'Solid tubular steel engine safety guard for Honda CG125.',
      specifications: {
        'Pipe Gauge': '16-Gauge Solid Mild Steel',
        'Coating': 'Anti-Rust Gloss Black Powder Coating',
        'Hardware Included': 'High-tensile zinc plated mounting bolts and washers'
      },
      images: [
        {
          id: 'img-acc-1',
          url: '/assets/images/services/bike-modification.webp',
          alt: 'Heavy duty steel engine leg guard for CG125',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'Honda', model: 'CG 125 Special Edition (Self Start)', engineCc: '125cc' },
        { brand: 'United', model: 'US 125', engineCc: '125cc' }
      ],
      weightKg: 2.9,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    },

    // 18. Heat-Treated Wheel Hub Rubber Bush Set (4-Piece)
    {
      id: 'prod-cd70-hub-bush',
      name: 'High-Elasticity Wheel Hub Damper Rubber Bush Set (4-Piece) – CD 70 / CG 125',
      slug: 'wheel-hub-damper-rubber-bush-set-cd70-cg125',
      sku: 'HA-OTH-HUB-BUSH',
      categoryId: 'scat-other-spare-parts',
      categoryName: 'Other Spare Parts',
      brand: 'Crown Lifan',
      condition: 'New (OEM / Genuine)',
      price: 280,
      stockQuantity: 50,
      lowStockThreshold: 8,
      availabilityStatus: 'In Stock',
      isFeatured: false,
      isPublished: true,
      rating: 4.8,
      reviewCount: 15,
      description: 'Cushions the drive sprocket shock when releasing the clutch and changing gears. Eliminates rear-wheel play and jerking during acceleration.',
      shortDescription: '4-piece high durability rubber damper bushings for rear motorcycle wheel hubs.',
      specifications: {
        'Quantity': '4 Rubber Bush Dampers',
        'Material': 'High-elasticity natural rubber compound'
      },
      images: [
        {
          id: 'img-oth-1',
          url: '/assets/images/services/motorcycle-spare-parts.webp',
          alt: 'Wheel hub rubber bushings set',
          isPrimary: true
        }
      ],
      compatibleBikes: [
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'Honda', model: 'CG 125', engineCc: '125cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' },
        { brand: 'Road Prince', model: 'Classic 70', engineCc: '70cc' },
        { brand: 'Super Power', model: 'SP 70 Deluxe', engineCc: '70cc' }
      ],
      weightKg: 0.18,
      createdAt: '2026-11-20T08:00:00.000Z',
      updatedAt: '2026-11-20T08:00:00.000Z'
    }
  ]);

  // 4. Shipping Settings
  await readJsonFile<ShopShippingSettings>('shop-shipping.json', {
    defaultShippingFee: 250,
    freeShippingThreshold: 3500,
    lahoreExpressDeliveryFee: 150,
    allowedProvinces: [
      'Punjab',
      'Sindh',
      'Khyber Pakhtunkhwa',
      'Balochistan',
      'Islamabad Capital Territory',
      'Gilgit-Baltistan',
      'Azad Jammu & Kashmir'
    ],
    estimatedDeliveryText: '2 – 4 Business Days Across Pakistan via TCS / Leopards / M&P',
    courierPartners: [
      'TCS Courier',
      'Leopards Courier',
      'M&P Express',
      'Trax Logistics',
      'PostEx',
      'Call Courier',
      'Hamza Autos Express (Lahore)'
    ],
    specialCityRates: {
      'Lahore': 150,
      'Rawalpindi': 250,
      'Islamabad': 250,
      'Faisalabad': 250,
      'Multan': 250,
      'Karachi': 300,
      'Peshawar': 280,
      'Quetta': 350
    }
  });

  // 5. Shop Settings
  await readJsonFile<ShopSettings>('shop-settings.json', {
    shopName: 'Hamza Autos – Online Motorcycle Spare Parts & Accessories Pakistan',
    tagline: 'Genuine Commuter Bike Parts, Direct From Badami Bagh Lahore to Your Doorstep Nationwide',
    bannerTitle: 'Pakistan’s Trusted Motorcycle Spare Parts Store',
    bannerSubtitle: 'Genuine Engine, Brake, Clutch, Electrical Parts & Accessories for Honda, Yamaha, Suzuki, United & Road Prince. Fast Delivery & Cash on Delivery Across Pakistan.',
    supportPhone: '+92 325 1814548',
    whatsappNumber: '923251814548',
    supportEmail: 'orders@hamzaautos.com',
    currency: 'PKR',
    bankDetails: {
      bankName: 'Meezan Bank Limited (Islamic Banking)',
      accountTitle: 'Hamza Autos Spare Parts Trading',
      accountNumber: '02130105829101',
      iban: 'PK78MEZN0002130105829101',
      branchName: 'Badami Bagh Branch, Lahore',
      easypaisaNumber: '0325-1814548 (Title: Hamza Autos)',
      jazzcashNumber: '0325-1814548 (Title: Hamza Autos)'
    },
    returnPolicy: '7-day inspection return policy. Parts must be uninstalled and in original packaging with proof of purchase.',
    shippingPolicy: 'Same-day parcel dispatch for orders confirmed before 3:00 PM. Full courier tracking provided via SMS and WhatsApp.',
    lowStockThresholdDefault: 5,
    isShopActive: true
  });

  // 6. Orders (Initial empty array or seeded orders)
  await readJsonFile<any[]>('shop-orders.json', []);

  // 7. Inventory Movements
  await readJsonFile<any[]>('shop-inventory-movements.json', []);

  // 8. Payments
  await readJsonFile<any[]>('shop-payments.json', []);
}

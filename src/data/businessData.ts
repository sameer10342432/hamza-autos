import { ServiceItem, BrandItem, AreaItem, BlogPost, CustomerReview } from '../types';

export const BUSINESS_INFO = {
  name: "Hamza Autos",
  tagline: "Professional Motorcycle Repair & Maintenance Workshop",
  fullAddress: "Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore, Punjab 54000, Pakistan.",
  shortAddress: "Abu Bakar Road, Badami Bagh, Lahore",
  city: "Lahore",
  province: "Punjab",
  postalCode: "54000",
  country: "Pakistan",
  phone: "+92 325 1814548",
  phoneRaw: "+923251814548",
  whatsappNumber: "+92 325 1814548",
  whatsappRaw: "923251814548",
  operatingHours: "9:00 AM – 9:00 PM",
  operatingDays: "Monday to Sunday (Open 7 Days a Week)",
  primaryCategory: "Motorcycle Repair Shop",
  primaryLocation: "Badami Bagh, Lahore",
  landmark: "Near Ali Hajvery Marriage Hall, Abu Bakar Road",
  googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Shop+Near+Ali+Hajvery+Marriage+Hall+Abu+Bakar+Road+Badami+Bagh+Lahore",
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=Shop+Near+Ali+Hajvery+Marriage+Hall,+Abu+Bakar+Road,+Badami+Bagh,+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed"
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "engine-repair",
    slug: "motorcycle-engine-repair",
    title: "Motorcycle Engine Repair & Overhaul",
    category: "Engine & Mechanical",
    shortDescription: "Complete engine rebuilding, piston & cylinder bore work, valve clearance adjustment, and crankshaft repair.",
    fullDescription: "At Hamza Autos Badami Bagh, we provide comprehensive 4-stroke motorcycle engine diagnostics, complete overhauls, cylinder re-boring, piston ring replacement, camshaft timing calibration, and valve seat grinding. Whether your bike is producing white smoke, making metallic tapping sounds, or losing compression, our experienced mechanics restore factory compression and smooth throttle performance.",
    keyFeatures: [
      "Full engine teardown and sonic cylinder inspection",
      "Piston, piston rings, and gudgeon pin replacement",
      "Valve lapping, seal replacement, and tappet adjustment",
      "Crankshaft bearings and connecting rod rebuild",
      "High-grade oil seal and gasket replacements to eliminate leaks"
    ],
    commonSymptoms: [
      "White or blue exhaust smoke (oil burning)",
      "Severe loss of pickup and acceleration power",
      "Rattling or metallic knocking noise at idle or acceleration",
      "Engine oil level dropping quickly without visible external leaks",
      "Kick starter slipping or having zero compression resistance"
    ],
    processSteps: [
      "1. Comprehensive compression test & engine noise diagnostic",
      "2. Teardown of cylinder head, block, and crankcase",
      "3. Precision measurement of cylinder bore and valve clearance",
      "4. Replacement of worn components with verified high-grade parts",
      "5. Assembly with new OEM gaskets and torque wrench calibration",
      "6. Engine oil flushing, test run, and carburetor re-tuning"
    ],
    supportedBikes: ["Honda CD 70", "Honda CG 125", "Yamaha YBR 125", "Suzuki GS 150", "United 70", "Road Prince 70", "Chinese 70cc/100cc/125cc"],
    estimatedTime: "4 to 8 Hours (Same-day turnaround for standard 70cc/125cc jobs)",
    image: "/assets/images/services/motorcycle-engine-repair.jpg"
  },
  {
    id: "bike-tuning",
    slug: "bike-tuning",
    title: "Bike Tuning & Fuel Economy Optimization",
    category: "Performance & Tuning",
    shortDescription: "Carburetor ultrasonic cleaning, jet tuning, spark plug gap calibration, and air filter maintenance for best petrol mileage.",
    fullDescription: "Maximize your motorcycle's fuel mileage and throttle response with our professional tuning service in Badami Bagh. We deep-clean carburetor jets, balance the air-fuel mixture ratio, calibrate spark plug electrode gap, adjust valve clearances (tappets), and inspect the air intake. Ideal for combating heavy Lahore stop-and-go traffic and rising fuel expenses.",
    keyFeatures: [
      "Complete carburetor dismantling, ultrasonic cleaning, and jet tuning",
      "Air-fuel mixture screw precision adjustment",
      "Valve tappet clearance adjustment (intake & exhaust specs)",
      "Spark plug cleaning, electrode gap setting, or NGK replacement",
      "Air cleaner element cleaning / oil coating inspection"
    ],
    commonSymptoms: [
      "Low fuel average (bike consuming excess petrol)",
      "Engine bogging down or jerking during sudden acceleration",
      "Rough idling or stalling at traffic signals",
      "Hard morning starting or excessive choke dependency",
      "Black smoke from exhaust indicating rich fuel mixture"
    ],
    processSteps: [
      "1. Pre-tuning diagnostic and spark plug reading inspection",
      "2. Carburetor removal, float bowl cleaning, and jet blowing",
      "3. Intake manifold and rubber insulator vacuum leak check",
      "4. Feeler gauge calibration of intake and exhaust tappets",
      "5. Fine-tuning idle RPM and pilot fuel screw on warm engine"
    ],
    supportedBikes: ["Honda CD 70", "Honda CG 125", "Yamaha YBR 125", "Suzuki GD 110", "United 70", "All commuter bikes"],
    estimatedTime: "45 to 60 Minutes",
    image: "/assets/images/services/bike-tuning.jpg"
  },
  {
    id: "oil-change",
    slug: "bike-oil-change",
    title: "Motorcycle Engine Oil Change & Filter Service",
    category: "Routine Servicing",
    shortDescription: "High-grade 20W-50 and 10W-40 4T motorcycle lubricants, magnetic sump plug cleaning, and oil filter mesh check.",
    fullDescription: "Regular oil servicing is the lifeblood of your motorcycle engine. At Hamza Autos, we supply genuine 4-stroke motorcycle engine oils formulated specifically for hot Lahore summers and dense traffic conditions. We drain old degraded lubricant, clean the magnetic drain plug to trap metal shavings, inspect the oil strainer screen, and refill to exact manufacturer capacity.",
    keyFeatures: [
      "Genuine 4T motorcycle lubricants (20W-50, 10W-40, 20W-40 grades)",
      "Crush washer inspection and magnetic drain bolt cleaning",
      "Oil centrifugal filter / strainer mesh cleaning (where applicable)",
      "Chain slack check and lubrication included with every oil change",
      "Complimentary tyre pressure check and brake lever adjustment"
    ],
    commonSymptoms: [
      "Engine overheating quickly in standard city riding",
      "Clutch slipping or rough gear shifting feel",
      "Dark black, gritty engine oil on the dipstick",
      "More than 1,000 km to 1,500 km elapsed since previous oil service",
      "Engine sound noticeably harsher than usual"
    ],
    processSteps: [
      "1. Warm engine run for optimal particulate suspension in old oil",
      "2. Safe drain into dedicated disposal pan",
      "3. Cleaning of drain plug threads and magnetic tip",
      "4. Filling exact manufacturer oil volume with clean funnel",
      "5. Dipstick verification and oil pressure check"
    ],
    supportedBikes: ["All Honda, Yamaha, Suzuki, United, Road Prince, and Chinese 70cc-150cc motorcycles"],
    estimatedTime: "15 to 25 Minutes",
    image: "/assets/images/services/motorcycle-oil-change.jpg"
  },
  {
    id: "general-repair",
    slug: "general-bike-repair",
    title: "General Bike Repair & Troubleshooting",
    category: "General Maintenance",
    shortDescription: "Comprehensive repair for steering cone bearings, swingarm bush, suspension shocks, wheel bearings, and chains.",
    fullDescription: "Daily riding on Lahore roads puts significant stress on chassis components, suspension, and steering. Hamza Autos provides complete general motorcycle repair services including handle cone bearing replacement, front telescopic fork oil seal replacement, swingarm bush rebuilding, wheel bearing replacement, and frame vibration fixes.",
    keyFeatures: [
      "Steering handle cone bearing replacement and tight adjustment",
      "Front shock absorber oil seal replacement and fresh hydraulic fluid",
      "Rear shock bushing and swingarm pivot shaft servicing",
      "Wheel hub bearing inspection, greasing, and replacement",
      "Exhaust muffler decarbonizing and mount vibration dampening"
    ],
    commonSymptoms: [
      "Steering handle wobbling or pulling to one side",
      "Oil leaking from front fork stanchions onto front wheel",
      "Heavy thudding noises when going over speed breakers or potholes",
      "Excessive handlebar vibration at medium speeds",
      "Rear wheel alignment feeling loose or unstable in turns"
    ],
    processSteps: [
      "1. Test ride or physical chassis inspection on center stand",
      "2. Component disassembly and bearing play verification",
      "3. Replacement of fatigued bearings, bushings, or seals",
      "4. Precision reassembly with waterproof lithium grease",
      "5. Alignment check and road test"
    ],
    supportedBikes: ["All motorcycle makes & models"],
    estimatedTime: "1 to 3 Hours",
    image: "/assets/images/services/general-bike-repair.jpg"
  },
  {
    id: "electrical-repair",
    slug: "motorcycle-electrical-repair",
    title: "Motorcycle Electrical System Repair",
    category: "Electrical & Ignition",
    shortDescription: "Battery testing, alternator stator coils, regulator-rectifier (charger), self-starter motor, and ignition CDI testing.",
    fullDescription: "Electrical gremlins can leave you stranded on the road. We test and repair 12V and 6V motorcycle electrical architectures. Our technicians troubleshoot non-charging batteries, burnt stator magnet coils, faulty ignition coils, self-starter carbon brushes, horns, and brake light circuits.",
    keyFeatures: [
      "Digital multimeter battery charging rate & voltage drop analysis",
      "Alternator/magneto stator coil testing and rewinding/replacement",
      "Regulator-rectifier (RR unit) output voltage stabilization",
      "Self-starter motor disassembly, armature cleaning, and carbon brush renewal",
      "Ignition switch, CDI module, and spark plug cap resistance testing"
    ],
    commonSymptoms: [
      "Battery continuously draining or failing to hold charge overnight",
      "Headlight dimming drastically at idle or flickering randomly",
      "Self-starter clicking repeatedly or refusing to turn engine over",
      "No spark at the spark plug when kick-starting",
      "Frequent blown 10A / 15A fuses"
    ],
    processSteps: [
      "1. Multimeter baseline test of battery rest and running voltages",
      "2. Stator AC output test across yellow and white charging lines",
      "3. Rectifier DC diode verification",
      "4. Starter solenoid and motor inspection",
      "5. Final load test with headlight and indicators active"
    ],
    supportedBikes: ["Yamaha YBR 125", "Suzuki GS 150", "Honda CG 125 Special Edition", "United 100/125", "Chinese Self-Start Bikes"],
    estimatedTime: "1 to 2 Hours",
    image: "/assets/images/services/motorcycle-electrical-repair.jpg"
  },
  {
    id: "wiring-repair",
    slug: "bike-wiring-repair",
    title: "Bike Wiring Repair & Complete Harness Replacement",
    category: "Electrical & Ignition",
    shortDescription: "Fixing melted wires, short circuits, indicator blinkers, headlight relays, and complete main harness renewal.",
    fullDescription: "Exposed, spliced, or corroded wiring is a frequent cause of electrical cutouts, battery drain, and fire hazards. In Badami Bagh, Hamza Autos provides neat wiring harness repairs, waterproof soldered connections, heat-shrink insulation, high-output headlight relay installations, and complete main wiring loom replacements.",
    keyFeatures: [
      "Full motorcycle main wiring harness inspection and rewiring",
      "Heat-shrink tubing and protective sleeve bundling",
      "Headlight heavy-duty relay installation for brighter night illumination",
      "Turn signal flasher relay repair and hazard light wiring",
      "Elimination of parasitic battery draws and burnt earth grounds"
    ],
    commonSymptoms: [
      "Smell of burning plastic wire insulation near fuel tank or battery",
      "Indicators staying solid on instead of blinking",
      "Headlight cutting off when handlebar is turned to full lock",
      "Horn sounding muffled or cutting out with indicators active",
      "Engine cutting out unexpectedly over bumpy roads"
    ],
    processSteps: [
      "1. Removal of side covers, fuel tank, and headlight shell",
      "2. Visual and continuity inspection of wire bundles and grounding points",
      "3. Repairing oxidized terminals and broken copper strands",
      "4. Clean routing away from hot engine fins and pinch points",
      "5. Functional circuit verification and road vibration test"
    ],
    supportedBikes: ["All Honda, Yamaha, Suzuki, United, and Chinese motorcycles"],
    estimatedTime: "1 to 3 Hours",
    image: "/assets/images/services/bike-wiring-repair.jpg"
  },
  {
    id: "brake-repair",
    slug: "motorcycle-brake-repair",
    title: "Motorcycle Brake Repair & Shoe/Pad Replacement",
    category: "Brakes & Safety",
    shortDescription: "Front disc brake caliper bleeding, brake pad fitting, rear drum shoe replacement, and brake cable lubrication.",
    fullDescription: "Your motorcycle's braking system is vital for safety on congested Lahore streets. Hamza Autos provides front hydraulic disc brake servicing, DOT 3/DOT 4 fluid flushing, caliper piston cleaning, master cylinder rebuilds, and rear drum brake shoe replacement with high-friction asbestos-free linings.",
    keyFeatures: [
      "Front hydraulic disc brake pad inspection and replacement",
      "Brake fluid bleeding, bubble removal, and reservoir flush",
      "Rear drum brake shoe replacement and drum lining de-glazing",
      "Brake cam lubrication and return spring replacement",
      "Brake lever and pedal free-play adjustment to official safety specs"
    ],
    commonSymptoms: [
      "High-pitched squealing or metal-on-metal grinding when braking",
      "Spongy front brake lever requiring excessive travel to engage",
      "Rear brake pedal depressing too deep before stopping the wheel",
      "Brake binding or wheel feeling stiff to rotate when released",
      "Brake fluid leaking around caliper seals or master cylinder glass"
    ],
    processSteps: [
      "1. Wheel and brake assembly teardown",
      "2. Measurement of disc rotor thickness or drum internal wear",
      "3. Cleaning of brake dust and de-glazing with emery cloth",
      "4. Fitting fresh high-friction brake pads/shoes",
      "5. Pedal/lever play calibration and emergency stop road test"
    ],
    supportedBikes: ["Honda CG 125", "Yamaha YBR 125 (Disc)", "Suzuki GS 150", "Honda CD 70", "United 70"],
    estimatedTime: "30 to 50 Minutes",
    image: "/assets/images/services/motorcycle-brake-repair.jpg"
  },
  {
    id: "clutch-repair",
    slug: "bike-clutch-repair",
    title: "Bike Clutch Repair & Friction Plate Overhaul",
    category: "Transmission & Clutch",
    shortDescription: "Clutch friction plate and steel separator plate renewal, clutch hub spring replacement, and cable adjustment.",
    fullDescription: "Clutch slippage wastes fuel and ruins engine pickup, especially when riding with a passenger or carrying luggage in Badami Bagh. At Hamza Autos, we replace burnt clutch friction plates, steel plates, clutch springs, release bearings, and clutch actuation cables to restore crisp gear changes and instant power transfer.",
    keyFeatures: [
      "Replacement of worn clutch friction discs with oil-soaked OEM spec plates",
      "Inspection of clutch housing basket fingers for notch grooves",
      "Pressure plate spring tension measurement and replacement",
      "Clutch release bearing and pushrod inspection",
      "Clutch cable replacement and friction-free teflon lubrication"
    ],
    commonSymptoms: [
      "Engine revs up loudly without proportional increase in bike speed",
      "Hard or clunky gear shifting, especially into neutral at a stop",
      "Bike jerking or creeping forward when clutch lever is fully pulled in",
      "Stiff clutch lever causing severe wrist fatigue in traffic",
      "Burning oil smell after riding uphill or carrying heavy loads"
    ],
    processSteps: [
      "1. Clutch cover removal and old oil collection",
      "2. Disassembly of clutch springs, pressure plate, and hub",
      "3. Soaking new friction plates in fresh engine oil for 15 minutes",
      "4. Reassembly with balanced spring torque",
      "5. Clutch cable free-play adjustment and lever pull test"
    ],
    supportedBikes: ["Honda CG 125", "Honda CD 70", "Yamaha YBR 125", "Suzuki GS 150", "United / Road Prince"],
    estimatedTime: "1 to 2 Hours",
    image: "/assets/images/services/bike-clutch-repair.jpg"
  },
  {
    id: "tyre-repair",
    slug: "motorcycle-tyre-repair",
    title: "Motorcycle Tyre Repair, Fitting & Wheel Alignment",
    category: "Wheels & Tyres",
    shortDescription: "Motorcycle tyre replacement, rim spoke truing, wheel balancing, tube fitting, and rim corrosion cleaning.",
    fullDescription: "Potholes and debris around Badami Bagh and Timber Market can warp wheel rims and puncture tyres. We provide professional tyre fitting, tube replacements, spoke wheel truing (wheel alignment), rim bead rust removal, and tubeless tyre plug repairs.",
    keyFeatures: [
      "Professional tyre dismounting without scratching rim lips",
      "Spoke wheel tensioning and wobble truing on alignment stand",
      "High-grade replacement inner tubes (Panther, Servis, Diamond)",
      "Rim tape / flap replacement to protect tubes against spoke nipples",
      "Tubeless tyre bead seating and leak testing"
    ],
    commonSymptoms: [
      "Motorcycle handle wobbling noticeably at 40-60 km/h",
      "Tyre losing air pressure every 2 to 3 days",
      "Cracks, tread balding, or canvas threads visible on tyre surface",
      "Spokes loose, bent, or broken",
      "Uneven tyre wear on one side of the tread"
    ],
    processSteps: [
      "1. Wheel removal from swingarm / fork dropouts",
      "2. Tyre dismounting and internal tube / casing inspection",
      "3. Spoke tensioning and rim truing on balancing jig",
      "4. New tyre / tube installation with protective rim strip",
      "5. Inflation to recommended PSI and wheel axle alignment"
    ],
    supportedBikes: ["All 17-inch, 18-inch commuter and utility motorcycle wheels"],
    estimatedTime: "30 to 45 Minutes",
    image: "/assets/images/services/motorcycle-tyre-repair.jpg"
  },
  {
    id: "puncture-repair",
    slug: "bike-puncture-repair",
    title: "Bike Puncture Repair & Emergency Tube Service",
    category: "Wheels & Tyres",
    shortDescription: "Quick hot-vulcanized puncture patching, tubeless puncture plugs, valve stem core replacement, and rapid roadside assistance.",
    fullDescription: "Stranded with a flat tyre near Badami Bagh, Abu Bakar Road, or Lorry Adda? Hamza Autos offers fast, durable puncture repairs. We use vulcanizing hot patches that fuse permanently with the tube rubber, rather than cheap cold stickers that peel in summer heat.",
    keyFeatures: [
      "Hot vulcanizing patch process for permanent tube bond",
      "Tubeless tyre mushroom plug / strip repair",
      "Thorough tyre interior check for embedded nails, wire, or glass",
      "Valve core and valve stem rubber seal renewal",
      "Accurate calibrated tyre pressure inflation (front 28 PSI / rear 32-35 PSI)"
    ],
    commonSymptoms: [
      "Sudden flat tyre while riding",
      "Bike handling feeling heavy, sluggish, and wandering",
      "Tyre rim touching the asphalt",
      "Slow pressure loss over 24-48 hours",
      "Torn valve stem neck from under-inflated riding"
    ],
    processSteps: [
      "1. Rapid wheel bead breaking and tube extraction",
      "2. Water immersion tank leak detection",
      "3. Tube surface buffing and heat vulcanization application",
      "4. Inside tyre carcass sweep for hidden wire shards",
      "5. Reinstallation and high-pressure seal check"
    ],
    supportedBikes: ["All motorcycle makes & models"],
    estimatedTime: "15 to 20 Minutes",
    image: "/assets/images/services/bike-puncture-repair.jpg"
  },
  {
    id: "spare-parts",
    slug: "motorcycle-spare-parts",
    title: "Motorcycle Spare Parts Replacement & Fitting",
    category: "Parts & Replacement",
    shortDescription: "Fitting genuine OEM and reliable aftermarket drive chains, sprockets, cables, spark plugs, filters, and bulbs.",
    fullDescription: "Hamza Autos installs reliable spare parts for all popular Pakistani motorcycles. We supply drive chain & sprocket sets, genuine throttle & clutch cables, NGK spark plugs, oil filters, brake shoes, headlamp bulbs, and mirrors. We verify component fitment to ensure safety and long service life.",
    keyFeatures: [
      "Heavy-duty drive chain and sprocket sets (428H specifications)",
      "Smooth teflon-lined control cables (accelerator, clutch, front brake)",
      "Original NGK / Denso spark plugs properly gapped for your bike",
      "High-clarity rearview mirrors and vibration-resistant indicators",
      "Quality gaskets, seals, and stainless steel chassis fasteners"
    ],
    commonSymptoms: [
      "Drive chain making clicking sound or running off sprockets",
      "Sprocket teeth hooked, shark-toothed, or chipped",
      "Frayed cable strands threatening sudden snapped cable",
      "Melted or blackened spark plug electrode",
      "Loose or cracked chain cover making vibrating noises"
    ],
    processSteps: [
      "1. Identification of correct part specifications for bike brand/model",
      "2. Removal of worn part and inspection of mating surfaces",
      "3. Installation using correct torque specifications",
      "4. Lubrication of moving linkages and pivot points",
      "5. Functional check and customer inspection"
    ],
    supportedBikes: ["Honda CD 70, CG 125", "Yamaha YBR", "Suzuki GS 150", "United", "Road Prince"],
    estimatedTime: "30 to 60 Minutes",
    image: "/assets/images/services/motorcycle-spare-parts.jpg"
  },
  {
    id: "bike-modification",
    slug: "bike-modification",
    title: "Bike Customization, Accessories & Ergonomic Fitting",
    category: "Custom & Accessories",
    shortDescription: "Fitting touring luggage racks, crash guards, LED auxiliary fog lights, seat cushioning, and handlebar risers.",
    fullDescription: "Enhance your daily commute or highway touring capability. Hamza Autos fits sturdy safety crash guards (leg guards), rear luggage carrier racks for delivery riders and commuters, auxiliary LED fog lights with dedicated relays and switches, handlebar grip dampeners, and ergonomic seat foam adjustments.",
    keyFeatures: [
      "Heavy-duty engine crash guard / leg guard installation",
      "Rear delivery box carrier racks and saddlebag stays",
      "High-power auxiliary LED fog lights with waterproof handle switches",
      "Custom comfortable handlebars and vibration damper bar-ends",
      "Horn upgrade relays (dual horn installations)"
    ],
    commonSymptoms: [
      "Lack of cargo space for daily work or delivery packages",
      "Stock headlight insufficient for dimly lit suburban roads",
      "Back and wrist fatigue from stock handlebar angle",
      "Need for engine and body protection in case of low-speed drops",
      "Stock horn not loud enough for heavy commercial traffic"
    ],
    processSteps: [
      "1. Customer consultation regarding usage (commuting, touring, delivery)",
      "2. Fitting assessment without drilling or compromising structural frame",
      "3. Secure mounting with lock nuts and rubber anti-vibration bushings",
      "4. Electrical wiring through dedicated fuse and relay lines",
      "5. Final alignment and stability check"
    ],
    supportedBikes: ["Honda CG 125", "Yamaha YBR 125G", "Suzuki GS 150", "Honda CD 70", "United 70"],
    estimatedTime: "1 to 2 Hours",
    image: "/assets/images/services/bike-modification.jpg"
  },
  {
    id: "general-maintenance",
    slug: "motorcycle-general-maintenance",
    title: "Motorcycle General Maintenance & 25-Point Inspection",
    category: "General Maintenance",
    shortDescription: "Full periodic service: bolt torque check, chain cleaning & lubing, filter cleaning, brake adjustment, and safety audit.",
    fullDescription: "Prevent expensive breakdowns with our comprehensive 25-point motorcycle maintenance package in Badami Bagh. Designed for motorcycles that cover daily mileage, this service covers engine tuning, oil inspection, chain slack and alignment, battery test, brake adjustment, cable lubrication, and fastener tightening.",
    keyFeatures: [
      "Complete 25-point bumper-to-bumper mechanical inspection",
      "Drive chain wash, tension adjustment, and high-temp lube",
      "Carburetor air intake cleaning and idle speed calibration",
      "Brake lever, pedal free-play, and stoplight switch adjustment",
      "Battery terminals cleaned and dielectric grease applied",
      "All chassis and engine mounting bolts torqued to prevent vibration"
    ],
    commonSymptoms: [
      "Bike hasn't had a full service in over 3,000 km or 3 months",
      "Unusual squeaks, rattles, or loose feel when riding",
      "Decreased throttle smoothness and sluggish acceleration",
      "Chain rattling against the chain cover over bumps",
      "Preparing for a long highway trip or daily delivery shifts"
    ],
    processSteps: [
      "1. Initial visual inspection and test ride check",
      "2. 25-point systematic safety and mechanical inspection",
      "3. Adjustments and lubrication of all cables, chains, and pivots",
      "4. Air filter cleaning and spark plug check",
      "5. Final road test and maintenance checklist report"
    ],
    supportedBikes: ["All motorcycle makes and models"],
    estimatedTime: "1 to 1.5 Hours",
    image: "/assets/images/services/motorcycle-general-maintenance.jpg"
  }
];

export const BRANDS_LIST: BrandItem[] = [
  {
    id: "honda",
    slug: "honda-motorcycle-repair",
    name: "Honda",
    image: "/assets/images/brands/honda-motorcycle.jpg",
    imageAlt: "Honda CD 70 and CG 125 Motorcycle Repair in Badami Bagh Lahore",
    popularModels: ["CD 70", "CD 70 Dream", "Pridor 100", "CG 125", "CG 125 Special Edition", "CB 150F"],
    overview: "Honda is the most popular motorcycle brand in Pakistan, renowned for bulletproof engine reliability and easy parts availability. At Hamza Autos Badami Bagh, we provide specialized repairs for both the overhead camshaft (OHC) CD 70 series and the pushrod OHV CG 125 engines.",
    commonServices: [
      "CG 125 tappet sound elimination & camshaft timing",
      "CD 70 carburetor tuning for maximum fuel average (55-65 km/l)",
      "CG 125 clutch plate & pressure plate overhaul",
      "Front fork oil seal and handle cone bearing repair",
      "Genuine Atlas Honda spec oil servicing and filters"
    ],
    maintenanceTips: [
      "Change engine oil strictly every 1,000 to 1,200 km for Honda CD 70 to protect the wet clutch and cylinder wall.",
      "Check CG 125 valve clearance regularly with a feeler gauge to prevent top-end tapping noise.",
      "Keep drive chain slack within 20-30 mm to prevent premature sprocket wear."
    ]
  },
  {
    id: "yamaha",
    slug: "yamaha-motorcycle-repair",
    name: "Yamaha",
    image: "/assets/images/brands/yamaha-motorcycle.jpg",
    imageAlt: "Yamaha YBR 125 Service and Maintenance in Badami Bagh Lahore",
    popularModels: ["YBR 125", "YBR 125G", "YB 125Z", "YB 125Z-DX"],
    overview: "Yamaha YBR series motorcycles feature modern single-cylinder SOHC engines, electric start, front hydraulic disc brakes, and comfortable suspension. We carry out precision repairs, disc brake bleeding, self-starter servicing, and carburetor tuning for all Yamaha models.",
    commonServices: [
      "YBR 125 front hydraulic disc brake caliper overhaul & pad replacement",
      "Mikuni / vacuum carburetor cleaning and diaphragm inspection",
      "Self-starter motor carbon brush replacement and starter clutch check",
      "Rear monoshock / dual shock inspection and swingarm greasing",
      "Electrical wiring and LED instrument cluster troubleshooting"
    ],
    maintenanceTips: [
      "Use recommended 10W-40 or 20W-40 4T motorcycle oil to ensure smooth gear shifting in YBR transmissions.",
      "Never spray pressurized water directly at the carburetor vacuum diaphragm or electrical relays.",
      "Check front disc brake fluid level every 3 months through the inspection sight glass."
    ]
  },
  {
    id: "suzuki",
    slug: "suzuki-motorcycle-repair",
    name: "Suzuki",
    image: "/assets/images/brands/suzuki-motorcycle.jpg",
    imageAlt: "Suzuki GS 150 and GD 110S Motorcycle Workshop Lahore",
    popularModels: ["GS 150", "GS 150 SE", "GD 110S", "GR 150"],
    overview: "Suzuki motorcycles are favored for their powerful 150cc engines and smooth highway cruising. Hamza Autos provides expert engine overhaul, 5-speed transmission repair, electrical stator replacement, and tuning for Suzuki GS 150 and GD 110S models.",
    commonServices: [
      "GS 150 complete engine overhaul and 5-speed gearbox repair",
      "GD 110S carburetor tuning and air-intake valve calibration",
      "Self-start system, battery charging stator, and rectifier repair",
      "Clutch hub replacement and heavy-duty spring installation",
      "Exhaust gasket replacement and engine vibration dampening"
    ],
    maintenanceTips: [
      "Suzuki GS 150 engines run warmer than 70cc bikes; inspect oil level every 500 km.",
      "Ensure the GD 110S air cleaner element is cleaned frequently due to Lahore dust conditions.",
      "Maintain proper spark plug heat range to avoid cylinder detonation."
    ]
  },
  {
    id: "united",
    slug: "united-bike-repair",
    name: "United",
    image: "/assets/images/brands/united-chinese-bike.jpg",
    imageAlt: "United 70cc and 125cc Motorcycle Repair in Badami Bagh",
    popularModels: ["US 70", "US 100", "US 125", "United Alpha 100"],
    overview: "United Auto Industries is one of Pakistan's highest-volume motorcycle manufacturers. Hamza Autos provides cost-effective, durable mechanical and electrical repairs for all United 70cc, 100cc, and 125cc motorcycles.",
    commonServices: [
      "Economy carburetor tuning to maximize fuel mileage",
      "Drive chain and sprocket replacement with heavy-duty 428 chain",
      "Handle cone bearing replacement to remove front-end play",
      "Wiring harness repairs and headlight illumination fixes",
      "Piston ring replacement and smoke elimination"
    ],
    maintenanceTips: [
      "Tighten chassis and engine foundation bolts every 2,000 km to prevent vibration fatigue.",
      "Service the carburetor every 3,000 km to clear fine silt common in local petrol supplies.",
      "Regularly grease wheel bearings and brake pivots."
    ]
  },
  {
    id: "road-prince",
    slug: "road-prince-bike-repair",
    name: "Road Prince",
    image: "/assets/images/brands/united-chinese-bike.jpg",
    imageAlt: "Road Prince Commuter Motorcycle Maintenance Badami Bagh",
    popularModels: ["RP 70 Passion", "RP 70 Passion Plus", "RP 110", "Robinson 150", "Wego 150"],
    overview: "Road Prince offers affordable commuter and sporty bikes across Punjab. Our Badami Bagh workshop services all Road Prince models with quality replacement parts, clutch repairs, and suspension tuning.",
    commonServices: [
      "RP 70 engine overhaul and cylinder rebore",
      "Clutch friction plate renewal for enhanced pulling power",
      "Front and rear shock absorber oiling and seal replacement",
      "Brake shoe adjustments and drum de-glazing",
      "Complete electrical circuit inspection"
    ],
    maintenanceTips: [
      "Keep engine oil fresh with 20W-50 oil every 1,000 km.",
      "Inspect spoke tension after riding through unpaved or potholed roads.",
      "Ensure the fuel petcock filter mesh is kept clear of fuel sediment."
    ]
  },
  {
    id: "super-power",
    slug: "super-power-motorcycle-repair",
    name: "Super Power",
    image: "/assets/images/brands/united-chinese-bike.jpg",
    imageAlt: "Super Power 70cc Motorcycle Workshop Badami Bagh",
    popularModels: ["SP 70", "SP 100", "SP 125", "Leo 200", "Archi 150"],
    overview: "Super Power motorcycles are popular commuter vehicles across Pakistan. Hamza Autos handles all mechanical tuning, brake servicing, engine overhauls, and general maintenance for Super Power bikes.",
    commonServices: [
      "Carburetor air-fuel calibration and jet cleaning",
      "Engine oil servicing and magnetic sump plug maintenance",
      "Clutch cable replacement and clutch adjustment",
      "Self-starter motor troubleshooting and wiring",
      "Tyre replacement and wheel bearing greasing"
    ],
    maintenanceTips: [
      "Change engine oil on schedule to keep gear changes smooth.",
      "Regularly inspect brake shoes for safe stopping power.",
      "Check battery water levels in conventional lead-acid batteries."
    ]
  },
  {
    id: "chinese-bikes",
    slug: "chinese-bike-repair",
    name: "Chinese Motorcycles",
    image: "/assets/images/brands/united-chinese-bike.jpg",
    imageAlt: "Chinese 70cc and 100cc Commuter Motorcycle Servicing Badami Bagh",
    popularModels: ["Crown 70", "Metro 70", "Unique 70", "Super Star 70", "Hi-Speed 70", "Ravi 70", "Eagle 70"],
    overview: "Hundreds of thousands of riders in Lahore rely on 70cc and 100cc Chinese-platform motorcycles for daily work. Hamza Autos understands these engines inside out, delivering fast, affordable, and durable repairs without high dealer markups.",
    commonServices: [
      "Fast same-day engine overhauls and piston replacement",
      "Carburetor tuning for 60+ km/l fuel economy",
      "Elimination of excessive frame and handle vibration",
      "Wiring fixes, ignition switch changes, and indicator repair",
      "Durable puncture repair and tyre replacement"
    ],
    maintenanceTips: [
      "Do not delay oil changes beyond 1,000 km to prevent premature cylinder bore wear.",
      "Keep chain adjusted to prevent chain slipping or jamming in the chain case.",
      "Have tappets adjusted if the engine sounds excessively clattery when warmed up."
    ]
  }
];

export const AREAS_LIST: AreaItem[] = [
  {
    id: "badami-bagh",
    slug: "bike-mechanic-badami-bagh-lahore",
    name: "Badami Bagh, Lahore",
    distanceFromBadamiBagh: "0 km (Workshop Location)",
    estimatedDriveTime: "2-5 Minutes within Badami Bagh",
    bestRouteDescription: "Located on Abu Bakar Road, right near Ali Hajvery Marriage Hall, accessible easily from Lorry Adda, Circular Road, and Timber Market.",
    localIntro: "Hamza Autos is proudly established in Badami Bagh, serving local residents, business owners, goods transport operators, and daily commuters with reliable, honest motorcycle repair services.",
    commuterContext: "Badami Bagh is Lahore's bustling commercial and transport hub. Thousands of motorcycles navigate Abu Bakar Road, General Bus Stand (Lorry Adda), and Auto Market daily. We keep these bikes running in peak condition.",
    landmarks: ["Ali Hajvery Marriage Hall", "Abu Bakar Road", "Lorry Adda Badami Bagh", "Badami Bagh Railway Station", "Iron & Timber Market"]
  },
  {
    id: "shadbagh",
    slug: "bike-repair-near-shadbagh-lahore",
    name: "Shadbagh, Lahore",
    distanceFromBadamiBagh: "Approx. 2.5 km",
    estimatedDriveTime: "7-10 Minutes",
    bestRouteDescription: "Take Shadbagh Main Road / Tajpura Road directly connecting towards Badami Bagh, turning onto Abu Bakar Road near Ali Hajvery Marriage Hall.",
    localIntro: "Riders in Shadbagh frequently visit Hamza Autos for dependable motorcycle repair, engine overhauls, and tuning because of our quick 10-minute proximity and honest pricing.",
    commuterContext: "Shadbagh residents commuting daily towards the Walled City, Circular Road, or Lower Mall rely on quick, dependable bike maintenance without long workshop delays.",
    landmarks: ["Gol Bagh Shadbagh", "Tajpura Chowk", "Shadbagh Main Market", "Chah Miran Road"]
  },
  {
    id: "misri-shah",
    slug: "motorcycle-repair-near-misri-shah",
    name: "Misri Shah, Lahore",
    distanceFromBadamiBagh: "Approx. 2.0 km",
    estimatedDriveTime: "5-8 Minutes",
    bestRouteDescription: "Travel west along Circular Road / Badami Bagh Railway crossing straight onto Abu Bakar Road.",
    localIntro: "Misri Shah's commercial hardware and metal market workers depend heavily on utility bikes like Honda CD 70 and CG 125 for heavy daily carrying. Hamza Autos provides the sturdy mechanical care they need.",
    commuterContext: "Due to heavy cargo transport and bumpy market lanes, bikes in Misri Shah experience higher clutch and suspension wear. Our workshop provides heavy-duty replacements.",
    landmarks: ["Misri Shah Iron Market", "Nawaz Sharif Hospital Misri Shah", "Circular Road Junction"]
  },
  {
    id: "ravi-road",
    slug: "bike-mechanic-near-ravi-road-lahore",
    name: "Ravi Road, Lahore",
    distanceFromBadamiBagh: "Approx. 2.8 km",
    estimatedDriveTime: "8-12 Minutes",
    bestRouteDescription: "Head east from Ravi Road towards Timber Market and join Abu Bakar Road directly to Ali Hajvery Marriage Hall.",
    localIntro: "Whether traveling to or from Shahdara or Ravi Road toll points, Hamza Autos is conveniently positioned right off the primary northern entrance corridors of Lahore.",
    commuterContext: "Ravi Road sees heavy intercity commuter traffic. We assist riders facing engine overheating, flat tyres, or electrical problems near the northern gateway.",
    landmarks: ["Ravi Road Timber Market", "Timber Market Gate", "Old Ravi Bridge approach", "Taxali Gate route"]
  },
  {
    id: "azadi-chowk",
    slug: "bike-mechanic-near-azadi-chowk",
    name: "Azadi Chowk & Minar-e-Pakistan",
    distanceFromBadamiBagh: "Approx. 3.5 km",
    estimatedDriveTime: "10-14 Minutes",
    bestRouteDescription: "From Azadi Chowk Flyover, head along Circular Road towards Badami Bagh / Lorry Adda entrance, turning onto Abu Bakar Road.",
    localIntro: "Located just minutes from landmark Azadi Chowk and Greater Iqbal Park, Hamza Autos provides quick emergency bike repairs and scheduled servicing for northern Lahore riders.",
    commuterContext: "Azadi Chowk is one of Lahore's busiest traffic intersections. Stop-and-go congestion stresses clutch plates and causes engine heat; our tuning helps bikes stay cool.",
    landmarks: ["Minar-e-Pakistan", "Azadi Chowk Flyover", "Badshahi Mosque route", "Greater Iqbal Park"]
  },
  {
    id: "timber-market",
    slug: "bike-repair-near-timber-market",
    name: "Timber Market, Lahore",
    distanceFromBadamiBagh: "Approx. 1.0 km",
    estimatedDriveTime: "3-5 Minutes",
    bestRouteDescription: "Immediate neighboring commercial area; proceed directly along Ravi Link Road onto Abu Bakar Road.",
    localIntro: "Timber Market business owners and motorcycle delivery runners are among our most loyal daily customers, enjoying same-day oil servicing, tyre puncture repairs, and brake work.",
    commuterContext: "Heavy dust and timber debris make air filter cleaning, tyre puncture checks, and chain lubrication essential for bikes operating around Timber Market.",
    landmarks: ["Ravi Road Timber Market Gate", "Timber Market Association Office", "Lorry Adda cargo terminals"]
  },
  {
    id: "bund-road",
    slug: "motorcycle-workshop-near-bund-road",
    name: "Bund Road, Lahore",
    distanceFromBadamiBagh: "Approx. 3.2 km",
    estimatedDriveTime: "10-15 Minutes",
    bestRouteDescription: "Follow Northern Bund Road bypass heading towards Badami Bagh Truck Stand and connect to Abu Bakar Road.",
    localIntro: "Heavy commuter traffic and commercial vehicles ply Bund Road daily. Riders looking for an experienced mechanic near the Badami Bagh end of Bund Road trust Hamza Autos.",
    commuterContext: "Long commute distances on Bund Road require reliable spark plugs, optimal fuel mileage, and dependable brakes.",
    landmarks: ["Bund Road Goods Transporters Terminal", "Yateem Khana link road", "Sanda bypass link"]
  },
  {
    id: "garhi-shahu",
    slug: "bike-repair-near-garhi-shahu-lahore",
    name: "Garhi Shahu & Railway Station",
    distanceFromBadamiBagh: "Approx. 4.5 km",
    estimatedDriveTime: "12-18 Minutes",
    bestRouteDescription: "Head from Lahore Railway Station via Circular Road or Naulakha Bazar straight into Badami Bagh Abu Bakar Road.",
    localIntro: "Riders working near Lahore Railway Station and Garhi Shahu visit Hamza Autos for comprehensive weekend maintenance and transparent mechanical repair.",
    commuterContext: "Dense railway colony traffic and daily commuting make regular oil changes and brake checks necessary.",
    landmarks: ["Lahore Junction Railway Station", "Garhi Shahu Chowk", "Allama Iqbal Road"]
  },
  {
    id: "bhatti-gate",
    slug: "bike-mechanic-near-bhatti-gate",
    name: "Bhatti Gate & Walled City",
    distanceFromBadamiBagh: "Approx. 3.0 km",
    estimatedDriveTime: "8-12 Minutes",
    bestRouteDescription: "Exit Bhatti Gate onto Circular Road heading northeast towards Badami Bagh Lorry Adda and connect directly to Abu Bakar Road.",
    localIntro: "Riders commuting from inside the historic Walled City and Bhatti Gate trust Hamza Autos for reliable 70cc and 125cc motorcycle maintenance and rapid repairs.",
    commuterContext: "Tight, congested walled-city street riding demands responsive brakes, smooth clutch engagement, and dependable cooling.",
    landmarks: ["Bhatti Gate Chowk", "Circular Road Walled City Loop", "Data Darbar Approach"]
  },
  {
    id: "shahdara",
    slug: "motorcycle-repair-near-shahdara-lahore",
    name: "Shahdara & Ravi Bridge",
    distanceFromBadamiBagh: "Approx. 4.8 km",
    estimatedDriveTime: "12-16 Minutes",
    bestRouteDescription: "Cross Old Ravi Bridge / New Ravi Bridge coming directly into Badami Bagh Abu Bakar Road near Ali Hajvery Marriage Hall.",
    localIntro: "Commuters traveling daily between Shahdara and central Lahore rely on Hamza Autos for timely motorcycle tune-ups, oil servicing, and roadworthiness checks.",
    commuterContext: "Crossing the Ravi Bridge corridor exposes bikes to open-throttle high speed and river dust; regular oil and chain checks ensure reliability.",
    landmarks: ["Ravi Toll Plaza", "Shahdara Chowk", "Old Ravi Bridge", "Baradari Link"]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "common-engine-problems",
    slug: "common-motorcycle-engine-problems-and-solutions",
    title: "Common Motorcycle Engine Problems and Their Solutions in Pakistan",
    publishedDate: "November 2, 2026",
    readTime: "6 min read",
    category: "Engine Maintenance",
    author: "Hamza Autos Technical Team",
    excerpt: "Learn how to diagnose white smoke, metallic tapping noises, low compression, and sudden engine cutouts in Honda CD 70, CG 125, and Chinese motorcycles.",
    content: `
### Understanding Motorcycle Engine Wear in Lahore Conditions
Motorcycles in Lahore operate under challenging conditions: extreme summer ambient temperatures exceeding 42°C, heavy stop-and-go congestion in areas like Badami Bagh, and dust accumulation on roadside air intakes. These environmental factors accelerate engine oil degradation, cylinder bore scoring, and valve seat recession.

#### 1. White or Blue Smoke from Exhaust
If your motorcycle emits bluish-white smoke from the exhaust silencer, it indicates that engine oil is entering the combustion chamber and burning with petrol.
- **Root Cause**: Worn piston rings, scored cylinder wall, or hardened valve stem oil seals that allow oil from the cylinder head to leak down the valve guides.
- **Solution**: A cylinder head overhaul. At Hamza Autos, we measure the cylinder bore with a micrometer, install replacement piston rings, hone the cylinder, and fit fresh heat-resistant viton valve stem seals.

#### 2. Metallic Tapping Noise from Top End (Tappet Sound)
A loud ticking or clattering sound from the top of the engine that gets louder as the engine warms up is almost always caused by improper valve clearance (tappet clearance).
- **Root Cause**: Thermal expansion widens or narrows the gap between the rocker arm and the valve stem.
- **Solution**: Precision adjustment using a feeler gauge according to manufacturer specifications (typically 0.05 mm to 0.08 mm on cold 70cc engines).

#### 3. Sudden Engine Power Loss When Accelerating
If your motorcycle bogs down or feels like it is gasping for air when you twist the throttle:
- **Root Cause**: Clogged main jet in the carburetor or an obstructed air cleaner element.
- **Solution**: Complete carburetor ultrasonic cleaning, clearing the pilot and main jets with fine wire and compressed air, and washing the foam air filter in solvent.
    `,
    faqs: [
      {
        question: "How do I know if my motorcycle engine needs a complete overhaul?",
        answer: "Signs include severe loss of acceleration, thick white exhaust smoke, rapid oil consumption within 300 km, and poor kick-start compression."
      },
      {
        question: "How long does an engine overhaul take at Hamza Autos Badami Bagh?",
        answer: "Standard 70cc and 125cc engine repairs are completed within 4 to 8 hours with same-day turnaround."
      }
    ],
    tags: ["Engine Overhaul", "Honda CD 70", "White Smoke", "Motorcycle Repair Badami Bagh"],
    image: "/assets/images/blog/blog-engine-problems.jpg",
    imageAlt: "Motorcycle mechanic inspecting cylinder head and engine components"
  },
  {
    id: "engine-oil-change-frequency",
    slug: "how-often-should-you-change-motorcycle-engine-oil",
    title: "How Often Should You Change Motorcycle Engine Oil in Pakistan?",
    publishedDate: "October 24, 2026",
    readTime: "5 min read",
    category: "Oil & Lubrication",
    author: "Hamza Autos Technical Team",
    excerpt: "Why the standard 1,500 km recommendation may be too long for Lahore city driving, and which oil grade (20W-50 vs 10W-40) best protects your bike.",
    content: `
### The Impact of City Congestion on Engine Lubrication
Unlike water-cooled car engines, most commuter motorcycles in Pakistan (such as Honda CD 70, CG 125, and Chinese 70cc bikes) rely on **air cooling**. When you are stuck in slow-moving traffic on Abu Bakar Road or around Azadi Chowk, there is virtually zero airflow across the engine cooling fins.

Under these conditions, engine oil temperatures can exceed 120°C, causing conventional mineral oil to break down chemically (viscosity breakdown) much faster than highway driving.

#### Recommended Oil Change Intervals for Lahore Riders:
1. **Daily Commuters & Delivery Riders (High Traffic)**: Change every **1,000 km to 1,200 km**.
2. **Occasional Riders (Under 15 km/day)**: Change every **1,500 km or 2 months**, whichever comes first.
3. **New Engine Break-In Period**: First oil change at **300 km**, second at **800 km**, third at **1,500 km** to clear metallic machining shavings.

#### 20W-50 vs 10W-40: Which Grade Should You Pick?
- **20W-50 (Recommended for Summer in Lahore)**: Provides thicker protective oil film at high operating temperatures, cushioning gear teeth and protecting the piston skirt.
- **10W-40 (Ideal for Winter & Overhead Cam Bikes like YBR 125)**: Ensures quick cold-morning circulation while maintaining smooth wet clutch engagement.
    `,
    faqs: [
      {
        question: "Can car engine oil be used in a motorcycle?",
        answer: "No. Commuter motorcycles share engine oil with the wet clutch and gearbox. Car oils contain friction modifiers that cause motorcycle clutch plates to slip."
      },
      {
        question: "What happens if I delay an oil change by 2,000 km?",
        answer: "Sludge builds up, oil seals harden, and metal-to-metal wear increases significantly, leading to premature piston and valve wear."
      }
    ],
    tags: ["Engine Oil", "Oil Change Interval", "20W-50", "Bike Maintenance Lahore"],
    image: "/assets/images/blog/blog-oil-change-guide.jpg",
    imageAlt: "Mechanic servicing motorcycle engine oil and checking drain plug"
  },
  {
    id: "improve-fuel-average",
    slug: "how-to-improve-motorcycle-fuel-average",
    title: "How to Improve Your Motorcycle Fuel Average in Lahore City Traffic",
    publishedDate: "October 16, 2026",
    readTime: "7 min read",
    category: "Fuel Economy",
    author: "Hamza Autos Technical Team",
    excerpt: "Practical mechanical steps to get 55 to 65 km/litre from your 70cc bike and 40 to 48 km/litre from your 125cc motorcycle.",
    content: `
With fuel prices being a major concern for motorcycle owners across Pakistan, ensuring your bike delivers maximum kilometres per litre is essential. Many riders assume poor mileage is due to poor petrol quality alone, but mechanical calibration plays a far greater role.

#### 1. Carburetor Air-Fuel Mixture Screw Calibration
A rich fuel mixture burns excess petrol without increasing power, causing carbon buildup on the spark plug and black exhaust soot.
- Tuning the pilot screw to achieve the highest stable idle RPM before setting the throttle stop screw guarantees lean, efficient combustion.

#### 2. Spark Plug Electrode Gap & Cleanliness
A fouled or misgapped spark plug causes incomplete combustion and misfires under load.
- Ensure the electrode gap is set precisely to **0.6 mm – 0.7 mm** using a wire feeler gauge. Replace spark plugs every 8,000 to 10,000 km.

#### 3. Air Filter Maintenance
A clogged air filter acts like a partial choke, forcing the carburetor to draw more liquid petrol than air.
- Clean the sponge air filter every 1,500 km in kerosene, squeeze dry, and apply a few drops of clean engine oil before reinstallation.

#### 4. Tyre Pressure Consistency
Under-inflated tyres increase rolling resistance by up to 25%.
- Maintain **28 PSI** in the front tyre and **32-35 PSI** in the rear tyre.
    `,
    faqs: [
      {
        question: "What is the ideal fuel average for a Honda CD 70?",
        answer: "A properly tuned CD 70 in good mechanical health achieves 55 to 65 km/l in city conditions and up to 70 km/l on open roads."
      },
      {
        question: "Does riding in high gears at low speeds save petrol?",
        answer: "No. Lugging the engine in 4th gear at 20 km/h stresses the crankshaft and burns extra fuel. Shift gears smoothly to match engine speed."
      }
    ],
    tags: ["Fuel Average", "Carburetor Tuning", "Petrol Mileage", "Honda CD 70"],
    image: "/assets/images/blog/blog-fuel-economy-tuning.jpg",
    imageAlt: "Motorcycle carburetor tuning and spark plug calibration for fuel economy"
  },
  {
    id: "clutch-plate-slipping",
    slug: "signs-your-bike-clutch-plate-is-slipping",
    title: "Signs Your Bike Clutch Plate Is Slipping & When to Replace It",
    publishedDate: "October 8, 2026",
    readTime: "5 min read",
    category: "Transmission & Clutch",
    author: "Hamza Autos Technical Team",
    excerpt: "Learn how to detect burnt clutch friction plates before you get stranded on the road.",
    content: `
The clutch system transfers rotational power from the engine crankshaft into the transmission gearbox. When the friction material on the clutch plates wears down, power is lost as friction heat instead of moving the rear wheel forward.

#### Key Symptoms of Clutch Slippage:
1. **Engine Revs Up Without Gaining Speed**: When you open the throttle in 3rd or 4th gear, the engine roars, but the bike accelerates sluggishly.
2. **Difficulty Shifting Gears into Neutral**: Warped steel separator plates prevent clean disengagement, making the gear lever feel stiff at stops.
3. **Burning Smell from Engine**: Burnt friction paper gives off an acrid, pungent odor detectable after riding up a bridge or carrying a pillion rider.
4. **Kick Starter Slips Through**: When attempting to kick-start the bike, the lever moves downward without rotating the engine crank.

#### Why Timely Replacement Matters:
Riding with slipping clutch plates overheats the engine oil and sheds abrasive friction debris into the crankcase, which can clog the oil pump mesh. At Hamza Autos, we replace clutch sets with OEM-spec friction plates, new pressure springs, and fresh engine oil.
    `,
    faqs: [
      {
        question: "How long does a motorcycle clutch last in Pakistan?",
        answer: "Typically 15,000 km to 25,000 km depending on riding style, pillion weight, and whether clutch lever free-play is kept adjusted."
      }
    ],
    tags: ["Clutch Plate", "Gear Shifting", "Engine Pickup", "CG 125 Clutch"],
    image: "/assets/images/blog/blog-clutch-plate-guide.jpg",
    imageAlt: "Motorcycle clutch plates and pressure springs assembly inspection"
  }
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    authorName: "Muhammad Usman",
    area: "Badami Bagh, Lahore",
    bikeModel: "Honda CG 125 (2022)",
    rating: 5,
    date: "November 4, 2026",
    serviceReceived: "Engine Tappet Adjustment & Tuning",
    comment: "My CG 125 had an annoying top-end clatter and was giving poor mileage. Hamza Autos did a proper feeler gauge tappet setting and carburetor clean. The bike runs smooth and quiet now. Transparent pricing and honest advice.",
    isVerifiedCustomer: true
  },
  {
    id: "rev-2",
    authorName: "Rizwan Ahmed",
    area: "Shadbagh, Lahore",
    bikeModel: "Yamaha YBR 125G",
    rating: 5,
    date: "October 29, 2026",
    serviceReceived: "Front Disc Brake & Oil Service",
    comment: "I live in Shadbagh, only 7 minutes away. Took my YBR for spongy front disc brakes. They bled the hydraulic line, fitted genuine brake pads, and did an oil change. Very professional workshop setup.",
    isVerifiedCustomer: true
  },
  {
    id: "rev-3",
    authorName: "Tariq Mahmood",
    area: "Timber Market, Lahore",
    bikeModel: "United 70",
    rating: 5,
    date: "October 19, 2026",
    serviceReceived: "Piston Ring Replacement & Overhaul",
    comment: "My daily work bike was throwing white smoke. Hamza Autos completed the cylinder bore and ring job on the same day. Pickup restored 100% and zero smoke. Reliable mechanic for all of us in the Timber Market area.",
    isVerifiedCustomer: true
  },
  {
    id: "rev-4",
    authorName: "Kashif Butt",
    area: "Misri Shah, Lahore",
    bikeModel: "Honda CD 70 (2021)",
    rating: 5,
    date: "October 11, 2026",
    serviceReceived: "Carburetor Ultrasonic Tuning",
    comment: "Was getting only 42 km/l on my CD 70. After tuning here, average improved to 58 km/l in city traffic. Highly recommended for anyone near Abu Bakar Road.",
    isVerifiedCustomer: true
  },
  {
    id: "rev-5",
    authorName: "Bilal Hussain",
    area: "Ravi Road, Lahore",
    bikeModel: "Suzuki GS 150",
    rating: 5,
    date: "September 28, 2026",
    serviceReceived: "Clutch Plate Overhaul & Wiring",
    comment: "Hard to find mechanics in Badami Bagh who understand Suzuki GS 150 5-speed gearbox and clutch properly without ruining the pushrod. Hamza Autos did a top-class job. Smooth gear shifts.",
    isVerifiedCustomer: true
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Workshop Service Bay & Motorcycle Lift",
    category: "Workshop Environment",
    description: "Equipped with professional hydraulic motorcycle lift bench and dedicated tool racks for systematic diagnostics.",
    image: "/assets/images/gallery/gallery-service-bay.jpg",
    imageAlt: "Motorcycle workshop service bay with bikes on stands and tools"
  },
  {
    id: "gal-2",
    title: "Precision Engine Overhaul & Cylinder Work",
    category: "Engine Rebuild",
    description: "4-stroke cylinder block assembly with torque-calibrated bolts, new piston rings, and honed sleeve.",
    image: "/assets/images/gallery/gallery-engine-rebuild.jpg",
    imageAlt: "Motorcycle engine block disassembly and cylinder overhaul on workbench"
  },
  {
    id: "gal-3",
    title: "Carburetor Diagnostic & Ignition Testing",
    category: "Tuning & Electrical",
    description: "Bench testing spark plug ignition health, voltage coil resistance, and air-fuel balancing.",
    image: "/assets/images/gallery/gallery-carburetor-tuning.jpg",
    imageAlt: "Mechanic tuning motorcycle carburetor and checking fuel-air mixture"
  },
  {
    id: "gal-4",
    title: "Clean Oil Draining & Lubricant Servicing",
    category: "Maintenance",
    description: "Genuine 4T engine lubricant refilling with magnetic drain plug decontamination and crush washer renewal.",
    image: "/assets/images/gallery/gallery-oil-servicing.jpg",
    imageAlt: "Mechanic changing motorcycle engine oil and pouring fresh 4T lubricant"
  },
  {
    id: "gal-5",
    title: "Drive Chain & Sprocket Replacement",
    category: "Transmission & Drive",
    description: "Heavy-duty 428H roller chain fitting, sprocket alignment, and high-temperature chain lubrication.",
    image: "/assets/images/gallery/gallery-chain-sprocket.jpg",
    imageAlt: "Motorcycle drive chain and rear sprocket teeth servicing"
  },
  {
    id: "gal-6",
    title: "Rear Suspension & Shock Absorber Servicing",
    category: "Suspension",
    description: "Hydraulic shock absorber inspection, spring preload setting, and swingarm pivot bushing rebuild.",
    image: "/assets/images/gallery/gallery-suspension-shocks.jpg",
    imageAlt: "Motorcycle rear shock absorber spring and suspension components"
  }
];

export const FAQS = [
  {
    question: "Where is Hamza Autos located in Badami Bagh?",
    answer: "Our workshop is located on Abu Bakar Road, right near Ali Hajvery Marriage Hall, Badami Bagh, Lahore. We are within 5 to 10 minutes from Lorry Adda, Timber Market, Shadbagh, and Misri Shah."
  },
  {
    question: "What are your workshop opening hours?",
    answer: "We are open Monday through Sunday from 9:00 AM to 9:00 PM. You can visit directly or send a WhatsApp message to confirm a repair slot."
  },
  {
    question: "Which motorcycle brands do you repair?",
    answer: "We service Honda, Yamaha, Suzuki, United, Road Prince, Super Power, and all Chinese 70cc/100cc/125cc motorcycles."
  },
  {
    question: "Do you offer emergency tyre puncture repair?",
    answer: "Yes, we provide fast vulcanizing hot patch puncture repairs and tyre fitting for commuter riders stranded around Badami Bagh and Abu Bakar Road."
  },
  {
    question: "Can I get an estimate before the repair starts?",
    answer: "Absolutely. Our mechanics inspect the motorcycle first, explain the exact problem, and quote the repair cost before disassembling any parts."
  },
  {
    question: "How can I contact Hamza Autos for a quick enquiry?",
    answer: "You can call us directly or chat on WhatsApp at +92 325 1814548. You can also use the online enquiry form on our website."
  }
];

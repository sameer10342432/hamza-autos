/**
 * Initial Seed Data for Server-Side File Storage
 * Location: Abu Bakar Road, Badami Bagh, Lahore
 */
import { readJsonFile, writeJsonFileAtomic } from './fileStore';

export async function ensureInitialSeedFiles(): Promise<void> {
  // 1. Categories
  await readJsonFile('categories.json', [
    {
      id: 'cat-maintenance',
      name: 'Maintenance Guides',
      slug: 'maintenance-guides',
      description: 'Practical motorcycle maintenance, oil change intervals, and DIY inspection tips.',
      seoTitle: 'Motorcycle Maintenance Guides – Hamza Autos Badami Bagh',
      seoDescription: 'Expert maintenance advice for Honda CD 70, CG 125, Yamaha YBR 125, and Suzuki GS 150 bikes in Pakistan.',
      count: 2
    },
    {
      id: 'cat-troubleshooting',
      name: 'Mechanical Diagnostics',
      slug: 'mechanical-diagnostics',
      description: 'Symptoms, causes, and solutions for engine knocking, clutch slip, electrical faults, and carburetion issues.',
      seoTitle: 'Motorcycle Mechanical Diagnostics & Repair – Hamza Autos',
      seoDescription: 'Diagnose common motorcycle faults in Lahore traffic with tips from Master Mechanics in Badami Bagh.',
      count: 2
    },
    {
      id: 'cat-tips',
      name: 'Fuel Economy & Tuning',
      slug: 'fuel-economy-and-tuning',
      description: 'Strategies for maximizing petrol average and carburetor efficiency.',
      seoTitle: 'Motorcycle Tuning & Petrol Average Tips – Hamza Autos',
      seoDescription: 'Get 60+ km/L from your 70cc motorcycle with proper spark plug and carburetor jetting.',
      count: 1
    }
  ]);

  // 2. Tags
  await readJsonFile('tags.json', [
    { id: 'tag-1', name: 'Honda CD 70', slug: 'honda-cd-70' },
    { id: 'tag-2', name: 'Honda CG 125', slug: 'honda-cg-125' },
    { id: 'tag-3', name: 'Yamaha YBR 125', slug: 'yamaha-ybr-125' },
    { id: 'tag-4', name: 'Engine Oil', slug: 'engine-oil' },
    { id: 'tag-5', name: 'Tuning', slug: 'tuning' },
    { id: 'tag-6', name: 'Badami Bagh', slug: 'badami-bagh' },
    { id: 'tag-7', name: 'Overhaul', slug: 'overhaul' },
    { id: 'tag-8', name: 'Mileage', slug: 'mileage' }
  ]);

  // 3. Blogs
  await readJsonFile('blogs.json', [
    {
      id: 'common-engine-problems',
      slug: 'common-motorcycle-engine-problems-and-solutions',
      title: 'Common Motorcycle Engine Problems and Their Solutions in Pakistan',
      publishedDate: '2026-11-02',
      updatedAt: '2026-11-02',
      category: 'Mechanical Diagnostics',
      author: 'Master Mechanic Hamza',
      readTime: '6 min read',
      excerpt: 'Learn to diagnose white exhaust smoke, metallic tapping noises, clutch slipping, and hard starting on popular Pakistani motorcycles.',
      content: `<h2>Understanding Common 4-Stroke Engine Troubles</h2><p>In Pakistan's intense heat and demanding traffic conditions across Lahore, motorcycle engines undergo severe mechanical thermal stress. Regular commuter motorcycles—including the Honda CD 70, CG 125, Yamaha YBR 125, and United 70—commonly encounter specific issues that can be prevented with timely diagnosis.</p><h3>1. White Exhaust Smoke (Oil Burning)</h3><p>If your motorcycle emits bluish-white smoke from the silencer on cold morning starts or full throttle acceleration, your engine oil is slipping past worn piston rings or defective valve stem seals into the combustion chamber.</p><p><strong>Solution:</strong> A precision cylinder bore hone, brand-new standard or oversized piston rings, and heat-resistant Japanese valve stem seals will completely restore factory compression.</p><h3>2. Metallic Knocking or Tappet Rattle</h3><p>A continuous high-pitched clicking sound from the cylinder head usually indicates loose valve tappets or worn rocker arms.</p><p><strong>Solution:</strong> Feeler gauge calibration to standard factory clearances (0.05mm intake, 0.08mm exhaust for 70cc engines) eliminates the noise and protects the valve seats.</p>`,
      image: '/assets/images/blog/blog-engine-diagnostics.jpg',
      imageAlt: 'Motorcycle engine rebuild and cylinder bore diagnostics in Hamza Autos workshop bay Badami Bagh',
      tags: ['Engine Overhaul', 'Honda CD 70', 'CG 125', 'Lahore Repair'],
      status: 'Published',
      isFeatured: true,
      seo: {
        metaTitle: 'Common Motorcycle Engine Problems & Repair Solutions in Pakistan | Hamza Autos',
        metaDescription: 'Complete diagnostic guide for motorcycle white smoke, tappet clicking, clutch slippage, and low compression from Master Mechanics in Badami Bagh, Lahore.',
        focusKeyword: 'motorcycle engine repair Pakistan',
        canonicalUrl: 'https://hamzaautos.com/blog/common-motorcycle-engine-problems-and-solutions',
        ogTitle: 'Common Motorcycle Engine Problems & Solutions – Hamza Autos',
        ogDescription: 'Diagnose white smoke, low pickup, and tapping engine noise with genuine solutions from Badami Bagh.',
        index: true,
        follow: true
      }
    },
    {
      id: 'summer-maintenance-guide',
      slug: 'motorcycle-summer-maintenance-guide-lahore-heat',
      title: 'Motorcycle Summer Maintenance Guide: Protecting Your Bike in Lahore Heat',
      publishedDate: '2026-10-25',
      updatedAt: '2026-10-25',
      category: 'Maintenance Guides',
      author: 'Master Mechanic Hamza',
      readTime: '5 min read',
      excerpt: 'Crucial steps to prevent engine overheating, vapor lock, tyre blowouts, and battery water evaporation during Lahore summer.',
      content: `<h2>Beating Lahore's 45°C Summer Heat on Two Wheels</h2><p>When summer temperatures in Lahore reach 45°C+, air-cooled motorcycle engines depend entirely on ambient airflow and oil viscosity to keep cylinder head temperatures within safe limits.</p><h3>1. Upgrade to High-Viscosity 20W-50 Engine Oil</h3><p>Thin 10W-30 oils can shear under high heat. In Badami Bagh traffic, 20W-50 4T mineral or semi-synthetic oil maintains a protective boundary lubrication layer over crankshaft journals.</p><h3>2. Check Tyre Air Pressures in the Morning</h3><p>Hot asphalt on Ravi Road and Ring Road expands tyre air pressure by 3 to 5 PSI. Keep front tyres at 28 PSI and rear at 32 PSI when cold to prevent blowouts.</p>`,
      image: '/assets/images/blog/blog-summer-maintenance.jpg',
      imageAlt: 'Motorcycle maintenance and engine cooling inspection at Hamza Autos Badami Bagh',
      tags: ['Summer Care', 'Engine Oil', 'Tyre Pressure', 'Lahore Commuting'],
      status: 'Published',
      isFeatured: true,
      seo: {
        metaTitle: 'Motorcycle Summer Maintenance Guide for Lahore Heat | Hamza Autos Badami Bagh',
        metaDescription: 'Protect your bike from 45°C heat with our engine oil, battery, and tyre guidelines for Lahore riding.',
        focusKeyword: 'bike maintenance Lahore summer',
        canonicalUrl: 'https://hamzaautos.com/blog/motorcycle-summer-maintenance-guide-lahore-heat',
        ogTitle: 'Summer Bike Maintenance Guide – Hamza Autos Lahore',
        ogDescription: 'Engine oil and tyre safety guidelines for intense Pakistani summer commuting.',
        index: true,
        follow: true
      }
    },
    {
      id: 'fuel-economy-tuning-tips',
      slug: 'how-to-improve-motorcycle-fuel-economy-petrol-average',
      title: 'How to Improve Motorcycle Fuel Economy and Petrol Average in 2026',
      publishedDate: '2026-10-18',
      updatedAt: '2026-10-18',
      category: 'Fuel Economy & Tuning',
      author: 'Master Mechanic Hamza',
      readTime: '7 min read',
      excerpt: 'Practical adjustments to get 60+ km/L from a 70cc bike and 45+ km/L from a 125cc motorcycle without sacrificing acceleration.',
      content: `<h2>Achieving Maximum Fuel Mileage Amid High Petrol Prices</h2><p>With petrol prices in Pakistan, fine-tuning your motorcycle's air-fuel mixture and drivetrain efficiency can save thousands of Rupees monthly.</p><h3>1. Clean Carburetor Jets & Adjust Pilot Screw</h3><p>Clogged pilot jets cause fuel waste and erratic idling. Proper ultrasonic cleaning and setting the mixture screw 1.5 turns out delivers a crisp burn.</p><h3>2. Chain Slack Calibration</h3><p>A dry or overly tight drive chain consumes up to 8% of engine power. Adjust slack to 20-25mm and apply gear oil regularly.</p>`,
      image: '/assets/images/blog/blog-fuel-economy-tuning.jpg',
      imageAlt: 'Motorcycle carburetor tuning and fuel jet adjustment at Hamza Autos',
      tags: ['Fuel Economy', 'Carburetor Tuning', 'Petrol Average', 'Honda 70cc'],
      status: 'Published',
      isFeatured: false,
      seo: {
        metaTitle: 'How to Improve Motorcycle Fuel Economy in Pakistan | Hamza Autos',
        metaDescription: 'Achieve 60+ km per liter on 70cc and 45+ km on 125cc motorcycles with our verified carburetor tuning tips.',
        focusKeyword: 'improve bike fuel average Pakistan',
        canonicalUrl: 'https://hamzaautos.com/blog/how-to-improve-motorcycle-fuel-economy-petrol-average',
        ogTitle: 'Motorcycle Fuel Economy Guide – Hamza Autos',
        ogDescription: 'Carburetor jetting and drivetrain tips to save petrol on commuter bikes in Lahore.',
        index: true,
        follow: true
      }
    }
  ]);

  // 4. Inquiries (Central Inbox)
  await readJsonFile('inquiries.json', [
    {
      id: 'inq-101',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      email: 'arshad.lahore@example.com',
      inquiryType: 'Appointment Booking',
      relatedService: 'Bike Tuning & Oil Change',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      area: 'Badami Bagh',
      message: 'Need complete carburetor tuning and genuine 4T oil change before outstation trip.',
      preferredDate: '2026-11-18',
      preferredTime: '10:30 AM',
      submissionDate: '2026-11-15T09:15:00.000Z',
      sourceForm: 'Booking Modal (Header & Hero)',
      sourcePage: 'https://hamzaautos.com/#/services',
      status: 'New',
      priority: 'High',
      assignedAdmin: 'Hamza (Master Mechanic)',
      adminNotes: 'Confirmed customer from Abu Bakar Road. Assigned bay 1 for 10:30 AM.'
    },
    {
      id: 'inq-102',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      email: '',
      inquiryType: 'Quotation Request',
      relatedService: 'Engine Overhaul',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      area: 'Shadbagh',
      message: 'Engine making knocking noise on 3rd gear. Want quotation for complete piston and cylinder overhaul.',
      preferredDate: '2026-11-17',
      preferredTime: '02:30 PM',
      submissionDate: '2026-11-15T11:45:00.000Z',
      sourceForm: 'Online Contact Form',
      sourcePage: 'https://hamzaautos.com/#/contact',
      status: 'In Progress',
      priority: 'Urgent',
      assignedAdmin: 'Hamza (Master Mechanic)',
      adminNotes: 'Quotation #HA-QT-2026-001 issued for PKR 8,500. Awaiting parts delivery.'
    },
    {
      id: 'inq-103',
      customerName: 'Zahid Hussain',
      phoneNumber: '0321 9876543',
      email: '',
      inquiryType: 'General Enquiry',
      relatedService: 'Electrical & CDI Repair',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125G',
      registrationNumber: 'LEA-21-9081',
      area: 'Misri Shah',
      message: 'Headlight flickering and battery drainage after rain. Please let me know if replacement rectifier is available.',
      preferredDate: '2026-11-19',
      preferredTime: '11:00 AM',
      submissionDate: '2026-11-14T16:20:00.000Z',
      sourceForm: 'Service Detail Page Form',
      sourcePage: 'https://hamzaautos.com/#/services/motorcycle-electrical-repair',
      status: 'Contacted',
      priority: 'Normal',
      assignedAdmin: 'Workshop Reception',
      adminNotes: 'Spoke on WhatsApp. Confirmed genuine Yamaha rectifier is in stock (PKR 1,850).'
    }
  ]);

  // 5. Contact Submissions
  await readJsonFile('contact-submissions.json', [
    {
      id: 'cs-1',
      inquiryId: 'inq-102',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      area: 'Shadbagh',
      serviceRequested: 'Engine Overhaul',
      message: 'Engine making knocking noise on 3rd gear. Want quotation for complete piston and cylinder overhaul.',
      createdAt: '2026-11-15T11:45:00.000Z',
      status: 'In Progress',
      adminNotes: 'Quotation sent via WhatsApp'
    }
  ]);

  // 6. Booking Submissions
  await readJsonFile('booking-submissions.json', [
    {
      id: 'bs-1',
      inquiryId: 'inq-101',
      bookingNumber: 'HA-BK-2026-001',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      serviceRequested: 'Bike Tuning & Oil Change',
      appointmentDate: '2026-11-18',
      appointmentTime: '10:30 AM',
      status: 'Confirmed',
      createdAt: '2026-11-15T09:15:00.000Z'
    }
  ]);

  // 7. Quotation Submissions
  await readJsonFile('quotation-submissions.json', [
    {
      id: 'qs-1',
      inquiryId: 'inq-102',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125',
      requestedService: 'Complete Cylinder Boring & Piston Kit',
      estimatedAmount: 8500,
      createdAt: '2026-11-15T12:00:00.000Z',
      status: 'Approved'
    }
  ]);

  // 8. Feedback Submissions
  await readJsonFile('feedback-submissions.json', [
    {
      id: 'fbs-1',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      bikeModel: 'Honda CD 70',
      overallRating: 5,
      serviceQualityRating: 5,
      staffBehaviorRating: 5,
      pricingRating: 5,
      comment: 'Best tuning in Badami Bagh! Mileage improved noticeably from 48 to 61 km/L. Honest advice from Hamza bhai.',
      status: 'Approved',
      isFeatured: true,
      createdAt: '2026-11-12T14:30:00.000Z'
    },
    {
      id: 'fbs-2',
      customerName: 'Usman Ali',
      phoneNumber: '0312 4567890',
      bikeModel: 'Yamaha YBR 125',
      overallRating: 5,
      serviceQualityRating: 5,
      staffBehaviorRating: 5,
      pricingRating: 4,
      comment: 'Resolved electrical and self-start issue in 40 minutes. Genuine parts provided with warranty.',
      status: 'Approved',
      isFeatured: true,
      createdAt: '2026-11-10T17:15:00.000Z'
    }
  ]);

  // 9. Customers Directory
  await readJsonFile('customers.json', [
    {
      id: 'cust-1',
      name: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      whatsapp: '0300 1234567',
      email: 'arshad.lahore@example.com',
      address: 'Near Shadbagh Chowk, Lahore',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      firstContactDate: '2026-10-15',
      lastContactDate: '2026-11-15',
      totalInquiries: 3,
      totalBookings: 2,
      totalSpent: 4200,
      notes: 'Prefers genuine Havoline 4T 20W-50 oil. Regular commuter on Circular Road.'
    },
    {
      id: 'cust-2',
      name: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      whatsapp: '0300 7654321',
      email: '',
      address: 'Abu Bakar Road, Badami Bagh, Lahore',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      firstContactDate: '2026-10-20',
      lastContactDate: '2026-11-15',
      totalInquiries: 2,
      totalBookings: 1,
      totalSpent: 8500,
      notes: 'CG 125 enthusiast. Piston replacement completed in Bay 2.'
    }
  ]);

  // 10. Forms Registry
  await readJsonFile('forms-registry.json', [
    {
      id: 'form-booking-modal',
      name: 'Workshop Appointment Booking Modal',
      publicPage: 'Site-wide Modal & Header Button',
      formType: 'Booking',
      active: true,
      totalSubmissions: 42,
      lastSubmissionDate: '2026-11-15T09:15:00.000Z',
      successMessage: 'Your workshop appointment has been submitted successfully! Hamza Autos will confirm your bay.',
      spamProtection: 'Honeypot + Rate Limiting'
    },
    {
      id: 'form-contact-page',
      name: 'Online Contact & Service Enquiry Form',
      publicPage: '/#/contact',
      formType: 'Contact',
      active: true,
      totalSubmissions: 31,
      lastSubmissionDate: '2026-11-15T11:45:00.000Z',
      successMessage: 'Thank you for reaching out! Our master mechanic will review your inquiry shortly.',
      spamProtection: 'Honeypot + Validation'
    },
    {
      id: 'form-feedback-review',
      name: 'Customer Review & Rating Form',
      publicPage: '/#/reviews & /#/customer-portal',
      formType: 'Feedback',
      active: true,
      totalSubmissions: 28,
      lastSubmissionDate: '2026-11-12T14:30:00.000Z',
      successMessage: 'Thank you! Your feedback has been submitted for workshop review.',
      spamProtection: 'Standard Validation'
    },
    {
      id: 'form-repair-tracker',
      name: 'Job Card Status Tracker Form',
      publicPage: '/#/track-repair',
      formType: 'Lookup',
      active: true,
      totalSubmissions: 85,
      lastSubmissionDate: '2026-11-16T10:00:00.000Z',
      successMessage: 'Status fetched from workshop records.',
      spamProtection: 'Phone Verification Lock'
    }
  ]);

  // 11. Admin Settings
  await readJsonFile('admin-settings.json', {
    businessName: 'Hamza Autos',
    tagline: 'Bike Mechanic & Motorcycle Repair Shop',
    phone: '+92 325 1814548',
    whatsappNumber: '+92 325 1814548',
    address: 'Abu Bakar Road, Near Ali Hajvery Marriage Hall, Badami Bagh, Lahore, Punjab 54000',
    operatingHours: '9:00 AM – 9:00 PM (Monday to Sunday)',
    emailNotificationsEnabled: false,
    notificationEmail: 'hamzaautos.lahore@gmail.com',
    adminUsername: 'admin',
    adminDisplayName: 'Master Mechanic Hamza',
    autoBackupDays: 7,
    allowRegistration: false,
    sessionTimeoutHours: 24
  });

  // 12. Notifications
  await readJsonFile('notifications.json', [
    {
      id: 'notif-1',
      title: 'New Booking Request',
      message: 'Muhammad Arshad requested tuning for Honda CD 70 on Nov 18, 10:30 AM.',
      type: 'booking',
      relatedId: 'inq-101',
      isRead: false,
      createdAt: '2026-11-15T09:15:00.000Z'
    },
    {
      id: 'notif-2',
      title: 'New Quotation Inquiry',
      message: 'Tariq Mahmood requested overhaul quote for Honda CG 125.',
      type: 'inquiry',
      relatedId: 'inq-102',
      isRead: false,
      createdAt: '2026-11-15T11:45:00.000Z'
    },
    {
      id: 'notif-3',
      title: 'Weekly Storage Backup Reminder',
      message: 'Weekly file storage backup reminder. Download full JSON backup to secure records.',
      type: 'system',
      relatedId: 'backup',
      isRead: true,
      createdAt: '2026-11-14T08:00:00.000Z'
    }
  ]);

  // 13. Audit Logs
  await readJsonFile('audit-logs.json', [
    {
      id: 'audit-1',
      action: 'SYSTEM_INIT',
      performedBy: 'System Engine',
      affectedRecord: 'storage/init',
      timestamp: new Date().toISOString(),
      metadata: 'File-based storage engine initialized with 16 JSON stores.'
    }
  ]);

  console.log('[FileStore] All initial JSON storage files verified and seeded.');
}

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

  // 14. CRM Leads (storage/crm-leads.json)
  await readJsonFile('crm-leads.json', [
    {
      id: 'lead-101',
      customerName: 'Muhammad Salman',
      phoneNumber: '0300 4567891',
      whatsAppNumber: '0300 4567891',
      email: 'salman.lahore@gmail.com',
      address: 'Near Minar-e-Pakistan, Badami Bagh, Lahore',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2022)',
      registrationNumber: 'LEN-22-8910',
      interestedService: 'Complete Engine Overhaul & Piston Tuning',
      customerMessage: 'Engine burning oil with bluish smoke. Needs genuine Japanese valve seals and piston rings.',
      leadSource: 'Contact Form',
      sourcePage: '/#/contact',
      leadCreationDate: '2026-11-14T10:30:00.000Z',
      assignedAdmin: 'Master Mechanic Hamza',
      priority: 'High',
      status: 'Qualified',
      estimatedValue: 6500,
      internalNotes: 'Customer ready to bring bike Saturday morning. Wants Havoline 20W-50 oil included.',
      nextFollowUpDate: '2026-11-18'
    },
    {
      id: 'lead-102',
      customerName: 'Khurram Shehzad',
      phoneNumber: '0321 8765432',
      whatsAppNumber: '0321 8765432',
      email: '',
      address: 'Shadbagh, Lahore',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125G (2021)',
      registrationNumber: 'LEA-21-4450',
      interestedService: 'Front Disc Brake & Suspension Overhaul',
      customerMessage: 'Front shock absorbers leaking fork oil. Disc brake lever spongy.',
      leadSource: 'Booking Request',
      sourcePage: '/#/services/motorcycle-brake-repair',
      leadCreationDate: '2026-11-15T14:15:00.000Z',
      assignedAdmin: 'Master Mechanic Hamza',
      priority: 'Medium',
      status: 'Contacted',
      estimatedValue: 4200,
      internalNotes: 'Quoted Crown Lifan fork seals and Motul fork oil. Waiting for customer confirmation.',
      nextFollowUpDate: '2026-11-19'
    },
    {
      id: 'lead-103',
      customerName: 'Rana Waqas',
      phoneNumber: '0333 1122334',
      whatsAppNumber: '0333 1122334',
      email: '',
      address: 'Circular Road, Lahore',
      bikeBrand: 'Suzuki',
      bikeModel: 'GS 150',
      registrationNumber: 'LEK-20-1123',
      interestedService: 'Electrical Wiring & Self Starter Repair',
      customerMessage: 'Self starter clicking, bike not starting in mornings. Battery might need acid check.',
      leadSource: 'Quotation Request',
      sourcePage: '/#/contact',
      leadCreationDate: '2026-11-16T11:00:00.000Z',
      assignedAdmin: 'Master Mechanic Hamza',
      priority: 'Urgent',
      status: 'New Lead',
      estimatedValue: 3500,
      internalNotes: 'Inspect starter carbon brushes and solenoid switch.',
      nextFollowUpDate: '2026-11-17'
    }
  ]);

  // 15. CRM Follow-ups (storage/crm-followups.json)
  await readJsonFile('crm-followups.json', [
    {
      id: 'flw-1',
      leadId: 'lead-101',
      customerName: 'Muhammad Salman',
      phoneNumber: '0300 4567891',
      followUpDate: '2026-11-17',
      followUpTime: '04:00 PM',
      followUpMethod: 'WhatsApp',
      followUpNotes: 'Send quote confirmation for CD 70 piston cylinder hone and timing chain.',
      assignedAdmin: 'Master Mechanic Hamza',
      status: 'Pending',
      createdAt: '2026-11-14T11:00:00.000Z'
    },
    {
      id: 'flw-2',
      leadId: 'lead-102',
      customerName: 'Khurram Shehzad',
      phoneNumber: '0321 8765432',
      followUpDate: '2026-11-18',
      followUpTime: '11:30 AM',
      followUpMethod: 'Call',
      followUpNotes: 'Follow up on YBR 125 front shock fork seals availability and Saturday booking.',
      assignedAdmin: 'Master Mechanic Hamza',
      status: 'Pending',
      createdAt: '2026-11-15T15:00:00.000Z'
    }
  ]);

  // 16. Customer Interactions Timeline (storage/crm-interactions.json)
  await readJsonFile('crm-interactions.json', [
    {
      id: 'act-1',
      leadId: 'lead-101',
      customerName: 'Muhammad Salman',
      type: 'Inquiry Received',
      details: 'Customer submitted online inquiry for Honda CD 70 smoke diagnosis.',
      timestamp: '2026-11-14T10:30:00.000Z',
      adminName: 'Website System',
      channel: 'Website'
    },
    {
      id: 'act-2',
      leadId: 'lead-101',
      customerName: 'Muhammad Salman',
      type: 'Call Recorded',
      details: 'Spoke with customer; explained cylinder hone vs sleeve options. Agreed to 0.25mm oversize piston.',
      timestamp: '2026-11-14T12:00:00.000Z',
      adminName: 'Master Mechanic Hamza',
      channel: 'Phone'
    },
    {
      id: 'act-3',
      leadId: 'lead-102',
      customerName: 'Khurram Shehzad',
      type: 'Booking Created',
      details: 'Customer requested appointment for Yamaha YBR 125 disc brake inspection.',
      timestamp: '2026-11-15T14:15:00.000Z',
      adminName: 'Website System',
      channel: 'Website'
    }
  ]);

  // 17. Mechanics Directory (storage/mechanics.json)
  await readJsonFile('mechanics.json', [
    {
      id: 'mech-1',
      fullName: 'Hamza Khan (Master Mechanic)',
      phoneNumber: '0325 1814548',
      whatsAppNumber: '0325 1814548',
      email: 'hamzaautos.lahore@gmail.com',
      address: 'Abu Bakar Road, Badami Bagh, Lahore',
      joiningDate: '2019-03-01',
      specializations: ['Engine Repair', 'Motorcycle Tuning', 'Motorcycle Modification'],
      skills: ['Cylinder Boring Calibration', 'Ultrasonic Carburetor Cleansing', '4-Stroke Overhaul'],
      employmentStatus: 'Active',
      internalNotes: 'Chief Workshop Foreman & Master Technician. Oversees all major engine builds.',
      assignedBays: ['Bay 1 - Engine Bay'],
      activeJobsCount: 2,
      completedJobsCount: 420,
      hourlyRate: 800,
      createdAt: '2019-03-01T08:00:00.000Z'
    },
    {
      id: 'mech-2',
      fullName: 'Bilal Ahmad',
      phoneNumber: '0301 7788990',
      whatsAppNumber: '0301 7788990',
      address: 'Misri Shah, Lahore',
      joiningDate: '2021-06-15',
      specializations: ['Brake Repair', 'Clutch Repair', 'General Maintenance'],
      skills: ['Hydraulic Disc Brake Bleeding', 'Clutch Plate Replacement', 'Chain Sprocket Alignment'],
      employmentStatus: 'Active',
      internalNotes: 'Fast diagnostic specialist for Honda CD 70 and CG 125 transmission & brakes.',
      assignedBays: ['Bay 2 - Quick Service Bay'],
      activeJobsCount: 1,
      completedJobsCount: 310,
      hourlyRate: 500,
      createdAt: '2021-06-15T08:00:00.000Z'
    },
    {
      id: 'mech-3',
      fullName: 'Kamran Ali (Electrician)',
      phoneNumber: '0312 3344556',
      whatsAppNumber: '0312 3344556',
      address: 'Shadbagh, Lahore',
      joiningDate: '2022-09-01',
      specializations: ['Electrical Work', 'Motorcycle Modification'],
      skills: ['Stator Coil Rewinding', 'CDI Unit Diagnostics', 'LED Headlight Conversion', 'Self Starter Overhaul'],
      employmentStatus: 'Active',
      internalNotes: 'Specialist in 12V wiring harnesses and Suzuki/Yamaha electrical troubleshooting.',
      assignedBays: ['Bay 3 - Electrical & Diagnostics Bay'],
      activeJobsCount: 1,
      completedJobsCount: 185,
      hourlyRate: 550,
      createdAt: '2022-09-01T08:00:00.000Z'
    },
    {
      id: 'mech-4',
      fullName: 'Usman Tariq',
      phoneNumber: '0345 9988776',
      address: 'Ravi Road, Lahore',
      joiningDate: '2023-01-10',
      specializations: ['Tyre & Puncture', 'Spare Parts Installation', 'General Maintenance'],
      skills: ['Tubeless Tyre Patching', 'Wheel Rim Truing / Spokes Alignment', 'Oil & Filter Servicing'],
      employmentStatus: 'Active',
      internalNotes: 'Skilled in wheel balancing, puncture vulcanizing, and routine fast oil changes.',
      assignedBays: ['Bay 4 - Wash & Wheel Bay'],
      activeJobsCount: 0,
      completedJobsCount: 240,
      hourlyRate: 400,
      createdAt: '2023-01-10T08:00:00.000Z'
    }
  ]);

  // 18. Mechanic Attendance (storage/mechanic-attendance.json)
  const todayStr = new Date().toISOString().split('T')[0];
  await readJsonFile('mechanic-attendance.json', [
    {
      id: `att-1-${todayStr}`,
      mechanicId: 'mech-1',
      mechanicName: 'Hamza Khan (Master Mechanic)',
      date: todayStr,
      checkInTime: '08:45 AM',
      status: 'Present',
      notes: 'Morning briefing and engine overhaul allocations completed.',
      recordedBy: 'admin',
      createdAt: `${todayStr}T08:45:00.000Z`
    },
    {
      id: `att-2-${todayStr}`,
      mechanicId: 'mech-2',
      mechanicName: 'Bilal Ahmad',
      date: todayStr,
      checkInTime: '09:00 AM',
      status: 'Present',
      notes: 'Assigned to Bay 2 for clutch & brake repairs.',
      recordedBy: 'admin',
      createdAt: `${todayStr}T09:00:00.000Z`
    },
    {
      id: `att-3-${todayStr}`,
      mechanicId: 'mech-3',
      mechanicName: 'Kamran Ali (Electrician)',
      date: todayStr,
      checkInTime: '09:10 AM',
      status: 'Present',
      notes: 'Testing battery charging circuits.',
      recordedBy: 'admin',
      createdAt: `${todayStr}T09:10:00.000Z`
    },
    {
      id: `att-4-${todayStr}`,
      mechanicId: 'mech-4',
      mechanicName: 'Usman Tariq',
      date: todayStr,
      checkInTime: '08:50 AM',
      status: 'Present',
      notes: 'Tyre bay opened.',
      recordedBy: 'admin',
      createdAt: `${todayStr}T08:50:00.000Z`
    }
  ]);

  // 19. Expense Categories (storage/expense-categories.json)
  await readJsonFile('expense-categories.json', [
    { id: 'exp-cat-rent', name: 'Shop Rent', isSystem: true, description: 'Monthly workshop premises rent on Abu Bakar Road' },
    { id: 'exp-cat-elec', name: 'Electricity (LESCO)', isSystem: true, description: 'Commercial LESCO power bill for compressors and lighting' },
    { id: 'exp-cat-parts', name: 'Spare Parts Purchases', isSystem: true, description: 'Direct stock procurement from Badami Bagh wholesale market' },
    { id: 'exp-cat-tools', name: 'Workshop Tools & Machinery', isSystem: true, description: 'Tappet gauges, impact wrenches, socket sets, ultrasonic cleaners' },
    { id: 'exp-cat-salary', name: 'Staff Salaries & Daily Wages', isSystem: true, description: 'Mechanic compensation and workshop helper wages' },
    { id: 'exp-cat-maint', name: 'Equipment Maintenance', isSystem: false, description: 'Air compressor oil change, lift repairs, hydraulic jack servicing' },
    { id: 'exp-cat-tea', name: 'Staff Tea & Refreshments', isSystem: false, description: 'Daily workshop tea, clean drinking water, and meals' },
    { id: 'exp-cat-mktg', name: 'Marketing & Printing', isSystem: false, description: 'Job card printing, visiting cards, banner maintenance' }
  ]);

  // 20. Workshop Expenses (storage/expenses.json)
  await readJsonFile('expenses.json', [
    {
      id: 'exp-101',
      expenseTitle: 'LESCO Commercial Power Bill',
      expenseCategory: 'Electricity (LESCO)',
      amount: 14500,
      expenseDate: '2026-11-05',
      paymentMethod: 'Bank Transfer',
      paidTo: 'LESCO Sub-Division Badami Bagh',
      description: 'Monthly commercial electricity bill for workshop lifts, ultrasonic cleaner & lighting.',
      referenceNumber: 'LESCO-9921448',
      createdBy: 'admin',
      createdDate: '2026-11-05T12:00:00.000Z'
    },
    {
      id: 'exp-102',
      expenseTitle: 'Air Compressor Synthetic Lubricant & Belt',
      expenseCategory: 'Equipment Maintenance',
      amount: 2800,
      expenseDate: '2026-11-08',
      paymentMethod: 'Cash',
      paidTo: 'Lahore Machinery Store, Circular Road',
      description: 'Replaced 3HP air compressor drive belt and synthetic oil.',
      referenceNumber: 'INV-4412',
      createdBy: 'admin',
      createdDate: '2026-11-08T16:30:00.000Z'
    },
    {
      id: 'exp-103',
      expenseTitle: 'Workshop A4 Job Card & Invoice Pads Printing',
      expenseCategory: 'Marketing & Printing',
      amount: 4500,
      expenseDate: '2026-11-10',
      paymentMethod: 'Cash',
      paidTo: 'Urdu Bazaar Printing Press',
      description: '10 pads of 3-part carbonless A4 Job Cards and 10 pads of Customer Invoices.',
      referenceNumber: 'UB-99120',
      createdBy: 'admin',
      createdDate: '2026-11-10T14:00:00.000Z'
    }
  ]);

  // 21. Financial Transactions Log (storage/financial-transactions.json)
  await readJsonFile('financial-transactions.json', [
    {
      id: 'tx-1',
      transactionType: 'Customer Payment',
      referenceType: 'Invoice',
      referenceId: 'HA-INV-2026-001',
      amount: 1500,
      date: '2026-11-12',
      paymentMethod: 'Cash',
      description: 'Customer payment received for Honda CD 70 tuning & oil change.',
      createdBy: 'admin',
      customerOrPayee: 'Muhammad Arshad',
      status: 'Completed',
      createdAt: '2026-11-12T14:30:00.000Z'
    },
    {
      id: 'tx-2',
      transactionType: 'Workshop Expense',
      referenceType: 'Expense',
      referenceId: 'exp-101',
      amount: 14500,
      date: '2026-11-05',
      paymentMethod: 'Bank Transfer',
      description: 'LESCO Commercial Power Bill',
      createdBy: 'admin',
      customerOrPayee: 'LESCO Badami Bagh',
      status: 'Completed',
      createdAt: '2026-11-05T12:00:00.000Z'
    }
  ]);

  // 22. Suppliers Directory (storage/suppliers.json)
  await readJsonFile('suppliers.json', [
    {
      id: 'sup-1',
      supplierName: 'Crown Lifan Pakistan (Authorized Distributor)',
      contactPerson: 'Haji Farooq Ahmad',
      phoneNumber: '0300 8421900',
      whatsAppNumber: '0300 8421900',
      email: 'sales@crownlifanlahore.pk',
      businessAddress: 'Main Auto Market, Badami Bagh, Lahore',
      supplierCategory: 'OEM & Aftermarket Spare Parts',
      productsSupplied: ['Pistons', 'Cylinder Kits', 'Clutch Plates', 'Chain Sprockets', 'Valve Sets'],
      paymentTerms: '15 Days Net Credit',
      notes: 'Primary supplier for Crown Lifan certified replacement parts.',
      status: 'Active',
      totalPurchases: 45000,
      totalPaid: 35000,
      outstandingBalance: 10000,
      createdAt: '2026-01-15T08:00:00.000Z'
    },
    {
      id: 'sup-2',
      supplierName: 'Atlas Honda Genuine Parts Wholesale Agency',
      contactPerson: 'Malik Zafar Iqbal',
      phoneNumber: '0321 4455667',
      whatsAppNumber: '0321 4455667',
      email: 'orders@atlashondasparez.com',
      businessAddress: 'Ravi Auto Plaza, Badami Bagh, Lahore',
      supplierCategory: 'Genuine OEM Parts',
      productsSupplied: ['Genuine CD 70 / CG 125 Oil', 'OEM Brake Shoes', 'Genuine Cables', 'Air Filters', 'Gaskets'],
      paymentTerms: 'Cash on Delivery / 7 Days',
      notes: 'Supplies 100% genuine sealed Atlas Honda packaging with barcode verification.',
      status: 'Active',
      totalPurchases: 62000,
      totalPaid: 58000,
      outstandingBalance: 4000,
      createdAt: '2026-02-01T08:00:00.000Z'
    },
    {
      id: 'sup-3',
      supplierName: 'Guard Filters & Automotive Lubricants',
      contactPerson: 'Sheikh Nabeel',
      phoneNumber: '0333 9988112',
      whatsAppNumber: '0333 9988112',
      email: 'guard.lahore@gmail.com',
      businessAddress: 'Circular Road, Near Bhati Gate, Lahore',
      supplierCategory: 'Filters & Lubricants',
      productsSupplied: ['Guard Air Filters', 'Engine Oil Filters', 'Havoline 4T 20W-50', 'Brake Fluid DOT 3'],
      paymentTerms: 'Cash on Delivery',
      notes: 'Direct distributor for Guard and Caltex Havoline motorcycle engine oils.',
      status: 'Active',
      totalPurchases: 28000,
      totalPaid: 28000,
      outstandingBalance: 0,
      createdAt: '2026-03-10T08:00:00.000Z'
    }
  ]);

  // 23. Purchase Orders (storage/purchase-orders.json)
  await readJsonFile('purchase-orders.json', [
    {
      id: 'po-101',
      poNumber: 'HA-PO-2026-001',
      supplierId: 'sup-1',
      supplierName: 'Crown Lifan Pakistan (Authorized Distributor)',
      orderDate: '2026-11-08',
      expectedDeliveryDate: '2026-11-10',
      items: [
        {
          id: 'item-1',
          partName: 'Crown CD 70 Piston & Ring Kit (0.25mm)',
          quantityOrdered: 10,
          quantityReceived: 10,
          unitPurchasePrice: 850,
          total: 8500
        },
        {
          id: 'item-2',
          partName: 'Crown CG 125 Heavy-Duty Clutch Plates Set',
          quantityOrdered: 8,
          quantityReceived: 8,
          unitPurchasePrice: 750,
          total: 6000
        }
      ],
      discount: 500,
      additionalCharges: 0,
      totalOrderValue: 14000,
      paidAmount: 14000,
      paymentStatus: 'Paid',
      deliveryStatus: 'Received',
      receivedDate: '2026-11-10',
      receivingNotes: 'All 10 piston kits and 8 clutch plate sets verified and placed on Shelf B-2.',
      notes: 'Restock for November overhaul jobs.',
      createdBy: 'admin',
      createdAt: '2026-11-08T10:00:00.000Z'
    },
    {
      id: 'po-102',
      poNumber: 'HA-PO-2026-002',
      supplierId: 'sup-2',
      supplierName: 'Atlas Honda Genuine Parts Wholesale Agency',
      orderDate: '2026-11-14',
      expectedDeliveryDate: '2026-11-18',
      items: [
        {
          id: 'item-3',
          partName: 'Atlas Honda Genuine CD 70 Brake Shoes',
          quantityOrdered: 20,
          quantityReceived: 10,
          unitPurchasePrice: 380,
          total: 7600
        },
        {
          id: 'item-4',
          partName: 'Genuine Havoline 4T 20W-50 0.7L Oil Can',
          quantityOrdered: 24,
          quantityReceived: 24,
          unitPurchasePrice: 720,
          total: 17280
        }
      ],
      discount: 880,
      additionalCharges: 0,
      totalOrderValue: 24000,
      paidAmount: 20000,
      paymentStatus: 'Partially Paid',
      deliveryStatus: 'Partially Received',
      receivedDate: '2026-11-16',
      receivingNotes: 'Received all 24 Havoline oil cans. 10 brake shoes delivered, remaining 10 arriving Friday.',
      notes: 'Urgent oil restock.',
      createdBy: 'admin',
      createdAt: '2026-11-14T11:30:00.000Z'
    }
  ]);

  // 24. Supplier Payments Log (storage/supplier-payments.json)
  await readJsonFile('supplier-payments.json', [
    {
      id: 'spay-1',
      supplierId: 'sup-1',
      supplierName: 'Crown Lifan Pakistan (Authorized Distributor)',
      purchaseOrderId: 'po-101',
      poNumber: 'HA-PO-2026-001',
      paymentDate: '2026-11-10',
      amount: 14000,
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'HBL-9921008',
      notes: 'Settled PO-2026-001 in full upon receiving goods.',
      recordedBy: 'admin',
      createdAt: '2026-11-10T15:00:00.000Z'
    },
    {
      id: 'spay-2',
      supplierId: 'sup-2',
      supplierName: 'Atlas Honda Genuine Parts Wholesale Agency',
      purchaseOrderId: 'po-102',
      poNumber: 'HA-PO-2026-002',
      paymentDate: '2026-11-15',
      amount: 20000,
      paymentMethod: 'Cash',
      referenceNumber: 'CSH-RECEIPT-441',
      notes: 'Partial advance payment against PO-2026-002. Remaining 4000 due on balance delivery.',
      recordedBy: 'admin',
      createdAt: '2026-11-15T12:00:00.000Z'
    }
  ]);

  // 25. Security Events Log (storage/security-events.json)
  await readJsonFile('security-events.json', [
    {
      id: 'sec-1',
      eventType: 'LOGIN_SUCCESS',
      severity: 'low',
      details: 'Master Admin authenticated successfully via PBKDF2 hash verification.',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Workshop Terminal',
      adminUsername: 'admin',
      timestamp: new Date().toISOString()
    }
  ]);

  // 26. Data Recovery History (storage/recovery-history.json)
  await readJsonFile('recovery-history.json', [
    {
      id: 'recov-init',
      backupId: 'initial_system_baseline',
      backupDate: new Date().toISOString(),
      restoreDate: new Date().toISOString(),
      adminUsername: 'admin',
      restoreType: 'full',
      modulesRestored: ['All 26 JSON Stores'],
      result: 'Success',
      preRestoreSafetyBackup: 'baseline_verified'
    }
  ]);

  // 27. Spare Parts Inventory (storage/inventory.json)
  await readJsonFile('inventory.json', [
    {
      id: 'sp-1',
      partNumber: 'SP-ENG-001',
      partName: 'Piston Kit Complete 0.25 (70cc OHC)',
      category: 'Engine & Mechanical',
      compatibleBrands: ['Honda', 'United', 'Road Prince', 'Chinese Motorcycles'],
      compatibleModels: ['CD 70', 'US 70', 'RP 70', 'All 70cc Chinese'],
      purchasePrice: 1200,
      sellingPrice: 1800,
      stockQuantity: 14,
      minStockAlert: 5,
      lastRestocked: '2026-11-01'
    },
    {
      id: 'sp-2',
      partNumber: 'SP-ENG-002',
      partName: 'Piston Kit Complete 0.25 (CG 125 OHV)',
      category: 'Engine & Mechanical',
      compatibleBrands: ['Honda'],
      compatibleModels: ['CG 125', 'CG 125 SE'],
      purchasePrice: 2100,
      sellingPrice: 2900,
      stockQuantity: 8,
      minStockAlert: 4,
      lastRestocked: '2026-11-04'
    },
    {
      id: 'sp-3',
      partNumber: 'SP-OIL-001',
      partName: 'Caltex Havoline 4T 20W-50 Engine Oil (0.7L)',
      category: 'Lubricants & Fluids',
      compatibleBrands: ['Honda', 'United', 'Road Prince'],
      compatibleModels: ['CD 70', 'CD 70 Dream', 'US 70'],
      purchasePrice: 850,
      sellingPrice: 1050,
      stockQuantity: 28,
      minStockAlert: 10,
      lastRestocked: '2026-11-08'
    },
    {
      id: 'sp-4',
      partNumber: 'SP-BRK-001',
      partName: 'Yamaha Front Hydraulic Disc Brake Pads (YBR 125)',
      category: 'Brakes & Safety',
      compatibleBrands: ['Yamaha'],
      compatibleModels: ['YBR 125', 'YBR 125G', 'YB 125Z-DX'],
      purchasePrice: 650,
      sellingPrice: 950,
      stockQuantity: 3,
      minStockAlert: 5,
      lastRestocked: '2026-10-20'
    },
    {
      id: 'sp-5',
      partNumber: 'CP-CG125-QA',
      partName: 'QA Test Heavy Duty Clutch Plate CG125',
      category: 'Clutch & Transmission',
      compatibleBrands: ['Honda'],
      compatibleModels: ['CG 125'],
      purchasePrice: 650,
      sellingPrice: 950,
      stockQuantity: 0,
      minStockAlert: 5,
      lastRestocked: '2026-11-17'
    }
  ]);

  console.log('[FileStore] All initial JSON storage files verified and seeded.');
}

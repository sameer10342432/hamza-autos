import test from 'node:test';
import assert from 'node:assert';
import {
  isTimeSlotAvailable,
  createAppointmentBooking,
  createJobCard,
  lookupJobCardForTracking,
  upsertCustomerFromActivity,
  adjustStockQuantity,
  getStoredInventory,
  createInvoice,
  generatePreparedWhatsApp,
  performSiteSearch,
  exportDatabaseBackup,
  importDatabaseBackup,
  getStoredBookings,
  getStoredJobCards
} from './workshopLogic';

// Mock localStorage for Node test runner
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => { mockStorage[key] = String(val); },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  key: () => null,
  length: 0
} as any;

test('1. Double-booking prevention calculates remaining slots correctly', () => {
  const date = '2026-11-20';
  const slot = '10:30 AM';
  
  const status1 = isTimeSlotAvailable(date, slot, undefined, 2);
  assert.strictEqual(status1.available, true);
  assert.strictEqual(status1.remaining, 2);

  // Create 1st booking
  const res1 = createAppointmentBooking({
    customerName: 'Ahmad Khan',
    phoneNumber: '0300 1122334',
    bikeBrand: 'Honda',
    bikeModel: 'CD 70',
    serviceRequested: 'Bike Tuning',
    problemDescription: 'Tuning required',
    appointmentDate: date,
    appointmentTime: slot
  });
  assert.strictEqual(res1.success, true);

  const status2 = isTimeSlotAvailable(date, slot, undefined, 2);
  assert.strictEqual(status2.available, true);
  assert.strictEqual(status2.remaining, 1);

  // Create 2nd booking to fill slot capacity
  const res2 = createAppointmentBooking({
    customerName: 'Kamran Ali',
    phoneNumber: '0321 4455667',
    bikeBrand: 'Yamaha',
    bikeModel: 'YBR 125',
    serviceRequested: 'Oil Change',
    problemDescription: 'Routine servicing',
    appointmentDate: date,
    appointmentTime: slot
  });
  assert.strictEqual(res2.success, true);

  // Attempt 3rd booking on full slot -> MUST BE REJECTED
  const res3 = createAppointmentBooking({
    customerName: 'Imran Raza',
    phoneNumber: '0333 9988776',
    bikeBrand: 'Suzuki',
    bikeModel: 'GS 150',
    serviceRequested: 'Brake Servicing',
    problemDescription: 'Brake check',
    appointmentDate: date,
    appointmentTime: slot
  });
  assert.strictEqual(res3.success, false);
  assert.match(res3.error || '', /fully booked/i);
});

test('2. Digital Job Card is assigned a sequential number and stores required fields', () => {
  const card = createJobCard({
    customerName: 'Shahid Mehmood',
    phoneNumber: '0301 5566778',
    bikeBrand: 'Honda',
    bikeModel: 'CG 125 (2023)',
    registrationNumber: 'LEE-23-9988',
    customerComplaint: 'Clutch slipping under hard acceleration on Abu Bakar Road',
    initialInspectionNotes: 'Friction plates burnt out; clutch basket hub worn',
    requiredServices: ['Bike Clutch Repair & Friction Plate Overhaul'],
    estimatedCost: 3500,
    finalCost: 0,
    expectedCompletionDate: '2026-11-21 16:00',
    repairStatus: 'Diagnosis',
    photosBefore: ['photo1.jpg'],
    photosAfter: []
  });

  assert.ok(card.jobCardNumber.startsWith('HA-JC-2026-'));
  assert.strictEqual(card.repairStatus, 'Diagnosis');
  assert.strictEqual(card.customerName, 'Shahid Mehmood');
});

test('3. Secure Customer Repair Tracking requires matching phone number and omits internal notes', () => {
  const card = createJobCard({
    customerName: 'Waqas Bhatti',
    phoneNumber: '0325 9988770',
    bikeBrand: 'United',
    bikeModel: 'US 70',
    customerComplaint: 'Engine tapping noise',
    initialInspectionNotes: 'Feeler gauge indicates loose exhaust valve',
    requiredServices: ['Bike Tuning'],
    estimatedCost: 1500,
    finalCost: 0,
    expectedCompletionDate: '2026-11-22',
    repairStatus: 'Work In Progress',
    photosBefore: [],
    photosAfter: [],
    internalNotes: 'INTERNAL CONFIDENTIAL: High vibration observed at crank bearing'
  });

  // Attempt 1: Wrong phone number -> REJECTED
  const failedTracking = lookupJobCardForTracking(card.jobCardNumber, '0300 0000000');
  assert.strictEqual(failedTracking.found, false);
  assert.match(failedTracking.error || '', /verification failed/i);

  // Attempt 2: Correct phone number -> SUCCESS
  const successTracking = lookupJobCardForTracking(card.jobCardNumber, '0325 9988770');
  assert.strictEqual(successTracking.found, true);
  assert.strictEqual(successTracking.jobCardNumber, card.jobCardNumber);
  assert.strictEqual(successTracking.repairStatus, 'Work In Progress');
  // Verify internal notes are strictly not exposed
  assert.strictEqual((successTracking as any).internalNotes, undefined);
});

test('4. Customer CRM upserts and avoids duplicate entries for same phone number', () => {
  const cust1 = upsertCustomerFromActivity({
    name: 'Noman Butt',
    phoneNumber: '0345 1122998',
    area: 'Badami Bagh',
    bikeBrand: 'Honda',
    bikeModel: 'CD 70'
  });

  // Call again with updated bike model
  const cust2 = upsertCustomerFromActivity({
    name: 'Noman Butt',
    phoneNumber: '0345 1122998',
    area: 'Badami Bagh Abu Bakar Road',
    bikeBrand: 'Honda',
    bikeModel: 'CG 125'
  });

  assert.strictEqual(cust1.id, cust2.id);
  assert.strictEqual(cust2.bikeModel, 'CG 125');
  assert.strictEqual(cust2.totalVisits, 2);
});

test('5. Spare parts inventory tracks consumption and updates stock', () => {
  const inventory = getStoredInventory();
  const part = inventory[0];
  const initialQty = part.stockQuantity;

  // Consume 2 parts
  const adjResult = adjustStockQuantity(part.id, -2, 'consumed', 'Test invoice consumption');
  assert.strictEqual(adjResult.success, true);
  assert.strictEqual(adjResult.newQuantity, initialQty - 2);
});

test('6. Digital Invoice correctly calculates totals, balance and payment status', () => {
  const invoice = createInvoice({
    jobCardNumber: 'HA-JC-2026-001',
    invoiceDate: '2026-11-10',
    customerName: 'Zubair Raza',
    phoneNumber: '0321 8899770',
    bikeBrand: 'Honda',
    bikeModel: 'CD 70',
    labourItems: [
      { id: 'l-1', description: 'Complete Tuning Labour', amount: 800 }
    ],
    partsItems: [
      { id: 'p-1', partName: 'Engine Oil 20W-50', quantity: 1, unitPrice: 1050, total: 1050 }
    ],
    additionalCharges: 150,
    additionalChargesDescription: 'Cleaning solvent',
    discount: 100,
    amountPaid: 1900,
    paymentMethod: 'Cash'
  });

  // Total = 800 + 1050 + 150 - 100 = 1900
  assert.strictEqual(invoice.totalAmount, 1900);
  assert.strictEqual(invoice.amountPaid, 1900);
  assert.strictEqual(invoice.remainingBalance, 0);
  assert.strictEqual(invoice.paymentStatus, 'Paid');
});

test('7. Prepared WhatsApp message formats clean encoded link', () => {
  const msg = generatePreparedWhatsApp('booking_confirmed', {
    customerName: 'Farhan Ali',
    phoneNumber: '0300 1234567',
    bikeModel: 'Honda CG 125',
    bookingNumber: 'HA-BK-2026-005',
    appointmentDate: '2026-11-25',
    appointmentTime: '11:30 AM'
  });

  assert.ok(msg.waUrl.startsWith('https://wa.me/923001234567?text='));
  assert.ok(msg.text.includes('Hamza Autos Badami Bagh'));
  assert.ok(msg.text.includes('HA-BK-2026-005'));
});

test('8. Global site search finds matches across services, brands, and articles', () => {
  const resultsTuning = performSiteSearch('tuning');
  assert.ok(resultsTuning.length > 0);
  assert.ok(resultsTuning.some(r => r.category === 'Service'));

  const resultsHonda = performSiteSearch('honda');
  assert.ok(resultsHonda.length > 0);
  assert.ok(resultsHonda.some(r => r.category === 'Brand'));
});

test('9. Database backup exports and imports cleanly', () => {
  const backupJson = exportDatabaseBackup();
  assert.ok(backupJson.includes('HA-JC-2026-'));
  assert.ok(backupJson.includes('version'));

  const importResult = importDatabaseBackup(backupJson);
  assert.strictEqual(importResult.success, true);
});

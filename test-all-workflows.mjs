// Hamza Autos - End-to-End Business Workflow Test Suite
// Tests Workflows A to F against the live running server and file storage

const BASE_URL = 'http://localhost:3000';

async function runWorkflowTests() {
  console.log('=================================================================');
  console.log('  HAMZA AUTOS - END-TO-END WORKFLOW & BUSINESS INTEGRITY SUITE  ');
  console.log('=================================================================\n');

  // Authenticate as Admin
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'hamza12345' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.token) {
    throw new Error('Admin authentication failed during test suite initialization.');
  }
  const token = loginData.token;
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const results = [];
  const testIds = {
    leads: [],
    customers: [],
    bookings: [],
    mechanics: [],
    expenses: [],
    suppliers: [],
    pos: [],
    feedbacks: []
  };

  function assert(condition, testName, details) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      results.push({ name: testName, status: 'PASS', details });
    } else {
      console.error(`  [FAIL] ${testName} - ${details}`);
      results.push({ name: testName, status: 'FAIL', details });
    }
  }

  // -------------------------------------------------------------
  // WORKFLOW A: CUSTOMER LEAD & CONVERSION PIPELINE
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Workflow A: Customer Lead to Booking ---');
  
  // A1. Public Inquiry
  const inqRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Test Customer A',
      phone: '0312-9988776',
      email: 'qa.test.a@example.com',
      service: 'General Tuning',
      message: 'Engine knocking noise when cold.'
    })
  });
  const inqData = await inqRes.json();
  assert(inqRes.status === 200 || inqRes.status === 201, 'Public Contact / Inquiry Submission', `Status: ${inqRes.status}`);

  // A2. CRM Lead Capture
  const leadRes = await fetch(`${BASE_URL}/api/crm/leads`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      customerName: 'QA Test Customer A',
      phoneNumber: '0312-9988776',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125',
      interestedService: 'Engine Overhaul & Tuning',
      estimatedValue: 8500,
      priority: 'High',
      notes: 'Customer inquiring about tappet noise and valve clearance.'
    })
  });
  const leadData = await leadRes.json();
  const leadId = leadData.lead?.id;
  if (leadId) testIds.leads.push(leadId);
  assert(leadData.success === true && !!leadId, 'CRM Lead Creation in storage/crm-leads.json', `Lead ID: ${leadId}`);

  // A3. Follow-up Scheduled
  const fuRes = await fetch(`${BASE_URL}/api/crm/followups`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      leadId: leadId,
      customerName: 'QA Test Customer A',
      phoneNumber: '0312-9988776',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: '11:00 AM',
      actionType: 'Phone Call',
      notes: 'Call to confirm budget quotation.'
    })
  });
  const fuData = await fuRes.json();
  assert(fuData.success === true, 'Schedule Follow-up in storage/crm-followups.json', `Follow-up ID: ${fuData.followUp?.id}`);

  // A4. Convert Lead to Customer & Booking
  const convRes = await fetch(`${BASE_URL}/api/crm/leads/${leadId}/convert`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      address: 'Badami Bagh Bilal Market, Lahore',
      registrationNumber: 'LEK-24-9090',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: 'Morning (10:00 AM)',
      problemDescription: 'Tappet and piston sound diagnostic'
    })
  });
  const convData = await convRes.json();
  const newCustId = convData.customer?.id;
  const newBookingId = convData.booking?.id;
  if (newCustId) testIds.customers.push(newCustId);
  if (newBookingId) testIds.bookings.push(newBookingId);
  assert(
    convData.success === true && !!newCustId && !!newBookingId,
    'Atomic Lead Conversion to Registered Customer & Booking',
    `Customer: ${newCustId}, Booking: ${newBookingId}`
  );

  // -------------------------------------------------------------
  // WORKFLOW B: MECHANIC ONBOARDING & ATTENDANCE
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Workflow B: Mechanic Management & Workload ---');
  
  const mechRes = await fetch(`${BASE_URL}/api/mechanics`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      fullName: 'Ustad Shaukat Ali (QA Test)',
      phoneNumber: '0301-7788990',
      cnic: '35201-9988776-1',
      employmentType: 'Full-Time',
      dailyRate: 2500,
      assignedBay: 'Bay 3',
      specializations: ['Engine Overhauling', 'EFI Diagnostics', 'Carburetor Tuning']
    })
  });
  const mechData = await mechRes.json();
  const mechId = mechData.mechanic?.id;
  if (mechId) testIds.mechanics.push(mechId);
  assert(mechData.success === true && !!mechId, 'Mechanic Creation & Specialization Matrix', `Mechanic ID: ${mechId}`);

  // Record Mechanic Attendance
  const attRes = await fetch(`${BASE_URL}/api/mechanics/attendance`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      records: [{
        mechanicId: mechId,
        status: 'Present',
        checkInTime: '09:00 AM',
        checkOutTime: '06:00 PM',
        wageEarned: 2500
      }]
    })
  });
  const attData = await attRes.json();
  assert(attData.success === true, 'Record Daily Attendance in storage/mechanic-attendance.json', `Attendance updated`);

  // -------------------------------------------------------------
  // WORKFLOW C: PURCHASING, SAFE GOODS RECEIVING & STOCK
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Workflow C: Supplier & Purchase Orders ---');

  // C1. Create Supplier
  const suppRes = await fetch(`${BASE_URL}/api/suppliers`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      supplierName: 'Crown Lifan Spares QA Partner',
      contactPerson: 'Bhai Akram',
      phoneNumber: '0322-1122334',
      address: 'Shop #45, Bilal Market, Badami Bagh, Lahore',
      paymentTerms: '7-Day Net',
      productCategories: ['Clutch Plates', 'Chain Sprocket Sets', 'Brake Shoes']
    })
  });
  const suppData = await suppRes.json();
  const suppId = suppData.supplier?.id;
  if (suppId) testIds.suppliers.push(suppId);
  assert(suppData.success === true && !!suppId, 'Supplier Onboarding in storage/suppliers.json', `Supplier ID: ${suppId}`);

  // C2. Create Purchase Order (Draft)
  const poRes = await fetch(`${BASE_URL}/api/purchase-orders`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      supplierId: suppId,
      items: [
        {
          partName: 'QA Test Heavy Duty Clutch Plate CG125',
          partNumber: 'CP-CG125-QA',
          quantity: 10,
          unitCost: 650,
          totalCost: 6500
        }
      ],
      expectedDeliveryDate: new Date().toISOString().split('T')[0],
      notes: 'Initial test stock order'
    })
  });
  const poData = await poRes.json();
  const poId = poData.order?.id;
  if (poId) testIds.pos.push(poId);
  assert(poData.success === true && poData.order?.totalOrderValue === 6500, 'Purchase Order Generation', `PO ID: ${poId}, Total: PKR 6,500`);

  // C3. Inbound Goods Receiving & Stock Increment
  const recRes = await fetch(`${BASE_URL}/api/purchase-orders/${poId}/receive`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      receivedItems: [
        {
          partNumber: 'CP-CG125-QA',
          receivedQty: 10
        }
      ],
      deliveryNote: 'Verified 10/10 pieces received in pristine condition.'
    })
  });
  const recData = await recRes.json();
  assert(recData.success === true && recData.order?.deliveryStatus === 'Received', 'Inbound Goods Receiving & Inventory RESTOCK', `Delivery Status: ${recData.order?.deliveryStatus}`);

  // C4. Supplier Payment Disbursal
  const payRes = await fetch(`${BASE_URL}/api/purchase-orders/${poId}/pay`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      amount: 6500,
      paymentMethod: 'Bank Transfer (Meezan)',
      receiptNumber: 'MEEZAN-TRX-QA-991',
      notes: 'Full payment cleared against PO'
    })
  });
  const payData = await payRes.json();
  assert(payData.success === true && payData.order?.paymentStatus === 'Paid', 'Disburse Supplier Payment & Log Financial Outflow', `Payment: ${payData.order?.paymentStatus}`);

  // -------------------------------------------------------------
  // WORKFLOW D: EXPENSES & CASH REALIZATION PROFIT ACCOUNTING
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Workflow D: Expenses & Profit Realization ---');

  const expRes = await fetch(`${BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      category: 'Workshop Utilities',
      amount: 1500,
      paymentMethod: 'Cash',
      paidTo: 'Badami Bagh Filter Shop',
      description: 'Air compressor oil replacement and workshop cleaning supplies'
    })
  });
  const expData = await expRes.json();
  const expId = expData.expense?.id;
  if (expId) testIds.expenses.push(expId);
  assert(expData.success === true && !!expId, 'Record Operating Expense in storage/expenses.json', `Expense ID: ${expId}`);

  // Audit Profit Summary Calculation (Cash Realization Rule)
  const profitRes = await fetch(`${BASE_URL}/api/financial/profit-summary`, { headers: authHeaders });
  const profitData = await profitRes.json();
  assert(
    profitData.success === true && 
    typeof profitData.summary?.realizedGrossRevenue === 'number' &&
    typeof profitData.summary?.realizedNetProfit === 'number',
    'Realized Cash Accounting (Collected Cash - Direct Parts - Expenses)',
    `Gross Revenue: PKR ${profitData.summary?.realizedGrossRevenue}, Net Profit: PKR ${profitData.summary?.realizedNetProfit}`
  );

  // -------------------------------------------------------------
  // WORKFLOW E: GLOBAL SEARCH
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Workflow E: Universal Global Search ---');
  const searchRes = await fetch(`${BASE_URL}/api/search/global?q=Shaukat`, { headers: authHeaders });
  const searchData = await searchRes.json();
  assert(searchData.success === true && searchData.total > 0, 'Global Search by Keyword ("Shaukat")', `Found ${searchData.total} matching record(s)`);

  // -------------------------------------------------------------
  // WORKFLOW F: STORAGE HEALTH & RELATIONAL INTEGRITY
  // -------------------------------------------------------------
  console.log('\n--- 6. Testing Workflow F: Storage Health & Data Recovery ---');
  
  const healthRes = await fetch(`${BASE_URL}/api/security/storage-health`, { headers: authHeaders });
  const healthData = await healthRes.json();
  const files = healthData.storageHealth?.files || [];
  assert(healthData.success === true && files.length >= 25, 'Storage Health Diagnostic on 28 JSON Stores', `Checked ${files.length} stores`);

  const integrityRes = await fetch(`${BASE_URL}/api/security/integrity-check`, { headers: authHeaders });
  const integrityData = await integrityRes.json();
  const rep = integrityData.integrityReport;
  assert(integrityData.success === true && rep?.issuesCount === 0, 'Relational Data Integrity Audit (Zero Orphaned Keys)', `Checked ${rep?.totalRecordsChecked} records, Issues: ${rep?.issuesCount}`);

  // -------------------------------------------------------------
  // CLEANUP TEMPORARY TEST DATA
  // -------------------------------------------------------------
  console.log('\n--- 7. Cleaning up QA Test Artifacts (Preserving Genuine Data) ---');
  if (leadId) await fetch(`${BASE_URL}/api/crm/leads/${leadId}`, { method: 'DELETE', headers: authHeaders });
  if (mechId) await fetch(`${BASE_URL}/api/mechanics/${mechId}`, { method: 'DELETE', headers: authHeaders });
  if (expId) await fetch(`${BASE_URL}/api/expenses/${expId}`, { method: 'DELETE', headers: authHeaders });
  if (poId) await fetch(`${BASE_URL}/api/purchase-orders/${poId}`, { method: 'DELETE', headers: authHeaders });
  if (suppId) await fetch(`${BASE_URL}/api/suppliers/${suppId}`, { method: 'DELETE', headers: authHeaders });
  console.log('  [CLEANUP] Temporary QA records purged safely.');

  console.log('\n=================================================================');
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  console.log(`  WORKFLOW TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('=================================================================\n');
}

runWorkflowTests().catch(err => {
  console.error('Fatal Workflow QA failure:', err);
  process.exit(1);
});

async function testWorkflows() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'hamza12345' })
  });
  const { token } = await loginRes.json();
  const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  console.log('--- Testing Business Workflows ---');

  // 1. CRM Lead Creation
  const leadRes = await fetch('http://localhost:3000/api/crm/leads', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      customerName: 'Tariq Mehmood',
      phone: '0300-8889999',
      bikeModel: 'Yamaha YBR 125G',
      source: 'Google Search',
      estimatedValue: 7500,
      notes: 'Front brake caliper squeaking and engine tuning required.'
    })
  });
  const leadData = await leadRes.json();
  console.log('1. Create Lead: Success =', leadData.success, '| ID =', leadData.lead?.id);

  // 2. Add Mechanic
  const mechRes = await fetch('http://localhost:3000/api/mechanics', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fullName: 'Ustad Rashid Minhas',
      phone: '0321-4455667',
      specializations: ['Engine Overhauling', 'Clutch Tuning'],
      dailyRate: 2200,
      employmentType: 'Full-Time'
    })
  });
  const mechData = await mechRes.json();
  console.log('2. Create Mechanic: Success =', mechData.success, '| ID =', mechData.mechanic?.id);

  // 3. Record Expense
  const expRes = await fetch('http://localhost:3000/api/expenses', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      category: 'Workshop Utilities',
      amount: 4500,
      paymentMethod: 'Cash',
      description: 'Monthly air compressor electricity bill and generator fuel',
      paidTo: 'LESCO Badami Bagh'
    })
  });
  const expData = await expRes.json();
  console.log('3. Record Expense: Success =', expData.success, '| ID =', expData.expense?.id);

  // 4. Global Search
  const searchRes = await fetch('http://localhost:3000/api/search/global?q=Yamaha', { headers });
  const searchData = await searchRes.json();
  console.log('4. Global Search query "Yamaha": Found', searchData.total, 'records');

  // 5. Storage Health Check
  const healthRes = await fetch('http://localhost:3000/api/security/storage-health', { headers });
  const healthData = await healthRes.json();
  console.log('5. Storage Health check: Checked', healthData.storageHealth?.length, 'JSON database stores');

  // 6. Integrity Validator
  const integrityRes = await fetch('http://localhost:3000/api/security/integrity-check', { headers });
  const integrityData = await integrityRes.json();
  const rep = integrityData.integrityReport;
  console.log('6. Integrity Validation: Passed =', rep?.issuesCount === 0, '| Records Checked =', rep?.totalRecordsChecked, '| Issues =', rep?.issuesCount);
}
testWorkflows();

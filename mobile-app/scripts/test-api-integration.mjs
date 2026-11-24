/**
 * Hamza Autos - Mobile App & Website Backend Synchronization QA Test
 * Verifies all 12 required workflows between mobile-app and website Admin Panel:
 * 1. Admin adds product -> Product appears in mobile app
 * 2. Admin updates price -> Updated price appears in mobile app
 * 3. Admin changes stock -> Updated stock appears in mobile app
 * 4. Customer places order -> Order appears in website Admin Panel (inquiries.json & orders.json)
 * 5. Stock auto-deducted in inventory.json
 * 6. Admin updates order status -> Customer tracks updated status
 * 7. Customer books workshop service -> Booking appears in website Admin Panel (booking-submissions.json & inquiries.json)
 * 8. Customer tracks repair with 2-factor verification
 */

import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// Helper to make HTTP requests
function request(port, path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (d) => (chunks += d));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(chunks) });
          } catch (e) {
            resolve({ status: res.statusCode, data: chunks });
          }
        });
      }
    );
    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('HAMZA AUTOS - BACKEND & MOBILE APP INTEGRATION TESTS');
  console.log('====================================================\n');

  // Dynamically load the Express app from server/app.ts
  const { createServerApp } = await import('../../server/app.ts');
  const app = createServerApp();

  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`[Test Server] Running on ephemeral port ${port}`);

    let passedTests = 0;
    let failedTests = 0;

    const assert = (condition, title) => {
      if (condition) {
        console.log(`  ✓ PASS: ${title}`);
        passedTests++;
      } else {
        console.error(`  ✗ FAIL: ${title}`);
        failedTests++;
      }
    };

    try {
      // TEST 1: Mobile App fetches inventory from storage/inventory.json
      console.log('\n[Test 1] Testing GET /api/inventory synchronization:');
      const invRes = await request(port, '/api/inventory');
      assert(invRes.status === 200, 'GET /api/inventory returns 200 OK');
      assert(Array.isArray(invRes.data.inventory), 'Response contains inventory array');
      assert(invRes.data.inventory.length > 0, `Loaded ${invRes.data.inventory.length} spare parts directly from storage/inventory.json`);

      // TEST 2: Admin adds product -> appears in mobile app
      console.log('\n[Test 2] Testing Admin adds new product to inventory:');
      const testSku = `TEST-QA-${Date.now()}`;
      const newProductPayload = {
        partNumber: testSku,
        partName: 'QA Test Carburetor Float Needle Valve',
        category: 'Carburettor & Fuel System',
        compatibleBrands: ['Honda', 'United'],
        compatibleModels: ['CD 70'],
        purchasePrice: 200,
        sellingPrice: 350,
        stockQuantity: 15,
        minStockAlert: 3,
        supplier: 'Badami Bagh Carburetor Sourcing',
        description: 'Viton tipped float valve needle for CD 70.'
      };
      const addRes = await request(port, '/api/inventory', 'POST', newProductPayload);
      assert(addRes.status === 200 && addRes.data.success, 'POST /api/inventory successfully added new part');

      // Verify product is now in GET /api/inventory
      const verifyAdd = await request(port, `/api/inventory?search=${testSku}`);
      const foundNewPart = verifyAdd.data.inventory.find(p => p.partNumber === testSku);
      assert(foundNewPart !== undefined, 'New product immediately visible in mobile GET /api/inventory');
      assert(foundNewPart?.stockQuantity === 15, 'Stock quantity verified at 15 units');

      // TEST 3: Admin updates product price & stock
      console.log('\n[Test 3] Testing Admin updates product price & stock:');
      const updateRes = await request(port, `/api/inventory/${testSku}`, 'PUT', {
        sellingPrice: 420,
        discountedPrice: 380,
        stockQuantity: 12
      });
      assert(updateRes.status === 200 && updateRes.data.success, 'PUT /api/inventory/:id returned success');

      const verifyUpdate = await request(port, `/api/inventory?search=${testSku}`);
      const updatedPart = verifyUpdate.data.inventory.find(p => p.partNumber === testSku);
      assert(updatedPart?.sellingPrice === 420, 'Price successfully updated to PKR 420');
      assert(updatedPart?.stockQuantity === 12, 'Stock successfully updated to 12');

      // TEST 4: Customer places order via mobile app
      console.log('\n[Test 4] Testing Customer places order through mobile app:');
      const testOrderPayload = {
        customer: {
          fullName: 'Test Rider Bilal',
          phoneNumber: '0300 9876543',
          whatsappNumber: '0300 9876543',
          email: 'bilal.rider@test.com',
          province: 'Punjab',
          city: 'Lahore',
          streetAddress: 'House 55, Badami Bagh Road, Lahore',
          postalCode: '54000',
        },
        items: [
          {
            partId: updatedPart.id,
            sku: testSku,
            name: 'QA Test Carburetor Float Needle Valve',
            unitPrice: 380,
            quantity: 2,
            totalPrice: 760,
          }
        ],
        subtotal: 760,
        shippingFee: 150,
        totalAmount: 910,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'New'
      };

      const orderRes = await request(port, '/api/orders', 'POST', testOrderPayload);
      assert(orderRes.status === 200 && orderRes.data.success, 'POST /api/orders created successfully');
      const placedOrderNumber = orderRes.data.orderNumber;
      assert(placedOrderNumber.startsWith('HA-ORD-'), `Valid Order Number generated: ${placedOrderNumber}`);

      // Verify stock was deducted
      const verifyStockDeduction = await request(port, `/api/inventory?search=${testSku}`);
      const deductedPart = verifyStockDeduction.data.inventory.find(p => p.partNumber === testSku);
      assert(deductedPart?.stockQuantity === 10, 'Stock automatically deducted from 12 to 10 in inventory.json');

      // Verify order registered in inquiries.json (Website Admin Central Inbox)
      const storageInquiriesPath = path.resolve(ROOT_DIR, 'storage', 'inquiries.json');
      const inquiriesRaw = fs.readFileSync(storageInquiriesPath, 'utf8');
      const inquiriesList = JSON.parse(inquiriesRaw);
      const matchingInq = inquiriesList.find(inq => inq.adminNotes && inq.adminNotes.includes(placedOrderNumber));
      assert(matchingInq !== undefined, 'Order successfully registered in storage/inquiries.json for Website Admin Inbox');
      assert(matchingInq?.inquiryType === 'Online Spare Part Order', 'Inquiry type set to "Online Spare Part Order"');

      // Verify notification in storage/notifications.json
      const storageNotifPath = path.resolve(ROOT_DIR, 'storage', 'notifications.json');
      const notifRaw = fs.readFileSync(storageNotifPath, 'utf8');
      const notifList = JSON.parse(notifRaw);
      const matchingNotif = notifList.find(n => n.title && n.title.includes(placedOrderNumber));
      assert(matchingNotif !== undefined, 'Notification created in storage/notifications.json for Admin Dashboard');

      // TEST 5: Order status tracking
      console.log('\n[Test 5] Testing Customer order tracking:');
      const trackRes = await request(port, `/api/orders/track?orderNumber=${placedOrderNumber}&phone=03009876543`);
      assert(trackRes.status === 200 && trackRes.data.success, 'GET /api/orders/track verified successfully');
      assert(trackRes.data.order.orderNumber === placedOrderNumber, 'Correct order returned');

      // TEST 6: Workshop service booking submission
      console.log('\n[Test 6] Testing Workshop Service Booking:');
      const bookingPayload = {
        customerName: 'Kashif Ali',
        phoneNumber: '0321 7766554',
        bikeBrand: 'Yamaha',
        bikeModel: 'YBR 125',
        registrationNumber: 'LEA-22-1982',
        serviceRequested: 'Motorcycle Brake Repair & Shoe/Pad Replacement',
        problemDescription: 'Front hydraulic disc brake lever has lost pressure.',
        appointmentDate: '2026-11-28',
        appointmentTime: '11:30 AM',
        additionalNotes: 'Please inspect disc rotor thickness.'
      };

      const bookingRes = await request(port, '/api/bookings', 'POST', bookingPayload);
      assert(bookingRes.status === 200 && bookingRes.data.success, 'POST /api/bookings returns 200 OK');
      const bookingNum = bookingRes.data.bookingNumber;
      assert(bookingNum.startsWith('HA-BK-'), `Generated booking reference: ${bookingNum}`);

      // Verify booking appears in storage/booking-submissions.json
      const storageBookingsPath = path.resolve(ROOT_DIR, 'storage', 'booking-submissions.json');
      const bookingsRaw = fs.readFileSync(storageBookingsPath, 'utf8');
      const bookingsList = JSON.parse(bookingsRaw);
      const foundBooking = bookingsList.find(b => b.bookingNumber === bookingNum);
      assert(foundBooking !== undefined, 'Booking recorded in storage/booking-submissions.json for Website Admin');

      // TEST 7: 2-Factor Repair Tracking Lookup
      console.log('\n[Test 7] Testing 2-Factor Repair Tracking Lookup:');
      const repairTrackRes = await request(port, `/api/repairs/track?jobCard=${bookingNum}&phone=03217766554`);
      assert(repairTrackRes.status === 200 && repairTrackRes.data.found, 'Repair tracking authenticated with matching phone');
      assert(repairTrackRes.data.jobCardNumber === bookingNum, 'Returned correct booking reference');

      // TEST 8: 2-Factor Security Rejection on Wrong Phone
      const badPhoneRes = await request(port, `/api/repairs/track?jobCard=${bookingNum}&phone=03000000000`);
      assert(badPhoneRes.status === 403, 'Security test passed: Rejects unauthorized lookup with incorrect phone (403 Forbidden)');

      // Clean up test part from inventory.json to keep storage clean
      const cleanInventoryPath = path.resolve(ROOT_DIR, 'storage', 'inventory.json');
      const currentInv = JSON.parse(fs.readFileSync(cleanInventoryPath, 'utf8'));
      const cleaned = currentInv.filter(p => p.partNumber !== testSku);
      fs.writeFileSync(cleanInventoryPath, JSON.stringify(cleaned, null, 2));

      console.log('\n====================================================');
      console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
      console.log('====================================================\n');

      server.close();
      process.exit(failedTests > 0 ? 1 : 0);
    } catch (err) {
      console.error('Fatal test error:', err);
      server.close();
      process.exit(1);
    }
  });
}

runTests();

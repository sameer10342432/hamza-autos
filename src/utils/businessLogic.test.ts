import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  buildWhatsAppLink, 
  validatePakistaniPhone, 
  validateLeadSubmission,
  generateServiceJsonLd,
  loginAdmin,
  logoutAdmin,
  isAdminLoggedIn,
  getStoredSettings,
  saveStoredSettings,
  getStoredServices,
  saveStoredServices,
  getStoredLeads,
  deleteLead
} from './businessLogic';
import { SERVICES_LIST } from '../data/businessData';

test('buildWhatsAppLink generates correct default URL when no options provided', () => {
  const url = buildWhatsAppLink();
  assert.match(url, /^https:\/\/wa\.me\/923251814548\?text=/);
  assert.ok(url.includes('Hello%20Hamza%20Autos'));
});

test('buildWhatsAppLink encodes bike brand, model, and service correctly', () => {
  const url = buildWhatsAppLink({
    name: 'Ali Khan',
    brand: 'Honda',
    model: 'CG 125',
    service: 'Motorcycle Engine Repair',
    problem: 'Tappet noise and smoke'
  });
  assert.ok(url.includes('923251814548'));
  assert.ok(url.includes('Ali%20Khan'));
  assert.ok(url.includes('CG%20125'));
  assert.ok(url.includes('Motorcycle%20Engine%20Repair'));
});

test('validatePakistaniPhone recognizes valid formats and normalizes them', () => {
  const res1 = validatePakistaniPhone('03251814548');
  assert.equal(res1.isValid, true);
  assert.equal(res1.normalized, '+923251814548');

  const res2 = validatePakistaniPhone('+92 325 1814548');
  assert.equal(res2.isValid, true);
  assert.equal(res2.normalized, '+923251814548');

  const res3 = validatePakistaniPhone('03001234567');
  assert.equal(res3.isValid, true);
  assert.equal(res3.normalized, '+923001234567');

  const resInvalid = validatePakistaniPhone('12345');
  assert.equal(resInvalid.isValid, false);
  assert.ok(resInvalid.error);
});

test('validateLeadSubmission checks required customer name, phone, and service', () => {
  const valid = validateLeadSubmission({
    customerName: 'Muhammad Rizwan',
    phoneNumber: '03211234567',
    serviceRequested: 'Bike Tuning'
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);

  const invalid = validateLeadSubmission({
    customerName: '',
    phoneNumber: 'bad-number',
    serviceRequested: ''
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.customerName);
  assert.ok(invalid.errors.phoneNumber);
  assert.ok(invalid.errors.serviceRequested);
});

test('validateLeadSubmission rejects automated bot submissions with honeypot trap', () => {
  const spam = validateLeadSubmission({
    customerName: 'Spam Bot',
    phoneNumber: '03001234567',
    serviceRequested: 'Bike Tuning',
    honeypot: 'http://spam-link.com'
  });
  assert.equal(spam.isValid, false);
  assert.equal(spam.errors.honeypot, 'Automated submission detected');
});

test('generateServiceJsonLd produces valid Schema.org Service payload', () => {
  const service = SERVICES_LIST[0];
  const schema = generateServiceJsonLd(service);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'Service');
  assert.equal(schema.name, service.title);
  assert.equal(schema.provider['@type'], 'AutoRepair');
  assert.equal(schema.provider.name, 'Hamza Autos');
});

test('admin authentication correctly verifies password and rejects invalid credentials', () => {
  const badLogin = loginAdmin('wrong-password');
  assert.equal(badLogin.success, false);
  assert.ok(badLogin.error);

  const goodLogin = loginAdmin('HamzaAutos2026!');
  assert.equal(goodLogin.success, true);
});

test('services and site settings return valid default objects and can be retrieved', () => {
  const services = getStoredServices();
  assert.ok(Array.isArray(services));
  assert.ok(services.length >= 13);

  const settings = getStoredSettings();
  assert.equal(settings.businessName, 'Hamza Autos');
  assert.ok(settings.phone.includes('325 1814548'));
});

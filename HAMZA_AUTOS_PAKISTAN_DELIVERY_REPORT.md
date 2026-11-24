# HAMZA AUTOS – NATIONWIDE PAKISTAN DELIVERY MANAGEMENT REPORT

**Author:** Antigravity Logistics & E-Commerce Infrastructure Team  
**Scope:** Provincial Coverage, City Mapping, Shipping Rates & Courier Integration  
**Storage Reference:** `storage/shop-shipping.json`, `src/data/pakistanLocations.ts`  
**Date:** November 2026  

---

## 1. Nationwide Geographic Coverage

The Hamza Autos online shop covers all 7 provinces and administrative regions of Pakistan. Customers can select their province and city using a searchable dropdown:

### 1. Punjab
- **Hub Cities (1–2 Days):** Lahore, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, Bahawalpur, Sargodha, Sheikhupura, Gujrat, Kasur, Sahiwal, Okara, Jhelum, Rahim Yar Khan.
- **Secondary Towns (2–3 Days):** Attock, Chakwal, Mianwali, Khanewal, Vehari, Muzaffargarh, Dera Ghazi Khan, Chiniot, Hafizabad, Mandi Bahauddin, Bahawalnagar, Lodhran, Pakpattan, Toba Tek Singh, Layyah, Bhakkar.

### 2. Sindh
- **Hub Cities (2–3 Days):** Karachi, Hyderabad, Sukkur, Larkana.
- **Secondary Towns (3–4 Days):** Mirpur Khas, Nawabshah (Shaheed Benazirabad), Thatta, Badin, Jacobabad, Shikarpur, Khairpur, Ghotki, Dadu, Jamshoro, Umerkot.

### 3. Khyber Pakhtunkhwa (KPK)
- **Hub Cities (2–3 Days):** Peshawar, Mardan, Abbottabad, Swat (Mingora).
- **Secondary Towns (3–5 Days):** Dera Ismail Khan, Kohat, Bannu, Haripur, Mansehra, Nowshera, Charsadda, Swabi, Malakand, Dir, Chitral.

### 4. Balochistan
- **Hub Cities (3–4 Days):** Quetta, Gwadar.
- **Secondary Towns (4–6 Days):** Hub, Khuzdar, Turbat, Sibi, Loralai, Chaman, Zhob, Jaffarabad, Nasirabad.

### 5. Islamabad Capital Territory
- **Cities (1–2 Days):** Islamabad (All sectors: F, G, H, I, Bahria Town, DHA, PWD).

### 6. Azad Jammu & Kashmir (AJK)
- **Cities (2–4 Days):** Muzaffarabad, Mirpur, Rawalakot, Kotli, Bhimber, Bagh.

### 7. Gilgit-Baltistan
- **Cities (3–6 Days):** Gilgit, Skardu, Hunza (Karimabad), Diamer (Chilas), Ghizer, Ghanche.

---

## 2. Shipping Rates & Free Delivery Threshold

Shipping policy is stored in `storage/shop-shipping.json` and managed via the Admin Panel (`Shop Management -> Shipping & Delivery`):

```json
{
  "standardRate": 250,
  "lahoreLocalRate": 150,
  "freeShippingThreshold": 3500,
  "freeShippingEnabled": true,
  "codAvailableAllPakistan": true,
  "estimatedDeliveryText": "2 to 4 working days across Pakistan",
  "lahoreDeliveryText": "Same Day / Next Day delivery in Lahore",
  "courierPartners": [
    {
      "id": "tcs",
      "name": "TCS Express Pakistan",
      "trackingUrlTemplate": "https://www.tcsexpress.com/track/{trackingNumber}",
      "isActive": true
    },
    {
      "id": "leopards",
      "name": "Leopards Courier Service",
      "trackingUrlTemplate": "https://leopardscourier.com/tracking?track={trackingNumber}",
      "isActive": true
    },
    {
      "id": "postex",
      "name": "PostEx Pakistan",
      "trackingUrlTemplate": "https://postex.pk/tracking?cn={trackingNumber}",
      "isActive": true
    },
    {
      "id": "trax",
      "name": "Trax Logistics",
      "trackingUrlTemplate": "https://trax.pk/tracking?tracking_number={trackingNumber}",
      "isActive": true
    },
    {
      "id": "hamza_express",
      "name": "Hamza Autos Local Workshop Delivery (Lahore)",
      "isActive": true
    }
  ]
}
```

### Rate Calculation Rules:
1. **Free Delivery:** If order subtotal $\ge$ PKR 3,500, delivery fee is PKR 0 nationwide.
2. **Lahore Local Delivery:** Orders delivered within Lahore have a reduced shipping rate of PKR 150.
3. **Nationwide Delivery:** Orders under PKR 3,500 outside Lahore incur a standard flat fee of PKR 250.
4. **Interactive Free Shipping Bar:** The shopping cart features a dynamic progress bar notifying customers:  
   *"Add PKR XXX more to unlock FREE Nationwide Delivery!"*

---

## 3. Courier Dispatch & Real-Time Tracking

When orders are dispatched, workshop staff enter the courier name and tracking code in the Admin Panel. 

Customers can track their parcel 24/7 on the public `/shop/track-order` page using either:
- **Order Number:** `HA-SHOP-YYYY-XXXX`
- **Mobile Number:** Cleaned Pakistani phone format (e.g. `03001234567`)

The tracking page provides:
- Live multi-step delivery status timeline:
  1. `Order Placed`
  2. `Order Confirmed & Prepared`
  3. `Handed over to Courier`
  4. `In Transit across Pakistan`
  5. `Delivered to Customer`
- Courier partner name and clickable tracking URL (TCS, Leopards, PostEx, Trax).
- Estimated delivery window for the destination city.
- Order contents breakdown and payable balance.

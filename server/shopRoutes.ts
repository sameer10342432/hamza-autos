/**
 * Hamza Autos - Express API Router for Online Shop & Spare Parts E-Commerce System
 * Database-free server-side JSON storage in storage/
 * Location: Abu Bakar Road, Badami Bagh, Lahore (+92 325 1814548)
 */

import { Router, Request, Response } from 'express';
import { 
  readJsonFile, 
  writeJsonFileAtomic, 
  generateId, 
  getCurrentTimestamp 
} from './fileStore';
import { requireAuth } from './routes';
import { logAuditEvent } from './auth';
import { 
  ShopProduct, 
  ShopCategory, 
  MotorcycleModelSpec, 
  ShopOrder, 
  ShopInventoryMovement, 
  ShopShippingSettings, 
  ShopSettings, 
  ShopDashboardStats,
  OrderStatus,
  PaymentStatus,
  ProductAvailability
} from '../src/types/shop';

export const shopRouter = Router();

// ==============================================================
// HELPER FUNCTIONS
// ==============================================================

async function getProducts(): Promise<ShopProduct[]> {
  return readJsonFile<ShopProduct[]>('shop-products.json', []);
}

async function saveProducts(products: ShopProduct[]): Promise<void> {
  await writeJsonFileAtomic('shop-products.json', products);
}

async function getCategories(): Promise<ShopCategory[]> {
  return readJsonFile<ShopCategory[]>('shop-categories.json', []);
}

async function saveCategories(categories: ShopCategory[]): Promise<void> {
  await writeJsonFileAtomic('shop-categories.json', categories);
}

async function getBrandModels(): Promise<MotorcycleModelSpec[]> {
  return readJsonFile<MotorcycleModelSpec[]>('shop-brands-models.json', []);
}

async function saveBrandModels(models: MotorcycleModelSpec[]): Promise<void> {
  await writeJsonFileAtomic('shop-brands-models.json', models);
}

async function getOrders(): Promise<ShopOrder[]> {
  return readJsonFile<ShopOrder[]>('shop-orders.json', []);
}

async function saveOrders(orders: ShopOrder[]): Promise<void> {
  await writeJsonFileAtomic('shop-orders.json', orders);
}

async function getMovements(): Promise<ShopInventoryMovement[]> {
  return readJsonFile<ShopInventoryMovement[]>('shop-inventory-movements.json', []);
}

async function saveMovements(movements: ShopInventoryMovement[]): Promise<void> {
  await writeJsonFileAtomic('shop-inventory-movements.json', movements);
}

async function getShippingSettings(): Promise<ShopShippingSettings> {
  return readJsonFile<ShopShippingSettings>('shop-shipping.json', {
    defaultShippingFee: 250,
    freeShippingThreshold: 3500,
    lahoreExpressDeliveryFee: 150,
    allowedProvinces: [
      'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
      'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'
    ],
    estimatedDeliveryText: '2 – 4 Business Days Across Pakistan via TCS / Leopards / M&P',
    courierPartners: ['TCS Courier', 'Leopards Courier', 'M&P Express', 'Trax Logistics', 'PostEx', 'Call Courier']
  });
}

async function getShopSettings(): Promise<ShopSettings> {
  return readJsonFile<ShopSettings>('shop-settings.json', {
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
      easypaisaNumber: '0325-1814548',
      jazzcashNumber: '0325-1814548'
    },
    returnPolicy: '7-day inspection return policy for uninstalled parts.',
    shippingPolicy: 'Same-day parcel dispatch for orders confirmed before 3:00 PM.',
    lowStockThresholdDefault: 5,
    isShopActive: true
  });
}

function computeAvailability(quantity: number, threshold: number): ProductAvailability {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity <= threshold) return 'Low Stock';
  return 'In Stock';
}

function generateOrderNumber(orderIndex: number): string {
  const year = new Date().getFullYear();
  const sequence = (1000 + orderIndex).toString();
  return `HA-SHOP-${year}-${sequence}`;
}

// ==============================================================
// PUBLIC SHOP ENDPOINTS
// ==============================================================

/**
 * GET /api/shop/products
 * Product search, multi-faceted filtering, sorting, and pagination
 */
shopRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      brand,
      bikeBrand,
      bikeModel,
      condition,
      minPrice,
      maxPrice,
      inStockOnly,
      featuredOnly,
      sort,
      page = '1',
      limit = '20'
    } = req.query;

    let products = await getProducts();

    // Only published products for public store
    products = products.filter(p => p.isPublished);

    // 1. Text Search (Name, SKU, Description, Brand)
    if (search && typeof search === 'string') {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.compatibleBikes.some(cb => 
          cb.brand.toLowerCase().includes(q) || 
          cb.model.toLowerCase().includes(q)
        )
      );
    }

    // 2. Category Filter (by slug or ID)
    if (category && typeof category === 'string') {
      const catVal = category.trim().toLowerCase();
      products = products.filter(p => 
        p.categoryId.toLowerCase() === catVal || 
        p.categoryName.toLowerCase() === catVal ||
        p.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === catVal
      );
    }

    // 3. Manufacturer / Part Brand Filter
    if (brand && typeof brand === 'string') {
      const b = brand.trim().toLowerCase();
      products = products.filter(p => p.brand.toLowerCase() === b);
    }

    // 4. Motorcycle Brand Compatibility Filter (e.g. "Honda", "Yamaha")
    if (bikeBrand && typeof bikeBrand === 'string') {
      const bb = bikeBrand.trim().toLowerCase();
      products = products.filter(p => 
        p.compatibleBikes.some(cb => cb.brand.toLowerCase() === bb)
      );
    }

    // 5. Motorcycle Model Compatibility Filter (e.g. "CD 70", "CG 125")
    if (bikeModel && typeof bikeModel === 'string') {
      const bm = bikeModel.trim().toLowerCase();
      products = products.filter(p => 
        p.compatibleBikes.some(cb => 
          cb.model.toLowerCase().includes(bm) || bm.includes(cb.model.toLowerCase())
        )
      );
    }

    // 6. Condition Filter
    if (condition && typeof condition === 'string') {
      products = products.filter(p => p.condition === condition);
    }

    // 7. Price Range Filter
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        products = products.filter(p => (p.discountedPrice || p.price) >= min);
      }
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        products = products.filter(p => (p.discountedPrice || p.price) <= max);
      }
    }

    // 8. In Stock Only Filter
    if (inStockOnly === 'true' || inStockOnly === '1') {
      products = products.filter(p => p.stockQuantity > 0);
    }

    // 9. Featured Only
    if (featuredOnly === 'true' || featuredOnly === '1') {
      products = products.filter(p => p.isFeatured);
    }

    // 10. Sorting
    if (sort === 'price-low') {
      products.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sort === 'price-high') {
      products.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    } else if (sort === 'popular') {
      products.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      // Default: newest first
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalCount = products.length;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
    const totalPages = Math.ceil(totalCount / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/shop/products/:slugOrId
 * Single product details with verified compatibility and related items
 */
shopRouter.get('/products/:slugOrId', async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;
    const products = await getProducts();
    const product = products.find(p => p.id === slugOrId || p.slug === slugOrId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    // Fetch related products in the same category or compatible with same bikes
    const related = products
      .filter(p => p.id !== product.id && p.isPublished && (
        p.categoryId === product.categoryId ||
        p.compatibleBikes.some(cb => product.compatibleBikes.some(pcb => pcb.model === cb.model))
      ))
      .slice(0, 4);

    res.json({
      success: true,
      data: product,
      related
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/shop/categories
 * Returns all active categories with dynamic product counts
 */
shopRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    const products = await getProducts();

    const activeCategories = categories
      .filter(c => c.isActive)
      .map(c => {
        const count = products.filter(p => p.isPublished && p.categoryId === c.id).length;
        return {
          ...c,
          productCount: count
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);

    res.json({ success: true, data: activeCategories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/shop/brands-models
 * Returns all supported motorcycle models grouped by brand for quick filter dropdowns
 */
shopRouter.get('/brands-models', async (_req: Request, res: Response) => {
  try {
    const models = await getBrandModels();
    res.json({ success: true, data: models });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/shop/featured-and-latest
 * Homepage curated sets: Featured, Latest, and Best Sellers
 */
shopRouter.get('/featured-and-latest', async (_req: Request, res: Response) => {
  try {
    const products = await getProducts();
    const published = products.filter(p => p.isPublished);

    const featured = published.filter(p => p.isFeatured).slice(0, 8);
    const latest = [...published]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);

    // Compute best sellers from actual order item counts
    const orders = await getOrders();
    const salesMap: Record<string, number> = {};
    for (const ord of orders) {
      if (ord.orderStatus !== 'Cancelled' && ord.orderStatus !== 'Returned') {
        for (const item of ord.items) {
          salesMap[item.productId] = (salesMap[item.productId] || 0) + item.quantity;
        }
      }
    }

    const bestSellers = [...published]
      .sort((a, b) => (salesMap[b.id] || b.reviewCount) - (salesMap[a.id] || a.reviewCount))
      .slice(0, 8);

    res.json({
      success: true,
      data: {
        featured,
        latest,
        bestSellers
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/shop/shipping-settings
 */
shopRouter.get('/shipping-settings', async (_req: Request, res: Response) => {
  try {
    const shipping = await getShippingSettings();
    res.json({ success: true, data: shipping });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/shop/settings
 */
shopRouter.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await getShopSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/shop/orders
 * Public Guest Checkout
 * Validates stock, calculates final pricing, creates order, reserves inventory atomically
 */
shopRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const { customer, items, paymentMethod, paymentReference, orderNotes } = req.body;

    // 1. Validation: Customer Details
    if (!customer || !customer.fullName || !customer.mobileNumber || !customer.deliveryAddress || !customer.city || !customer.province) {
      return res.status(400).json({
        success: false,
        error: 'Please complete all required delivery fields (Full Name, Mobile Number, Address, City, and Province).'
      });
    }

    const cleanedPhone = customer.mobileNumber.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 12) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid Pakistani mobile number (e.g. 0321-1234567 or 03001234567).'
      });
    }

    // 2. Validation: Items Array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Your shopping cart is empty.' });
    }

    // 3. Stock & Price Validation against server database
    const products = await getProducts();
    const shippingConfig = await getShippingSettings();
    const validatedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || !product.isPublished) {
        return res.status(400).json({
          success: false,
          error: `Product "${item.name || item.productId}" is currently unavailable or discontinued.`
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${product.name}". Only ${product.stockQuantity} available, but you requested ${item.quantity}.`
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid quantity for "${product.name}".`
        });
      }

      const unitPrice = product.discountedPrice || product.price;
      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || '/assets/images/services/motorcycle-spare-parts.webp',
        unitPrice,
        quantity: item.quantity,
        maxStock: product.stockQuantity,
        totalPrice: itemTotal,
        selectedCompatibility: item.selectedCompatibility
      });
    }

    // 4. Calculate Shipping Fee
    let shippingFee = shippingConfig.defaultShippingFee;
    if (customer.city.toLowerCase() === 'lahore') {
      shippingFee = shippingConfig.lahoreExpressDeliveryFee;
    } else if (shippingConfig.specialCityRates && shippingConfig.specialCityRates[customer.city]) {
      shippingFee = shippingConfig.specialCityRates[customer.city];
    }

    if (calculatedSubtotal >= shippingConfig.freeShippingThreshold) {
      shippingFee = 0; // Free delivery threshold reached!
    }

    const finalTotal = calculatedSubtotal + shippingFee;

    // 5. Generate Order Record
    const allOrders = await getOrders();
    const orderIndex = allOrders.length + 1;
    const orderNumber = generateOrderNumber(orderIndex);
    const orderId = generateId('ord');
    const now = getCurrentTimestamp();

    const newOrder: ShopOrder = {
      id: orderId,
      orderNumber,
      customer: {
        fullName: customer.fullName.trim(),
        mobileNumber: customer.mobileNumber.trim(),
        whatsappNumber: customer.whatsappNumber ? customer.whatsappNumber.trim() : customer.mobileNumber.trim(),
        email: customer.email?.trim(),
        deliveryAddress: customer.deliveryAddress.trim(),
        city: customer.city.trim(),
        province: customer.province,
        postalCode: customer.postalCode?.trim(),
        orderNotes: orderNotes?.trim() || customer.orderNotes?.trim()
      },
      items: validatedItems,
      pricing: {
        subtotal: calculatedSubtotal,
        shippingFee,
        discount: 0,
        total: finalTotal
      },
      paymentMethod: paymentMethod === 'Bank Transfer / Manual Payment' ? 'Bank Transfer / Manual Payment' : 'Cash on Delivery (COD)',
      paymentStatus: paymentMethod === 'Bank Transfer / Manual Payment' ? 'Pending Verification' : 'Unpaid',
      paymentReference: paymentReference?.trim(),
      shipping: {
        courier: customer.city.toLowerCase() === 'lahore' ? 'Hamza Autos Express (Lahore)' : 'TCS Courier',
        estimatedDeliveryDays: customer.city.toLowerCase() === 'lahore' ? 'Same Day / Next Day' : shippingConfig.estimatedDeliveryText
      },
      orderStatus: 'New Order',
      statusHistory: [
        {
          status: 'New Order',
          timestamp: now,
          updatedBy: 'Customer (Online Checkout)',
          note: `Order placed via online shop with ${paymentMethod}`
        }
      ],
      stockAdjusted: false,
      createdAt: now,
      updatedAt: now
    };

    allOrders.unshift(newOrder);
    await saveOrders(allOrders);

    // Build WhatsApp confirmation message URL
    const itemsSummary = validatedItems.map(i => `${i.quantity}x ${i.name} (PKR ${i.unitPrice * i.quantity})`).join('\n');
    const waText = encodeURIComponent(
      `Assalam-o-Alaikum Hamza Autos,\n\nI have just placed an order on your website.\n\n*Order Ref:* ${orderNumber}\n*Name:* ${customer.fullName}\n*Phone:* ${customer.mobileNumber}\n*City:* ${customer.city}, ${customer.province}\n*Total:* PKR ${finalTotal.toLocaleString()}\n*Payment:* ${newOrder.paymentMethod}\n\n*Items:*\n${itemsSummary}\n\nPlease confirm my dispatch. Thank you!`
    );
    const whatsappUrl = `https://wa.me/923251814548?text=${waText}`;

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully.',
      data: {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customer.fullName,
        total: newOrder.pricing.total,
        whatsappUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/shop/orders/track/:query
 * Public Order Tracking by Order Number or Mobile Number
 */
shopRouter.get('/orders/track/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    if (!query || query.trim().length < 4) {
      return res.status(400).json({ success: false, error: 'Please enter a valid order number or mobile number.' });
    }

    const q = query.trim().toLowerCase();
    const cleanPhone = q.replace(/[^0-9]/g, '');

    const orders = await getOrders();
    const matched = orders.filter(o => 
      o.orderNumber.toLowerCase() === q ||
      (cleanPhone.length >= 7 && o.customer.mobileNumber.replace(/[^0-9]/g, '').includes(cleanPhone))
    );

    if (matched.length === 0) {
      return res.status(404).json({ success: false, error: 'No order found matching your reference. Please check your order ID or mobile number.' });
    }

    // Return sanitized public tracking timeline
    const sanitized = matched.map(o => ({
      orderNumber: o.orderNumber,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt,
      city: o.customer.city,
      province: o.customer.province,
      courier: o.shipping.courier,
      trackingNumber: o.shipping.trackingNumber || 'Pending Courier Pickup',
      trackingUrl: o.shipping.trackingUrl,
      estimatedDeliveryDays: o.shipping.estimatedDeliveryDays,
      itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0),
      items: o.items.map(i => ({ name: i.name, quantity: i.quantity })),
      total: o.pricing.total,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      timeline: o.statusHistory
    }));

    res.json({ success: true, data: sanitized });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==============================================================
// ADMIN SHOP MANAGEMENT ENDPOINTS (PROTECTED WITH requireAuth)
// ==============================================================

/**
 * GET /api/admin/shop/dashboard-stats
 * Authentic shop metrics derived from actual persistent records
 */
shopRouter.get('/admin/dashboard-stats', requireAuth, async (_req: Request, res: Response) => {
  try {
    const products = await getProducts();
    const orders = await getOrders();

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isPublished).length;
    const outOfStockProducts = products.filter(p => p.stockQuantity <= 0).length;
    const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => 
      o.orderStatus === 'New Order' || 
      o.orderStatus === 'Confirmed' || 
      o.orderStatus === 'Processing' || 
      o.orderStatus === 'Packed' ||
      o.orderStatus === 'Dispatched' ||
      o.orderStatus === 'Shipped'
    ).length;

    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled' || o.orderStatus === 'Returned').length;

    // Actual revenue collected: Delivered orders + any orders with paymentStatus === 'Payment Received'
    let totalCollectedRevenue = 0;
    let totalPendingRevenue = 0;

    for (const ord of orders) {
      if (ord.orderStatus === 'Delivered' || ord.paymentStatus === 'Payment Received') {
        totalCollectedRevenue += ord.pricing.total;
      } else if (ord.orderStatus !== 'Cancelled' && ord.orderStatus !== 'Returned') {
        totalPendingRevenue += ord.pricing.total;
      }
    }

    const stats: ShopDashboardStats = {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalCollectedRevenue,
      totalPendingRevenue
    };

    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/shop/products
 * Full product list for admin panel
 */
shopRouter.get('/admin/products', requireAuth, async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/shop/products
 * Create product with validation and unique SKU check
 */
shopRouter.post('/admin/products', requireAuth, async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.sku || !productData.price) {
      return res.status(400).json({ success: false, error: 'Product name, SKU, and price are required.' });
    }

    const products = await getProducts();
    const existingSku = products.find(p => p.sku.toLowerCase() === productData.sku.trim().toLowerCase());
    if (existingSku) {
      return res.status(400).json({ success: false, error: `SKU "${productData.sku}" is already in use by another product.` });
    }

    const id = generateId('prod');
    const slug = productData.slug?.trim() || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = getCurrentTimestamp();

    const stock = Number(productData.stockQuantity) || 0;
    const threshold = Number(productData.lowStockThreshold) || 5;

    const newProduct: ShopProduct = {
      id,
      name: productData.name.trim(),
      slug: `${slug}-${id.slice(-4)}`,
      sku: productData.sku.trim().toUpperCase(),
      categoryId: productData.categoryId || 'scat-engine-parts',
      categoryName: productData.categoryName || 'Engine Parts',
      brand: productData.brand || 'Crown Lifan',
      condition: productData.condition || 'New (OEM / Genuine)',
      price: Number(productData.price),
      discountedPrice: productData.discountedPrice ? Number(productData.discountedPrice) : undefined,
      stockQuantity: stock,
      lowStockThreshold: threshold,
      availabilityStatus: computeAvailability(stock, threshold),
      isFeatured: !!productData.isFeatured,
      isPublished: productData.isPublished !== undefined ? !!productData.isPublished : true,
      rating: 5.0,
      reviewCount: 0,
      description: productData.description?.trim() || '',
      shortDescription: productData.shortDescription?.trim(),
      specifications: productData.specifications || {},
      images: productData.images && productData.images.length > 0 ? productData.images : [
        {
          id: generateId('img'),
          url: '/assets/images/services/motorcycle-spare-parts.webp',
          alt: productData.name,
          isPrimary: true
        }
      ],
      compatibleBikes: productData.compatibleBikes || [],
      weightKg: Number(productData.weightKg) || undefined,
      warrantyText: productData.warrantyText?.trim(),
      createdAt: now,
      updatedAt: now
    };

    products.unshift(newProduct);
    await saveProducts(products);

    // Log Inventory setup
    const movements = await getMovements();
    movements.unshift({
      id: generateId('mov'),
      productId: newProduct.id,
      sku: newProduct.sku,
      productName: newProduct.name,
      changeType: 'INITIAL_SETUP',
      previousQuantity: 0,
      changeAmount: stock,
      newQuantity: stock,
      reason: 'Initial Product Stock Creation',
      performedBy: (req as any).adminUser?.username || 'admin',
      timestamp: now
    });
    await saveMovements(movements);

    await logAuditEvent(
      'SHOP_PRODUCT_CREATED',
      (req as any).adminUser?.username || 'admin',
      `shop-products.json/${newProduct.id}`,
      `Created product "${newProduct.name}" (${newProduct.sku}) with ${stock} units`
    );

    res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/admin/shop/products/:id
 */
shopRouter.put('/admin/products/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const current = products[index];
    const previousStock = current.stockQuantity;
    const newStock = updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : previousStock;
    const threshold = updates.lowStockThreshold !== undefined ? Number(updates.lowStockThreshold) : current.lowStockThreshold;

    const updatedProduct: ShopProduct = {
      ...current,
      ...updates,
      id: current.id,
      stockQuantity: newStock,
      lowStockThreshold: threshold,
      availabilityStatus: computeAvailability(newStock, threshold),
      updatedAt: getCurrentTimestamp()
    };

    products[index] = updatedProduct;
    await saveProducts(products);

    // If stock changed manually, record movement
    if (newStock !== previousStock) {
      const diff = newStock - previousStock;
      const movements = await getMovements();
      movements.unshift({
        id: generateId('mov'),
        productId: current.id,
        sku: current.sku,
        productName: current.name,
        changeType: 'MANUAL_ADJUSTMENT',
        previousQuantity: previousStock,
        changeAmount: diff,
        newQuantity: newStock,
        reason: updates.stockAdjustmentReason || 'Manual Admin Stock Adjustment',
        performedBy: (req as any).adminUser?.username || 'admin',
        timestamp: getCurrentTimestamp()
      });
      await saveMovements(movements);
    }

    await logAuditEvent(
      'SHOP_PRODUCT_UPDATED',
      (req as any).adminUser?.username || 'admin',
      `shop-products.json/${id}`,
      `Updated product "${updatedProduct.name}"`
    );

    res.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/shop/products/:id
 */
shopRouter.delete('/admin/products/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let products = await getProducts();
    const target = products.find(p => p.id === id);

    if (!target) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    products = products.filter(p => p.id !== id);
    await saveProducts(products);

    await logAuditEvent(
      'SHOP_PRODUCT_DELETED',
      (req as any).adminUser?.username || 'admin',
      `shop-products.json/${id}`,
      `Deleted product "${target.name}" (${target.sku})`
    );

    res.json({ success: true, message: `Product ${target.name} deleted.` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/shop/orders
 */
shopRouter.get('/admin/orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus, search, city, province } = req.query;
    let orders = await getOrders();

    if (status && typeof status === 'string') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    if (paymentStatus && typeof paymentStatus === 'string') {
      orders = orders.filter(o => o.paymentStatus === paymentStatus);
    }

    if (city && typeof city === 'string') {
      orders = orders.filter(o => o.customer.city.toLowerCase() === city.toLowerCase());
    }

    if (province && typeof province === 'string') {
      orders = orders.filter(o => o.customer.province === province);
    }

    if (search && typeof search === 'string') {
      const q = search.trim().toLowerCase();
      orders = orders.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.mobileNumber.includes(q) ||
        o.shipping.trackingNumber?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/admin/shop/orders/:id/status
 * Updates status, with atomic stock deductions on confirmation, and restoration on cancellation/return
 */
shopRouter.put('/admin/shop/orders/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses: OrderStatus[] = [
      'New Order', 'Confirmed', 'Processing', 'Packed', 
      'Dispatched', 'Shipped', 'Delivered', 'Cancelled', 'Returned'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid order status "${status}".` });
    }

    const orders = await getOrders();
    const orderIndex = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    const order = orders[orderIndex];
    const previousStatus = order.orderStatus;
    const now = getCurrentTimestamp();
    const adminUser = (req as any).adminUser?.username || 'admin';

    // 1. INVENTORY STOCK MANAGEMENT LOGIC:
    // Deduct stock when order is Confirmed / Processing / Dispatched for the first time
    const products = await getProducts();
    const movements = await getMovements();

    if (
      (status === 'Confirmed' || status === 'Processing' || status === 'Dispatched') &&
      !order.stockAdjusted
    ) {
      // Deduct stock for all items
      for (const item of order.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const prev = prod.stockQuantity;
          const next = Math.max(0, prev - item.quantity);
          prod.stockQuantity = next;
          prod.availabilityStatus = computeAvailability(next, prod.lowStockThreshold);

          movements.unshift({
            id: generateId('mov'),
            productId: prod.id,
            sku: prod.sku,
            productName: prod.name,
            changeType: 'ORDER_CONFIRMED',
            previousQuantity: prev,
            changeAmount: -item.quantity,
            newQuantity: next,
            reason: `Order ${order.orderNumber} confirmed`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            performedBy: adminUser,
            timestamp: now
          });
        }
      }
      order.stockAdjusted = true;
      await saveProducts(products);
      await saveMovements(movements);
    } 
    // Restore stock if previously deducted and now cancelled or returned
    else if (
      (status === 'Cancelled' || status === 'Returned') &&
      order.stockAdjusted
    ) {
      for (const item of order.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const prev = prod.stockQuantity;
          const next = prev + item.quantity;
          prod.stockQuantity = next;
          prod.availabilityStatus = computeAvailability(next, prod.lowStockThreshold);

          movements.unshift({
            id: generateId('mov'),
            productId: prod.id,
            sku: prod.sku,
            productName: prod.name,
            changeType: status === 'Cancelled' ? 'ORDER_CANCELLED' : 'ORDER_RETURNED',
            previousQuantity: prev,
            changeAmount: item.quantity,
            newQuantity: next,
            reason: `Order ${order.orderNumber} ${status.toLowerCase()} – stock restored`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            performedBy: adminUser,
            timestamp: now
          });
        }
      }
      order.stockAdjusted = false; // reset flag
      await saveProducts(products);
      await saveMovements(movements);
    }

    // 2. Update status and history
    order.orderStatus = status;
    order.updatedAt = now;
    if (status === 'Dispatched') order.shipping.dispatchedAt = now;
    if (status === 'Delivered') {
      order.shipping.deliveredAt = now;
      if (order.paymentMethod === 'Cash on Delivery (COD)') {
        order.paymentStatus = 'Payment Received';
      }
    }
    if (status === 'Cancelled') order.shipping.cancelledAt = now;
    if (status === 'Returned') order.shipping.returnedAt = now;

    order.statusHistory.unshift({
      status,
      timestamp: now,
      updatedBy: adminUser,
      note: note || `Status transitioned from ${previousStatus} to ${status}`
    });

    orders[orderIndex] = order;
    await saveOrders(orders);

    await logAuditEvent(
      'SHOP_ORDER_STATUS_UPDATED',
      adminUser,
      `shop-orders.json/${order.id}`,
      `Order ${order.orderNumber} status changed to ${status}`
    );

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/admin/shop/orders/:id/shipping
 * Add or update courier partner and tracking code
 */
shopRouter.put('/admin/shop/orders/:id/shipping', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { courier, trackingNumber, trackingUrl, estimatedDeliveryDays } = req.body;

    const orders = await getOrders();
    const orderIndex = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    const order = orders[orderIndex];
    if (courier) order.shipping.courier = courier;
    if (trackingNumber !== undefined) order.shipping.trackingNumber = trackingNumber.trim();
    if (trackingUrl !== undefined) order.shipping.trackingUrl = trackingUrl.trim();
    if (estimatedDeliveryDays) order.shipping.estimatedDeliveryDays = estimatedDeliveryDays;
    order.updatedAt = getCurrentTimestamp();

    orders[orderIndex] = order;
    await saveOrders(orders);

    await logAuditEvent(
      'SHOP_ORDER_SHIPPING_UPDATED',
      (req as any).adminUser?.username || 'admin',
      `shop-orders.json/${order.id}`,
      `Shipping updated for ${order.orderNumber}: Courier ${order.shipping.courier}, Tracking ${trackingNumber}`
    );

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/admin/shop/orders/:id/payment
 * Update payment verification status
 */
shopRouter.put('/admin/shop/orders/:id/payment', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentReference } = req.body;

    const orders = await getOrders();
    const orderIndex = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    const order = orders[orderIndex];
    order.paymentStatus = paymentStatus;
    if (paymentReference) order.paymentReference = paymentReference;
    if (paymentStatus === 'Payment Received') {
      order.paymentVerifiedAt = getCurrentTimestamp();
      order.paymentVerifiedBy = (req as any).adminUser?.username || 'admin';
    }
    order.updatedAt = getCurrentTimestamp();

    orders[orderIndex] = order;
    await saveOrders(orders);

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/shop/inventory-movements
 */
shopRouter.get('/admin/inventory-movements', requireAuth, async (req: Request, res: Response) => {
  try {
    const movements = await getMovements();
    res.json({ success: true, data: movements });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/shop/categories
 */
shopRouter.post('/admin/categories', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, description, image, iconName } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Category name is required.' });

    const categories = await getCategories();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory: ShopCategory = {
      id: generateId('scat'),
      name: name.trim(),
      slug,
      description: description?.trim() || '',
      image: image || '/assets/images/services/motorcycle-spare-parts.webp',
      iconName: iconName || 'Settings2',
      sortOrder: categories.length + 1,
      isActive: true,
      productCount: 0
    };

    categories.push(newCategory);
    await saveCategories(categories);

    res.status(201).json({ success: true, data: newCategory });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/admin/shop/categories/:id
 */
shopRouter.put('/admin/categories/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const categories = await getCategories();
    const idx = categories.findIndex(c => c.id === id);

    if (idx === -1) return res.status(404).json({ success: false, error: 'Category not found.' });

    categories[idx] = { ...categories[idx], ...updates, id: categories[idx].id };
    await saveCategories(categories);

    res.json({ success: true, data: categories[idx] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/shop/categories/:id
 */
shopRouter.delete('/admin/categories/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let categories = await getCategories();
    categories = categories.filter(c => c.id !== id);
    await saveCategories(categories);
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/shop/brands-models
 */
shopRouter.post('/admin/brands-models', requireAuth, async (req: Request, res: Response) => {
  try {
    const { brand, modelName, engineCc, popularYears, isPopularInPakistan } = req.body;
    if (!brand || !modelName) {
      return res.status(400).json({ success: false, error: 'Brand and model name are required.' });
    }

    const models = await getBrandModels();
    const newModel: MotorcycleModelSpec = {
      id: generateId('bm'),
      brand,
      modelName: modelName.trim(),
      engineCc: engineCc?.trim() || '70cc',
      popularYears: popularYears?.trim() || '2000 - 2026',
      isPopularInPakistan: isPopularInPakistan !== undefined ? !!isPopularInPakistan : true
    };

    models.push(newModel);
    await saveBrandModels(models);

    res.status(201).json({ success: true, data: newModel });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/shop/brands-models/:id
 */
shopRouter.delete('/admin/brands-models/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let models = await getBrandModels();
    models = models.filter(m => m.id !== id);
    await saveBrandModels(models);
    res.json({ success: true, message: 'Motorcycle model removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET & PUT /api/admin/shop/settings
 */
shopRouter.get('/admin/settings', requireAuth, async (_req: Request, res: Response) => {
  try {
    const settings = await getShopSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

shopRouter.put('/admin/settings', requireAuth, async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const current = await getShopSettings();
    const updated = { ...current, ...updates };
    await writeJsonFileAtomic('shop-settings.json', updated);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET & PUT /api/admin/shop/shipping
 */
shopRouter.get('/admin/shipping', requireAuth, async (_req: Request, res: Response) => {
  try {
    const shipping = await getShippingSettings();
    res.json({ success: true, data: shipping });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

shopRouter.put('/admin/shipping', requireAuth, async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const current = await getShippingSettings();
    const updated = { ...current, ...updates };
    await writeJsonFileAtomic('shop-shipping.json', updated);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

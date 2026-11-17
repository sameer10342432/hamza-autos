/**
 * Hamza Autos - Dynamic Search Engine Optimization (SEO) & Schema Head Manager
 * Updates Title, Description, Canonical link, Robots meta, OpenGraph, Twitter Cards,
 * and Injects Structured Data (JSON-LD) dynamically per route.
 */

import { RouteInfo } from './adminRouter';
import { SERVICES_LIST, BRANDS_LIST, AREAS_LIST, BLOG_POSTS, BUSINESS_INFO } from '../data/businessData';

const BASE_URL = 'https://hamzaautos.com';
const DEFAULT_IMAGE = `${BASE_URL}/assets/images/home/motorcycle-workshop-hero.webp`;

function setMetaTag(name: string, content: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (isProperty) {
      el.setAttribute('property', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLdSchema(id: string, schema: object | null) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  if (!schema) return;

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

export function updatePageSeo(routeInfo: RouteInfo): void {
  if (typeof document === 'undefined') return;

  // 1. Admin or Private User Dashboard — Enforce Noindex, Nofollow
  if (routeInfo.isAdmin) {
    document.title = `${routeInfo.adminTab.toUpperCase()} | Hamza Autos Workshop Management`;
    setMetaTag('robots', 'noindex, nofollow, noarchive');
    setJsonLdSchema('dynamic-page-schema', null);
    return;
  }

  if (routeInfo.publicView === 'customer-dashboard' || routeInfo.publicView === 'customer-portal') {
    document.title = 'Customer Portal & Bike Health History | Hamza Autos Badami Bagh';
    setMetaTag('description', 'Access your motorcycle repair records, previous job cards, parts invoices, and maintenance schedule.');
    setMetaTag('robots', 'noindex, nofollow, noarchive');
    setJsonLdSchema('dynamic-page-schema', null);
    return;
  }

  // 2. Public Pages — Enforce Index, Follow
  setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  const view = routeInfo.publicView;
  const slug = routeInfo.publicSlug;

  let pageTitle = 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore';
  let metaDescription = 'Trusted motorcycle mechanic & repair shop in Badami Bagh, Lahore. Professional bike engine repair, tuning, oil change, electrical wiring, brakes & maintenance. Call +92 325 1814548.';
  let canonicalPath = '/';
  let ogImage = DEFAULT_IMAGE;
  let dynamicSchema: object | null = null;

  // ==========================================
  // ROUTE-SPECIFIC METADATA & SCHEMA GENERATION
  // ==========================================

  if (view === 'home' || !view) {
    pageTitle = 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore';
    metaDescription = 'Trusted motorcycle mechanic & repair shop in Badami Bagh, Lahore. Professional bike engine overhaul, carburetor tuning, oil change, electrical wiring, brakes & genuine spare parts. Call +92 325 1814548.';
    canonicalPath = '/';
  } else if (view === 'services' && !slug) {
    pageTitle = 'Motorcycle Repair & Maintenance Services in Badami Bagh, Lahore | Hamza Autos';
    metaDescription = 'Explore professional motorcycle services in Badami Bagh Lahore: engine overhaul, carburetor tuning, genuine oil change, electrical wiring repair, brakes & clutches for Honda, Yamaha, Suzuki.';
    canonicalPath = '/services';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": `${BASE_URL}/services` }
      ]
    };
  } else if ((view === 'services' && slug) || (view === 'service-detail' && slug)) {
    const service = SERVICES_LIST.find(s => s.slug === slug) || SERVICES_LIST[0];
    pageTitle = `${service.title} in Badami Bagh, Lahore | Hamza Autos`;
    metaDescription = `${service.shortDescription} Expert bike mechanic workshop on Abu Bakar Road, Badami Bagh, Lahore. Supported: ${service.supportedBikes.slice(0, 3).join(', ')}. Call +92 325 1814548.`;
    canonicalPath = `/services/${service.slug}`;
    if (service.image) {
      ogImage = service.image.startsWith('http') ? service.image : `${BASE_URL}${service.image.startsWith('/') ? '' : '/'}${service.image}`;
    }

    dynamicSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": `${BASE_URL}/services/${service.slug}#service`,
          "name": service.title,
          "serviceType": service.category,
          "description": service.fullDescription || service.shortDescription,
          "provider": {
            "@type": "AutoRepair",
            "name": "Hamza Autos",
            "telephone": "+923251814548",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road",
              "addressLocality": "Badami Bagh",
              "addressRegion": "Lahore, Punjab",
              "postalCode": "54000",
              "addressCountry": "PK"
            }
          },
          "areaServed": "Badami Bagh, Lahore",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": service.title,
            "itemListElement": (service.keyFeatures || []).map((feat, idx) => ({
              "@type": "Offer",
              "position": idx + 1,
              "itemOffered": {
                "@type": "Service",
                "name": feat
              }
            }))
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": `${BASE_URL}/services` },
            { "@type": "ListItem", "position": 3, "name": service.title, "item": `${BASE_URL}/services/${service.slug}` }
          ]
        }
      ]
    };
  } else if (view === 'brands' && !slug) {
    pageTitle = 'Motorcycle Brands We Repair (Honda, Yamaha, Suzuki, United) | Hamza Autos Lahore';
    metaDescription = 'Specialist motorcycle mechanics in Badami Bagh for Honda CD 70 & CG 125, Yamaha YBR 125, Suzuki GS 150 & GD 110, United and all Chinese bikes. Call +92 325 1814548.';
    canonicalPath = '/brands';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Brands", "item": `${BASE_URL}/brands` }
      ]
    };
  } else if ((view === 'brands' && slug) || (view === 'brand-detail' && slug)) {
    const brand = BRANDS_LIST.find(b => b.slug === slug || b.id === slug) || BRANDS_LIST[0];
    pageTitle = `${brand.name} Repair & Maintenance Specialist Badami Bagh Lahore | Hamza Autos`;
    metaDescription = `Complete repair, genuine spare parts, and tuning for ${brand.name} motorcycles at Hamza Autos Badami Bagh, Lahore. Call +92 325 1814548.`;
    canonicalPath = `/brands/${brand.slug || brand.id}`;
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Brands", "item": `${BASE_URL}/brands` },
        { "@type": "ListItem", "position": 3, "name": brand.name, "item": `${BASE_URL}/brands/${brand.slug || brand.id}` }
      ]
    };
  } else if (view === 'areas' && !slug) {
    pageTitle = 'Areas We Serve in Lahore (Badami Bagh, Shadbagh, Misri Shah, Ravi Road) | Hamza Autos';
    metaDescription = 'Hamza Autos is centrally located on Abu Bakar Road, Badami Bagh, providing quick motorcycle repair access to Shadbagh, Misri Shah, Ravi Road, Bund Road & Azadi Chowk riders.';
    canonicalPath = '/areas';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Areas We Serve", "item": `${BASE_URL}/areas` }
      ]
    };
  } else if ((view === 'areas' && slug) || (view === 'area-detail' && slug)) {
    const area = AREAS_LIST.find(a => a.slug === slug || a.id === slug) || AREAS_LIST[0];
    pageTitle = `Bike Mechanic & Motorcycle Repair Near ${area.name} | Hamza Autos Badami Bagh Lahore`;
    metaDescription = `Looking for a trusted bike mechanic near ${area.name}? Hamza Autos is located ${area.distanceFromBadamiBagh} on Abu Bakar Road, Badami Bagh. Drive time: ${area.estimatedDriveTime}. Call +92 325 1814548.`;
    canonicalPath = `/areas/${area.slug || area.id}`;

    dynamicSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AutoRepair",
          "@id": `${BASE_URL}/areas/${area.slug || area.id}#autorepair`,
          "name": `Hamza Autos - Motorcycle Repair serving ${area.name}`,
          "description": `${area.localIntro} Located ${area.distanceFromBadamiBagh} on Abu Bakar Road, Badami Bagh, Lahore.`,
          "telephone": "+923251814548",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road",
            "addressLocality": "Badami Bagh",
            "addressRegion": "Lahore, Punjab",
            "postalCode": "54000",
            "addressCountry": "PK"
          },
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": area.name
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": "Areas We Serve", "item": `${BASE_URL}/areas` },
            { "@type": "ListItem", "position": 3, "name": area.name, "item": `${BASE_URL}/areas/${area.slug || area.id}` }
          ]
        }
      ]
    };
  } else if (view === 'blog' && !slug) {
    pageTitle = 'Motorcycle Care & Maintenance Blog | Hamza Autos Badami Bagh Lahore';
    metaDescription = 'Practical motorcycle maintenance advice, DIY troubleshooting, carburetor tuning tips, and engine care guides by Master Mechanic Hamza in Lahore, Pakistan.';
    canonicalPath = '/blog';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` }
      ]
    };
  } else if (view === 'blog' && slug) {
    const post = BLOG_POSTS.find(b => b.slug === slug || b.id === slug) || BLOG_POSTS[0];
    pageTitle = `${post.title} | Hamza Autos Lahore`;
    metaDescription = `${post.summary || post.title}. Practical motorcycle advice for Pakistani riders by Hamza Autos Badami Bagh, Lahore.`;
    canonicalPath = `/blog/${post.slug || post.id}`;
    if (post.image) {
      ogImage = post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`;
    }

    dynamicSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${BASE_URL}/blog/${post.slug || post.id}#article`,
          "headline": post.title,
          "description": post.summary,
          "datePublished": post.publishedDate,
          "author": {
            "@type": "Person",
            "name": "Hamza Mechanic",
            "jobTitle": "Lead Motorcycle Technician"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Hamza Autos",
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/hamza-autos-logo.svg`
            }
          },
          "mainEntityOfPage": `${BASE_URL}/blog/${post.slug || post.id}`
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `${BASE_URL}/blog/${post.slug || post.id}` }
          ]
        }
      ]
    };
  } else if (view === 'contact') {
    pageTitle = 'Contact Hamza Autos – Workshop Location & Phone | Badami Bagh Lahore';
    metaDescription = 'Contact Hamza Autos on Abu Bakar Road, Badami Bagh, Lahore. Call +92 325 1814548 for urgent bike breakdown assistance, appointment booking, or workshop directions.';
    canonicalPath = '/contact';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": `${BASE_URL}/contact` }
      ]
    };
  } else if (view === 'reviews') {
    pageTitle = 'Customer Reviews & Mechanic Ratings | Hamza Autos Badami Bagh Lahore';
    metaDescription = 'Read genuine customer reviews from Lahore riders who trust Hamza Autos for engine overhauls, bike tuning, and routine maintenance in Badami Bagh.';
    canonicalPath = '/reviews';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Customer Reviews", "item": `${BASE_URL}/reviews` }
      ]
    };
  } else if (view === 'gallery') {
    pageTitle = 'Workshop Bay & Repair Gallery | Hamza Autos Badami Bagh Lahore';
    metaDescription = 'Take a look inside Hamza Autos motorcycle repair workshop in Badami Bagh Lahore. See our diagnostic equipment, engine rebuilding bay, and mechanic tools.';
    canonicalPath = '/gallery';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Workshop Gallery", "item": `${BASE_URL}/gallery` }
      ]
    };
  } else if (view === 'track-repair') {
    pageTitle = 'Track Motorcycle Repair Status Live | Hamza Autos Workshop';
    metaDescription = 'Track your bike repair progress live with your Job Card or Phone Number at Hamza Autos Badami Bagh, Lahore.';
    canonicalPath = '/track-repair';
  } else if (view === 'sitemap') {
    pageTitle = 'HTML Sitemap & Complete Directory | Hamza Autos Badami Bagh Lahore';
    metaDescription = 'Browse all motorcycle repair services, brands, local service area pages, and maintenance blog articles at Hamza Autos.';
    canonicalPath = '/sitemap';
    dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Sitemap", "item": `${BASE_URL}/sitemap` }
      ]
    };
  } else if (view === 'privacy') {
    pageTitle = 'Privacy Policy | Hamza Autos Badami Bagh Lahore';
    metaDescription = 'Privacy Policy of Hamza Autos workshop in Badami Bagh, Lahore regarding customer data, phone numbers, and booking records.';
    canonicalPath = '/privacy';
  } else if (view === 'terms') {
    pageTitle = 'Terms of Service | Hamza Autos Badami Bagh Lahore';
    metaDescription = 'Terms and Conditions for motorcycle repair, warranties, estimates, and spare parts at Hamza Autos Badami Bagh, Lahore.';
    canonicalPath = '/terms';
  } else if (view === 'not-found') {
    pageTitle = 'Page Not Found (404) | Hamza Autos Badami Bagh';
    metaDescription = 'The requested motorcycle repair page could not be found. Return to Hamza Autos homepage or contact our workshop at +92 325 1814548.';
    canonicalPath = '/404';
    setMetaTag('robots', 'noindex, follow');
  }

  // Apply to Document Head
  document.title = pageTitle;
  setMetaTag('description', metaDescription);
  setCanonicalUrl(`${BASE_URL}${canonicalPath}`);

  // Open Graph
  setMetaTag('og:title', pageTitle, true);
  setMetaTag('og:description', metaDescription, true);
  setMetaTag('og:url', `${BASE_URL}${canonicalPath}`, true);
  setMetaTag('og:image', ogImage, true);

  // Twitter Cards
  setMetaTag('twitter:title', pageTitle);
  setMetaTag('twitter:description', metaDescription);
  setMetaTag('twitter:image', ogImage);

  // Dynamic Schema Injection
  setJsonLdSchema('dynamic-page-schema', dynamicSchema);
}

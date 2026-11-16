# Hamza Autos – Complete Blog Management System Guide
**Workshop Location:** Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore  
**Contact:** +92 325 1814548 | WhatsApp: +92 325 1814548  
**System Location:** Admin Panel -> Sections 2, 3, 4 (`/admin`)

---

## 1. Overview

The Hamza Autos Blog Management System provides Master Mechanic Hamza with a publishing platform to educate local motorcycle riders, share troubleshooting advice, and drive organic Google search traffic for terms like *"motorcycle engine overhaul in Lahore"*, *"Honda 70 carburetor tuning"*, and *"Yamaha YBR 125 wiring repair"*.

All blog data is stored directly in `storage/blogs.json`, `storage/categories.json`, and `storage/tags.json`.

---

## 2. Key Capabilities

### 1. Rich Content Authoring
- **Article Title & Automatic Slug Generation:** Typing a title like *"5 Signs of Piston Wear in Honda 125"* automatically formats the URL slug into `5-signs-of-piston-wear-in-honda-125`.
- **Markdown & Formatting Support:** Write structured articles with `## Headings`, bullet lists, bold warnings, and maintenance checklists.
- **Estimated Reading Time Calculator:** Automatically computes realistic reading time based on word count.
- **Featured Image Picker:** Direct integration with the Media Library (`uploads/blogs/`) or absolute image paths.

### 2. Multi-Stage Publishing Workflow
- **Draft:** Work-in-progress articles saved privately for review.
- **Published:** Live articles immediately visible on the public website at `/blog` and `/blog/:slug`.
- **Scheduled:** Queued for future publication.

### 3. Live Google Search Snippet Preview
As the admin edits the article title and meta description, a simulated Google SERP card shows exactly how the post will look on Google Mobile and Desktop search results, warning if characters exceed recommended limits.

### 4. Categorization & Tagging (Taxonomy)
- **Categories (Section 3):** Broad repair domains (`Engine Overhaul`, `Bike Tuning`, `Electrical Repairs`, `Suspension & Brakes`, `Maintenance Guides`).
- **Tags (Section 4):** Specific component topics (`Honda 70`, `Carburetor`, `Engine Oil`, `Fuel Economy`, `Badami Bagh`).

---

## 3. Step-by-Step Publishing Guide

1. Log into the Admin Panel (`/#admin`).
2. Click **2. Blog Management** in the left sidebar.
3. Click the **Write New Blog** button in the top right.
4. Fill in the **Article Title**, **Category**, and upload a high-resolution workshop photo for the **Featured Image**.
5. Write the article content in the Markdown editor.
6. Verify the **Google Search Snippet Preview** card.
7. Click **Publish Now** to make it instantly live across all devices!

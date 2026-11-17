# HAMZA AUTOS — WORKSHOP ADMIN SEO MANAGEMENT GUIDE
**Target Users:** Workshop Owner (Hamza), Shop Managers, Content Administrators  
**Access Route:** `/admin/seo` (or Sidebar -> System & Recovery -> Search Engine (SEO))  
**Storage Architecture:** Pure JSON file persistence in `storage/seo-settings.json` (Database-free)  

---

## 1. Overview of the Admin SEO Dashboard

The Hamza Autos Admin Panel features an embedded SEO Management module designed specifically for non-technical workshop administrators. It allows direct control over meta titles, search descriptions, canonical URLs, and keyword tags without requiring source code edits.

```
+--------------------------------------------------------------------------------------+
|  Hamza Autos SEO Management Console                                                  |
+--------------------------------------------------------------------------------------+
|  [ Indexed Pages: 47 ]  [ Sitemap: Valid XML ]  [ Robots: Protected ]  [ Schema: OK ] |
+--------------------------------------------------------------------------------------+
|  Pages & Routes Selector   |  Active Page SEO Editor                                 |
|  - / (Homepage)            |  - Page Meta Title Tag (60 chars recommended)           |
|  - /services               |  - Page Meta Description (160 chars recommended)        |
|  - /brands                 |  - Canonical URL Configuration                          |
|  - /areas                  |  - Target Keywords (comma separated)                    |
|  - /contact                |  +---------------------------------------------------+  |
|  - /blog                   |  | Live Google Search Appearance (SERP) Preview      |  |
|  - /reviews                |  | Hamza Autos - Bike Mechanic & Motorcycle Repair...|  |
|  - /gallery                |  | https://hamzaautos.com/                           |  |
|                            |  +---------------------------------------------------+  |
|                            |  [ Save SEO Config ] Button                             |
+----------------------------+---------------------------------------------------------+
```

---

## 2. Step-by-Step Instructions for Updating SEO

### Step 1: Navigating to the SEO Panel
1. Access the Admin Panel at `/admin` (or `/admin/login`).
2. In the left navigation sidebar under the **System & Recovery** group, click **Search Engine (SEO)** (URL: `/admin/seo`).

### Step 2: Selecting a Page Route
1. Look at the left column titled **Public Website Routes**.
2. Click on any route you wish to optimize (e.g. `Homepage`, `Services Page`, `Contact & Location`, or `Areas We Serve`).
3. The right-hand editor will instantly display the existing configuration for that page.

### Step 3: Editing Page Titles (Best Practice: 50–60 Chars)
- Ensure the title contains your primary keyword and local modifier (e.g. `Badami Bagh, Lahore`).
- Keep character count within the recommended 60-character threshold to prevent truncation in Google search results.
- The live character counter turns amber if you exceed 65 characters.

### Step 4: Editing Meta Descriptions (Best Practice: 150–160 Chars)
- Summarize the mechanical service with an active call to action and workshop phone number (`+92 325 1814548`).
- Keep length around 155 characters so the full text displays cleanly on mobile search screens.

### Step 5: Checking the Google Search Appearance Preview
- Below the input boxes, review the **Google Search Engine Result Snippet (SERP Preview)**.
- Verify that the blue clickable link title, green URL, and grey description text read naturally and attract customer clicks.

### Step 6: Saving and Verifying Changes
1. Click the red **Save SEO Config** button at the top right.
2. A green confirmation banner will appear:  
   `SEO meta tags saved successfully to storage/seo-settings.json.`
3. Changes are written atomically to `storage/seo-settings.json` and recorded in `storage/audit-logs.json`.
4. The public website immediately uses these updated tags on subsequent page views.

---

## 3. SEO Rules for Publishing New Blog Posts

When writing a new mechanical blog post under `/admin/blogs`:
1. **Headline:** Write a question or problem that motorcycle riders in Pakistan face daily (e.g. *"Why is my Honda 70 producing white smoke?"*).
2. **Excerpt / Meta Description:** Provide the direct cause and mention that Hamza Autos Badami Bagh diagnoses compression and ring piston wear.
3. **Internal Links:** Always insert at least one link to the relevant service (e.g. Engine Repair or Bike Tuning) and the contact page.
4. **Image Alt Text:** Provide descriptive text describing what is happening in the picture (e.g. *"Mechanic inspecting Honda CD 70 spark plug gap"*).

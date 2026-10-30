# Production CMS & Administrative Architecture Documentation
## Md. Altaf Hossain Raju, PMP® — Executive Portfolio

---

## 1. Executive Summary & Architecture Overview

This project is a dedicated, production-grade Content Management System (CMS) and portfolio website engineered for **Md. Altaf Hossain Raju, PMP®** (Area Manager at Marico Bangladesh Limited and Founder of LinkedIn Community Bangladesh).

The system decouples content administration from code changes:
- **Frontend Presentation Layer**: Next.js 16.4.3 (Turbopack, React 19, Tailwind CSS v4) with Partial Prerendering (PPR) and Component Caching (`use cache`).
- **Database & Persistence Layer**: Hosted PostgreSQL via **Neon Serverless Postgres** with pooled SSL connections and automated relational schema migrations.
- **Administrative Portal (`/admin`)**: Private executive dashboard with dark broadsheet aesthetic conforming to `DESIGN.md`, supporting 12+ CRUD modules, live ledger analytics, drag-and-drop section reordering, visibility toggling, media vault, and security controls.
- **Authentication & Cryptography**: Stateless HS256 JWT tokens using WebCrypto `jose`, 10-round `bcryptjs` password hashing, and HTTP-only, SameSite=Strict cookies enforced by Next.js 16 `proxy.ts`.
- **Zero-Downtime Failsafe**: Dual-layer Data Access Layer (`src/lib/dal.ts`) that streams live database queries, and falls back gracefully to static records if network or database connectivity is ever disrupted.

```
+-------------------------------------------------------------------------+
|                              PUBLIC VISITOR                             |
|                        https://altafhossainraju.com                     |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  NEXT.JS 16 SERVER-RENDERED FRONTEND                    |
|      - Partial Prefetching (PPR) & 'use cache' (cacheTag: 'portfolio')  |
|      - Dynamic Section Reordering & Visibility Layer                    |
|      - Newsreader Editorial & Manrope Sans Typography                   |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                    DATA ACCESS LAYER (src/lib/dal.ts)                   |
|               - getPortfolioData() with auto-fallback                   |
|               - revalidatePortfolio() tag & path invalidation           |
+-------------------------------------------------------------------------+
           |                                             |
           | (Live DB Queries)                           | (Graceful Fallback)
           v                                             v
+------------------------------------+     +------------------------------+
|     NEON POSTGRESQL (AWS us-east-2)|     | STATIC SEED (portfolioData)  |
|  - 17 Relational Normalized Tables |     +------------------------------+
|  - SSL Pooled Connections          |
|  - Forensic Audit Logging          |
+------------------------------------+
           ^
           | (Authenticated REST CRUD)
+-------------------------------------------------------------------------+
|                     SECURE ADMINISTRATIVE PORTAL                        |
|                               (/admin)                                  |
|   - Protected by Next.js 16 proxy.ts + HTTP-only JWT Session Cookies    |
|   - 12 Content Modules + Media Asset Vault + Audit Trail                |
+-------------------------------------------------------------------------+
```

---

## 2. Database Schema & Entity Relationships

The database is built on 17 relational tables with primary keys, foreign keys, and indexes:

### Core Entity Tables

1. `admin_users`
   - `id` (TEXT, PK): Unique admin ID (e.g., `usr_admin_1`).
   - `email` (TEXT, UNIQUE): Admin login email address.
   - `password_hash` (TEXT): 10-round bcrypt hash.
   - `name` (TEXT): Display name.
   - `role` (TEXT): `superadmin` | `admin`.
   - `created_at`, `updated_at` (TIMESTAMPTZ).

2. `site_profile`
   - `id` (TEXT, PK): Singleton ID (`default`).
   - `full_name`, `display_name`, `short_name`, `initials`, `honorific_suffix`: Identity nomenclature.
   - `hero_headline`, `hero_subheadline`, `hero_narrative_bio`: Hero copy.
   - `executive_bio_paragraphs` (JSONB): Formatted array of narrative paragraphs.
   - `philosophy_quote` (TEXT): Key leadership philosophy.
   - `portrait_main_url`, `portrait_corporate_url` (TEXT): Photo URLs.

3. `site_contact`
   - `id` (TEXT, PK): Singleton ID (`default`).
   - `email`, `phone`, `secondary_phone`, `address`, `origin`, `linkedin_url`, `lcb_website_url`, `whatsapp_number`.

4. `impact_metrics`
   - `id` (TEXT, PK), `metric_key` (TEXT, UNIQUE).
   - `value` (TEXT, e.g. "24,000+"), `number_value` (NUMERIC), `suffix` (TEXT, e.g. "+").
   - `label` (TEXT), `description` (TEXT), `verification_source` (TEXT), `category` (TEXT).
   - `is_primary` (BOOLEAN), `sort_order` (INTEGER), `is_published` (BOOLEAN).

5. `career_roles`
   - `id` (TEXT, PK), `slug` (TEXT).
   - `company`, `role`, `period`, `location`, `cluster`, `type` (`current` | `previous`).
   - `logo_url`, `key_responsibilities` (JSONB), `achievements` (JSONB), `industry_context`.
   - `sort_order` (INTEGER), `is_published` (BOOLEAN).

6. `ventures`
   - `id` (TEXT, PK), `slug`, `name`, `acronym`, `tagline`, `founded`, `role`, `status`.
   - `website_url`, `description`, `detailed_story`, `featured_image_url`.
   - `impact_metrics` (JSONB), `highlights` (JSONB), `cta_label`, `cta_url`.
   - `sort_order` (INTEGER), `is_published` (BOOLEAN).

7. `areas_of_expertise`
   - `id` (TEXT, PK), `title`, `tier`, `description`, `competencies` (JSONB).
   - `sort_order` (INTEGER), `is_published` (BOOLEAN).

8. `speaking_events`
   - `id` (TEXT, PK), `slug`, `title`, `organizer`, `event_type`, `institution`, `date`, `participants`, `description`, `image_url`, `key_topics` (JSONB).
   - `sort_order` (INTEGER), `is_published` (BOOLEAN).

9. `credentials`
   - `id` (TEXT, PK), `slug`, `title`, `institution`, `period_or_year`, `status`, `field`, `logo_url`, `details`, `verification_note`, `is_premier` (BOOLEAN).
   - `sort_order` (INTEGER), `is_published` (BOOLEAN).

10. `corporate_awards`
    - `id` (TEXT, PK), `title`, `organization`, `year`, `description`.
    - `sort_order` (INTEGER), `is_published` (BOOLEAN).

11. `leadership_roles`
    - `id` (TEXT, PK), `role`, `organization`, `period`.
    - `sort_order` (INTEGER), `is_published` (BOOLEAN).

12. `media_features`
    - `id` (TEXT, PK), `slug`, `title`, `outlet`, `published_date`, `category`, `summary`, `link_text`, `url`, `highlight_quote`.
    - `sort_order` (INTEGER), `is_published` (BOOLEAN).

13. `testimonials`
    - `id` (TEXT, PK), `name`, `role`, `organization`, `quote`, `context`.
    - `sort_order` (INTEGER), `is_published` (BOOLEAN).

14. `section_settings`
    - `id` (TEXT, PK): Section identifier (`hero`, `impact`, `about`, `career`, `ventures`, `expertise`, `speaking`, `credentials`, `media`, `testimonials`, `contact`).
    - `label` (TEXT): Navigation label (e.g., "Overview", "Career Journey").
    - `is_visible` (BOOLEAN): Instant toggle to show or hide the section from the frontend and navbar.
    - `sort_order` (INTEGER): Dynamic vertical display order.
    - `custom_title` (TEXT, NULLABLE): Admin-overridden editorial heading.
    - `custom_subtitle` (TEXT, NULLABLE): Admin-overridden supporting description.

15. `site_customization`
    - `id` (TEXT, PK): Singleton (`default`).
    - `site_title`, `meta_description`, `keywords` (JSONB), `og_image_url`, `canonical_url`.
    - `accent_color` (DEFAULT `#D4AF37`), `background_color` (DEFAULT `#070A11`), `surface_color` (DEFAULT `#0C111C`).

16. `media_assets`
    - `id` (TEXT, PK), `file_name`, `url`, `file_type`, `file_size`, `dimensions`, `alt_text`, `created_at`.

17. `activity_logs`
    - `id` (TEXT, PK), `user_id`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`, `created_at`.

---

## 3. Environment Variables Reference

Configure these in your production hosting platform (e.g., Vercel) and local `.env.local`:

| Variable Name | Required | Default / Example | Purpose |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@ep-...neon.tech/neondb?sslmode=require` | Pooled Neon PostgreSQL connection string |
| `CMS_JWT_SECRET` | **Yes** | `64-character-cryptographic-hex-string` | Secret key used to sign HS256 session JWTs |
| `NEXT_PUBLIC_SITE_URL` | No | `https://altafhossainraju.com` | Canonical base URL for SEO and OpenGraph generation |
| `NODE_ENV` | Yes | `production` / `development` | Runtime environment |

---

## 4. Administrative User Provisioning & Authentication

### Default Administrative Credentials
- **Portal URL**: `/admin/login`
- **Default Email**: `admin@altafhossainraju.com`
- **Initial Password**: `AdminRaju2026!Secure`

> [!IMPORTANT]
> Change the default password immediately after first logging in via **Admin Panel -> Security -> Change Password**.

### Creating or Resetting Admin Users via CLI
Run the database seed script to re-provision or reset the admin user:
```bash
node scripts/seed.js
```
Or execute an SQL command directly in the database:
```sql
UPDATE admin_users
SET password_hash = '$2a$10$YourHashedBcryptPassword'
WHERE email = 'admin@altafhossainraju.com';
```

---

## 5. Administrative Modules Guide

### 5.1 Dashboard (`/admin`)
- Displays real-time database counts: Published metrics, career mandates, ventures, credentials, media assets.
- Content health indicators for SEO and profile completeness.
- Chronological forensic audit log showing the most recent actions taken by administrative users.

### 5.2 Profile & Biography (`/admin/profile`)
- **Headline & Narrative**: Change the hero display headline, secondary provenance bar, and editorial narrative.
- **Executive Biography**: Add, edit, or reorder multi-paragraph bio entries.
- **Leadership Philosophy**: Update the pull quote rendered across the About section.
- **Portraits**: Change the main portrait (`portraitMain`) and corporate portrait (`portraitCorporate`) via direct URL or the integrated Media Picker.

### 5.3 Contact & Social Channels (`/admin/contact`)
- Manage direct email, official line, secondary phone, WhatsApp number, and LinkedIn URL.
- Updates immediately update contact cards, mobile bottom action bar, and footer links.

### 5.4 Impact Metrics Ledger (`/admin/metrics`)
- Create and edit quantitative figures (e.g. `24,000+`, `2x`, `1,200+`, `৳100Cr+`).
- Toggle `isPrimary` status to promote metrics to the macro broadsheet column.
- Reorder metrics using numerical `sortOrder`.

### 5.5 Career Timeline (`/admin/career`)
- Manage corporate tenures across Marico, Robi Axiata, and Nestlé.
- Add structured bullet points for `Key Responsibilities` and `Key Commercial Achievements`.
- Choose organization logos from the Media Library.

### 5.6 Strategic Ventures (`/admin/ventures`)
- Full editorial control over LinkedIn Community Bangladesh (LCB), Skill Hunt, and Career Talks.
- Edit tabbed highlights, impact figures, detailed backstories, and external platform links.

### 5.7 Competencies & Expertise (`/admin/expertise`)
- Group commercial route-to-market strategies and team governance domains.
- Add dynamic competency pill tags.

### 5.8 Speaking & Masterclasses (`/admin/speaking`)
- Catalogue academic keynotes, university workshops, and symposiums.
- Filter and edit event participant numbers, dates, institutions, and topics.

### 5.9 Credentials & Honors (`/admin/credentials`, `/admin/awards`, `/admin/affiliations`)
- Distinguish completed degrees from ongoing IBA Executive MBA studies and PMP® accreditation.
- Catalogue Global CEO Awards, organizational honors, and governance roles.

### 5.10 Sections Ordering & Visibility (`/admin/sections`)
- **Toggle Visibility**: Switch off any section with one click to remove it from both the homepage and navigation.
- **Reorder**: Change the sequence of sections vertically.
- **Custom Titles**: Override the default headline and subtitle of any section without touching code.

### 5.11 Media Library Vault (`/admin/media`)
- Upload JPEG, PNG, WEBP, or SVG assets with automatic MIME validation.
- Files persist to `public/uploads/` and are cataloged in `media_assets` with dimensions and metadata.
- Integrated **Media Picker Modal** accessible across every content form.

### 5.12 Settings & SEO (`/admin/settings`)
- Configure browser page title, meta description, keywords array, and OpenGraph social preview images.
- Set theme accent and surface hex colors.

---

## 6. Internal API Reference

All `/api/admin/*` endpoints require an active `cms_session` cookie issued via `/api/auth/login`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate with email and password, sets `cms_session` |
| `POST` | `/api/auth/logout` | Clears `cms_session` cookie |
| `GET` | `/api/auth/me` | Returns current authenticated user |
| `POST` | `/api/auth/change-password` | Updates password with bcrypt hashing |
| `GET` | `/api/admin/dashboard` | Aggregated statistics and recent audit feed |
| `GET, PUT` | `/api/admin/profile` | Retrieve or update profile and bio |
| `GET, PUT` | `/api/admin/contact` | Retrieve or update contact details |
| `GET, POST` | `/api/admin/metrics` | List or create impact metrics |
| `GET, PUT, DELETE` | `/api/admin/metrics/[id]` | Manage individual metric |
| `GET, POST` | `/api/admin/career` | List or create career journey roles |
| `GET, PUT, DELETE` | `/api/admin/career/[id]` | Manage individual career role |
| `GET, POST` | `/api/admin/ventures` | List or create ventures |
| `GET, PUT, DELETE` | `/api/admin/ventures/[id]` | Manage individual venture |
| `GET, POST` | `/api/admin/expertise` | List or create competency domains |
| `GET, PUT, DELETE` | `/api/admin/expertise/[id]` | Manage individual expertise domain |
| `GET, POST` | `/api/admin/speaking` | List or create speaking engagements |
| `GET, PUT, DELETE` | `/api/admin/speaking/[id]` | Manage individual speaking event |
| `GET, POST` | `/api/admin/credentials` | List or create academic/professional credentials |
| `GET, PUT, DELETE` | `/api/admin/credentials/[id]` | Manage individual credential |
| `GET, POST` | `/api/admin/awards` | List or create corporate awards |
| `GET, PUT, DELETE` | `/api/admin/awards/[id]` | Manage individual award |
| `GET, POST` | `/api/admin/affiliations` | List or create governance affiliations |
| `GET, PUT, DELETE` | `/api/admin/affiliations/[id]` | Manage individual affiliation |
| `GET, POST` | `/api/admin/media-press` | List or create press features |
| `GET, PUT, DELETE` | `/api/admin/media-press/[id]` | Manage individual press item |
| `GET, POST` | `/api/admin/testimonials` | List or create testimonials |
| `GET, PUT, DELETE` | `/api/admin/testimonials/[id]` | Manage individual testimonial |
| `GET, PUT` | `/api/admin/sections` | Retrieve or batch update layout ordering and visibility |
| `GET, PUT` | `/api/admin/settings` | Retrieve or update SEO and visual settings |
| `GET` | `/api/admin/media` | List cataloged media assets |
| `POST` | `/api/admin/media/upload` | Multipart file upload |
| `DELETE` | `/api/admin/media/[id]` | Delete media asset |
| `GET` | `/api/admin/activity` | Forensic audit log query with pagination |

---

## 7. Automated Testing & Verification Suite

The repository includes an end-to-end verification script:
```bash
node scripts/verify-all.js
```

What the automated test verifies:
1. **Schema Check**: Confirms all 17 normalized relational tables exist on Neon PostgreSQL.
2. **Content Verification**: Asserts that profile data, metrics, career roles, ventures, and sections are populated.
3. **Security Check**: Verifies bcrypt hashing, password rejection, and signed HS256 JWT claims.
4. **CRUD Roundtrip**: Creates a test metric record, updates it, verifies persistence, and safely deletes it.
5. **Audit Logging**: Confirms admin actions write to `activity_logs`.

---

## 8. Deployment & Production Guide

### Production Build Verification
To verify the application for production:
```bash
npm run build
```
Expected output:
```
✓ Compiled successfully
✓ Generating static pages using 11 workers (47/47)
✓ Finalizing page optimization
Route (app)                       Revalidate  Expire
┌ ○ /                                    15m      1y
├ ○ /admin/* (18 modules)
└ ƒ /api/* (32 endpoints)
```

### Deploying to Vercel
1. Link repository to Vercel:
   ```bash
   vercel
   ```
2. In Project Settings -> Environment Variables, configure:
   - `DATABASE_URL`: Your pooled Neon connection string.
   - `ADMIN_JWT_SECRET`: A secure 64-character secret.
   - `NEXT_PUBLIC_SITE_URL`: `https://altafhossainraju.com`
3. Trigger deployment:
   ```bash
   git push origin main
   ```
4. Run migration on production database if needed:
   ```bash
   node scripts/migrate.js
   ```

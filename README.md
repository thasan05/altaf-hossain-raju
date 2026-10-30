# Md. Altaf Hossain Raju, PMP® — Executive Portfolio & Dynamic CMS

Official personal portfolio website and Content Management System (CMS) for **Md. Altaf Hossain Raju, PMP®** — Area Manager at Marico Bangladesh Limited, Founder of LinkedIn Community Bangladesh (LCB), and executive mentor.

Built with **Next.js 16 (Turbopack, React 19, Tailwind CSS v4)**, **Neon Serverless PostgreSQL**, and a secure executive administrative control panel.

---

## Key Features

- **Full-Spectrum Content Management**: 100% of the portfolio content (Hero, Bio, Impact Metrics, Career Timeline, Ventures, Competencies, Speaking, Credentials, Awards, Affiliations, Press Coverage, Testimonials, Contact Channels, and Site Settings) is manageable via an authenticated admin dashboard.
- **Dynamic Layout & Section Control**: Drag-and-drop ordering and instant visibility toggles for all 11 homepage sections.
- **Integrated Media Asset Vault**: Upload, catalog, search, and embed imagery across every section form with direct preview and alt text management.
- **Enterprise-Grade Security**: HS256 JWT tokens using WebCrypto `jose`, 10-round `bcryptjs` password hashing, Next.js 16 `proxy.ts` route protection, and forensic `activity_logs` audit trail.
- **Zero-Downtime Resilience**: Data Access Layer (`src/lib/dal.ts`) automatically falls back to curated static datasets if database connectivity is ever interrupted.
- **Executive Broadsheet Aesthetic**: Respects `DESIGN.md` guidelines with `Newsreader` editorial serifs, `Manrope` sans-serif hierarchy, subtle gold `#D4AF37` hairline borders, and full WCAG AA contrast.

---

## Technology Stack

- **Framework**: Next.js 16.4.3 (App Router, Turbopack, Partial Prerendering, Component Caching)
- **UI Library**: React 19.3.0, Lucide React, Framer Motion
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL 16 hosted on Neon Serverless (`@neondatabase/serverless`)
- **Authentication**: JWT via `jose`, Password hashing via `bcryptjs`

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/thasan05/altaf-hossain-raju.git
cd altaf-hossain-raju
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
DATABASE_URL="postgresql://user:password@ep-rapid-wave-b5i11t1d-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"
ADMIN_JWT_SECRET="your-secure-random-jwt-secret-key-at-least-32-chars"
NEXT_PUBLIC_SITE_URL="https://altafhossainraju.com"
```

### 3. Run Database Migrations & Seed Data

```bash
node scripts/migrate.js
node scripts/seed.js
```

### 4. Run Development Server

```bash
npm run dev
```

- Public Portfolio: [http://localhost:3000](http://localhost:3000)
- Administrative Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Administrative Access

- **Login URL**: `/admin/login`
- **Initial Email**: `admin@altafhossainraju.com`
- **Initial Password**: `AdminRaju2026!Secure`

*(Change this password immediately via Admin Panel -> Security -> Change Password).*

---

## Verification & Automated Testing

Run the full end-to-end audit test suite:

```bash
node scripts/verify-all.js
```

Run production build and linting checks:

```bash
npm run lint
npm run build
```

---

## Documentation

For full architectural details, database schemas, and REST API specifications, refer to [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md).

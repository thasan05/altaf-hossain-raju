-- 001_initial_schema.sql
-- Complete schema for Altaf Hossain Raju Portfolio CMS

-- 1. Administrative Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- 2. Site Profile & Executive Biography
CREATE TABLE IF NOT EXISTS site_profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  full_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  initials TEXT NOT NULL,
  honorific_suffix TEXT NOT NULL,
  hero_headline TEXT NOT NULL,
  hero_subheadline TEXT NOT NULL,
  hero_narrative_bio TEXT NOT NULL,
  executive_bio_paragraphs JSONB NOT NULL,
  philosophy_quote TEXT NOT NULL,
  portrait_main_url TEXT NOT NULL,
  portrait_corporate_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Site Contact & Channels
CREATE TABLE IF NOT EXISTS site_contact (
  id TEXT PRIMARY KEY DEFAULT 'default',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  secondary_phone TEXT,
  address TEXT NOT NULL,
  origin TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  lcb_website_url TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Impact Metrics
CREATE TABLE IF NOT EXISTS impact_metrics (
  id TEXT PRIMARY KEY,
  metric_key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  number_value NUMERIC NOT NULL,
  suffix TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  verification_source TEXT NOT NULL,
  category TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Career Journey & Roles
CREATE TABLE IF NOT EXISTS career_roles (
  id TEXT PRIMARY KEY,
  role_slug TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  role_title TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  cluster TEXT,
  role_type TEXT NOT NULL DEFAULT 'previous',
  company_filter TEXT NOT NULL DEFAULT 'marico',
  logo_url TEXT NOT NULL,
  key_responsibilities JSONB NOT NULL,
  achievements JSONB NOT NULL,
  industry_context TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ventures & Ecosystems
CREATE TABLE IF NOT EXISTS ventures (
  id TEXT PRIMARY KEY,
  venture_slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  acronym TEXT,
  tagline TEXT NOT NULL,
  founded TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  website_url TEXT,
  description TEXT NOT NULL,
  detailed_story TEXT NOT NULL,
  impact_metrics JSONB NOT NULL,
  featured_image TEXT NOT NULL,
  highlights JSONB NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Areas of Expertise & Functional Domains
CREATE TABLE IF NOT EXISTS areas_of_expertise (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'secondary',
  description TEXT NOT NULL,
  competencies JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Speaking Engagements
CREATE TABLE IF NOT EXISTS speaking_events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  event_type TEXT NOT NULL,
  institution TEXT NOT NULL,
  date_text TEXT,
  participants TEXT,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  key_topics JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Academic & Professional Credentials
CREATE TABLE IF NOT EXISTS credentials (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  period_or_year TEXT NOT NULL,
  status TEXT NOT NULL,
  field TEXT NOT NULL,
  logo_url TEXT,
  details TEXT NOT NULL,
  verification_note TEXT NOT NULL,
  is_premier BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Corporate Honors & Citations
CREATE TABLE IF NOT EXISTS corporate_awards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Institutional Affiliations & Governance
CREATE TABLE IF NOT EXISTS leadership_roles (
  id TEXT PRIMARY KEY,
  role_title TEXT NOT NULL,
  organization TEXT NOT NULL,
  period TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Media Coverage
CREATE TABLE IF NOT EXISTS media_features (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  outlet TEXT NOT NULL,
  date_text TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  link_text TEXT NOT NULL,
  url TEXT NOT NULL,
  highlight_quote TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Testimonials & Community Voices
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  quote TEXT NOT NULL,
  context TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Section Settings (Order, Visibility & Titles)
CREATE TABLE IF NOT EXISTS section_settings (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  custom_title TEXT,
  custom_subtitle TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Site Customization & SEO
CREATE TABLE IF NOT EXISTS site_customization (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  keywords JSONB NOT NULL,
  og_image_url TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  accent_color TEXT NOT NULL DEFAULT '#D4AF37',
  background_color TEXT NOT NULL DEFAULT '#070A11',
  surface_color TEXT NOT NULL DEFAULT '#0C111C',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Media Assets
CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_impact_metrics_sort ON impact_metrics (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_career_roles_sort ON career_roles (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_ventures_sort ON ventures (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_speaking_sort ON speaking_events (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_credentials_sort ON credentials (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_awards_sort ON corporate_awards (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_leadership_sort ON leadership_roles (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_media_sort ON media_features (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON testimonials (sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_sections_sort ON section_settings (sort_order, is_visible);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs (created_at DESC);

// scripts/seed.js
const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env.local if present
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function seed() {
  console.log("Seeding database with portfolio content and initial admin user...");

  // 1. Seed Admin User
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@altafhossainraju.com";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "AdminRaju2026!Secure";
  const adminName = process.env.INITIAL_ADMIN_NAME || "Md. Altaf Hossain Raju";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await sql.query(
    `INSERT INTO admin_users (id, email, password_hash, name, role)
     VALUES ($1, $2, $3, $4, 'superadmin')
     ON CONFLICT (email) DO UPDATE 
     SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name`,
    ["usr_admin_1", adminEmail, passwordHash, adminName]
  );
  console.log(`✓ Admin user provisioned: ${adminEmail}`);

  // 2. Seed Site Profile
  const executiveBio = [
    "Altaf Hossain Raju, PMP®, is a distinguished Bangladeshi corporate professional, entrepreneur, and community builder with over seven years of cross-industry operational leadership across global FMCG and telecommunications multinationals, including Marico Bangladesh, Robi Axiata, and Nestlé Bangladesh.",
    "As Area Manager – Market Operation at Marico Bangladesh Limited, Altaf oversees sales planning, route-to-market architecture, alternative channel distribution, and multi-tier team management across strategic clusters. His commercial discipline and execution excellence have earned him Marico's highest corporate accolade—the 'Go Beyond Award'—alongside the Global CEO Award for two consecutive cycles.",
    "Beyond corporate boardrooms and commercial distribution networks, Altaf is the visionary Founder of LinkedIn Community Bangladesh (LCB), the nation's premier professional community connecting 24,000+ ambitious students, campus leads, and corporate leaders across 12+ leading universities. As Founding President of Skill Hunt at the University of Dhaka, he pioneered structured campus-to-career readiness training for more than 2,600 university students.",
    "Currently pursuing his Executive MBA in Marketing at the Institute of Business Administration (IBA), University of Dhaka, Altaf marries boardroom strategic rigour with grassroots youth empowerment—proving that sustainable business success is fundamentally powered by uplifting the people behind it."
  ];

  await sql.query(
    `INSERT INTO site_profile (
      id, full_name, display_name, short_name, initials, honorific_suffix,
      hero_headline, hero_subheadline, hero_narrative_bio,
      executive_bio_paragraphs, philosophy_quote, portrait_main_url, portrait_corporate_url
    ) VALUES (
      'default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    ) ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      display_name = EXCLUDED.display_name,
      short_name = EXCLUDED.short_name,
      initials = EXCLUDED.initials,
      honorific_suffix = EXCLUDED.honorific_suffix,
      hero_headline = EXCLUDED.hero_headline,
      hero_subheadline = EXCLUDED.hero_subheadline,
      hero_narrative_bio = EXCLUDED.hero_narrative_bio,
      executive_bio_paragraphs = EXCLUDED.executive_bio_paragraphs,
      philosophy_quote = EXCLUDED.philosophy_quote,
      portrait_main_url = EXCLUDED.portrait_main_url,
      portrait_corporate_url = EXCLUDED.portrait_corporate_url`,
    [
      "Md. Altaf Hossain Raju",
      "Altaf Hossain Raju, PMP®",
      "Altaf Hossain Raju",
      "AHR",
      "PMP®",
      "Building Businesses. Empowering People. Creating Impact.",
      "Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh (LCB), and PMP® certified corporate strategist dedicated to FMCG market leadership, youth employability, and high-performance team development.",
      "A multinational commercial strategist with over seven years of operational route-to-market execution across Marico Bangladesh, Robi Axiata, and Nestlé. Dedicated to converting commercial rigor into high-velocity revenue growth, while building nationwide capability pipelines for Bangladesh's next generation of professionals.",
      JSON.stringify(executiveBio),
      "True commercial leadership is measured not merely by revenue targets fulfilled, but by the capacity of your teams to outgrow their current horizons and create enduring value for society.",
      "/images/altaf-portrait-lcb.webp",
      "/images/altaf-portrait-corporate.webp"
    ]
  );
  console.log("✓ Site profile seeded");

  // 3. Seed Site Contact
  await sql.query(
    `INSERT INTO site_contact (
      id, email, phone, secondary_phone, address, origin, linkedin_url, lcb_website_url, whatsapp_number
    ) VALUES (
      'default', $1, $2, $3, $4, $5, $6, $7, $8
    ) ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      secondary_phone = EXCLUDED.secondary_phone,
      address = EXCLUDED.address,
      origin = EXCLUDED.origin,
      linkedin_url = EXCLUDED.linkedin_url,
      lcb_website_url = EXCLUDED.lcb_website_url,
      whatsapp_number = EXCLUDED.whatsapp_number`,
    [
      "altafhossainraju20@gmail.com",
      "+880 1833-183724",
      "+880 1521-494865",
      "House 49, Banasree, Rampura, Dhaka, Bangladesh",
      "Mirsarai, Chittagong, Bangladesh",
      "https://www.linkedin.com/in/altafhossainraju/",
      "https://linkedincommunitybangladesh.com/",
      "+8801833183724"
    ]
  );
  console.log("✓ Site contact seeded");

  // 4. Seed Impact Metrics
  const metrics = [
    {
      id: "metric_members",
      key: "members",
      value: "24,000+",
      numberValue: 24000,
      suffix: "+",
      label: "Students & Professionals Impacted",
      description: "Documented membership in LinkedIn Community Bangladesh (LCB) receiving career strategy, profile optimization, and networking guidance.",
      verificationSource: "LinkedIn Community BD Platform Official Count",
      category: "Community Impact",
      isPrimary: true,
      sortOrder: 1
    },
    {
      id: "metric_sessions",
      key: "sessions",
      value: "192+",
      numberValue: 192,
      suffix: "+",
      label: "Career Sessions & Masterclasses",
      description: "Public and university-based sessions conducted on personal branding, corporate readiness, and sales strategy.",
      verificationSource: "Documented LCB Event Logs & Campus Lead Archive",
      category: "Mentorship",
      isPrimary: true,
      sortOrder: 2
    },
    {
      id: "metric_students",
      key: "students-trained",
      value: "2,600+",
      numberValue: 2600,
      suffix: "+",
      label: "University Students Trained via Skill Hunt",
      description: "Graduates of structured hands-on modules in business presentation, digital marketing, and market research at DU Faculty of Business Studies.",
      verificationSource: "Skill Hunt Historical Training Archives & Financial Express",
      category: "Capacity Building",
      isPrimary: false,
      sortOrder: 3
    },
    {
      id: "metric_experience",
      key: "experience-years",
      value: "7+",
      numberValue: 7,
      suffix: "+ Years",
      label: "Multinational Corporate FMCG & Telecom Track Record",
      description: "Proven execution spanning Marico Bangladesh, Robi Axiata Limited, and Nestlé Bangladesh across high-stakes clusters.",
      verificationSource: "Employment Record (Nestlé 2018, Robi 2019–22, Marico 2022–Present)",
      category: "Corporate Excellence",
      isPrimary: false,
      sortOrder: 4
    },
    {
      id: "metric_awards",
      key: "awards",
      value: "2x",
      numberValue: 2,
      suffix: "x",
      label: "Global CEO Award Winner at Marico",
      description: "Conferred twice consecutively for outstanding market penetration and commercial growth across designated clusters.",
      verificationSource: "Marico Bangladesh Corporate Recognitions",
      category: "Distinction",
      isPrimary: false,
      sortOrder: 5
    },
    {
      id: "metric_universities",
      key: "universities",
      value: "12+",
      numberValue: 12,
      suffix: "+",
      label: "Universities with Active LCB Footprint",
      description: "Campus leads and student cohorts mobilized across Bangladesh's premier public and private tertiary institutions.",
      verificationSource: "LCB Campus Leads Summit Vol. 01 & 02",
      category: "Campus Reach",
      isPrimary: false,
      sortOrder: 6
    }
  ];

  for (const m of metrics) {
    await sql.query(
      `INSERT INTO impact_metrics (
        id, metric_key, value, number_value, suffix, label, description,
        verification_source, category, is_primary, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
      ON CONFLICT (metric_key) DO UPDATE SET
        value = EXCLUDED.value,
        number_value = EXCLUDED.number_value,
        suffix = EXCLUDED.suffix,
        label = EXCLUDED.label,
        description = EXCLUDED.description,
        verification_source = EXCLUDED.verification_source,
        category = EXCLUDED.category,
        is_primary = EXCLUDED.is_primary,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [m.id, m.key, m.value, m.numberValue, m.suffix, m.label, m.description, m.verificationSource, m.category, m.isPrimary, m.sortOrder]
    );
  }
  console.log(`✓ Impact metrics seeded (${metrics.length})`);

  // 5. Seed Career Roles
  const roles = [
    {
      id: "role_marico_southern",
      slug: "marico-southern",
      company: "Marico Bangladesh Limited",
      roleTitle: "Area Manager – Market Operation (Southern Cluster)",
      period: "January 2024 – Present",
      location: "Southern Cluster, Bangladesh",
      cluster: "Southern Cluster",
      roleType: "current",
      companyFilter: "marico",
      logoUrl: "/logos/marico-logo.png",
      keyResponsibilities: [
        "Spearhead market operations, sales execution, and channel distribution development across the strategic Southern Cluster.",
        "Directly recruit, mentor, and supervise Territory Officers and Sales Managers to consistently exceed ambitious commercial targets.",
        "Execute Route-to-Market (RTM) transformations, strengthening distributor profitability (ROI), hygiene, and regulatory compliance.",
        "Leverage market analytics and competitor intelligence to guide real-time pricing, promotional activations, and stock velocity."
      ],
      achievements: [
        "Recognized in the Super Performing Area Manager category in the Q4'24 Leaderboard.",
        "Awarded the prestigious Global CEO Award for the 2nd consecutive time for exceptional revenue and distribution KPIs.",
        "Q4'24 Red Star Performer for surpassing primary and secondary sales targets."
      ],
      industryContext: "Fast-Moving Consumer Goods (FMCG) – Beauty, Wellness & Food Formats.",
      sortOrder: 1
    },
    {
      id: "role_marico_eastern",
      slug: "marico-eastern",
      company: "Marico Bangladesh Limited",
      roleTitle: "Area Manager – Market Operation (Eastern Cluster)",
      period: "June 2022 – December 2023",
      location: "Eastern Cluster, Bangladesh",
      cluster: "Eastern Cluster",
      roleType: "previous",
      companyFilter: "marico",
      logoUrl: "/logos/marico-logo.png",
      keyResponsibilities: [
        "Led distributor networks, territory development, and trade marketing initiatives throughout the Eastern region.",
        "Managed new product launching plans (NPLP) ensuring rapid shelf-space dominance and consumer trial generation.",
        "Instituted team capacity enhancement programs and grievance resolution mechanisms for distributor sales forces."
      ],
      achievements: [
        "Regional Redcube Champion in Q1'23 for outstanding product penetration.",
        "Global CEO Award recipient for commercial excellence.",
        "Conferred Marico's highest organizational distinction: 'Go Beyond Award' from the Chief Executive Officer."
      ],
      industryContext: "FMCG Distribution & Brand Penetration.",
      sortOrder: 2
    },
    {
      id: "role_robi_asst_mgr",
      slug: "robi-assistant-mgr",
      company: "Robi Axiata Limited",
      roleTitle: "Assistant Manager – Sales",
      period: "April 2021 – May 2022",
      location: "Khulna & Bagerhat, Bangladesh",
      cluster: null,
      roleType: "previous",
      companyFilter: "robi",
      logoUrl: "/logos/robi-logo.png",
      keyResponsibilities: [
        "Drove telecommunications retail sales, distribution network efficiency, and digital recharge penetration across Khulna and Bagerhat divisions.",
        "Supervised territory teams and regional retail touchpoints to maximize SIM activations, data consumption, and partner compliance.",
        "Coordinated with marketing and product teams on localized campaigns and trade partner incentive drives."
      ],
      achievements: [
        "Awarded National BEST STM for FY 2021-22 for delivering highest growth across the comprehensive KPI Index.",
        "Nationally recognized as Robi Guiding Principle Champion in Q4'22.",
        "Recognized as Champion Territory Manager nationally in JFB & 1st Runner up in PNS Category."
      ],
      industryContext: "Telecommunications & Digital Services.",
      sortOrder: 3
    },
    {
      id: "role_robi_territory_mgr",
      slug: "robi-territory-mgr",
      company: "Robi Axiata Limited",
      roleTitle: "Territory Manager",
      period: "October 2019 – March 2021",
      location: "Meherpur, Bangladesh",
      cluster: null,
      roleType: "previous",
      companyFilter: "robi",
      logoUrl: "/logos/robi-logo.png",
      keyResponsibilities: [
        "Managed distributor accounts, point-of-sale visibility, and field retail operations throughout Meherpur territory.",
        "Organized retailer engagement programs to expand alternative digital top-up services and SIM availability."
      ],
      achievements: [
        "Received Regional Head Award for bringing commercial excellence in H1 (FY 2020-21).",
        "Won Quarterly WOW Awards for three consecutive quarters (H1, H2, and H3 of FY 2020-21)."
      ],
      industryContext: "Telecom Retail Distribution.",
      sortOrder: 4
    },
    {
      id: "role_nestle_b2b",
      slug: "nestle-b2b",
      company: "Nestlé Bangladesh Limited",
      roleTitle: "Territory-in-Charge (B2B & Corporate Channel)",
      period: "January 2018 – September 2019",
      location: "Dhaka, Bangladesh",
      cluster: null,
      roleType: "previous",
      companyFilter: "nestle",
      logoUrl: "/logos/nestle-logo.png",
      keyResponsibilities: [
        "Identified and closed high-value B2B accounts, placing institutional vending machines, corporate kiosks, and experience zones.",
        "Nurtured enterprise client relationships while developing new corporate accounts to expand institutional consumption of beverage and nutrition lines.",
        "Recruited and trained distributor B2B sales personnel to meet stringent multinational service-level agreements."
      ],
      achievements: [
        "Secured flagship corporate accounts across multinational offices, universities, and commercial hubs in metropolitan Dhaka.",
        "Maintained exceptional distributor ROI and compliance benchmarks."
      ],
      industryContext: "Multinational Food & Beverage – Institutional & Corporate Channels.",
      sortOrder: 5
    }
  ];

  for (const r of roles) {
    await sql.query(
      `INSERT INTO career_roles (
        id, role_slug, company, role_title, period, location, cluster, role_type,
        company_filter, logo_url, key_responsibilities, achievements, industry_context,
        sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
      ON CONFLICT (role_slug) DO UPDATE SET
        company = EXCLUDED.company,
        role_title = EXCLUDED.role_title,
        period = EXCLUDED.period,
        location = EXCLUDED.location,
        cluster = EXCLUDED.cluster,
        role_type = EXCLUDED.role_type,
        company_filter = EXCLUDED.company_filter,
        logo_url = EXCLUDED.logo_url,
        key_responsibilities = EXCLUDED.key_responsibilities,
        achievements = EXCLUDED.achievements,
        industry_context = EXCLUDED.industry_context,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [
        r.id, r.slug, r.company, r.roleTitle, r.period, r.location, r.cluster, r.roleType,
        r.companyFilter, r.logoUrl, JSON.stringify(r.keyResponsibilities), JSON.stringify(r.achievements),
        r.industryContext, r.sortOrder
      ]
    );
  }
  console.log(`✓ Career roles seeded (${roles.length})`);

  // 6. Seed Ventures
  const ventures = [
    {
      id: "ven_lcb",
      slug: "lcb",
      name: "LinkedIn Community Bangladesh",
      acronym: "LCB",
      tagline: "Bangladesh's First LinkedIn-Based Professional Growth Movement",
      founded: "2022",
      role: "Founder & Chief Community Architect",
      status: "Active",
      websiteUrl: "https://linkedincommunitybangladesh.com/",
      description: "A transformative nationwide ecosystem bridging the gap between textbook academia and real-world corporate expectations through digital visibility, personal branding, and peer networking.",
      detailedStory: "Established to democratize career capital in Bangladesh, LinkedIn Community Bangladesh grew from grassroots student sessions into a structured movement spanning 12+ top universities. Through regular campus masterclasses, executive town halls, and nationwide Campus Leads Summits, LCB empowers youth to build authentic professional identities on LinkedIn, engage directly with corporate hiring managers, and secure high-value careers before graduation.",
      impactMetrics: [
        { label: "Community Members", value: "24,000+" },
        { label: "Sessions Hosted", value: "192+" },
        { label: "Partner Universities", value: "12+" },
        { label: "Campus Summits", value: "Vol. 01 & 02" }
      ],
      featuredImage: "/images/lcb-campus-leads-summit.webp",
      highlights: [
        "Campus Leads Summit Vol. 01 & 02 convening student leaders from across Bangladesh.",
        "Direct collaboration with university clubs including Jagannath University Finance Club, DU, and UIU.",
        "Quarterly Leadership Labs and official Letters of Recommendation for exemplary youth leaders.",
        "Democratized masterclasses on modern resume strategy, personal branding, and algorithmic networking."
      ],
      ctaLabel: "Visit Official LCB Platform",
      ctaUrl: "https://linkedincommunitybangladesh.com/",
      sortOrder: 1
    },
    {
      id: "ven_skill_hunt",
      slug: "skill-hunt",
      name: "Skill Hunt",
      acronym: null,
      tagline: "Pioneering Student Skill-Development Training Hub at University of Dhaka",
      founded: "November 11, 2016",
      role: "Founding President",
      status: "Established",
      websiteUrl: null,
      description: "The country's first student-led skill-development training hub, founded at the Faculty of Business Studies, University of Dhaka, focused on business strategy, presentations, and market readiness.",
      detailedStory: "Recognizing that conventional classroom curricula rarely provided hands-on commercial competencies, Altaf co-founded Skill Hunt alongside Shahoriar Ahmed and Mashiur Rahman at the University of Dhaka. Skill Hunt delivered rigorous, multi-week certified workshops led by industry practitioners in advanced corporate presentations, market research methodologies, and brand management, earning recognition in The Financial Express as a pioneering youth development platform.",
      impactMetrics: [
        { label: "Students Trained", value: "2,600+" },
        { label: "Training Sessions", value: "32+" },
        { label: "Core Focus", value: "Practical Skills" },
        { label: "Media Coverage", value: "The Financial Express" }
      ],
      featuredImage: "/images/lcb-training-masterclass.webp",
      highlights: [
        "Featured in The Financial Express for pioneering student-led professional training.",
        "Delivered month-long certified training programs in Brand Management, STP, and IMC.",
        "Equipped university graduates with Advanced PowerPoint, analytical problem-solving, and communication frameworks.",
        "Served as the foundational template that later evolved into nationwide digital initiatives."
      ],
      ctaLabel: null,
      ctaUrl: null,
      sortOrder: 2
    },
    {
      id: "ven_career_talks",
      slug: "career-talks",
      name: "Career Talks",
      acronym: null,
      tagline: "Democratized Digital Career Mentorship and Knowledge Sharing",
      founded: "September 2020",
      role: "Founder & Producer",
      status: "Active",
      websiteUrl: null,
      description: "An open-access digital knowledge-sharing platform and video channel providing transparent corporate advice, interview preparation techniques, and career transition roadmaps.",
      detailedStory: "Launched during the pandemic in September 2020, Career Talks removed geographic barriers for talented students outside metropolitan hubs. By conducting video interviews with leading HR directors, marketing veterans, and entrepreneurs, the platform provides actionable insights into corporate hiring benchmarks, sales career paths, and leadership fundamentals.",
      impactMetrics: [
        { label: "Format", value: "Digital & Video" },
        { label: "Reach", value: "Nationwide" },
        { label: "Key Focus", value: "Corporate Insights" },
        { label: "Access", value: "100% Free" }
      ],
      featuredImage: "/images/lcb-executive-panel.webp",
      highlights: [
        "In-depth discussions on cracking multinational assessment centres and management trainee exams.",
        "First-person corporate transition accounts from regional universities to multinational head offices.",
        "Practical breakdowns of route-to-market mechanics and modern commercial strategy."
      ],
      ctaLabel: null,
      ctaUrl: null,
      sortOrder: 3
    }
  ];

  for (const v of ventures) {
    await sql.query(
      `INSERT INTO ventures (
        id, venture_slug, name, acronym, tagline, founded, role, status,
        website_url, description, detailed_story, impact_metrics, featured_image,
        highlights, cta_label, cta_url, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, TRUE)
      ON CONFLICT (venture_slug) DO UPDATE SET
        name = EXCLUDED.name,
        acronym = EXCLUDED.acronym,
        tagline = EXCLUDED.tagline,
        founded = EXCLUDED.founded,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        website_url = EXCLUDED.website_url,
        description = EXCLUDED.description,
        detailed_story = EXCLUDED.detailed_story,
        impact_metrics = EXCLUDED.impact_metrics,
        featured_image = EXCLUDED.featured_image,
        highlights = EXCLUDED.highlights,
        cta_label = EXCLUDED.cta_label,
        cta_url = EXCLUDED.cta_url,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [
        v.id, v.slug, v.name, v.acronym, v.tagline, v.founded, v.role, v.status,
        v.websiteUrl, v.description, v.detailedStory, JSON.stringify(v.impactMetrics),
        v.featuredImage, JSON.stringify(v.highlights), v.ctaLabel, v.ctaUrl, v.sortOrder
      ]
    );
  }
  console.log(`✓ Ventures seeded (${ventures.length})`);

  // 7. Seed Areas of Expertise
  const expertise = [
    {
      id: "exp_rtm",
      title: "Commercial & Route-to-Market (RTM) Strategy",
      tier: "flagship",
      description: "Architecting robust distribution networks, distributor ROI modeling, territory restructuring, and primary-to-secondary sales pipeline optimization.",
      competencies: [
        "RTM Transformation",
        "Distributor ROI & Hygiene",
        "Channel Margin Modeling",
        "Outlet Penetration Dynamics"
      ],
      sortOrder: 1
    },
    {
      id: "exp_b2b",
      title: "B2B & Alternative Channel Expansion",
      tier: "secondary",
      description: "Securing enterprise institutional accounts, corporate kiosks, vending networks, and customized B2B value propositions with sustainable client retention.",
      competencies: [
        "Institutional Sales",
        "Corporate Key Accounts",
        "Contract Negotiation",
        "Vending & Kiosk Rollouts"
      ],
      sortOrder: 2
    },
    {
      id: "exp_leadership",
      title: "High-Performance Team Leadership",
      tier: "secondary",
      description: "Hiring, training, and building high-morale sales forces across multi-district territories, instilling accountable metrics and empathetic grievance resolution.",
      competencies: [
        "Field Sales Coaching",
        "Performance Management",
        "Capacity Development",
        "Talent Retention"
      ],
      sortOrder: 3
    },
    {
      id: "exp_branding",
      title: "Professional Personal Branding & Social Selling",
      tier: "mentorship",
      description: "Guiding professionals and organizations on establishing authentic digital presence, thought leadership, and organic talent acquisition via LinkedIn.",
      competencies: [
        "Executive Branding",
        "LinkedIn Growth Strategy",
        "Digital Visibility",
        "Network Cultivation"
      ],
      sortOrder: 4
    },
    {
      id: "exp_nplp",
      title: "New Product Launching & Trade Marketing",
      tier: "mentorship",
      description: "End-to-end design and execution of market penetration campaigns, point-of-sale visibility drives, and rapid consumer trial generation.",
      competencies: [
        "NPLP Execution",
        "Trade Promotions",
        "POSM Placement",
        "Market Trend Analytics"
      ],
      sortOrder: 5
    },
    {
      id: "exp_youth",
      title: "Youth Employability & Executive Facilitation",
      tier: "pmp",
      description: "Designing immersive workshops and campus masterclasses that equip university graduates with market-ready presentation, communication, and business skills.",
      competencies: [
        "Interactive Workshops",
        "Curriculum Design",
        "Public Speaking",
        "Career Guidance Labs"
      ],
      sortOrder: 6
    }
  ];

  for (const e of expertise) {
    await sql.query(
      `INSERT INTO areas_of_expertise (
        id, title, tier, description, competencies, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        tier = EXCLUDED.tier,
        description = EXCLUDED.description,
        competencies = EXCLUDED.competencies,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [e.id, e.title, e.tier, e.description, JSON.stringify(e.competencies), e.sortOrder]
    );
  }
  console.log(`✓ Areas of expertise seeded (${expertise.length})`);

  // 8. Seed Speaking Events
  const events = [
    {
      id: "spk_jnu_marketing",
      slug: "jnu-marketing-masterclass",
      title: "Personal Branding & LinkedIn Optimization Masterclass",
      organizer: "Dept. of Marketing, Jagannath University & LCB",
      eventType: "Masterclass",
      institution: "Room 553, Faculty of Business Studies, Jagannath University",
      participants: "Chief Guest: Dr. Imranul Hoque, Dept. Chairman",
      description: "Specialized interactive session equipping university undergraduates with tactical LinkedIn profile architecture, digital personal branding, and algorithmic networking strategies for corporate recruitment.",
      imageUrl: "/images/lcb-campus-workshop.webp",
      keyTopics: ["LinkedIn Profile Architecture", "Algorithmic Reach", "Corporate Recruitment"],
      sortOrder: 1
    },
    {
      id: "spk_summit_v2",
      slug: "campus-leads-summit-v2",
      title: "Campus Leads Summit Vol. 02 — Leadership & Strategy Labs",
      organizer: "LinkedIn Community Bangladesh Central Council",
      eventType: "Summit",
      institution: "Dhaka Central Auditorium",
      participants: "University Campus Leads from 12+ Institutions",
      description: "Conducted strategic leadership workshops for LCB campus leads nationwide, reviewing community expansion frameworks, campus engagement roadmaps, and youth development impact.",
      imageUrl: "/images/lcb-campus-leads-summit.webp",
      keyTopics: ["Community Architecture", "Public Engagement", "Strategy Execution"],
      sortOrder: 2
    },
    {
      id: "spk_hamdard",
      slug: "hamdard-univ-keynote",
      title: "Personal Branding & Corporate Career Trajectories Keynote",
      organizer: "Hamdard University Bangladesh & LCB",
      eventType: "Keynote",
      institution: "Hamdard University Bangladesh Central Auditorium",
      participants: "500+ Faculty & Undergraduates",
      description: "Comprehensive keynote and convocation-style address breaking down corporate employer expectations, multinational interview stages, and building personal resilience in modern sales & marketing careers.",
      imageUrl: "/images/lcb-auditorium-speech.webp",
      keyTopics: ["Campus to Corporate", "Executive Presence", "FMCG Hiring Realities"],
      sortOrder: 3
    },
    {
      id: "spk_digital_vis",
      slug: "digital-visibility-workshop",
      title: "Digital Career Strategies & Professional Visibility Workshop",
      organizer: "Faculty of Business Studies Youth Forum & LCB",
      eventType: "Workshop",
      institution: "University Lecture Conclave",
      participants: "Selected Student Cohort",
      description: "Hands-on workshop detailing how to position academic achievements, extracurricular leadership, and project portfolios to attract corporate recruiters and hiring managers.",
      imageUrl: "/images/lcb-executive-panel.webp",
      keyTopics: ["Personal Branding", "Recruiter Outreach", "Career Transitions"],
      sortOrder: 4
    },
    {
      id: "spk_commercial_forum",
      slug: "commercial-leadership-forum",
      title: "Executive Facilitation & Commercial Leadership Masterclass",
      organizer: "Corporate Conclaves & FMCG Youth Summits",
      eventType: "Panel Discussion",
      institution: "Executive Conclave Hub",
      participants: "Sales Managers & Territory Officers",
      description: "High-level dialogue on route-to-market mechanics, dealer ROI hygiene, and leading cross-functional commercial teams in competitive multinational landscapes.",
      imageUrl: "/images/lcb-leadership-forum.webp",
      keyTopics: ["Sales Leadership", "Route-to-Market Strategy", "Data-Driven Distribution"],
      sortOrder: 5
    },
    {
      id: "spk_skill_hunt_masterclass",
      slug: "skill-hunt-brand-masterclass",
      title: "Skill Hunt Practical Training & Brand Management Series",
      organizer: "Skill Hunt, Faculty of Business Studies, University of Dhaka",
      eventType: "Masterclass",
      institution: "Faculty of Business Studies, University of Dhaka",
      participants: "2,600+ Students Trained Across Tenures",
      description: "Month-long intensive modules covering STP (Segmentation, Targeting, Positioning), integrated marketing communication (IMC), advanced PowerPoint presentations, and real-world case analysis.",
      imageUrl: "/images/lcb-training-masterclass.webp",
      keyTopics: ["STP Framework", "Advanced Presentations", "Case Solving"],
      sortOrder: 6
    }
  ];

  for (const ev of events) {
    await sql.query(
      `INSERT INTO speaking_events (
        id, slug, title, organizer, event_type, institution, participants,
        description, image_url, key_topics, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        organizer = EXCLUDED.organizer,
        event_type = EXCLUDED.event_type,
        institution = EXCLUDED.institution,
        participants = EXCLUDED.participants,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
        key_topics = EXCLUDED.key_topics,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [
        ev.id, ev.slug, ev.title, ev.organizer, ev.eventType, ev.institution,
        ev.participants, ev.description, ev.imageUrl, JSON.stringify(ev.keyTopics), ev.sortOrder
      ]
    );
  }
  console.log(`✓ Speaking events seeded (${events.length})`);

  // 9. Seed Credentials
  const credentials = [
    {
      id: "cred_emba_iba",
      slug: "emba-iba",
      title: "Executive MBA (Major in Marketing)",
      institution: "Institute of Business Administration (IBA), University of Dhaka",
      periodOrYear: "Expected Completion: 2026",
      status: "Pursuing (Expected 2026)",
      field: "Executive Business Administration & Marketing",
      logoUrl: "/logos/iba-du-logo.png",
      details: "Rigorous executive coursework at Bangladesh's premier business school, focusing on advanced marketing strategy, managerial economics, supply chain dynamics, and corporate finance.",
      verificationNote: "Verified from primary academic enrollment record (IBA DU EMBA).",
      isPremier: true,
      sortOrder: 1
    },
    {
      id: "cred_pmp",
      slug: "pmp",
      title: "Project Management Professional (PMP®)",
      institution: "Project Management Institute (PMI) / IBA University of Dhaka",
      periodOrYear: "Certified Credential",
      status: "Certified",
      field: "Global Project Management Standards",
      logoUrl: "/logos/iba-du-logo.png",
      details: "Completed certified Project Management for Professional Competencies (PMPC) at Institute of Business Administration (IBA), University of Dhaka, mastering agile execution, risk management, and project governance.",
      verificationNote: "Verified credential and certified coursework.",
      isPremier: true,
      sortOrder: 2
    },
    {
      id: "cred_bba_du",
      slug: "bba-du",
      title: "Bachelor of Business Administration (BBA in Marketing)",
      institution: "Faculty of Business Studies, University of Dhaka",
      periodOrYear: "Class of 2017",
      status: "Completed",
      field: "Marketing, Consumer Behavior & Business Strategy",
      logoUrl: null,
      details: "Graduated with CGPA 3.30/4.00 from Bangladesh's most competitive business faculty. Active in student leadership, founding Skill Hunt and leading the DU Entrepreneurship Development Club.",
      verificationNote: "Official University of Dhaka academic degree.",
      isPremier: false,
      sortOrder: 3
    },
    {
      id: "cred_bitm_digital",
      slug: "bitm-digital",
      title: "Certified Comprehensive Digital Marketing Program",
      institution: "BASIS Institute of Technology & Management (BITM)",
      periodOrYear: "Professional Diploma",
      status: "Completed",
      field: "SEO, SEM, SMM, Analytics & Paid Campaign Architecture",
      logoUrl: "/logos/bitm-logo.png",
      details: "30-day intensive certified program covering search engine optimization, web analytics, audience segmentation, and performance advertising.",
      verificationNote: "Certified industry training.",
      isPremier: false,
      sortOrder: 4
    },
    {
      id: "cred_wit_cs",
      slug: "wit-cs",
      title: "Diploma in Computer Science",
      institution: "World Information & Technology Foundation",
      periodOrYear: "6-Month Diploma",
      status: "Completed",
      field: "Computer Science, AI Tools, Graphic Design & Office Suites",
      logoUrl: "/logos/wit-foundation-logo.png",
      details: "Practical training in advanced office productivity, data analysis, graphics software (Adobe Suite), and foundational digital technologies.",
      verificationNote: "Certified diploma program.",
      isPremier: false,
      sortOrder: 5
    },
    {
      id: "cred_google",
      slug: "google-digital-garage",
      title: "Certified Digital Marketing Fundamentals",
      institution: "Google Digital Garage",
      periodOrYear: "Global Certificate",
      status: "Completed",
      field: "Digital Strategy & Online Presence",
      logoUrl: null,
      details: "Accredited by Interactive Advertising Bureau (IAB) Europe and Google, validating digital marketing comprehension.",
      verificationNote: "Standard Google certification.",
      isPremier: false,
      sortOrder: 6
    }
  ];

  for (const c of credentials) {
    await sql.query(
      `INSERT INTO credentials (
        id, slug, title, institution, period_or_year, status, field,
        logo_url, details, verification_note, is_premier, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        institution = EXCLUDED.institution,
        period_or_year = EXCLUDED.period_or_year,
        status = EXCLUDED.status,
        field = EXCLUDED.field,
        logo_url = EXCLUDED.logo_url,
        details = EXCLUDED.details,
        verification_note = EXCLUDED.verification_note,
        is_premier = EXCLUDED.is_premier,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [
        c.id, c.slug, c.title, c.institution, c.periodOrYear, c.status, c.field,
        c.logoUrl, c.details, c.verificationNote, c.isPremier, c.sortOrder
      ]
    );
  }
  console.log(`✓ Credentials seeded (${credentials.length})`);

  // 10. Seed Corporate Awards
  const awards = [
    {
      id: "awd_ceo_2x",
      title: "Global CEO Award (2nd Consecutive Time)",
      organization: "Marico Bangladesh Limited",
      description: "Conferred by Marico Global CEO for unmatched market execution, volume expansion, and revenue milestones.",
      year: "2023 & 2024",
      sortOrder: 1
    },
    {
      id: "awd_go_beyond",
      title: "Go Beyond Award",
      organization: "Marico Bangladesh Limited",
      description: "Marico's most prestigious annual organizational recognition, awarded directly by the CEO at MBL Annual OC 2021.",
      year: "2021",
      sortOrder: 2
    },
    {
      id: "awd_robi_best_stm",
      title: "National BEST STM for FY 2021-22",
      organization: "Robi Axiata Limited",
      description: "Awarded nationally for achieving the highest overall growth across all KPI Index parameters.",
      year: "2022",
      sortOrder: 3
    },
    {
      id: "awd_robi_guiding",
      title: "Robi Guiding Principle Champion",
      organization: "Robi Axiata Limited",
      description: "Recognized nationally in Q4'22 for embodying the company's core cultural and operational leadership principles.",
      year: "2022",
      sortOrder: 4
    },
    {
      id: "awd_marico_redcube",
      title: "Regional Redcube Champion",
      organization: "Marico Bangladesh Limited",
      description: "Awarded in Q1'23 for delivering extraordinary product penetration and market share acquisition.",
      year: "2023",
      sortOrder: 5
    },
    {
      id: "awd_robi_tm_champ",
      title: "Champion Territory Manager (Nationally)",
      organization: "Robi Axiata Limited",
      description: "Recognized nationally in JFB & 1st Runner Up in PNS Category for exceptional commercial delivery.",
      year: "2021",
      sortOrder: 6
    }
  ];

  for (const a of awards) {
    await sql.query(
      `INSERT INTO corporate_awards (
        id, title, organization, year, description, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        organization = EXCLUDED.organization,
        year = EXCLUDED.year,
        description = EXCLUDED.description,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [a.id, a.title, a.organization, a.year, a.description, a.sortOrder]
    );
  }
  console.log(`✓ Corporate awards seeded (${awards.length})`);

  // 11. Seed Leadership Roles
  const leadership = [
    {
      id: "lead_lcb",
      roleTitle: "Founder & Community Architect",
      organization: "LinkedIn Community Bangladesh (LCB)",
      period: "2022 – Present",
      sortOrder: 1
    },
    {
      id: "lead_skill_hunt",
      roleTitle: "Founding President",
      organization: "Skill Hunt (Dhaka University Business Club)",
      period: "Nov 2016 – Transitioned",
      sortOrder: 2
    },
    {
      id: "lead_duedc",
      roleTitle: "Former President",
      organization: "Dhaka University Entrepreneurship Development Club",
      period: "University Tenure",
      sortOrder: 3
    },
    {
      id: "lead_bmsf",
      roleTitle: "Former President",
      organization: "Bangladesh Marketing Student Forum (BMSF)",
      period: "University Tenure",
      sortOrder: 4
    },
    {
      id: "lead_hr_society",
      roleTitle: "Executive Member (Membership Committee)",
      organization: "Bangladesh FMCG HR Society",
      period: "Active Member",
      sortOrder: 5
    }
  ];

  for (const l of leadership) {
    await sql.query(
      `INSERT INTO leadership_roles (
        id, role_title, organization, period, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, TRUE)
      ON CONFLICT (id) DO UPDATE SET
        role_title = EXCLUDED.role_title,
        organization = EXCLUDED.organization,
        period = EXCLUDED.period,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [l.id, l.roleTitle, l.organization, l.period, l.sortOrder]
    );
  }
  console.log(`✓ Leadership roles seeded (${leadership.length})`);

  // 12. Seed Media Features
  const media = [
    {
      id: "med_fe",
      slug: "fe-skill-hunt",
      title: "Skill Hunt: Pioneering Student Skill-Development Hub in Bangladesh",
      outlet: "The Financial Express",
      dateText: "Feature Archive",
      category: "National Print Media",
      summary: "The Financial Express profiled Skill Hunt, founded on November 11, 2016 at the Faculty of Business Studies, University of Dhaka, under Founding President Altaf Hossain Raju and co-founders Shahoriar Ahmed and Mashiur Rahman, recognizing it as one of the country's first dedicated student training hubs.",
      linkText: "Read Coverage Archive (The Financial Express)",
      url: "https://thefinancialexpress.com.bd/",
      highlightQuote: "Skill Hunt was established to bridge the gap between academic theory and practical corporate requirements, equipping university graduates with competitive skills.",
      sortOrder: 1
    },
    {
      id: "med_lcb_two_years",
      slug: "lcb-movement-feature",
      title: "Two Years of LinkedIn Community BD: Transforming Youth Professional Trajectories",
      outlet: "LCB Editorial Forum & Digital Media",
      dateText: "Community Feature",
      category: "Digital Feature",
      summary: "Comprehensive overview of how Altaf Hossain Raju established Bangladesh's first LinkedIn-based professional community, growing from campus meetups into a 24,000+ member movement across 12 universities.",
      linkText: "Explore Official LCB Stories",
      url: "https://linkedincommunitybangladesh.com/",
      highlightQuote: "A movement, not just a meetup. A culture of building in public, showing your work, and lifting people up as you climb.",
      sortOrder: 2
    },
    {
      id: "med_jnu",
      slug: "jnu-finance-coverage",
      title: "LCB & JnU Finance Club Collaborative Career Initiative Completed",
      outlet: "University Press & Student Media",
      dateText: "Campus Press",
      category: "Community Story",
      summary: "Report on the high-impact career readiness and LinkedIn personal branding initiative organized with Jagannath University Finance Club, training hundreds of prospective graduates on corporate hiring dynamics.",
      linkText: "View Event Highlights",
      url: "https://linkedincommunitybangladesh.com/",
      highlightQuote: null,
      sortOrder: 3
    }
  ];

  for (const m of media) {
    await sql.query(
      `INSERT INTO media_features (
        id, slug, title, outlet, date_text, category, summary, link_text,
        url, highlight_quote, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        outlet = EXCLUDED.outlet,
        date_text = EXCLUDED.date_text,
        category = EXCLUDED.category,
        summary = EXCLUDED.summary,
        link_text = EXCLUDED.link_text,
        url = EXCLUDED.url,
        highlight_quote = EXCLUDED.highlight_quote,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [
        m.id, m.slug, m.title, m.outlet, m.dateText, m.category, m.summary,
        m.linkText, m.url, m.highlightQuote, m.sortOrder
      ]
    );
  }
  console.log(`✓ Media features seeded (${media.length})`);

  // 13. Seed Testimonials
  const testimonials = [
    {
      id: "tst_1",
      name: "Community Voice — Campus Lead",
      role: "Campus Ambassador & Graduate",
      organization: "LinkedIn Community Bangladesh",
      quote: "Through LCB's interactions and sessions with industry professionals, I realized how much the real world has to teach beyond textbooks. It's not just a community — it is a genuine head start into corporate leadership.",
      context: "Official LCB Community Review",
      sortOrder: 1
    },
    {
      id: "tst_2",
      name: "Student Participant",
      role: "Undergraduate Fellow",
      organization: "Faculty of Business Studies, DU",
      quote: "LCB is not just teaching me skills — it is quietly building the professional the world will one day recognize. Every session hosted by Altaf Bhai brings us one step closer to our aspirations.",
      context: "Skill Development Participant Feedback",
      sortOrder: 2
    },
    {
      id: "tst_3",
      name: "Campus Strategy Lead",
      role: "Regional Coordinator",
      organization: "LCB Campus Leads Summit Vol. 02",
      quote: "Being part of LCB has been an unforgettable journey of growth, collaboration, and discovering my potential through impactful nationwide initiatives.",
      context: "Leadership Lab Participant",
      sortOrder: 3
    }
  ];

  for (const t of testimonials) {
    await sql.query(
      `INSERT INTO testimonials (
        id, name, role, organization, quote, context, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        organization = EXCLUDED.organization,
        quote = EXCLUDED.quote,
        context = EXCLUDED.context,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published`,
      [t.id, t.name, t.role, t.organization, t.quote, t.context, t.sortOrder]
    );
  }
  console.log(`✓ Testimonials seeded (${testimonials.length})`);

  // 14. Seed Section Settings
  const sections = [
    { id: "hero", label: "Hero & Executive Overview", isVisible: true, sortOrder: 1, title: null, subtitle: null },
    { id: "impact", label: "Verified Scale & Milestones", isVisible: true, sortOrder: 2, title: "Documented Scale & Commercial Velocity", subtitle: "Every metric represents audited milestones across multinational sales territories, corporate boardrooms, and nationwide professional youth ecosystems." },
    { id: "about", label: "Executive Biography & Pillars", isVisible: true, sortOrder: 3, title: "Commercial Acumen in the Boardroom. Empathetic Leadership in the Community.", subtitle: "Bridging multinational business discipline with grassroots youth capability development to cultivate Bangladesh's next echelon of operational leaders." },
    { id: "career", label: "Career Journey & Trajectory", isVisible: true, sortOrder: 4, title: "Multinational Operational Trajectory", subtitle: "Proven cross-industry execution spanning FMCG and telecommunications multinationals." },
    { id: "ventures", label: "Strategic Ventures & Ecosystems", isVisible: true, sortOrder: 5, title: "Strategic Ventures & Community Ecosystems", subtitle: "Pioneering nationwide youth capability platforms that transform campus talent into corporate leaders through structured mentorship and personal branding." },
    { id: "expertise", label: "Strategic Competencies & Domains", isVisible: true, sortOrder: 6, title: "Strategic Competencies & Functional Domains", subtitle: "Synthesized across multinational sales leadership, route-to-market distribution economics, and nationwide capability architecture." },
    { id: "speaking", label: "Keynotes & Masterclasses", isVisible: true, sortOrder: 7, title: "Keynotes, Masterclasses & University Addresses", subtitle: "Engagements across university campuses, executive symposiums, and national youth summits." },
    { id: "credentials", label: "Academic Degrees & Accreditations", isVisible: true, sortOrder: 8, title: "Academic Foundation & Professional Accreditations", subtitle: "Distinguishing completed undergraduate degrees, ongoing executive studies at IBA University of Dhaka, and globally certified project management qualifications." },
    { id: "media", label: "Public Record & Press Archive", isVisible: true, sortOrder: 9, title: "Documented in the Public Record", subtitle: "Archival media coverage across national business dailies, university press, and executive thought leadership forums." },
    { id: "testimonials", label: "Community Testimonials", isVisible: true, sortOrder: 10, title: "Community Voices & Mentee Testimonials", subtitle: "Reflections from university campus ambassadors, student leaders, and nationwide workshop participants empowered through LCB." },
    { id: "contact", label: "Direct Dialogue & Inquiries", isVisible: true, sortOrder: 11, title: "Executive Inquiries & Direct Dialogue", subtitle: "Open for executive FMCG leadership opportunities, keynote symposiums, corporate training masterclasses, and strategic community partnerships." }
  ];

  for (const s of sections) {
    await sql.query(
      `INSERT INTO section_settings (
        id, label, is_visible, sort_order, custom_title, custom_subtitle
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        is_visible = EXCLUDED.is_visible,
        sort_order = EXCLUDED.sort_order,
        custom_title = EXCLUDED.custom_title,
        custom_subtitle = EXCLUDED.custom_subtitle`,
      [s.id, s.label, s.isVisible, s.sortOrder, s.title, s.subtitle]
    );
  }
  console.log(`✓ Section settings seeded (${sections.length})`);

  // 15. Seed Site Customization & SEO
  const keywords = [
    "Altaf Hossain Raju",
    "Altaf Hossain Raju PMP",
    "LinkedIn Community Bangladesh",
    "LCB Founder",
    "Marico Bangladesh Limited",
    "Robi Axiata",
    "Nestle Bangladesh",
    "Skill Hunt Dhaka University",
    "Career Talks Bangladesh",
    "IBA Dhaka University EMBA",
    "FMCG Leader Bangladesh",
    "Sales and Distribution Bangladesh",
    "Personal Branding Mentor"
  ];

  await sql.query(
    `INSERT INTO site_customization (
      id, site_title, meta_description, keywords, og_image_url, canonical_url,
      accent_color, background_color, surface_color
    ) VALUES (
      'default', $1, $2, $3, $4, $5, $6, $7, $8
    ) ON CONFLICT (id) DO UPDATE SET
      site_title = EXCLUDED.site_title,
      meta_description = EXCLUDED.meta_description,
      keywords = EXCLUDED.keywords,
      og_image_url = EXCLUDED.og_image_url,
      canonical_url = EXCLUDED.canonical_url,
      accent_color = EXCLUDED.accent_color,
      background_color = EXCLUDED.background_color,
      surface_color = EXCLUDED.surface_color`,
    [
      "Altaf Hossain Raju, PMP® | Corporate Leader, Entrepreneur & Mentor",
      "Official portfolio of Altaf Hossain Raju, PMP® — Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh (LCB), and executive mentor empowering 24,000+ professionals across Bangladesh.",
      JSON.stringify(keywords),
      "/images/altaf-portrait-lcb.jpg",
      "https://altafhossainraju.com",
      "#D4AF37",
      "#070A11",
      "#0C111C"
    ]
  );
  console.log("✓ Site customization & SEO seeded");

  // 16. Seed Media Assets
  const publicDir = path.join(__dirname, "..", "public");
  const mediaFolders = ["images", "logos"];
  let assetCount = 0;

  for (const folder of mediaFolders) {
    const folderPath = path.join(publicDir, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          const relativePath = `/${folder}/${file}`;
          const ext = path.extname(file).toLowerCase();
          let mime = "application/octet-stream";
          if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
          if (ext === ".png") mime = "image/png";
          if (ext === ".webp") mime = "image/webp";
          if (ext === ".svg") mime = "image/svg+xml";

          const category = folder === "logos" ? "logo" : file.includes("portrait") ? "portrait" : "event";
          const altText = file.replace(/[-_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const assetId = `asset_${folder}_${file.replace(/[^a-zA-Z0-9]/g, "_")}`;

          await sql.query(
            `INSERT INTO media_assets (
              id, file_name, file_path, file_size, mime_type, alt_text, category
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
              file_path = EXCLUDED.file_path,
              file_size = EXCLUDED.file_size`,
            [assetId, file, relativePath, stats.size, mime, altText, category]
          );
          assetCount++;
        }
      }
    }
  }
  console.log(`✓ Media assets cataloged (${assetCount})`);

  // 17. Seed Initial Activity Log
  await sql.query(
    `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      `log_${Date.now()}`,
      "usr_admin_1",
      "INIT",
      "SYSTEM",
      "all",
      "Database schema migrated and populated with full portfolio content."
    ]
  );
  console.log("✓ Initial activity log recorded");

  console.log("\nDATABASE SEEDING COMPLETE AND VERIFIED!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

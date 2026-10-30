import { runQuery } from "./db";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { cacheTag, revalidateTag, revalidatePath } from "next/cache";

export function revalidatePortfolio() {
  try {
    revalidateTag("portfolio", "max");
  } catch (e) {
    // Ignore in non-request contexts
  }
  try {
    revalidatePath("/");
  } catch (e) {
    // Ignore in non-request contexts
  }
}

export interface LivePortfolioData {
  profile: {
    fullName: string;
    displayName: string;
    shortName: string;
    initials: string;
    honorificSuffix?: string;
    heroHeadline: string;
    heroSubheadline: string;
    heroNarrativeBio?: string;
    executiveBio: string[];
    philosophy: string;
    contact: {
      email: string;
      phone: string;
      secondaryPhone?: string;
      address: string;
      origin: string;
      linkedin: string;
      lcbWebsite: string;
      whatsappNumber?: string;
    };
    images: {
      portraitMain: string;
      portraitCorporate: string;
      [key: string]: string;
    };
  };
  metrics: Array<{
    id: string;
    key?: string;
    value: string;
    numberValue: number;
    suffix: string;
    label: string;
    description: string;
    verificationSource: string;
    category: string;
    isPrimary?: boolean;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  careerJourney: Array<{
    id: string;
    slug?: string;
    company: string;
    role: string;
    period: string;
    location: string;
    cluster?: string;
    type: "current" | "previous";
    companyFilter?: string;
    logo: string;
    keyResponsibilities: string[];
    achievements: string[];
    industryContext: string;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  ventures: Array<{
    id: string;
    slug?: string;
    name: string;
    acronym?: string;
    tagline: string;
    founded: string;
    role: string;
    status: "Active" | "Established";
    website?: string;
    description: string;
    detailedStory: string;
    impactMetrics: { label: string; value: string }[];
    featuredImage: string;
    highlights: string[];
    ctaLabel?: string;
    ctaUrl?: string;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  areasOfExpertise: Array<{
    id?: string;
    title: string;
    tier?: string;
    description: string;
    competencies: string[];
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  speakingEngagements: Array<{
    id: string;
    slug?: string;
    title: string;
    organizer: string;
    type: "Keynote" | "Masterclass" | "Summit" | "Panel Discussion" | "Workshop";
    institution: string;
    date?: string;
    participants?: string;
    description: string;
    image: string;
    keyTopics: string[];
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  credentials: Array<{
    id: string;
    slug?: string;
    title: string;
    institution: string;
    periodOrYear: string;
    status: "Completed" | "Pursuing (Expected 2026)" | "Certified";
    field: string;
    logo?: string;
    details: string;
    verificationNote: string;
    isPremier?: boolean;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  awards: Array<{
    id?: string;
    title: string;
    organization: string;
    year: string;
    description: string;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  leadershipRoles: Array<{
    id?: string;
    role: string;
    organization: string;
    period: string;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  mediaCoverage: Array<{
    id: string;
    slug?: string;
    title: string;
    outlet: string;
    date: string;
    category: "National Print Media" | "Digital Feature" | "Community Story";
    summary: string;
    linkText: string;
    url: string;
    highlightQuote?: string;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    organization: string;
    quote: string;
    context: string;
    sortOrder?: number;
    isPublished?: boolean;
  }>;
  sections: Array<{
    id: string;
    label: string;
    isVisible: boolean;
    sortOrder: number;
    customTitle?: string | null;
    customSubtitle?: string | null;
  }>;
  customization: {
    siteTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImageUrl: string;
    canonicalUrl: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
  };
}

/**
 * Fetch complete portfolio data from database with fallback to static portfolioData
 */
export async function getPortfolioData(): Promise<LivePortfolioData> {
  "use cache";
  cacheTag("portfolio");
  try {
    const [
      profileRows,
      contactRows,
      metricRows,
      careerRows,
      ventureRows,
      expertiseRows,
      speakingRows,
      credentialRows,
      awardRows,
      leadershipRows,
      mediaRows,
      testimonialRows,
      sectionRows,
      customizationRows
    ] = await Promise.all([
      runQuery("SELECT * FROM site_profile WHERE id = 'default' LIMIT 1"),
      runQuery("SELECT * FROM site_contact WHERE id = 'default' LIMIT 1"),
      runQuery("SELECT * FROM impact_metrics WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM career_roles WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM ventures WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM areas_of_expertise WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM speaking_events WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM credentials WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM corporate_awards WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM leadership_roles WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM media_features WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM testimonials WHERE is_published = TRUE ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM section_settings ORDER BY sort_order ASC"),
      runQuery("SELECT * FROM site_customization WHERE id = 'default' LIMIT 1"),
    ]);

    const p = profileRows[0] || {};
    const c = contactRows[0] || {};
    const cust = customizationRows[0] || {};

    // Parse bio paragraphs safely
    let executiveBio: string[] = PORTFOLIO_DATA.profile.executiveBio;
    if (p.executive_bio_paragraphs) {
      try {
        executiveBio = typeof p.executive_bio_paragraphs === "string" 
          ? JSON.parse(p.executive_bio_paragraphs) 
          : p.executive_bio_paragraphs;
      } catch {
        executiveBio = PORTFOLIO_DATA.profile.executiveBio;
      }
    }

    const profile = {
      fullName: p.full_name || PORTFOLIO_DATA.profile.fullName,
      displayName: p.display_name || PORTFOLIO_DATA.profile.displayName,
      shortName: p.short_name || PORTFOLIO_DATA.profile.shortName,
      initials: p.initials || PORTFOLIO_DATA.profile.initials,
      honorificSuffix: p.honorific_suffix || "PMP®",
      heroHeadline: p.hero_headline || PORTFOLIO_DATA.profile.heroHeadline,
      heroSubheadline: p.hero_subheadline || PORTFOLIO_DATA.profile.heroSubheadline,
      heroNarrativeBio: p.hero_narrative_bio || PORTFOLIO_DATA.profile.heroSubheadline,
      executiveBio,
      philosophy: p.philosophy_quote || PORTFOLIO_DATA.profile.philosophy,
      contact: {
        email: c.email || PORTFOLIO_DATA.profile.contact.email,
        phone: c.phone || PORTFOLIO_DATA.profile.contact.phone,
        secondaryPhone: c.secondary_phone || PORTFOLIO_DATA.profile.contact.secondaryPhone,
        address: c.address || PORTFOLIO_DATA.profile.contact.address,
        origin: c.origin || PORTFOLIO_DATA.profile.contact.origin,
        linkedin: c.linkedin_url || PORTFOLIO_DATA.profile.contact.linkedin,
        lcbWebsite: c.lcb_website_url || PORTFOLIO_DATA.profile.contact.lcbWebsite,
        whatsappNumber: c.whatsapp_number || "+8801833183724",
      },
      images: {
        ...PORTFOLIO_DATA.profile.images,
        portraitMain: p.portrait_main_url || PORTFOLIO_DATA.profile.images.portraitMain,
        portraitCorporate: p.portrait_corporate_url || PORTFOLIO_DATA.profile.images.portraitCorporate,
      },
    };

    const metrics = metricRows.length > 0 ? metricRows.map((r: any) => ({
      id: r.metric_key || r.id,
      key: r.metric_key,
      value: r.value,
      numberValue: Number(r.number_value),
      suffix: r.suffix,
      label: r.label,
      description: r.description,
      verificationSource: r.verification_source,
      category: r.category,
      isPrimary: r.is_primary,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.metrics;

    const careerJourney = careerRows.length > 0 ? careerRows.map((r: any) => ({
      id: r.role_slug || r.id,
      slug: r.role_slug,
      company: r.company,
      role: r.role_title,
      period: r.period,
      location: r.location,
      cluster: r.cluster || undefined,
      type: r.role_type as "current" | "previous",
      companyFilter: r.company_filter,
      logo: r.logo_url,
      keyResponsibilities: typeof r.key_responsibilities === "string" ? JSON.parse(r.key_responsibilities) : r.key_responsibilities,
      achievements: typeof r.achievements === "string" ? JSON.parse(r.achievements) : r.achievements,
      industryContext: r.industry_context,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.careerJourney;

    const ventures = ventureRows.length > 0 ? ventureRows.map((r: any) => ({
      id: r.venture_slug || r.id,
      slug: r.venture_slug,
      name: r.name,
      acronym: r.acronym || undefined,
      tagline: r.tagline,
      founded: r.founded,
      role: r.role,
      status: r.status as "Active" | "Established",
      website: r.website_url || undefined,
      description: r.description,
      detailedStory: r.detailed_story,
      impactMetrics: typeof r.impact_metrics === "string" ? JSON.parse(r.impact_metrics) : r.impact_metrics,
      featuredImage: r.featured_image,
      highlights: typeof r.highlights === "string" ? JSON.parse(r.highlights) : r.highlights,
      ctaLabel: r.cta_label || undefined,
      ctaUrl: r.cta_url || undefined,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.ventures;

    const areasOfExpertise = expertiseRows.length > 0 ? expertiseRows.map((r: any) => ({
      id: r.id,
      title: r.title,
      tier: r.tier,
      description: r.description,
      competencies: typeof r.competencies === "string" ? JSON.parse(r.competencies) : r.competencies,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.areasOfExpertise;

    const speakingEngagements = speakingRows.length > 0 ? speakingRows.map((r: any) => ({
      id: r.slug || r.id,
      slug: r.slug,
      title: r.title,
      organizer: r.organizer,
      type: r.event_type as any,
      institution: r.institution,
      date: r.date_text || undefined,
      participants: r.participants || undefined,
      description: r.description,
      image: r.image_url,
      keyTopics: typeof r.key_topics === "string" ? JSON.parse(r.key_topics) : r.key_topics,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.speakingEngagements;

    const credentials = credentialRows.length > 0 ? credentialRows.map((r: any) => ({
      id: r.slug || r.id,
      slug: r.slug,
      title: r.title,
      institution: r.institution,
      periodOrYear: r.period_or_year,
      status: r.status as any,
      field: r.field,
      logo: r.logo_url || undefined,
      details: r.details,
      verificationNote: r.verification_note,
      isPremier: r.is_premier,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.credentials;

    const awards = awardRows.length > 0 ? awardRows.map((r: any) => ({
      id: r.id,
      title: r.title,
      organization: r.organization,
      year: r.year,
      description: r.description,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.awards;

    const leadershipRoles = leadershipRows.length > 0 ? leadershipRows.map((r: any) => ({
      id: r.id,
      role: r.role_title,
      organization: r.organization,
      period: r.period,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.leadershipRoles;

    const mediaCoverage = mediaRows.length > 0 ? mediaRows.map((r: any) => ({
      id: r.slug || r.id,
      slug: r.slug,
      title: r.title,
      outlet: r.outlet,
      date: r.date_text,
      category: r.category as any,
      summary: r.summary,
      linkText: r.link_text,
      url: r.url,
      highlightQuote: r.highlight_quote || undefined,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.mediaCoverage;

    const testimonials = testimonialRows.length > 0 ? testimonialRows.map((r: any) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      organization: r.organization,
      quote: r.quote,
      context: r.context,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    })) : PORTFOLIO_DATA.testimonials;

    const sections = sectionRows.length > 0 ? sectionRows.map((r: any) => ({
      id: r.id,
      label: r.label,
      isVisible: r.is_visible,
      sortOrder: r.sort_order,
      customTitle: r.custom_title,
      customSubtitle: r.custom_subtitle,
    })) : [
      { id: "hero", label: "Hero & Executive Overview", isVisible: true, sortOrder: 1 },
      { id: "impact", label: "Verified Scale & Milestones", isVisible: true, sortOrder: 2 },
      { id: "about", label: "Executive Biography & Pillars", isVisible: true, sortOrder: 3 },
      { id: "career", label: "Career Journey & Trajectory", isVisible: true, sortOrder: 4 },
      { id: "ventures", label: "Strategic Ventures & Ecosystems", isVisible: true, sortOrder: 5 },
      { id: "expertise", label: "Strategic Competencies & Domains", isVisible: true, sortOrder: 6 },
      { id: "speaking", label: "Keynotes & Masterclasses", isVisible: true, sortOrder: 7 },
      { id: "credentials", label: "Academic Degrees & Accreditations", isVisible: true, sortOrder: 8 },
      { id: "media", label: "Public Record & Press Archive", isVisible: true, sortOrder: 9 },
      { id: "testimonials", label: "Community Testimonials", isVisible: true, sortOrder: 10 },
      { id: "contact", label: "Direct Dialogue & Inquiries", isVisible: true, sortOrder: 11 },
    ];

    let keywords: string[] = [];
    if (cust.keywords) {
      try {
        keywords = typeof cust.keywords === "string" ? JSON.parse(cust.keywords) : cust.keywords;
      } catch {
        keywords = [];
      }
    }

    const customization = {
      siteTitle: cust.site_title || "Altaf Hossain Raju, PMP® | Corporate Leader, Entrepreneur & Mentor",
      metaDescription: cust.meta_description || "Official portfolio of Altaf Hossain Raju, PMP® — Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh (LCB), and executive mentor.",
      keywords,
      ogImageUrl: cust.og_image_url || "/images/altaf-portrait-lcb.jpg",
      canonicalUrl: cust.canonical_url || "https://altafhossainraju.com",
      accentColor: cust.accent_color || "#D4AF37",
      backgroundColor: cust.background_color || "#070A11",
      surfaceColor: cust.surface_color || "#0C111C",
    };

    return {
      profile,
      metrics,
      careerJourney,
      ventures,
      areasOfExpertise,
      speakingEngagements,
      credentials,
      awards,
      leadershipRoles,
      mediaCoverage,
      testimonials,
      sections,
      customization,
    };
  } catch (err) {
    console.error("Failed to load live portfolio data from DB, falling back to static data:", err);
    // Return complete fallback from PORTFOLIO_DATA
    return {
      profile: {
        ...PORTFOLIO_DATA.profile,
        honorificSuffix: "PMP®",
        heroNarrativeBio: PORTFOLIO_DATA.profile.heroSubheadline,
        contact: {
          ...PORTFOLIO_DATA.profile.contact,
          whatsappNumber: "+8801833183724",
        },
      },
      metrics: PORTFOLIO_DATA.metrics,
      careerJourney: PORTFOLIO_DATA.careerJourney,
      ventures: PORTFOLIO_DATA.ventures,
      areasOfExpertise: PORTFOLIO_DATA.areasOfExpertise,
      speakingEngagements: PORTFOLIO_DATA.speakingEngagements,
      credentials: PORTFOLIO_DATA.credentials,
      awards: PORTFOLIO_DATA.awards,
      leadershipRoles: PORTFOLIO_DATA.leadershipRoles,
      mediaCoverage: PORTFOLIO_DATA.mediaCoverage,
      testimonials: PORTFOLIO_DATA.testimonials,
      sections: [
        { id: "hero", label: "Hero & Executive Overview", isVisible: true, sortOrder: 1 },
        { id: "impact", label: "Verified Scale & Milestones", isVisible: true, sortOrder: 2 },
        { id: "about", label: "Executive Biography & Pillars", isVisible: true, sortOrder: 3 },
        { id: "career", label: "Career Journey & Trajectory", isVisible: true, sortOrder: 4 },
        { id: "ventures", label: "Strategic Ventures & Ecosystems", isVisible: true, sortOrder: 5 },
        { id: "expertise", label: "Strategic Competencies & Domains", isVisible: true, sortOrder: 6 },
        { id: "speaking", label: "Keynotes & Masterclasses", isVisible: true, sortOrder: 7 },
        { id: "credentials", label: "Academic Degrees & Accreditations", isVisible: true, sortOrder: 8 },
        { id: "media", label: "Public Record & Press Archive", isVisible: true, sortOrder: 9 },
        { id: "testimonials", label: "Community Testimonials", isVisible: true, sortOrder: 10 },
        { id: "contact", label: "Direct Dialogue & Inquiries", isVisible: true, sortOrder: 11 },
      ],
      customization: {
        siteTitle: "Altaf Hossain Raju, PMP® | Corporate Leader, Entrepreneur & Mentor",
        metaDescription: "Official portfolio of Altaf Hossain Raju, PMP® — Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh (LCB), and executive mentor.",
        keywords: [
          "Altaf Hossain Raju",
          "Altaf Hossain Raju PMP",
          "LinkedIn Community Bangladesh",
          "Marico Bangladesh Limited",
          "Robi Axiata",
          "Nestle Bangladesh",
        ],
        ogImageUrl: "/images/altaf-portrait-lcb.jpg",
        canonicalUrl: "https://altafhossainraju.com",
        accentColor: "#D4AF37",
        backgroundColor: "#070A11",
        surfaceColor: "#0C111C",
      },
    };
  }
}

/**
 * Record an administrative activity log
 */
export async function logActivity(
  action: string,
  entityType: string,
  entityId: string | null = null,
  details: string | null = null,
  userId: string | null = null,
  ipAddress: string | null = null
): Promise<void> {
  try {
    await runQuery(
      `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        action,
        entityType,
        entityId,
        details,
        ipAddress,
      ]
    );
  } catch (error) {
    console.warn("Failed to record activity log:", error);
  }
}

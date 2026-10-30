export interface Milestone {
  year: string;
  title: string;
  organization: string;
  description: string;
  category: "corporate" | "community" | "education";
  badge?: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface Metric {
  id: string;
  value: string;
  numberValue: number;
  suffix: string;
  label: string;
  description: string;
  verificationSource: string;
  category: string;
  sortOrder?: number;
  isPublished?: boolean;
  isPrimary?: boolean;
}

export interface CareerRole {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  cluster?: string;
  type: "current" | "previous";
  logo: string;
  keyResponsibilities: string[];
  achievements: string[];
  industryContext: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface Venture {
  id: string;
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
}

export interface SpeakingEvent {
  id: string;
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
}

export interface MediaFeature {
  id: string;
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
}

export interface Credential {
  id: string;
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
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  context: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface AwardItem {
  title: string;
  organization: string;
  description: string;
  year: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface LeadershipRoleItem {
  role: string;
  organization: string;
  period: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface AreaOfExpertiseItem {
  title: string;
  description: string;
  competencies: string[];
  sortOrder?: number;
  isPublished?: boolean;
}

export const PORTFOLIO_DATA = {
  profile: {
    fullName: "Md. Altaf Hossain Raju",
    displayName: "Altaf Hossain Raju, PMP®",
    shortName: "Altaf Hossain Raju",
    initials: "AHR",
    honorificSuffix: "PMP®",
    heroHeadline: "Building Businesses. Empowering People. Creating Impact.",
    heroSubheadline:
      "Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh (LCB), and PMP® certified corporate strategist dedicated to FMCG market leadership, youth employability, and high-performance team development.",
    heroNarrativeBio:
      "A multinational commercial strategist with over seven years of operational route-to-market execution across Marico Bangladesh, Robi Axiata, and Nestlé. Dedicated to converting commercial rigor into high-velocity revenue growth, while building nationwide capability pipelines for Bangladesh's next generation of professionals.",
    executiveBio: [
      "Altaf Hossain Raju, PMP®, is a distinguished Bangladeshi corporate professional, entrepreneur, and community builder with over seven years of cross-industry operational leadership across global FMCG and telecommunications multinationals, including Marico Bangladesh, Robi Axiata, and Nestlé Bangladesh.",
      "As Area Manager – Market Operation at Marico Bangladesh Limited, Altaf oversees sales planning, route-to-market architecture, alternative channel distribution, and multi-tier team management across strategic clusters. His commercial discipline and execution excellence have earned him Marico's highest corporate accolade—the 'Go Beyond Award'—alongside the Global CEO Award for two consecutive cycles.",
      "Beyond corporate boardrooms and commercial distribution networks, Altaf is the visionary Founder of LinkedIn Community Bangladesh (LCB), the nation's premier professional community connecting 24,000+ ambitious students, campus leads, and corporate leaders across 12+ leading universities. As Founding President of Skill Hunt at the University of Dhaka, he pioneered structured campus-to-career readiness training for more than 2,600 university students.",
      "Currently pursuing his Executive MBA in Marketing at the Institute of Business Administration (IBA), University of Dhaka, Altaf marries boardroom strategic rigour with grassroots youth empowerment—proving that sustainable business success is fundamentally powered by uplifting the people behind it."
    ],
    philosophy:
      "True commercial leadership is measured not merely by revenue targets fulfilled, but by the capacity of your teams to outgrow their current horizons and create enduring value for society.",
    contact: {
      email: "altafhossainraju20@gmail.com",
      phone: "+880 1833-183724",
      secondaryPhone: "+880 1521-494865",
      address: "House 49, Banasree, Rampura, Dhaka, Bangladesh",
      origin: "Mirsarai, Chittagong, Bangladesh",
      linkedin: "https://www.linkedin.com/in/altafhossainraju/",
      lcbWebsite: "https://linkedincommunitybangladesh.com/",
    },
    images: {
      portraitMain: "/images/altaf-portrait-lcb.webp",
      portraitFallback: "/images/altaf-portrait-lcb.jpg",
      portraitCorporate: "/images/altaf-portrait-corporate.webp",
      portraitCorporateFallback: "/images/altaf-portrait-corporate.jpg",
      summitEvent: "/images/lcb-campus-leads-summit.webp",
      auditoriumSpeech: "/images/lcb-auditorium-speech.webp",
      workshopJnU: "/images/lcb-jnu-finance-session.webp",
      trainingClass: "/images/lcb-training-masterclass.webp",
      executivePanel: "/images/lcb-executive-panel.webp",
      leadershipForum: "/images/lcb-leadership-forum.webp",
    },
  },

  metrics: [
    {
      id: "members",
      value: "24,000+",
      numberValue: 24000,
      suffix: "+",
      label: "Students & Professionals Impacted",
      description:
        "Documented membership in LinkedIn Community Bangladesh (LCB) receiving career strategy, profile optimization, and networking guidance.",
      verificationSource: "LinkedIn Community BD Platform Official Count",
      category: "Community Impact",
    },
    {
      id: "sessions",
      value: "192+",
      numberValue: 192,
      suffix: "+",
      label: "Career Sessions & Masterclasses",
      description:
        "Public and university-based sessions conducted on personal branding, corporate readiness, and sales strategy.",
      verificationSource: "Documented LCB Event Logs & Campus Lead Archive",
      category: "Mentorship",
    },
    {
      id: "students-trained",
      value: "2,600+",
      numberValue: 2600,
      suffix: "+",
      label: "University Students Trained via Skill Hunt",
      description:
        "Graduates of structured hands-on modules in business presentation, digital marketing, and market research at DU Faculty of Business Studies.",
      verificationSource: "Skill Hunt Historical Training Archives & Financial Express",
      category: "Capacity Building",
    },
    {
      id: "experience-years",
      value: "7+",
      numberValue: 7,
      suffix: "+ Years",
      label: "Multinational Corporate FMCG & Telecom Track Record",
      description:
        "Proven execution spanning Marico Bangladesh, Robi Axiata Limited, and Nestlé Bangladesh across high-stakes clusters.",
      verificationSource: "Employment Record (Nestlé 2018, Robi 2019–22, Marico 2022–Present)",
      category: "Corporate Excellence",
    },
    {
      id: "awards",
      value: "2x",
      numberValue: 2,
      suffix: "x",
      label: "Global CEO Award Winner at Marico",
      description:
        "Conferred twice consecutively for outstanding market penetration and commercial growth across designated clusters.",
      verificationSource: "Marico Bangladesh Corporate Recognitions",
      category: "Distinction",
    },
    {
      id: "universities",
      value: "12+",
      numberValue: 12,
      suffix: "+",
      label: "Universities with Active LCB Footprint",
      description:
        "Campus leads and student cohorts mobilized across Bangladesh's premier public and private tertiary institutions.",
      verificationSource: "LCB Campus Leads Summit Vol. 01 & 02",
      category: "Campus Reach",
    },
  ] as Metric[],

  careerJourney: [
    {
      id: "marico-southern",
      company: "Marico Bangladesh Limited",
      role: "Area Manager – Market Operation (Southern Cluster)",
      period: "January 2024 – Present",
      location: "Southern Cluster, Bangladesh",
      cluster: "Southern Cluster",
      type: "current",
      logo: "/logos/marico-logo.png",
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
      industryContext: "Fast-Moving Consumer Goods (FMCG) – Beauty, Wellness & Food Formats."
    },
    {
      id: "marico-eastern",
      company: "Marico Bangladesh Limited",
      role: "Area Manager – Market Operation (Eastern Cluster)",
      period: "June 2022 – December 2023",
      location: "Eastern Cluster, Bangladesh",
      cluster: "Eastern Cluster",
      type: "previous",
      logo: "/logos/marico-logo.png",
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
      industryContext: "FMCG Distribution & Brand Penetration."
    },
    {
      id: "robi-assistant-mgr",
      company: "Robi Axiata Limited",
      role: "Assistant Manager – Sales",
      period: "April 2021 – May 2022",
      location: "Khulna & Bagerhat, Bangladesh",
      type: "previous",
      logo: "/logos/robi-logo.png",
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
      industryContext: "Telecommunications & Digital Services."
    },
    {
      id: "robi-territory-mgr",
      company: "Robi Axiata Limited",
      role: "Territory Manager",
      period: "October 2019 – March 2021",
      location: "Meherpur, Bangladesh",
      type: "previous",
      logo: "/logos/robi-logo.png",
      keyResponsibilities: [
        "Managed distributor accounts, point-of-sale visibility, and field retail operations throughout Meherpur territory.",
        "Organized retailer engagement programs to expand alternative digital top-up services and SIM availability."
      ],
      achievements: [
        "Received Regional Head Award for bringing commercial excellence in H1 (FY 2020-21).",
        "Won Quarterly WOW Awards for three consecutive quarters (H1, H2, and H3 of FY 2020-21)."
      ],
      industryContext: "Telecom Retail Distribution."
    },
    {
      id: "nestle-b2b",
      company: "Nestlé Bangladesh Limited",
      role: "Territory-in-Charge (B2B & Corporate Channel)",
      period: "January 2018 – September 2019",
      location: "Dhaka, Bangladesh",
      type: "previous",
      logo: "/logos/nestle-logo.png",
      keyResponsibilities: [
        "Identified and closed high-value B2B accounts, placing institutional vending machines, corporate kiosks, and experience zones.",
        "Nurtured enterprise client relationships while developing new corporate accounts to expand institutional consumption of beverage and nutrition lines.",
        "Recruited and trained distributor B2B sales personnel to meet stringent multinational service-level agreements."
      ],
      achievements: [
        "Secured flagship corporate accounts across multinational offices, universities, and commercial hubs in metropolitan Dhaka.",
        "Maintained exceptional distributor ROI and compliance benchmarks."
      ],
      industryContext: "Multinational Food & Beverage – Institutional & Corporate Channels."
    }
  ] as CareerRole[],

  ventures: [
    {
      id: "lcb",
      name: "LinkedIn Community Bangladesh",
      acronym: "LCB",
      tagline: "Bangladesh's First LinkedIn-Based Professional Growth Movement",
      founded: "2022",
      role: "Founder & Chief Community Architect",
      status: "Active",
      website: "https://linkedincommunitybangladesh.com/",
      description:
        "A transformative nationwide ecosystem bridging the gap between textbook academia and real-world corporate expectations through digital visibility, personal branding, and peer networking.",
      detailedStory:
        "Established to democratize career capital in Bangladesh, LinkedIn Community Bangladesh grew from grassroots student sessions into a structured movement spanning 12+ top universities. Through regular campus masterclasses, executive town halls, and nationwide Campus Leads Summits, LCB empowers youth to build authentic professional identities on LinkedIn, engage directly with corporate hiring managers, and secure high-value careers before graduation.",
      impactMetrics: [
        { label: "Community Members", value: "24,000+" },
        { label: "Sessions Hosted", value: "192+" },
        { label: "Partner Universities", value: "12+" },
        { label: "Campus Summits", value: "Vol. 01 & 02" },
      ],
      featuredImage: "/images/lcb-campus-leads-summit.webp",
      highlights: [
        "Campus Leads Summit Vol. 01 & 02 convening student leaders from across Bangladesh.",
        "Direct collaboration with university clubs including Jagannath University Finance Club, DU, and UIU.",
        "Quarterly Leadership Labs and official Letters of Recommendation for exemplary youth leaders.",
        "Democratized masterclasses on modern resume strategy, personal branding, and algorithmic networking."
      ],
      ctaLabel: "Visit Official LCB Platform",
      ctaUrl: "https://linkedincommunitybangladesh.com/"
    },
    {
      id: "skill-hunt",
      name: "Skill Hunt",
      tagline: "Pioneering Student Skill-Development Training Hub at University of Dhaka",
      founded: "November 11, 2016",
      role: "Founding President",
      status: "Established",
      description:
        "The country's first student-led skill-development training hub, founded at the Faculty of Business Studies, University of Dhaka, focused on business strategy, presentations, and market readiness.",
      detailedStory:
        "Recognizing that conventional classroom curricula rarely provided hands-on commercial competencies, Altaf co-founded Skill Hunt alongside Shahoriar Ahmed and Mashiur Rahman at the University of Dhaka. Skill Hunt delivered rigorous, multi-week certified workshops led by industry practitioners in advanced corporate presentations, market research methodologies, and brand management, earning recognition in The Financial Express as a pioneering youth development platform.",
      impactMetrics: [
        { label: "Students Trained", value: "2,600+" },
        { label: "Training Sessions", value: "32+" },
        { label: "Core Focus", value: "Practical Skills" },
        { label: "Media Coverage", value: "The Financial Express" },
      ],
      featuredImage: "/images/lcb-training-masterclass.webp",
      highlights: [
        "Featured in The Financial Express for pioneering student-led professional training.",
        "Delivered month-long certified training programs in Brand Management, STP, and IMC.",
        "Equipped university graduates with Advanced PowerPoint, analytical problem-solving, and communication frameworks.",
        "Served as the foundational template that later evolved into nationwide digital initiatives."
      ]
    },
    {
      id: "career-talks",
      name: "Career Talks",
      tagline: "Democratized Digital Career Mentorship and Knowledge Sharing",
      founded: "September 2020",
      role: "Founder & Producer",
      status: "Active",
      description:
        "An open-access digital knowledge-sharing platform and video channel providing transparent corporate advice, interview preparation techniques, and career transition roadmaps.",
      detailedStory:
        "Launched during the pandemic in September 2020, Career Talks removed geographic barriers for talented students outside metropolitan hubs. By conducting video interviews with leading HR directors, marketing veterans, and entrepreneurs, the platform provides actionable insights into corporate hiring benchmarks, sales career paths, and leadership fundamentals.",
      impactMetrics: [
        { label: "Format", value: "Digital & Video" },
        { label: "Reach", value: "Nationwide" },
        { label: "Key Focus", value: "Corporate Insights" },
        { label: "Access", value: "100% Free" },
      ],
      featuredImage: "/images/lcb-executive-panel.webp",
      highlights: [
        "In-depth discussions on cracking multinational assessment centres and management trainee exams.",
        "First-person corporate transition accounts from regional universities to multinational head offices.",
        "Practical breakdowns of route-to-market mechanics and modern commercial strategy."
      ]
    }
  ] as Venture[],

  areasOfExpertise: [
    {
      title: "Commercial & Route-to-Market (RTM) Strategy",
      description:
        "Architecting robust distribution networks, distributor ROI modeling, territory restructuring, and primary-to-secondary sales pipeline optimization.",
      competencies: [
        "RTM Transformation",
        "Distributor ROI & Hygiene",
        "Channel Margin Modeling",
        "Outlet Penetration Dynamics"
      ],
    },
    {
      title: "B2B & Alternative Channel Expansion",
      description:
        "Securing enterprise institutional accounts, corporate kiosks, vending networks, and customized B2B value propositions with sustainable client retention.",
      competencies: [
        "Institutional Sales",
        "Corporate Key Accounts",
        "Contract Negotiation",
        "Vending & Kiosk Rollouts"
      ],
    },
    {
      title: "High-Performance Team Leadership",
      description:
        "Hiring, training, and building high-morale sales forces across multi-district territories, instilling accountable metrics and empathetic grievance resolution.",
      competencies: [
        "Field Sales Coaching",
        "Performance Management",
        "Capacity Development",
        "Talent Retention"
      ],
    },
    {
      title: "Professional Personal Branding & Social Selling",
      description:
        "Guiding professionals and organizations on establishing authentic digital presence, thought leadership, and organic talent acquisition via LinkedIn.",
      competencies: [
        "Executive Branding",
        "LinkedIn Growth Strategy",
        "Digital Visibility",
        "Network Cultivation"
      ],
    },
    {
      title: "New Product Launching & Trade Marketing",
      description:
        "End-to-end design and execution of market penetration campaigns, point-of-sale visibility drives, and rapid consumer trial generation.",
      competencies: [
        "NPLP Execution",
        "Trade Promotions",
        "POSM Placement",
        "Market Trend Analytics"
      ],
    },
    {
      title: "Youth Employability & Executive Facilitation",
      description:
        "Designing immersive workshops and campus masterclasses that equip university graduates with market-ready presentation, communication, and business skills.",
      competencies: [
        "Interactive Workshops",
        "Curriculum Design",
        "Public Speaking",
        "Career Guidance Labs"
      ],
    },
  ] as AreaOfExpertiseItem[],

  speakingEngagements: [
    {
      id: "jnu-marketing-masterclass",
      title: "Personal Branding & LinkedIn Optimization Masterclass",
      organizer: "Dept. of Marketing, Jagannath University & LCB",
      type: "Masterclass",
      institution: "Room 553, Faculty of Business Studies, Jagannath University",
      participants: "Chief Guest: Dr. Imranul Hoque, Dept. Chairman",
      description:
        "Specialized interactive session equipping university undergraduates with tactical LinkedIn profile architecture, digital personal branding, and algorithmic networking strategies for corporate recruitment.",
      image: "/images/lcb-campus-workshop.webp",
      keyTopics: ["LinkedIn Profile Architecture", "Algorithmic Reach", "Corporate Recruitment"]
    },
    {
      id: "campus-leads-summit-v2",
      title: "Campus Leads Summit Vol. 02 — Leadership & Strategy Labs",
      organizer: "LinkedIn Community Bangladesh Central Council",
      type: "Summit",
      institution: "Dhaka Central Auditorium",
      participants: "University Campus Leads from 12+ Institutions",
      description:
        "Conducted strategic leadership workshops for LCB campus leads nationwide, reviewing community expansion frameworks, campus engagement roadmaps, and youth development impact.",
      image: "/images/lcb-campus-leads-summit.webp",
      keyTopics: ["Community Architecture", "Public Engagement", "Strategy Execution"]
    },
    {
      id: "hamdard-univ-keynote",
      title: "Personal Branding & Corporate Career Trajectories Keynote",
      organizer: "Hamdard University Bangladesh & LCB",
      type: "Keynote",
      institution: "Hamdard University Bangladesh Central Auditorium",
      participants: "500+ Faculty & Undergraduates",
      description:
        "Comprehensive keynote and convocation-style address breaking down corporate employer expectations, multinational interview stages, and building personal resilience in modern sales & marketing careers.",
      image: "/images/lcb-auditorium-speech.webp",
      keyTopics: ["Campus to Corporate", "Executive Presence", "FMCG Hiring Realities"]
    },
    {
      id: "digital-visibility-workshop",
      title: "Digital Career Strategies & Professional Visibility Workshop",
      organizer: "Faculty of Business Studies Youth Forum & LCB",
      type: "Workshop",
      institution: "University Lecture Conclave",
      participants: "Selected Student Cohort",
      description:
        "Hands-on workshop detailing how to position academic achievements, extracurricular leadership, and project portfolios to attract corporate recruiters and hiring managers.",
      image: "/images/lcb-executive-panel.webp",
      keyTopics: ["Personal Branding", "Recruiter Outreach", "Career Transitions"]
    },
    {
      id: "commercial-leadership-forum",
      title: "Executive Facilitation & Commercial Leadership Masterclass",
      organizer: "Corporate Conclaves & FMCG Youth Summits",
      type: "Panel Discussion",
      institution: "Executive Conclave Hub",
      participants: "Sales Managers & Territory Officers",
      description:
        "High-level dialogue on route-to-market mechanics, dealer ROI hygiene, and leading cross-functional commercial teams in competitive multinational landscapes.",
      image: "/images/lcb-leadership-forum.webp",
      keyTopics: ["Sales Leadership", "Route-to-Market Strategy", "Data-Driven Distribution"]
    },
    {
      id: "skill-hunt-brand-masterclass",
      title: "Skill Hunt Practical Training & Brand Management Series",
      organizer: "Skill Hunt, Faculty of Business Studies, University of Dhaka",
      type: "Masterclass",
      institution: "Faculty of Business Studies, University of Dhaka",
      participants: "2,600+ Students Trained Across Tenures",
      description:
        "Month-long intensive modules covering STP (Segmentation, Targeting, Positioning), integrated marketing communication (IMC), advanced PowerPoint presentations, and real-world case analysis.",
      image: "/images/lcb-training-masterclass.webp",
      keyTopics: ["STP Framework", "Advanced Presentations", "Case Solving"]
    }
  ] as SpeakingEvent[],

  mediaCoverage: [
    {
      id: "fe-skill-hunt",
      title: "Skill Hunt: Pioneering Student Skill-Development Hub in Bangladesh",
      outlet: "The Financial Express",
      date: "Feature Archive",
      category: "National Print Media",
      summary:
        "The Financial Express profiled Skill Hunt, founded on November 11, 2016 at the Faculty of Business Studies, University of Dhaka, under Founding President Altaf Hossain Raju and co-founders Shahoriar Ahmed and Mashiur Rahman, recognizing it as one of the country's first dedicated student training hubs.",
      linkText: "Read Coverage Archive (The Financial Express)",
      url: "https://thefinancialexpress.com.bd/",
      highlightQuote:
        "Skill Hunt was established to bridge the gap between academic theory and practical corporate requirements, equipping university graduates with competitive skills."
    },
    {
      id: "lcb-movement-feature",
      title: "Two Years of LinkedIn Community BD: Transforming Youth Professional Trajectories",
      outlet: "LCB Editorial Forum & Digital Media",
      date: "Community Feature",
      category: "Digital Feature",
      summary:
        "Comprehensive overview of how Altaf Hossain Raju established Bangladesh's first LinkedIn-based professional community, growing from campus meetups into a 24,000+ member movement across 12 universities.",
      linkText: "Explore Official LCB Stories",
      url: "https://linkedincommunitybangladesh.com/",
      highlightQuote:
        "A movement, not just a meetup. A culture of building in public, showing your work, and lifting people up as you climb."
    },
    {
      id: "jnu-finance-coverage",
      title: "LCB & JnU Finance Club Collaborative Career Initiative Completed",
      outlet: "University Press & Student Media",
      date: "Campus Press",
      category: "Community Story",
      summary:
        "Report on the high-impact career readiness and LinkedIn personal branding initiative organized with Jagannath University Finance Club, training hundreds of prospective graduates on corporate hiring dynamics.",
      linkText: "View Event Highlights",
      url: "https://linkedincommunitybangladesh.com/"
    }
  ] as MediaFeature[],

  credentials: [
    {
      id: "emba-iba",
      title: "Executive MBA (Major in Marketing)",
      institution: "Institute of Business Administration (IBA), University of Dhaka",
      periodOrYear: "Expected Completion: 2026",
      status: "Pursuing (Expected 2026)",
      field: "Executive Business Administration & Marketing",
      logo: "/logos/iba-du-logo.png",
      details:
        "Rigorous executive coursework at Bangladesh's premier business school, focusing on advanced marketing strategy, managerial economics, supply chain dynamics, and corporate finance.",
      verificationNote: "Verified from primary academic enrollment record (IBA DU EMBA)."
    },
    {
      id: "pmp",
      title: "Project Management Professional (PMP®)",
      institution: "Project Management Institute (PMI) / IBA University of Dhaka",
      periodOrYear: "Certified Credential",
      status: "Certified",
      field: "Global Project Management Standards",
      logo: "/logos/iba-du-logo.png",
      details:
        "Completed certified Project Management for Professional Competencies (PMPC) at Institute of Business Administration (IBA), University of Dhaka, mastering agile execution, risk management, and project governance.",
      verificationNote: "Verified credential and certified coursework."
    },
    {
      id: "bba-du",
      title: "Bachelor of Business Administration (BBA in Marketing)",
      institution: "Faculty of Business Studies, University of Dhaka",
      periodOrYear: "Class of 2017",
      status: "Completed",
      field: "Marketing, Consumer Behavior & Business Strategy",
      details:
        "Graduated with CGPA 3.30/4.00 from Bangladesh's most competitive business faculty. Active in student leadership, founding Skill Hunt and leading the DU Entrepreneurship Development Club.",
      verificationNote: "Official University of Dhaka academic degree."
    },
    {
      id: "bitm-digital",
      title: "Certified Comprehensive Digital Marketing Program",
      institution: "BASIS Institute of Technology & Management (BITM)",
      periodOrYear: "Professional Diploma",
      status: "Completed",
      field: "SEO, SEM, SMM, Analytics & Paid Campaign Architecture",
      logo: "/logos/bitm-logo.png",
      details:
        "30-day intensive certified program covering search engine optimization, web analytics, audience segmentation, and performance advertising.",
      verificationNote: "Certified industry training."
    },
    {
      id: "wit-cs",
      title: "Diploma in Computer Science",
      institution: "World Information & Technology Foundation",
      periodOrYear: "6-Month Diploma",
      status: "Completed",
      field: "Computer Science, AI Tools, Graphic Design & Office Suites",
      logo: "/logos/wit-foundation-logo.png",
      details:
        "Practical training in advanced office productivity, data analysis, graphics software (Adobe Suite), and foundational digital technologies.",
      verificationNote: "Certified diploma program."
    },
    {
      id: "google-digital-garage",
      title: "Certified Digital Marketing Fundamentals",
      institution: "Google Digital Garage",
      periodOrYear: "Global Certificate",
      status: "Completed",
      field: "Digital Strategy & Online Presence",
      details:
        "Accredited by Interactive Advertising Bureau (IAB) Europe and Google, validating digital marketing comprehension.",
      verificationNote: "Standard Google certification."
    }
  ] as Credential[],

  awards: [
    {
      title: "Global CEO Award (2nd Consecutive Time)",
      organization: "Marico Bangladesh Limited",
      description: "Conferred by Marico Global CEO for unmatched market execution, volume expansion, and revenue milestones.",
      year: "2023 & 2024"
    },
    {
      title: "Go Beyond Award",
      organization: "Marico Bangladesh Limited",
      description: "Marico's most prestigious annual organizational recognition, awarded directly by the CEO at MBL Annual OC 2021.",
      year: "2021"
    },
    {
      title: "National BEST STM for FY 2021-22",
      organization: "Robi Axiata Limited",
      description: "Awarded nationally for achieving the highest overall growth across all KPI Index parameters.",
      year: "2022"
    },
    {
      title: "Robi Guiding Principle Champion",
      organization: "Robi Axiata Limited",
      description: "Recognized nationally in Q4'22 for embodying the company's core cultural and operational leadership principles.",
      year: "2022"
    },
    {
      title: "Regional Redcube Champion",
      organization: "Marico Bangladesh Limited",
      description: "Awarded in Q1'23 for delivering extraordinary product penetration and market share acquisition.",
      year: "2023"
    },
    {
      title: "Champion Territory Manager (Nationally)",
      organization: "Robi Axiata Limited",
      description: "Recognized nationally in JFB & 1st Runner Up in PNS Category for exceptional commercial delivery.",
      year: "2021"
    }
  ] as AwardItem[],

  testimonials: [
    {
      id: "t1",
      name: "Community Voice — Campus Lead",
      role: "Campus Ambassador & Graduate",
      organization: "LinkedIn Community Bangladesh",
      quote:
        "Through LCB's interactions and sessions with industry professionals, I realized how much the real world has to teach beyond textbooks. It's not just a community — it is a genuine head start into corporate leadership.",
      context: "Official LCB Community Review"
    },
    {
      id: "t2",
      name: "Student Participant",
      role: "Undergraduate Fellow",
      organization: "Faculty of Business Studies, DU",
      quote:
        "LCB is not just teaching me skills — it is quietly building the professional the world will one day recognize. Every session hosted by Altaf Bhai brings us one step closer to our aspirations.",
      context: "Skill Development Participant Feedback"
    },
    {
      id: "t3",
      name: "Campus Strategy Lead",
      role: "Regional Coordinator",
      organization: "LCB Campus Leads Summit Vol. 02",
      quote:
        "Being part of LCB has been an unforgettable journey of growth, collaboration, and discovering my potential through impactful nationwide initiatives.",
      context: "Leadership Lab Participant"
    }
  ] as Testimonial[],

  leadershipRoles: [
    {
      role: "Founder & Community Architect",
      organization: "LinkedIn Community Bangladesh (LCB)",
      period: "2022 – Present"
    },
    {
      role: "Founding President",
      organization: "Skill Hunt (Dhaka University Business Club)",
      period: "Nov 2016 – Transitioned"
    },
    {
      role: "Former President",
      organization: "Dhaka University Entrepreneurship Development Club",
      period: "University Tenure"
    },
    {
      role: "Former President",
      organization: "Bangladesh Marketing Student Forum (BMSF)",
      period: "University Tenure"
    },
    {
      role: "Executive Member (Membership Committee)",
      organization: "Bangladesh FMCG HR Society",
      period: "Active Member"
    }
  ] as LeadershipRoleItem[]
};

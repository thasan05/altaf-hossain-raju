import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { LivePortfolioData } from "@/lib/dal";

interface JsonLdProps {
  profile?: LivePortfolioData["profile"];
}

export default function JsonLd({ profile: propProfile }: JsonLdProps = {}) {
  const profile = propProfile || PORTFOLIO_DATA.profile;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.fullName,
    "alternateName": [profile.displayName, profile.shortName, "Altaf Hossain Raju"],
    "honorificSuffix": profile.honorificSuffix || "PMP®",
    "jobTitle": "Area Manager – Market Operation",
    "worksFor": {
      "@type": "Organization",
      "name": "Marico Bangladesh Limited"
    },
    "founder": [
      {
        "@type": "Organization",
        "name": "LinkedIn Community Bangladesh",
        "url": "https://linkedincommunitybangladesh.com/"
      },
      {
        "@type": "Organization",
        "name": "Skill Hunt"
      },
      {
        "@type": "Organization",
        "name": "Career Talks"
      }
    ],
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "University of Dhaka"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Institute of Business Administration, University of Dhaka"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Project Management Professional (PMP®)",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Project Management Institute (PMI)"
        }
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "House 49, Banasree, Rampura",
      "addressLocality": "Dhaka",
      "addressCountry": "BD"
    },
    "sameAs": [
      profile.contact.linkedin,
      "https://linkedincommunitybangladesh.com/"
    ],
    "image": "https://altafhossainraju.com/images/altaf-portrait-lcb.jpg",
    "description": profile.heroSubheadline
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

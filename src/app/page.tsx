import React from "react";
import type { Metadata } from "next";
import { getPortfolioData } from "@/lib/dal";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImpactSection from "@/components/ImpactSection";
import AboutSection from "@/components/AboutSection";
import CareerTimeline from "@/components/CareerTimeline";
import VenturesSection from "@/components/VenturesSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import SpeakingSection from "@/components/SpeakingSection";
import CredentialsSection from "@/components/CredentialsSection";
import MediaSection from "@/components/MediaSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getPortfolioData();
    const { customization, profile } = data;

    const title = customization?.siteTitle || `${profile.displayName || "Altaf Hossain Raju"}, ${profile.honorificSuffix || "PMP®"} | Corporate Leader, Entrepreneur & Mentor`;
    const description = customization?.metaDescription || "Official portfolio of Altaf Hossain Raju, PMP® — Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh (LCB), and executive mentor empowering 24,000+ professionals across Bangladesh.";
    const ogImage = customization?.ogImageUrl || profile.images?.portraitMain || "/images/altaf-portrait-lcb.jpg";

    return {
      title,
      description,
      keywords: customization?.keywords || [
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
      ],
      openGraph: {
        title,
        description,
        url: customization?.canonicalUrl || "https://altafhossainraju.com",
        siteName: `${profile.displayName || "Altaf Hossain Raju"}, ${profile.honorificSuffix || "PMP®"} Portfolio`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${profile.displayName || "Altaf Hossain Raju"}, ${profile.honorificSuffix || "PMP®"}`,
          },
        ],
      },
      alternates: {
        canonical: customization?.canonicalUrl || "https://altafhossainraju.com",
      },
    };
  } catch {
    return {
      title: "Altaf Hossain Raju, PMP® | Corporate Leader, Entrepreneur & Mentor",
    };
  }
}

export default async function Home() {
  const data = await getPortfolioData();

  // Sort sections by sortOrder and filter only visible ones
  const activeSections = (data.sections || [])
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Fallback default order if no sections returned from DB
  const sectionsToRender =
    activeSections.length > 0
      ? activeSections
      : [
          { id: "hero", label: "Overview", isVisible: true, sortOrder: 0 },
          { id: "impact", label: "Scale & Impact", isVisible: true, sortOrder: 1 },
          { id: "about", label: "Executive Profile", isVisible: true, sortOrder: 2 },
          { id: "career", label: "Career Journey", isVisible: true, sortOrder: 3 },
          { id: "ventures", label: "Ventures & Ecosystems", isVisible: true, sortOrder: 4 },
          { id: "expertise", label: "Areas of Expertise", isVisible: true, sortOrder: 5 },
          { id: "speaking", label: "Speaking Engagements", isVisible: true, sortOrder: 6 },
          { id: "credentials", label: "Credentials & Education", isVisible: true, sortOrder: 7 },
          { id: "media", label: "Media & Press", isVisible: true, sortOrder: 8 },
          { id: "testimonials", label: "Testimonials", isVisible: true, sortOrder: 9 },
          { id: "contact", label: "Contact & Dialogue", isVisible: true, sortOrder: 10 },
        ];

  return (
    <>
      <JsonLd profile={data.profile} />
      <Navbar sections={data.sections} profile={data.profile} />
      <main className="flex flex-col min-h-screen w-full max-w-full overflow-x-clip pb-16 lg:pb-0">
        {sectionsToRender.map((section) => {
          const config = {
            customTitle: section.customTitle,
            customSubtitle: section.customSubtitle,
          };

          switch (section.id) {
            case "hero":
              return <HeroSection key="hero" profile={data.profile} sectionConfig={config} />;
            case "impact":
              return <ImpactSection key="impact" metrics={data.metrics} sectionConfig={config} />;
            case "about":
              return (
                <AboutSection
                  key="about"
                  profile={data.profile}
                  leadershipRoles={data.leadershipRoles}
                  sectionConfig={config}
                />
              );
            case "career":
              return <CareerTimeline key="career" careerJourney={data.careerJourney} sectionConfig={config} />;
            case "ventures":
              return <VenturesSection key="ventures" ventures={data.ventures} sectionConfig={config} />;
            case "expertise":
              return <ExpertiseSection key="expertise" areasOfExpertise={data.areasOfExpertise} sectionConfig={config} />;
            case "speaking":
              return <SpeakingSection key="speaking" speakingEngagements={data.speakingEngagements} sectionConfig={config} />;
            case "credentials":
              return (
                <CredentialsSection
                  key="credentials"
                  credentials={data.credentials}
                  awards={data.awards}
                  sectionConfig={config}
                />
              );
            case "media":
              return <MediaSection key="media" mediaCoverage={data.mediaCoverage} sectionConfig={config} />;
            case "testimonials":
              return <TestimonialsSection key="testimonials" testimonials={data.testimonials} sectionConfig={config} />;
            case "contact":
              return <ContactSection key="contact" profile={data.profile} sectionConfig={config} />;
            default:
              return null;
          }
        })}
      </main>
      <Footer profile={data.profile} />
      <MobileBottomBar profile={data.profile} />
    </>
  );
}

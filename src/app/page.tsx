import React from "react";
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

export default function Home() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex flex-col min-h-screen w-full max-w-full overflow-x-clip pb-16 lg:pb-0">
        <HeroSection />
        <ImpactSection />
        <AboutSection />
        <CareerTimeline />
        <VenturesSection />
        <ExpertiseSection />
        <SpeakingSection />
        <CredentialsSection />
        <MediaSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

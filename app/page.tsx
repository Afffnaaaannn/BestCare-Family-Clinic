'use client';

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { WhyUsSection } from "@/components/why-us-section"
import { ContactSection } from "@/components/contact-section"
import { MapSection } from "@/components/map-section"
import { Footer } from "@/components/footer"
import { ActiveBookingBanner } from "@/components/active-booking-banner"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="container mx-auto px-4 pt-20">
          <ActiveBookingBanner />
        </div>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <WhyUsSection />
        <ContactSection />
        <MapSection />
      </main>
      <Footer />
    </>
  )
}

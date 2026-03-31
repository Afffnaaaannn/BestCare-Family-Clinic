import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/primitives"
import { ArrowRight, Phone } from "lucide-react"
import BlurText from "@/components/blur-text"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/medical-bg.jpg"
          alt="Medical background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-primary/80" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/90">Now Accepting New Patients</span>
          </div>
          
          {/* Main Heading */}
          <BlurText
            text="Bestcare Family Clinic"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 flex justify-center"
          />
          
          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mb-4 leading-relaxed">
            Quality healthcare for your whole family
          </p>
          
          {/* Doctor Info */}
          <p className="text-base text-white/70 max-w-xl mb-10 leading-relaxed">
            Dr. Syed Baidar Hussain Zaidi - Family Physician &amp; Child Specialist 
            with 25+ years of experience providing compassionate, personalized care.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Button
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 rounded-full px-8 gap-2 group text-base hover:scale-105 transition-all duration-300"
            >
              <Link href="/book-appointment">
                Book Appointment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary rounded-full px-8 text-base"
            >
              <Link href="#services">Our Services</Link>
            </Button>
          </div>
          
          {/* Quick Contact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70">
            <Link 
              href="tel:03465473998" 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>0346-5473998</span>
            </Link>
            <span className="hidden sm:block text-white/30">|</span>
            <span>Mon - Sat: 6:00 PM - 9:00 PM</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-t-2xl shadow-lg">
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="py-6 px-4 text-center">
                <p className="font-serif text-2xl sm:text-3xl text-primary">25+</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div className="py-6 px-4 text-center">
                <p className="font-serif text-2xl sm:text-3xl text-primary">10k+</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Happy Patients</p>
              </div>
              <div className="py-6 px-4 text-center">
                <p className="font-serif text-2xl sm:text-3xl text-primary">100%</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Dedicated Care</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

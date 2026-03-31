"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/primitives"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/dialogs"
import { Menu, Phone, Calendar } from "lucide-react"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why Us" },
  { href: "#contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasActiveBooking, setHasActiveBooking] = useState(false)

  useEffect(() => {
    const booking = localStorage.getItem('activeBooking');
    const cancelledBooking = localStorage.getItem('cancelledBooking');
    setHasActiveBooking(!!(booking || cancelledBooking))
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2">
            <span className="font-serif text-xl lg:text-2xl text-primary">Bestcare Family Clinic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {hasActiveBooking && (
              <Button 
                onClick={() => {
                  localStorage.removeItem('bookingBannerDismissed');
                  localStorage.removeItem('cancelledBookingDismissed');
                  window.dispatchEvent(new Event('bookingBannerRestore'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                variant="outline" 
                size="sm" 
                className="text-blue-600 border-blue-300 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-400 hover:scale-110 transition-all duration-200 cursor-pointer rounded-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Appointment
              </Button>
            )}
            <Link 
              href="tel:03465473998" 
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>0346-5473998</span>
            </Link>
            <div className="h-6 w-px bg-border/50" />
            <Button asChild variant="outline" size="sm" className="rounded-full px-6 bg-red-600 text-white border-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-300">
              <Link href="/book-appointment">Book Appointment</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-70">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-8 items-center text-center">
                <span className="font-serif text-xl text-primary">Bestcare Family Clinic</span>
                <div className="h-px bg-border w-full" />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-foreground/70 hover:text-foreground transition-colors w-full"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border w-full" />
                {hasActiveBooking && (
                  <>
                    <Button 
                      onClick={() => {
                        localStorage.removeItem('bookingBannerDismissed');
                        localStorage.removeItem('cancelledBookingDismissed');
                        window.dispatchEvent(new Event('bookingBannerRestore'));
                        setIsOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      variant="outline" 
                      className="w-full text-blue-600 border-blue-300 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-400 rounded-full"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Appointment
                    </Button>
                    <div className="h-px bg-border w-full" />
                  </>
                )}
                <Button asChild variant="outline" className="w-full rounded-full bg-red-600 text-white border-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-300">
                  <Link href="/book-appointment" onClick={() => setIsOpen(false)}>
                    Book Appointment
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}

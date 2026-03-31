import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const quickLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why Us" },
  { href: "#contact", label: "Contact" },
]

const services = [
  "General Family Medicine",
  "Child Healthcare",
  "Vaccinations",
  "Health Checkups",
  "Chronic Disease Management",
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background/90">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="#home" className="inline-block mb-6">
              <span className="font-serif text-xl text-background">Bestcare Family Clinic</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Quality healthcare for your whole family. Compassionate care by
              Dr. Syed Baidar Hussain Zaidi with 25+ years of experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-background/60 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-background/40 shrink-0 mt-0.5" />
                <span className="text-sm text-background/60">0346-5473998</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-background/40 shrink-0 mt-0.5" />
                <span className="text-sm text-background/60">baidarzair12@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-background/40 shrink-0 mt-0.5" />
                <span className="text-sm text-background/60">ZEM Building, Near Future World School,<br />Bahria Town Phase 8, Islamabad</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-sm text-background/40 text-center">
              {new Date().getFullYear()} Bestcare Family Clinic. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-background/40 hover:text-background/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-background/40 hover:text-background/60 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/primitives"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    value: "0346-5473998",
    description: "Call us during working hours",
  },
  {
    icon: Mail,
    title: "Email",
    value: "baidarzair12@gmail.com",
    description: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "ZEM Building, Near Future World School",
    description: "Bahria Town Phase 8, Islamabad",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Mon - Sat: 6:00 PM - 9:00 PM",
    description: "Sunday: Closed",
  },
]

export function ContactSection() {

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Contact Us
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
            Get in touch
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Questions about our clinic? Need assistance? Send us a message and
            we&apos;ll get back to you as soon as possible. For appointment bookings, please visit our dedicated booking page.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-6 bg-card border border-border rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 cursor-pointer group text-center sm:text-left"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground mx-auto sm:mx-0">
                  <info.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{info.title}</p>
                  <p className="font-medium group-hover:text-primary transition-colors duration-300">{info.value}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Doctor Profile */}
          <div className="lg:col-span-3 bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 lg:p-10">
            <div className="mb-8 text-center lg:text-left">
              <h3 className="font-serif text-3xl mb-3">Dr. Baidar Hussain</h3>
              <p className="text-primary font-semibold text-lg">Chief Medical Officer</p>
            </div>

            <div className="space-y-6">
              {/* Education */}
              <div className="border-l-2 border-primary pl-6">
                <h4 className="font-semibold text-lg mb-3">Education</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">MBBS</p>
                    <p className="text-sm text-muted-foreground">Quaid-e-Azam Medical College (QMC), Bahawalpur</p>
                  </div>
                  <div>
                    <p className="font-medium">Diploma in Child Health</p>
                    <p className="text-sm text-muted-foreground">London</p>
                  </div>
                </div>
              </div>



              {/* Work Experience */}
              <div className="border-l-2 border-primary pl-6">
                <h4 className="font-semibold text-lg mb-3">Work Experience</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">Pakistan</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                        <span className="text-sm text-muted-foreground">BBH Hospital, Rawalpindi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                        <span className="text-sm text-muted-foreground">PIMS (Pakistan Institute of Medical Sciences), Islamabad</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                        <span className="text-sm text-muted-foreground">Akber Niazi Teaching Hospital, Islamabad</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                        <span className="text-sm text-muted-foreground">National Institute Hospital for Handicapped Patients, Islamabad</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">International</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                        <span className="text-sm text-muted-foreground">Ministry of Health, Libya</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                        <span className="text-sm text-muted-foreground">Ministry of Health, Maldives</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 mt-6 border-t border-primary/20">
                <p className="text-sm text-muted-foreground mb-4">Ready to experience expert care?</p>
                <Button 
                  asChild
                  size="lg" 
                  className="w-full h-12 rounded-full"
                >
                  <a href="/book-appointment">Book an Appointment</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

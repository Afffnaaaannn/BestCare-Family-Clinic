import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/primitives"
import { Award, Heart, Users, Wallet, Shield, Clock } from "lucide-react"

const reasons = [
  {
    icon: Award,
    title: "25+ Years Experience",
    description: "Decades of medical expertise in family and pediatric care.",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description: "Individualized treatment plans tailored to your unique needs.",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "A warm, welcoming atmosphere for patients of all ages.",
  },
  {
    icon: Wallet,
    title: "Affordable",
    description: "Quality healthcare services at competitive prices.",
  },
  {
    icon: Shield,
    title: "Trusted",
    description: "Building lasting relationships with families for decades.",
  },
  {
    icon: Clock,
    title: "Convenient",
    description: "Flexible scheduling to accommodate your lifestyle.",
  },
]

export function WhyUsSection() {
  return (
    <section id="why-us" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4 text-center lg:text-left">
              <p className="text-sm tracking-widest uppercase text-primary font-medium">
                Why Choose Us
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-center lg:text-left">
                Your family&apos;s health is our priority
              </h2>
              <p className="text-muted-foreground leading-relaxed text-center lg:text-left">
                At Bestcare Family Clinic, we combine medical excellence with
                compassionate care to provide the best healthcare experience.
              </p>
            </div>
            
            {/* Reasons Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex gap-4 justify-center sm:justify-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <reason.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-medium mb-1">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <Button
                asChild
                className="rounded-full px-8 gap-2 group bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
              >
                <Link href="/book-appointment">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative aspect-square rounded-4xl overflow-hidden border-2 border-primary w-full max-w-sm lg:max-w-xl">
              <Image
                src="/images/img-2.jpg"
                alt="Caring for patients at Bestcare Family Clinic"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

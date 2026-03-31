import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/primitives"
import { ArrowRight, CheckCircle } from "lucide-react"
import BlurText from "@/components/blur-text"

const credentials = [
  "Family Physician & Child Specialist",
  "Preventive Healthcare Focus",
  "Personalized Treatment Plans",
  "Diploma course in Child Health - London",
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative aspect-4/5 rounded-4xl overflow-hidden w-full max-w-sm lg:max-w-xl">
              <Image
                src="/images/doctor-portrait.png"
                alt="Dr. Syed Baidar Hussain Zaidi"
                fill
                className="object-cover"
              />
            </div>
            {/* Experience Badge */}
            <div className="absolute -right-4 top-8 lg:-right-8 bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg">
              <p className="font-serif text-4xl">25+</p>
              <p className="text-sm opacity-90">Years of<br />Experience</p>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex flex-col gap-8 w-full">
            <div className="space-y-4 text-center w-full">
              <p className="text-sm tracking-widest uppercase text-primary font-medium">
                About the Doctor
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-center">
                Meet Dr. Syed Baidar Hussain Zaidi
              </h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed text-center lg:text-left">
              <p>
                With over 25 years of dedicated practice, Dr. Zaidi has established 
                himself as a trusted name in family healthcare. His approach combines 
                medical expertise with genuine compassion, ensuring every patient 
                receives personalized attention.
              </p>
              <p>
                Specializing in both family medicine and pediatric care, Dr. Zaidi 
                believes in treating the whole person, building lasting relationships 
                with families across generations.
              </p>
            </div>
            
            {/* Credentials */}
            <div className="grid sm:grid-cols-2 gap-4">
              {credentials.map((item) => (
                <div key={item} className="flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mx-auto sm:mx-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <Button
                asChild
                className="rounded-full px-8 gap-2 group bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
              >
                <Link href="/book-appointment">
                  Schedule a Consultation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

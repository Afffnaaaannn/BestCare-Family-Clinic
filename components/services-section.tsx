import { 
  Stethoscope, 
  Baby, 
  Syringe, 
  ClipboardCheck, 
  HeartPulse, 
  Thermometer 
} from "lucide-react"

const services = [
  {
    icon: Stethoscope,
    title: "General Family Medicine",
    description: "Comprehensive primary care for patients of all ages, from routine checkups to managing complex health conditions.",
  },
  {
    icon: Baby,
    title: "Child Healthcare",
    description: "Specialized pediatric care including growth monitoring, developmental assessments, and childhood illness treatment.",
  },
  {
    icon: Syringe,
    title: "Vaccinations",
    description: "Complete vaccination programs for children and adults, following recommended immunization schedules.",
  },
  {
    icon: ClipboardCheck,
    title: "Health Checkups",
    description: "Preventive health screenings and comprehensive physical examinations to maintain optimal health.",
  },
  {
    icon: HeartPulse,
    title: "Chronic Disease Management",
    description: "Ongoing care and management for chronic conditions like diabetes, hypertension, and heart disease.",
  },
  {
    icon: Thermometer,
    title: "Minor Illness Treatment",
    description: "Prompt treatment for common illnesses including cold, flu, infections, and minor injuries.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Our Services
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
            Comprehensive healthcare services
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We offer a wide range of medical services to meet all your family&apos;s
            healthcare needs under one roof.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.title} 
              className="group bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-6 transition-colors duration-300 group-hover:bg-primary">
                <service.icon className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl mb-3 transition-colors duration-300 group-hover:text-primary">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

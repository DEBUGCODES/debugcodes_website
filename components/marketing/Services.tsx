import {
  Code,
  TrendingUp,
  PenTool,
  Laptop,
  ChevronRight,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card"; // Assuming this is a dark-theme compatible Card component

export function Services() {
  const services = [
    {
      title: "Software Engineering",
      subtitle: "Build the future with custom applications.",
      icon: Code,
      features: [
        "Scalable Web & Mobile Apps",
        "Business Process Automation",
        "Secure System Integration",
        "High-Performance API Development",
      ],
    },
    {
      title: "Digital Brand Growth",
      subtitle: "Manage and scale your presence effectively.",
      icon: TrendingUp,
      features: [
        "Impactful Content Strategy",
        "Comprehensive Social Campaigns",
        "Performance Analytics & Reporting",
        "Targeted Audience Engagement",
      ],
    },
    {
      title: "Creative Design & UX",
      subtitle: "Stunning visuals that drive user action.",
      icon: PenTool,
      features: [
        "Full Brand Identity & Logo",
        "Intuitive UI/UX Prototyping",
        "High-Quality Marketing Assets",
        "Print and Digital Media Kits",
      ],
    },
    {
      title: "Technology Education",
      subtitle: "Empowering your team with essential tech skills.",
      icon: Laptop,
      features: [
        "Modern Web Development Bootcamps",
        "Hands-on Digital Marketing Skills",
        "Youth & Professional Programs",
        "Custom Corporate Training Modules",
      ],
    },
  ];

  return (
    <section id="services" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Accent Line Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-12 bg-teal opacity-50" />
            <span className="text-teal font-medium tracking-wider text-sm uppercase">
              What We Do
            </span>
            <span className="h-px w-12 bg-teal opacity-50" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {/* Subtle gradient text effect for the title */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-lighter">
              Core Digital Services
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate text-lg">
            We offer a comprehensive suite of digital solutions designed to help
            you scale your business and innovate in the East African market.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <Card
              key={idx}
              // UNIFIED CARD STYLE (Matching About Section)
              className="
        group flex flex-col justify-between h-full p-6 rounded-xl 
        bg-navy-light 
        border border-navy-lighter 
        transition-all duration-300 ease-in-out
        hover:border-teal/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal/20
       "
            >
              <div>
                {/* Icon Container (Matching About Section) */}
                <div
                  className="p-3 mb-4 inline-block rounded-lg 
               bg-navy text-teal 
               group-hover:bg-teal/10 transition-colors"
                >
                  <service.icon className="w-6 h-6" />
                </div>

                {/* Title & Subtitle */}
                <h3
                  className="text-xl font-bold text-white mb-2 
         group-hover:text-teal transition-colors"
                >
                  {service.title}
                </h3>
                <p className="text-base text-slate mb-6">
                  {service.subtitle}
                </p>

                {/* Features List (Modern Checkmarks) */}
                <ul className="space-y-3 pt-4 border-t border-navy-lighter/50">
                  {service.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center text-sm font-light text-slate"
                    >
                      {/* Using Checkmark for value proposition */}
                      <Check className="w-4 h-4 text-teal mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learn More Link (kept subtle) */}
              <a
                href={`#contact`}
                className="mt-8 flex items-center text-teal font-medium text-sm hover:text-white transition-colors"
              >
                Contact for a Quote
                <ChevronRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

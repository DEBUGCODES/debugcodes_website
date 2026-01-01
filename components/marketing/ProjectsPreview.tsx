import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Component to render individual project card
const ProjectCard = ({ project }: { project: any }) => (
  <Card
    className="group relative overflow-hidden rounded-xl h-[450px] md:h-[550px] 
                   bg-navy border border-navy-lighter 
                   transition-all duration-500 
                   hover:shadow-2xl hover:shadow-teal/20"
  >
    {/* Project Image */}
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={project.image}
        alt={project.title}
        fill
        // Image Scale and Opacity Hover Effect
        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
      />
    </div>

    {/* Content Overlay */}
    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />

      {/* Content Container */}
      <div className="relative z-20">
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-teal/10 text-teal border border-teal/50 hover:bg-teal/20 transition-colors">
            {project.category}
          </Badge>
        </div>

        <h3 className="text-3xl font-extrabold text-white mb-3">
          {project.title}
        </h3>
        <p className="text-slate line-clamp-2 mb-4 text-base">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded-full bg-navy-lighter/70 text-slate border border-navy-lighter"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Links (Visible always, hover enhances them) */}
        <div className="flex items-center gap-4">
          <Link href={`/projects/${project.slug}`}>
            <Button className="bg-teal hover:bg-teal-dark text-navy font-semibold transition-colors">
              View Case Study <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-teal transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

// --- ProjectsPreview Component Start ---
export function ProjectsPreview() {
  const projects = [
    {
      id: 1,
      title: "Safari Booking Engine",
      slug: "safari-booking-engine",
      category: "Web Development",
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
      description:
        "A comprehensive, high-performance booking system built for a leading Arusha tour operator, resulting in a 40% increase in direct, commission-free bookings.",
      tags: ["Next.js", "PostgreSQL", "Stripe"],
    },
    {
      id: 2,
      title: "SME Finance Tracker",
      slug: "sme-finance-tracker",
      category: "Mobile App",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200",
      description:
        "Android application helping local Tanzanian shopkeepers manage inventory and track daily expenses, promoting local business efficiency.",
      tags: ["React Native", "Firebase", "Analytics"],
    },
    {
      id: 3,
      title: "Kibo Coffee Brand",
      slug: "kibo-coffee-brand",
      category: "Graphic Design",
      image:
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1200",
      description:
        "Complete brand identity refresh including logo, packaging, and social media assets, capturing the essence of local Kilimanjaro coffee.",
      tags: ["Branding", "Packaging", "Social Media"],
    },
    {
      id: 4,
      title: "TechKids Learning Portal",
      slug: "techkids-learning-portal",
      category: "Training Platform",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
      description:
        "An interactive e-learning platform used by our coding bootcamp students, gamifying the learning experience for future tech leaders.",
      tags: ["LMS", "Video Streaming", "Gamification"],
    },
  ];

  // const projects: any[] = []; // Uncomment to test empty state

  return (
    <section id="projects" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block with Gradient Text */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-12 bg-teal opacity-50" />
              <span className="text-teal font-medium tracking-wider text-sm uppercase">
                Portfolio
              </span>
              
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-lighter">
                Recent Work
              </span>
            </h2>
          </div>
          <Link href="/projects" className="mt-4 md:mt-0">
            <Button
              variant="link"
              className="text-teal flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All Projects <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Conditional Rendering */}
        {projects.length === 0 ? (
          // --- EMPTY STATE ---
          <Card className="bg-navy-light border border-navy-lighter p-12 text-center max-w-2xl mx-auto">
            <ArrowRight className="w-12 h-12 text-teal mx-auto mb-4 rotate-45" />
            <h3 className="text-3xl font-bold text-white mb-2">
              Projects in Development
            </h3>
            <p className="text-slate text-lg mb-4">
              We are finalizing documentation for our latest client successes.
              Check back soon to see our portfolio updates!
            </p>
          </Card>
        ) : (
          // --- Projects Grid (Uniform Layout) ---
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

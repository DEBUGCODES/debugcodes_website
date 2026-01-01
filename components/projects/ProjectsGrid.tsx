import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Calendar, Tag, SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Component to render an individual project card
const ProjectCard = ({ project }: { project: any }) => (
  <Card
    className="group relative overflow-hidden bg-navy-light border border-navy-lighter 
                   transition-all duration-300 hover:shadow-2xl hover:shadow-teal/15 hover:border-teal/50"
  >
    {/* Featured Badge */}
    {project.featured && (
      <div className="absolute top-0 left-0 z-10 p-3 bg-teal/90 rounded-br-lg">
        <Badge className="bg-transparent text-navy font-bold uppercase tracking-wider text-xs">
          Featured
        </Badge>
      </div>
    )}

    {/* Image and Overlay */}
    <div className="aspect-video overflow-hidden relative">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
      />
      {/* Darker gradient on hover for a dramatic feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-light/80 to-transparent transition-opacity duration-300" />
    </div>

    {/* Content Block */}
    <div className="p-6">
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal transition-colors">
        {project.title}
      </h3>

      {/* Metadata (Category & Date) */}
      <div className="flex items-center gap-4 mb-3 text-slate">
        <span className="text-sm font-medium text-teal flex items-center gap-1">
          <Tag className="w-4 h-4" /> {project.category}
        </span>
        <span className="flex items-center text-xs text-slate/70">
          <Calendar className="w-3 h-3 mr-1" /> {project.date}
        </span>
      </div>

      <p className="text-sm text-slate line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Tags (using small badges for better visual hierarchy) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.slice(0, 4).map((tag: string, idx: number) => (
          <Badge
            key={idx}
            variant="secondary"
            className="text-xs px-2 py-0.5 rounded-full bg-navy-lighter text-slate hover:bg-teal/10 hover:text-teal border border-navy-lighter"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-2 pt-4 border-t border-navy-lighter">
        <Link href={`/projects/${project.slug}`} className="flex-1">
          <Button
            variant="default"
            className="w-full bg-teal text-navy hover:bg-teal-dark font-semibold"
          >
            View Details
          </Button>
        </Link>
        {project.demoUrl !== "#" && (
          <Link href={project.demoUrl} target="_blank">
            <Button
              variant="outline"
              size="icon"
              className="border-navy-lighter text-slate hover:border-teal hover:text-teal"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  </Card>
);

// --- ProjectsGrid Component Start ---
export function ProjectsGrid() {
  const allProjects = [
    {
      id: 1,
      title: "Safari Booking Engine",
      slug: "safari-booking-engine",
      category: "Web Development",
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
      description:
        "A comprehensive booking system for a leading Arusha tour operator, increasing direct bookings by 40%.",
      tags: ["Next.js", "PostgreSQL", "Stripe", "Tailwind"],
      date: "December 2024",
      demoUrl: "https://demo.safariengine.com", // Added a real-looking demo URL
      featured: true,
    },
    {
      id: 2,
      title: "SME Finance Tracker",
      slug: "sme-finance-tracker",
      category: "Mobile App",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200",
      description:
        "Android application helping local Tanzanian shopkeepers manage inventory and track daily expenses.",
      tags: ["React Native", "Firebase", "Analytics", "Offline-First"],
      date: "November 2024",
      demoUrl: "#",
      featured: true,
    },
    {
      id: 3,
      title: "Kibo Coffee Brand",
      slug: "kibo-coffee-brand",
      category: "Graphic Design",
      image:
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1200",
      description:
        "Complete brand identity refresh including logo, packaging, and social media assets.",
      tags: ["Branding", "Packaging", "Social Media", "Print Design"],
      date: "October 2024",
      demoUrl: "#",
      featured: false,
    },
    // ... (rest of the projects are omitted for brevity in the final output but are assumed to exist)
  ];

  // const allProjects: any[] = []; // Uncomment to test empty state
  const filteredProjects = allProjects; // Assume filtering logic applied here

  return (
    <section className="pb-24 pt-8 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* NOTE: You should place the <ProjectsFilter /> component here in your parent view */}

        {filteredProjects.length === 0 ? (
          // --- EMPTY STATE / NO PROJECTS FOUND ---
          <Card className="bg-navy-light border border-navy-lighter p-12 text-center max-w-lg mx-auto mt-12">
            <SearchX className="w-12 h-12 text-teal mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">
              No Projects Found
            </h3>
            <p className="text-slate text-lg">
              Your search returned no results. Please adjust your filters or
              contact us to discuss a custom project.
            </p>
          </Card>
        ) : (
          // --- Projects Grid ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

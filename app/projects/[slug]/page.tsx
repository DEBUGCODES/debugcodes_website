import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  Users,
  Code2,
  AlertTriangle,
  Check,
  Zap,
  Gauge,
  Clock,
  Package,
  Lock,
  Mail,
  LayoutDashboard,
  Smartphone,
  DollarSign,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Custom component for the project feature card (New Design)
const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <Card className="p-5 bg-navy border-navy-lighter flex flex-col items-start space-y-3 h-full transition-all hover:border-teal/50 hover:shadow-lg hover:shadow-teal/10">
    <Icon className="w-8 h-8 text-teal flex-shrink-0" />
    <h4 className="text-lg font-bold text-white">{title}</h4>
    <p className="text-sm text-slate">{description}</p>
  </Card>
);

// Custom component for the Project Gallery (New Design with Hover/Gradient)
const GalleryItem = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <div
    className={`relative aspect-video rounded-xl overflow-hidden shadow-xl group cursor-pointer ${className}`}
  >
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
    />
    {/* Subtle Gradient Overlay for Pop Effect */}
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
  </div>
);

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // This would normally fetch from database
  const project = {
    title: "Safari Booking Engine",
    category: "Web Development",
    date: "December 2024",
    client: "Serengeti Adventures Ltd.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600",
    description:
      "A comprehensive booking system for a leading Arusha tour operator, increasing direct bookings by 40%.",
    challenge:
      "The client was losing revenue to third-party booking platforms and needed a direct booking solution that could handle complex safari packages, availability management, and payment processing.",
    solution:
      "We built a custom Next.js application with real-time availability, integrated payment processing, automated email confirmations, and a comprehensive admin dashboard for managing bookings and inventory.",
    results: [
      { icon: Zap, value: "40%", label: "Increase in Direct Bookings" },
      { icon: Gauge, value: "60%", label: "Reduction in Processing Time" },
      { icon: ExternalLink, value: "25%", label: "Cost Savings (Commissions)" },
      { icon: Users, value: "High", label: "Improved Customer Satisfaction" },
    ],
    technologies: [
      "Next.js 14",
      "PostgreSQL",
      "Prisma",
      "Stripe",
      "Tailwind CSS",
      "Resend",
    ],
    // Mapped features to descriptive objects for the new card layout
    featureDetails: [
      {
        icon: Clock,
        title: "Real-Time Availability",
        description:
          "Instantly check and reserve dates, eliminating double-bookings and manual updates.",
      },
      {
        icon: Package,
        title: "Custom Package Builder",
        description:
          "Allows clients to easily configure complex, multi-day safari itineraries and addons.",
      },
      {
        icon: Lock,
        title: "Secure Payment Gateway",
        description:
          "Integrated Stripe for secure processing of deposits and final payments in multiple currencies.",
      },
      {
        icon: Mail,
        title: "Automated Confirmation",
        description:
          "Instant email confirmations and itinerary delivery upon successful booking.",
      },
      {
        icon: LayoutDashboard,
        title: "Admin Management Portal",
        description:
          "Comprehensive dashboard for staff to manage inventory, bookings, and customer data.",
      },
      {
        icon: Smartphone,
        title: "Mobile Optimized Design",
        description:
          "Flawless user experience on all devices, from desktop to mobile phones.",
      },
      {
        icon: DollarSign,
        title: "Multi-Currency Support",
        description:
          "Accept bookings and display prices in several major international currencies.",
      },
      {
        icon: Star,
        title: "Integrated Review System",
        description:
          "Collect and display verified customer feedback directly on the website.",
      },
    ],
    demoUrl: "https://demo.safariengine.com",
    githubUrl: "#",
    gallery: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    ],
  };

  const hasGallery = project.gallery && project.gallery.length > 0;

  return (
    <div className="min-h-screen bg-navy text-slate">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/projects">
            <Button
              variant="ghost"
              className="mb-8 text-teal hover:text-teal-dark hover:bg-teal/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-teal/10 border-teal text-teal">
                {project.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-slate mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate">
                  <Calendar className="w-4 h-4 text-teal" />
                  <span>Completed: {project.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate">
                  <Users className="w-4 h-4 text-teal" />
                  <span>Client: {project.client}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={project.demoUrl} target="_blank">
                  <Button className="bg-teal text-navy hover:bg-teal-dark">
                    View Live Site
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={project.githubUrl} target="_blank">
                  <Button
                    variant="outline"
                    className="border-teal text-teal hover:bg-teal/10"
                  >
                    <Code2 className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image with Stylish Border Effect (Hero) */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 rounded-xl overflow-hidden border-2 border-navy-lighter shadow-2xl shadow-navy-light/50">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-teal/20 rounded-xl -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 bg-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- MAIN GRID CONTAINER --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* --- COL 1/2: Main Content (Challenge, Solution) --- */}
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge Section */}
              <Card className="p-8 bg-navy border-2 border-red-500/50 shadow-lg shadow-red-500/10">
                <div className="flex items-start gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      The Challenge
                    </h2>
                    <p className="text-slate leading-relaxed text-lg italic">
                      &quot;{project.challenge}&quot;
                    </p>
                  </div>
                </div>
              </Card>

              {/* Solution */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Our Solution
                </h2>
                <p className="text-slate leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* --- COL 3: Sidebar --- */}
            <div className="space-y-8">
              {/* Technologies */}
              <Card className="p-6 bg-navy border-navy-lighter">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-teal" />
                  Core Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge
                      key={idx}
                      variant="default"
                      className="bg-navy-lighter text-teal border border-teal/50 hover:bg-teal/20 transition-colors font-medium"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Client/Date Summary */}
              <Card className="p-6 bg-navy border-navy-lighter">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal" />
                  Project Context
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm text-slate border-b border-navy-lighter pb-2">
                    <span className="font-medium text-teal">Client:</span>
                    <span className="text-slate">{project.client}</span>
                  </li>
                  <li className="flex justify-between text-sm text-slate">
                    <span className="font-medium text-teal">Completion:</span>
                    <span className="text-slate">{project.date}</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* --- NEW FULL-WIDTH SECTIONS (lg:col-span-3) --- */}
            {/* This section is placed *within* the main grid but is instructed to span all 3 columns on large screens. */}

            {/* Key Product Features (Full Width) */}
            <div className="lg:col-span-3 space-y-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Key Product Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Changed to 4 columns on large screens for better density */}
                {project.featureDetails.map((feature, idx) => (
                  <FeatureCard
                    key={idx}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>
            </div>

            {/* Results & Impact (Full Width) */}
            <div className="lg:col-span-3 space-y-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Results & Impact
              </h2>
              {/* Changed to 4 columns for better balance with features */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {project.results.map((result, idx) => (
                  <Card
                    key={idx}
                    className="p-5 bg-navy border-navy-lighter hover:border-teal/50 transition-colors text-center"
                  >
                    <result.icon className="w-6 h-6 text-teal mx-auto mb-3" />
                    <p className="text-3xl font-extrabold text-white mb-1">
                      {result.value}
                    </p>
                    <p className="text-sm text-slate uppercase tracking-wider">
                      {result.label}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Project Gallery (Full Width) */}
            {hasGallery && (
              <div className="lg:col-span-3 space-y-12">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Made the first image one column, and changed the grid to 3 columns on large screens */}
                  <GalleryItem
                    src={project.gallery[0]}
                    alt={`Gallery image 1`}
                    className="md:col-span-2 lg:col-span-1" // Adjusted span for 3-column layout
                  />

                  {/* Remaining Images */}
                  {project.gallery.slice(1).map((img, idx) => (
                    <GalleryItem
                      key={idx}
                      src={img}
                      alt={`Gallery image ${idx + 2}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>{" "}
          {/* --- END MAIN GRID CONTAINER --- */}
        </div>
      </section>

      <Footer />
    </div>
  );
}

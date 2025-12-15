import {
  BookOpen,
  Code2,
  Smartphone,
  GraduationCap,
  ArrowRight,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Custom component to handle the specific gradient background for the icon
const IconWrapper = ({
  icon: Icon,
  isAvailable,
}: {
  icon: any;
  // Removed 'color' prop since we are enforcing a single brand color
  isAvailable: boolean;
}) => (
  <div
    className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center 
         // --- CRUCIAL CHANGE: Hardcoded Teal Gradient ---
         bg-gradient-to-br from-teal-500 to-teal-700 text-white 
         relative overflow-hidden transition-all duration-300 shadow-lg shadow-black/30
         ${isAvailable ? "ring-2 ring-offset-2 ring-teal/50 ring-offset-navy-light" : ""}`}
  >
    {/* Subtle inner glow for a modern touch */}
    <div className="absolute inset-0 bg-white/10 opacity-30 blur-sm rounded-xl" />
    <Icon className="w-6 h-6 relative z-10" />
  </div>
);

// --- Component Start ---
export function Products() {
  const products = [
    {
      name: "Debug LMS",
      description:
        "Our comprehensive Learning Management System with video courses on programming and digital marketing.",
      icon: GraduationCap,
      status: "Available",
      features: [
        "Video Courses",
        "Progress Tracking",
        "Certificates",
        "Interactive Quizzes",
      ],
      link: "/lms",
      // color: "from-teal/80 to-teal-dark", <-- REMOVED
    },
    {
      name: "Debug CRM",
      description:
        "Customer Relationship Management tool designed for SMEs to manage clients and sales pipeline.",
      icon: Smartphone,
      status: "Coming Soon",
      features: [
        "Contact Management",
        "Sales Pipeline",
        "Analytics",
        "Email Integration",
      ],
      link: "#",
      // color: "from-fuchsia-500/80 to-purple-600", <-- REMOVED
    },
    {
      name: "Debug Code Editor",
      description:
        "Online collaborative code editor with real-time collaboration for our training programs.",
      icon: Code2,
      status: "Beta",
      features: [
        "Multi-language Support",
        "Live Collaboration",
        "Code Playground",
        "Syntax Highlighting",
      ],
      link: "#",
      // color: "from-lime-500/80 to-green-600", <-- REMOVED
    },
    {
      name: "Debug Academy",
      description:
        "Interactive learning platform for kids aged 8-16 to learn coding through games and projects.",
      icon: BookOpen,
      status: "Coming Soon",
      features: [
        "Gamified Learning",
        "Project-Based",
        "Parent Dashboard",
        "Progress Reports",
      ],
      link: "#",
      // color: "from-orange-500/80 to-red-600", <-- REMOVED
    },
  ];

  // Function to determine Badge appearance
  const getStatusBadge = (status: string) => {
    if (status === "Available") {
      return (
        <Badge className="bg-teal/20 text-teal border border-teal/50 hover:bg-teal/30">
          Available
        </Badge>
      );
    }
    if (status === "Beta") {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 hover:bg-yellow-500/30">
          Beta
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-800 text-slate-100 hover:bg-slate-lighter/20">
        Coming Soon
      </Badge>
    );
  };

  return (
    <section id="products" className="py-24 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-12 bg-teal opacity-50" />
            <span className="text-teal font-medium tracking-wider text-sm uppercase">
              Our Products
            </span>
            <span className="h-px w-12 bg-teal opacity-50" />
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-lighter">
              Products to Empower Your Digital Journey
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-slate text-lg">
            Explore our range of innovative products designed to empower
            individuals and businesses in Tanzania through technology and
            education.
          </p>
        </div>

        {/* Conditional Rendering based on product array length */}
        {products.length === 0 ? (
          // --- EMPTY STATE / COMING SOON ---
          <Card className="bg-navy border border-navy-lighter p-12 text-center max-w-2xl mx-auto">
            <Smartphone className="w-12 h-12 text-teal mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">
              New Products are on the Horizon!
            </h3>
            <p className="text-slate text-lg mb-4">
              We are currently hard at work developing cutting-edge tools. Check
              back soon for exciting updates on our latest offerings.
            </p>
            <Button className="bg-teal hover:bg-teal-dark text-navy font-semibold">
              Join Our Newsletter
            </Button>
          </Card>
        ) : (
          // --- PRODUCTS GRID (Uniform Layout) ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card
                key={product.name}
                className={`group p-6 bg-navy border border-navy-lighter transition-all duration-300 
                      hover:shadow-xl hover:shadow-teal/20 hover:border-teal/50`}
              >
                <IconWrapper
                  icon={product.icon}
                  // Removed color prop here
                  isAvailable={product.status === "Available"}
                />

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate mb-4 text-base">
                  {product.description}
                </p>

                <div className="mb-6 space-y-2">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal flex-shrink-0" />
                      <span className="text-slate text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-navy-lighter">
                  {getStatusBadge(product.status)}

                  <Button
                    asChild
                    disabled={product.status !== "Available"}
                    variant="link"
                    className={`flex items-center gap-1 font-semibold transition-all 
          ${product.status === "Available" ? "text-teal hover:gap-2" : "text-slate-400 cursor-not-allowed"}`}
                  >
                    <Link href={product.link}>
                      {product.status === "Available"
                        ? "Explore Now"
                        : "Notify Me"}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

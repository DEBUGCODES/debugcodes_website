"use client";

import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Hero() {
  // Note: Since 'projects' is a page route, we use Link for it, and scrollToSection for anchors.
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden bg-navy min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-5xl mx-auto animate-in fade-in duration-1000">
          {/* --- Sub-Heading Badge --- */}
          <Badge className="mb-8 bg-teal/10 border-teal text-teal hover:bg-teal/20 text-sm font-medium tracking-wider px-4 py-1.5 transition-all">
            <Zap className="w-3.5 h-3.5 mr-2 animate-pulse" />
            Digital Engineering in East Africa • Est. 2025
          </Badge>

          {/* --- Main Headline --- */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tighter mb-8">
            Simplify. Create.
            {/* Gradient Text for Maximum Pop */}
            <span className="block text-teal bg-gradient-to-r from-teal-light to-teal-dark bg-clip-text text-transparent mt-2 lg:inline-block lg:mt-0 ml-4 transition-all duration-500">
              Grow.
            </span>
          </h1>

          {/* --- Sub-Text --- */}
          <p className="mt-6 text-xl text-slate-lighter max-w-3xl mx-auto mb-12 leading-normal font-light">
            We empower businesses with innovative software, strategic branding,
            and digital training. The future of tech in East Africa starts here.
          </p>

          {/* --- CTA Buttons --- */}
          {/* --- CTA Buttons (Minimalist & Glowing Outline) --- */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Primary CTA: Outline/Glow */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("services")}
              className="border-teal text-teal hover:text-slate font-bold text-lg px-8 py-7 group transition-all duration-300 transform hover:scale-[1.02] bg-transparent hover:bg-teal/5 shadow-xl shadow-teal/30 hover:shadow-2xl hover:shadow-teal/50"
            >
              Explore Our Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            {/* Secondary CTA: Ghost/Minimalist Link */}
            <Link href="/projects" passHref>
              <Button
                size="lg"
                variant="ghost"
                className="text-slate-lighter hover:text-slate text-lg px-8 py-7 transition-colors duration-300"
              >
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- Modern Abstract Background Glow --- */}
      {/* 1. Large Central Gradient/Orbital Glow (subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-teal rounded-full blur-[150px] opacity-[0.05] pointer-events-none transition-opacity duration-1000" />

      {/* 2. Top-Right Secondary Glow (adds depth) */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-dark rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />

      {/* 3. Bottom-Left Tertiary Glow (for balance) */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy-light rounded-full blur-[180px] opacity-[0.02] pointer-events-none" />
    </section>
  );
}

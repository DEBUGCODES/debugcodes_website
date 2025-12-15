"use client";

import { Handshake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Partners() {
  const partners = [
    { name: "Arusha Tech Hub", logo: "ATH" },
    { name: "Serengeti Ventures", logo: "SV" },
    { name: "Urban Coffee Co.", logo: "UCC" },
    { name: "Tanzania Digital Forum", logo: "TDF" },
    { name: "Meru Logistics", logo: "ML" },
    { name: "Kijenge Supermarket", logo: "KS" },
  ];

  // Simulating an empty array for testing the empty state:
  // const partners: any[] = [];

  // Create the content array by duplicating partners multiple times for infinite scroll effect
  const marqueeContent = [...partners, ...partners, ...partners];

  return (
    <section
      id="partners"
      className="py-20 bg-navy-light/50 border-y border-navy-lighter"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-teal mb-12 uppercase tracking-widest">
          Trusted by organizations across Tanzania
        </p>

        {partners.length === 0 ? (
          // --- EMPTY STATE / COMING SOON ---
          <Card className="bg-navy border border-navy-lighter p-8 md:p-12 text-center max-w-3xl mx-auto">
            <Handshake className="w-12 h-12 text-teal mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Partner with Us
            </h3>
            <p className="text-slate text-lg mb-6">
              We are always looking to collaborate with innovators, businesses,
              and organizations committed to digital growth.
            </p>
            <Link href="/contact" passHref>
              <Button className="bg-teal hover:bg-teal-dark text-navy font-semibold">
                Start a Partnership
              </Button>
            </Link>
          </Card>
        ) : (
          // --- PARTNERS MARQUEE ---
          <div className="relative overflow-hidden">
            {/* Fading Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-navy-light/50 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-navy-light/50 to-transparent z-10" />

            {/* Marquee Container */}
            <div className="flex animate-scroll gap-12 w-max hover:animation-pause">
              {marqueeContent.map((partner, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer group"
                >
                  {/* Logo Placeholder */}
                  <div
                    className="w-16 h-16 rounded-full bg-navy border border-navy-lighter group-hover:border-teal 
                                                    flex items-center justify-center font-extrabold text-teal text-base 
                                                    transition-all duration-300 transform group-hover:scale-105"
                  >
                    {partner.logo}
                  </div>
                  {/* Partner Name */}
                  <span className="text-lg font-semibold text-white whitespace-nowrap hidden sm:inline-block">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

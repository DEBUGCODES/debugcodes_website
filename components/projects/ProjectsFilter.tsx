"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ProjectsFilter() {
  const [activeFilter, setActiveFilter] = useState("All");

  // NOTE: In a real app, this list should be derived from your fetched projects data
  const categories = [
    "All",
    "Web Development",
    "Mobile App",
    "Graphic Design",
    "Training Platform",
    "E-commerce",
    "Branding",
  ];

  return (
    // Added horizontal scroll wrapper for better mobile experience
    <div className="flex overflow-x-auto gap-3 pb-4 mb-8 justify-start md:justify-center whitespace-nowrap scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeFilter === category ? "default" : "outline"}
          onClick={() => setActiveFilter(category)}
          // Custom styles for better visual appeal
          className={
            activeFilter === category
              ? "bg-teal text-navy hover:bg-teal-dark font-semibold"
              : "border-navy-lighter bg-navy-light text-slate hover:border-teal hover:text-teal transition-colors"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

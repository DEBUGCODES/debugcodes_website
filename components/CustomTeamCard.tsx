// components/CustomTeamCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you still use the shadcn Button

interface CustomCardProps {
  member: {
    name: string;
    role: string;
    image: string;
    bio: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
}

export function CustomTeamCard({ member }: CustomCardProps) {
  return (
    // 1. Outer Container: Handles the border, background, rounded corners, and essential clipping.
    <div 
      className="group relative rounded-xl bg-navy-light border border-navy-lighter hover:border-teal/50 transition-all duration-300 overflow-hidden"
    >
      
      {/* 2. IMAGE BLOCK - Full Bleed Area */}
      <div className="relative h-72">
        <Image
          src={member.image}
          alt={member.name}
          fill
          // Crucial: No border-radius or padding classes on the Image or its direct parent container.
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Social Icon Overlay */}
        <div 
          className="absolute inset-0 bg-navy-lighter/70 backdrop-blur-sm 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                     flex items-center justify-center gap-4 z-10"
        >
          <Link href={member.linkedin} target="_blank">
            <Button size="icon" className="bg-teal hover:bg-teal-dark text-navy transition-colors">
              <Linkedin className="w-5 h-5" />
            </Button>
          </Link>
          <Link href={member.twitter} target="_blank">
            <Button size="icon" className="bg-teal hover:bg-teal-dark text-navy transition-colors">
              <Twitter className="w-5 h-5" />
            </Button>
          </Link>
          <Link href={`mailto:${member.email}`}>
            <Button size="icon" className="bg-teal hover:bg-teal-dark text-navy transition-colors">
              <Mail className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        {/* Subtle Gradient for Readability at the bottom of the image */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-navy-light to-transparent" />
      </div>

      {/* 3. TEXT CONTENT BLOCK - Padded Area */}
      <div className="p-6 text-center">
        <h3 className="text-2xl font-semibold text-white mb-0.5">{member.name}</h3>
        <p className="text-teal text-base font-medium mb-3">{member.role}</p>
        <p className="text-slate text-sm line-clamp-2">{member.bio}</p>
      </div>
    </div>
  );
}
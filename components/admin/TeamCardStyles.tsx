// src/components/TeamCardStyles.ts

import { Briefcase, Zap, Palette, BarChart2, Lightbulb } from 'lucide-react';

// 1. Define the possible roles for clear type-safety
export type TeamRole = 
  | 'Founder & CEO' 
  | 'CTO' 
  | 'Head of Design' 
  | 'Marketing Director'
  | 'Engineer'
  | 'Product Manager';

// 2. Define the style mapping (similar to STATUS_STYLES/PRIORITY_STYLES)
interface RoleStyle {
    icon: any; // Lucide Icon component
    color: string; // Text color class
    bg: string;    // Background color class for badges/strips
    stripe: string; // Solid color class for the Card stripe indicator
}

export const ROLE_STYLES: Record<TeamRole, RoleStyle> = {
    'Founder & CEO': {
        icon: Lightbulb,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100',
        stripe: 'bg-indigo-500',
    },
    'CTO': {
        icon: Zap,
        color: 'text-sky-600',
        bg: 'bg-sky-100',
        stripe: 'bg-sky-500',
    },
    'Head of Design': {
        icon: Palette,
        color: 'text-pink-600',
        bg: 'bg-pink-100',
        stripe: 'bg-pink-500',
    },
    'Marketing Director': {
        icon: BarChart2,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        stripe: 'bg-orange-500',
    },
    'Engineer': {
        icon: Briefcase,
        color: 'text-teal-600',
        bg: 'bg-teal-100',
        stripe: 'bg-teal-500',
    },
    'Product Manager': {
        icon: Briefcase,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        stripe: 'bg-purple-500',
    },
};

// 3. Define the Team Member Interface
export interface TeamMember {
    name: string;
    role: TeamRole; // Use the defined type
    image: string;
    bio: string;
    linkedin: string;
    twitter: string;
    email: string;
}
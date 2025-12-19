// src/components/CustomTeamCard.tsx

import Image from 'next/image';
import { Mail, Linkedin, Twitter } from 'lucide-react';
// Assuming these are standard shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; 
// Import configuration and utility
import { ROLE_STYLES, TeamMember } from './TeamCardStyles';
import { cn } from '@/lib/utils'; // Assuming cn utility is available

export function CustomTeamCard({ member }: { member: TeamMember }) {
    const roleDetails = ROLE_STYLES[member.role];
    const RoleIcon = roleDetails.icon;

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl border-gray-700 bg-gray-800">
            {/* Role-based Color Stripe Indicator */}
            <div
                className={cn(
                    "absolute top-0 left-0 w-1 h-full rounded-l transition-all duration-500",
                    roleDetails.stripe
                )}
            />

            <div className="p-6 pt-5">
                {/* Image and Role Tag */}
                <div className="flex justify-between items-start mb-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                        {/* NOTE: Adjust props (layout/objectFit) or replace with standard <img> if not using Next.js Image */}
                        <Image
                            src={member.image}
                            alt={member.name}
                            layout="fill"
                            objectFit="cover"
                            quality={80}
                            className="transition-all duration-300 group-hover:scale-105"
                        />
                    </div>
                    
                    {/* Role Badge */}
                    <span
                        className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                            roleDetails.bg,
                            roleDetails.color
                        )}
                    >
                        <RoleIcon className="w-3 h-3 mr-1.5" />
                        {member.role}
                    </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">
                    {member.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 min-h-[60px] mb-4">
                    {member.bio}
                </p>

                {/* Contact Icons */}
                <div className="flex gap-2 pt-2 border-t border-gray-700/50">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-teal-400">
                        <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                            <Mail className="w-5 h-5" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-teal-400">
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn for ${member.name}`}>
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-teal-400">
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label={`Twitter for ${member.name}`}>
                            <Twitter className="w-5 h-5" />
                        </a>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
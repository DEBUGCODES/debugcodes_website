// Team.tsx

import { CustomTeamCard } from '@/components/CustomTeamCard'; // Import the new component
// Removed: import { Card } from '@/components/ui/card'; // We no longer need the shadcn Card

export function Team() {
 const team = [
  {
   name: 'John Doe',
   role: 'Founder & CEO',
   image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
   bio: 'Visionary leader with 10+ years in tech innovation.',
   linkedin: '#',
   twitter: '#',
   email: 'john@debugtech.com',
  },
  {
   name: 'Jane Smith',
   role: 'CTO',
   image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
   bio: 'Full-stack architect passionate about scalable solutions.',
   linkedin: '#',
   twitter: '#',
   email: 'jane@debugtech.com',
  },
  {
   name: 'Mike Johnson',
   role: 'Head of Design',
   image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
   bio: 'Creative designer crafting beautiful user experiences.',
   linkedin: '#',
   twitter: '#',
   email: 'mike@debugtech.com',
  },
  {
   name: 'Sarah Williams',
   role: 'Marketing Director',
   image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
   bio: 'Digital marketing strategist driving brand growth.',
   linkedin: '#',
   twitter: '#',
   email: 'sarah@debugtech.com',
  },
 ];

 return (
  <section id="team" className="py-24 bg-navy">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
     {/* Header Block */}
     <div className="flex items-center justify-center gap-2 mb-4">
      <span className="h-px w-12 bg-teal opacity-50" />
      <span className="text-teal font-medium tracking-wider text-sm uppercase">Our Team</span>
      <span className="h-px w-12 bg-teal opacity-50" />
     </div>
     
     {/* Gradient Text Applied Here */}
     <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-lighter">
       Meet the Innovators
      </span>
     </h2>
     {/* End Gradient Text */}
     
     <p className="max-w-2xl mx-auto text-slate text-lg">
      A diverse team of experts passionate about technology and education.
     </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
     {team.map((member, idx) => (
      <CustomTeamCard key={idx} member={member} />
     ))}
    </div>
   </div>
  </section>
 );
}
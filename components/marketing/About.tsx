import Image from 'next/image';
import { TrendingUp, Globe, Target, Users } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Our Mission',
      description: 'To empower growth and sustainability through practical digital solutions.',
    },
    {
      icon: Globe,
      title: 'Our Vision',
      description: 'To be the leading technology and training hub in Africa.',
    },
    {
      icon: Target,
      title: 'Our Values',
      description: 'Innovation, Excellence, Integrity, and Customer Success.',
    },
    {
      icon: Users,
      title: 'Our Approach',
      description: 'Collaborative, transparent, and results-driven partnerships.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 rounded-lg overflow-hidden border-2 border-teal/20 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Team collaboration"
                width={800}
                height={600}
                className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-teal rounded-lg -z-0" />
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-12 bg-teal" />
              <span className="text-teal font-medium tracking-wider text-sm uppercase">About Us</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Modern Digital Solutions from Arusha to the World
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-slate">
              Founded in 2025, Debug Technologies is more than just a software company. We are a hub for innovation and education. Our mission is to bridge the gap between complex technology and everyday business needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-lg bg-navy-light border border-navy-lighter hover:border-teal/50 transition-colors group"
                >
                  <div className="p-2 bg-navy rounded-lg text-teal group-hover:bg-teal/10 transition-colors">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { ProjectsFilter } from '@/components/projects/ProjectsFilter';

export const metadata = {
  title: 'Our Projects | Debug Technologies',
  description: 'Explore our portfolio of successful digital projects across Tanzania and East Africa.',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-navy text-slate-custom">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-teal" />
              <span className="text-teal font-medium tracking-wider text-sm uppercase">Our Work</span>
              <span className="h-px w-12 bg-teal" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white-custom mb-6">
              Project Showcase
            </h1>
            <p className="text-xl text-slate-custom">
              Explore our portfolio of successful digital transformations helping businesses across East Africa grow and thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Filter & Grid */}
      <section className="py-16 bg-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsFilter />
          <ProjectsGrid />
        </div>
      </section>

      <Footer />
    </div>
  );
}
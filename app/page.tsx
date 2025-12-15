import { Navbar } from '@/components/shared/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { About } from '@/components/marketing/About';
import { Services } from '@/components/marketing/Services';
import { ProjectsPreview } from '@/components/marketing/ProjectsPreview';
import { Partners } from '@/components/marketing/Patners';
import { Team } from '@/components/marketing/Team';
import { Products } from '@/components/marketing/Products';
import { ContactForm } from '@/components/marketing/ContactForm';
import { Footer } from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy text-slate-custom">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <ProjectsPreview />
      <Partners />
      <Team />
      <Products />
      <ContactForm />
      <Footer />
    </div>
  );
}
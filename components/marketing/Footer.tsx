import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Laptop } from 'lucide-react';

export function Footer() {
 const currentYear = new Date().getFullYear();

 return (
  <footer className="bg-[#020c1b] py-12 border-t border-navy-light text-sm text-slate">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
     {/* 1. Brand Identity (Logo Image Only) and Socials */}
     <div className="col-span-1 md:col-span-2">
      {/* Logo Image Link - Maximum Display Size */}
      <Link href="/" className="flex items-center mb-6 group w-full"> 
       <Image
        src="/logo.png"
        alt="Debug Technologies Logo"
        // Maximizing dimensions for the best possible quality and size
        width={400} // Increased base width
        height={100} // Increased base height
        // Crucial fix: Using object-left to push it left, and setting height directly
                // to a large value (h-24 = 96px) to force it to take up more space.
        className="h-24 w-auto object-contain object-left transition-opacity group-hover:opacity-80" 
       />
      </Link>

      <p className="max-w-xs mb-6 leading-relaxed text-slate/80">
       Empowering Africa through innovative software, strategic branding, and digital training.
      </p>

      {/* Social Icons */}
      <div className="flex gap-4">
       <a href="#" className="text-slate hover:text-teal transition-colors" aria-label="Facebook">
        <Facebook size={20} />
       </a>
       <a href="#" className="text-slate hover:text-teal transition-colors" aria-label="Twitter">
        <Twitter size={20} />
       </a>
       <a href="#" className="text-slate hover:text-teal transition-colors" aria-label="Instagram">
        <Instagram size={20} />
       </a>
       <a href="#" className="text-slate hover:text-teal transition-colors" aria-label="LinkedIn">
        <Linkedin size={20} />
       </a>
      </div>
     </div>

     {/* 2. Services Links */}
     <div>
      <h4 className="text-white font-bold mb-4 border-b border-navy-light/50 pb-2">Services</h4>
      <ul className="space-y-3">
       <li>
        <Link href="#services" className="hover:text-teal transition-colors">
         Software Engineering
        </Link>
       </li>
       <li>
        <Link href="#services" className="hover:text-teal transition-colors">
         Digital Brand Growth
        </Link>
       </li>
       <li>
        <Link href="#services" className="hover:text-teal transition-colors">
         Creative Design & UX
        </Link>
       </li>
       <li>
        <Link href="#services" className="hover:text-teal transition-colors">
         Technology Education
        </Link>
       </li>
      </ul>
     </div>

     {/* 3. Company Links */}
     <div>
      <h4 className="text-white font-bold mb-4 border-b border-navy-light/50 pb-2">Company</h4>
      <ul className="space-y-3">
       <li>
        <Link href="#about" className="hover:text-teal transition-colors">
         About Us
        </Link>
       </li>
       <li>
        <Link href="#team" className="hover:text-teal transition-colors">
         Our Team
        </Link>
       </li>
       <li>
        <Link href="#" className="hover:text-teal transition-colors">
         Careers
        </Link>
       </li>
       <li>
        <Link href="#contact" className="hover:text-teal transition-colors">
         Contact
        </Link>
       </li>
      </ul>
     </div>
    </div>

    {/* Bottom Bar */}
    <div className="pt-8 border-t border-navy-light flex flex-col md:flex-row justify-between items-center gap-4 text-slate-custom">
     <p>&copy; {currentYear} Debug Technologies. All Rights Reserved.</p>
     <p className="flex items-center gap-2">
      Designed & Built in Arusha <Laptop size={14} className="text-teal" />
     </p>
    </div>
   </div>
  </footer>
 );
}
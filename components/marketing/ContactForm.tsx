"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, Link, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Assuming you have a Google Maps Embed component or similar:
const MapPlaceholder = () => (
  <div className="relative h-96 lg:h-full w-full bg-navy-lighter rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none overflow-hidden">
    {/* Abstract Map/Visual Placeholder (Replace with actual map embed if available) */}
    <div className="absolute inset-0 bg-gradient-to-br from-navy-lighter to-navy-dark opacity-90" />
    <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

    {/* Central Pin Icon */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal animate-pulse">
      <Globe className="w-16 h-16 opacity-70" />
    </div>

    {/* Location Text Overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-navy/70 backdrop-blur-sm">
      <h3 className="text-white text-xl font-bold">Arusha, Tanzania</h3>
      <p className="text-sm text-slate-lighter">
        Innovation Hub for East Africa
      </p>
    </div>
  </div>
);

export function ContactForm() {
  // const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Logic commented out as in original
  };

  return (
    <section id="contact" className="py-24 bg-navy-light">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="text-center mb-16">
          {" "}
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-light">
              Let's Build Something Great{" "}
            </span>{" "}
          </h2>{" "}
          <p className="max-w-xl mx-auto text-slate-lighter text-lg">
            Ready to start your digital transformation? Fill out the form or
            reach out directly.{" "}
          </p>{" "}
        </div>
        {/* Main Container: Form on Right, Map/Info on Left */}{" "}
        <div
          className="
            grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[1.5fr_1fr] gap-0 
            bg-navy rounded-2xl shadow-2xl overflow-hidden
        "
        >
          {/* Column 1: Map/Visual and Contact Info */}
          <div className="lg:col-span-1 flex flex-col">
            {/* <MapPlaceholder /> */}

            {/* Contact Details Integrated (Now smaller, simpler cards) */}
            <div className="p-8 space-y-6 bg-navy-dark">
              {/* Location */}
              <ContactInfoCard
                icon={MapPin}
                title="Our Location"
                value="Arusha, Tanzania"
                details="Serving East Africa"
                link=""
              />

              {/* Phone */}
              <ContactInfoCard
                icon={Phone}
                title="Phone Support"
                value="+255 683 141 947"
                details="Mon-Fri, 9am - 5pm EAT"
                link="tel:+255683141947"
              />

              {/* Email */}
              <ContactInfoCard
                icon={Mail}
                title="Email Us"
                value="jonas27@gmail.com"
                details="We respond within 24 hours"
                link="mailto:jonas27@gmail.com"
              />
            </div>
          </div>
          {/* Column 2: Contact Form (Sleek, refined) */}{" "}
          <div className="lg:col-span-2 xl:col-span-1 p-8 md:p-12">
            {" "}
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-navy-lighter/30 pb-3">
              Send us a message
            </h3>{" "}
            <form onSubmit={handleSubmit} className="space-y-6">
              {" "}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {" "}
                <InputField
                  id="firstName"
                  label="First Name"
                  placeholder="John"
                  formData={formData}
                  setFormData={setFormData}
                  required
                />{" "}
                <InputField
                  id="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  formData={formData}
                  setFormData={setFormData}
                  required
                />{" "}
              </div>{" "}
              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                formData={formData}
                setFormData={setFormData}
                required
              />{" "}
              <div className="space-y-2">
                {" "}
                <Label
                  htmlFor="message"
                  className="text-white-custom font-medium"
                >
                  Project Details{" "}
                </Label>{" "}
                <Textarea
                  id="message"
                  placeholder="Tell us about your project, budget, and timeline..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="min-h-[120px] bg-navy-light/50 border-navy-lighter/50 focus:border-teal text-white-custom transition-colors"
                />{" "}
              </div>{" "}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base bg-teal text-navy hover:bg-teal-dark font-bold transition-all transform hover:scale-[1.005]"
              >
                {" "}
                {loading ? "Sending..." : "Start the Conversation"}
                <Send className="ml-2 h-4 w-4" />{" "}
              </Button>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}

// --- Helper Components for Cleanliness ---

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  formData: any;
  setFormData: (data: any) => void;
  type?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder,
  formData,
  setFormData,
  type = "text",
  required = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-white-custom font-medium">
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={formData[id]}
      onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
      required={required}
      // Sleek input styling: subtle BG, focus border on teal
      className="bg-navy-light/50 border-navy-lighter/50 focus:border-teal text-white-custom transition-colors placeholder:text-slate-custom"
    />
  </div>
);

interface ContactInfoCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  details: string;
  link: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  icon: Icon,
  title,
  value,
  details,
  link,
}) => (
  <a
    href={link || undefined}
    target={link ? "_blank" : undefined}
    rel={link ? "noopener noreferrer" : undefined}
    className="flex items-start gap-4 p-4 rounded-lg border border-slate hover:border-teal transition-colors group cursor-pointer"
  >
    <div className="p-3 bg-navy rounded-lg text-teal border border-navy-lighter group-hover:bg-teal/10 transition-colors flex-shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-white font-semibold text-base mb-0.5">{title}</h4>
      <p className="text-slate-lighter font-medium">{value}</p>
      <p className="text-xs text-slate-custom mt-0.5">{details}</p>
    </div>
  </a>
);

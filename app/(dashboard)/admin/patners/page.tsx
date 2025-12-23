"use client"

import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Globe, 
  Mail, 
  MapPin, 
  Building2,
  ShieldCheck,
  Clock,
  Ban,
  Signal,
  LayoutGrid,
  List as ListIcon,
  Filter,
  ArrowUpRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress"; 
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Interfaces ---
interface Partner {
  id: number;
  name: string;
  tier: 'Gold' | 'Silver' | 'Bronze' | 'Integration';
  type: 'Technology' | 'Reseller' | 'Consulting';
  contactName: string;
  contactEmail: string;
  website: string;
  status: 'Active' | 'Pending Review' | 'Inactive';
  city: string;
  health: number; // 0-100 score for partnership health
}

// --- Mock Data ---
const initialPartners: Partner[] = [
  { id: 1, name: "Nebula Systems", tier: "Gold", type: "Technology", contactName: "Sarah Chen", contactEmail: "sarah@nebula.io", website: "https://nebula.io", status: "Active", city: "San Francisco", health: 92 },
  { id: 2, name: "Vertex Consulting", tier: "Silver", type: "Consulting", contactName: "Marcus Thorne", contactEmail: "m.thorne@vertex.com", website: "https://vertex.com", status: "Active", city: "London", health: 78 },
  { id: 3, name: "Quantum Resell", tier: "Bronze", type: "Reseller", contactName: "Jessica Alverez", contactEmail: "jess@quantum.net", website: "https://quantum.net", status: "Pending Review", city: "Austin", health: 45 },
  { id: 4, name: "Flow Integrations", tier: "Integration", type: "Technology", contactName: "David Kim", contactEmail: "dkim@flow.dev", website: "https://flow.dev", status: "Active", city: "Seoul", health: 88 },
  { id: 5, name: "Nordic Gate", tier: "Silver", type: "Reseller", contactName: "Elsa Vinter", contactEmail: "elsa@nordic.eu", website: "https://nordic.eu", status: "Inactive", city: "Stockholm", health: 12 },
  { id: 6, name: "Atlas Cloud", tier: "Gold", type: "Technology", contactName: "Raj Patel", contactEmail: "raj@atlas.cloud", website: "https://atlas.cloud", status: "Active", city: "Mumbai", health: 96 },
];

const newPartnerTemplate: Partner = {
  id: 0, name: "", tier: "Bronze", type: "Technology", contactName: "", contactEmail: "", website: "", status: "Pending Review", city: "", health: 50
};

// --- Helper Components ---

const TierBadge = ({ tier }: { tier: Partner['tier'] }) => {
  // Keeping specific tier colors for visual distinction (Gold/Bronze)
  // Silver/Integration use neutral slate tones
  const styles = {
    'Gold': "bg-amber-100 text-amber-700 border-amber-200",
    'Silver': "bg-slate-100 text-slate-700 border-slate-200",
    'Bronze': "bg-orange-100 text-orange-700 border-orange-200",
    'Integration': "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider ${styles[tier]}`}>
      {tier}
    </span>
  );
};

const StatusDot = ({ status }: { status: Partner['status'] }) => {
  const colors = {
    'Active': "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
    'Pending Review': "bg-amber-500",
    'Inactive': "bg-slate-400", // Using slate for Inactive status
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
      <span className="text-xs text-slate-500 font-medium">{status}</span>
    </div>
  );
};

const PartnerLogo = ({ name }: { name: string }) => {
  const initials = name.substring(0, 2).toUpperCase();
  // Using the dashboard's preferred color for gradients/accents (teal/slate)
  const gradients = [
    "from-slate-600 to-gray-600", 
    "from-teal-500 to-teal-600", // Using the prominent teal from the dashboard
    "from-blue-600 to-cyan-500",
    "from-pink-600 to-rose-500",
    "from-amber-500 to-orange-600"
  ];
  const idx = name.length % gradients.length;
  
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[idx]} flex items-center justify-center shadow-lg shadow-gray-200 text-white font-bold text-lg`}>
      {initials}
    </div>
  );
};

export default function PartnerEcosystem() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentPartner, setCurrentPartner] = useState<Partner>(newPartnerTemplate);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.contactName.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "All" || p.status === activeTab || p.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [partners, search, activeTab]);

  const handleSave = () => {
    if (modalType === 'create') {
      setPartners([...partners, { ...currentPartner, id: Date.now() }]);
    } else {
      setPartners(partners.map(p => p.id === currentPartner.id ? currentPartner : p));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  const openModal = (type: 'create' | 'edit', partner?: Partner) => {
    setModalType(type);
    setCurrentPartner(partner ? { ...partner } : { ...newPartnerTemplate });
    setIsModalOpen(true);
  };

  return (
    // Background and base text matched to dashboard: bg-slate-50/50 and text-slate-900
    <div className="min-h-screen bg-slate-50/50 text-slate-900 p-6 lg:p-10 font-sans selection:bg-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Partner Ecosystem</h1>
            <p className="text-slate-500 max-w-lg">
              Monitor partnership health, manage integration tiers, and track reseller performance across the global network.
            </p>
          </div>
          <div className="flex gap-3">
             <Button 
               variant="outline" 
               // Buttons match dashboard style: white BG, slate border, slate text
               className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
             >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Export
             </Button>
            <Button 
              onClick={() => openModal('create')} 
              // Primary button is dark slate/black, matching the dashboard's "View All" button style
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Partner
            </Button>
          </div>
        </div>

        {/* --- Stats Overview --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Active Partners", val: partners.filter(p => p.status === 'Active').length, icon: Building2, color: "text-emerald-500" },
            { label: "Pending Review", val: partners.filter(p => p.status === 'Pending Review').length, icon: Clock, color: "text-amber-500" },
            { label: "Gold Tier", val: partners.filter(p => p.tier === 'Gold').length, icon: ShieldCheck, color: "text-amber-500" },
            { label: "Avg Health", val: "84%", icon: Signal, color: "text-slate-900" }, 
          ].map((stat, i) => (
            // Card style matched to dashboard: shadow-sm, border-slate-200, bg-white
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-card-white-bg shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
              </div>
              {/* Icon container matches dashboard's neutral bg-teal-100 */}
              <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* --- Controls Bar --- */}
        {/* Match dashboard controls bar style: light gray background with border */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-lg border border-slate-200">
           <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-50 border border-slate-200 p-1 h-9">
              {['All', 'Active', 'Pending Review', 'Technology', 'Reseller'].map(tab => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  // Tabs match dashboard style: white BG when active, dark text, light slate for hover/inactive
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-500 hover:text-slate-700 h-7 px-3 text-xs"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // Input matches dashboard style: white BG, slate border, slate ring/focus
                className="pl-9 h-9 bg-white border-slate-200 focus-visible:ring-slate-300 focus:border-slate-500 text-sm text-slate-900"
              />
            </div>
            
            <div className="flex items-center bg-white rounded-md border border-slate-200 p-0.5">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setViewMode('grid')}
                className={`h-7 w-7 p-0 rounded-sm ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setViewMode('list')}
                className={`h-7 w-7 p-0 rounded-sm ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* --- Grid View --- */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <div 
                key={partner.id} 
                // Card style matched: shadow-sm, border-slate-200, bg-white
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-card-white-bg p-6 shadow-sm hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <PartnerLogo name={partner.name} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700 -mr-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      {/* Dropdown menu background and border match dashboard */}
                      <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700">
                        <DropdownMenuItem onClick={() => openModal('edit', partner)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => handleDelete(partner.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">{partner.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <TierBadge tier={partner.tier} />
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{partner.type}</span>
                    </div>
                  </div>

                  {/* Health Bar Section */}
                  <div className="space-y-1.5 mb-6">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      <span>Partnership Health</span>
                      <span className={partner.health > 80 ? 'text-emerald-600' : partner.health > 50 ? 'text-amber-600' : 'text-red-600'}>
                        {partner.health}%
                      </span>
                    </div>
                    {/* Progress bar background matches dashboard's general light gray/slate */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${partner.health > 80 ? 'bg-emerald-500' : partner.health > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${partner.health}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 mb-0.5">Primary Contact</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-700">{partner.contactName}</span>
                    </div>
                  </div>
                  <StatusDot status={partner.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- List View (Alternative) --- */
          // Table container match dashboard style: shadow-sm, border-slate-200, bg-white
          <div className="rounded-xl border border-slate-200 bg-card-white-bg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
               <div className="col-span-4">Organization</div>
               <div className="col-span-2">Status</div>
               <div className="col-span-2">Health</div>
               <div className="col-span-3">Contact</div>
               <div className="col-span-1"></div>
            </div>
            <div className="divide-y divide-slate-200">
              {filteredPartners.map(partner => (
                <div key={partner.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                     {/* Avatar/Initial style matches dashboard */}
                     <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                        {partner.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                       <p className="font-medium text-slate-900 text-sm">{partner.name}</p>
                       <p className="text-xs text-slate-500">{partner.type} • {partner.tier}</p>
                     </div>
                  </div>
                  <div className="col-span-2">
                    <StatusDot status={partner.status} />
                  </div>
                  <div className="col-span-2 pr-6">
                    <div className="flex items-center gap-2">
                       {/* Health bar uses neutral slate-500 for the fill */}
                       <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500" style={{ width: `${partner.health}%` }}></div>
                       </div>
                       <span className="text-xs text-slate-600">{partner.health}%</span>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-slate-700">{partner.contactName}</p>
                    <p className="text-xs text-slate-500">{partner.contactEmail}</p>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => openModal('edit', partner)}>
                       <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Add/Edit Modal --- */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          {/* Modal content matches dashboard style: white BG, slate border, slate text */}
          <DialogContent className="bg-white border-slate-300 text-slate-900 sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{modalType === 'create' ? 'Onboard Partner' : 'Edit Partner Details'}</DialogTitle>
              <DialogDescription className="text-slate-500">
                Manage ecosystem configuration and contact details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label className="text-slate-600">Organization Name</Label>
                  <Input 
                    value={currentPartner.name}
                    onChange={e => setCurrentPartner({...currentPartner, name: e.target.value})}
                    // Input styles match dashboard inputs
                    className="bg-slate-50 border-slate-300 focus:border-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-600">Tier</Label>
                  {/* Select styles match dashboard inputs */}
                  <select 
                    className="flex h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 text-slate-900"
                    value={currentPartner.tier}
                    onChange={e => setCurrentPartner({...currentPartner, tier: e.target.value as any})}
                  >
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Integration">Integration</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600">Type</Label>
                  {/* Select styles match dashboard inputs */}
                  <select 
                    className="flex h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 text-slate-900"
                    value={currentPartner.type}
                    onChange={e => setCurrentPartner({...currentPartner, type: e.target.value as any})}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Reseller">Reseller</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600">Contact Person</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Full Name"
                    value={currentPartner.contactName}
                    onChange={e => setCurrentPartner({...currentPartner, contactName: e.target.value})}
                    className="bg-slate-50 border-slate-300 focus:border-slate-500"
                  />
                  <Input 
                    placeholder="Email Address"
                    value={currentPartner.contactEmail}
                    onChange={e => setCurrentPartner({...currentPartner, contactEmail: e.target.value})}
                    className="bg-slate-50 border-slate-300 focus:border-slate-500"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
               {/* Ghost button matches dashboard style */}
               <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">Cancel</Button>
               {/* Primary button matches dashboard style */}
               <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white">
                 {modalType === 'create' ? 'Onboard Partner' : 'Save Changes'}
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
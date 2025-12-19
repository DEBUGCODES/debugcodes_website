"use client"

import { useState, useMemo, useCallback } from 'react';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Briefcase, // Main partner icon
  Mail, // Contact icon
  Users, // Tier icon
  Link, // Website icon
  MapPin, // Location icon
  CheckCircle, // Status live
  AlertTriangle, // Status pending
  X,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- Partner Interface ---
interface Partner {
  id: number;
  name: string;
  tier: 'Gold' | 'Silver' | 'Bronze' | 'Integration';
  type: 'Technology' | 'Reseller' | 'Consulting';
  contactName: string;
  contactEmail: string;
  website: string;
  status: 'Active' | 'Pending Review' | 'Inactive';
  city: string; // To show geographical reach
}

type ModalType = 'view' | 'edit' | 'delete' | 'create';

// --- Sample Data (Strategic tech/service partners) ---
const initialPartners: Partner[] = [
  { id: 301, name: "Global Cloud Solutions", tier: "Gold", type: "Technology", contactName: "Alice Johnson", contactEmail: "alice@globalcloud.com", website: "https://globalcloud.com", status: "Active", city: "New York" },
  { id: 302, name: "Apex Integrators", tier: "Silver", type: "Consulting", contactName: "Bob Smith", contactEmail: "bob@apexint.com", website: "https://apexint.co", status: "Active", city: "London" },
  { id: 303, name: "DataStream Resellers", tier: "Bronze", type: "Reseller", contactName: "Cathy Lee", contactEmail: "cathy@datastream.net", website: "https://datastream.net", status: "Pending Review", city: "San Francisco" },
  { id: 304, name: "API Hub Connect", tier: "Integration", type: "Technology", contactName: "David Kim", contactEmail: "david@apihub.io", website: "https://apihub.io", status: "Active", city: "Seattle" },
];

const newPartnerTemplate: Partner = {
  id: 0, 
  name: "", 
  tier: "Bronze", 
  type: "Technology", 
  contactName: "", 
  contactEmail: "", 
  website: "", 
  status: "Pending Review",
  city: "",
};

const ITEMS_PER_PAGE = 5;

// Helper for tier colors
const getTierBadge = (tier: Partner['tier']) => {
  switch (tier) {
    case 'Gold': return "bg-yellow-500/20 text-yellow-700 border-yellow-200";
    case 'Silver': return "bg-gray-400/20 text-gray-700 border-gray-300";
    case 'Bronze': return "bg-orange-500/20 text-orange-700 border-orange-200";
    case 'Integration': return "bg-purple-500/20 text-purple-700 border-purple-200";
  }
};

// Helper for status colors
const getStatusBadge = (status: Partner['status']) => {
  switch (status) {
    case 'Active': return "bg-green-500/20 text-green-700 border-green-200";
    case 'Pending Review': return "bg-blue-500/20 text-blue-700 border-blue-200";
    case 'Inactive': return "bg-red-500/20 text-red-700 border-red-200";
  }
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('create');
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const openModal = useCallback((type: ModalType, partner?: Partner) => {
    setModalType(type);
    setCurrentPartner(partner || newPartnerTemplate);
    setIsModalOpen(true);
  }, []);

  const filteredPartners = useMemo(() => {
    return partners.filter(partner =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.tier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partners, searchTerm]);

  const totalPages = Math.ceil(filteredPartners.length / ITEMS_PER_PAGE);
  const paginatedPartners = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPartners.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPartners, currentPage]);

  const handleCreateOrUpdate = async () => {
    if (!currentPartner || !currentPartner.name || !currentPartner.contactEmail) {
        alert("Partner Name and Contact Email are required.");
        return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

    if (modalType === 'create') {
      const newId = Math.max(...partners.map(p => p.id), 0) + 1;
      setPartners([...partners, { ...currentPartner, id: newId }]);
    } else if (modalType === 'edit') {
      setPartners(partners.map(p => p.id === currentPartner.id ? currentPartner : p));
    }

    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!currentPartner) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    
    setPartners(partners.filter(p => p.id !== currentPartner.id));

    setIsSaving(false);
    setIsModalOpen(false);
  };

  const renderModalContent = () => {
    if (!currentPartner) return null;
    
    const isEdit = modalType === 'edit';
    const isDelete = modalType === 'delete';
    
    // --- DELETE MODAL ---
    if (isDelete) {
      return (
        <DialogContent className="sm:max-w-md bg-card-white-bg border-0 shadow-2xl">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
              Remove Partner?
            </DialogTitle>
            <DialogDescription className="text-gray-500 mb-6">
              You are about to remove <span className="font-semibold text-gray-700">{currentPartner.name}</span> from the partner list. Confirm to proceed.
            </DialogDescription>
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 border-gray-200 hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete} 
                disabled={isSaving}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isSaving ? "Removing..." : "Remove Partner"}
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    }
    
    // --- CREATE/EDIT MODAL ---
    return (
      <DialogContent className="sm:max-w-2xl bg-card-white-bg border-0 shadow-2xl">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-teal-600" />
            </div>
            {isEdit ? 'Edit Partner Details' : 'Add New Partner'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isEdit ? `Updating information for: ${currentPartner.name}` : 'Enter the core details for your new strategic partner.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-6 max-h-[60vh] overflow-y-auto pr-2">
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Partner Organization Name *
            </Label>
            <Input
              id="name"
              placeholder="E.g., GlobalTech Consulting"
              value={currentPartner.name}
              onChange={(e) => setCurrentPartner({...currentPartner, name: e.target.value})}
              className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Tier Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="tier" className="text-sm font-medium text-gray-700">Partner Tier</Label>
              <select
                id="tier"
                value={currentPartner.tier}
                onChange={(e) => setCurrentPartner({...currentPartner, tier: e.target.value as Partner['tier']})}
                className="w-full h-11 p-2 bg-gray-50 border border-gray-200 rounded-md focus:border-teal-500 focus:ring-teal-500 text-gray-800"
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Integration">Integration</option>
              </select>
            </div>

            {/* Type Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Partnership Type</Label>
              <select
                id="type"
                value={currentPartner.type}
                onChange={(e) => setCurrentPartner({...currentPartner, type: e.target.value as Partner['type']})}
                className="w-full h-11 p-2 bg-gray-50 border border-gray-200 rounded-md focus:border-teal-500 focus:ring-teal-500 text-gray-800"
              >
                <option value="Technology">Technology</option>
                <option value="Reseller">Reseller</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Contact Name */}
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-sm font-medium text-gray-700">Primary Contact Name</Label>
              <Input
                id="contactName"
                placeholder="E.g., Jane Doe"
                value={currentPartner.contactName}
                onChange={(e) => setCurrentPartner({...currentPartner, contactName: e.target.value})}
                className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="email@partner.com"
                value={currentPartner.contactEmail}
                onChange={(e) => setCurrentPartner({...currentPartner, contactEmail: e.target.value})}
                className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website URL</Label>
              <Input
                id="website"
                placeholder="https://partner.com"
                value={currentPartner.website}
                onChange={(e) => setCurrentPartner({...currentPartner, website: e.target.value})}
                className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            
            {/* City/Location */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">Primary Location (City)</Label>
              <Input
                id="city"
                placeholder="E.g., Dublin"
                value={currentPartner.city}
                onChange={(e) => setCurrentPartner({...currentPartner, city: e.target.value})}
                className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
          
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Partner Status 
              </Label>
              <p className="text-xs text-gray-500">Set the current operational status of this partnership.</p>
            </div>
            <select
                id="status"
                value={currentPartner.status}
                onChange={(e) => setCurrentPartner({...currentPartner, status: e.target.value as Partner['status']})}
                className="h-11 p-2 bg-white border border-gray-200 rounded-md focus:border-teal-500 focus:ring-teal-500 text-gray-800 shadow-sm"
              >
                <option value="Active">Active</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>
        
        <DialogFooter className="pt-6 border-t gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsModalOpen(false)} 
            className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateOrUpdate} 
            disabled={isSaving}
            className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Add Partner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Partner Network Management</h1>
            <p className="text-gray-500">Monitor and update all strategic alliances and partnerships</p>
          </div>
          <Button 
            onClick={() => openModal('create')} 
            className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-6 shadow-lg shadow-teal-600/30"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Partner
          </Button>
        </div>

        {/* Partner Stats / Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card-bg border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Total Partners</p>
                  <p className="text-3xl font-bold text-gray-100">{partners.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#fff] flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card-white-bg border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Gold Tier</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {partners.filter(p => p.tier === 'Gold').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center">
                  <Users className="h-6 w-6 text-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card-bg border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Technology Partners</p>
                  <p className="text-3xl font-bold text-gray-100">
                    {partners.filter(p => p.type === 'Technology').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#fff] flex items-center justify-center">
                  <Link className="h-6 w-6 text-teal" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-white-bg border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {partners.filter(p => p.status === 'Pending Review').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card: List View for Management */}
        <Card className="bg-card-white-bg border-gray-200 shadow-lg">
          <CardHeader className="border-b pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Partner List</CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search by name or contact..." 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {paginatedPartners.map((partner) => (
                <div 
                  key={partner.id} 
                  className="p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-md">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                            {partner.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            Primary Contact: <span className="font-medium">{partner.contactName}</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge 
                            className={`${getTierBadge(partner.tier)} border`}
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {partner.tier}
                          </Badge>
                          <Badge 
                            className={`${getStatusBadge(partner.status)} border`}
                          >
                            {partner.status === 'Active' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                            {partner.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5 font-medium text-gray-800">
                                <Mail className="h-4 w-4 text-teal-600" />
                                {partner.contactEmail}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <MapPin className="h-3.5 w-3.5" />
                                {partner.city || 'Location N/A'}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Link className="h-3.5 w-3.5" />
                                Type: {partner.type}
                            </span>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal('edit', partner)}
                            className="h-8 px-3 hover:bg-teal-50 hover:text-teal-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal('delete', partner)}
                            className="h-8 px-3 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPartners.length === 0 && (
              <div className="p-16 text-center">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No partners found</p>
                <p className="text-gray-400 text-sm mt-1">Start building your strategic partner network</p>
              </div>
            )}
          </CardContent>
          
          {/* Pagination */}
          {filteredPartners.length > 0 && (
            <div className="border-t p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
                <span className="font-medium text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredPartners.length)}</span> of{' '}
                <span className="font-medium text-gray-700">{filteredPartners.length}</span> partners
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0 border-gray-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 p-0 ${
                        currentPage === page 
                          ? "bg-teal-600 hover:bg-teal-700 text-white" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0 border-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {renderModalContent()}
      </Dialog>
    </div>
  );
}
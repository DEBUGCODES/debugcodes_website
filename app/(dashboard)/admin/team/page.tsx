"use client"

import { useState, useMemo, useCallback } from 'react';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Calendar,
  Briefcase,
  X,
  Check,
  AlertCircle
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

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinedDate: string;
  active: boolean;
  bio: string;
}

type ModalType = 'view' | 'edit' | 'delete' | 'create';

const initialTeamMembers: TeamMember[] = [
  { id: 1, name: "Liam Johnson", role: "Frontend Lead", email: "liam.j@acme.com", status: "Active", joinedDate: "2020-05-15", active: true, bio: "Oversees UI/UX development and team collaboration." },
  { id: 2, name: "Olivia Smith", role: "Backend Developer", email: "olivia.s@acme.com", status: "Active", joinedDate: "2021-11-01", active: true, bio: "Manages server-side logic and database integration." },
  { id: 3, name: "Noah Williams", role: "DevOps Engineer", email: "noah.w@acme.com", status: "On Leave", joinedDate: "2019-03-20", active: false, bio: "Handles continuous integration and deployment pipelines." },
  { id: 4, name: "Emma Brown", role: "Product Manager", email: "emma.b@acme.com", status: "Active", joinedDate: "2022-08-10", active: true, bio: "Defines product vision and roadmaps." },
  { id: 5, name: "Mason Davis", role: "UX Designer", email: "mason.d@acme.com", status: "Terminated", joinedDate: "2023-01-05", active: false, bio: "Focuses on user research and design wireframes." },
  { id: 6, name: "Sophia Martinez", role: "QA Engineer", email: "sophia.m@acme.com", status: "Active", joinedDate: "2021-07-12", active: true, bio: "Ensures product quality through rigorous testing." },
  { id: 7, name: "James Wilson", role: "Security Analyst", email: "james.w@acme.com", status: "Active", joinedDate: "2020-09-30", active: true, bio: "Monitors and improves system security." },
  { id: 8, name: "Isabella Garcia", role: "Data Scientist", email: "isabella.g@acme.com", status: "On Leave", joinedDate: "2022-03-18", active: false, bio: "Analyzes data to drive business decisions." },
];

const newMemberTemplate: TeamMember = {
  id: 0, 
  name: "", 
  role: "", 
  email: "", 
  status: "Active", 
  joinedDate: new Date().toISOString().split('T')[0], 
  active: true,
  bio: "",
};

const ITEMS_PER_PAGE = 5;

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('view');
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const openModal = useCallback((type: ModalType, member?: TeamMember) => {
    setModalType(type);
    setCurrentMember(member || newMemberTemplate);
    setIsModalOpen(true);
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const handleCreateOrUpdate = async () => {
    if (!currentMember) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (modalType === 'create') {
      const newId = Math.max(...members.map(m => m.id), 0) + 1;
      setMembers([...members, { ...currentMember, id: newId }]);
    } else if (modalType === 'edit') {
      setMembers(members.map(m => m.id === currentMember.id ? currentMember : m));
    }

    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!currentMember) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setMembers(members.filter(m => m.id !== currentMember.id));

    setIsSaving(false);
    setIsModalOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderModalContent = () => {
    if (!currentMember) return null;
    
    const isEdit = modalType === 'edit';
    const isView = modalType === 'view';
    const isDelete = modalType === 'delete';
    
    if (isDelete) {
      return (
        <DialogContent className="sm:max-w-md bg-card-white-bg border-0 shadow-2xl">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
              Delete Team Member?
            </DialogTitle>
            <DialogDescription className="text-gray-500 mb-6">
              You're about to permanently delete <span className="font-semibold text-gray-700">{currentMember.name}</span>. This action cannot be undone.
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
                {isSaving ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    }
    
    if (isView) {
      return (
        <DialogContent className="sm:max-w-2xl bg-card-white-bg border-0 shadow-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 px-8 py-12 relative">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-card-white-bg/20"
            >
              <X className="h-5 w-5" />
            </Button> */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-card-white-bg/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
                {getInitials(currentMember.name)}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{currentMember.name}</h2>
                <div className="flex items-center gap-2 text-white/90">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-lg">{currentMember.role}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </div>
                <p className="text-gray-800 font-medium pl-6">{currentMember.email}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>Joined Date</span>
                </div>
                <p className="text-gray-800 font-medium pl-6">
                  {new Date(currentMember.joinedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <Users className="h-4 w-4" />
                <span>Status</span>
              </div>
              <div className="pl-6">
                <Badge 
                  className={
                    currentMember.status === 'Active' 
                      ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 px-4 py-1" 
                      : currentMember.status === 'On Leave' 
                      ? "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 px-4 py-1" 
                      : "bg-red-500/20 text-red-700 hover:bg-red-500/30 px-4 py-1"
                  }
                >
                  {currentMember.status}
                </Badge>
              </div>
            </div>

            {currentMember.bio && (
              <div className="space-y-2">
                <div className="text-gray-500 text-sm font-medium">Bio</div>
                <p className="text-gray-700 leading-relaxed pl-0 bg-gray-50 p-4 rounded-lg">
                  {currentMember.bio}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => openModal('edit', currentMember)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Member
              </Button>
              <Button 
                onClick={() => openModal('delete', currentMember)}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    }
    
    return (
      <DialogContent className="sm:max-w-xl bg-card-white-bg border-0 shadow-2xl">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {isEdit ? (
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <Edit className="h-5 w-5 text-teal-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-teal-600" />
              </div>
            )}
            {isEdit ? 'Edit Team Member' : 'Add New Team Member'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isEdit ? 'Update the information below to modify this team member.' : 'Fill in the details to add a new member to your team.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-6 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={currentMember.name}
              onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})}
              className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role / Position *
            </Label>
            <Input
              id="role"
              placeholder="Software Engineer"
              value={currentMember.role}
              onChange={(e) => setCurrentMember({...currentMember, role: e.target.value})}
              className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={currentMember.email}
              onChange={(e) => setCurrentMember({...currentMember, email: e.target.value})}
              className="h-11 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio / Description
            </Label>
            <textarea
              id="bio"
              placeholder="Brief description about this team member..."
              value={currentMember.bio}
              onChange={(e) => setCurrentMember({...currentMember, bio: e.target.value})}
              className="w-full min-h-[100px] p-3 bg-gray-50 border border-gray-200 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none text-gray-800"
            />
          </div>

          {isEdit && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-700">Active Status</Label>
                <p className="text-xs text-gray-500">Toggle member's active status</p>
              </div>
              <Button
                type="button"
                onClick={() => setCurrentMember({...currentMember, active: !currentMember.active})}
                className={`${currentMember.active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-500'} text-white transition-all`}
                disabled={isSaving}
              >
                {currentMember.active ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                {currentMember.active ? "Active" : "Inactive"}
              </Button>
            </div>
          )}
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
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Member"}
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Team Management</h1>
            <p className="text-gray-500">Manage your team members and their roles</p>
          </div>
          <Button 
            onClick={() => openModal('create')} 
            className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-6 shadow-lg shadow-teal-600/30"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card-bg border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">Total Members</p>
                  <p className="text-2xl font-bold text-gray-100">{members.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#fff] flex items-center justify-center">
                  <Users className="h-6 w-6 text-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card-white-bg border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {members.filter(m => m.status === 'Active').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center">
                  <Check className="h-6 w-6 text-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card-bg border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">On Leave</p>
                  <p className="text-3xl font-bold text-gray-100">
                    {members.filter(m => m.status === 'On Leave').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#fff] flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-card-white-bg border-gray-200 shadow-lg">
          <CardHeader className="border-b pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Team Members</CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search members..." 
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
              {paginatedMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-md">
                      {getInitials(member.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                            {member.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="h-4 w-4" />
                              <span>{member.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge 
                            className={
                              member.status === 'Active' 
                                ? "bg-green-500/20 text-green-700 border-green-200 border" 
                                : member.status === 'On Leave' 
                                ? "bg-yellow-500/20 text-yellow-700 border-yellow-200 border" 
                                : "bg-red-500/20 text-red-700 border-red-200 border"
                            }
                          >
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal('view', member)}
                            className="h-8 px-3 hover:bg-teal-50 hover:text-teal-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal('edit', member)}
                            className="h-8 px-3 hover:bg-teal-50 hover:text-teal-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openModal('delete', member)}
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
            
            {filteredMembers.length === 0 && (
              <div className="p-16 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No team members found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
              </div>
            )}
          </CardContent>
          
          {filteredMembers.length > 0 && (
            <div className="border-t p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
                <span className="font-medium text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)}</span> of{' '}
                <span className="font-medium text-gray-700">{filteredMembers.length}</span> members
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
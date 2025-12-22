"use client"

import { useState, useMemo, useCallback } from 'react';
import { 
  Plus, 
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
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- Types & Initial Data ---
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
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API

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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // --- Modal Content Renderer ---
  const renderModalContent = () => {
    if (!currentMember) return null;
    
    if (modalType === 'delete') {
      return (
        <DialogContent className="sm:max-w-md border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Delete Team Member
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              This action cannot be undone. This will permanently delete 
              <span className="font-semibold text-slate-900"> {currentMember.name} </span>
              from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSaving ? "Deleting..." : "Delete Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      );
    }
    
    if (modalType === 'view') {
      return (
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
           {/* Profile Header Background */}
           <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-32 relative">
             <Button 
               variant="ghost" 
               size="icon" 
               className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-white/20"
               onClick={() => setIsModalOpen(false)}
             >
               <X className="w-5 h-5" />
             </Button>
           </div>
           
           <div className="px-6 pb-6 relative">
             {/* Avatar Overlay */}
             <div className="-mt-12 mb-4">
               <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md">
                 <span className="text-3xl font-bold text-teal-700">{getInitials(currentMember.name)}</span>
               </div>
             </div>

             <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{currentMember.name}</h2>
                  <p className="text-slate-500 font-medium flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {currentMember.role}
                  </p>
                </div>
                <Badge className={
                  currentMember.status === 'Active' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                  currentMember.status === 'On Leave' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                  "bg-slate-100 text-slate-700 hover:bg-slate-100"
                }>
                  {currentMember.status}
                </Badge>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 uppercase tracking-wide">Email</Label>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Mail className="w-4 h-4 text-teal-600" /> {currentMember.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 uppercase tracking-wide">Joined Date</Label>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-teal-600" /> 
                    {new Date(currentMember.joinedDate).toLocaleDateString()}
                  </div>
                </div>
             </div>

             {currentMember.bio && (
               <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <Label className="text-xs text-slate-400 uppercase tracking-wide">About</Label>
                 <p className="text-sm text-slate-600 leading-relaxed">{currentMember.bio}</p>
               </div>
             )}

             <div className="mt-6 flex gap-3">
               <Button onClick={() => openModal('edit', currentMember)} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                 <Edit className="w-4 h-4 mr-2" /> Edit Profile
               </Button>
             </div>
           </div>
        </DialogContent>
      );
    }
    
    // Create & Edit Modal
    return (
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {modalType === 'edit' ? 'Edit Team Member' : 'Add New Member'}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {modalType === 'edit' ? 'Make changes to the team member profile here.' : 'Add a new person to your organization.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <Input
                id="name"
                value={currentMember.name}
                onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})}
                className="border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-700">Role</Label>
              <Input
                id="role"
                value={currentMember.role}
                onChange={(e) => setCurrentMember({...currentMember, role: e.target.value})}
                className="border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={currentMember.email}
                onChange={(e) => setCurrentMember({...currentMember, email: e.target.value})}
                className="pl-9 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-700">Bio</Label>
            <textarea
              id="bio"
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
              value={currentMember.bio}
              onChange={(e) => setCurrentMember({...currentMember, bio: e.target.value})}
              placeholder="Brief description..."
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 bg-slate-50/50">
            <div className="space-y-0.5">
              <Label className="text-base text-slate-900">Active Status</Label>
              <p className="text-xs text-slate-500">Allow access to system resources</p>
            </div>
            <Button
                type="button"
                variant={currentMember.active ? "default" : "secondary"}
                onClick={() => setCurrentMember({...currentMember, active: !currentMember.active})}
                className={currentMember.active ? "bg-teal-600 hover:bg-teal-700" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}
              >
                {currentMember.active ? <UserCheck className="w-4 h-4 mr-2" /> : <UserX className="w-4 h-4 mr-2" />}
                {currentMember.active ? "Active" : "Inactive"}
              </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</Button>
          <Button 
            onClick={handleCreateOrUpdate} 
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSaving ? "Saving..." : modalType === 'edit' ? "Save Changes" : "Create Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Management</h1>
          <p className="text-slate-500">Manage access, roles, and user profiles.</p>
        </div>
        <Button 
          onClick={() => openModal('create')} 
          className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Members</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{members.length}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <CheckCircle2 className="h-3 w-3 mr-1" /> All systems operational
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Now</CardTitle>
            <UserCheck className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {members.filter(m => m.status === 'Active').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Currently online users
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {members.filter(m => m.status === 'On Leave').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Scheduled return: Next Week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Directory</CardTitle>
              <CardDescription>A list of all users in your organization including their name, title, and role.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search team members..." 
                value={searchTerm} 
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-[300px]">Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-slate-50 group transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-teal-100 border border-teal-200">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                          <AvatarFallback className="text-teal-700 font-medium">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">{member.name}</div>
                          <div className="text-xs text-slate-500">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        {member.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={
                          member.status === 'Active' 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent" 
                            : member.status === 'On Leave' 
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-transparent" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 border-transparent"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 text-sm">
                      {new Date(member.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openModal('view', member)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openModal('edit', member)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openModal('delete', member)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        {/* Pagination Footer */}
        {filteredMembers.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)}</span> of <span className="font-medium text-slate-900">{filteredMembers.length}</span> members
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-teal-600 hover:bg-teal-700' : 'text-slate-500'}`}
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
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {renderModalContent()}
      </Dialog>
    </div>
  );
}
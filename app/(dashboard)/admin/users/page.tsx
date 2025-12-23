"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  Users, 
  UserPlus, 
  User, 
  Shield, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Plus,
  Search,
  MoreVertical,
  Key,
  Database,
  Info,
  Save
} from "lucide-react";
import { toast, Toaster } from "sonner"; 

// --- Shadcn/ui Components ---
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";


// --- Mock Data Interfaces ---

interface Permission {
    key: string; // e.g., "read:content", "manage:users"
    description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissionKeys: string[];
}

interface UserData {
  id: number;
  name: string;
  email: string;
  roleId: number; // Links to Role.id
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
}

// --- Static Data ---
const AVAILABLE_PERMISSIONS: Permission[] = [
    { key: "read:all", description: "View all data and reports." },
    { key: "write:content", description: "Create and edit articles/posts." },
    { key: "manage:users", description: "Create, edit, and delete user accounts." },
    { key: "manage:settings", description: "Access and modify global settings." },
    { key: "delete:all", description: "Delete any content or user." },
];

const MOCK_ROLES: Role[] = [
  { id: 1, name: "Administrator", description: "Full control over all aspects of the application.", permissionKeys: ["read:all", "write:content", "manage:users", "manage:settings", "delete:all"] },
  { id: 2, name: "Editor", description: "Responsible for managing and publishing application content.", permissionKeys: ["read:all", "write:content"] },
  { id: 3, name: "Viewer", description: "Read-only access to view public data and dashboards.", permissionKeys: ["read:all"] },
];

const MOCK_USERS: UserData[] = [
  { id: 101, name: "Alice Johnson", email: "alice.j@corp.com", roleId: 1, status: 'Active', lastLogin: "2025-12-22" },
  { id: 102, name: "Bob Smith", email: "bob.s@corp.com", roleId: 2, status: 'Active', lastLogin: "2025-12-18" },
  { id: 103, name: "Charlie Brown", email: "charlie.b@corp.com", roleId: 3, status: 'Inactive', lastLogin: "2025-10-01" },
  { id: 104, name: "Diana Prince", email: "diana.p@corp.com", roleId: 1, status: 'Pending', lastLogin: "N/A" },
];


// --- Main Component ---

export default function UserRolesPage() {
  // State for data management
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);

  // State for Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // --- CRUD HANDLERS ---
  
  // --- User CRUD ---
  const handleOpenUserModal = (user: UserData | null = null) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (newUser: Omit<UserData, 'id' | 'lastLogin' | 'status'> & { id?: number }) => {
    if (newUser.id) {
        // UPDATE
        setUsers(prev => prev.map(u => u.id === newUser.id ? { ...u, ...newUser, id: u.id } as UserData : u));
        toast.success(`User '${newUser.name}' updated.`);
    } else {
        // CREATE
        const createdUser: UserData = {
            ...newUser,
            id: Date.now(),
            status: 'Pending',
            lastLogin: 'N/A'
        } as UserData;
        setUsers(prev => [...prev, createdUser]);
        toast.success(`New user '${newUser.name}' invited.`);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.error(`User '${userName}' deleted.`, {
        icon: <Trash2 className="h-4 w-4" />
    });
  };

  // --- Role CRUD ---
  const handleOpenRoleModal = (role: Role | null = null) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (newRole: Omit<Role, 'id'> & { id?: number }) => {
    if (newRole.id) {
        // UPDATE
        setRoles(prev => prev.map(r => r.id === newRole.id ? { ...r, ...newRole, id: r.id } as Role : r));
        toast.success(`Role '${newRole.name}' updated.`);
    } else {
        // CREATE
        const createdRole: Role = {
            ...newRole,
            id: Date.now(),
        } as Role;
        setRoles(prev => [...prev, createdRole]);
        toast.success(`New role '${newRole.name}' created.`);
    }
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (roleId: number, roleName: string) => {
    // Check if any user is assigned to this role (simple check)
    const usersInRole = users.filter(u => u.roleId === roleId);
    if (usersInRole.length > 0) {
        toast.warning(`Cannot delete role '${roleName}'. ${usersInRole.length} user(s) must be reassigned first.`);
        return;
    }
    setRoles(prev => prev.filter(r => r.id !== roleId));
    toast.error(`Role '${roleName}' deleted.`, {
        icon: <Trash2 className="h-4 w-4" />
    });
  };

  // --- Helper Getters ---
  const getRoleById = useCallback((id: number) => roles.find(r => r.id === id), [roles]);
  
  // --- Rendering Functions (Nested for clarity) ---

  const renderStatusBadge = (status: UserData['status']) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'Pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Memoize UserListPanel to prevent unnecessary re-renders
  const UserListPanel = useMemo(() => {
    const Component = () => {
      const [searchTerm, setSearchTerm] = useState('');

      const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRoleById(user.roleId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">System Users</CardTitle>
            <CardDescription>View, search, and manage individual user accounts and roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6 space-x-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus-visible:ring-teal-500 border-slate-200"
                />
              </div>
              <Button onClick={() => handleOpenUserModal(null)} className="bg-teal-600 hover:bg-teal-700 whitespace-nowrap">
                <UserPlus className="h-4 w-4 mr-2" /> Invite New User
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px] hidden md:table-cell">Last Login</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const role = getRoleById(user.roleId);
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-slate-800">{user.name}</TableCell>
                        <TableCell className="text-sm text-slate-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`font-semibold ${role?.name === 'Administrator' ? 'border-teal-400 text-teal-700 bg-teal-50' : 'border-slate-300'}`}
                          >
                            {role?.name || 'Unassigned'}
                          </Badge>
                        </TableCell>
                        <TableCell>{renderStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-sm text-slate-500 hidden md:table-cell">{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <UserActionsDropdown user={user} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      <Search className="h-6 w-6 mx-auto mb-2" />
                      No users found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end text-sm text-slate-600">
                {filteredUsers.length} user(s) currently displayed.
            </div>
          </CardContent>
        </Card>
      );
    };
    return Component;
  }, [users, roles, getRoleById]);
  
  const RoleManagementPanel = () => (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl text-slate-900">System Roles</CardTitle>
          <CardDescription>Define global access levels and permissions.</CardDescription>
        </div>
        <Button onClick={() => handleOpenRoleModal(null)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Create New Role
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[300px]">Permissions Summary</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => {
                const assignedUsers = users.filter(u => u.roleId === role.id).length;
                return (
              <TableRow key={role.id}>
                <TableCell className="font-medium text-slate-800">{role.name}</TableCell>
                <TableCell className="text-sm text-slate-600">
                    {role.description}
                    <p className="text-xs text-slate-400 mt-1">{assignedUsers} user(s) assigned</p>
                </TableCell>
                <TableCell>
                  {role.permissionKeys.slice(0, 3).map(key => (
                    <Badge key={key} variant="secondary" className="mr-1 mb-1 bg-slate-100 text-slate-600 hover:bg-slate-200">
                      <Key className="h-3 w-3 mr-1" />{key.split(':')[1]}
                    </Badge>
                  ))}
                  {role.permissionKeys.length > 3 && (
                    <Badge variant="outline" className="text-slate-500">
                        +{role.permissionKeys.length - 3} more
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <RoleActionsDropdown role={role} />
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // --- Modals and Dropdowns (CRUD UI) ---

  const UserActionsDropdown: React.FC<{ user: UserData }> = ({ user }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions for {user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
            onClick={() => handleOpenUserModal(user)}
            className="text-teal-600 cursor-pointer"
        >
          <Edit className="h-4 w-4 mr-2" /> Edit User
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => handleDeleteUser(user.id, user.name)}
            className="text-red-600 cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const RoleActionsDropdown: React.FC<{ role: Role }> = ({ role }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions for {role.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
            onClick={() => handleOpenRoleModal(role)}
            className="text-teal-600 cursor-pointer"
        >
          <Edit className="h-4 w-4 mr-2" /> Edit Role
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => handleDeleteRole(role.id, role.name)}
            className="text-red-600 cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const UserModal: React.FC = () => {
    const isEdit = !!editingUser;
    
    const [form, setForm] = useState<Omit<UserData, 'id' | 'lastLogin' | 'status'> & { id?: number }>({
        id: editingUser?.id,
        name: editingUser?.name || '',
        email: editingUser?.email || '',
        roleId: editingUser?.roleId || roles[0]?.id || 1,
    });

    // Sync form state when editingUser changes
    useEffect(() => {
      setForm({
        id: editingUser?.id || undefined,
        name: editingUser?.name || '',
        email: editingUser?.email || '',
        roleId: editingUser?.roleId || roles[0]?.id || 1,
      });
    }, [editingUser, roles]);

    const handleSubmit = () => {
        if (!form.name || !form.email) {
            toast.error("Name and Email are required.");
            return;
        }
        handleSaveUser(form);
    };

    return (
        <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit User: ${editingUser?.name}` : "Invite New User"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update user details and assigned role." : "Enter details and send an invitation email."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input 
                            id="name" 
                            value={form.name} 
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            className="col-span-3 focus-visible:ring-teal-500" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input 
                            id="email" 
                            type="email"
                            value={form.email} 
                            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                            className="col-span-3 focus-visible:ring-teal-500" 
                            disabled={isEdit} // Prevent email change on edit for simplicity
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roleId" className="text-right">Role</Label>
                        <Select
                            value={String(form.roleId)}
                            onValueChange={(val) => setForm(f => ({ ...f, roleId: Number(val) }))}
                        >
                            <SelectTrigger className="col-span-3 focus:ring-teal-500">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {roles.map(role => (
                                    <SelectItem key={role.id} value={String(role.id)}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsUserModalOpen(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700">
                        <UserPlus className="h-4 w-4 mr-2" /> {isEdit ? "Save Changes" : "Send Invite"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  };

  const RoleModal: React.FC = () => {
    const isEdit = !!editingRole;
    
    const [form, setForm] = useState<Omit<Role, 'id'> & { id?: number }>({
        id: editingRole?.id,
        name: editingRole?.name || '',
        description: editingRole?.description || '',
        permissionKeys: editingRole?.permissionKeys || [],
    });

    // Sync form state when editingRole changes
    useEffect(() => {
      setForm({
        id: editingRole?.id,
        name: editingRole?.name || '',
        description: editingRole?.description || '',
        permissionKeys: editingRole?.permissionKeys || [],
      });
    }, [editingRole]);

    const handleTogglePermission = (key: string) => {
        setForm(f => ({
            ...f,
            permissionKeys: f.permissionKeys.includes(key)
                ? f.permissionKeys.filter(p => p !== key)
                : [...f.permissionKeys, key]
        }));
    };

    const handleSubmit = () => {
        if (!form.name || !form.description) {
            toast.error("Name and Description are required.");
            return;
        }
        handleSaveRole(form);
    };

    return (
        <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
            <DialogContent className="sm:max-w-[550px] bg-white">
                <DialogHeader>
                    <DialogTitle>{isEdit ? `Edit Role: ${editingRole?.name}` : "Create New Role"}</DialogTitle>
                    <DialogDescription>
                        Define the name, description, and specific permissions for this role.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input 
                            id="roleName" 
                            value={form.name} 
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            className="focus-visible:ring-teal-500" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            id="description" 
                            value={form.description} 
                            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                            className="focus-visible:ring-teal-500" 
                            rows={2}
                        />
                    </div>
                    
                    <Separator />
                    
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Database className="h-5 w-5 text-teal-600" /> Role Permissions
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_PERMISSIONS.map(permission => (
                            <div 
                                key={permission.key} 
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    form.permissionKeys.includes(permission.key)
                                        ? 'border-teal-400 bg-teal-50 shadow-sm'
                                        : 'border-slate-200 hover:bg-slate-50'
                                }`}
                                onClick={() => handleTogglePermission(permission.key)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-800">{permission.key}</span>
                                    <Badge 
                                        variant={form.permissionKeys.includes(permission.key) ? 'default' : 'secondary'}
                                        className={form.permissionKeys.includes(permission.key) ? 'bg-teal-600 hover:bg-teal-700' : ''}
                                    >
                                        {form.permissionKeys.includes(permission.key) ? 'Allowed' : 'Denied'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">{permission.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
                <DialogFooter>
                    <Button onClick={() => setIsRoleModalOpen(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700">
                        <Save className="h-4 w-4 mr-2" /> {isEdit ? "Save Role" : "Create Role"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  };


  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      
      {/* Modals and Toaster */}
      <Toaster position="bottom-right" richColors theme="light" />
      <UserModal />
      <RoleModal />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Users className="h-7 w-7 text-teal-600" />
            User & Access Control
          </h1>
          <p className="text-slate-500 mt-1">
            Manage all system accounts, define user roles, and customize permissions.
          </p>
        </div>
      </div>
      
      {/* Main Tabbed Content */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2 bg-slate-100 mb-6">
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-teal-700"
          >
            <User className="h-4 w-4 mr-2" /> User List
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-teal-700"
          >
            <Shield className="h-4 w-4 mr-2" /> Role Management
          </TabsTrigger>
        </TabsList>
        
        {/* Content for User List Tab */}
        <TabsContent value="users">
          <UserListPanel />
        </TabsContent>

        {/* Content for Role Management Tab */}
        <TabsContent value="roles">
          <RoleManagementPanel />
        </TabsContent>
      </Tabs>
      
    </div>
  );
}
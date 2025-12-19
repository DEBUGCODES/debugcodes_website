"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Timer,
  Filter,
  Briefcase,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- Types ---
interface Project {
  id: number;
  name: string;
  description: string;
  status: "In Progress" | "Completed" | "On Hold" | "Pending";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  teamSize: number;
  tags: string[];
}

type ViewMode = "grid" | "list";
type StatusKey = Project["status"];
type PriorityKey = Project["priority"];

// --- Constants & Helpers ---
const STATUS_STYLES: Record<
  StatusKey,
  { color: string; bg: string; border: string; icon: any }
> = {
  "In Progress": {
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    icon: Timer,
  },
  Completed: {
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  "On Hold": {
    color: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200",
    icon: AlertCircle,
  },
  Pending: {
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    icon: Clock,
  },
};

const PRIORITY_STYLES: Record<PriorityKey, string> = {
  High: "text-red-600 bg-red-100 border-red-200",
  Medium: "text-amber-600 bg-amber-100 border-amber-200",
  Low: "text-slate-600 bg-slate-100 border-slate-200",
};

// HELPER FUNCTION (TO MIMIC `getCategoryDetails` for the stripe color)
// Since PRIORITY_STYLES contains all color/bg/border classes as a single string,
// we'll extract the core color for the stripe, which we assume is the 'red-500', 'amber-500', 'slate-500' equivalent.
const getPriorityStripeColor = (priority: PriorityKey): string => {
    switch (priority) {
        case "High":
            return "bg-red-500";
        case "Medium":
            return "bg-amber-500";
        case "Low":
            return "bg-slate-500";
        default:
            return "bg-gray-300";
    }
}

const newProjectTemplate: Project = {
  id: 0,
  name: "",
  description: "",
  status: "Pending",
  priority: "Medium",
  dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
  teamSize: 1,
  tags: [],
};

// --- Mock Data ---
const initialProjects: Project[] = [
  {
    id: 101,
    name: "Acme Analytics Dashboard",
    description:
      "Develop a real-time data visualization dashboard for sales metrics.",
    status: "In Progress",
    priority: "High",
    dueDate: "2026-03-30",
    teamSize: 5,
    tags: ["Frontend", "React"],
  },
  {
    id: 102,
    name: "API Gateway Migration",
    description:
      "Move existing microservices from monolith to new scalable gateway.",
    status: "Completed",
    priority: "High",
    dueDate: "2025-11-15",
    teamSize: 3,
    tags: ["Backend", "DevOps"],
  },
  {
    id: 103,
    name: "Mobile App Redesign",
    description:
      "Complete overhaul of the user interface for both mobile platforms.",
    status: "On Hold",
    priority: "Medium",
    dueDate: "2026-06-01",
    teamSize: 7,
    tags: ["Design", "UX"],
  },
  {
    id: 104,
    name: "Security Audit Q1",
    description: "Conduct a comprehensive security review.",
    status: "Pending",
    priority: "Medium",
    dueDate: "2026-01-31",
    teamSize: 2,
    tags: ["Security"],
  },
  {
    id: 105,
    name: "Knowledge Base",
    description: "Internal wiki for documentation and onboarding.",
    status: "In Progress",
    priority: "Low",
    dueDate: "2026-04-20",
    teamSize: 4,
    tags: ["Content"],
  },
  {
    id: 106,
    name: "Customer Portal",
    description: "Self-service portal for client billing and support tickets.",
    status: "Pending",
    priority: "High",
    dueDate: "2026-05-15",
    teamSize: 6,
    tags: ["Fullstack"],
  },
];

export default function ProjectsPage() {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Modal/Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] =
    useState<Project>(newProjectTemplate);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isSaving, setIsSaving] = useState(false);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // --- Effects ---

  // Simulate Initial App Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(initialProjects);
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---

  const handleOpenCreate = () => {
    setMode("create");
    setCurrentProject(newProjectTemplate);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setMode("edit");
    setCurrentProject({ ...project });
    setIsSheetOpen(true);
  };

  const handleOpenDelete = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentProject.name || !currentProject.description) {
      alert("Project Name and Description are required.");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (mode === "create") {
      const newId = Math.max(...projects.map((p) => p.id), 0) + 1;
      setProjects([...projects, { ...currentProject, id: newId }]);
    } else {
      setProjects(
        projects.map((p) => (p.id === currentProject.id ? currentProject : p))
      );
    }

    setIsSaving(false);
    setIsSheetOpen(false);
  };

  const handleDelete = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProjects(projects.filter((p) => p.id !== currentProject.id));
    setIsSaving(false);
    setIsDeleteDialogOpen(false);
  };

  // --- Computed ---

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return projects
      .filter((project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.tags.some((t) => t.toLowerCase().includes(term));

        const matchesStatus =
          statusFilter === "all" || project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const priorityOrder: Record<PriorityKey, number> = {
          High: 3,
          Medium: 2,
          Low: 1,
        };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }, [projects, searchTerm, statusFilter]);

  // --- Render ---

  // 1. Initial Splash Screen
  if (initialLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="relative w-24 h-24 mb-6 animate-bounce-slow">
          <div className="w-24 h-24 rounded-2xl bg-teal-600 flex items-center justify-center drop-shadow-xl">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 bg-teal-500/20 rounded-2xl animate-ping -z-10" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-gray-800 animate-pulse">
            Loading Projects
          </h2>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-75" />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8 font-sans">
      {/* 1. Top Header & Controls */}
      <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-teal-700" />
            </div>
            <span className="text-sm font-bold text-teal-700 uppercase tracking-wider">
              Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Projects
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Manage your team's initiatives, track progress, and deliver results
            on time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-white p-1 rounded-lg border shadow-sm flex items-center">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
              aria-label="View as Grid"
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
              aria-label="View as List"
            >
              <ListIcon className="w-4 h-4 mr-2" /> List
            </Button>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 h-11 px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm sticky top-2 z-30">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, description, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-teal-500 h-10"
              aria-label="Search projects"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] border-gray-200 bg-gray-50 h-10">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Content Area */}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 bg-gray-50/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium min-w-[200px] whitespace-nowrap">
                    Project Name
                  </th>
                  <th className="px-6 py-4 font-medium min-w-[120px]">
                    Status
                  </th>
                  <th className="px-6 py-4 font-medium min-w-[100px]">
                    Priority
                  </th>
                  <th className="px-6 py-4 font-medium min-w-[100px]">
                    Due Date
                  </th>
                  <th className="px-6 py-4 font-medium min-w-[100px]">
                    Team
                  </th>
                  <th className="px-6 py-4 font-medium text-right min-w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50/50 group transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {project.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[250px] overflow-hidden">
                        {project.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          `${STATUS_STYLES[project.status].bg} ${STATUS_STYLES[project.status].color} border-0`,
                          "py-1 px-2.5"
                        )}
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${PRIORITY_STYLES[project.priority]}`}
                      >
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(project.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {Array.from({
                          length: Math.min(3, project.teamSize),
                        }).map((_, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-[10px] text-teal-700 font-bold"
                            title={`User ${i + 1}`}
                          >
                            U{i + 1}
                          </div>
                        ))}
                        {project.teamSize > 3 && (
                          <div
                            className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-500 font-bold"
                            title={`${project.teamSize - 3} more members`}
                          >
                            +{project.teamSize - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProjectActions
                        project={project}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProjects.length === 0 && <EmptyState />}
          </div>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = STATUS_STYLES[project.status].icon;
            // NEW LOGIC TO MIMIC 'stripe' COLOR BASED ON PRIORITY
            const stripeColor = getPriorityStripeColor(project.priority);

            return (
              <Card
                key={project.id}
                className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden relative"
              >
                {/* Category Color Strip Indicator (NOW BASED ON PRIORITY) */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${stripeColor}`}
                />

                <CardHeader className="pb-3 pt-5 pl-6">
                  <div className="flex justify-between items-start">
                    {/* Status Badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        `${STATUS_STYLES[project.status].bg} ${STATUS_STYLES[project.status].color} ${STATUS_STYLES[project.status].border}`,
                        "mb-2 border py-1 px-2"
                      )}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {project.status}
                    </Badge>
                    {/* Priority Indicator */}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border ${PRIORITY_STYLES[project.priority]} ml-2`}
                    >
                      {project.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight group-hover:text-teal-700 transition-colors cursor-pointer">
                      {project.name}
                    </CardTitle>
                    {/* Actions Menu */}
                    <ProjectActions
                      project={project}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pl-6 pb-3">
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-teal-50 text-teal-600 px-2 py-1 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pl-6 border-t bg-gray-50/30 py-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>
                      {new Date(project.dueDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{project.teamSize} members</span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === "grid" && filteredProjects.length === 0 && <EmptyState />}

      {/* 4. Create/Edit Sheet (Side Drawer) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">
              {mode === "create" ? "Create Project" : "Edit Project"}
            </SheetTitle>
            <SheetDescription>
              {mode === "create"
                ? "Launch a new initiative. Fill in the details below."
                : `Update specifications for: ${currentProject.name}`}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={currentProject.name}
                onChange={(e) =>
                  setCurrentProject({ ...currentProject, name: e.target.value })
                }
                placeholder="e.g. Website Redesign"
                className="focus-visible:ring-teal-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                value={currentProject.description}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the goals and scope..."
                className="h-32 resize-none focus-visible:ring-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectStatus">Status</Label>
                <Select
                  value={currentProject.status}
                  onValueChange={(val: Project["status"]) =>
                    setCurrentProject({ ...currentProject, status: val })
                  }
                >
                  <SelectTrigger
                    id="projectStatus"
                    className="focus-visible:ring-teal-500"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectPriority">Priority</Label>
                <Select
                  value={currentProject.priority}
                  onValueChange={(val: Project["priority"]) =>
                    setCurrentProject({ ...currentProject, priority: val })
                  }
                >
                  <SelectTrigger
                    id="projectPriority"
                    className="focus-visible:ring-teal-500"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectDueDate">Due Date</Label>
                <Input
                  id="projectDueDate"
                  type="date"
                  value={currentProject.dueDate}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      dueDate: e.target.value,
                    })
                  }
                  className="focus-visible:ring-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectTeamSize">Team Size</Label>
                <Input
                  id="projectTeamSize"
                  type="number"
                  min={1}
                  value={currentProject.teamSize}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      teamSize: parseInt(e.target.value) || 1,
                    })
                  }
                  className="focus-visible:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectTags">Tags (Comma separated)</Label>
              <Input
                id="projectTags"
                value={currentProject.tags.join(", ")}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="React, Design, Marketing..."
                className="focus-visible:ring-teal-500"
              />
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px] shadow-md hover:shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...
                </>
              ) : (
                "Save Project"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 5. Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Delete Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{currentProject.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Subcomponents ---

function ProjectActions({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-teal-700 opacity-75 hover:opacity-100 transition-opacity"
          aria-label={`More actions for ${project.name}`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(project)}>
          Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            try {
              // Note: navigator.clipboard.writeText only works in secure contexts (HTTPS)
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(project.name);
              }
            } catch (error) {
              console.error("Failed to copy:", error);
            }
          }}
        >
          Copy Name
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => onDelete(project)}
        >
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-dashed border-gray-300 min-h-[300px] mt-6">
      <div className="bg-teal-50 p-4 rounded-full mb-4">
        <Search className="w-8 h-8 text-teal-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
      <p className="text-gray-500 max-w-sm mt-1 mb-4">
        We couldn't find any projects matching your filters. Try adjusting your
        search or click 'New Project' to create one.
      </p>
    </div>
  );
}
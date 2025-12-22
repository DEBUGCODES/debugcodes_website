"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MoreVertical,
  Filter,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  MessageSquare,
  BarChart2,
  Calendar,
  ArrowUpRight,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// --- Interfaces ---
interface Submission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "New" | "In Progress" | "Contacted" | "Closed";
  priority: "High" | "Medium" | "Low";
  date: string; // ISO date string or formatted date
  type: "General" | "Partnership" | "Technical";
  avatar?: string;
}

// --- Mock Data ---
const initialSubmissions: Submission[] = [
  {
    id: 101,
    name: "Liam O'Connell",
    email: "liam@example.com",
    subject: "Inquiry about Pro Plan Features",
    message:
      "Can you provide more details on the API rate limits for the Pro subscription?",
    status: "New",
    priority: "High",
    date: "2025-12-22T10:30:00Z",
    type: "Technical",
    avatar: "/avatars/01.png",
  },
  {
    id: 102,
    name: "Mia Rodriguez",
    email: "mia@designco.com",
    subject: "Potential Reseller Opportunity",
    message:
      "Our consulting firm is interested in partnering with you. Please reach out to discuss.",
    status: "In Progress",
    priority: "High",
    date: "2025-12-22T08:15:00Z",
    type: "Partnership",
  },
  {
    id: 103,
    name: "David Kim",
    email: "david.k@personal.net",
    subject: "Question about latest blog post",
    message:
      "I noticed a typo in the last paragraph of your recent blog post 'Future of AI'.",
    status: "Closed",
    priority: "Low",
    date: "2025-12-21T15:40:00Z",
    type: "General",
  },
  {
    id: 104,
    name: "Sarah Jansen",
    email: "sarahj@corp.org",
    subject: "Request for a demo",
    message:
      "We are a large organization and need a personalized demo for our team of 50.",
    status: "New",
    priority: "Medium",
    date: "2025-12-21T09:00:00Z",
    type: "General",
    avatar: "/avatars/03.png",
  },
  {
    id: 105,
    name: "Javier Flores",
    email: "javier@techsol.es",
    subject: "API Integration Support",
    message:
      "Experiencing an issue with webhook delivery reliability. Need urgent support.",
    status: "Contacted",
    priority: "High",
    date: "2025-12-20T11:20:00Z",
    type: "Technical",
  },
];

// --- Helper Components ---

// Status Badge Helper (re-used from dashboard, updated with new statuses)
const StatusBadge = ({ status }: { status: Submission["status"] }) => {
  const styles = {
    New: "bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200",
    "In Progress":
      "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
    Contacted:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
    Closed:
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
  };
  const icons = {
    New: Clock,
    "In Progress": MessageSquare,
    Contacted: Mail,
    Closed: CheckCircle2,
  };
  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <Badge
      variant="outline"
      className={`pl-2 pr-3 py-1 gap-1.5 transition-colors text-xs font-medium ${styles[status as keyof typeof styles]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">{status}</span>
    </Badge>
  );
};

const PriorityBadge = ({ priority }: { priority: Submission["priority"] }) => {
  const styles = {
    High: "bg-red-500 text-white",
    Medium: "bg-amber-500 text-white",
    Low: "bg-slate-400 text-white",
  };
  return (
    <Badge
      className={`h-5 px-2 text-xs rounded-full font-medium ${styles[priority as keyof typeof styles]}`}
    >
      {priority}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ContactSubmissionManager() {
  const [submissions, setSubmissions] =
    useState<Submission[]>(initialSubmissions);
  const [activeTab, setActiveTab] = useState("New");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  // --- Filtering Logic ---
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((sub) => {
        // Filter by Tab (if not 'All')
        if (activeTab !== "All" && sub.status !== activeTab) {
          return false;
        }
        // Filter by Search Term
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          return (
            sub.name.toLowerCase().includes(lowerSearch) ||
            sub.email.toLowerCase().includes(lowerSearch) ||
            sub.subject.toLowerCase().includes(lowerSearch) ||
            sub.message.toLowerCase().includes(lowerSearch)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Sort New submissions first
        if (a.status === "New" && b.status !== "New") return -1;
        if (a.status !== "New" && b.status === "New") return 1;
        // Then sort by High priority
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }, [submissions, activeTab, searchTerm]);

  // --- Actions ---
  const updateSubmissionStatus = (
    id: number,
    newStatus: Submission["status"]
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  const deleteSubmission = (id: number) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      if (selectedSubmission && selectedSubmission.id === id) {
        setIsModalOpen(false);
        setSelectedSubmission(null);
      }
    }
  };

  const openDetailsModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const statusCounts = useMemo(() => {
    const counts = {
      All: submissions.length,
      New: 0,
      "In Progress": 0,
      Contacted: 0,
      Closed: 0,
    };
    submissions.forEach((sub) => {
      counts[sub.status as keyof typeof counts] =
        (counts[sub.status as keyof typeof counts] || 0) + 1;
    });
    return counts;
  }, [submissions]);

  return (
    // Base layout matching the dashboard aesthetic
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* 1. Header and Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Submission Inbox
          </h1>
          <p className="text-slate-500 mt-1">
            Manage, filter, and respond to all incoming 'Contact Us' requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Action Button: Could be 'Create Ticket' or 'View Analytics' */}
          <Button
            variant="outline"
            className="bg-card-white-bg border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards (Matching Dashboard Card Style) */}
        {[
          {
            title: "New Submissions",
            value: statusCounts.New,
            icon: Clock,
            color: "text-teal-600",
            description: "Currently unread or unassigned.",
          },
          {
            title: "In Progress",
            value: statusCounts["In Progress"],
            icon: MessageSquare,
            color: "text-blue-600",
            description: "Team members are actively working on.",
          },
          {
            title: "Closed Last 7 Days",
            value: 18,
            icon: CheckCircle2,
            color: "text-emerald-600",
            description: "+15% vs prior period.",
          },
          {
            title: "Average Response Time",
            value: "3h 45m",
            icon: Calendar,
            color: "text-slate-600",
            description: "Target: less than 4 hours.",
          },
        ].map((metric, i) => (
          <Card key={i} className="shadow-sm border-slate-200 bg-card-white-bg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {metric.title}
              </CardTitle>
              {/* Icon Container matching dashboard style */}
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {metric.value}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Main Submission Table (Card Container) */}
      <Card className="shadow-sm border-slate-200 bg-card-white-bg">
        <CardHeader className="p-4 md:p-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                {/* Input matching dashboard style */}
                <Input
                  placeholder="Search name, email, or subject..."
                  className="pl-9 w-full md:w-[350px] bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex bg-card-white-bg border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-card-white-bg border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Calendar className="mr-2 h-4 w-4" /> Date Range
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Tabs for Filtering (Matching Dashboard Tabs) */}
        <div className="px-4 md:px-6 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* TabsList matches dashboard style */}
            <TabsList className="bg-card-white-bg border border-slate-200 p-1 mb-4 h-auto flex flex-wrap">
              {Object.keys(statusCounts).map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  // Tabs match dashboard style: white BG when active, dark text, light slate for hover/inactive
                  className="rounded-md data-[state=active]:bg-card-white-bg data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-500 hover:text-slate-700 h-8 px-3 text-sm flex items-center gap-2"
                >
                  {status}
                  <Badge
                    variant="secondary"
                    className={`h-5 px-2 font-medium ${activeTab === status ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"}`}
                  >
                    {statusCounts[status as keyof typeof statusCounts]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Table Content */}
        <CardContent className="p-0">
          {/* Table matching dashboard style */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-t border-slate-200">
                <TableHead className="w-[300px]">User & Subject</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[80px]">Priority</TableHead>
                <TableHead className="text-right w-[150px]">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <TableRow
                    key={sub.id}
                    className="group hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => openDetailsModal(sub)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarImage src={sub.avatar} />
                          <AvatarFallback className="bg-teal-600 text-white font-medium text-sm">
                            {sub.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-900 truncate max-w-xs">
                            {sub.subject}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{sub.name}</span>
                            <span className="text-slate-300">•</span>
                            <span className="truncate">{sub.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-medium">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      >
                        {sub.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sub.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={sub.priority} />
                    </TableCell>
                    <TableCell className="text-right text-slate-500 text-sm">
                      {formatDate(sub.date)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                            onClick={(e) => e.stopPropagation()} // Prevent row click event
                          >
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        {/* Dropdown menu matching dashboard style */}
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-card-white-bg border-slate-200"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDetailsModal(sub)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> View
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateSubmissionStatus(sub.id, "Closed")
                            }
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />{" "}
                            Mark as Closed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateSubmissionStatus(sub.id, "In Progress")
                            }
                          >
                            <MessageSquare className="mr-2 h-4 w-4 text-blue-600" />{" "}
                            Assign & Start
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => deleteSubmission(sub.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                            Submission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-slate-500"
                  >
                    No submissions found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- Submission Detail Modal --- */}
      {selectedSubmission && (
        <SubmissionDetailModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          submission={selectedSubmission}
          updateStatus={updateSubmissionStatus}
          deleteSubmission={deleteSubmission}
        />
      )}
    </div>
  );
}

// --- Detail Modal Component (External for Cleanliness) ---

interface SubmissionDetailModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  submission: Submission;
  updateStatus: (id: number, newStatus: Submission["status"]) => void;
  deleteSubmission: (id: number) => void;
}

const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  isOpen,
  setIsOpen,
  submission,
  updateStatus,
  deleteSubmission,
}) => {
  // Determine the next logical status transition
  const getNextStatus = (currentStatus: Submission["status"]) => {
    switch (currentStatus) {
      case "New":
        return "In Progress";
      case "In Progress":
        return "Contacted";
      case "Contacted":
        return "Closed";
      case "Closed":
        return null;
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(submission.status);
  const NextStatusIcon =
    nextStatus === "In Progress"
      ? MessageSquare
      : nextStatus === "Contacted"
        ? Mail
        : CheckCircle2;

  const handleUpdateStatus = (newStatus: Submission["status"]) => {
    updateStatus(submission.id, newStatus);
  };

  const handleDelete = () => {
    deleteSubmission(submission.id);
    setIsOpen(false);
  };

  return (
    <div
      // Simple Modal Overlay matching the dashboard aesthetic
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{ backgroundColor: "rgba(2, 6, 23, 0.4)" }} // Dark slate overlay
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          // Modal Content (White background, slate border)
          className={`bg-card-white-bg rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 truncate max-w-[70%]">
              {submission.subject}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:bg-slate-100"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 divide-x divide-slate-100 max-h-[70vh]">
            {/* --- Submission Content (Main Area) --- */}
            <div className="md:col-span-2 p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={submission.avatar} />
                  <AvatarFallback className="bg-teal-600 text-white font-medium">
                    {submission.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-800">
                    {submission.name}
                  </p>
                  <p className="text-sm text-slate-500">{submission.email}</p>
                </div>
                <a
                  href={`mailto:${submission.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto"
                >
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Mail className="h-4 w-4 mr-2" /> Respond
                  </Button>
                </a>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Message
                </h3>
                <div className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                  {submission.message}
                </div>
              </div>
            </div>

            {/* --- Submission Details (Sidebar) --- */}
            <div className="md:col-span-1 p-6 space-y-6 bg-slate-50 overflow-y-auto">
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
                Ticket Info
              </h3>

              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Status
                </p>
                <StatusBadge status={submission.status} />
              </div>

              {/* Priority */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Priority
                </p>
                <PriorityBadge priority={submission.priority} />
              </div>

              {/* Date & Time */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Received Date
                </p>
                <div className="flex items-center text-sm text-slate-700">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {formatDate(submission.date)}
                </div>
              </div>

              {/* Submission Type */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Submission Type
                </p>
                <Badge
                  variant="secondary"
                  className="bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100"
                >
                  {submission.type}
                </Badge>
              </div>

              {/* Status Action Button */}
              {nextStatus && (
                <div className="pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => handleUpdateStatus(nextStatus)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <NextStatusIcon className="h-4 w-4 mr-2" />
                    Move to {nextStatus}
                  </Button>
                </div>
              )}

              {/* Delete Button */}
              <div className="pt-2">
                <Button
                  onClick={handleDelete}
                  variant="ghost"
                  className="w-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Submission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

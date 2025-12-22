"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // For the logo
import {
  Users,
  DollarSign,
  Briefcase,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Calendar as CalendarIcon,
  Search,
  Bell,
  MoreVertical,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Cloud,
  HardDrive,
  MoreHorizontal,
  MousePointer2,
  Smartphone,
  Monitor,
  Globe,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// --- Mock Data ---
const chartData = [
  { name: "Jan", total: 1200, users: 400 },
  { name: "Feb", total: 2100, users: 800 },
  { name: "Mar", total: 1800, users: 1200 },
  { name: "Apr", total: 2400, users: 1600 },
  { name: "May", total: 3200, users: 2100 },
  { name: "Jun", total: 4500, users: 2800 },
  { name: "Jul", total: 4100, users: 2600 },
];

const recentSubmissions = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    subject: "Partnership Inquiry",
    status: "PENDING",
    date: "2 mins ago",
    avatar: "/avatars/01.png",
  },
  {
    id: "2",
    name: "Mark Wilson",
    email: "mark@example.com",
    subject: "Course Question",
    status: "CONTACTED",
    date: "1 hour ago",
    avatar: "/avatars/02.png",
  },
  {
    id: "3",
    name: "Sarah Davis",
    email: "sarah@design.co",
    subject: "Project Quote",
    status: "CLOSED",
    date: "3 hours ago",
    avatar: "/avatars/03.png",
  },
  {
    id: "4",
    name: "James Miller",
    email: "james@web.dev",
    subject: "Bug Report",
    status: "PENDING",
    date: "5 hours ago",
    avatar: "/avatars/04.png",
  },
];

const recentActivity = [
  {
    name: "John Doe",
    action: "Enrolled in Web Dev",
    time: "Just now",
    initials: "JD",
  },
  {
    name: "Jane Smith",
    action: "Created an account",
    time: "5 min ago",
    initials: "JS",
  },
  {
    name: "System",
    action: "Backup completed",
    time: "1 hour ago",
    initials: "SYS",
  },
  {
    name: "Mike Brown",
    action: "Submitted a project",
    time: "2 hours ago",
    initials: "MB",
  },
];

// --- Analytics Data ---
const visitorData = [
  { name: "Mon", visitors: 4000, pageviews: 2400 },
  { name: "Tue", visitors: 3000, pageviews: 1398 },
  { name: "Wed", visitors: 2000, pageviews: 9800 },
  { name: "Thu", visitors: 2780, pageviews: 3908 },
  { name: "Fri", visitors: 1890, pageviews: 4800 },
  { name: "Sat", visitors: 2390, pageviews: 3800 },
  { name: "Sun", visitors: 3490, pageviews: 4300 },
];

const deviceData = [
  { name: "Desktop", value: 65, color: "#0d9488" }, // Teal
  { name: "Mobile", value: 25, color: "#f59e0b" }, // Amber
  { name: "Tablet", value: 10, color: "#64748b" }, // Slate
];

// --- Reports Data ---
const reportsData = [
  {
    id: "R-101",
    name: "Q4 Financial Summary.pdf",
    size: "2.4 MB",
    date: "Jan 15, 2024",
    type: "PDF",
  },
  {
    id: "R-102",
    name: "User Activity Log.csv",
    size: "14 MB",
    date: "Jan 12, 2024",
    type: "CSV",
  },
  {
    id: "R-103",
    name: "System Audit 2023.pdf",
    size: "1.2 MB",
    date: "Jan 10, 2024",
    type: "PDF",
  },
  {
    id: "R-104",
    name: "Marketing Campaign A.xlsx",
    size: "845 KB",
    date: "Jan 08, 2024",
    type: "Excel",
  },
  {
    id: "R-105",
    name: "Server Health Check.json",
    size: "200 KB",
    date: "Jan 05, 2024",
    type: "JSON",
  },
];

// --- Helper Components ---

// 1. Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-3 rounded-lg shadow-xl ring-1 ring-slate-100">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
          <DollarSign className="w-3 h-3" />
          Revenue: ${payload[0].value}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="w-3 h-3" />
          Users: {payload[1].value}
        </div>
      </div>
    );
  }
  return null;
};

// 2. Status Badge Helper
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
    CONTACTED: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
    CLOSED: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
  };
  const icons = {
    PENDING: Clock,
    CONTACTED: CheckCircle2,
    CLOSED: XCircle,
  };
  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <Badge
      variant="outline"
      className={`pl-2 pr-3 py-1 gap-1.5 transition-colors ${styles[status as keyof typeof styles]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">{status.toLowerCase()}</span>
    </Badge>
  );
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Simulate Initial App Load (Logo Splash)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Start loading data immediately after app load
      setTimeout(() => setIsDataLoading(false), 1500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- LOADING SCREEN (Logo Splash) ---
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="relative w-32 h-32 animate-pulse">
          {/* Replace src with your actual logo path */}
          <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-ping" />
          <div className="relative bg-white p-6 rounded-full shadow-2xl z-10">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
        <h2 className="mt-8 text-xl font-medium text-slate-600 tracking-widest uppercase">
          Loading Dashboard
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              className="pl-9 w-[250px] bg-white border-slate-200 focus-visible:ring-teal-500"
            />
          </div>

          {/* Date Picker (Visual) */}
          <Button
            variant="outline"
            className="bg-white border-slate-200 text-slate-700 hidden sm:flex"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Jan 20, 2024 - Feb 09, 2024
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="icon" className="bg-white relative">
            <Bell className="h-4 w-4 text-slate-600" />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src="/avatars/admin.png" alt="@admin" />
                  <AvatarFallback className="bg-teal-600 text-white font-medium">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@company.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 2. Key Metrics Grid (With Skeleton Loading) */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isDataLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-[120px] mb-2" />
                      <Skeleton className="h-3 w-[150px]" />
                    </CardContent>
                  </Card>
                ))
            ) : (
              <>
                <MetricCard
                  title="Total Revenue"
                  value="$45,231.89"
                  trend="+20.1%"
                  trendUp={true}
                  icon={DollarSign}
                  subtext="from last month"
                />
                <MetricCard
                  title="Active Users"
                  value="+2,350"
                  trend="+180.1%"
                  trendUp={true}
                  icon={Users}
                  subtext="from last month"
                />
                <MetricCard
                  title="Projects"
                  value="573"
                  trend="+19%"
                  trendUp={true}
                  icon={Briefcase}
                  subtext="active now"
                />
                <MetricCard
                  title="Bounce Rate"
                  value="12.5%"
                  trend="-4.2%"
                  trendUp={true} // technically down is good for bounce rate, but let's keep visual consistent
                  icon={Activity}
                  subtext="since last week"
                />
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* 3. Main Chart */}
            <Card className="col-span-4 shadow-sm border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">
                      Revenue Overview
                    </CardTitle>
                    <CardDescription>
                      Monthly revenue vs new user growth
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pl-0">
                {isDataLoading ? (
                  <div className="h-[350px] flex items-center justify-center">
                    <Skeleton className="h-[300px] w-[90%] rounded-xl" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorTotal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#0d9488"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0d9488"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorUsers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#64748b"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#64748b"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#0d9488"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#64748b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* 4. Recent Activity Feed */}
            <Card className="col-span-3 shadow-sm border-slate-200 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Activity Feed
                </CardTitle>
                <CardDescription>Real-time system updates</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {isDataLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className="relative">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700`}
                          >
                            {item.initials}
                          </span>
                          {/* Timeline Line */}
                          {i !== recentActivity.length - 1 && (
                            <span
                              className="absolute left-1/2 top-9 -ml-px h-full w-px bg-slate-200"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {item.action}
                          </p>
                          <p className="text-xs text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                >
                  View all activity
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* 5. Advanced Table */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-800">
                  Latest Submissions
                </CardTitle>
                <CardDescription>
                  Manage and track recent contact requests
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isDataLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[250px]">User</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSubmissions.map((sub) => (
                      <TableRow
                        key={sub.id}
                        className="group hover:bg-slate-50/50 cursor-pointer transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={sub.avatar} />
                              <AvatarFallback>
                                {sub.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-900">
                                {sub.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {sub.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">
                          {sub.subject}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={sub.status} />
                        </TableCell>
                        <TableCell className="text-right text-slate-500 text-sm">
                          {sub.date}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder Content for other tabs */}
        <TabsContent
          value="analytics"
          className="h-[400px] flex flex-col gap-y-3"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Quick Stats Row */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Avg. Session Duration
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">2m 45s</div>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs last week
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Bounce Rate
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">42.3%</div>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> -2% (Improved)
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Pages per Session
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">4.1</div>
                <p className="text-xs text-slate-400 mt-1">
                  Steady performance
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Goal Conversions
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">1,204</div>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +5.4% vs last week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Traffic Bar Chart */}
            <Card className="col-span-4 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Traffic vs Pageviews
                </CardTitle>
                <CardDescription>
                  Daily comparison for the current week
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                {isDataLoading ? (
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={visitorData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="visitors"
                        name="Unique Visitors"
                        fill="#0d9488"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="pageviews"
                        name="Page Views"
                        fill="#94a3b8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Device Donut Chart */}
            <Card className="col-span-3 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Device Usage
                </CardTitle>
                <CardDescription>
                  Where your users are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isDataLoading ? (
                  <Skeleton className="h-[300px] w-full rounded-full" />
                ) : (
                  <div className="h-[350px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                      <span className="text-3xl font-bold text-slate-800">
                        65%
                      </span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">
                        Desktop
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center gap-6 pt-0 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" /> Desktop
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Mobile
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-900">
                System Reports
              </h3>
              <p className="text-sm text-slate-500">
                Download system logs, financial summaries, and user audits.
              </p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <FileText className="mr-2 h-4 w-4" /> Generate New Report
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Storage Usage Card */}
            <Card className="md:col-span-1 shadow-sm border-slate-200 bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-teal-400" /> Storage Usage
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your generated reports storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-3xl font-bold">14.2 GB</div>
                  <div className="text-xs text-slate-400">of 50 GB Used</div>
                </div>
                <Progress value={28} className="h-2 bg-slate-700" />
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">PDF Reports</span>
                    <span>8.1 GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">CSV/Excel</span>
                    <span>2.4 GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">System Logs</span>
                    <span>3.7 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports List */}
            <Card className="md:col-span-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Available Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isDataLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Date Generated</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportsData.map((file) => (
                        <TableRow key={file.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            {file.name}
                          </TableCell>
                          <TableCell className="text-slate-500">
                            {file.date}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-600 font-normal"
                            >
                              {file.size}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4 text-teal-600" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 ml-1"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Sub-Components ---

function MetricCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  subtext,
}: any) {
  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-teal-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="flex items-center text-xs mt-1">
          <span
            className={`flex items-center font-medium ${trendUp ? "text-emerald-600" : "text-red-600"}`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {trend}
          </span>
          <span className="text-slate-400 ml-2">{subtext}</span>
        </div>
      </CardContent>
    </Card>
  );
}

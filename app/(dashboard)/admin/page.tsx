"use client"

// 💡 Imports for all components used in the dashboard
import { 
  Users, 
  DollarSign, 
  Briefcase, 
  Activity, 
  ArrowUpRight, 
  Mail,
  Calendar
} from "lucide-react"

// Ensure these are correctly imported from your shadcn/ui components
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts" // Assuming you have recharts installed

// --- Mock Data ---
const overviewData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 4500 },
]

const recentSubmissions = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", subject: "Partnership Inquiry", status: "PENDING", date: "2 mins ago" },
  { id: "2", name: "Mark Wilson", email: "mark@example.com", subject: "Course Question", status: "CONTACTED", date: "1 hour ago" },
  { id: "3", name: "Sarah Davis", email: "sarah@design.co", subject: "Project Quote", status: "CLOSED", date: "3 hours ago" },
]

const recentActivity = [
  { name: "John Doe", email: "john@gmail.com", action: "Enrolled in Web Dev", time: "Just now", avatar: "/avatars/01.png", initials: "JD" },
  { name: "Jane Smith", email: "jane@yahoo.com", action: "Created an account", time: "5 min ago", avatar: "/avatars/02.png", initials: "JS" },
  { name: "Mike Brown", email: "mike@tech.com", action: "Submitted a project", time: "2 hours ago", avatar: "/avatars/03.png", initials: "MB" },
]

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 text-gray-800">
      {/* 🎯 THIS IS THE SINGLE PARENT ELEMENT */}
      
      {/* 1. Header Section */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Dashboard</h2>
          <p className="text-gray-500">
            Overview of your system performance and recent activities.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-teal hover:bg-teal-dark text-white font-semibold">
            <Activity className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Revenue */}
        <Card className="bg-card-bg border-gray-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">$45,231.89</div>
            <p className="text-xs text-teal flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Users */}
        <Card className="bg-card-white-bg border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
            <Users className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">+2350</div>
            <p className="text-xs text-teal flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        
        {/* Card 3: Projects */}
        <Card className="bg-card-bg border-gray-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Open Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">573</div>
            <p className="text-xs text-teal flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              +19% vs last month
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Subscriptions */}
        <Card className="bg-card-white-bg border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Subscriptions</CardTitle>
            <Mail className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">+49</div>
            <p className="text-xs text-teal flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              +5.2% last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Charts and Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 bg-card-white-bg border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={overviewData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                />
                <Bar 
                  dataKey="total" 
                  fill="#14b8a6" 
                  radius={[4, 4, 0, 0]} 
                  className="fill-teal hover:fill-teal-dark"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent User Activity */}
        <Card className="lg:col-span-3 bg-card-white-bg border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Recent User Activity</CardTitle>
            <CardDescription className="text-gray-500">
              See what's happening on your platform right now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.avatar} alt="Avatar" />
                  <AvatarFallback className="bg-navy text-teal font-semibold">{activity.initials}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-800">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <div className="ml-auto text-xs text-teal">{activity.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Contact Submissions Table (Full Width) */}
      <Card className="bg-card-white-bg border-gray-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-gray-800">Latest Submissions</CardTitle>
            <CardDescription className="text-gray-500">
              Management of recent contact form submissions.
            </CardDescription>
          </div>
          <Button variant="outline" className="border-gray-200 text-gray-800 hover:bg-gray-100">
            <Calendar className="mr-2 h-4 w-4 text-teal" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-500">Contact Name</TableHead>
                <TableHead className="text-gray-500">Subject</TableHead>
                <TableHead className="text-gray-500">Status</TableHead>
                <TableHead className="text-gray-500 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubmissions.map((sub) => (
                <TableRow key={sub.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-semibold text-gray-800">
                    {sub.name}
                    <p className="text-xs text-teal">{sub.email}</p>
                  </TableCell>
                  <TableCell className="text-gray-600">{sub.subject}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        sub.status === 'PENDING' 
                          ? "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30" 
                          : sub.status === 'CONTACTED' 
                          ? "bg-teal/20 text-teal-dark hover:bg-teal/30"
                          : "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-gray-500">{sub.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
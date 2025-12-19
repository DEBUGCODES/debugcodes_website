"use client"
// app/admin/layout.tsx
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { CustomTrigger } from "@/components/admin/CustomTrigger"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
            {/* <SidebarTrigger className="ml-3 z-50 fixed top-0" /> */}
            {/* <CustomTrigger /> */}
            {/* <Separator orientation="vertical" className="mr-2 h-4 bg-navy-lighter" /> */}

        {/* Main Content Area: Now uses the new light background */}
        {/* IMPORTANT: Change bg-navy to bg-off-white (or just bg-white/bg-gray-50 if off-white is not a variable) */}
        <div className="flex flex-1 flex-col gap-4 py-2 pt-0 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
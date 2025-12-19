"use client";

import * as React from "react";
import Image from "next/image";
import {
  Briefcase,
  BookOpen,
  Code,
  Group,
  Mail,
  Settings,
  Users,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  Package,
  PanelLeftClose,
  PanelLeft,
  PanelRight,
  PanelRightClose,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Sample Data
const data = {
  user: {
    name: "Admin User",
    email: "admin@debugtech.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "DebugCMS",
      logo: "/logo.png",
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Content Management",
      items: [
        { title: "Team Members", url: "/admin/team", icon: Group },
        { title: "Projects", url: "/admin/projects", icon: Briefcase },
        { title: "Products", url: "/admin/products", icon: Package },
        { title: "Partners", url: "/admin/patners", icon: Code },
      ],
    },
    {
      title: "System & Submissions",
      items: [
        { title: "Contact Submissions", url: "/admin/submissions", icon: Mail },
        { title: "Users & Roles", url: "/admin/users", icon: Users },
        { title: "Global Settings", url: "/admin/settings", icon: Settings },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              {/* Logo - Hidden when collapsed */}
              {!isCollapsed && (
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-white/10">
                    <Image
                      src="/logo.png"
                      alt="DebugCMS Logo"
                      width={32}
                      height={32}
                      className="size-full object-contain"
                    />
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">
                      DebugCMS
                    </span>
                    <span className="truncate text-xs text-slate-400">
                      v1.0.0
                    </span>
                  </div>
                </div>
              )}

              {/* Toggle Button - Always visible, centered when collapsed */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={`shrink-0 hover:bg-teal-600/20 hover:text-teal-400 text-slate-300 transition-all ${
                  isCollapsed ? "mx-auto" : ""
                }`}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <PanelRightClose className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-slate-400">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="text-white hover:bg-teal-600/20 hover:text-teal-400 data-[active=true]:bg-teal-600/30 data-[active=true]:text-teal-400"
                    >
                      <a href={item.url}>
                        <item.icon className="text-white group-hover:text-teal-400" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-teal-600/20 hover:text-teal-400 data-[state=open]:bg-teal-600/30 data-[state=open]:text-teal-400"
                >
                  <Avatar className="h-8 w-8 rounded-lg border-2 border-teal-500/30">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg bg-teal-600 text-white font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs text-slate-400">
                      {data.user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-slate-900 text-white border-slate-700 shadow-xl"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg border-2 border-teal-500/30">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg bg-teal-600 text-white font-bold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs text-slate-400">
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="focus:bg-teal-600/20 focus:text-teal-400 cursor-pointer">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="focus:bg-teal-600/20 focus:text-teal-400 cursor-pointer">
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-teal-600/20 focus:text-teal-400 cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-teal-600/20 focus:text-teal-400 cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

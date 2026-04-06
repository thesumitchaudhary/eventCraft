"use client";

import * as React from "react";
import {
  Calendar,
  DollarSign,
  ChartColumn,
  Palette,
  Shield,
  TrendingUp,
  Users,
  CircleUser,
  ClipboardList,
  LifeBuoy,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const data = {
  user: {
    name: "Admin User",
    email: "admin@eventcraft.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Event Craft Admin",
      logo: Shield,
      plan: "Control Center",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/admin/",
      icon: ChartColumn,
      isActive: true,
      items: [
        { title: "Today", url: "#" },
        { title: "Weekly", url: "#" },
        { title: "Monthly", url: "#" },
      ],
    },
        {
      title: "Analytics",
      url: "/admin/analytics",
      icon: TrendingUp,
      isActive: true,
      items: [
        { title: "Today", url: "#" },
        { title: "Weekly", url: "#" },
        { title: "Monthly", url: "#" },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customer",
      icon: Users,
      items: [
        { title: "Pending", url: "#" },
        { title: "Confirmed", url: "#" },
        { title: "Completed", url: "#" },
      ],
    },
       {
      title: "Bookings",
      url: "/admin/my-booking",
      icon: Calendar,
      items: [
        { title: "Pending", url: "#" },
        { title: "Confirmed", url: "#" },
        { title: "Completed", url: "#" },
      ],
    },
    {
      title: "Add Theme",
      url: "/admin/event-theme",
      icon: Palette,
      items: [
        { title: "Wedding", url: "#" },
        { title: "Corporate", url: "#" },
        { title: "Birthday", url: "#" },
      ],
    },
      {
      title: "Employees",
      url: "/admin/employees",
      icon: CircleUser,
      items: [
        { title: "Wedding", url: "#" },
        { title: "Corporate", url: "#" },
        { title: "Birthday", url: "#" },
      ],
    },
      {
      title: "Add Task",
      url: "/admin/add-tasks",
      icon: ClipboardList,
      items: [
        { title: "Wedding", url: "#" },
        { title: "Corporate", url: "#" },
        { title: "Birthday", url: "#" },
      ],
    },
    {
      title: "Revenue",
      url: "/admin/revenue",
      icon: DollarSign,
      items: [
        { title: "Invoices", url: "#" },
        { title: "Payouts", url: "#" },
        { title: "Disputes", url: "#" },
      ],
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Sheet>
          <SidebarMenu>
            <SidebarMenuItem>
              <SheetTrigger asChild>
                <SidebarMenuButton tooltip="Need Help?" size="lg">
                  <LifeBuoy />
                  <span>Need Help?</span>
                </SidebarMenuButton>
              </SheetTrigger>
            </SidebarMenuItem>
          </SidebarMenu>
          <SheetContent side={isMobile ? "bottom" : "right"} className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Admin Help Desk</SheetTitle>
              <SheetDescription>
                Share your issue and the support team will respond shortly.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4 text-sm text-muted-foreground">
              support@eventcraft.com
            </div>
          </SheetContent>
        </Sheet>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import {
  Cog,
  Command,
  GoalIcon,
  LayoutDashboardIcon,
  Workflow,
} from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  links: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Skills",
      url: "/dashboard/skills",
      icon: Workflow,
    },
    {
      name: "Goals",
      url: "/dashboard/goals",
      icon: GoalIcon,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: Cog,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Skill-Bridge</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks links={data.links} />
      </SidebarContent>
    </Sidebar>
  );
}

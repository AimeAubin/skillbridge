"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function NavLinks({
  links,
}: {
  links: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const currentPath = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {links.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                className={`flex items-center space-x-2 rounded-md p-2 ${
                  currentPath === item.url ? "bg-gray-200" : ""
                }`}
              >
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

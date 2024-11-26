"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserButton } from "./auth/user-button";

export function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserButton isMobile={isMobile} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

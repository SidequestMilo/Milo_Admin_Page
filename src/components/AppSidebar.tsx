"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  BarChart,
  Grid,
  Heart,
  MessageSquare,
  Radio,
  Settings,
  Users,
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const items = [
  { title: "Dashboard", url: "/", icon: Grid },
  { title: "Users", url: "/users", icon: Users },
  { title: "Segments", url: "/segments", icon: BarChart },
  { title: "Matches Analytics", url: "/matches", icon: Heart },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
  { title: "Bot Activity", url: "/bot-activity", icon: Activity },
  { title: "Broadcast", url: "/broadcast", icon: Radio },
  { title: "System Health", url: "/system-health", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/50">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            TB
          </div>
          <span className="truncate">Gateway Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="w-full justify-start text-sm transition-colors hover:text-foreground">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/50">
            <AvatarImage src="" alt="Admin" />
            <AvatarFallback className="bg-primary/10 text-primary uppercase text-xs">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Super Admin</span>
            <span className="text-xs text-muted-foreground">admin@lythe.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

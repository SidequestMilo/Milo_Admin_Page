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
      <SidebarHeader className="h-24 flex items-center px-4 border-none bg-transparent">
        <div className="flex items-center gap-4 font-semibold group cursor-pointer transition-all duration-500 hover:scale-[1.05]">
          <div className="relative flex h-16 w-16 items-center justify-center transition-transform duration-700 group-hover:rotate-3">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            <img 
              src="/milo_logo.png" 
              alt="Milo" 
              className="h-full w-full object-contain relative z-10"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors leading-none">Milo</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40 font-black mt-1">Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/40 px-4 uppercase text-[10px] font-bold tracking-widest mt-4">Platform</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="px-4">
                    <Link 
                      href={item.url} 
                      className="w-full justify-start text-sm transition-all duration-300 hover:pl-5 group relative overflow-hidden"
                    >
                      <item.icon className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
                      {pathname === item.url && (
                        <div className="absolute left-0 h-full w-1 bg-primary rounded-r-full animate-in slide-in-from-left duration-300" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-none p-4 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 group cursor-pointer">
          <Avatar className="h-10 w-10 border-none ring-2 ring-white/10 group-hover:ring-primary/20 transition-all">
            <AvatarImage src="/milo_logo.png" alt="Admin" className="object-cover" />
            <AvatarFallback className="bg-white/10 text-white font-bold">MA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight">Milo Admin</span>
            <span className="text-[11px] text-muted-foreground/60 font-medium">super@lythe.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

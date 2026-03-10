"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden w-full bg-background min-h-screen">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2 hover:bg-muted" />
            <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Additional Header Actions */}
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border/50">
              Environment: Production
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 xl:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

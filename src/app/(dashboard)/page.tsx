"use client";

import { useState, useEffect } from "react";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { getAnalytics } from "@/lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCharts } from "@/components/DashboardCharts";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: "0",
    totalUsersChange: "+0",
    activeUsers: "0",
    activeUsersChange: "+0%",
    totalMatches: "0",
    totalMatchesChange: "+0",
    newUsers: "0",
    newUsersChange: "+0",
  });

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response: any = await getAnalytics();
        if (!response) return;
        
        // Handle both flattened and nested response structures
        const data = response.metrics || response.data || response;
        
        if (data && typeof data === 'object') {
          setMetrics(prev => ({
            ...prev,
            totalUsers: (data.total_users ?? 0).toString(),
            activeUsers: (data.active_users_24h ?? 0).toString(),
            totalMatches: (data.total_matches ?? 0).toString(),
            newUsers: (data.new_users_today ?? 0).toString(),
          }));
        }
      } catch (err) {
        console.error("Failed to load top level dashboard metrics", err);
      }
    };
    fetchKPIs();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-white/[0.02] backdrop-blur-xl hover-scale animate-premium cursor-default relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="h-24 w-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
              Total Users
            </CardTitle>
            <div className="bg-white/5 p-2 rounded-xl">
              <Users className="h-4 w-4 text-white/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tighter">{metrics.totalUsers}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 font-bold border border-green-500/10">
                {metrics.totalUsersChange}
              </span>
              <p className="text-[10px] font-bold text-muted-foreground/30 tracking-widest uppercase">
                 Growth
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/[0.02] backdrop-blur-xl hover-scale animate-premium cursor-default relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="h-24 w-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
              Active Users
            </CardTitle>
            <div className="bg-white/5 p-2 rounded-xl">
              <Activity className="h-4 w-4 text-white/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tighter">{metrics.activeUsers}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/10">
                {metrics.activeUsersChange}
              </span>
              <p className="text-[10px] font-bold text-muted-foreground/30 tracking-widest uppercase">
                 24h Activity
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/[0.02] backdrop-blur-xl hover-scale animate-premium cursor-default relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard className="h-24 w-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
              Total Matches
            </CardTitle>
            <div className="bg-white/5 p-2 rounded-xl">
              <CreditCard className="h-4 w-4 text-white/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tighter">{metrics.totalMatches}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/10">
                {metrics.totalMatchesChange}
              </span>
              <p className="text-[10px] font-bold text-muted-foreground/30 tracking-widest uppercase">
                 Matching Eng.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/[0.02] backdrop-blur-xl hover-scale animate-premium cursor-default relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="h-24 w-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
              New Users
            </CardTitle>
            <div className="bg-white/5 p-2 rounded-xl">
              <Activity className="h-4 w-4 text-white/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white tracking-tighter">{metrics.newUsers}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-bold border border-orange-500/10">
                {metrics.newUsersChange}
              </span>
              <p className="text-[10px] font-bold text-muted-foreground/30 tracking-widest uppercase">
                 Recent Signups
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <DashboardCharts />
      </div>
    </div>
  );
}

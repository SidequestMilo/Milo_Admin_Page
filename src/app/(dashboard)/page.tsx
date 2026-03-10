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
        const response = await getAnalytics();
        const data = response.metrics || response.data?.metrics || response;
        if (data && typeof data === 'object') {
          if (data.total_users !== undefined) setMetrics(prev => ({ ...prev, totalUsers: data.total_users.toString() }));
          if (data.active_users_24h !== undefined) setMetrics(prev => ({ ...prev, activeUsers: data.active_users_24h.toString() }));
          if (data.total_matches !== undefined) setMetrics(prev => ({ ...prev, totalMatches: data.total_matches.toString() }));
          if (data.new_users_today !== undefined) setMetrics(prev => ({ ...prev, newUsers: data.new_users_today.toString() }));
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
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalUsersChange} from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users (24h)
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.activeUsersChange} since yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Matches
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.totalMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalMatchesChange} new matches this week
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Users Today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.newUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.newUsersChange} since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <DashboardCharts />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getConnections, getAnalytics, getUserSegments } from "@/lib/api";

const COLORS = ["#E4E4E7", "#A1A1AA", "#71717A", "#3F3F46"];

export function DashboardCharts() {
  const [matchActivityData, setMatchActivityData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [segmentsData, setSegmentsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [connRes, analyticsRes, segmentsRes] = await Promise.allSettled([
          getConnections(),
          getAnalytics(),
          getUserSegments()
        ]);
        
        if (connRes.status === 'fulfilled' && connRes.value) {
          const val = connRes.value as any;
          const d = Array.isArray(val) ? val : (val.connections || val.data || val.items || []);
          if (Array.isArray(d) && d.length > 0) setMatchActivityData(d);
        } else if (analyticsRes.status === 'fulfilled' && (analyticsRes.value as any)?.activity) {
          // Fallback: Use aggregated activity data from analytics if connections list isn't available/formatted
          const d = (analyticsRes.value as any).activity;
          if (Array.isArray(d) && d.length > 0) setMatchActivityData(d);
        }

        if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
          const val = analyticsRes.value as any;
          const d = val.growth || val.data?.growth || val.userGrowth || val.data;
          if (Array.isArray(d) && d.length > 0) setGrowthData(d);
        }

        if (segmentsRes.status === 'fulfilled' && segmentsRes.value) {
          const val = segmentsRes.value as any;
          let d = val.segments || val.data || val.items || val;
          
          if (!Array.isArray(d) && typeof d === 'object' && d !== null) {
            // Convert legacy {Students: 5, Developers: 2} object to [{name: 'Students', value: 5}, ...]
            d = Object.entries(d).map(([name, value]) => ({ 
              name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
              value 
            }));
          }
          
          if (Array.isArray(d) && d.length > 0) setSegmentsData(d);
        }

      } catch (error) {
        console.error("Failed to load dashboard data.");
      }
    };
    fetchDashboardData();
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4 border-border/50 bg-card/50 backdrop-blur shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">User Growth</CardTitle>
          <CardDescription>User acquisition over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full min-h-[300px]">
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E4E4E7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E4E4E7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2F" />
                <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }} 
                  itemStyle={{ color: "#E4E4E7" }}
                />
                <Area type="monotone" dataKey="users" stroke="#E4E4E7" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                No growth data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3 border-border/50 bg-card/50 backdrop-blur shadow-sm">
        <CardHeader>
          <CardTitle>User Demographics</CardTitle>
          <CardDescription>Category distribution across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full min-h-[300px]">
            {segmentsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {segmentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }} 
                  itemStyle={{ color: "#E4E4E7" }}
                />
                <Legend iconType="circle" formatter={(value) => <span style={{ color: '#E4E4E7' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                No demographic data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-7 border-border/50 bg-card/50 backdrop-blur shadow-sm mt-4">
        <CardHeader>
          <CardTitle>Matchmaking & Connections</CardTitle>
          <CardDescription>Matches generated vs accepted connections</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full min-h-[300px]">
            {matchActivityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2F" />
                <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }}
                  cursor={{ fill: "#2C2C2F", opacity: 0.4 }}
                />
                <Legend formatter={(value) => <span style={{ color: '#E4E4E7' }}>{value}</span>} />
                <Bar dataKey="matches" fill="#71717A" radius={[4, 4, 0, 0]} name="Total Matches" />
                <Bar dataKey="connection" fill="#E4E4E7" radius={[4, 4, 0, 0]} name="Successful Connections" />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                No matchmaking data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

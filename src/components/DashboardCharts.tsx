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
import { getMatchTrends, getAnalytics, getUserSegments } from "@/lib/api";

const COLORS = ["#E4E4E7", "#A1A1AA", "#71717A", "#3F3F46"];

export function DashboardCharts() {
  const [matchActivityData, setMatchActivityData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [segmentsData, setSegmentsData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [trendsRes, analyticsRes, segmentsRes] = await Promise.allSettled([
          getMatchTrends(),
          getAnalytics(),
          getUserSegments()
        ]);
        
        let activityData = [];
        if (trendsRes.status === 'fulfilled' && trendsRes.value) {
          const val = trendsRes.value as any;
          const d = val.trends || val.data?.trends || val.data || [];
          if (Array.isArray(d) && d.length > 0) {
            // Map backend trends to chart keys
            activityData = d.map((t: any) => ({
              name: t.date && typeof t.date === 'string' ? t.date.split('-').slice(1).join('/') : '??',
              matches: Number(t.generated || 0),
              connection: Number(t.success || 0)
            }));
          }
        }
        
        // Fallback to general analytics activity if trends are empty
        if (activityData.length === 0 && analyticsRes.status === 'fulfilled' && (analyticsRes.value as any)?.activity) {
          activityData = (analyticsRes.value as any).activity;
        }
        
        if (activityData.length > 0) {
          setMatchActivityData(activityData);
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
          <div style={{ height: "300px", width: "100%" }}>
            {isMounted && growthData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#E4E4E7" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="#E4E4E7" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2F" />
                 <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} hide={false} />
                 <YAxis 
                   stroke="#A1A1AA" 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false} 
                   tickFormatter={(value) => `${value}`}
                   domain={[0, 'auto']}
                 />
                 <Tooltip 
                   contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }} 
                   itemStyle={{ color: "#E4E4E7" }}
                 />
                 <Area type="monotone" dataKey="users" stroke="#E4E4E7" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" isAnimationActive={false} />
               </AreaChart>
             </ResponsiveContainer>
            ) : growthData.length === 0 && isMounted ? (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                No growth data available
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                Loading...
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
          <div style={{ height: "300px", width: "100%" }}>
            {isMounted && segmentsData.length > 0 ? (
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
            ) : segmentsData.length === 0 && isMounted ? (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                No demographic data available
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                Loading...
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
          <div style={{ height: "300px", width: "100%" }}>
            {isMounted && matchActivityData.length > 0 ? (
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
                 <Bar 
                   dataKey="matches" 
                   fill="#71717A" 
                   radius={[6, 6, 0, 0]} 
                   name="Total Matches" 
                   isAnimationActive={true}
                   animationDuration={1500}
                   className="hover:opacity-80 transition-opacity cursor-pointer"
                 />
                 <Bar 
                   dataKey="connection" 
                   fill="#E4E4E7" 
                   radius={[6, 6, 0, 0]} 
                   name="Successful Connections" 
                   isAnimationActive={true}
                   animationDuration={2000}
                   className="hover:opacity-80 transition-opacity cursor-pointer"
                 />
               </BarChart>
             </ResponsiveContainer>
            ) : matchActivityData.length === 0 && isMounted ? (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                No matchmaking data available
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                Loading...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

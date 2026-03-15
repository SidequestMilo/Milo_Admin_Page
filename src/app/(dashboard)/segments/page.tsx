"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getUserSegments } from "@/lib/api";

const COLORS = ["#E4E4E7", "#A1A1AA", "#71717A", "#52525B", "#3F3F46"];

export default function SegmentsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [segmentsData, setSegmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await getUserSegments();
        if (!response) {
          setSegmentsData([]);
          return;
        }
        // Extract array from either direct list or nested segments key
        let data = Array.isArray(response) ? response : (response.segments || response.data?.segments || response.data || response.items || []);
        
        if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
          // Fallback: Convert object to array if needed
          data = Object.entries(data).map(([name, value]) => ({ 
            name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value 
          }));
        }
        if (data && data.length > 0) {
          const formatted = data.map((s: any) => ({
            name: s.name || s.category || "Unknown",
            value: s.value || s.count || s.total || 0,
            successRate: s.successRate || s.success_rate || 0,
            engagement: s.engagement || s.engagement_score || 0,
          }));
          setSegmentsData(formatted);
        } else {
          setSegmentsData([]);
        }
      } catch (error) {
        console.error("Failed to load user segments", error);
        setSegmentsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Segments</h1>
          <p className="text-muted-foreground mt-1">Analyze different user categories and their engagement metrics.</p>
        </div>
      </div>

      <div className="flex gap-2 pb-4 overflow-x-auto">
        <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">All Users</Button>
        <Button variant="outline" className="border-border/50 bg-card/50 text-muted-foreground hover:text-foreground">Students</Button>
        <Button variant="outline" className="border-border/50 bg-card/50 text-muted-foreground hover:text-foreground">Startup Founders</Button>
        <Button variant="outline" className="border-border/50 bg-card/50 text-muted-foreground hover:text-foreground">Developers</Button>
        <Button variant="outline" className="border-border/50 bg-card/50 text-muted-foreground hover:text-foreground">Investors</Button>
        <Button variant="outline" className="border-border/50 bg-card/50 text-muted-foreground hover:text-foreground">Mentors</Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-muted border border-border/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Overview</TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Engagement Levels</TabsTrigger>
          <TabsTrigger value="success" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Connection Success</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm col-span-1">
                <CardHeader>
                  <CardTitle>Segment Distribution</CardTitle>
                  <CardDescription>Breakdown of user types on the platform</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center flex-col items-center">
                  <div className="h-[350px] w-full max-w-sm">
                    <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                      <PieChart>
                        <Pie
                          data={segmentsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
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
                        />
                        <Legend iconType="circle" formatter={(value) => <span style={{ color: '#E4E4E7' }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm col-span-1">
                <CardHeader>
                  <CardTitle>Top Categories List</CardTitle>
                  <CardDescription>Raw metrics per user segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[...segmentsData].sort((a,b)=>b.value-a.value).map((stat, idx) => (
                      <div key={`${stat.name}-${idx}`} className="flex items-center">
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium leading-none text-foreground">{stat.name}</p>
                          <p className="text-sm text-muted-foreground">{stat.value.toLocaleString()} active users</p>
                        </div>
                        <div className="flex gap-4 items-center">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {stat.engagement}% Engaged
                          </Badge>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            {stat.successRate}% Success
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm">
              <CardHeader>
                <CardTitle>Engagement Levels</CardTitle>
                <CardDescription>Daily active interaction rates across segments</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                  <BarChart data={segmentsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2F" />
                    <XAxis dataKey="name" stroke="#A1A1AA" tickLine={false} axisLine={false} />
                    <YAxis stroke="#A1A1AA" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }}
                      cursor={{ fill: "#2C2C2F", opacity: 0.4 }}
                    />
                    <Bar dataKey="engagement" fill="#E4E4E7" radius={[4, 4, 0, 0]} name="Engagement Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="success">
            <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm">
              <CardHeader>
                <CardTitle>Connection Success Rates</CardTitle>
                <CardDescription>Percentage of accepted matches out of total proposed</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                  <BarChart data={segmentsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2F" />
                    <XAxis dataKey="name" stroke="#A1A1AA" tickLine={false} axisLine={false} />
                    <YAxis stroke="#A1A1AA" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }}
                      cursor={{ fill: "#2C2C2F", opacity: 0.4 }}
                    />
                    <Bar dataKey="successRate" fill="#A1A1AA" radius={[4, 4, 0, 0]} name="Success Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

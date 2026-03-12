"use client";

import { useState, useEffect } from "react";
import { Activity, XCircle, CheckCircle, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getMatches, getMatchAnalytics, getMatchTrends } from "@/lib/api";


export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [trends, setTrends] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ generated: "0", connected: "0", skipped: "0", acceptance: "0%" });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, trendsRes]: any = await Promise.all([
          getMatchAnalytics(),
          getMatchTrends()
        ]);
        
        if (!statsRes) return;
        
        const data = statsRes.analytics || statsRes.data || statsRes;
        const trendsData = trendsRes.data || trendsRes.trends || trendsRes || [];
        
        // Use real trends if available, otherwise stay empty or keep minimal defaults
        setTrends(trendsData.history || trendsData.daily || []);
        setScores(trendsData.scores || []);
        
        setMetrics({
          generated: data.total_matches?.toString() || "0",
          connected: data.accepted?.toString() || "0",
          skipped: data.skipped?.toString() || "0",
          acceptance: `${data.success_rate ? (data.success_rate * 100).toFixed(1) : 0}%`
        });
      } catch (err) {
        console.error("Failed to fetch analytics");
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchRecentMatches = async () => {
      setLoading(true);
      try {
        const response: any = await getMatches({ limit: 20 });
        if (!response) {
          setMatches([]);
          return;
        }
        const data = Array.isArray(response) ? response : (response.matches || response.data || response.items || []);
        
        if (data.length > 0) {
          const flattenedMatches: any[] = [];
          data.forEach((session: any) => {
            if (session.match_data && Array.isArray(session.match_data.matches)) {
              session.match_data.matches.forEach((subMatch: any, idx: number) => {
                 flattenedMatches.push({
                   id: session._id ? `${session._id}_${idx}` : `m_${Math.random().toString(36).substring(7)}`,
                   user1: session.telegram_user_id || "Unknown",
                   user2: subMatch.user_id || "Unknown",
                   user2_name: subMatch.name && subMatch.name !== "Unknown" ? subMatch.name : (subMatch.data?.name || "Unknown"),
                   score: subMatch.score ? Math.round(subMatch.score * 100) : 0,
                   created_at: session.timestamp || new Date().toISOString(),
                   status: "Generated" // algorithm success state
                 });
              });
            } else if (session.user1 && session.user2) {
              flattenedMatches.push(session);
            }
          });
          setMatches(flattenedMatches.length > 0 ? flattenedMatches : data);
        } else {
          setMatches([]);
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentMatches();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Matchmaking Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights and metrics on algorithmic matching performance.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Generated</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.generated}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.connected}</div>
            <p className="text-xs text-muted-foreground mt-1">+8.2% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Skipped</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.skipped}</div>
            <p className="text-xs text-muted-foreground mt-1">+3% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acceptance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.acceptance}</div>
            <p className="text-xs text-muted-foreground mt-1">+2.4% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle>Match Success Over Time</CardTitle>
            <CardDescription>Generated matches vs Accepted connections</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E4E4E7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E4E4E7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSkipped" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3F3F46" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3F3F46" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2F" />
                <XAxis dataKey="date" stroke="#A1A1AA" tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }} 
                />
                <Area type="monotone" dataKey="success" stroke="#E4E4E7" fillOpacity={1} fill="url(#colorSuccess)" name="Accepted" />
                <Area type="monotone" dataKey="skipped" stroke="#52525B" fillOpacity={1} fill="url(#colorSkipped)" name="Skipped" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle>AI Compatibility Score Trend</CardTitle>
            <CardDescription>Average match score derived by the matching engine</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
              <LineChart data={scores} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2F" />
                <XAxis dataKey="date" stroke="#A1A1AA" tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7" }} 
                />
                <Line type="monotone" dataKey="score" stroke="#E4E4E7" strokeWidth={3} dot={{ fill: '#1A1A1D', stroke: '#E4E4E7', strokeWidth: 2, r: 4 }} name="Avg Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Recent Matches Feed
        </h2>
        <div className="rounded-md border border-border/50 bg-card/50 overflow-hidden shadow-sm backdrop-blur">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground w-[100px]">Match ID</TableHead>
                <TableHead className="text-muted-foreground">User 1</TableHead>
                <TableHead className="text-muted-foreground">User 2</TableHead>
                <TableHead className="text-muted-foreground">Compatibility</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    {loading ? "Loading matches..." : "No recent matches found."}
                  </TableCell>
                </TableRow>
              ) : (
                matches.map((match: any, index: number) => (
                  <TableRow key={match.id || match.match_id || index} className="border-border/50 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {match.id || match.match_id || `m_${index}`}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {match.user1_name || match.user1 || "Unknown User"}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {match.user2_name || match.user2 || "Unknown User"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${match.score || match.compatibility_score || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {match.score || match.compatibility_score || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {match.created_at || match.createdAt ? format(new Date(match.created_at || match.createdAt), "MMM d, h:mm a") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={
                          (match.status === "Accepted" || match.status === "accepted") ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                          (match.status === "Rejected" || match.status === "rejected") ? "bg-destructive/10 text-destructive border-destructive/20" : 
                          "bg-primary/5 text-primary border-primary/20"
                        }
                      >
                        {match.status || "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getFeedback } from "@/lib/api";
import { Star, MoreHorizontal, Download, Flag, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TRENDS_DATA: any[] = [];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      setLoading(true);
      try {
        const response: any = await getFeedback();
        const data = Array.isArray(response) ? response : (response.feedback || response.data || response.items || []);
        
        if (data && data.length > 0) {
          const formatted = data.map((f: any, i: number) => ({
            id: f.id || `f_${i}`,
            user: f.user_name || f.user || "Anonymous",
            type: f.user_type || f.type || "User",
            rating: f.rating || 0,
            message: f.message || f.text || "",
            timestamp: f.created_at || f.timestamp || new Date().toISOString(),
            status: f.status || "Open"
          }));
          setFeedbacks(formatted);
        } else {
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackData();
  }, []);

  const toggleStatus = (id: string, newStatus: string) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Feedback & Reviews</h1>
          <p className="text-muted-foreground mt-1">Review user feedback submitted directly from the Telegram bot.</p>
        </div>
        <Button variant="outline" className="border-border/50 bg-card/50">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-primary" fill="currentColor" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4.4 / 5.0</div>
            <p className="text-xs text-muted-foreground mt-1">+0.2 from last month</p>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 border-border/50 bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Feedback Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[120px] pb-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
              <BarChart data={TRENDS_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1D", borderColor: "#2C2C2F", color: "#E4E4E7", fontSize: '12px' }}
                  cursor={{ fill: "#2C2C2F", opacity: 0.4 }}
                />
                <Bar dataKey="count" fill="#E4E4E7" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50 overflow-hidden shadow-sm backdrop-blur mt-2">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Rating</TableHead>
              <TableHead className="text-muted-foreground w-1/2">Message</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  {loading ? "Loading feedback data..." : "No feedback records found."}
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map((f) => (
                <TableRow key={f.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {f.timestamp ? format(new Date(f.timestamp), "MMM d, HH:mm") : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{f.user}</span>
                      <span className="text-xs text-muted-foreground">{f.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{f.rating}</span>
                      <Star className="h-3 w-3 text-primary" fill="currentColor" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{f.message}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      ${f.status === 'Resolved' && 'bg-green-500/10 text-green-500 border-green-500/20'}
                      ${f.status === 'Open' && 'bg-blue-500/10 text-blue-500 border-blue-500/20'}
                      ${f.status === 'Flagged' && 'bg-destructive/10 text-destructive border-destructive/20'}
                    `}>
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border/50">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem onClick={() => toggleStatus(f.id, "Resolved")} className="cursor-pointer focus:bg-muted">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(f.id, "Flagged")} className="cursor-pointer focus:bg-muted">
                          <Flag className="mr-2 h-4 w-4 text-destructive" /> Flag Feedback
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

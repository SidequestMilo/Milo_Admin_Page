"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getActivity } from "@/lib/api";
import { Filter, Search, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BotActivityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCommand, setFilterCommand] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response: any = await getActivity({ 
          user: searchTerm, 
          command: filterCommand 
        });
        if (!response) {
          setLogs([]);
          return;
        }
        const data = Array.isArray(response) ? response : (response.logs || response.activity || response.data || response.items || []);
        
        if (data && data.length > 0) {
          const formatted = data.map((log: any, i: number) => ({
            id: log.id || `log_${i}`,
            user: log.user_name || log.user || log.telegram_id || "Unknown",
            command: log.command || "Unknown",
            timestamp: log.timestamp || log.created_at || new Date().toISOString(),
            api: log.api || log.endpoint || "Telegram Action",
            status: log.status === 'success' ? 200 : (log.status || log.status_code || 200),
          }));
          setLogs(formatted);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce active searching
    const timer = setTimeout(() => {
      fetchLogs();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCommand]);

  const filteredLogs = logs;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bot Activity</h1>
          <p className="text-muted-foreground mt-1">Monitor Telegram gateway interaction logs and API responses in real-time.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-1 min-w-[300px] max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs by user or API..."
            className="pl-9 bg-card/50 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-muted/30 rounded-lg border border-border/50">
          {["", "/start", "/profile", "/connect", "/matches"].map(cmd => (
            <Button 
              key={cmd || "all"} 
              variant={filterCommand === cmd ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilterCommand(cmd)}
              className={filterCommand === cmd ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}
            >
              {cmd || "All Logs"}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50 overflow-hidden shadow-sm backdrop-blur inline-block w-full">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground w-[180px]">Timestamp</TableHead>
              <TableHead className="text-muted-foreground">User / Source</TableHead>
              <TableHead className="text-muted-foreground">Command Issued</TableHead>
              <TableHead className="text-muted-foreground">API Called</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  {loading ? "Loading logs..." : "No bot activity found matching your criteria."}
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-border/50 hover:bg-muted/30 transition-colors font-mono text-xs">
                  <TableCell className="text-muted-foreground">
                    {log.timestamp ? format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss") : "-"}
                  </TableCell>
                  <TableCell className="font-sans font-medium text-foreground">{log.user}</TableCell>
                  <TableCell>
                    <span className="bg-muted text-primary px-2 py-1 rounded inline-flex items-center gap-1">
                      <Terminal className="h-3 w-3" />
                      {log.command}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[300px]">{log.api}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      ${log.status >= 200 && log.status < 300 && 'bg-green-500/10 text-green-500 border-green-500/20'}
                      ${log.status >= 400 && log.status < 500 && 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                      ${log.status >= 500 && 'bg-destructive/10 text-destructive border-destructive/20'}
                    `}>
                      {log.status === 201 ? '201 Created' : log.status === 200 ? '200 OK' : log.status === 400 ? '400 Bad Req' : '500 Error'}
                    </Badge>
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

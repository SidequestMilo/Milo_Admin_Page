"use client";

import { useEffect, useState, useMemo } from "react";
import { getSystemHealth, getSystemResources } from "@/lib/api";
import { CheckCircle, XCircle, Clock, Server, Database, HardDrive, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SYSTEM_SERVICES = [
  { id: "api", name: "FastAPI Backend", type: "Core API", status: "Operational", uptime: 99.98, latency: 120, icon: Server },
  { id: "mongo", name: "MongoDB Atlas", type: "Database", status: "Operational", uptime: 99.95, latency: 45, icon: Database },
  { id: "redis", name: "Redis Cache", type: "Memory Store", status: "Operational", uptime: 99.99, latency: 12, icon: HardDrive },
  { id: "ai", name: "AI Interpretation", type: "Microservice", status: "Degraded", uptime: 98.45, latency: 850, icon: BrainCircuit },
];

export default function SystemHealthPage() {
  const [services, setServices] = useState<any[]>(SYSTEM_SERVICES);
  const [resources, setResources] = useState<any>({ cpu: 45, memory: { used: 2, total: 4, percent: 50 }, redis: 80 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const [healthRes, resourcesRes]: any = await Promise.all([
          getSystemHealth(),
          getSystemResources()
        ]);
        
        if (!healthRes) return;
        const data = Array.isArray(healthRes) ? healthRes : (healthRes.services || healthRes.data || []);
        if (data.length > 0) {
          const formatted = data.map((s: any) => ({
            ...s,
            icon: s.id === 'api' ? Server : s.id === 'mongo' ? Database : s.id === 'redis' ? HardDrive : BrainCircuit
          }));
          setServices(formatted);
        }

        if (resourcesRes) {
          setResources(resourcesRes.data || resourcesRes);
        }
      } catch (e) {
        console.error("Failed to load system health, using fallback.");
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const allOperational = useMemo(() => services.every(s => s.status === 'Operational' || s.status === 'ok' || s.status === 'healthy'), [services]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Health</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of backend microservices and databases.</p>
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50 overflow-hidden shadow-sm backdrop-blur p-6 flex flex-col items-center justify-center min-h-[150px]">
        {allOperational ? (
          <>
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">All Systems Operational</h2>
            <p className="text-muted-foreground mt-1">No degraded services reported.</p>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-500/20">
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-yellow-500">Service Degraded</h2>
            <p className="text-muted-foreground mt-1">We are currently experiencing issues with some microservices.</p>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2">
        {services.map((service, index) => {
          const Icon = service.icon || Server;
          return (
          <Card key={service.id || index} className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium text-foreground">{service.name}</CardTitle>
              </div>
              {service.status === 'Operational' || service.status === 'ok' || service.status === 'healthy' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-yellow-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2 mt-4">
                <span className="text-xs text-muted-foreground">Uptime</span>
                <span className="text-sm font-semibold">{service.uptime}%</span>
              </div>
              <Progress value={service.uptime} className="h-1 mb-4 bg-muted" />
              
              <div className="flex justify-between items-end">
                <span className="text-xs text-muted-foreground">Latency</span>
                <span className={`text-sm font-mono font-medium ${service.latency > 500 ? 'text-yellow-500' : 'text-foreground'}`}>
                  {service.latency}ms
                </span>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>Server CPU and Memory limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">API Server CPU</span>
                <span className="text-muted-foreground">{resources.cpu}%</span>
              </div>
              <Progress value={resources.cpu} className="h-2 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">API Server Memory</span>
                <span className="text-muted-foreground">{resources.memory.used}GB / {resources.memory.total}GB ({resources.memory.percent}%)</span>
              </div>
              <Progress value={resources.memory.percent} className="h-2 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">Redis Cluster Memory</span>
                <span className="text-muted-foreground">{resources.redis}%</span>
              </div>
              <Progress value={resources.redis} className={`h-2 bg-muted ${resources.redis > 75 ? '[&>div]:bg-yellow-500' : ''}`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

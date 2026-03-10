"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call to auth
    setTimeout(() => {
      if (email === "admin@lythe.com" && password === "admin") {
        // Set the active admin token that matches the backend's `verify_admin` static token.
        document.cookie = "admin_token=dev_admin_token; path=/";
        // Redirect to dashboard
        router.push("/");
      } else {
        setError("Invalid credentials. Try admin@lythe.com / admin");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Lythe Admin Gateway</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage the Telegram Bot ecosystem.</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your email and password to access the panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9 bg-input/50 border-border/50 focus:bg-background transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-input/50 border-border/50 focus:bg-background transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

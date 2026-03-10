"use client";

import { useState } from "react";
import { Send, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BroadcastPage() {
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("announcement");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setMessage("");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications & Broadcasts</h1>
          <p className="text-muted-foreground mt-1">Send targeted messages directly to Telegram users.</p>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Compose Broadcast
          </CardTitle>
          <CardDescription>Setup your audience and draft the message to broadcast via bot.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-foreground">Target Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger id="audience" className="bg-input/50 border-border/50 focus:bg-background transition-colors">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="founders">Startup Founders Only</SelectItem>
                    <SelectItem value="location">Location Based (USA)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Select an audience segment to dispatch your message.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Message Type</Label>
                <RadioGroup defaultValue="announcement" value={type} onValueChange={setType} className="grid grid-cols-1 gap-2 pt-2">
                  <div className="flex items-center space-x-2 border border-border/50 p-3 rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="text" id="type-text" />
                    <Label htmlFor="type-text" className="font-normal cursor-pointer text-foreground flex-1">Standard Text</Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border/50 p-3 rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="announcement" id="type-ann" />
                    <Label htmlFor="type-ann" className="font-normal cursor-pointer text-foreground flex-1 flex justify-between items-center">
                      Announcement
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Includes Header</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border/50 p-3 rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                    <RadioGroupItem value="update" id="type-upd" />
                    <Label htmlFor="type-upd" className="font-normal cursor-pointer text-foreground flex-1 flex justify-between items-center">
                      Feature Update
                      <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">Includes Emojis</Badge>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">Message Body (Markdown supported)</Label>
              <Textarea 
                id="message" 
                placeholder="Type your message here..." 
                className="h-[250px] resize-none bg-input/50 border-border/50 focus:bg-background transition-colors"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/50 bg-muted/10 p-6">
          <div className="text-sm text-muted-foreground flex items-center">
            {sent ? <Badge className="bg-green-500 hover:bg-green-600 text-white">Broadcast Sent Successfully</Badge> : 'Ready to securely dispatch.'}
          </div>
          <Button 
            onClick={handleSend} 
            disabled={!message || loading}
            className="w-full md:w-auto"
          >
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {loading ? "Sending..." : "Dispatch Broadcast"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Broadcast History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded bg-muted/30 border border-border/50">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm text-foreground">Welcome to the new matching engine!</span>
                <span className="text-xs text-muted-foreground">Audience: All Users • Type: Feature Update</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">Today, 10:45 AM</span>
                <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">Success (12,340)</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 rounded bg-muted/30 border border-border/50">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm text-foreground">Important: Scheduled Maintenance</span>
                <span className="text-xs text-muted-foreground">Audience: All Users • Type: Announcement</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">Oct 28, 08:00 PM</span>
                <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">Success (11,850)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

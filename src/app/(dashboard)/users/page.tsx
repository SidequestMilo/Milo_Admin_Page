"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getUsers, getUserById, getUserPreferences } from "@/lib/api";
import { Search, SlidersHorizontal, User, Shield, Briefcase, MapPin, Calendar, Heart } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingUserDetails, setIsFetchingUserDetails] = useState(false);

  const handleViewProfile = async (user: any) => {
    setSelectedUser(user);
    setIsFetchingUserDetails(true);
    try {
      const dbId = user.id.replace('tg_', ''); // Try normalize ID if mock
      const [userRes, prefsRes]: any = await Promise.allSettled([
        getUserById(dbId),
        getUserPreferences(dbId)
      ]);
      
      let updatedUser = { ...user };
      
      if (userRes.status === 'fulfilled') {
        const u = userRes.value.user || userRes.value.data || userRes.value;
        updatedUser = {
          ...updatedUser,
          name: u.name || updatedUser.name,
          username: u.username || updatedUser.username,
          location: u.location || updatedUser.location,
          occupation: u.occupation || updatedUser.occupation,
          goals: u.goals || updatedUser.goals,
          type: u.occupation || updatedUser.type,
        };
      }
      
      if (prefsRes.status === 'fulfilled') {
        const p = prefsRes.value.preferences || prefsRes.value.data || prefsRes.value;
        updatedUser = {
          ...updatedUser,
          interests: p.interests || updatedUser.interests || [],
          preferences: p.skills || p.preferences || updatedUser.preferences || [],
          goals: p.goals ? p.goals.join(', ') : updatedUser.goals,
        };
      }
      
      setSelectedUser((prev: any) => prev ? updatedUser : prev);
    } catch (error) {
      console.error("Failed to fetch detailed user info:", error);
    } finally {
      setIsFetchingUserDetails(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response: any = await getUsers({ search: searchTerm });
        // Ensure we extract an array from the response safely
        const data = Array.isArray(response) ? response : (response.users || response.data || response.items || []);
        
        // Map the backend data to match our UI expectations
        const formattedData = data.map((u: any) => ({
          id: u.telegram_id || u.id || u._id || `tg_${Math.floor(Math.random() * 100000)}`,
          username: u.username || `@${u.first_name || 'user'}`.toLowerCase(),
          name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || "Unknown",
          type: u.occupation || u.user_type || u.type || "Standard",
          location: u.location || "Unknown",
          occupation: u.occupation || "-",
          joinDate: u.created_at || u.joinDate || new Date().toISOString(),
          matches: u.matches || 0,
          status: u.status || "Active",
          preferences: u.preferences || [],
          interests: u.interests || [],
          goals: u.goals || "-"
        }));
        
        // Use mapped data
        setUsers(formattedData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // Ensure table is empty if fetching fails entirely
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredUsers = users;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage Telegram bot users, view profiles, and access matching history.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, username, or type..."
            className="pl-9 bg-card/50 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-border/50 bg-card/50">
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50 overflow-hidden shadow-sm backdrop-blur">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground">Telegram ID</TableHead>
              <TableHead className="text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Matches</TableHead>
              <TableHead className="text-muted-foreground">Joined</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{user.location}</TableCell>
                  <TableCell className="text-foreground font-medium">{user.matches}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(user.joinDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "destructive"} 
                           className={user.status === "Active" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : ""}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewProfile(user)} className="text-primary hover:text-primary hover:bg-primary/10">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[550px] bg-card border-border/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Profile
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              Detailed view of Telegram user data & preferences.
              {isFetchingUserDetails && <span className="text-primary animate-pulse ml-2 text-xs">(Updating details...)</span>}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold uppercase border border-primary/20">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20">{selectedUser.type}</Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{selectedUser.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><Briefcase className="h-4 w-4" /> Occupation</div>
                    <span className="font-medium">{selectedUser.occupation}</span>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><MapPin className="h-4 w-4" /> Location</div>
                    <span className="font-medium">{selectedUser.location}</span>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><Heart className="h-4 w-4" /> Matches</div>
                    <span className="font-medium">{selectedUser.matches} successful connections</span>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><Calendar className="h-4 w-4" /> Joined</div>
                    <span className="font-medium">{format(new Date(selectedUser.joinDate), "MMM d, yyyy")}</span>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 pt-2 border-t border-border/50">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4" /> Goals & Interests</h4>
                  <p className="text-sm text-muted-foreground mb-3">{selectedUser.goals}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.interests?.map((i: string) => (
                      <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground">{i}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Match Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.preferences?.map((p: string) => (
                      <Badge key={p} variant="outline" className="border-border/50 text-muted-foreground">{p}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

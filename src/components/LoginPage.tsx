import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { loginAsStakeholder, loginAsAdmin } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleStakeholderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsStakeholder(email, password)) {
      toast({ title: "Welcome back", description: "Your catalog is ready." });
    } else {
      toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsAdmin(adminPassword)) {
      toast({ title: "Admin access granted" });
    } else {
      toast({ title: "Access denied", description: "Invalid admin password.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">Sign in to view your personalized catalog</p>
        </div>

        <Card className="shadow-lg border-border">
          <Tabs defaultValue="stakeholder">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stakeholder">Team Member</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="stakeholder" className="mt-0">
                <CardTitle className="text-lg mb-1">Team Member Login</CardTitle>
                <CardDescription className="mb-4">Access your personalized product catalog</CardDescription>
                <form onSubmit={handleStakeholderLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full">Sign In</Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="mt-0">
                <CardTitle className="text-lg mb-1">Admin Access</CardTitle>
                <CardDescription className="mb-4">Manage products and team member visibility</CardDescription>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-pw">Admin Password</Label>
                    <Input id="admin-pw" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full">Access Dashboard</Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo credentials — Stakeholder: sarah@acmecorp.com / acme2024 · Admin: admin123
        </p>
      </div>
    </div>
  );
}

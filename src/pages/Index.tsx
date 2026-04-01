import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import CatalogPage from "@/components/CatalogPage";
import AdminDashboard from "@/components/AdminDashboard";

export default function Index() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage />;
  if (isAdmin) return <AdminDashboard />;
  return <CatalogPage />;
}

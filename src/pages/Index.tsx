import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import CatalogPage from "@/components/CatalogPage";
import AdminDashboard from "@/components/AdminDashboard";

export default function Index() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <LoginPage />;
  if (isAdmin) return <AdminDashboard />;
  return <CatalogPage />;
}

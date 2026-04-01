import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProducts, saveProduct, deleteProduct as deleteProductApi,
  getProfiles, getAllProductVisibility, toggleProductVisibility, setProductVisibility,
  Product, Profile,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Pencil, Trash2, Eye, Users, Package } from "lucide-react";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [visibility, setVisibility] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [p, pr, v] = await Promise.all([getProducts(), getProfiles(), getAllProductVisibility()]);
    setProducts(p);
    setProfiles(pr);
    setVisibility(v);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-serif">Admin Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={logout} className="text-primary-foreground hover:bg-primary/80">
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card><CardContent className="pt-6 text-center"><Package className="h-6 w-6 mx-auto mb-2 text-accent" /><p className="text-2xl font-bold">{products.length}</p><p className="text-sm text-muted-foreground">Products</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Users className="h-6 w-6 mx-auto mb-2 text-accent" /><p className="text-2xl font-bold">{profiles.length}</p><p className="text-sm text-muted-foreground">Team Members</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Eye className="h-6 w-6 mx-auto mb-2 text-accent" /><p className="text-2xl font-bold">{[...new Set(products.map(p => p.category))].length}</p><p className="text-sm text-muted-foreground">Categories</p></CardContent></Card>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="stakeholders">Team Members</TabsTrigger>
            <TabsTrigger value="visibility">Visibility Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab products={products} profiles={profiles} visibility={visibility} onRefresh={refresh} />
          </TabsContent>
          <TabsContent value="stakeholders">
            <StakeholdersTab profiles={profiles} />
          </TabsContent>
          <TabsContent value="visibility">
            <VisibilityTab products={products} profiles={profiles} visibility={visibility} onRefresh={refresh} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductsTab({ products, profiles, visibility, onRefresh }: { products: Product[]; profiles: Profile[]; visibility: Record<string, string[]>; onRefresh: () => void }) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (await deleteProductApi(id)) {
      toast({ title: "Product deleted" });
      onRefresh();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif">Products</h2>
        <ProductFormDialog profiles={profiles} onSave={onRefresh} />
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-16 h-12 rounded object-cover bg-muted" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{product.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  <span className="text-xs text-muted-foreground">· Visible to {(visibility[product.id] || []).length} team member(s)</span>
                </div>
              </div>
              <ProductFormDialog product={product} profiles={profiles} visibleTo={visibility[product.id] || []} onSave={onRefresh} />
              <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductFormDialog({ product, profiles, visibleTo, onSave }: { product?: Product; profiles: Profile[]; visibleTo?: string[]; onSave: () => void }) {
  const { toast } = useToast();
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    image: product?.image || "",
    specs: product ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : "",
    visibleTo: visibleTo || [],
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.category) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const specs: Record<string, string> = {};
    form.specs.split("\n").filter(Boolean).forEach((line) => {
      const [k, ...v] = line.split(":");
      if (k && v.length) specs[k.trim()] = v.join(":").trim();
    });

    const saved = await saveProduct({
      id: product?.id,
      name: form.name,
      description: form.description,
      category: form.category,
      image: form.image || "",
      specs,
    });

    if (saved) {
      await setProductVisibility(saved.id, form.visibleTo);
      toast({ title: isEdit ? "Product updated" : "Product added" });
      onSave();
    } else {
      toast({ title: "Error saving product", variant: "destructive" });
    }
    setSaving(false);
  };

  const toggleVis = (userId: string) => {
    setForm((f) => ({
      ...f,
      visibleTo: f.visibleTo.includes(userId)
        ? f.visibleTo.filter((id) => id !== userId)
        : [...f.visibleTo, userId],
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        ) : (
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif">{isEdit ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="space-y-2"><Label>Category *</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div className="space-y-2"><Label>Specs (one per line, Key: Value)</Label><Textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={4} /></div>
          <div className="space-y-2">
            <Label>Visible to</Label>
            <div className="space-y-2">
              {profiles.filter(p => p.name !== "Admin").map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.visibleTo.includes(p.id)} onCheckedChange={() => toggleVis(p.id)} />
                  {p.name} ({p.company})
                </label>
              ))}
            </div>
          </div>
          <DialogClose asChild>
            <Button onClick={handleSubmit} className="w-full" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StakeholdersTab({ profiles }: { profiles: Profile[] }) {
  const stakeholders = profiles.filter(p => p.name !== "Admin");
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif">Team Members</h2>
      </div>
      <div className="space-y-3">
        {stakeholders.map((s) => (
          <Card key={s.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                {s.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.email} · {s.company}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VisibilityTab({ products, profiles, visibility, onRefresh }: { products: Product[]; profiles: Profile[]; visibility: Record<string, string[]>; onRefresh: () => void }) {
  const stakeholders = profiles.filter(p => p.name !== "Admin");

  const handleToggle = async (productId: string, userId: string) => {
    await toggleProductVisibility(productId, userId);
    onRefresh();
  };

  const selectAllForMember = async (userId: string) => {
    for (const p of products) {
      if (!(visibility[p.id] || []).includes(userId)) {
        await toggleProductVisibility(p.id, userId);
      }
    }
    onRefresh();
  };

  const deselectAllForMember = async (userId: string) => {
    for (const p of products) {
      if ((visibility[p.id] || []).includes(userId)) {
        await toggleProductVisibility(p.id, userId);
      }
    }
    onRefresh();
  };

  const allSelected = (userId: string) => products.every(p => (visibility[p.id] || []).includes(userId));

  return (
    <div>
      <h2 className="text-2xl font-serif mb-4">Visibility Matrix</h2>
      <p className="text-sm text-muted-foreground mb-4">Toggle which products each team member can see.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-4 font-medium text-foreground">Product</th>
              {stakeholders.map((s) => (
                <th key={s.id} className="text-center py-3 px-3 font-medium text-foreground whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1">
                    {s.name.split(" ")[0]}
                    <Button variant="outline" size="sm" className="text-xs h-6 px-2"
                      onClick={() => allSelected(s.id) ? deselectAllForMember(s.id) : selectAllForMember(s.id)}>
                      {allSelected(s.id) ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border">
                <td className="py-3 pr-4 text-foreground">{product.name}</td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="text-center py-3 px-3">
                    <Checkbox
                      checked={(visibility[product.id] || []).includes(s.id)}
                      onCheckedChange={() => handleToggle(product.id, s.id)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

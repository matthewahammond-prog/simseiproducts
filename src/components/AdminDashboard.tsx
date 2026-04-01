import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProducts, saveProducts, getStakeholders, saveStakeholders,
  Product, Stakeholder, generateId,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(getStakeholders());
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setProducts(getProducts());
    setStakeholders(getStakeholders());
    setRefreshKey((k) => k + 1);
  };

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
          <Card><CardContent className="pt-6 text-center"><Users className="h-6 w-6 mx-auto mb-2 text-accent" /><p className="text-2xl font-bold">{stakeholders.length}</p><p className="text-sm text-muted-foreground">Stakeholders</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Eye className="h-6 w-6 mx-auto mb-2 text-accent" /><p className="text-2xl font-bold">{[...new Set(products.map(p => p.category))].length}</p><p className="text-sm text-muted-foreground">Categories</p></CardContent></Card>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="visibility">Visibility Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab products={products} stakeholders={stakeholders} onRefresh={refresh} />
          </TabsContent>
          <TabsContent value="stakeholders">
            <StakeholdersTab stakeholders={stakeholders} onRefresh={refresh} />
          </TabsContent>
          <TabsContent value="visibility">
            <VisibilityTab products={products} stakeholders={stakeholders} onRefresh={refresh} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductsTab({ products, stakeholders, onRefresh }: { products: Product[]; stakeholders: Stakeholder[]; onRefresh: () => void }) {
  const { toast } = useToast();

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    onRefresh();
    toast({ title: "Product deleted" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif">Products</h2>
        <ProductFormDialog stakeholders={stakeholders} onSave={onRefresh} />
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <img src={product.image} alt={product.name} className="w-16 h-12 rounded object-cover bg-muted" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{product.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  
                  <span className="text-xs text-muted-foreground">· Visible to {product.visibleTo.length} stakeholder(s)</span>
                </div>
              </div>
              <ProductFormDialog product={product} stakeholders={stakeholders} onSave={onRefresh} />
              <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductFormDialog({ product, stakeholders, onSave }: { product?: Product; stakeholders: Stakeholder[]; onSave: () => void }) {
  const { toast } = useToast();
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    
    image: product?.image || "",
    specs: product ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : "",
    visibleTo: product?.visibleTo || [],
  });

  const handleSubmit = () => {
    if (!form.name || !form.category) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    const specs: Record<string, string> = {};
    form.specs.split("\n").filter(Boolean).forEach((line) => {
      const [k, ...v] = line.split(":");
      if (k && v.length) specs[k.trim()] = v.join(":").trim();
    });

    const newProduct: Product = {
      id: product?.id || generateId(),
      name: form.name,
      description: form.description,
      category: form.category,
      
      image: form.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      specs,
      visibleTo: form.visibleTo,
    };

    const products = getProducts();
    if (isEdit) {
      const idx = products.findIndex((p) => p.id === product.id);
      if (idx >= 0) products[idx] = newProduct;
    } else {
      products.push(newProduct);
    }
    saveProducts(products);
    onSave();
    toast({ title: isEdit ? "Product updated" : "Product added" });
  };

  const toggleVisibility = (stakeholderId: string) => {
    setForm((f) => ({
      ...f,
      visibleTo: f.visibleTo.includes(stakeholderId)
        ? f.visibleTo.filter((id) => id !== stakeholderId)
        : [...f.visibleTo, stakeholderId],
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
        <DialogHeader>
          <DialogTitle className="font-serif">{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Price *</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Specs (one per line, format: Key: Value)</Label>
            <Textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Visible to</Label>
            <div className="space-y-2">
              {stakeholders.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.visibleTo.includes(s.id)} onCheckedChange={() => toggleVisibility(s.id)} />
                  {s.name} ({s.company})
                </label>
              ))}
            </div>
          </div>
          <DialogClose asChild>
            <Button onClick={handleSubmit} className="w-full">{isEdit ? "Save Changes" : "Add Product"}</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StakeholdersTab({ stakeholders, onRefresh }: { stakeholders: Stakeholder[]; onRefresh: () => void }) {
  const { toast } = useToast();

  const deleteStakeholder = (id: string) => {
    const updated = stakeholders.filter((s) => s.id !== id);
    saveStakeholders(updated);
    // Also remove from product visibility
    const products = getProducts();
    products.forEach((p) => {
      p.visibleTo = p.visibleTo.filter((sid) => sid !== id);
    });
    saveProducts(products);
    onRefresh();
    toast({ title: "Stakeholder removed" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif">Stakeholders</h2>
        <StakeholderFormDialog onSave={onRefresh} />
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
              <StakeholderFormDialog stakeholder={s} onSave={onRefresh} />
              <Button variant="ghost" size="icon" onClick={() => deleteStakeholder(s.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StakeholderFormDialog({ stakeholder, onSave }: { stakeholder?: Stakeholder; onSave: () => void }) {
  const { toast } = useToast();
  const isEdit = !!stakeholder;
  const [form, setForm] = useState({
    name: stakeholder?.name || "",
    email: stakeholder?.email || "",
    company: stakeholder?.company || "",
    password: stakeholder?.password || "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    const all = getStakeholders();
    if (isEdit) {
      const idx = all.findIndex((s) => s.id === stakeholder.id);
      if (idx >= 0) all[idx] = { ...stakeholder, ...form };
    } else {
      all.push({ id: generateId(), ...form });
    }
    saveStakeholders(all);
    onSave();
    toast({ title: isEdit ? "Stakeholder updated" : "Stakeholder added" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        ) : (
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Stakeholder</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">{isEdit ? "Edit Stakeholder" : "Add Stakeholder"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
          <div className="space-y-2"><Label>Password *</Label><Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <DialogClose asChild>
            <Button onClick={handleSubmit} className="w-full">{isEdit ? "Save Changes" : "Add Stakeholder"}</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VisibilityTab({ products, stakeholders, onRefresh }: { products: Product[]; stakeholders: Stakeholder[]; onRefresh: () => void }) {
  const { toast } = useToast();

  const toggleVisibility = (productId: string, stakeholderId: string) => {
    const allProducts = getProducts();
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;
    if (product.visibleTo.includes(stakeholderId)) {
      product.visibleTo = product.visibleTo.filter((id) => id !== stakeholderId);
    } else {
      product.visibleTo.push(stakeholderId);
    }
    saveProducts(allProducts);
    onRefresh();
  };

  return (
    <div>
      <h2 className="text-2xl font-serif mb-4">Visibility Matrix</h2>
      <p className="text-sm text-muted-foreground mb-4">Toggle which products each stakeholder can see in their catalog.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-4 font-medium text-foreground">Product</th>
              {stakeholders.map((s) => (
                <th key={s.id} className="text-center py-3 px-3 font-medium text-foreground whitespace-nowrap">
                  {s.name.split(" ")[0]}
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
                      checked={product.visibleTo.includes(s.id)}
                      onCheckedChange={() => toggleVisibility(product.id, s.id)}
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

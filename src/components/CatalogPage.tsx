import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsForStakeholder, getCategories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogOut, Search } from "lucide-react";

export default function CatalogPage() {
  const { stakeholder, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const products = useMemo(
    () => (stakeholder ? getProductsForStakeholder(stakeholder.id) : []),
    [stakeholder]
  );

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-serif">Product Catalog</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-80 hidden sm:inline">
              {stakeholder?.name} · {stakeholder?.company}
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-primary-foreground hover:bg-primary/80">
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary text-primary-foreground pb-12 pt-8">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif mb-2">
            Welcome, {stakeholder?.name?.split(" ")[0]}
          </h2>
          <p className="text-primary-foreground/70 mb-6">
            Your curated selection — {products.length} product{products.length !== 1 ? "s" : ""} available
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-primary-foreground text-foreground border-0"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Category filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No products match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

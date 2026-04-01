import { Product } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden border-border hover:shadow-lg transition-all duration-300">
          <div className="aspect-[3/2] overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-5">
            <Badge variant="secondary" className="mb-2 text-xs font-medium">
              {product.category}
            </Badge>
            <h3 className="font-serif text-xl text-foreground mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
            
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-[3/2] rounded-lg overflow-hidden bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <Badge variant="secondary" className="mb-3">{product.category}</Badge>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Specifications</h4>
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

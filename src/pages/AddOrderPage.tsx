import { useEffect, useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { productsAPI, ordersAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

export default function AddOrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<{ productId: number; qty: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data || []);
      } catch (err: any) {
        console.error(err);
        toast.error('Impossible de charger les produits');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addLine = () => {
    if (!selectedProduct) return toast.error('Sélectionnez un produit');
    setItems((s) => [...s, { productId: selectedProduct!, qty: Math.max(1, quantity) }]);
  };

  const removeLine = (index: number) => {
    setItems((s) => s.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (items.length === 0) return toast.error('Ajoutez au moins une ligne de commande');
    try {
      const payload = {
        customer_email: customerEmail || undefined,
        items: items.map((it) => ({ product_id: it.productId, quantity: it.qty })),
      };
      const res = await ordersAPI.create(payload);
      toast.success('Commande créée ✅');
      // redirect to orders list
      window.location.href = '/orders';
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Erreur lors de la création');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Ajouter une commande</h1>
            <p className="text-sm text-gray-600">Créez manuellement une commande pour un client</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Produits</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select className="flex-1 rounded-xl border p-2" onChange={(e) => setSelectedProduct(Number(e.target.value))}>
                        <option value="">Sélectionnez un produit...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} — {p.price}</option>
                        ))}
                      </select>
                      <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-24" />
                      <Button onClick={addLine}>Ajouter</Button>
                    </div>

                    <div className="space-y-2">
                      {items.map((it, idx) => {
                        const p = products.find((x) => x.id === it.productId);
                        return (
                          <div key={idx} className="flex items-center justify-between p-2 border rounded-xl">
                            <div>
                              <div className="font-semibold">{p?.name || `#${it.productId}`}</div>
                              <div className="text-sm text-gray-500">Quantité: {it.qty}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => removeLine(idx)}>Supprimer</Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label className="block text-sm">Email du client</label>
                  <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                  <div className="pt-4">
                    <Button onClick={submit} className="w-full">Créer la commande</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

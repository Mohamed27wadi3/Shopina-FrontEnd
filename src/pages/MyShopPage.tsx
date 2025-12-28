import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export function MyShopPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shop, setShop] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(user?.shop_name || "Ma Boutique");
  const [description, setDescription] = useState("Commencez à vendre dès aujourd'hui avec Shopina");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone_number || "");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE}/shop/api/my-shop/`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });
        if (!ignore) {
          if (res.status === 200) {
            const data = await res.json();
            setShop(data);
          } else if (res.status === 404) {
            setShop(null);
          } else if (res.status === 401) {
            setError("Veuillez vous connecter pour gérer votre boutique.");
          } else {
            const text = await res.text();
            setError(text || "Erreur inattendue");
          }
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Erreur réseau");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/shop/api/create/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, description, email, phone }),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('🎊 Boutique créée avec succès !', {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)'
          }
        });
        setShop(data);
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.detail || Object.values(data || {}).flat().join(" \n ") || 'Erreur lors de la création';
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || 'Erreur réseau');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {/* Loading / Error */}
          {loading && (
            <div className="text-center py-20 text-[#0A1A2F]/60">Chargement…</div>
          )}
          {!loading && error && (
            <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
              <CardHeader>
                <CardTitle>Accès requis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#0A1A2F]/70 mb-4">{error}</p>
                <Link to="/login" className="inline-block bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl px-5 py-2">Se connecter</Link>
              </CardContent>
            </Card>
          )}

          {/* Has shop: simple dashboard preview */}
          {!loading && !error && shop && (
            <div className="space-y-6">
              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] dark:text-white">{shop.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border bg-white dark:bg-gray-900">
                      <div className="text-sm text-[#0A1A2F]/60">Produits</div>
                      <div className="text-2xl font-bold">{shop.total_products ?? 0}</div>
                    </div>
                    <div className="p-4 rounded-xl border bg-white dark:bg-gray-900">
                      <div className="text-sm text-[#0A1A2F]/60">Commandes</div>
                      <div className="text-2xl font-bold">{shop.total_orders ?? 0}</div>
                    </div>
                    <div className="p-4 rounded-xl border bg-white dark:bg-gray-900">
                      <div className="text-sm text-[#0A1A2F]/60">Ventes</div>
                      <div className="text-2xl font-bold">{Math.round((shop.total_sales ?? 0) as number)} DZD</div>
                    </div>
                    <div className="p-4 rounded-xl border bg-white dark:bg-gray-900">
                      <div className="text-sm text-[#0A1A2F]/60">Note</div>
                      <div className="text-2xl font-bold">{(shop.average_rating ?? 0).toFixed(1)} / 5</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <a href={`/shop/${shop.slug}/dashboard/`} className="text-center bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl px-5 py-2">Tableau de bord</a>
                    <a href="/shop/settings/" className="text-center rounded-xl border-2 border-gray-200 px-5 py-2">Paramètres</a>
                    <Link to="/orders" className="text-center rounded-xl border-2 border-gray-200 px-5 py-2">Commandes</Link>
                    <Link to="/dashboard" className="text-center rounded-xl border-2 border-gray-200 px-5 py-2">Produits</Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No shop: show create form */}
          {!loading && !error && !shop && (
            <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F] dark:text-white">Créer ma boutique</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-5 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0A1A2F]">Nom de la boutique</label>
                    <Input value={name} onChange={e => setName(e.target.value)} required className="h-11 rounded-xl border-2" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0A1A2F]">Description</label>
                    <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="rounded-xl border-2" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A1A2F]">Email</label>
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl border-2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A1A2F]">Téléphone</label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-11 rounded-xl border-2" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={creating} className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl px-5">
                      {creating ? 'Création…' : 'Créer ma boutique'}
                    </Button>
                    <Link to="/dashboard" className="rounded-xl border-2 border-gray-200 px-5 py-2">Retour</Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

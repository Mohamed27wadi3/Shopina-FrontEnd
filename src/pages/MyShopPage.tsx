import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

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
          console.log('🔍 MyShopPage - Current user from context:', user);
          console.log('🔍 MyShopPage - Token exists:', !!token);
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
              console.log('✅ Shop data loaded:', data);
              console.log('🔍 Shop owner check - Expected user:', user?.email, 'Shop:', data.name);
            
              // Security check: verify the shop owner matches current user
              if (data.owner && user && data.owner.email !== user.email) {
                console.error('🚨 SECURITY ALERT: Shop owner mismatch!');
                console.error('🚨 Current user:', user.email);
                console.error('🚨 Shop owner:', data.owner.email);
                setError(`Erreur de session: cette boutique appartient à ${data.owner.email}, mais vous êtes connecté en tant que ${user.email}. Veuillez vous déconnecter et reconnecter.`);
                setShop(null);
                return;
              }
            
            setShop(data);
          } else if (res.status === 404) {
              console.log('ℹ️ No shop found for current user');
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

  // Add product to current shop (merchant)
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pImage, setPImage] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!pName || !pPrice) {
      toast.error('Nom et prix requis');
      return;
    }
    setAdding(true);
    try {
      const token = localStorage.getItem('access_token');
      const fd = new FormData();
      fd.append('name', pName);
      fd.append('price', pPrice);
      if (pCategory) fd.append('category', pCategory);
      if (pImage) fd.append('image', pImage as Blob);

      const res = await fetch(`${API_BASE}/api/shop/api/create/`, {
        method: 'POST',
        body: fd,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('Produit ajouté');
        // Update shop counters locally if available
        setShop((s:any) => s ? { ...s, total_products: (s.total_products || 0) + 1 } : s);
        // reset fields
        setPName(''); setPPrice(''); setPCategory(''); setPImage(null);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.detail || 'Erreur lors de l\u2019ajout');
      }
    } catch (e:any) {
      toast.error(e?.message || 'Erreur réseau');
    } finally {
      setAdding(false);
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
                  <CardTitle className="text-red-600 dark:text-red-400">⚠️ Problème de session</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-[#0A1A2F]/70 dark:text-white/70 mb-6 whitespace-pre-line">{error}</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = '/login';
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter et reconnecter
                    </Button>
                    <Link to="/dashboard" className="inline-flex items-center px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-gray-50">
                      Retour au dashboard
                    </Link>
                  </div>
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
              {/* Add Product small form (silent UI, same styles) */}
              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] dark:text-white">Ajouter un produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4 max-w-xl">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input placeholder="Nom du produit" value={pName} onChange={e => setPName(e.target.value)} className="h-11 rounded-xl" />
                      <Input placeholder="Prix" value={pPrice} onChange={e => setPPrice(e.target.value)} className="h-11 rounded-xl" />
                      <Input placeholder="Catégorie (optionnel)" value={pCategory} onChange={e => setPCategory(e.target.value)} className="h-11 rounded-xl" />
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={e => setPImage(e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={adding} className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl px-5">
                        {adding ? 'Ajout…' : 'Ajouter le produit'}
                      </Button>
                      <Button onClick={() => { setPName(''); setPPrice(''); setPCategory(''); setPImage(null); }} className="rounded-xl border-2 border-gray-200 px-5">
                        Annuler
                      </Button>
                    </div>
                  </form>
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
      <Footer />
    </div>
  );
}

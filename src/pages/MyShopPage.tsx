import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { API_BASE } from "../utils/apiBase";

type HeroAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
};

const templatePresets = [
  {
    id: 1,
    name: "Minimal Glow",
    desc: "Palette claire et typographie élégante",
    preview: "Lumière",
  },
  {
    id: 2,
    name: "Grid Focus",
    desc: "Dense en visuels pour les catalogues",
    preview: "Galerie",
  },
  {
    id: 3,
    name: "Visual Story",
    desc: "Idéal pour les marques lifestyle",
    preview: "Editorial",
  },
];

const onboardingHighlights = [
  "Personnalisation du thème illimitée",
  "Liste de produits avec variantes",
  "Gestion des commandes en temps réel",
  "SEO optimisé et page vitrine responsive",
];

const storedTemplate = (): number | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("shop_template_override");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function MyShopPage() {
  const [shop, setShop] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(() => storedTemplate());

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pImage, setPImage] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editVariantsText, setEditVariantsText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const persistTemplateSelection = useCallback((templateId: number) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("shop_template_override", String(templateId));
    }
  }, []);

  const scrollToAddProduct = useCallback(() => {
    const section = document.getElementById("add-product-form");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("fr-DZ", {
        style: "currency",
        currency: "DZD",
        maximumFractionDigits: 0,
      }),
    []
  );

  const formatCurrency = (value?: number | null) => currencyFormatter.format(value ?? 0);
  const toNumber = (value: unknown) => (typeof value === "number" ? value : Number(value) || 0);

  const statsCards = useMemo(
    () => [
      {
        label: "Produits actifs",
        value: (shop?.total_products ?? products.length).toString(),
        helper: "Inventaire synchronisé",
      },
      {
        label: "Commandes",
        value: (shop?.total_orders ?? 0).toString(),
        helper: "30 derniers jours",
      },
      {
        label: "Ventes cumulées",
        value: formatCurrency(toNumber(shop?.total_sales)),
        helper: "Chiffre d'affaires",
      },
      {
        label: "Note moyenne",
        value: `${(shop?.average_rating ?? 0).toFixed(1)} / 5`,
        helper: "Satisfaction clients",
      },
    ],
    [shop, products.length, currencyFormatter]
  );

  const heroActions = useMemo<HeroAction[]>(
    () => [
      { label: "Voir la boutique", href: shop?.slug ? `/shop/${shop.slug}` : "#", primary: true },
      { label: "Commandes", href: "/orders" },
      { label: "Paramètres boutique", href: "/shop/settings/" },
      { label: "Ajouter un produit", onClick: scrollToAddProduct },
    ],
    [shop?.slug, scrollToAddProduct]
  );

  const loadShop = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/shop/api/my-shop/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (res.status === 404) {
        setShop(null);
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Impossible de charger votre boutique");
      }

      const data = await res.json();
      setShop(data);
      const templateId = Number(data?.selected_template ?? data?.template_id);
      if (!Number.isNaN(templateId)) {
        setSelectedTemplate(templateId);
        persistTemplateSelection(templateId);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Impossible de charger votre boutique");
    } finally {
      setLoading(false);
    }
  }, [persistTemplateSelection]);

  useEffect(() => {
    loadShop();
  }, [loadShop]);

  const fetchProducts = useCallback(async () => {
    if (!shop?.slug) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE}/shop/api/public/${shop.slug}/products/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn("Failed to fetch products", err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [shop?.slug]);

  useEffect(() => {
    if (shop?.slug) {
      fetchProducts();
    }
  }, [shop?.slug, fetchProducts]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nom requis");
      return;
    }
    setCreating(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/shop/api/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, description, email, phone }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data?.detail ||
          Object.values(data || {})
            .flat()
            .join(" \n ") ||
          "Erreur lors de la création";
        throw new Error(msg);
      }

      const data = await res.json();
      toast.success("🎊 Boutique créée avec succès !", {
        duration: 4000,
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          padding: "16px 24px",
          borderRadius: "16px",
          boxShadow: "0 20px 50px rgba(16, 185, 129, 0.4)",
        },
      });
      setShop(data);
      if (data?.slug) {
        fetchProducts();
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur réseau");
    } finally {
      setCreating(false);
    }
  }

  const saveTemplate = async (templateId: number) => {
    setSelectedTemplate(templateId);
    persistTemplateSelection(templateId);

    if (!shop) {
      toast.success("Template enregistré. Il sera appliqué dès que la boutique sera active.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/shop/api/template/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ template: templateId, shop: shop.slug }),
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Impossible d'appliquer le template");
      }

      toast.success("Template appliqué à la boutique");
    } catch (err) {
      console.warn("Template endpoint unavailable", err);
      toast.warning("Template sauvegardé localement. Il sera appliqué quand l'API sera disponible.");
    }
  };

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!pName || !pPrice) {
      toast.error("Nom et prix requis");
      return;
    }
    setAdding(true);
    try {
      const token = localStorage.getItem("access_token");
      const fd = new FormData();
      fd.append("name", pName);
      fd.append("price", pPrice);
      if (pCategory) fd.append("category", pCategory);
      if (pDescription) fd.append("description", pDescription);
      if (pImage) fd.append("image", pImage as Blob);

      const res = await fetch(`${API_BASE}/api/shop/create/`, {
        method: "POST",
        body: fd,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "Erreur lors de l'ajout");
      }

      toast.success("Produit ajouté");
      setShop((current: any) =>
        current ? { ...current, total_products: (current.total_products || 0) + 1 } : current
      );
      await fetchProducts();
      setPName("");
      setPPrice("");
      setPCategory("");
      setPDescription("");
      setPImage(null);
    } catch (err: any) {
      toast.error(err?.message || "Erreur réseau");
    } finally {
      setAdding(false);
    }
  }

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setEditName(product.name || "");
    setEditPrice(String(product.price || ""));
    setEditCategory(product.category?.name || "");
    setEditDescription(product.description || "");
    setEditVariantsText(product.variants ? JSON.stringify(product.variants, null, 2) : "");
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditImage(null);
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    setSavingEdit(true);
    try {
      const token = localStorage.getItem("access_token");
      let res: Response;
      let variantsPayload: any = undefined;
      if (editVariantsText) {
        try {
          variantsPayload = JSON.parse(editVariantsText);
        } catch (err) {
          toast.error("Variants JSON invalide");
          setSavingEdit(false);
          return;
        }
      }

      if (editImage) {
        const fd = new FormData();
        fd.append("name", editName);
        fd.append("price", editPrice);
        if (editCategory) fd.append("category", editCategory);
        if (editDescription) fd.append("description", editDescription);
        if (variantsPayload) fd.append("variants", JSON.stringify(variantsPayload));
        fd.append("image", editImage as Blob);
        res = await fetch(`${API_BASE}/api/shop/${editingProduct.id}/update/`, {
          method: "PATCH",
          body: fd,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });
      } else {
        const body: any = { name: editName, price: editPrice, description: editDescription };
        if (editCategory) body.category = editCategory;
        if (variantsPayload) body.variants = variantsPayload;
        res = await fetch(`${API_BASE}/api/shop/${editingProduct.id}/update/`, {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Erreur lors de la mise à jour");
      }

      toast.success("Produit mis à jour");
      cancelEdit();
      await fetchProducts();
    } catch (err: any) {
      toast.error(err?.message || "Erreur réseau");
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteProduct = async (product: any) => {
    if (!confirm(`Supprimer ${product.name} ?`)) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/shop/${product.id}/delete/`, {
        method: "DELETE", 
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!(res.status === 204 || res.ok)) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Erreur lors de la suppression");
      }

      toast.success("Produit supprimé");
      await fetchProducts();
      setShop((current: any) =>
        current ? { ...current, total_products: Math.max(0, (current.total_products || 0) - 1) } : current
      );
    } catch (err: any) {
      toast.error(err?.message || "Erreur réseau");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 space-y-6">
          {loading && <div className="text-center py-20 text-[#0A1A2F]/60">Chargement…</div>}

          {!loading && error && (
            <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">⚠️ Problème de session</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#0A1A2F]/70 dark:text-white/70 mb-6 whitespace-pre-line">{error}</p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/login";
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter et reconnecter
                  </Button>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-gray-50"
                  >
                    Retour au dashboard
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && shop && (
            <div className="space-y-8">
              <section className="relative overflow-hidden rounded-3xl border border-white/10 dark:border-gray-800 bg-gradient-to-br from-[#0A1A2F] via-[#0F2E56] to-[#0051A4] text-white shadow-[0_35px_120px_rgba(10,26,47,0.45)]">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent)]" />
                <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8 p-8">
                  <div className="flex-1">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em]">
                      Boutique active
                    </p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight">{shop.name}</h1>
                    <p className="mt-3 max-w-2xl text-white/80 text-lg">
                      {shop.description || "Présentez vos produits en toute simplicité et suivez vos performances en direct."}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {heroActions.map((action) =>
                        action.href ? (
                          <Link
                            key={action.label}
                            to={action.href}
                            className={`inline-flex items-center justify-center rounded-2xl px-5 py-2 text-sm font-semibold transition ${
                              action.primary
                                ? "bg-white text-[#0A1A2F]"
                                : "border border-white/40 text-white hover:bg-white/10"
                            }`}
                          >
                            {action.label}
                          </Link>
                        ) : (
                          <button
                            key={action.label}
                            type="button"
                            onClick={action.onClick}
                            className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-5 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
                          >
                            {action.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-80">
                    <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">Performance</p>
                      <p className="mt-3 text-3xl font-black">{formatCurrency(toNumber(shop.total_sales))}</p>
                      <p className="text-sm text-white/70">Ventes cumulées</p>
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Commandes</span>
                          <span className="font-semibold">{shop.total_orders ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Produits actifs</span>
                          <span className="font-semibold">{shop.total_products ?? products.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Note</span>
                          <span className="font-semibold">{(shop.average_rating ?? 0).toFixed(1)} / 5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#5AC8FA]/30 blur-3xl" />
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statsCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#0A1A2F] dark:text-white">{card.value}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.helper}</p>
                  </div>
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-3 items-start">
                <Card className="xl:col-span-2 border-2 border-gray-100 dark:border-gray-800 rounded-3xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#0077FF]">Inventaire</p>
                        <CardTitle className="text-[#0A1A2F] dark:text-white mt-1">Produits de la boutique</CardTitle>
                      </div>
                      <Button type="button" variant="outline" onClick={scrollToAddProduct} className="rounded-full">
                        Ajouter un produit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingProducts ? (
                      <div className="py-10 text-center text-gray-500 dark:text-gray-400">Chargement…</div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-12 rounded-2xl bg-gray-50 dark:bg-gray-900/40">
                        <p className="text-lg font-semibold text-[#0A1A2F] dark:text-white">Aucun produit pour le moment</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Publiez votre premier article pour commencer à vendre.
                        </p>
                        <Button type="button" className="mt-4 rounded-full" onClick={scrollToAddProduct}>
                          Ajouter mon premier produit
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map((p) => (
                          <div
                            key={p.id}
                            className="flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
                                <img src={p.image || "/placeholder.png"} alt={p.name} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-[#0A1A2F] dark:text-white">{p.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                    {p.category?.name || "Sans catégorie"}
                                  </span>
                                  {p.stock} en stock · {formatCurrency(toNumber(p.price))}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" variant="outline" onClick={() => startEdit(p)} className="rounded-xl">
                                Éditer
                              </Button>
                              <Button
                                type="button"
                                className="rounded-xl bg-red-600 hover:bg-red-700"
                                onClick={() => deleteProduct(p)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card id="add-product-form" className="border-2 border-gray-100 dark:border-gray-800 rounded-3xl xl:sticky xl:top-6">
                  <CardHeader>
                    <p className="text-xs uppercase tracking-[0.4em] text-[#0077FF]">Nouveau produit</p>
                    <CardTitle className="text-[#0A1A2F] dark:text-white">Ajouter un produit</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Complétez les informations clés et importez une belle photo pour séduire vos clients.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Nom du produit</label>
                        <Input
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          placeholder="Ex: Hoodie Essentials"
                          className="h-11 rounded-2xl"
                          required
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Prix</label>
                          <Input
                            value={pPrice}
                            onChange={(e) => setPPrice(e.target.value)}
                            placeholder="4500"
                            className="h-11 rounded-2xl"
                            required
                          />
                          <p className="text-xs text-gray-400">Afficher en DZD</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Catégorie</label>
                          <Input
                            value={pCategory}
                            onChange={(e) => setPCategory(e.target.value)}
                            placeholder="Streetwear"
                            className="h-11 rounded-2xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Description</label>
                        <Textarea
                          value={pDescription}
                          onChange={(e) => setPDescription(e.target.value)}
                          rows={3}
                          placeholder="Mettre en avant les détails clés, la matière, etc."
                          className="rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Image du produit</label>
                        <label
                          htmlFor="product-image"
                          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 hover:border-[#0077FF] hover:bg-[#F5F9FF] cursor-pointer"
                        >
                          <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => setPImage(e.target.files ? e.target.files[0] : null)}
                          />
                          <span className="font-semibold text-[#0A1A2F] dark:text-white">Déposer ou cliquer pour choisir</span>
                          <span className="text-xs text-gray-400">{pImage ? pImage.name : "PNG, JPG ou WEBP • 2 Mo max"}</span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={adding} className="flex-1 rounded-2xl bg-[#0077FF] hover:bg-[#0062CC] text-white">
                          {adding ? "Ajout en cours…" : "Publier le produit"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPName("");
                            setPPrice("");
                            setPCategory("");
                            setPDescription("");
                            setPImage(null);
                          }}
                          className="rounded-2xl"
                        >
                          Réinitialiser
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </section>

              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-3xl">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#0077FF]">Thèmes</p>
                  <CardTitle className="text-[#0A1A2F] dark:text-white">Choisir un template</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prévisualisez différents layouts prêts à l'emploi et appliquez-les en un clic.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {templatePresets.map((template) => (
                      <div
                        key={template.id}
                        className={`rounded-2xl border-2 p-4 ${
                          selectedTemplate === template.id
                            ? "border-[#0077FF] bg-[#F0F6FF]"
                            : "border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <div className="h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                          <span className="absolute top-3 left-3 text-xs uppercase tracking-[0.3em] text-gray-500">
                            {template.preview}
                          </span>
                          <div className="absolute inset-x-6 bottom-4 h-10 rounded-lg bg-white/80 dark:bg-gray-800/70" />
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#0A1A2F] dark:text-white">{template.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{template.desc}</p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => saveTemplate(template.id)}
                            className={`rounded-full px-4 ${
                              selectedTemplate === template.id
                                ? "bg-[#0077FF] text-white"
                                : "bg-white text-[#0A1A2F] border border-gray-200"
                            }`}
                          >
                            {selectedTemplate === template.id ? "Sélectionné" : "Choisir"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full p-6">
                    <h3 className="text-xl font-bold mb-3">Modifier le produit</h3>
                    <div className="space-y-3">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      <Input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                      <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                      <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} />
                      <div>
                        <label className="block text-sm mb-1">Image (laisser vide pour ne pas changer)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditImage(e.target.files ? e.target.files[0] : null)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Variants (JSON)</label>
                        <Textarea value={editVariantsText} onChange={(e) => setEditVariantsText(e.target.value)} rows={4} />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button onClick={saveEdit} disabled={savingEdit} className="bg-[#0077FF] text-white">
                          {savingEdit ? "Sauvegarde…" : "Sauvegarder"}
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !shop && (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-gradient-to-br from-[#0A1A2F] via-[#132946] to-[#0B5ED7] text-white p-10 shadow-[0_25px_70px_rgba(10,26,47,0.4)]">
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">Shop Builder</p>
                <h2 className="mt-4 text-4xl font-black leading-tight">Créez votre boutique en moins de 3 minutes</h2>
                <p className="mt-3 text-white/80 text-lg max-w-2xl">
                  Personnalisez vos couleurs, publiez vos premiers produits et commencez à encaisser via vos canaux préférés.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {onboardingHighlights.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-6 w-6 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold">✓</span>
                      <p className="text-sm text-white/90">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.4em] text-white/70">Astuce</p>
                  <p className="mt-2 text-white font-semibold">
                    Choisissez un nom court et facile à retenir, il deviendra l'URL publique de votre boutique.
                  </p>
                </div>
              </section>
              <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-3xl">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#0077FF]">Onboarding</p>
                  <CardTitle className="text-[#0A1A2F] dark:text-white">Créer ma boutique</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quelques informations suffisent pour activer votre espace marchand.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Nom de la boutique</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 rounded-2xl border-2"
                        placeholder="Ex: Atelier Nova"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Description</label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        className="rounded-2xl border-2"
                        placeholder="Pitch de votre marque, valeurs, style..."
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Email</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 rounded-2xl border-2"
                          placeholder="contact@boutique.dz"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0A1A2F] dark:text-white">Téléphone</label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-12 rounded-2xl border-2"
                          placeholder="06 00 00 00 00"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" disabled={creating} className="flex-1 rounded-2xl bg-[#0077FF] hover:bg-[#005FCC] text-white">
                        {creating ? "Création…" : "Créer ma boutique"}
                      </Button>
                      <Link
                        to="/dashboard"
                        className="rounded-2xl border-2 border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-600 hover:border-gray-300"
                      >
                        Retour
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export { MyShopPage };

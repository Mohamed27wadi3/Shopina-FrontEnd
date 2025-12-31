import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import ProductDetailModal from "../components/ProductDetailModal";
import { API_BASE } from "../utils/apiBase";
import { Input } from "../components/ui/input";
import { ShoppingCart, Search, Star, Filter, Package, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const DEFAULT_CATEGORY = 'Tous les produits';

export function ShopPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([DEFAULT_CATEGORY]);
  const [loading, setLoading] = useState(true);
  const [publicShop, setPublicShop] = useState<any | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Fetch products and categories. If `slug` present, fetch public shop products instead of global list.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Categories still fetched globally
        const catRes = await fetch(`${API_BASE}/api/shop/categories/`);
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories([DEFAULT_CATEGORY, ...data.map((c: any) => c.name)]);
        }

        if (slug) {
          // Fetch public shop products for the slug
          const prodRes = await fetch(`${API_BASE}/shop/api/public/${slug}/products/`);
          if (prodRes.ok) {
            const data = await prodRes.json();
            setProducts(data);
          } else {
            setProducts([]);
          }
        } else {
          const prodRes = await fetch(`${API_BASE}/api/shop/products/`);
          if (prodRes.ok) {
            const data = await prodRes.json();
            setProducts(data);
          }
        }
      } catch (e) {
        console.error('Failed to fetch products or categories', e);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // If a shop slug is present, load public shop info (no visual overhaul)
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/shop/api/public/${slug}/`);
        if (res.ok) {
          const data = await res.json();
          setPublicShop(data);
        } else {
          setPublicShop(null);
        }
      } catch {
        setPublicShop(null);
      }
    })();
  }, [slug]);

  // Load announcements from backend or localStorage
  const [announcements, setAnnouncements] = useState<any[]>([]);
  useEffect(() => {
    if (!slug) return;
    let ignore = false;
    (async () => {
      try {
        // try backend
        const res = await fetch(`${API_BASE}/api/shop/public/${slug}/announcements/`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setAnnouncements(data || []);
          return;
        }
      } catch (e) {
        // ignore
      }

      // fallback to localStorage
      const key = `shop_announcements_${slug}`;
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      if (!ignore) setAnnouncements(stored || []);
    })();
    return () => { ignore = true; };
  }, [slug]);

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = selectedCategory === DEFAULT_CATEGORY || product.category?.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Open product detail modal instead of directly adding to cart
  const addToCart = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const confirmAddToCart = async ({ product, quantity }: { product: any; quantity: number }) => {
    try {
      // If user is authenticated, call backend cart API; otherwise use localStorage
      const token = localStorage.getItem('access_token');
      if (token) {
        const res = await fetch(`${API_BASE}/api/carts/items/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ product_id: product.id, quantity }),
          credentials: 'include',
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || 'Erreur ajout panier');
        }
        toast.success(`🛒 ${product.name} ajouté au panier !`);
      } else {
        // Guest: store structured cart in localStorage
        const stored = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        stored.push({ product_id: product.id, quantity, price: product.price });
        localStorage.setItem('guest_cart', JSON.stringify(stored));
        toast.success(`🛒 ${product.name} ajouté au panier (invité)`);
      }
    } catch (e: any) {
      console.error('Add to cart error', e);
      toast.error(e?.message || 'Erreur lors de l\'ajout au panier');
    } finally {
      setShowProductModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0A0A0A] dark:via-[#0F0F0F] dark:to-[#0A0A0A]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Enhanced Design */}
        <div className="relative bg-gradient-to-br from-[#0077FF] via-[#0077FF] to-[#5AC8FA] text-white py-24 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#5AC8FA]/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 border border-white/30 shadow-lg">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">Boutique en ligne</span>
              </div>
              <h1 className="text-white mb-6 animate-in slide-in-from-bottom-4 duration-700" style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                {publicShop?.name || 'Découvrez nos produits'}
              </h1>
              <p className="text-white/90 text-xl mb-8 max-w-2xl leading-relaxed animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
                    {publicShop?.description || "Une sélection soigneusement choisie de produits premium pour répondre à tous vos besoins"}
              </p>
                  {/* Announcements banner (if any) */}
                  {announcements && announcements.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {announcements.slice(0,3).map((a:any) => (
                        <div key={a.id || a.title} className="bg-white/90 text-[#0A1A2F] rounded-xl p-3 shadow-md flex items-center gap-4">
                          {a.image && <img src={a.image} alt={a.title} className="w-20 h-20 object-cover rounded-md" />}
                          <div>
                            <div className="font-semibold">{a.title}</div>
                            <div className="text-sm text-gray-700">{a.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              <div className="flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <span className="text-3xl font-bold">{products.length}</span>
                  <span className="text-white/80">Produits</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Star className="w-5 h-5 fill-[#FFD43B] text-[#FFD43B]" />
                  <span className="text-white/80">Qualité Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar with Enhanced Styling */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-[73px] z-40 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#0077FF] transition-colors" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#0077FF] dark:bg-gray-800 dark:text-white transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none h-12 rounded-xl gap-2 border-2 hover:border-[#0077FF] hover:text-[#0077FF] transition-all"
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">Filtres</span>
                </Button>
                <Button 
                  className="flex-1 md:flex-none h-12 bg-[#0077FF] hover:bg-[#0077FF]/90 rounded-xl gap-2 shadow-lg shadow-[#0077FF]/30 transition-all hover:scale-105" 
                  onClick={() => navigate('/checkout')}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">Panier</span>
                  <Badge className="bg-white text-[#0077FF] hover:bg-white">{cart.length}</Badge>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories with Smooth Scrolling */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-6 py-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-medium animate-in slide-in-from-bottom-2 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white shadow-lg shadow-[#0077FF]/30 scale-105"
                      : "bg-white dark:bg-gray-800 text-[#0A1A2F] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid with Enhanced Cards */}
        <div className="container mx-auto px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                <span className="font-semibold text-[#0077FF]">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {selectedCategory !== DEFAULT_CATEGORY && `Catégorie: ${selectedCategory}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader className="w-12 h-12 text-[#0077FF] animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400 animate-pulse">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A1A2F] dark:text-white mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Nous n'avons pas trouvé de produits correspondant à vos critères. Essayez de modifier vos filtres.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(DEFAULT_CATEGORY);
                }}
                className="bg-[#0077FF] hover:bg-[#0077FF]/90 h-12 rounded-xl shadow-lg shadow-[#0077FF]/30"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-[#0077FF]/30 dark:hover:border-[#0077FF]/50 bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.stock < 10 && product.stock > 0 && (
                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#FFD43B] to-[#FFC107] text-[#0A1A2F] hover:bg-[#FFD43B] shadow-lg">
                          <span className="flex items-center gap-1">
                            Stock limité
                          </span>
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge className="absolute top-4 right-4 bg-red-500 text-white shadow-lg">
                          Épuisé
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-3 border-[#0077FF]/20 text-[#0077FF] dark:border-[#0077FF]/30">
                          {product.category?.name || "Produit"}
                        </Badge>
                        <Link to={`/product/${product.id}`}>
                          <CardTitle className="text-[#0A1A2F] dark:text-white group-hover:text-[#0077FF] transition-colors cursor-pointer line-clamp-2" style={{ fontSize: '18px', fontWeight: '600' }}>
                            {product.name}
                          </CardTitle>
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 transition-all ${
                              i < Math.floor(product.rating || 0)
                                ? "fill-[#FFD43B] text-[#FFD43B]"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        ({product.reviews || 0})
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[#0A1A2F] dark:text-white block" style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                          ${(Number(product.price) || 0).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full h-11 rounded-xl transition-all ${
                        product.stock === 0 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] hover:shadow-lg hover:shadow-[#0077FF]/30 hover:scale-105'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        open={showProductModal}
        onClose={() => { setShowProductModal(false); setSelectedProduct(null); }}
        onConfirm={confirmAddToCart}
      />
    </div>
  );
}

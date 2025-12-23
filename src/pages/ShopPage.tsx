import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShoppingCart, Search, Star, Filter, Package, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const DEFAULT_CATEGORY = 'Tous les produits';

export function ShopPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([DEFAULT_CATEGORY]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/api/shop/products/`),
          fetch(`${API_BASE}/api/shop/categories/`),
        ]);
        
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories([DEFAULT_CATEGORY, ...data.map((c: any) => c.name)]);
        }
      } catch (e) {
        console.error('Failed to fetch products or categories', e);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = selectedCategory === DEFAULT_CATEGORY || product.category?.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    const newCart = [...cart, product.id];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Package className="w-4 h-4" />
                <span className="text-sm">Boutique en ligne</span>
              </div>
              <h1 className="text-white mb-6" style={{ fontSize: '48px', fontWeight: '700', lineHeight: '1.1' }}>
                Découvrez nos produits
              </h1>
              <p className="text-white/90 text-xl mb-8">
                Une sélection de produits de qualité pour tous vos besoins
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-100 bg-white sticky top-[73px] z-40">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-xl gap-2">
                  <Filter className="w-4 h-4" />
                  Filtres
                </Button>
                <Button 
                  className="bg-[#0077FF] hover:bg-[#0077FF]/90 rounded-xl gap-2" 
                  onClick={() => navigate('/checkout')}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Panier ({cart.length})
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-6 py-4">
            <div className="flex gap-3 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-[#0077FF] text-white shadow-lg shadow-[#0077FF]/20"
                      : "bg-gray-50 text-[#0A1A2F] hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-6 py-12">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-[#0077FF] animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(DEFAULT_CATEGORY);
                }}
                className="bg-[#0077FF] hover:bg-[#0077FF]/90"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow rounded-2xl border-gray-100">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {product.stock < 10 && (
                        <Badge className="absolute top-3 right-3 bg-[#FFD43B] text-[#0A1A2F] hover:bg-[#FFD43B]">
                          Stock limité
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {product.category?.name || "Produit"}
                        </Badge>
                        <Link to={`/product/${product.id}`}>
                          <CardTitle className="text-[#0A1A2F] hover:text-[#0077FF] transition-colors cursor-pointer">
                            {product.name}
                          </CardTitle>
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? "fill-[#FFD43B] text-[#FFD43B]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.reviews || 0})
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-[#0A1A2F]" style={{ fontSize: '24px', fontWeight: '700' }}>
                        ${(product.price || 0).toFixed(2)}
                      </span>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="bg-[#0077FF] hover:bg-[#0077FF]/90 rounded-xl"
                      >
                        Ajouter
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {product.stock} en stock
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

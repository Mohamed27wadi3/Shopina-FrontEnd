import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShoppingCart, Search, Star, Filter, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const categories = [
  "Tous les produits",
  "Mode",
  "Électronique",
  "Maison & Jardin",
  "Sport & Loisirs",
  "Beauté & Santé",
  "Livres & Médias"
];

const products = [
  { id: 1, name: "T-shirt Premium", category: "Mode", price: 29.99, rating: 4.5, reviews: 128, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", stock: 15 },
  { id: 2, name: "Casque Audio Pro", category: "Électronique", price: 149.99, rating: 4.8, reviews: 342, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", stock: 8 },
  { id: 3, name: "Chaise de Bureau", category: "Maison & Jardin", price: 199.99, rating: 4.6, reviews: 89, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400", stock: 12 },
  { id: 4, name: "Montre Connectée", category: "Électronique", price: 249.99, rating: 4.7, reviews: 256, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", stock: 20 },
  { id: 5, name: "Ballon de Football", category: "Sport & Loisirs", price: 34.99, rating: 4.4, reviews: 67, image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400", stock: 30 },
  { id: 6, name: "Sérum Visage", category: "Beauté & Santé", price: 45.99, rating: 4.9, reviews: 412, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", stock: 25 },
  { id: 7, name: "Lampe LED Design", category: "Maison & Jardin", price: 59.99, rating: 4.3, reviews: 54, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", stock: 18 },
  { id: 8, name: "Livre de Cuisine", category: "Livres & Médias", price: 24.99, rating: 4.6, reviews: 134, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", stock: 40 }
];

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous les produits");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<number[]>([]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Tous les produits" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
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
                <div className="relative">
                  <Button className="bg-[#0077FF] hover:bg-[#0077FF]/90 rounded-xl gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Panier ({cart.length})
                  </Button>
                </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow rounded-2xl border-gray-100">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
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
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        {product.category}
                      </Badge>
                      <CardTitle className="text-[#0A1A2F]">
                        {product.name}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-[#FFD43B] text-[#FFD43B]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-[#0A1A2F]" style={{ fontSize: '24px', fontWeight: '700' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <Button 
                      onClick={() => addToCart(product.id)}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          fetch(`${API_BASE}/api/shop/products/${id}/`),
          fetch(`${API_BASE}/api/reviews/?product=${id}`),
        ]);

        if (!prodRes.ok) throw new Error("Produit non trouvé");
        
        const prod = await prodRes.json();
        setProduct(prod);

        if (revRes.ok) {
          const rev = await revRes.json();
          setReviews(rev);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    for (let i = 0; i < quantity; i++) {
      cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${quantity} produit(s) ajouté(s) au panier`);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Chargement...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-red-500">Erreur: {error}</p>
          <Button onClick={() => navigate('/shop')} className="bg-[#0077FF]">
            Retour à la boutique
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const images = product.images || [product.image || '/placeholder.jpg'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="mb-6 bg-gray-50 rounded-2xl overflow-hidden aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-[#0077FF]"
                        : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`Miniature ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <Badge className="mb-3 bg-[#0077FF]/10 text-[#0077FF] hover:bg-[#0077FF]/20">
                {product.category?.name || "Produit"}
              </Badge>
              <h1 className="text-[#0A1A2F]" style={{ fontSize: '36px', fontWeight: '800' }}>
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(Number(avgRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                {avgRating}
              </span>
              <span className="text-[#0A1A2F]/60">({reviews.length} avis)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-[#0A1A2F]/60 text-sm mb-2">Prix</p>
              <div className="flex items-baseline gap-3">
                <span className="text-[#0A1A2F]" style={{ fontSize: '32px', fontWeight: '800' }}>
                  ${product.price?.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-[#0A1A2F]/40 line-through">
                    ${product.original_price?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="mb-8">
              <p className="text-[#0A1A2F]/60 text-sm mb-2">Disponibilité</p>
              <p className={product.stock > 0 ? "text-green-600" : "text-red-600"} style={{ fontWeight: '600' }}>
                {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-[#0A1A2F] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-[#0A1A2F] hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-0 outline-none"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-[#0A1A2F] hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl gap-2 h-12"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </Button>
              <Button
                variant="outline"
                className="px-6 rounded-xl border-2 border-gray-200"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl border-2 border-gray-200 gap-2"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-100 pt-12">
          <h2 style={{ fontSize: '28px', fontWeight: '800' }} className="text-[#0A1A2F] mb-8">
            Avis clients
          </h2>

          {reviews.length === 0 ? (
            <p className="text-[#0A1A2F]/60">Aucun avis pour le moment</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <Card key={idx} className="border-2 border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                          {review.user?.username}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[#0A1A2F]/60 text-sm">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-[#0A1A2F]">{review.comment}</p>
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../components/ui/button';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Trash2, Plus, Minus, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE } from '../utils/apiBase';
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

function CheckoutForm({ orderId, clientSecret }: { orderId: number | null; clientSecret: string | null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    const card = elements.getElement(CardElement);
    if (!card) {
      setMessage('Élément carte non chargé');
      setLoading(false);
      return;
    }

    const res = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });
    if (res.error) {
      setMessage(res.error.message || 'Le paiement a échoué');
    } else if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
      setMessage('Paiement réussi ! Merci pour votre commande.');
      toast.success('✅ Paiement accepté avec succès !', {
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
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {message && <p className="mb-4 text-sm">{message}</p>}
      <Button onClick={handlePay} disabled={loading || !stripe} className="w-full bg-[#0077FF]">
        {loading ? 'Traitement...' : 'Payer'}
      </Button>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCartData();
  }, [user, navigate]);

  const loadCartData = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('cart');
      if (!stored || JSON.parse(stored).length === 0) {
        navigate('/shop');
        return;
      }

      const cartIds = JSON.parse(stored);
      const productsRes = await fetch(`${API_BASE}/api/shop/products/`);
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      
      const allProducts = await productsRes.json();
      const cart = cartIds.map((id: number) => {
        const product = allProducts.find((p: any) => p.id === id);
        return { ...product, quantity: cartIds.filter((cid: number) => cid === id).length };
      });

      const uniqueCart = Array.from(
        new Map(cart.map(item => [item.id, item])).values()
      );

      setCartItems(uniqueCart);
      setProducts(allProducts);
    } catch (e) {
      console.error('Failed to load cart data:', e);
      toast.error('Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.20;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (cartItems.length === 0) {
        toast.error('Votre panier est vide');
        return;
      }

      const orderRes = await fetch(`${API_BASE}/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity })),
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postal_code,
          shipping_country: formData.country,
        }),
      });

      if (!orderRes.ok) {
        const error = await orderRes.json();
        throw new Error(error.detail || 'Erreur lors de la création');
      }

      const order = await orderRes.json();
      setOrderId(order.id);

      const intentRes = await fetch(`${API_BASE}/api/payments/create-intent/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      });

      if (!intentRes.ok) throw new Error('Failed to create payment');
      const data = await intentRes.json();
      setClientSecret(data.client_secret);
      localStorage.removeItem('cart');
      toast.success('🎉 Commande créée avec succès !', {
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
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader className="w-8 h-8 text-[#0077FF] animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12">
        <h1 style={{ fontSize: '36px', fontWeight: '800' }} className="text-[#0A1A2F] mb-12">
          Paiement et confirmation
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-100 rounded-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F]">Votre commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1">
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>{item.name}</p>
                        <p className="text-[#0A1A2F]/60 text-sm">${item.price?.toFixed(2) || '0.00'} × {item.quantity}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)} className="rounded-lg">
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)} className="rounded-lg">
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => removeItem(item.id)} className="ml-auto text-red-600 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F]">Adresse de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name" className="text-[#0A1A2F]">Prénom</Label>
                      <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleFormChange} className="rounded-xl" required />
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="text-[#0A1A2F]">Nom</Label>
                      <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleFormChange} className="rounded-xl" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#0A1A2F]">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} className="rounded-xl" required />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#0A1A2F]">Téléphone</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleFormChange} className="rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-[#0A1A2F]">Adresse</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleFormChange} className="rounded-xl" required />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="postal_code" className="text-[#0A1A2F]">Code postal</Label>
                      <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleFormChange} className="rounded-xl" required />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-[#0A1A2F]">Ville</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleFormChange} className="rounded-xl" required />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-[#0A1A2F]">Pays</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleFormChange} className="rounded-xl" required />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-2 border-gray-100 rounded-2xl sticky top-24">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F]">Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#0A1A2F]/60">Sous-total</span>
                  <span className="text-[#0A1A2F]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0A1A2F]/60">TVA (20%)</span>
                  <span className="text-[#0A1A2F]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0A1A2F]/60">Livraison</span>
                  <span className="text-green-600" style={{ fontWeight: '600' }}>Gratuit</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>Total</span>
                  <span className="text-[#0A1A2F]" style={{ fontSize: '24px', fontWeight: '800' }}>${total.toFixed(2)}</span>
                </div>

                {!clientSecret ? (
                  <>
                    <Button onClick={handleSubmit} disabled={submitting || cartItems.length === 0} className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl h-12 mt-6">
                      {submitting ? 'Traitement...' : 'Continuer vers le paiement'}
                    </Button>
                    <Button onClick={() => navigate('/shop')} variant="outline" className="w-full rounded-xl border-2 border-gray-200">
                      Continuer vos achats
                    </Button>
                  </>
                ) : (
                  stripePromise && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm orderId={orderId} clientSecret={clientSecret} />
                    </Elements>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

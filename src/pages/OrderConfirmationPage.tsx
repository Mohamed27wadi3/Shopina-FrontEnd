import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Loader, CheckCircle, Package, Truck, Star } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE } from '../utils/apiBase';
import { Badge } from "../components/ui/badge";

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/orders/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

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

  const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0077FF]/5 via-[#5AC8FA]/5 to-white">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-[#0A1A2F] mb-2" style={{ fontSize: '36px', fontWeight: '800' }}>
              Commande confirmée !
            </h1>
            <p className="text-[#0A1A2F]/60 text-lg">
              Merci pour votre achat. Votre commande a été reçue et traitée.
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <>
              <Card className="border-2 border-gray-100 rounded-2xl mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#0A1A2F]">Numéro de commande</CardTitle>
                      <p className="text-2xl mt-2" style={{ fontWeight: '700', color: '#0077FF' }}>
                        #{order.id}
                      </p>
                    </div>
                    <Badge className={`${statusColors[order.status] || 'bg-gray-100 text-gray-700'} px-4 py-2`}>
                      {order.status === 'pending' && 'En attente'}
                      {order.status === 'processing' && 'En traitement'}
                      {order.status === 'completed' && 'Complétée'}
                      {order.status === 'cancelled' && 'Annulée'}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Order Info */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-2 border-gray-100 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0077FF]/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#0077FF]" />
                      </div>
                      <div>
                        <p className="text-[#0A1A2F]/60 text-sm">Articles</p>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '700', fontSize: '20px' }}>
                          {order.items?.length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-100 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#5AC8FA]/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#5AC8FA]" />
                      </div>
                      <div>
                        <p className="text-[#0A1A2F]/60 text-sm">Date</p>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-100 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[#0A1A2F]/60 text-sm">Total</p>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '700', fontSize: '20px' }}>
                          ${(order.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Items */}
              <Card className="border-2 border-gray-100 rounded-2xl mb-8">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Articles commandés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                            {item.product?.name || 'Produit'}
                          </p>
                          <p className="text-[#0A1A2F]/60 text-sm">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shipping_address && (
                <Card className="border-2 border-gray-100 rounded-2xl mb-8">
                  <CardHeader>
                    <CardTitle className="text-[#0A1A2F]">Adresse de livraison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#0A1A2F]">{order.shipping_address}</p>
                    <p className="text-[#0A1A2F]">
                      {order.shipping_postal_code} {order.shipping_city}
                    </p>
                    <p className="text-[#0A1A2F]">{order.shipping_country}</p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/shop')}
                  className="flex-1 bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl h-12"
                >
                  Continuer vos achats
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex-1 rounded-xl border-2 border-gray-200 h-12"
                >
                  Voir mes commandes
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

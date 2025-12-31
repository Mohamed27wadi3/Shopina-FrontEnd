import { useEffect, useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ordersAPI } from "../services/api";
import { Loader2, Package, Search, Filter } from "lucide-react";

type Order = {
  id: number;
  user: { username: string; first_name?: string; last_name?: string };
  status: string;
  total: number;
  created_at: string;
  items?: any[];
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await ordersAPI.getAll();
        if (mounted) {
          setOrders(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Impossible de charger les commandes");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const customer = order.user || { username: "", first_name: "", last_name: "" };
    const customerName =
      customer.first_name || customer.last_name
        ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
        : customer.username || "";
    const statusValue = (order.status || "").toLowerCase();
    return (
      customerName.toLowerCase().includes(searchLower) ||
      order.id.toString().includes(searchLower) ||
      statusValue.includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8 dark:bg-gray-950">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-[#0077FF]" />
              <h1 className="text-[#0A1A2F] dark:text-white" style={{ fontSize: "36px", fontWeight: "800" }}>
                Commandes
              </h1>
            </div>
            <p className="text-[#0A1A2F]/60 dark:text-gray-400">
              Liste complète de toutes les commandes avec filtres et recherche
            </p>
          </div>

          {error && (
            <Card className="border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 mb-6">
              <CardContent className="py-4 text-red-700 dark:text-red-200 text-sm">{error}</CardContent>
            </Card>
          )}

          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par client, numéro de commande ou statut..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-[#0A1A2F] dark:text-white focus:border-[#0077FF] dark:focus:border-[#5AC8FA] outline-none transition-colors"
              />
            </div>
            <button className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-[#0A1A2F] dark:text-white hover:border-[#0077FF] dark:hover:border-[#5AC8FA] transition-colors flex items-center gap-2 font-semibold">
              <Filter className="w-5 h-5" />
              Filtres
            </button>
          </div>

          <Card className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-[#0A1A2F] dark:text-white flex items-center justify-between">
                <span>
                  {filteredOrders.length} commande{filteredOrders.length !== 1 ? "s" : ""}
                </span>
                {loading && <Loader2 className="w-5 h-5 animate-spin text-[#0077FF]" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0077FF]" />
                  <span className="ml-3 text-[#0A1A2F]/60 dark:text-gray-400">Chargement des commandes...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-[#0A1A2F]/60 dark:text-gray-400">
                  {searchTerm ? "Aucune commande trouvée pour cette recherche." : "Aucune commande pour l'instant."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#0A1A2F] dark:text-white">
                          # Commande
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#0A1A2F] dark:text-white">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#0A1A2F] dark:text-white">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#0A1A2F] dark:text-white">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#0A1A2F] dark:text-white">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#0A1A2F] dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const customer = order.user || { username: "", first_name: "", last_name: "" };
                        const customerName =
                          customer.first_name || customer.last_name
                            ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
                            : customer.username || "Client";
                        const statusValue = (order.status || "pending").toLowerCase();
                        const statusLabel = statusValue
                          ? statusValue.charAt(0).toUpperCase() + statusValue.slice(1)
                          : "Pending";
                        return (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          >
                            <td className="px-6 py-4 text-[#0A1A2F] dark:text-white font-semibold">#{order.id}</td>
                            <td className="px-6 py-4 text-[#0A1A2F] dark:text-white">{customerName}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  statusColors[statusValue] || statusColors.pending
                                }`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#0A1A2F] dark:text-white font-bold">
                              {new Intl.NumberFormat("fr-DZ", {
                                style: "currency",
                                currency: "DZD",
                                maximumFractionDigits: 0,
                              }).format(order.total)}
                            </td>
                            <td className="px-6 py-4 text-[#0A1A2F]/60 dark:text-gray-400">
                              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-[#0077FF] dark:text-[#5AC8FA] hover:underline font-semibold">
                                Détails
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
}

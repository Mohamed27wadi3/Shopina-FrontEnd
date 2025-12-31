import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../services/api";
import {
  BarChart2,
  CreditCard,
  Loader2,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import "../styles/dashboard.css";

type ChartPoint = { date: string; value: number };

type DashboardStats = {
  totals: {
    revenue: number;
    revenue_today: number;
    orders: number;
    orders_today: number;
    paid_orders: number;
    customers: number;
    products: number;
    avg_order_value: number;
  };
  changes: {
    revenue_pct: number;
    orders_pct: number;
    window_revenue: number;
    window_orders: number;
  };
  series: {
    revenue: ChartPoint[];
    orders: ChartPoint[];
  };
  top_products: Array<{ id: number | null; name: string; quantity: number; revenue: number }>;
  recent_orders: Array<{ id: number; customer: string; status: string; total: number; created_at: string }>;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);

const formatNumber = (value: number) => (value ?? 0).toLocaleString("fr-FR");

const statusChip = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "completed") return "bg-green-100 text-green-700";
  if (normalized === "processing") return "bg-blue-100 text-blue-700";
  if (normalized === "cancelled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

function Sparkline({ points }: { points: ChartPoint[] }) {
  const safePoints = points.length ? points : [{ date: "", value: 0 }];
  const maxValue = Math.max(...safePoints.map((p) => p.value), 1);
  const width = 220;
  const height = 120;
  const step = safePoints.length > 1 ? width / (safePoints.length - 1) : 0;

  const pathD = safePoints
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.value / maxValue) * height;
      return `${index === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg className="dash-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Courbe des revenus (7 jours)">
      <defs>
        <linearGradient id="dashRevenueGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0077FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5AC8FA" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={areaD} className="dash-chart-area" />
      <path d={pathD} className="dash-chart-line" />
      {safePoints.map((point, index) => {
        const x = index * step;
        const y = height - (point.value / maxValue) * height;
        return <circle key={point.date + index} cx={x} cy={y} r={4} className="dash-chart-dot" />;
      })}
    </svg>
  );
}

function OrderBars({ points }: { points: ChartPoint[] }) {
  const safePoints = points.length ? points : [{ date: "", value: 0 }];
  const maxValue = Math.max(...safePoints.map((p) => p.value), 1);

  return (
    <div className="dash-bars" aria-label="Histogramme des commandes (7 jours)">
      {safePoints.map((point) => (
        <div key={point.date} className="dash-bar" style={{ height: `${(point.value / maxValue) * 100}%` }}>
          <span className="dash-bar-value">{formatNumber(point.value)}</span>
          <span className="dash-bar-label">{point.date ? new Date(point.date).toLocaleDateString("fr-FR", { weekday: "short" }) : ""}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await dashboardAPI.getStats();
        if (mounted) {
          setStats(response);
          setError(null);
        }
      } catch (err: any) {
        // Handle silently: keep UI clean, default stats to zeros
        if (mounted) setError(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const statCards = useMemo(() => {
    return [
      {
        key: "revenue",
        title: "Revenu total",
        value: formatCurrency(stats?.totals.revenue ?? 0),
        change: stats?.changes.revenue_pct ?? 0,
        hint: `7 derniers jours: ${formatCurrency(stats?.changes.window_revenue ?? 0)}`,
        icon: CreditCard,
      },
      {
        key: "orders",
        title: "Commandes",
        value: formatNumber(stats?.totals.orders ?? 0),
        change: stats?.changes.orders_pct ?? 0,
        hint: `${formatNumber(stats?.totals.orders_today ?? 0)} aujourd'hui`,
        icon: ShoppingCart,
      },
      {
        key: "customers",
        title: "Clients",
        value: formatNumber(stats?.totals.customers ?? 0),
        change: 0,
        hint: `${formatNumber(stats?.totals.paid_orders ?? 0)} commandes payées`,
        icon: Users,
      },
      {
        key: "products",
        title: "Produits",
        value: formatNumber(stats?.totals.products ?? 0),
        change: 0,
        hint: `Panier moyen ${formatCurrency(stats?.totals.avg_order_value ?? 0)}`,
        icon: Package,
      },
    ];
  }, [stats]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 lg:p-8 dark:bg-gray-950">
          {/* Welcome Card */}
          <div className="mb-8 bg-gradient-to-br from-[#0077FF] via-[#0077FF] to-[#5AC8FA] rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              {(() => {
                const planMap: Record<string, string> = {
                  'free': 'FREE',
                  'starter': 'STARTER',
                  'pro': 'GOLD',
                  'enterprise': 'ENTERPRISE'
                };
                const userPlan = user?.plan || 'free';
                const planLabel = planMap[userPlan] || userPlan.toUpperCase();
                
                return (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl lg:text-4xl font-extrabold">
                        👋 Bienvenue, {user?.first_name || user?.username}!
                      </h1>
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-bold border border-white/30">
                        {planLabel}
                      </span>
                    </div>
                    <p className="text-white/90 text-lg">Voici un aperçu complet de votre boutique aujourd'hui</p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Errors are handled silently for a professional UX */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              const changePositive = stat.change >= 0;
              return (
                <Card
                  key={stat.key}
                  className="dash-card border-2 border-gray-100 dark:border-gray-800 hover:border-[#0077FF]/30 hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <CardContent className="p-6 dash-animate">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0077FF]/20 to-[#5AC8FA]/20 flex items-center justify-center shadow-lg">
                        <Icon className="w-7 h-7 text-[#0077FF] dark:text-[#5AC8FA]" />
                      </div>
                      {stat.change !== 0 && (
                        <div className={`dash-pill ${changePositive ? "dash-pill-up" : "dash-pill-down"}`}>
                          {changePositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">{(stat.change ?? 0).toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[#0A1A2F]/60 dark:text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
                    <p className="text-[#0A1A2F] dark:text-white text-3xl font-extrabold mb-2">{stat.value}</p>
                    <p className="text-xs text-[#0A1A2F]/50 dark:text-gray-500 mt-2">{stat.hint}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
            <Card className="dash-card border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#0A1A2F] dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-[#0077FF]" />
                  Chiffre d'affaires (7 jours)
                </CardTitle>
                <span className="text-sm text-[#0A1A2F]/60 dark:text-gray-400">{formatCurrency(stats?.changes.window_revenue ?? 0)}</span>
              </CardHeader>
              <CardContent className="dash-animate">
                {loading ? (
                  <div className="dash-loading">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Chargement du graphique…</span>
                  </div>
                ) : (
                  <Sparkline points={stats?.series.revenue ?? []} />
                )}
              </CardContent>
            </Card>

            <Card className="dash-card border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#0A1A2F] dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#0077FF]" />
                  Commandes (7 jours)
                </CardTitle>
                <span className="text-sm text-[#0A1A2F]/60 dark:text-gray-400">{formatNumber(stats?.changes.window_orders ?? 0)} commandes</span>
              </CardHeader>
              <CardContent className="dash-animate">
                {loading ? (
                  <div className="dash-loading">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Chargement du graphique…</span>
                  </div>
                ) : (
                  <OrderBars points={stats?.series.orders ?? []} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
            <Card className="dash-card border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F] dark:text-white text-lg font-bold">Commandes récentes</CardTitle>
              </CardHeader>
              <CardContent className="dash-animate">
                <div className="space-y-4">
                  {(stats?.recent_orders || []).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <p className="text-[#0A1A2F] dark:text-white font-semibold">{order.customer}</p>
                        <p className="text-[#0A1A2F]/60 dark:text-gray-400 text-sm">Commande #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#0A1A2F] dark:text-white font-bold">{formatCurrency(order.total)}</p>
                        <span className={`inline-block text-xs px-2 py-1 rounded-full ${statusChip(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {!loading && (stats?.recent_orders || []).length === 0 && (
                    <p className="text-sm text-[#0A1A2F]/60 dark:text-gray-400">Aucune commande récente.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="dash-card border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F] dark:text-white text-lg font-bold">Produits les plus vendus</CardTitle>
              </CardHeader>
              <CardContent className="dash-animate">
                <div className="space-y-4">
                  {(stats?.top_products || []).map((product, index) => (
                    <div key={`${product.id}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-[#0A1A2F] dark:text-white font-semibold">{product.name || "Produit"}</p>
                          <p className="text-[#0A1A2F]/60 dark:text-gray-400 text-sm">{formatNumber(product.quantity)} ventes</p>
                        </div>
                      </div>
                      <p className="text-[#0077FF] font-bold">{formatCurrency(product.revenue)}</p>
                    </div>
                  ))}
                  {!loading && (stats?.top_products || []).length === 0 && (
                    <p className="text-sm text-[#0A1A2F]/60 dark:text-gray-400">Pas encore de ventes enregistrées.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="dash-card border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1A2F] dark:text-white text-lg font-bold">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="dash-animate">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { label: "Ma Boutique", icon: Package, action: 'my-shop' },
                  { label: "Ajouter un produit", icon: Package },
                  { label: "Voir les commandes", icon: ShoppingCart },
                  { label: "Gérer les clients", icon: Users },
                  { label: "Paramètres", icon: CreditCard },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if ((action as any).action === 'my-shop') {
                          window.location.href = '/my-shop';
                          return;
                        }
                        // default: navigate to dashboard sections
                      }}
                      className="p-5 lg:p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-[#0077FF] dark:hover:border-[#5AC8FA] rounded-xl hover:shadow-xl transition-all duration-300 group dash-action bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                    >
                      <Icon className="w-8 h-8 text-[#0077FF] dark:text-[#5AC8FA] mb-3 group-hover:scale-125 transition-transform duration-300" />
                      <p className="text-[#0A1A2F] dark:text-white font-semibold text-sm">{action.label}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
}

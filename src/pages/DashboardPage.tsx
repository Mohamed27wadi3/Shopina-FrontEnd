import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

const stats = [
  {
    title: "Ventes totales",
    value: "$24,500",
    change: "+12.5%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Commandes",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Clients",
    value: "1,245",
    change: "+23.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Produits",
    value: "89",
    change: "-2.4%",
    trend: "down",
    icon: Package,
  },
];

const recentOrders = [
  { id: "#3492", customer: "Marie Dubois", amount: "$145.00", status: "Complétée", date: "Il y a 2h" },
  { id: "#3491", customer: "Thomas Martin", amount: "$89.99", status: "En cours", date: "Il y a 4h" },
  { id: "#3490", customer: "Sophie Bernard", amount: "$234.50", status: "Complétée", date: "Il y a 6h" },
  { id: "#3489", customer: "Lucas Petit", amount: "$67.00", status: "En cours", date: "Il y a 8h" },
  { id: "#3488", customer: "Emma Laurent", amount: "$189.00", status: "Complétée", date: "Hier" },
];

const topProducts = [
  { name: "T-shirt Premium", sales: 234, revenue: "$4,680" },
  { name: "Jean Slim Fit", sales: 189, revenue: "$5,670" },
  { name: "Veste en cuir", sales: 145, revenue: "$8,700" },
  { name: "Sneakers Classic", sales: 123, revenue: "$7,380" },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-8 dark:bg-gray-950">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-[#0A1A2F] dark:text-white mb-2" style={{ fontSize: '36px', fontWeight: '800' }}>
              Bienvenue, {user?.name} 👋
            </h1>
            <p className="text-[#0A1A2F]/60 dark:text-gray-400">
              Voici un aperçu de votre boutique aujourd'hui
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isPositive = stat.trend === "up";
              return (
                <Card key={index} className="border-2 border-gray-100 hover:border-[#0077FF]/30 hover:shadow-lg transition-all rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077FF]/10 to-[#5AC8FA]/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#0077FF]" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span style={{ fontWeight: '600' }}>{stat.change}</span>
                      </div>
                    </div>
                    <p className="text-[#0A1A2F]/60 text-sm mb-1">{stat.title}</p>
                    <p className="text-[#0A1A2F]" style={{ fontSize: '28px', fontWeight: '800' }}>
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <Card className="border-2 border-gray-100 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F]">Commandes récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                          {order.customer}
                        </p>
                        <p className="text-[#0A1A2F]/60 text-sm">{order.id} • {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>
                          {order.amount}
                        </p>
                        <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                          order.status === "Complétée" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="border-2 border-gray-100 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0A1A2F]">Produits les plus vendus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center text-white" style={{ fontWeight: '700' }}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                            {product.name}
                          </p>
                          <p className="text-[#0A1A2F]/60 text-sm">{product.sales} ventes</p>
                        </div>
                      </div>
                      <p className="text-[#0077FF]" style={{ fontWeight: '700' }}>
                        {product.revenue}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Ajouter un produit", icon: Package },
                  { label: "Voir les commandes", icon: ShoppingCart },
                  { label: "Gérer les clients", icon: Users },
                  { label: "Paramètres", icon: CreditCard },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className="p-6 border-2 border-gray-200 hover:border-[#0077FF] rounded-xl hover:shadow-lg transition-all group"
                    >
                      <Icon className="w-8 h-8 text-[#0077FF] mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                        {action.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

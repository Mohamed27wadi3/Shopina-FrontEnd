import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Store,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_ORIGIN = (() => { try { return new URL(API_BASE).origin; } catch { return 'http://localhost:8000'; }})();

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  // Route Commandes to React orders page (same interface)
  { icon: ShoppingCart, label: "Commandes", path: "/orders" },
  { icon: Package, label: "Produits", path: "/dashboard" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: BarChart3, label: "Statistiques", path: "/dashboard" },
  { icon: Store, label: "Ma boutique", externalHref: `${API_ORIGIN}/my-shop/` },
  { icon: CreditCard, label: "Paiements", path: "/pricing" },
  { icon: Settings, label: "Paramètres", path: "/profile" },
  { icon: HelpCircle, label: "Aide", path: "/support" },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen p-6 hidden lg:block">
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return item.externalHref ? (
            <a
              key={index}
              href={item.externalHref}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white shadow-lg shadow-[#0077FF]/20"
                  : "text-[#0A1A2F]/70 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0077FF] dark:hover:text-[#5AC8FA]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span style={{ fontWeight: isActive ? '600' : '500' }}>
                {item.label}
              </span>
            </a>
          ) : (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white shadow-lg shadow-[#0077FF]/20"
                  : "text-[#0A1A2F]/70 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0077FF] dark:hover:text-[#5AC8FA]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span style={{ fontWeight: isActive ? '600' : '500' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="mt-8 p-4 bg-gradient-to-br from-[#0077FF]/5 to-[#5AC8FA]/5 rounded-2xl border border-[#0077FF]/20">
        <p className="text-[#0A1A2F] mb-2" style={{ fontWeight: '700' }}>
          Passez au plan Pro
        </p>
        <p className="text-[#0A1A2F]/60 text-sm mb-4">
          Débloquez toutes les fonctionnalités premium
        </p>
        <button 
          onClick={() => navigate("/pricing")}
          className="w-full bg-[#FFD43B] hover:bg-[#FFD43B]/90 text-[#0A1A2F] py-2 rounded-xl transition-colors" 
          style={{ fontWeight: '600' }}
        >
          Mettre à niveau
        </button>
      </div>
    </aside>
  );
}
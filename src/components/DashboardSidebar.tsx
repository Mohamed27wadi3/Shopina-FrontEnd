import { useState } from "react";
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

import { API_BASE } from "../utils/apiBase";
const API_ORIGIN = (() => { try { return new URL(API_BASE).origin; } catch { return 'http://localhost:8000'; }})();

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  { icon: Store, label: "Ma boutique", path: "/my-shop" },
  // Commandes will render with submenu
    { icon: Package, label: "Produits", path: "/my-shop" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: BarChart3, label: "Statistiques", path: "/dashboard" },
    { icon: CreditCard, label: "Paiements", path: "/pricing" },
    { icon: Settings, label: "Paramètres", path: "/profile" },
    { icon: HelpCircle, label: "Aide", path: "/support" },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openOrders, setOpenOrders] = useState(false);

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
        {/* Commandes submenu */}
        <div>
          <button
            onClick={() => setOpenOrders((s) => !s)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${
              location.pathname.startsWith('/orders')
                ? "bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white shadow-lg shadow-[#0077FF]/20"
                : "text-[#0A1A2F]/70 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0077FF] dark:hover:text-[#5AC8FA]"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span style={{ fontWeight: location.pathname.startsWith('/orders') ? '600' : '500' }}>Commandes</span>
          </button>

          {openOrders && (
            <div className="mt-2 space-y-2 pl-8">
              <Link to="/orders" className="block px-3 py-2 rounded-md hover:bg-gray-50">Toutes les commandes</Link>
              <Link to="/orders/create" className="block px-3 py-2 rounded-md hover:bg-gray-50">Ajouter commande</Link>
              <Link to="/orders/import" className="block px-3 py-2 rounded-md hover:bg-gray-50">Importer commandes</Link>
            </div>
          )}
        </div>
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
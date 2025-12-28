import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ShoppingBag, ShieldCheck, CreditCard, Inbox } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

export type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "order" | "security" | "billing" | "general";
  unread?: boolean;
};

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    // TODO: replace with real API call when backend notifications endpoint is ready
    const seed: Notification[] = [
      {
        id: "1",
        title: "Nouvelle commande",
        description: "Commande #1024 a été payée",
        time: "il y a 5 min",
        type: "order",
        unread: true,
      },
      {
        id: "2",
        title: "Paiement en attente",
        description: "La facture Pro arrive à échéance",
        time: "il y a 1 h",
        type: "billing",
        unread: true,
      },
      {
        id: "3",
        title: "Connexion sécurisée",
        description: "2FA vérifiée sur ce device",
        time: "il y a 3 h",
        type: "security",
        unread: false,
      },
      {
        id: "4",
        title: "Stock bas",
        description: "Produit " + (user?.shop_name || "boutique") + " atteint le seuil de stock",
        time: "hier",
        type: "general",
        unread: false,
      },
    ];
    setNotifications(seed);
  }, [user?.shop_name]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const iconForType = (type: Notification["type"]) => {
    const common = "w-4 h-4";
    switch (type) {
      case "order":
        return <ShoppingBag className={`${common} text-emerald-500`} />;
      case "security":
        return <ShieldCheck className={`${common} text-indigo-400`} />;
      case "billing":
        return <CreditCard className={`${common} text-amber-500`} />;
      default:
        return <Inbox className={`${common} text-sky-400`} />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative rounded-xl transition-all hover:bg-[#0077FF]/10 dark:hover:bg-[#5AC8FA]/15 focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 hover:scale-105 active:scale-95"
        >
          <Bell className={`w-5 h-5 text-[#0A1A2F] dark:text-gray-100 transition-transform ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] leading-[20px] rounded-full text-center font-bold shadow-lg shadow-red-500/50 animate-pulse border-2 border-white dark:border-gray-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
          <div>
            <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white">Notifications</p>
            <p className="text-xs text-[#0A1A2F]/60 dark:text-gray-400">Compte, boutique, paiements, sécurité</p>
          </div>
          {unreadCount > 0 && (
            <span className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full">
              {unreadCount} non lues
            </span>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[#0A1A2F]/60 dark:text-gray-400">
              Aucune notification pour le moment
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-3 flex gap-3 items-start transition-colors ${notif.unread ? "bg-[#0077FF]/5 dark:bg-[#5AC8FA]/12" : "hover:bg-[#0077FF]/6 dark:hover:bg-[#5AC8FA]/12"}`}
                onClick={() => markAsRead(notif.id)}
                role="button"
              >
                <div className="mt-0.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {iconForType(notif.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white">{notif.title}</p>
                    <span className="text-[11px] text-[#0A1A2F]/50 dark:text-gray-400">{notif.time}</span>
                  </div>
                  <p className="text-sm text-[#0A1A2F]/70 dark:text-gray-300">{notif.description}</p>
                </div>
                {notif.unread && <span className="mt-1 w-2 h-2 rounded-full bg-[#0077FF]" aria-label="Non lu" />}
              </div>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-center">
          <button
            className="text-sm font-semibold text-[#0077FF] dark:text-[#5AC8FA] hover:underline"
            onClick={() => navigate("/dashboard")}
          >
            Voir tout dans le dashboard
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

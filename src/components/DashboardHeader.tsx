import { Link, useNavigate } from "react-router-dom";
import { Search, Moon, Sun, Globe, User, Settings, Home, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../context/AuthContext";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { NotificationBell } from "./NotificationBell";
import { API_BASE } from "../utils/apiBase";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, language, setTheme, setLanguage, t } = useThemeLanguage();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50 transition-colors">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="font-bold text-[#0A1A2F] dark:text-white hidden sm:inline">Shopina</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher des produits, commandes..."
                className="pl-12 h-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#0077FF] dark:focus:border-[#5AC8FA]"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/5 dark:hover:bg-[#5AC8FA]/10 rounded-lg font-semibold"
              >
                🏠 Page Principale
              </Button>
            </Link>

            {/* Notifications */}
            <NotificationBell />

            {/* Theme Toggle */}
            <Button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="ghost"
              size="icon"
              className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/5 dark:hover:bg-[#5AC8FA]/10 rounded-xl"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Language Toggle */}
            <Button
              onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
              variant="ghost"
              size="icon"
              className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/5 dark:hover:bg-[#5AC8FA]/10 rounded-xl"
              title={language === "fr" ? "العربية" : "Français"}
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-xs font-bold">{language === "fr" ? "FR" : "AR"}</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-[#0077FF]/10 dark:hover:bg-[#5AC8FA]/20 p-2 rounded-xl transition-all hover:shadow-md border-2 border-transparent hover:border-[#0077FF]/20">
                  <Avatar className="w-10 h-10">
                    {user?.avatar && (
                      <AvatarImage
                        src={user.avatar.startsWith("http") ? user.avatar : `${API_BASE}${user.avatar}`}
                        alt={user.first_name || user.username}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] text-white font-bold">
                      {(user?.first_name || user?.username || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden lg:block">
                    <p className="text-[#0A1A2F] dark:text-gray-100 text-sm font-semibold">
                      {user?.first_name || user?.username}
                    </p>
                    <p className="text-[#0A1A2F]/60 dark:text-gray-400 text-xs">
                      Plan {user?.plan}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl border-2 p-2">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[#0A1A2F] dark:text-white">{user?.first_name || user?.username}</span>
                    <span className="text-xs text-[#0A1A2F]/60 dark:text-gray-400">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={() => navigate("/profile")} 
                  className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 hover:bg-[#0077FF]/10 transition-colors"
                >
                  <User className="w-4 h-4 text-[#0077FF]" />
                  <span className="font-medium">{t("profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/my-shop")} 
                  className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 hover:bg-[#0077FF]/10 transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#0077FF]" />
                  <span className="font-medium">Paramètres boutique</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/")}
                  className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 hover:bg-[#0077FF]/10 transition-colors"
                >
                  <Home className="w-4 h-4 text-[#0077FF]" />
                  <span className="font-medium">Page principale</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Globe, LogOut } from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NotificationBell } from "./NotificationBell";

import { API_BASE } from '../utils/apiBase';
const API_ORIGIN = (() => {
  try { return new URL(API_BASE).origin; } catch { return 'http://localhost:8000'; }
})();

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, language, setTheme, setLanguage, t } = useThemeLanguage();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Cliquable vers accueil */}
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Retour à l'accueil"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="font-bold text-[#0A1A2F] dark:text-white hidden sm:inline">Shopina</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/6 dark:hover:bg-[#5AC8FA]/12 px-2 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/10 dark:focus-visible:bg-[#5AC8FA]/15">
              {t("features")}
            </Link>
            <Link to="/pricing" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/6 dark:hover:bg-[#5AC8FA]/12 px-2 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/10 dark:focus-visible:bg-[#5AC8FA]/15">
              {t("pricing")}
            </Link>
            <Link to="/templates" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/6 dark:hover:bg-[#5AC8FA]/12 px-2 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/10 dark:focus-visible:bg-[#5AC8FA]/15">
              {t("templates")}
            </Link>
            <Link to="/shop" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/6 dark:hover:bg-[#5AC8FA]/12 px-2 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/10 dark:focus-visible:bg-[#5AC8FA]/15">
              {t("shop")}
            </Link>
            <Link to="/support" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/6 dark:hover:bg-[#5AC8FA]/12 px-2 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/10 dark:focus-visible:bg-[#5AC8FA]/15">
              {t("support")}
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NotificationBell />
            {/* Theme Toggle */}
            <Button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="ghost"
              size="icon"
              className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/8 dark:hover:bg-[#5AC8FA]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/12 dark:focus-visible:bg-[#5AC8FA]/18"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Language Toggle */}
            <Button
              onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
              variant="ghost"
              size="icon"
              className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/8 dark:hover:bg-[#5AC8FA]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/12 dark:focus-visible:bg-[#5AC8FA]/18"
              title={language === "fr" ? "العربية" : "Français"}
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-xs font-bold">{language === "fr" ? "FR" : "AR"}</span>
            </Button>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors">
                    <Avatar className="w-8 h-8">
                      {user?.avatar && (
                        <AvatarImage
                          src={user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`}
                          alt={user.first_name || user.username}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] text-white text-xs" style={{ fontWeight: '700' }}>
                        {(user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-[#0A1A2F] dark:text-gray-100 hidden sm:inline">
                      {user?.first_name || user?.username}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    {t("dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    {t("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => { navigate('/my-shop'); }}
                  >
                    Ma boutique
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/login")}
                  variant="ghost" 
                  className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/8 dark:hover:bg-[#5AC8FA]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 dark:focus-visible:ring-[#5AC8FA]/50 focus-visible:bg-[#0077FF]/12 dark:focus-visible:bg-[#5AC8FA]/18"
                >
                  {t("loginBtn")}
                </Button>
                <Button 
                  onClick={() => navigate("/signup")}
                  className="bg-[#0077FF] hover:bg-[#0077FF]/90 dark:bg-[#5AC8FA] dark:hover:bg-[#5AC8FA]/90 text-white dark:text-black rounded-xl px-6 shadow-lg shadow-[#0077FF]/20 transition-colors"
                >
                  {t("signup")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
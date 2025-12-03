import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Globe } from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export function Header() {
  const navigate = useNavigate();
  const { theme, language, setTheme, setLanguage, t } = useThemeLanguage();

  return (
    <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/shopina logo sans background.png" alt="Shopina" className="h-9 w-auto" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] transition-colors">
              {t("features")}
            </Link>
            <Link to="/pricing" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] transition-colors">
              {t("pricing")}
            </Link>
            <Link to="/templates" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] transition-colors">
              {t("templates")}
            </Link>
            <Link to="/shop" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] transition-colors">
              {t("shop")}
            </Link>
            <Link to="/support" className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] transition-colors">
              {t("support")}
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="ghost"
              size="icon"
              className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/5 dark:hover:bg-[#5AC8FA]/10"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Language Toggle */}
            <Button
              onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
              variant="ghost"
              size="icon"
              className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/5 dark:hover:bg-[#5AC8FA]/10"
              title={language === "fr" ? "العربية" : "Français"}
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-xs font-bold">{language === "fr" ? "FR" : "AR"}</span>
            </Button>

            <Button 
              onClick={() => navigate("/login")}
              variant="ghost" 
              className="text-[#0A1A2F] dark:text-gray-100 hover:text-[#0077FF] dark:hover:text-[#5AC8FA] hover:bg-[#0077FF]/5 dark:hover:bg-[#5AC8FA]/10"
            >
              {t("login")}
            </Button>
            <Button 
              onClick={() => navigate("/signup")}
              className="bg-[#0077FF] hover:bg-[#0077FF]/90 dark:bg-[#5AC8FA] dark:hover:bg-[#5AC8FA]/90 text-white dark:text-black rounded-xl px-6 shadow-lg shadow-[#0077FF]/20 transition-colors"
            >
              {t("signup")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
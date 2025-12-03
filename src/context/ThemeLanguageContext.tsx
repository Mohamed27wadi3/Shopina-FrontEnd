import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type Language = "fr" | "ar";

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    features: "Fonctionnalités",
    pricing: "Tarifs",
    templates: "Templates",
    shop: "Boutique",
    support: "Support",
    login: "Se connecter",
    signup: "Créer ma boutique",
    profile: "Profil",
    dashboard: "Tableau de bord",
    settings: "Paramètres",
    logout: "Déconnexion",
    myAccount: "Mon compte",
  },
  ar: {
    features: "المميزات",
    pricing: "الأسعار",
    templates: "القوالب",
    shop: "المتجر",
    support: "الدعم",
    login: "تسجيل الدخول",
    signup: "إنشاء متجري",
    profile: "الملف الشخصي",
    dashboard: "لوحة التحكم",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    myAccount: "حسابي",
  },
};

interface ThemeLanguageContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export function ThemeLanguageProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "fr";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.style.backgroundColor = "#0A0A0A";
      document.body.style.color = "#FFFFFF";
    } else {
      document.body.classList.remove("dark");
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.style.color = "#0A1A2F";
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    if (language === "ar") {
      document.body.style.fontFamily = "'Segoe UI', 'Arial', 'Arial Unicode MS', sans-serif";
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
}

export function useThemeLanguage() {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error("useThemeLanguage must be used within ThemeLanguageProvider");
  }
  return context;
}

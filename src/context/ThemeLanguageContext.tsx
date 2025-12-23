import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type Language = "fr" | "ar";

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
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

    // Homepage
    heroTitle: "La première plateforme e-commerce algérienne",
    heroSubtitle: "Shopina est la plateforme la plus simple pour créer votre boutique en ligne en Algérie",
    heroStartBtn: "Commencer gratuitement",
    algerian: "100% Algérienne",

    // Features
    feature1Title: "Simple et intuitif",
    feature1Desc: "Interface facile à utiliser, pas besoin de connaissances techniques",
    feature2Title: "Sécurisé",
    feature2Desc: "Paiements sécurisés et données protégées",
    feature3Title: "Rapide",
    feature3Desc: "Votre boutique est en ligne en quelques minutes",

    // Pricing
    starter: "Starter",
    professional: "Professional",
    enterprise: "Enterprise",
    free: "Gratuit",
    monthlyPrice: "/mois",
    tryFree: "Essayer gratuitement",
    upgrade: "Passer à la formule",

    // Buttons
    createShop: "Créer ma boutique",
    loginBtn: "Se connecter",
    search: "Rechercher des produits, commandes...",
  },
  ar: {
    // Navigation
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

    // Homepage
    heroTitle: "أول منصة تجارة إلكترونية جزائرية",
    heroSubtitle: "شوبينا، مستوحاة من Shopify، أبسط منصة لإنشاء متجرك الإلكتروني في الجزائر",
    heroStartBtn: "ابدأ مجانًا",
    algerian: "100% جزائرية",
    shopifyInspired: "مستوحاة من Shopify",

    // Features
    feature1Title: "بسيط وسهل الاستخدام",
    feature1Desc: "واجهة سهلة الاستخدام، لا تحتاج إلى معرفة تقنية",
    feature2Title: "آمن",
    feature2Desc: "دفع آمن وحماية البيانات",
    feature3Title: "سريع",
    feature3Desc: "متجرك الإلكتروني متاح في دقائق",

    // Pricing
    starter: "مبتدئ",
    professional: "احترافي",
    enterprise: "مؤسسي",
    free: "مجاني",
    monthlyPrice: "/شهر",
    tryFree: "جرّب مجانًا",
    upgrade: "الترقية إلى الخطة",

    // Buttons
    createShop: "إنشاء متجري",
    loginBtn: "تسجيل الدخول",
    search: "البحث عن المنتجات والطلبات...",
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
  console.log("🎨 ThemeLanguageProvider rendering");
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
    const html = document.documentElement;
    const body = document.body;

    if (theme === "dark") {
      html.classList.add("dark");
      body.classList.add("dark");
      html.style.backgroundColor = "#0A0A0A";
      html.style.color = "#FFFFFF";
      body.style.backgroundColor = "#0A0A0A";
      body.style.color = "#FFFFFF";

      // Force all text to be visible
      document.querySelectorAll("*").forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.color === "rgb(10, 26, 47)" || computed.color === "#0A1A2F") {
          (el as HTMLElement).style.color = "#FFFFFF !important";
        }
      });
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
      html.style.backgroundColor = "#FFFFFF";
      html.style.color = "#0A1A2F";
      body.style.backgroundColor = "#FFFFFF";
      body.style.color = "#0A1A2F";
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

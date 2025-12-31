import { ShoppingBag, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../utils/apiBase";

const footerLinks = {
  produit: [
    { label: "Fonctionnalités", href: "/#features" },
    { label: "Tarifs", href: "/pricing" },
    { label: "Templates", href: "/templates" },
    { label: "Intégrations", href: "/shop" },
  ],
  ressources: [
    { label: "Blog", href: "/support" },
    { label: "Documentation", href: "/support" },
    { label: "Guides", href: "/support" },
    { label: "Webinars", href: "/support" },
  ],
  entreprise: [
    { label: "À propos", href: "/support" },
    { label: "Carrières", href: "/support" },
    { label: "Contact", href: "/support" },
    { label: "Partenaires", href: "/shop" },
  ],
  legal: [
    { label: "Politique de confidentialité", href: "/support" },
    { label: "Conditions d'utilisation", href: "/support" },
    { label: "Mentions légales", href: "/support" },
    { label: "RGPD", href: "/support" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-[#0A1A2F] text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-white tracking-tight" style={{ fontSize: '24px', fontWeight: '700' }}>
                Shopina
              </span>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm">
              La plateforme e-commerce moderne qui vous permet de créer et gérer votre boutique en ligne en toute simplicité.
            </p>
            {/* User Profile Section */}
            {user && (
              <div className="bg-white/5 rounded-lg p-3 mb-6 max-w-sm">
                <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  {user.avatar ? (
                    <img
                      src={user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`}
                      alt={user.first_name || user.username}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%230077FF' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='50' fill='white' text-anchor='middle' dy='.3em'%3E${(user.first_name || user.username || 'U').charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center text-sm font-bold">
                      {(user.first_name || user.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name || user.username}
                    </p>
                    <p className="text-xs text-white/60">Voir mon profil</p>
                  </div>
                </Link>
              </div>
            )}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#0077FF] flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white mb-4" style={{ fontWeight: '700' }}>
              Produit
            </h3>
            <ul className="space-y-3">
              {footerLinks.produit.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4" style={{ fontWeight: '700' }}>
              Ressources
            </h3>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4" style={{ fontWeight: '700' }}>
              Entreprise
            </h3>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4" style={{ fontWeight: '700' }}>
              Légal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © 2025 Shopina. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
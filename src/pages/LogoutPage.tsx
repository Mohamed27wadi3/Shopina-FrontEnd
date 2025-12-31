import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    // small delay then navigate to login (user can also click)
    const t = setTimeout(() => navigate('/login'), 1200);
    return () => clearTimeout(t);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077FF]/5 via-[#5AC8FA]/5 to-white dark:from-[#0A0A0A] dark:via-[#1A1A1A] dark:to-[#0A0A0A] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#0077FF]/10 to-[#5AC8FA]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#5AC8FA]/10 to-[#0077FF]/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-[#0A1A2F] dark:text-white tracking-tight text-[28px] font-bold">
            Shopina
          </span>
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
          <h1 className="text-[#0A1A2F] dark:text-white mb-2 text-[28px] font-extrabold">Vous êtes déconnecté</h1>
          <p className="text-[#0A1A2F]/70 mb-6">Vous avez été déconnecté avec succès.</p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

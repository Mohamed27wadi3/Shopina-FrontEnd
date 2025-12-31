import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
// Header intentionally removed to keep the login form centered like signup
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(identifier, password, rememberMe);
      toast.success("🎉 Connexion réussie ! Bienvenue sur Shopina", {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)'
        }
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      const errorMsg = error?.message || "Erreur de connexion. Veuillez réessayer.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // For now, show informative message
      toast.info("Connexion Google bientôt disponible", {
        description: "Cette fonctionnalité nécessite la configuration des credentials OAuth dans l'admin Django"
      });
      
      // Uncomment when OAuth credentials are configured:
      // window.location.href = `http://localhost:8000/accounts/google/login/?next=${encodeURIComponent('http://localhost:3003/dashboard')}`;
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      toast.error("Erreur lors de la connexion avec Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      // For now, show informative message
      toast.info("Connexion GitHub bientôt disponible", {
        description: "Cette fonctionnalité nécessite la configuration des credentials OAuth dans l'admin Django"
      });
      
      // Uncomment when OAuth credentials are configured:
      // window.location.href = `http://localhost:8000/accounts/github/login/?next=${encodeURIComponent('http://localhost:3003/dashboard')}`;
    } catch (error: any) {
      console.error("❌ GitHub login error:", error);
      toast.error("Erreur lors de la connexion avec GitHub");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077FF]/5 via-[#5AC8FA]/5 to-white dark:from-[#0A0A0A] dark:via-[#1A1A1A] dark:to-[#0A0A0A] flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#0077FF]/10 to-[#5AC8FA]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#5AC8FA]/10 to-[#0077FF]/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-[#0A1A2F] dark:text-white tracking-tight text-[28px] font-bold">
            Shopina
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-[#0A1A2F] dark:text-white mb-2 text-[32px] font-extrabold">
              Bon retour !
            </h1>
            <p className="text-[#0A1A2F]/60 dark:text-gray-400">
              Connectez-vous pour accéder à votre boutique
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identifier (Email/Username/Phone) */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-[#0A1A2F] dark:text-white text-sm">
                Email, nom d'utilisateur ou téléphone
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 dark:text-white/40" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="email@exemple.com, username ou +33612345678"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#0077FF] dark:bg-gray-800 dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0A1A2F] text-sm">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#0077FF] text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A1A2F]/40 hover:text-[#0A1A2F]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0077FF] focus:ring-[#0077FF]" 
                />
                <span className="text-sm text-[#0A1A2F]/70 dark:text-white/70">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#0077FF] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white h-12 rounded-xl shadow-lg shadow-[#0077FF]/30"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#0A1A2F]/60">Ou continuer avec</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="h-12 rounded-xl border-2 border-gray-200 hover:border-[#0077FF]/30 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                type="button"
                onClick={handleGitHubLogin}
                disabled={isLoading}
                variant="outline"
                className="h-12 rounded-xl border-2 border-gray-200 hover:border-[#0077FF]/30 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-[#0A1A2F]/60">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-[#0077FF] hover:underline" style={{ fontWeight: '600' }}>
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-[#0A1A2F]/60 hover:text-[#0077FF] text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

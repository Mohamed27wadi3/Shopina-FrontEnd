import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingBag, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Header } from "../components/Header";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Lien invalide ou expiré");
      navigate("/forgot-password");
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${window.location.origin.replace(':3003', ':8000')}/api/users/password-reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.error || 'Erreur lors de la réinitialisation');
      }

      setIsSuccess(true);
      toast.success("🔐 Mot de passe réinitialisé avec succès !", {
        duration: 4000,
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
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("❌ Password reset error:", error);
      toast.error(error.message || "Erreur lors de la réinitialisation. Le lien est peut-être expiré.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
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
          <span className="text-[#0A1A2F] dark:text-white tracking-tight" style={{ fontSize: '28px', fontWeight: '700' }}>
            Shopina
          </span>
        </Link>

        {/* Reset Password Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-[#0A1A2F] dark:text-white mb-2" style={{ fontSize: '32px', fontWeight: '800' }}>
                  Nouveau mot de passe
                </h1>
                <p className="text-[#0A1A2F]/60 dark:text-gray-400">
                  Entrez votre nouveau mot de passe
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-[#0A1A2F] dark:text-white">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 dark:text-gray-500" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#0077FF] dark:bg-gray-800 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A1A2F]/40 dark:text-gray-500 hover:text-[#0A1A2F] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#0A1A2F] dark:text-white">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 dark:text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#0077FF] dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-[#0077FF]/10 dark:bg-[#0077FF]/20 border border-[#0077FF]/20 rounded-xl p-4">
                  <p className="text-xs text-[#0A1A2F]/70 dark:text-gray-300">
                    Le mot de passe doit contenir au moins :
                  </p>
                  <ul className="text-xs text-[#0A1A2F]/70 dark:text-gray-300 mt-2 space-y-1 list-disc list-inside">
                    <li>8 caractères</li>
                    <li>Une lettre majuscule</li>
                    <li>Une lettre minuscule</li>
                    <li>Un chiffre</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white h-12 rounded-xl shadow-lg shadow-[#0077FF]/30"
                >
                  {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-[#0A1A2F] dark:text-white mb-2" style={{ fontSize: '28px', fontWeight: '800' }}>
                    Mot de passe réinitialisé !
                  </h1>
                  <p className="text-[#0A1A2F]/60 dark:text-gray-400">
                    Votre mot de passe a été modifié avec succès.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Vous allez être redirigé vers la page de connexion dans quelques secondes...
                  </p>
                </div>

                {/* Go to Login */}
                <Link to="/login">
                  <Button className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white h-12 rounded-xl shadow-lg shadow-[#0077FF]/30">
                    Se connecter maintenant
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-[#0A1A2F]/60 dark:text-gray-400 hover:text-[#0077FF] dark:hover:text-[#0077FF] text-sm transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}

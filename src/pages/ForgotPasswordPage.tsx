import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Header } from "../components/Header";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${window.location.origin.replace(':3003', ':8000')}/api/users/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.error || 'Erreur lors de l\'envoi du email');
      }

      setIsEmailSent(true);
      toast.success("📧 Email envoyé ! Vérifiez votre boîte de réception.", {
        duration: 5000,
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
    } catch (error: any) {
      console.error("❌ Password reset error:", error);
      toast.error(error.message || "Erreur lors de l'envoi. Veuillez réessayer.");
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
          <span className="text-[#0A1A2F] dark:text-white tracking-tight text-[28px] font-bold">
            Shopina
          </span>
        </Link>

        {/* Reset Password Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
          {!isEmailSent ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-[#0A1A2F] dark:text-white mb-2 text-[32px] font-extrabold">
                  Mot de passe oublié ?
                </h1>
                <p className="text-[#0A1A2F]/60 dark:text-gray-400">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#0A1A2F] dark:text-white">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#0077FF] dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white h-12 rounded-xl shadow-lg shadow-[#0077FF]/30"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                </Button>

                {/* Back to Login */}
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-2 text-sm text-[#0A1A2F]/60 dark:text-gray-400 hover:text-[#0077FF] dark:hover:text-[#0077FF] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
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
                  <h1 className="text-[#0A1A2F] dark:text-white mb-2 text-[28px] font-extrabold">
                    Email envoyé !
                  </h1>
                  <p className="text-[#0A1A2F]/60 dark:text-gray-400">
                    Nous avons envoyé un lien de réinitialisation à
                  </p>
                  <p className="text-[#0077FF] font-medium mt-2">
                    {email}
                  </p>
                </div>

                <div className="bg-[#0077FF]/10 dark:bg-[#0077FF]/20 border border-[#0077FF]/20 rounded-xl p-4">
                  <p className="text-sm text-[#0A1A2F]/70 dark:text-gray-300">
                    Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                    Le lien expire dans <strong>1 heure</strong>.
                  </p>
                </div>

                {/* Resend Email */}
                <div className="space-y-3">
                  <p className="text-sm text-[#0A1A2F]/60 dark:text-gray-400">
                    Vous n'avez pas reçu l'email ?
                  </p>
                  <Button
                    onClick={() => setIsEmailSent(false)}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#0077FF]/30 dark:text-white"
                  >
                    Renvoyer l'email
                  </Button>
                </div>

                {/* Back to Login */}
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-2 text-sm text-[#0A1A2F]/60 dark:text-gray-400 hover:text-[#0077FF] dark:hover:text-[#0077FF] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
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

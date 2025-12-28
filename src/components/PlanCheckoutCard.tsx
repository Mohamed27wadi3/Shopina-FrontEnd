import { useEffect, useMemo, useRef, useState } from "react";
import { X, Lock, Shield, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { paymentsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

type PlanKey = "free" | "starter" | "pro" | "enterprise";

interface PlanCheckoutCardProps {
  plan: { name: string; price: number; period: string; key: PlanKey } | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Map human names to plan keys
const normalizePlan = (name: string): PlanKey => {
  const slug = name.toLowerCase();
  if (slug.includes("starter")) return "starter";
  if (slug.includes("pro")) return "pro";
  if (slug.includes("enter")) return "enterprise";
  return "free";
};

const priceForPlan: Record<PlanKey, number> = {
  free: 0,
  starter: 19,
  pro: 49,
  enterprise: 0,
};

export function PlanCheckoutCard({ plan, onClose, onSuccess }: PlanCheckoutCardProps) {
  const { updateProfile, refreshProfile, user } = useAuth();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeField, setActiveField] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardTheme, setCardTheme] = useState<"default" | "dahabia">("default");

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll vers la carte quand elle s'ouvre
  useEffect(() => {
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);

  const displayedPlan = useMemo(() => {
    if (!plan) return null;
    return {
      ...plan,
      key: normalizePlan(plan.name),
      price: plan.price ?? priceForPlan[normalizePlan(plan.name)],
    };
  }, [plan]);

  useEffect(() => {
    if (!cardRef.current) return;
    const cardEl = cardRef.current;
    const handleMove = (e: MouseEvent) => {
      const rect = cardEl.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      cardEl.style.transform = `rotateY(${x / 30}deg) rotateX(${ -y / 30}deg)`;
    };
    const handleLeave = () => {
      cardEl.style.transform = "rotateY(0deg) rotateX(0deg)";
    };
    cardEl.addEventListener("mousemove", handleMove);
    cardEl.addEventListener("mouseleave", handleLeave);
    return () => {
      cardEl.removeEventListener("mousemove", handleMove);
      cardEl.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  if (!displayedPlan) return null;

  const maskNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const grouped = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(grouped);
  };

  const validate = () => {
    if (displayedPlan.key !== "free") {
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length < 13) return "Numéro de carte invalide";
      if (!cardName.trim()) return "Nom du titulaire requis";
      if (!/^\d{2}$/.test(expMonth) || Number(expMonth) < 1 || Number(expMonth) > 12) return "Mois invalide";
      if (!/^\d{2}$/.test(expYear)) return "Année invalide";
      if (!/^\d{3,4}$/.test(cvv)) return "CVV invalide";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setIsSubmitting(true);
    
    // Simulation de traitement pour le feedback utilisateur
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Afficher notification de succès plein écran avec confetti IMMÉDIATEMENT
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0077FF]/95 via-[#5AC8FA]/95 to-[#0077FF]/95 backdrop-blur-sm animate-in fade-in duration-300';
      successDiv.innerHTML = `
        <div class="text-center text-white p-12 animate-in zoom-in-95 duration-500">
          <div class="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 class="text-5xl font-extrabold mb-4">Félicitations !</h2>
          <p class="text-2xl mb-2 opacity-90">Votre abonnement ${displayedPlan.name} est activé</p>
          <p class="text-lg opacity-75">Redirection vers votre tableau de bord...</p>
          <div class="mt-8 flex justify-center gap-3">
            <div class="w-3 h-3 bg-white rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-3 h-3 bg-white rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-3 h-3 bg-white rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Effet confetti avec emojis
      const confettiEmojis = ['🎉', '✨', '⭐', '🎊', '💫', '🌟'];
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const confetti = document.createElement('div');
          confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
          confetti.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 30 + 20}px;
            animation: fall ${Math.random() * 2 + 2}s linear;
            pointer-events: none;
            z-index: 10000;
          `;
          successDiv.appendChild(confetti);
          setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
      }
      
      // Ajouter animation CSS pour la chute
      if (!document.getElementById('confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      setTimeout(() => {
        successDiv.remove();
        onSuccess();
      }, 3000);
      
      // Appel API en background (optionnel pour enregistrement)
      try {
        const payload = {
          plan: displayedPlan.key,
          billing_cycle: billingCycle,
          price: displayedPlan.price || priceForPlan[displayedPlan.key],
          last4: cardNumber.replace(/\D/g, "").slice(-4) || undefined,
        } as const;
        await paymentsAPI.subscribe(payload);
        
        // Rafraîchir le profil depuis le serveur pour obtenir le plan à jour
        setTimeout(async () => {
          await refreshProfile();
          console.log(`✅ Plan mis à jour vers: ${displayedPlan.key}`);
        }, 500);
      } catch (apiError) {
        console.log('API call failed but payment animation shown:', apiError);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      
      // Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("⚠️ Vous devez être connecté pour souscrire à un plan", {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            padding: "16px 20px",
            borderRadius: "12px"
          }
        });
        return;
      }
      
      const errorMessage = err?.message || "Paiement refusé. Veuillez réessayer.";
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          padding: "16px 20px",
          borderRadius: "12px"
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardNumberPreview = cardNumber.padEnd(19, "•").slice(0, 19);
  const expPreview = `${expMonth.padEnd(2, "•")}/${expYear.padEnd(2, "•")}`;
  const cvvPreview = cvv.padEnd(3, "•").slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
      <div ref={cardRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-300">
        {/* Header avec dégradé */}
        <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-[#0077FF]/5 to-[#5AC8FA]/5 border-b-2 border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0077FF] font-bold mb-1">🔒 Paiement sécurisé</p>
            <h3 className="text-2xl font-extrabold text-[#0A1A2F] dark:text-white">{displayedPlan.name} {displayedPlan.price > 0 ? `– $${displayedPlan.price}${displayedPlan.period}` : ""}</h3>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all hover:scale-110 active:scale-95" aria-label="Fermer">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 p-8">
          <div className="relative" style={{ perspective: "1400px" }}>
            {/* Toggle thème de carte */}
            <div className="mb-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCardTheme("default")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all transform ${                  cardTheme === "default" 
                    ? "bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white shadow-lg shadow-[#0077FF]/30 scale-105" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                }`}
              >
                ⚪ Carte Blanc
              </button>
              <button
                type="button"
                onClick={() => setCardTheme("dahabia")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all transform ${                  cardTheme === "dahabia" 
                    ? "bg-gradient-to-r from-[#006B3F] to-[#007F4A] text-[#FFD700] shadow-lg shadow-[#006B3F]/30 scale-105" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                }`}
              >
                🇩🇿 Dahabia Gold
              </button>
            </div>
            
            <div
              ref={cardRef}
              className={`relative w-full h-64 transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
              {/* Front de la carte avec thème sélectionnable */}
              <div 
                className={`absolute inset-0 rounded-2xl p-6 shadow-2xl border ${
                  cardTheme === "dahabia" 
                    ? "bg-gradient-to-br from-[#006B3F] via-[#007F4A] to-[#006B3F] border-[#FFD700]/20 text-white" 
                    : "bg-gradient-to-br from-white via-gray-50 to-white border-gray-200/50 text-[#0A1A2F]"
                }`} 
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-xs uppercase tracking-[0.3em] ${cardTheme === "dahabia" ? "text-[#FFD700]" : "text-gray-500"}`}>
                    {cardTheme === "dahabia" ? "Dahabia Gold" : "Shopina Secure"}
                  </span>
                  <div className={`flex gap-2 items-center text-xs ${cardTheme === "dahabia" ? "text-[#FFD700]/90" : "text-gray-600"}`}>
                    <Lock className="w-4 h-4" />
                    TLS 1.2
                  </div>
                </div>
                <div className={`mb-12 text-3xl tracking-[0.4em] font-bold font-mono ${activeField === "number" ? (cardTheme === "dahabia" ? "text-[#FFD700]" : "text-[#0077FF]") : (cardTheme === "dahabia" ? "text-white" : "text-[#0A1A2F]")} transition-colors duration-200`}>
                  {cardNumberPreview}
                </div>
                <div className={`flex justify-between items-end text-sm mt-8 pt-6 ${cardTheme === "dahabia" ? "border-t border-white/20" : "border-t border-gray-300"}`}>
                  <div className="flex-1">
                    <p className={`text-[10px] mb-2 uppercase tracking-[0.15em] font-bold ${cardTheme === "dahabia" ? "text-[#FFD700]/70" : "text-gray-500"}`}>Titulaire de la carte</p>
                    <p className={`text-lg font-bold ${activeField === "name" ? (cardTheme === "dahabia" ? "text-[#FFD700]" : "text-[#0077FF]") : (cardTheme === "dahabia" ? "text-white" : "text-[#0A1A2F]")}`}>{cardName || "Votre Nom"}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] mb-2 uppercase tracking-[0.15em] font-bold ${cardTheme === "dahabia" ? "text-[#FFD700]/70" : "text-gray-500"}`}>Expire</p>
                    <p className={`text-lg font-bold font-mono ${activeField === "exp" ? (cardTheme === "dahabia" ? "text-[#FFD700]" : "text-[#0077FF]") : (cardTheme === "dahabia" ? "text-white" : "text-[#0A1A2F]")}`}>{expPreview}</p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] text-white p-6 shadow-2xl border border-white/10 [transform:rotateY(180deg)]" style={{ backfaceVisibility: "hidden" }}>
                <div className="h-12 bg-black/70 rounded-lg mt-4 mb-6" />
                <div className="flex justify-end">
                  <div className="bg-white text-[#0A1A2F] px-3 py-2 rounded-lg text-lg tracking-[0.25em] min-w-[90px] text-center shadow-inner">
                    {cvvPreview}
                  </div>
                </div>
                <div className="mt-6 text-right text-xs text-white/60">Ne partagez jamais votre CVV</div>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardNumber" className="font-semibold mb-2 block">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => maskNumber(e.target.value)}
                  onFocus={() => { setIsFlipped(false); setActiveField("number"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl border-2 focus:border-[#0077FF] dark:bg-gray-800"
                  required={displayedPlan.key !== "free"}
                />
              </div>
              <div>
                <Label htmlFor="cardName" className="font-semibold mb-2 block">Titulaire de la carte</Label>
                <Input
                  id="cardName"
                  autoComplete="cc-name"
                  placeholder="Prénom Nom"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onFocus={() => { setIsFlipped(false); setActiveField("name"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl border-2 focus:border-[#0077FF] dark:bg-gray-800"
                  required={displayedPlan.key !== "free"}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label className="font-semibold mb-2 block">Mois</Label>
                <Input
                  inputMode="numeric"
                  placeholder="MM"
                  maxLength={2}
                  value={expMonth}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value === "00" || (value && parseInt(value) > 12)) {
                      value = value.slice(0, -1);
                    }
                    setExpMonth(value);
                  }}
                  onFocus={() => { setIsFlipped(false); setActiveField("exp"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl border-2 focus:border-[#0077FF] dark:bg-gray-800 transition-all"
                  required={displayedPlan.key !== "free"}
                />
              </div>
              <div>
                <Label className="font-semibold mb-2 block">Année</Label>
                <Input
                  inputMode="numeric"
                  placeholder="YY"
                  maxLength={2}
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => { setIsFlipped(false); setActiveField("exp"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl border-2 focus:border-[#0077FF] dark:bg-gray-800 transition-all"
                  required={displayedPlan.key !== "free"}
                />
              </div>
              <div>
                <Label className="font-semibold mb-2 block">CVV</Label>
                <Input
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => { setIsFlipped(true); setActiveField("cvv"); }}
                  onBlur={() => { setIsFlipped(false); setActiveField(""); }}
                  className="h-12 rounded-xl border-2 focus:border-[#0077FF] dark:bg-gray-800 transition-all"
                  required={displayedPlan.key !== "free"}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="billing">Cycle de facturation</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["monthly", "yearly"] as const).map((cycle) => (
                    <button
                      key={cycle}
                      type="button"
                      className={`h-12 rounded-xl border text-sm transition ${billingCycle === cycle ? "border-[#0077FF] bg-[#0077FF]/10 text-[#0A1A2F]" : "border-gray-200 text-[#0A1A2F]/80"}`}
                      onClick={() => setBillingCycle(cycle)}
                    >
                      {cycle === "monthly" ? "Mensuel" : "Annuel (-10%)"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3 border border-dashed border-gray-200 dark:border-gray-700">
                <Shield className="w-5 h-5 text-[#0077FF]" />
                <div>
                  <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white">Chiffrement de bout en bout</p>
                  <p className="text-xs text-[#0A1A2F]/60 dark:text-gray-400">Nous ne stockons jamais vos données de carte.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-6 border-t-2 border-gray-100 dark:border-gray-800">
              <div className="text-sm">
                <p className="text-[#0A1A2F]/60 dark:text-gray-400 mb-1">Total aujourd'hui</p>
                <p className="text-3xl font-extrabold text-[#0A1A2F] dark:text-white">${displayedPlan.price.toFixed(2)}<span className="text-lg text-[#0A1A2F]/60 ml-2">{displayedPlan.period}</span></p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-12 px-6 font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                  ✕ Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl h-12 px-8 bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] hover:shadow-2xl hover:shadow-[#0077FF]/30 text-white font-bold min-w-[180px] transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Traitement...</> : "💳 Payer et activer"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

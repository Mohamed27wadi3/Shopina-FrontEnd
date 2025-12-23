import { useEffect, useMemo, useRef, useState } from "react";
import { X, Lock, Shield, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { paymentsAPI } from "../services/api";
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
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeField, setActiveField] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

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
    try {
      const payload = {
        plan: displayedPlan.key,
        billing_cycle: billingCycle,
        price: displayedPlan.price || priceForPlan[displayedPlan.key],
        last4: cardNumber.replace(/\D/g, "").slice(-4) || undefined,
      } as const;
      await paymentsAPI.subscribe(payload);
      toast.success("Abonnement activé");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Paiement refusé");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardNumberPreview = cardNumber.padEnd(19, "•").slice(0, 19);
  const expPreview = `${expMonth.padEnd(2, "•")}/${expYear.padEnd(2, "•")}`;
  const cvvPreview = cvv.padEnd(3, "•").slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Paiement sécurisé</p>
            <h3 className="text-xl font-bold text-[#0A1A2F] dark:text-white">{displayedPlan.name} {displayedPlan.price > 0 ? `– $${displayedPlan.price}${displayedPlan.period}` : ""}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Fermer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 p-6">
          <div className="relative" style={{ perspective: "1400px" }}>
            <div
              ref={cardRef}
              className={`relative w-full h-64 transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0A1A2F] via-[#0F2A4D] to-[#0A1A2F] text-white p-6 shadow-2xl border border-white/10" style={{ backfaceVisibility: "hidden" }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">Shopina Secure</span>
                  <div className="flex gap-2 items-center text-white/70 text-xs">
                    <Lock className="w-4 h-4" />
                    TLS 1.2
                  </div>
                </div>
                <div className={`mb-8 text-2xl tracking-[0.25em] ${activeField === "number" ? "text-[#5AC8FA]" : "text-white"}`}>
                  {cardNumberPreview}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-white/60 text-[10px] mb-1">Titulaire</p>
                    <p className={`text-base ${activeField === "name" ? "text-[#5AC8FA]" : "text-white"}`}>{cardName || "Votre nom"}</p>
                  </div>
                  <div className={`${activeField === "exp" ? "text-[#5AC8FA]" : "text-white"}`}>
                    <p className="text-white/60 text-[10px] mb-1">Expire</p>
                    <p className="text-base">{expPreview}</p>
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
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => maskNumber(e.target.value)}
                  onFocus={() => { setIsFlipped(false); setActiveField("number"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl"
                  required={displayedPlan.key !== "free"}
                />
              </div>
              <div>
                <Label htmlFor="cardName">Titulaire de la carte</Label>
                <Input
                  id="cardName"
                  autoComplete="cc-name"
                  placeholder="Prénom Nom"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onFocus={() => { setIsFlipped(false); setActiveField("name"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl"
                  required={displayedPlan.key !== "free"}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>Mois</Label>
                <Input
                  inputMode="numeric"
                  placeholder="MM"
                  maxLength={2}
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => { setIsFlipped(false); setActiveField("exp"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl"
                  required={displayedPlan.key !== "free"}
                />
              </div>
              <div>
                <Label>Année</Label>
                <Input
                  inputMode="numeric"
                  placeholder="YY"
                  maxLength={2}
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => { setIsFlipped(false); setActiveField("exp"); }}
                  onBlur={() => setActiveField("")}
                  className="h-12 rounded-xl"
                  required={displayedPlan.key !== "free"}
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => { setIsFlipped(true); setActiveField("cvv"); }}
                  onBlur={() => { setIsFlipped(false); setActiveField(""); }}
                  className="h-12 rounded-xl"
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

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-[#0A1A2F]/70 dark:text-gray-300">
                <p>Total aujourd'hui</p>
                <p className="text-2xl font-extrabold text-[#0A1A2F] dark:text-white">${displayedPlan.price.toFixed(2)}<span className="text-base font-semibold text-[#0A1A2F]/60">{displayedPlan.period}</span></p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Annuler</Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#0077FF] hover:bg-[#0066dd] text-white min-w-[160px]"
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Traitement...</> : "Payer et activer"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

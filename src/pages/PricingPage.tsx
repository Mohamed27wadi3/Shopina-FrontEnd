import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { PlanCheckoutCard } from "../components/PlanCheckoutCard";
import { useAuth } from "../context/AuthContext";
import { paymentsAPI } from "../services/api";
import { toast } from "sonner";

const plans = [
  {
    name: "Gratuit",
    price: "0$",
    period: "/mois",
    description: "Parfait pour commencer",
    features: [
      "Jusqu'à 10 produits",
      "1 template gratuit",
      "Support email",
      "Tableau de bord basique",
      "Paiements sécurisés",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Starter",
    price: "19$",
    period: "/mois",
    description: "Pour les entrepreneurs",
    features: [
      "Produits illimités",
      "10+ templates premium",
      "Support prioritaire 7j/7",
      "Analytics avancées",
      "0% frais de transaction",
      "Nom de domaine personnalisé",
      "Marketing par email",
    ],
    cta: "Essayer 15 jours gratuits",
    popular: false,
  },
  {
    name: "Pro",
    price: "49$",
    period: "/mois",
    description: "Pour développer votre business",
    features: [
      "Tout de Starter +",
      "50+ templates premium",
      "Support dédié 24/7",
      "Multi-boutiques",
      "API complète",
      "Intégrations avancées",
      "Automatisation marketing",
      "Rapports personnalisés",
    ],
    cta: "Essayer 15 jours gratuits",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    period: "",
    description: "Solutions personnalisées",
    features: [
      "Tout de Pro +",
      "Templates sur mesure",
      "Account manager dédié",
      "Formations personnalisées",
      "SLA garanti",
      "Infrastructure dédiée",
      "Développement sur mesure",
    ],
    cta: "Contactez-nous",
    popular: false,
  },
];

export function PricingPage() {
  const navigate = useNavigate();
  const { user, updateProfile, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; period: string; key: "free" | "starter" | "pro" | "enterprise" } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prices = useMemo(() => ({
    free: 0,
    starter: 19,
    pro: 49,
    enterprise: 99,
  }), []);

  const normalizePlan = (name: string): "free" | "starter" | "pro" | "enterprise" => {
    const slug = name.toLowerCase();
    if (slug.includes("starter")) return "starter";
    if (slug.includes("pro")) return "pro";
    if (slug.includes("enter")) return "enterprise";
    return "free";
  };

  const handleActivateFree = async () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent('/pricing')}`);
      return;
    }
    setIsSubmitting(true);
    try {
      await paymentsAPI.subscribe({ plan: "free", billing_cycle: "monthly", price: prices.free });
      
      // Rafraîchir le profil depuis le serveur
      await refreshProfile();
      
      toast.success("🎉 Plan gratuit activé avec succès !", {
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
    } catch (err: any) {
      toast.error(err?.message || "Activation impossible");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPlan = (plan: typeof plans[number]) => {
    const key = normalizePlan(plan.name);
    
    // Toast de confirmation pour tous les plans
    const planEmojis = {
      free: "🎉",
      starter: "🚀",
      pro: "⭐",
      enterprise: "👑"
    };
    
    toast.success(`${planEmojis[key]} Plan ${plan.name} sélectionné !`, {
      duration: 3000,
      style: {
        background: "linear-gradient(135deg, #0077FF 0%, #5AC8FA 100%)",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        padding: "16px 20px",
        borderRadius: "12px"
      }
    });
    
    if (key === "free") {
      handleActivateFree();
      return;
    }

    if (!user) {
      navigate(`/login?next=${encodeURIComponent('/pricing')}`);
      return;
    }

    const price = plan.price === "Sur mesure" ? prices.enterprise : Number(plan.price.replace(/[^0-9.]/g, "")) || prices[key];
    setSelectedPlan({ name: plan.name, price, period: plan.period, key });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <section className="py-24 bg-gradient-to-br from-[#0077FF]/5 via-[#5AC8FA]/5 to-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-[#0A1A2F] mb-4" style={{ fontSize: '56px', fontWeight: '800' }}>
              Choisissez votre plan
            </h1>
            <p className="text-[#0A1A2F]/70 text-xl">
              Des tarifs transparents et compétitifs pour tous les besoins
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 rounded-2xl transition-all hover:shadow-2xl ${
                  plan.popular
                    ? "border-[#0077FF] shadow-xl scale-105"
                    : "border-gray-100 hover:border-[#0077FF]/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white px-4 py-1 rounded-full text-sm" style={{ fontWeight: '600' }}>
                      Le plus populaire
                    </span>
                  </div>
                )}

                <CardHeader className="text-center p-8 pb-6">
                  <h3 className="text-[#0A1A2F] mb-2" style={{ fontSize: '24px', fontWeight: '700' }}>
                    {plan.name}
                  </h3>
                  <p className="text-[#0A1A2F]/60 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-[#0A1A2F]" style={{ fontSize: '48px', fontWeight: '800' }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-[#0A1A2F]/60 mb-3">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                  <Button
                    className={`w-full h-12 rounded-xl mb-6 ${
                      plan.popular
                        ? "bg-[#0077FF] hover:bg-[#0077FF]/90 text-white shadow-lg shadow-[#0077FF]/30"
                        : "bg-gray-100 hover:bg-gray-200 text-[#0A1A2F]"
                    }`}
                    disabled={isSubmitting}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {isSubmitting && normalizePlan(plan.name) === "free" ? "Activation..." : plan.cta}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#0077FF] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0A1A2F]/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-[#0A1A2F] text-center mb-12" style={{ fontSize: '36px', fontWeight: '800' }}>
              Questions fréquentes
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Puis-je changer de plan à tout moment ?",
                  a: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements sont pris en compte immédiatement.",
                },
                {
                  q: "Y a-t-il des frais cachés ?",
                  a: "Non, tous nos tarifs sont transparents. Aucun frais de transaction avec nos moyens de paiement intégrés.",
                },
                {
                  q: "Que se passe-t-il après la période d'essai ?",
                  a: "Après 15 jours gratuits, vous pouvez choisir de continuer avec un plan payant ou passer au plan gratuit.",
                },
              ].map((faq, index) => (
                <Card key={index} className="border-2 border-gray-100 rounded-2xl">
                  <CardContent className="p-6">
                    <p className="text-[#0A1A2F] mb-2" style={{ fontWeight: '700' }}>
                      {faq.q}
                    </p>
                    <p className="text-[#0A1A2F]/70">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {showPayment && (
        <PlanCheckoutCard
          plan={selectedPlan}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
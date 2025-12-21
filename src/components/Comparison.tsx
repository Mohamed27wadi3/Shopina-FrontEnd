import { Check, X } from "lucide-react";

const comparisonData = [
  {
    feature: "Plateforme",
    shopina: "Shopina - 100% Algérienne",
    shopify: "Shopify - Plateforme internationale",
    advantage: true,
  },
  {
    feature: "Prix mensuel",
    shopina: "À partir de 19$/mois",
    shopify: "À partir de 29$/mois",
    advantage: true,
  },
  {
    feature: "Frais de transaction",
    shopina: "0% avec nos moyens de paiement",
    shopify: "2% frais supplémentaires",
    advantage: true,
  },
  {
    feature: "Simplicité d'utilisation",
    shopina: "Interface ultra-intuitive",
    shopify: "Courbe d'apprentissage",
    advantage: true,
  },
  {
    feature: "Support client",
    shopina: "Support FR 7j/7 inclus",
    shopify: "Support standard EN",
    advantage: true,
  },
  {
    feature: "Templates gratuits",
    shopina: "50+ templates premium",
    shopify: "10 templates gratuits",
    advantage: true,
  },
];

export function Comparison() {
  return (
    <section className="py-24 bg-[#0A1A2F] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#5AC8FA] to-[#0077FF] blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-white mb-4" style={{ fontSize: '48px', fontWeight: '800' }}>
            Pourquoi choisir Shopina ?
          </h2>
          <p className="text-white/70 text-xl">
            Comparez et découvrez les avantages de notre plateforme
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white/10 border-b border-white/10">
              <div className="text-white/70">Fonctionnalités</div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077FF] text-white">
                  <Check className="w-4 h-4" />
                  <span style={{ fontWeight: '700' }}>Shopina</span>
                </div>
              </div>
              <div className="text-center text-white/70" style={{ fontWeight: '600' }}>
                Shopify
              </div>
            </div>

            {/* Table Body */}
            {comparisonData.map((item, index) => (
              <div 
                key={index} 
                className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="text-white" style={{ fontWeight: '600' }}>
                  {item.feature}
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-[#5AC8FA]" style={{ fontWeight: '600' }}>
                    <Check className="w-5 h-5" />
                    {item.shopina}
                  </span>
                </div>
                <div className="text-center text-white/60">
                  {item.shopify}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-white/70">
              Et bien plus encore... Découvrez tous nos avantages en créant votre boutique
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

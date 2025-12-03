import { Package, CreditCard, Palette, BarChart3 } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: Package,
    title: "Gestion des produits",
    description: "Ajoutez et gérez vos produits en toute simplicité avec une interface intuitive et des outils puissants.",
  },
  {
    icon: CreditCard,
    title: "Paiements sécurisés",
    description: "Acceptez tous les modes de paiement avec une sécurité maximale et des frais de transaction réduits.",
  },
  {
    icon: Palette,
    title: "Templates personnalisables",
    description: "Choisissez parmi des dizaines de templates modernes et personnalisez-les selon votre marque.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord intelligent",
    description: "Suivez vos ventes, analysez vos performances et prenez des décisions éclairées en temps réel.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#0A1A2F] mb-4" style={{ fontSize: '48px', fontWeight: '800' }}>
            Tout ce dont vous avez besoin pour réussir
          </h2>
          <p className="text-[#0A1A2F]/70 text-xl">
            Une suite complète d'outils pour créer, gérer et développer votre boutique en ligne.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-2 border-gray-100 hover:border-[#0077FF]/30 hover:shadow-xl transition-all duration-300 rounded-2xl group"
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-[#0A1A2F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-[#0A1A2F] mb-3" style={{ fontSize: '20px', fontWeight: '700' }}>
                    {feature.title}
                  </h3>
                  <p className="text-[#0A1A2F]/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Fondatrice, Atelier Sophie",
    content: "Shopina m'a permis de lancer ma boutique de mode en seulement 3 jours. L'interface est incroyablement intuitive et le support client est exceptionnel !",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Thomas Dubois",
    role: "CEO, TechStore",
    content: "Après avoir essayé plusieurs plateformes, Shopina se démarque par sa simplicité et ses tarifs compétitifs. Le meilleur choix pour développer mon e-commerce.",
    rating: 5,
    initials: "TD",
  },
  {
    name: "Marie Leclerc",
    role: "Gérante, Beauty Lab",
    content: "Les templates sont magnifiques et parfaitement adaptés à mon secteur. J'ai pu personnaliser ma boutique sans aucune compétence technique. Je recommande à 100% !",
    rating: 5,
    initials: "ML",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#0A1A2F] mb-4" style={{ fontSize: '48px', fontWeight: '800' }}>
            Ils ont choisi Shopina
          </h2>
          <p className="text-[#0A1A2F]/70 text-xl">
            Découvrez ce que nos utilisateurs disent de leur expérience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-2 border-gray-100 hover:border-[#0077FF]/30 hover:shadow-xl transition-all duration-300 rounded-2xl"
            >
              <CardContent className="p-8">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FFD43B] text-[#FFD43B]" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-[#0A1A2F]/80 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-[#0077FF] to-[#5AC8FA]">
                    <AvatarFallback className="text-white" style={{ fontWeight: '700' }}>
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>
                      {testimonial.name}
                    </p>
                    <p className="text-[#0A1A2F]/60 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

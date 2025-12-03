import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    title: "Fashion Store",
    category: "Mode & Lifestyle",
    image: "https://images.unsplash.com/photo-1761090617068-f1b3257d27ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm91dGlxdWUlMjBzdG9yZXxlbnwxfHx8fDE3NjQ1NjY4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Tech Shop",
    category: "High-tech & Gadgets",
    image: "https://images.unsplash.com/photo-1761207850745-d41a776ef897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0cyUyMHNob3B8ZW58MXx8fHwxNzY0NjEyMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Beauty Haven",
    category: "Beauté & Cosmétiques",
    image: "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjQ1NzI3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function Templates() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-[#5AC8FA]/5 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#0A1A2F] mb-4" style={{ fontSize: '48px', fontWeight: '800' }}>
            Des templates pour tous les secteurs
          </h2>
          <p className="text-[#0A1A2F]/70 text-xl">
            Lancez votre boutique en quelques clics avec nos designs professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {templates.map((template, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-2 border-gray-100 hover:border-[#0077FF]/30 hover:shadow-2xl transition-all duration-300 rounded-2xl cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/80 via-[#0A1A2F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-[#0077FF] text-white text-sm rounded-full mb-2">
                      {template.category}
                    </span>
                    <h3 className="text-white" style={{ fontSize: '24px', fontWeight: '700' }}>
                      {template.title}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate("/templates")}
            variant="outline" 
            className="border-2 border-[#0077FF] text-[#0077FF] hover:bg-[#0077FF] hover:text-white rounded-xl px-8 h-14 transition-all duration-300"
          >
            Explorer tous les templates
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
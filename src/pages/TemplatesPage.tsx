import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Search, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

const categories = ["Tous", "Mode", "High-tech", "Beauté", "Alimentation", "Sport", "Déco"];

const templates = [
  {
    id: 1,
    title: "Fashion Store",
    category: "Mode",
    image: "https://images.unsplash.com/photo-1761090617068-f1b3257d27ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm91dGlxdWUlMjBzdG9yZXxlbnwxfHx8fDE3NjQ1NjY4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Template élégant pour boutique de mode",
  },
  {
    id: 2,
    title: "Tech Shop",
    category: "High-tech",
    image: "https://images.unsplash.com/photo-1761207850745-d41a776ef897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0cyUyMHNob3B8ZW58MXx8fHwxNzY0NjEyMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Design moderne pour produits tech",
  },
  {
    id: 3,
    title: "Beauty Haven",
    category: "Beauté",
    image: "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjQ1NzI3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Template raffiné pour cosmétiques",
  },
  {
    id: 4,
    title: "Urban Style",
    category: "Mode",
    image: "https://images.unsplash.com/photo-1761090617068-f1b3257d27ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm91dGlxdWUlMjBzdG9yZXxlbnwxfHx8fDE3NjQ1NjY4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Style urbain et contemporain",
  },
  {
    id: 5,
    title: "Gadget Pro",
    category: "High-tech",
    image: "https://images.unsplash.com/photo-1761207850745-d41a776ef897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0cyUyMHNob3B8ZW58MXx8fHwxNzY0NjEyMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Pour les dernières innovations",
  },
  {
    id: 6,
    title: "Glow Beauty",
    category: "Beauté",
    image: "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjQ1NzI3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Soins et beauté haut de gamme",
  },
];

export function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "Tous" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <section className="py-24 bg-gradient-to-br from-[#0077FF]/5 via-[#5AC8FA]/5 to-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-[#0A1A2F] mb-4" style={{ fontSize: '56px', fontWeight: '800' }}>
              Nos Templates
            </h1>
            <p className="text-[#0A1A2F]/70 text-xl">
              Découvrez notre collection de designs professionnels prêts à l'emploi
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
              <Input
                type="search"
                placeholder="Rechercher un template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
              />
            </div>
            <Button variant="outline" className="h-14 px-6 rounded-xl border-2 border-gray-200 hover:border-[#0077FF]">
              <Filter className="w-5 h-5 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white shadow-lg"
                    : "bg-white border-2 border-gray-200 text-[#0A1A2F] hover:border-[#0077FF]"
                }`}
                style={{ fontWeight: selectedCategory === category ? '600' : '500' }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className="group overflow-hidden border-2 border-gray-100 hover:border-[#0077FF]/30 hover:shadow-2xl transition-all duration-300 rounded-2xl cursor-pointer"
                onClick={() => navigate(`/templates/${template.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <ImageWithFallback
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/80 via-[#0A1A2F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="bg-white text-[#0077FF] hover:bg-white/90 rounded-xl px-6">
                        Voir le template
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-[#0077FF]/10 text-[#0077FF] text-sm rounded-full mb-3">
                      {template.category}
                    </span>
                    <h3 className="text-[#0A1A2F] mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>
                      {template.title}
                    </h3>
                    <p className="text-[#0A1A2F]/70">
                      {template.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-[#0077FF]/5 to-[#5AC8FA]/5 rounded-2xl border border-[#0077FF]/20">
              <p className="text-[#0A1A2F] text-xl" style={{ fontWeight: '700' }}>
                Vous ne trouvez pas ce que vous cherchez ?
              </p>
              <p className="text-[#0A1A2F]/70">
                Contactez-nous pour un template personnalisé
              </p>
              <Button 
                onClick={() => navigate("/support")}
                className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl px-8 h-12"
              >
                Demander un template sur mesure
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
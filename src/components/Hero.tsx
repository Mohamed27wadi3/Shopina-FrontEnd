import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0077FF]/5 via-[#5AC8FA]/5 to-white pt-20 pb-32">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#0077FF]/10 to-[#5AC8FA]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#5AC8FA]/10 to-[#0077FF]/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077FF]/10 text-[#0077FF] border border-[#0077FF]/20">
                <span className="w-2 h-2 bg-[#0077FF] rounded-full animate-pulse" />
                <span className="text-sm">Nouvelle plateforme e-commerce</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                <span className="text-sm font-semibold">🇩🇿 100% Algérienne</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                <span className="text-sm font-semibold">✨ Inspirée de Shopify</span>
              </div>
            </div>

            <h1 className="text-[#0A1A2F]" style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1' }}>
              La première plateforme e-commerce{" "}
              <span className="bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] bg-clip-text text-transparent">
                algérienne
              </span>
            </h1>

            <p className="text-[#0A1A2F]/70 text-xl max-w-xl">
              Shopina, inspirée de Shopify, est une plateforme e-commerce 100% algérienne, facile à utiliser, performante et complètement adaptée au marché algérien.
            </p>

            {/* Email Form */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <Input
                type="email"
                placeholder="Entrez votre email"
                className="flex-1 h-14 px-6 rounded-xl border-2 border-gray-200 focus:border-[#0077FF] text-lg"
              />
              <Button 
                onClick={() => navigate("/signup")}
                className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white h-14 px-8 rounded-xl shadow-lg shadow-[#0077FF]/30"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FFD43B]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[#0A1A2F]">
                  <span style={{ fontWeight: '700' }}>4.9/5</span> sur 2,000+ avis
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <span className="text-[#0A1A2F]">
                <span style={{ fontWeight: '700' }}>15 jours</span> d'essai gratuit
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1748609160056-7b95f30041f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzY0NjA0NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Dashboard Shopina"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0077FF]/20 to-transparent" />
            </div>
            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center text-white" style={{ fontWeight: '700' }}>
                  +47%
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ventes ce mois</p>
                  <p className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>$24,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
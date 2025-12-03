import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-[#0077FF] via-[#0077FF] to-[#5AC8FA] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: '600' }}>
              Offre de lancement : 15 jours gratuits
            </span>
          </div>

          <h2 className="text-white mb-6" style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1' }}>
            Prêt à lancer ta boutique ?
          </h2>

          <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto">
            Rejoignez des milliers d'entrepreneurs qui ont choisi Shopina pour développer leur activité en ligne. Aucune carte bancaire requise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate("/signup")}
              className="bg-[#FFD43B] hover:bg-[#FFD43B]/90 text-[#0A1A2F] h-16 px-10 rounded-xl shadow-2xl shadow-black/20 text-lg"
              style={{ fontWeight: '700' }}
            >
              Créer ma boutique maintenant
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/templates")}
              className="border-2 border-white text-white hover:bg-white hover:text-[#0077FF] h-16 px-10 rounded-xl text-lg backdrop-blur-sm"
              style={{ fontWeight: '600' }}
            >
              Regarder la démo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-white/90">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Aucune installation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Résiliable à tout moment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Support 7j/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
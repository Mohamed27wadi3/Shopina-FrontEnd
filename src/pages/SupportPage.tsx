import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  BookOpen, 
  Video,
  Users,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const faqs = [
  {
    question: "Comment créer ma première boutique sur Shopina ?",
    answer: "Pour créer votre première boutique, cliquez sur 'Créer ma boutique' en haut à droite, puis suivez les étapes guidées. Vous devrez choisir un nom, un thème et configurer vos moyens de paiement. Le processus prend environ 5 minutes."
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Shopina accepte les cartes bancaires (Visa, Mastercard, American Express), PayPal, et les virements bancaires. Vous pouvez également configurer des paiements en plusieurs fois pour vos clients."
  },
  {
    question: "Comment gérer mes stocks ?",
    answer: "Accédez à votre tableau de bord, puis à la section 'Inventaire'. Vous pourrez y ajouter, modifier et suivre vos produits. Les alertes de stock bas sont automatiques et vous recevrez des notifications par email."
  },
  {
    question: "Puis-je personnaliser le design de ma boutique ?",
    answer: "Oui ! Shopina offre de nombreux templates personnalisables. Vous pouvez modifier les couleurs, les polices, le logo et la mise en page sans aucune connaissance en code. Des templates premium sont également disponibles."
  },
  {
    question: "Comment fonctionne la livraison ?",
    answer: "Vous configurez vos zones de livraison et tarifs dans les paramètres. Shopina s'intègre avec les principaux transporteurs (Colissimo, Chronopost, UPS, etc.) pour générer automatiquement les étiquettes d'expédition."
  },
  {
    question: "Quel est le coût de Shopina ?",
    answer: "Shopina propose trois formules : Starter (gratuit), Professional (29$/mois) et Enterprise (99$/mois). Consultez notre page Tarifs pour plus de détails. Essai gratuit de 14 jours sans carte bancaire."
  },
  {
    question: "Comment obtenir de l'aide technique ?",
    answer: "Notre équipe support est disponible 7j/7 par chat, email et téléphone. Vous avez également accès à notre centre d'aide avec documentation, tutoriels vidéo et webinaires gratuits."
  },
  {
    question: "Puis-je migrer depuis une autre plateforme ?",
    answer: "Oui, Shopina facilite la migration depuis Shopify, WooCommerce et autres plateformes. Nos experts peuvent vous accompagner gratuitement dans le processus de migration de vos produits et données."
  }
];

const supportChannels = [
  {
    icon: MessageSquare,
    title: "Chat en direct",
    description: "Réponse instantanée de notre équipe",
    availability: "Disponible 24/7",
    action: "Démarrer le chat",
    color: "from-[#0077FF] to-[#5AC8FA]"
  },
  {
    icon: Mail,
    title: "Email",
    description: "Support technique détaillé",
    availability: "Réponse sous 2h",
    action: "Envoyer un email",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Phone,
    title: "Téléphone",
    description: "Assistance personnalisée",
    availability: "Lun-Ven 9h-18h",
    action: "Appeler maintenant",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Forum et discussions",
    availability: "Toujours actif",
    action: "Rejoindre",
    color: "from-orange-500 to-red-500"
  }
];

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Guides complets et détaillés",
    link: "#"
  },
  {
    icon: Video,
    title: "Tutoriels vidéo",
    description: "Apprenez en regardant",
    link: "#"
  },
  {
    icon: HelpCircle,
    title: "Centre d'aide",
    description: "Réponses à vos questions",
    link: "#"
  }
];

export function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Animation plein écran avec célébration
    toast.success("✨ Message envoyé avec succès ! Nous vous répondrons sous 2 heures.", {
      duration: 5000,
      style: {
        background: "linear-gradient(135deg, #0077FF 0%, #5AC8FA 100%)",
        color: "white",
        fontSize: "18px",
        fontWeight: "600",
        padding: "20px 24px",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0, 119, 255, 0.3)"
      }
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChatClick = () => {
    toast.success("💬 Demande de chat envoyée ! Un agent va vous répondre dans quelques instants.", {
      duration: 4000,
      style: {
        background: "linear-gradient(135deg, #0077FF 0%, #5AC8FA 100%)",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        padding: "16px 20px",
        borderRadius: "12px"
      }
    });
  };

  const handleEmailClick = () => {
    toast.success("✉️ Email envoyé avec succès ! Vous recevrez une réponse sous 2 heures.", {
      duration: 4000,
      style: {
        background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        padding: "16px 20px",
        borderRadius: "12px"
      }
    });
  };

  const handlePhoneClick = () => {
    toast.success("📞 Numéro de téléphone : 025202281", {
      duration: 6000,
      style: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        fontSize: "18px",
        fontWeight: "700",
        padding: "20px 24px",
        borderRadius: "12px"
      }
    });
  };

  const handleCommunityClick = () => {
    toast.success("🎉 Bienvenue dans la communauté DZ-ecom ! Rejoignez-nous sur Discord et Facebook.", {
      duration: 5000,
      style: {
        background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        padding: "16px 20px",
        borderRadius: "12px"
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Centre de support</span>
            </div>
            <h1 className="text-white mb-6" style={{ fontSize: '56px', fontWeight: '700', lineHeight: '1.1' }}>
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Notre équipe est là pour répondre à toutes vos questions
            </p>
          </div>
        </div>

        {/* Support Channels */}
        <div className="container mx-auto px-6 -mt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              const handleClick = 
                channel.title === "Chat en direct" ? handleChatClick :
                channel.title === "Email" ? handleEmailClick :
                channel.title === "Téléphone" ? handlePhoneClick :
                handleCommunityClick;
              
              return (
                <Card key={index} className="border-gray-100 rounded-2xl hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-[#0A1A2F]">{channel.title}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4" />
                      {channel.availability}
                    </div>
                    <Button 
                      onClick={handleClick}
                      className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 rounded-xl transition-all transform hover:scale-105"
                    >
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Resources */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-[#0A1A2F] mb-4" style={{ fontSize: '36px', fontWeight: '700' }}>
              Ressources d'aide
            </h2>
            <p className="text-gray-600 text-lg">
              Trouvez rapidement les réponses dont vous avez besoin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="border-gray-100 rounded-2xl hover:shadow-xl transition-all cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#0077FF]/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0077FF] transition-colors">
                      <Icon className="w-8 h-8 text-[#0077FF] group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-[#0A1A2F]">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-[#0A1A2F] mb-4" style={{ fontSize: '36px', fontWeight: '700' }}>
                  Questions fréquentes
                </h2>
                <p className="text-gray-600 text-lg">
                  Les réponses aux questions les plus courantes
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-white rounded-2xl border-gray-100 px-6"
                  >
                    <AccordionTrigger className="text-left text-[#0A1A2F] hover:text-[#0077FF] hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[#0A1A2F] mb-4" style={{ fontSize: '36px', fontWeight: '700' }}>
                Contactez-nous
              </h2>
              <p className="text-gray-600 text-lg">
                Vous n'avez pas trouvé la réponse ? Envoyez-nous un message
              </p>
            </div>

            <Card className="border-gray-100 rounded-2xl shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#0A1A2F] mb-2" style={{ fontWeight: '500' }}>
                        Nom complet
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                        required
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#0A1A2F] mb-2" style={{ fontWeight: '500' }}>
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jean@exemple.com"
                        required
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#0A1A2F] mb-2" style={{ fontWeight: '500' }}>
                      Sujet
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="De quoi avez-vous besoin ?"
                      required
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#0A1A2F] mb-2" style={{ fontWeight: '500' }}>
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre problème ou question..."
                      required
                      className="rounded-xl border-gray-200 min-h-[150px]"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 rounded-xl text-lg py-6"
                  >
                    Envoyer le message
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-[#0077FF]/5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0077FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#0A1A2F]" style={{ fontWeight: '500' }}>
                        Temps de réponse garanti
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Notre équipe vous répondra sous 2 heures pendant les heures ouvrables
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

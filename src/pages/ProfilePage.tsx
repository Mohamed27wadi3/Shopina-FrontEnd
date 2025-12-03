import { useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { User, Mail, Phone, MapPin, Building, Save, Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner@2.0.3";

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de la République",
    city: "Paris",
    country: "France",
    bio: "Passionné d'e-commerce et entrepreneur créatif.",
    shopName: user?.shopName || "Ma Boutique",
    shopUrl: "ma-boutique",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      shopName: formData.shopName,
    });
    setIsEditing(false);
    toast.success("Profil mis à jour avec succès !");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-[#0A1A2F] mb-2" style={{ fontSize: '36px', fontWeight: '800' }}>
                Mon Profil
              </h1>
              <p className="text-[#0A1A2F]/60">
                Gérez vos informations personnelles et les paramètres de votre boutique
              </p>
            </div>

            <div className="grid gap-6">
              {/* Profile Picture Card */}
              <Card className="border-2 border-gray-100 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Photo de profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 bg-gradient-to-br from-[#0077FF] to-[#5AC8FA]">
                      <AvatarFallback className="text-white text-2xl" style={{ fontWeight: '700' }}>
                        {user?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-[#0A1A2F] mb-2" style={{ fontWeight: '600' }}>
                        {user?.name}
                      </p>
                      <p className="text-[#0A1A2F]/60 text-sm mb-4">
                        Format JPG, PNG ou GIF. Taille maximale 5 MB.
                      </p>
                      <Button className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl">
                        <Camera className="w-4 h-4 mr-2" />
                        Changer la photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="border-2 border-gray-100 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-[#0A1A2F]">Informations personnelles</CardTitle>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="rounded-xl border-2 border-[#0077FF] text-[#0077FF] hover:bg-[#0077FF] hover:text-white"
                    >
                      Modifier
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#0A1A2F]">
                          Nom complet
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 h-11 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#0A1A2F]">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 h-11 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[#0A1A2F]">
                          Téléphone
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 h-11 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-[#0A1A2F]">
                          Ville
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 h-11 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-[#0A1A2F]">
                        Biographie
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                        className="rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer les modifications
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="rounded-xl border-2 border-gray-200"
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Shop Settings */}
              <Card className="border-2 border-gray-100 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Paramètres de la boutique</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Shop Name */}
                      <div className="space-y-2">
                        <Label htmlFor="shopName" className="text-[#0A1A2F]">
                          Nom de la boutique
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
                          <Input
                            id="shopName"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 h-11 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                          />
                        </div>
                      </div>

                      {/* Shop URL */}
                      <div className="space-y-2">
                        <Label htmlFor="shopUrl" className="text-[#0A1A2F]">
                          URL de la boutique
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-[#0A1A2F]/60 text-sm">shopina.com/</span>
                          <Input
                            id="shopUrl"
                            name="shopUrl"
                            value={formData.shopUrl}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="h-11 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Plan Badge */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#0077FF]/5 to-[#5AC8FA]/5 rounded-xl border border-[#0077FF]/20">
                      <div>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '700' }}>
                          Plan actuel : {user?.plan === "pro" ? "Pro" : user?.plan === "starter" ? "Starter" : "Gratuit"}
                        </p>
                        <p className="text-[#0A1A2F]/60 text-sm">
                          Accès à toutes les fonctionnalités premium
                        </p>
                      </div>
                      <Button className="bg-[#FFD43B] hover:bg-[#FFD43B]/90 text-[#0A1A2F] rounded-xl">
                        Changer de plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="border-2 border-gray-100 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F]">Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                          Mot de passe
                        </p>
                        <p className="text-[#0A1A2F]/60 text-sm">
                          Dernière modification il y a 3 mois
                        </p>
                      </div>
                      <Button variant="outline" className="rounded-xl border-2 border-gray-200">
                        Changer
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                          Authentification à deux facteurs
                        </p>
                        <p className="text-[#0A1A2F]/60 text-sm">
                          Sécurisez davantage votre compte
                        </p>
                      </div>
                      <Button variant="outline" className="rounded-xl border-2 border-gray-200">
                        Activer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

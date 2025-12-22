import { useState, useRef, useEffect } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { User, Mail, Phone, MapPin, Building, Save, Camera, Loader, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { COUNTRIES, sortedCountries, getCountryByCode } from "../data/countries";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  shopName: string;
  shopUrl: string;
};

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileForm>({
    name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    address: user?.street_address || "",
    city: user?.city || "",
    country: user?.country || "DZ",
    bio: "Passionné d'e-commerce et entrepreneur créatif.",
    shopName: user?.shop_name || "Ma Boutique",
    shopUrl: "ma-boutique",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || "",
        email: user?.email || "",
        phone: user?.phone_number || "",
        address: user?.street_address || "",
        city: user?.city || "",
        country: user?.country || "DZ",
        shopName: user?.shop_name || "Ma Boutique",
      }));
    }
  }, [user]);

  // Auto-save phone and country changes
  const saveProfileField = async (fieldName: string, value: string) => {
    const payload: any = {};
    
    if (fieldName === 'phone') {
      payload.phone_number = value;
    } else if (fieldName === 'city') {
      payload.city = value;
    } else if (fieldName === 'country') {
      payload.country = value;
    }

    if (Object.keys(payload).length === 0) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/users/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Erreur lors de la sauvegarde');
      }

      const data = await res.json();
      updateProfile(data);
      toast.success("Modification sauvegardée ✓");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [firstName, ...rest] = formData.name.split(' ');
    const lastName = rest.join(' ');
    updateProfile({
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      email: formData.email,
      shop_name: formData.shopName,
    });
    setIsEditing(false);
    toast.success("Profil mis à jour avec succès !");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-save for phone and country fields
    if (name === 'phone' || name === 'country' || name === 'city') {
      saveProfileField(name, value);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image doit faire moins de 5 MB");
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      toast.error("Sélectionnez une image valide (JPG, PNG, GIF)");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Uploader l'image
      const formDataImage = new FormData();
      formDataImage.append('avatar', file);

      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/users/profile/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataImage,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('❌ Upload failed:', err);
        throw new Error(err.error?.message || 'Erreur lors de l\'upload');
      }

      const data = await res.json();
      console.log('✅ Avatar uploaded successfully:', data);
      
      // Mettre à jour le profil avec l'avatar
      updateProfile({ 
        avatar: data.avatar,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        shop_name: data.shop_name,
      });
      
      toast.success("Avatar mis à jour avec succès !");
    } catch (error: any) {
      console.error('❌ Avatar upload error:', error);
      toast.error(error.message || "Erreur lors de l'upload de l'avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
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
                    <div className="relative w-24 h-24">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`} 
                          alt="Avatar" 
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            console.error('Avatar image failed to load:', user.avatar);
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            // Afficher le fallback
                            const parent = img.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.avatar-fallback');
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className="avatar-fallback w-full h-full rounded-full bg-gradient-to-br from-[#0077FF] to-[#5AC8FA] flex items-center justify-center text-white text-2xl font-bold" style={{ display: user?.avatar ? 'none' : 'flex' }}>
                        {(user?.first_name || user?.username || 'U').charAt(0)}{(user?.last_name || '').charAt(0) || ''}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#0A1A2F] mb-2" style={{ fontWeight: '600' }}>
                        {formData.name}
                      </p>
                      <p className="text-[#0A1A2F]/60 text-sm mb-4">
                        Format JPG, PNG ou GIF. Taille maximale 5 MB.
                      </p>
                      <Button 
                        onClick={handleAvatarClick}
                        disabled={isUploadingAvatar}
                        className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl"
                      >
                        {isUploadingAvatar ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4 mr-2" />
                            Changer la photo
                          </>
                        )}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
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
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 pointer-events-none" />
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Entrez votre ville"
                            className="pl-10 h-11 rounded-xl border-2 border-gray-200 focus:border-[#0077FF]"
                          />
                        </div>
                      </div>

                      {/* Country */}
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-[#0A1A2F]">
                          Pays
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 pointer-events-none z-10" />
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 h-11 w-full rounded-xl border-2 border-gray-200 focus:border-[#0077FF] focus:outline-none appearance-none text-[#0A1A2F] bg-white disabled:bg-gray-50 disabled:text-[#0A1A2F]/60"
                          >
                            <option value="">Sélectionnez un pays...</option>
                            {sortedCountries().map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name} ({country.region})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-[#0A1A2F]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </div>
                        {formData.country && (
                          <p className="text-xs text-[#0077FF] mt-1">
                            {getCountryByCode(formData.country)?.region}
                          </p>
                        )}
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

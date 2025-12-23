import type { CSSProperties } from "react";
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
    shopUrl: user?.shop_slug || "ma-boutique",
  });

  // Change password UI state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [cpOldPassword, setCpOldPassword] = useState('');
  const [cpNewPassword, setCpNewPassword] = useState('');
  const [cpNewPasswordConfirm, setCpNewPasswordConfirm] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Two-factor authentication UI state
  const [is2faStarting, setIs2faStarting] = useState(false);
  const [show2faVerify, setShow2faVerify] = useState(false);
  const [twoFaOtp, setTwoFaOtp] = useState('');
  const [is2faVerifying, setIs2faVerifying] = useState(false);

  // Cursor-driven motion for subtle parallax background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: PointerEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);
  const motionStyle: CSSProperties = {
    ['--mouse-x' as string]: `${mousePos.x}px`,
    ['--mouse-y' as string]: `${mousePos.y}px`,
  };

  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cpOldPassword || !cpNewPassword || !cpNewPasswordConfirm) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    if (cpNewPassword !== cpNewPasswordConfirm) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      setIsChangingPassword(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/users/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: cpOldPassword,
          new_password: cpNewPassword,
          new_password_confirm: cpNewPasswordConfirm,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Prefer explicit error messages
        const err = body?.error || body || { message: 'Erreur lors du changement de mot de passe' };
        toast.error(typeof err === 'string' ? err : err.message || JSON.stringify(err));
        return;
      }

      toast.success('Mot de passe changé avec succès.');
      // Refresh profile to get last_password_change
      const profileRes = await fetch(`${API_BASE}/api/users/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        updateProfile(profileData);
      }
      // Reset form
      setCpOldPassword('');
      setCpNewPassword('');
      setCpNewPasswordConfirm('');
      setShowChangePassword(false);
    } catch (err: any) {
      toast.error(err?.message || 'Erreur interne');
    } finally {
      setIsChangingPassword(false);
    }
  };

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
        shopUrl: user?.shop_slug || 'ma-boutique',
      }));
    }
  }, [user]);

  // Auto-save phone and country changes
  const saveProfileField = async (fieldName: string, value: string) => {
    const payload: any = {};

    // Map friendly names to API keys
    if (fieldName === 'phone' || fieldName === 'phone_number') {
      payload.phone_number = value;
    } else if (fieldName === 'city') {
      payload.city = value;
    } else if (fieldName === 'country') {
      payload.country = value;
    } else if (fieldName === 'shopName' || fieldName === 'shop_name') {
      payload.shop_name = value;
    } else if (fieldName === 'shop_slug') {
      payload.shop_slug = value;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [firstName, ...rest] = formData.name.split(' ');
    const lastName = rest.join(' ');

    // Update local context first for snappy UI
    updateProfile({
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      email: formData.email,
      shop_name: formData.shopName,
    });

    // Persist shop name and slug
    const slug = (formData.shopUrl || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    await saveProfileField('shop_name', formData.shopName);
    await saveProfileField('shop_slug', slug);

    setIsEditing(false);
    toast.success("Profil mis à jour avec succès !");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // For shopUrl, keep raw input but prepare slug when saving
    if (name === 'shopUrl') {
      setFormData({ ...formData, shopUrl: value });
      const slug = value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || '';
      saveProfileField('shop_slug', slug);
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-save for phone, country and city
    if (name === 'phone' || name === 'country' || name === 'city') {
      saveProfileField(name, value);
    }

    // Auto-save for shop name
    if (name === 'shopName') {
      saveProfileField('shop_name', value);
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

  // Start two-factor flow (send OTP)
  const startTwoFactor = async () => {
    try {
      setIs2faStarting(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/users/2fa/start/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.error || 'Erreur lors du démarrage de la 2FA');
      }
      if (body.debug_otp) {
        toast.success(`DEBUG OTP: ${body.debug_otp}`);
      } else {
        toast.success('OTP envoyé à votre email.');
      }
      setShow2faVerify(true);
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors du démarrage de la 2FA');
    } finally {
      setIs2faStarting(false);
    }
  };

  // Verify OTP and enable 2FA
  const verifyTwoFactor = async (enable = true) => {
    if (!twoFaOtp) {
      toast.error("Veuillez entrer le code OTP");
      return;
    }
    try {
      setIs2faVerifying(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/users/2fa/verify/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: twoFaOtp, enable }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.error || 'Erreur lors de la vérification OTP');
      }

      // Refresh profile
      const profileRes = await fetch(`${API_BASE}/api/users/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        updateProfile(profileData);
      }

      toast.success('OTP vérifié, 2FA activée.');
      setShow2faVerify(false);
      setTwoFaOtp('');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la vérification OTP');
    } finally {
      setIs2faVerifying(false);
    }
  };

  // Disable 2FA
  const disableTwoFactor = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/users/profile/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ two_factor_enabled: false }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Erreur lors de la désactivation');
      }
      const data = await res.json();
      updateProfile(data);
      toast.success('2FA désactivée.');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la désactivation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 profile-motion" style={motionStyle}>
      <div className="bg-blob bg-blob-1" aria-hidden />
      <div className="bg-blob bg-blob-2" aria-hidden />
      <div className="cursor-spotlight" aria-hidden />
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 header-fade">
              <h1 className="text-[#0A1A2F] dark:text-white mb-2" style={{ fontSize: '36px', fontWeight: '800' }}>
                Mon Profil
              </h1>
              <p className="text-[#0A1A2F]/60 dark:text-white/70">
                Gérez vos informations personnelles et les paramètres de votre boutique
              </p>
            </div>

            <div className="grid gap-6">
              {/* Profile Picture Card */}
              <Card className="border-2 border-gray-100 dark:border-gray-700 rounded-2xl animated-card hover-lift">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] dark:text-white">Photo de profil</CardTitle>
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
                      <p className="text-[#0A1A2F] dark:text-white mb-2" style={{ fontWeight: '600' }}>
                        {formData.name}
                      </p>
                      <p className="text-[#0A1A2F]/60 dark:text-white/70 text-sm mb-4">
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
              <Card className="border-2 border-gray-100 dark:border-gray-700 rounded-2xl animated-card hover-lift">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-[#0A1A2F] dark:text-white">Informations personnelles</CardTitle>
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
              <Card className="border-2 border-gray-100 dark:border-gray-700 rounded-2xl animated-card hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-[#0A1A2F] dark:text-white">Paramètres de la boutique</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-2 border-gray-200 hover:text-[#0077FF] hover:border-[#0077FF]"
                      onClick={() => { window.location.href = '/my-shop'; }}
                    >
                      Gérer ma boutique
                    </Button>
                  </div>
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
                          <span className="text-[#0A1A2F]/60 text-sm">{import.meta.env.VITE_SHOP_DOMAIN || 'shopina.com'}/</span>
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
              <Card className="border-2 border-gray-100 dark:border-gray-700 rounded-2xl animated-card hover-lift">
                <CardHeader>
                  <CardTitle className="text-[#0A1A2F] dark:text-white">Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#0A1A2F]" style={{ fontWeight: '600' }}>
                          Mot de passe
                        </p>
                        <p className="text-[#0A1A2F]/60 text-sm">
                          {user?.last_password_change ? `Dernière modification : ${new Date(user.last_password_change).toLocaleString()}` : 'Aucune modification enregistrée'}
                        </p>
                      </div>
                      {!showChangePassword ? (
                        <Button
                          variant="outline"
                          className="rounded-xl border-2 border-gray-200"
                          onClick={() => setShowChangePassword(true)}
                        >
                          Changer
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="rounded-xl border-2 border-gray-200"
                            onClick={() => setShowChangePassword(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      )}
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
                      <div>
                        {user?.two_factor_enabled ? (
                          <Button variant="outline" className="rounded-xl border-2 border-gray-200" onClick={disableTwoFactor} disabled={isSaving}>
                            Désactiver
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {!show2faVerify ? (
                              <Button variant="outline" className="rounded-xl border-2 border-gray-200" onClick={startTwoFactor} disabled={is2faStarting}>
                                {is2faStarting ? 'Envoi...' : 'Activer'}
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Input id="twofa_otp" name="twofa_otp" value={twoFaOtp} onChange={(e) => setTwoFaOtp(e.target.value)} placeholder="Entrez le code OTP" className="h-11 rounded-xl border-2 border-gray-200" />
                                <Button onClick={() => verifyTwoFactor(true)} className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl" disabled={is2faVerifying}>
                                  {is2faVerifying ? 'Vérification...' : 'Vérifier & Activer'}
                                </Button>
                                <Button variant="outline" onClick={() => { setShow2faVerify(false); setTwoFaOtp(''); }} className="rounded-xl border-2 border-gray-200">
                                  Annuler
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {showChangePassword && (
                      <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input
                            id="cp_old"
                            name="cp_old"
                            value={cpOldPassword}
                            onChange={(e) => setCpOldPassword(e.target.value)}
                            placeholder="Mot de passe actuel"
                            type="password"
                            className="col-span-1 md:col-span-3 h-11 rounded-xl border-2 border-gray-200"
                          />
                          <Input
                            id="cp_new"
                            name="cp_new"
                            value={cpNewPassword}
                            onChange={(e) => setCpNewPassword(e.target.value)}
                            placeholder="Nouveau mot de passe"
                            type="password"
                            className="col-span-1 md:col-span-3 h-11 rounded-xl border-2 border-gray-200"
                          />
                          <Input
                            id="cp_new_confirm"
                            name="cp_new_confirm"
                            value={cpNewPasswordConfirm}
                            onChange={(e) => setCpNewPasswordConfirm(e.target.value)}
                            placeholder="Confirmez le nouveau mot de passe"
                            type="password"
                            className="col-span-1 md:col-span-3 h-11 rounded-xl border-2 border-gray-200"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button type="submit" className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl" disabled={isChangingPassword}>
                            {isChangingPassword ? 'En cours...' : 'Valider'}
                          </Button>
                          <Button type="button" variant="outline" className="rounded-xl border-2 border-gray-200" onClick={() => setShowChangePassword(false)}>
                            Annuler
                          </Button>
                        </div>
                      </form>
                    )}
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

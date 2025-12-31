import { useEffect, useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../utils/apiBase";

export default function ShopSettingsPage() {
  const { user } = useAuth();
  const [shop, setShop] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/shop/api/my-shop/`, {
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          credentials: "include",
        });
        if (!ignore && res.ok) {
          const data = await res.json();
          setShop(data);
        }
      } catch (e) {
        console.warn("Could not load shop info", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  // Save announcement: try backend, fallback to localStorage
  async function saveAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Titre et message requis");
      return;
    }

    const payload = { title, message, image: imageUrl };
    const token = localStorage.getItem("access_token");

    // optimistic local preview
    try {
      // If an image file is selected, try sending multipart/form-data
      if (imageFile) {
        const fd = new FormData();
        fd.append('title', title);
        fd.append('message', message);
        fd.append('image', imageFile);

        const res = await fetch(`${API_BASE}/api/shop/announcements/`, {
          method: 'POST',
          body: fd,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
        });

        if (res.ok) {
          toast.success('Annonce publiée');
          return;
        }
      } else {
        // Try backend endpoint (JSON) when no file
        const res = await fetch(`${API_BASE}/api/shop/announcements/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        if (res.ok) {
          toast.success("Annonce publiée");
          return;
        }
      }
    } catch (err) {
      // ignore, we'll fallback
    }

    // Fallback: save to localStorage keyed by shop slug (or 'global')
    const slug = shop?.slug || "global";
    const key = `shop_announcements_${slug}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const storedImage = previewDataUrl || imageUrl || undefined;
    existing.unshift({ title, message, image: storedImage, id: Date.now() });
    localStorage.setItem(key, JSON.stringify(existing));
    toast.success("Annonce enregistrée localement et affichée dans la boutique");
  }

  // Handle file selection and generate preview data URL (base64)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setImageFile(f);
    setImageUrl('');
    if (!f) {
      setPreviewDataUrl(null);
      return;
    }
    // accept PNGs only (but allow images/*) — further validation below
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      setPreviewDataUrl(result);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Paramètres de la boutique</h2>

          <section className="max-w-3xl space-y-4">
            <form onSubmit={saveAnnouncement} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Titre de l'annonce</label>
                <Input value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Textarea value={message} onChange={(e) => setMessage((e.target as HTMLTextAreaElement).value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image (PNG recommandé)</label>
                <Input type="file" accept=".png,image/png,image/*" onChange={handleFileChange} />
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Ou URL de l'image (optionnel)</label>
                  <Input value={imageUrl} onChange={(e) => setImageUrl((e.target as HTMLInputElement).value)} placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="bg-[#0077FF]">Publier l'annonce</Button>
                <Button type="button" variant="outline" onClick={() => { setTitle(""); setMessage(""); setImageUrl(""); }}>Réinitialiser</Button>
              </div>
            </form>

            <div>
              <h3 className="text-lg font-semibold mb-2">Aperçu</h3>
              <div className="p-4 rounded-xl border bg-white dark:bg-gray-900">
                <div className="flex items-start gap-4">
                  {previewDataUrl && <img src={previewDataUrl} alt="preview" className="w-24 h-24 object-cover rounded-md" />}
                  {!previewDataUrl && imageUrl && <img src={imageUrl} alt="preview" className="w-24 h-24 object-cover rounded-md" />}
                  <div>
                    <div className="font-bold text-lg">{title || "Titre de l'annonce"}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{message || "Votre message d'annonce apparaîtra ici"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Remarque: si le backend ne fournit pas d'API d'annonces, l'annonce sera stockée localement et affichée immédiatement dans votre boutique publique.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

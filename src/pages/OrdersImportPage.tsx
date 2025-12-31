import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { API_BASE } from "../utils/apiBase";

export default function OrdersImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Choisissez un fichier CSV");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/orders/import/`, {
        method: "POST",
        body: form,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        let message = "Fichier importé avec succès";
        if (contentType.includes("application/json")) {
          const data = await res.json().catch(() => null);
          if (data?.message) message = data.message;
        } else {
          const text = await res.text().catch(() => "");
          if (text) message = text;
        }
        toast.success(message);
        setFile(null);
        navigate("/orders");
      } else {
        const txt = await res.text().catch(() => "");
        toast.error(txt || "Erreur lors de l'import");
      }
    } catch (e: any) {
      toast.error(e?.message || "Erreur réseau");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Importer des commandes</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <Input type="file" accept=".csv" onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] || null)} />
            <div className="flex gap-3">
              <Button type="submit" className="bg-[#0077FF]" disabled={uploading}>{uploading ? 'Envoi...' : 'Importer'}</Button>
              <Button type="button" variant="outline" onClick={() => setFile(null)}>Réinitialiser</Button>
            </div>
          </form>
          <p className="text-sm text-gray-500 mt-4">Ce formulaire est non destructif pour le moment — il sert à uploader un CSV pour traitement.</p>
        </main>
      </div>
    </div>
  );
}

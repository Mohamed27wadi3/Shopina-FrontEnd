import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ShoppingCart, X } from "lucide-react";

type Product = any;

export default function ProductDetailModal({ product, open, onClose, onConfirm }: { product: Product | null; open: boolean; onClose: () => void; onConfirm: (payload: { product: Product; quantity: number; options?: any }) => void; }) {
  const [quantity, setQuantity] = useState(1);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-h-80 object-contain" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
            <div className="mb-4">
              <span className="text-3xl font-extrabold">{(Number(product.price) || 0).toFixed(2)}€</span>
              <div className="mt-2 text-sm text-gray-500">{product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}</div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm text-gray-600">Quantité</label>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-lg border" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input className="w-16 text-center rounded-lg border p-1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))} />
                <button className="px-3 py-1 rounded-lg border" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Options placeholder (size/color) - if product.options exists we could render controls */}
            {product.options && (
              <div className="mb-4">
                {/* Render simple options */}
                {Object.keys(product.options).map((opt: string) => (
                  <div key={opt} className="mb-2">
                    <div className="text-sm font-medium mb-1">{opt}</div>
                    <div className="flex gap-2">
                      {(product.options[opt] || []).map((val: any) => (
                        <Badge key={val} className="cursor-pointer">{val}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <Button onClick={() => onConfirm({ product, quantity })} className="bg-gradient-to-r from-[#0077FF] to-[#5AC8FA] text-white rounded-xl">
                <ShoppingCart className="w-4 h-4 mr-2" /> Ajouter au panier
              </Button>
              <Button variant="ghost" onClick={onClose} className="rounded-xl border-2">Annuler</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

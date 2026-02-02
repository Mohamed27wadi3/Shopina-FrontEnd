import { createContext, useCallback, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type LayoutStyle = "modulaire" | "immersif" | "boutique";

export type ShopConfig = {
  shopName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  layout: LayoutStyle;
  sections: Record<string, boolean>;
  sectionOrder: string[];
  previewGuides: boolean;
};

export type TemplateSelectionContextValue = {
  templateId: number | null;
  variantId: string | null;
  selectedOptions: Record<string, string>;
  shopConfig: ShopConfig;
  setTemplate: (
    templateId: number,
    sectionSeed?: string[],
    defaultOptions?: Record<string, string>
  ) => void;
  setVariant: (variantId: string | null) => void;
  setOption: (key: string, value: string) => void;
  updateShopConfig: (patch: Partial<ShopConfig>) => void;
  toggleSection: (sectionKey: string) => void;
  reorderSections: (newOrder: string[]) => void;
  reset: () => void;
};

const defaultConfig: ShopConfig = {
  shopName: "",
  tagline: "",
  primaryColor: "#0A1A2F",
  accentColor: "#0077FF",
  layout: "modulaire",
  sections: {},
  sectionOrder: [],
  previewGuides: true,
};

const TemplateSelectionContext = createContext<TemplateSelectionContextValue | undefined>(undefined);

export function TemplateSelectionProvider({ children }: { children: ReactNode }) {
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [shopConfig, setShopConfig] = useState<ShopConfig>(defaultConfig);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("templateSelectionState");
    if (savedState) {
      try {
        const { templateId, variantId, shopConfig, selectedOptions } = JSON.parse(savedState);
        if (templateId) setTemplateId(templateId);
        if (variantId) setVariantId(variantId);
        if (shopConfig) setShopConfig(shopConfig);
        if (selectedOptions) setSelectedOptions(selectedOptions);
      } catch (error) {
        console.warn("Failed to load template state from localStorage:", error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const state = { templateId, variantId, shopConfig, selectedOptions };
    localStorage.setItem("templateSelectionState", JSON.stringify(state));
  }, [templateId, variantId, shopConfig, selectedOptions]);

  const setTemplate = useCallback((
    nextTemplateId: number,
    sectionSeed: string[] = [],
    defaultOptions: Record<string, string> = {}
  ) => {
    setTemplateId((prevTemplateId) => {
      if (prevTemplateId !== nextTemplateId) {
        setVariantId(null);
      }
      return nextTemplateId;
    });
    setShopConfig((prev) => ({
      ...prev,
      sections: sectionSeed.reduce<Record<string, boolean>>((acc, section) => {
        acc[section] = true;
        return acc;
      }, {}),
      sectionOrder: sectionSeed,
    }));
    setSelectedOptions(defaultOptions);
  }, []);

  const setVariant = useCallback((nextVariantId: string | null) => {
    setVariantId(nextVariantId);
  }, []);

  const setOption = useCallback((key: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateShopConfig = useCallback((patch: Partial<ShopConfig>) => {
    setShopConfig((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const toggleSection = useCallback((sectionKey: string) => {
    setShopConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: !(prev.sections[sectionKey] ?? true),
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setTemplateId(null);
    setVariantId(null);
    setShopConfig(defaultConfig);
    setSelectedOptions({});
  }, []);

  const reorderSections = useCallback((newOrder: string[]) => {
    setShopConfig((prev) => ({
      ...prev,
      sectionOrder: newOrder,
    }));
  }, []);

  return (
    <TemplateSelectionContext.Provider
      value={{
        templateId,
        variantId,
        selectedOptions,
        shopConfig,
        setTemplate,
        setVariant,
        setOption,
        updateShopConfig,
        toggleSection,
        reorderSections,
        reset,
      }}
    >
      {children}
    </TemplateSelectionContext.Provider>
  );
}

export function useTemplateSelection() {
  const context = useContext(TemplateSelectionContext);
  if (!context) {
    throw new Error("useTemplateSelection must be used within TemplateSelectionProvider");
  }
  return context;
}

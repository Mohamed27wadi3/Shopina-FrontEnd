export type LayoutVariant = 'grid' | 'sidebar' | 'fullwidth';
export type VisualStyle = 'rounded' | 'sharp';
export type AnimationType = 'fade' | 'slide' | 'scale' | 'none';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TypographyStyle {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  bodyWeight: number;
}

export interface Section {
  id: string;
  name: string;
  type: 'hero' | 'products' | 'testimonials' | 'newsletter' | 'featured' | 'categories';
  enabled: boolean;
  order: number;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  previewImage: string;
  colorPalettes: ColorPalette[];
  typographyStyles: TypographyStyle[];
  layoutVariants: LayoutVariant[];
  defaultLayout: LayoutVariant;
  defaultColorPalette: string;
  defaultTypography: string;
  sections: Section[];
  visualStyle: {
    borderRadius: number;
    shadows: boolean;
    spacing: number;
  };
  interactions: {
    hoverEffect: boolean;
    animations: AnimationType;
  };
}

export interface ShopCustomization {
  templateId: string;
  shopName: string;
  logo: string | null;
  selectedColorPalette: string;
  selectedTypography: string;
  selectedLayout: LayoutVariant;
  customColors: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  sections: Section[];
  visualStyle: {
    type: VisualStyle;
    borderRadius: number;
    shadows: boolean;
    spacing: number;
  };
  interactions: {
    hoverEffect: boolean;
    animations: AnimationType;
  };
  features: {
    search: boolean;
    filters: boolean;
    badges: boolean;
    wishlist: boolean;
    quickView: boolean;
  };
  header: {
    style: 'minimal' | 'standard' | 'sticky';
    showCategories: boolean;
    showSearch: boolean;
  };
  footer: {
    columns: number;
    showNewsletter: boolean;
    showSocial: boolean;
  };
  productGrid: {
    columns: number;
    imageRatio: string;
    showQuickAdd: boolean;
    showRatings: boolean;
  };
}

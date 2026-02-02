import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Palette,
  Type,
  Layout,
  Settings,
  Sparkles,
  Grid3x3,
  Navigation,
  ShoppingBag,
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { templates } from '@/data/templates';
import { ShopCustomization, LayoutVariant, VisualStyle, AnimationType } from '@/types/template';
import { toast } from 'sonner';

interface TemplateCustomizationPageProps {
  templateId: string;
  onBack: () => void;
}

export function TemplateCustomizationPage({ templateId, onBack }: TemplateCustomizationPageProps) {
  const template = templates.find(t => t.id === templateId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  if (!template) {
    return <div>Template not found</div>;
  }

  const [customization, setCustomization] = useState<ShopCustomization>({
    templateId: template.id,
    shopName: 'My Store',
    logo: null,
    selectedColorPalette: template.defaultColorPalette,
    selectedTypography: template.defaultTypography,
    selectedLayout: template.defaultLayout,
    customColors: {},
    sections: template.sections,
    visualStyle: {
      type: template.visualStyle.borderRadius > 0 ? 'rounded' : 'sharp',
      borderRadius: template.visualStyle.borderRadius,
      shadows: template.visualStyle.shadows,
      spacing: template.visualStyle.spacing,
    },
    interactions: template.interactions,
    features: {
      search: true,
      filters: true,
      badges: true,
      wishlist: true,
      quickView: true,
    },
    header: {
      style: 'sticky',
      showCategories: true,
      showSearch: true,
    },
    footer: {
      columns: 4,
      showNewsletter: true,
      showSocial: true,
    },
    productGrid: {
      columns: 3,
      imageRatio: '1:1',
      showQuickAdd: true,
      showRatings: true,
    },
  });

  const selectedPalette = template.colorPalettes.find(
    p => p.id === customization.selectedColorPalette
  ) || template.colorPalettes[0];

  const selectedTypography = template.typographyStyles.find(
    t => t.id === customization.selectedTypography
  ) || template.typographyStyles[0];

  const updateCustomization = (updates: Partial<ShopCustomization>) => {
    setCustomization({ ...customization, ...updates });
  };

  const updateCustomColors = (key: string, value: string) => {
    setCustomization({
      ...customization,
      customColors: { ...customization.customColors, [key]: value },
    });
  };

  const updateVisualStyle = (updates: Partial<ShopCustomization['visualStyle']>) => {
    setCustomization({
      ...customization,
      visualStyle: { ...customization.visualStyle, ...updates },
    });
  };

  const updateInteractions = (updates: Partial<ShopCustomization['interactions']>) => {
    setCustomization({
      ...customization,
      interactions: { ...customization.interactions, ...updates },
    });
  };

  const updateFeatures = (key: keyof ShopCustomization['features'], value: boolean) => {
    setCustomization({
      ...customization,
      features: { ...customization.features, [key]: value },
    });
  };

  const updateHeader = (updates: Partial<ShopCustomization['header']>) => {
    setCustomization({
      ...customization,
      header: { ...customization.header, ...updates },
    });
  };

  const updateFooter = (updates: Partial<ShopCustomization['footer']>) => {
    setCustomization({
      ...customization,
      footer: { ...customization.footer, ...updates },
    });
  };

  const updateProductGrid = (updates: Partial<ShopCustomization['productGrid']>) => {
    setCustomization({
      ...customization,
      productGrid: { ...customization.productGrid, ...updates },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCustomization({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success('Draft saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Reset all changes? This cannot be undone.')) {
      window.location.reload();
    }
  };

  const handleApply = () => {
    toast.success('Template applied to your shop!', {
      description: 'Your store has been updated with the new design.',
    });
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'desktop': return 'w-full';
      case 'tablet': return 'max-w-3xl';
      case 'mobile': return 'max-w-sm';
    }
  };

  const finalColors = {
    primary: customization.customColors.primary || selectedPalette.primary,
    secondary: customization.customColors.secondary || selectedPalette.secondary,
    accent: customization.customColors.accent || selectedPalette.accent,
    background: selectedPalette.background,
    text: selectedPalette.text,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Customize {template.name}</h1>
            <p className="text-sm text-gray-500">Make it yours with advanced customization</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Device Selector */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              size="sm"
              variant={device === 'desktop' ? 'default' : 'ghost'}
              onClick={() => setDevice('desktop')}
              className="px-3"
            >
              <Monitor className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={device === 'tablet' ? 'default' : 'ghost'}
              onClick={() => setDevice('tablet')}
              className="px-3"
            >
              <Tablet className="size-4" />
            </Button>
            <Button
              size="sm"
              variant={device === 'mobile' ? 'default' : 'ghost'}
              onClick={() => setDevice('mobile')}
              className="px-3"
            >
              <Smartphone className="size-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="size-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Check className="size-4 mr-2" />
            Apply to My Shop
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-96 bg-white border-r overflow-hidden flex flex-col">
          <Tabs defaultValue="branding" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="branding" className="text-xs">
                <Sparkles className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="design" className="text-xs">
                <Palette className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Layout className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="features" className="text-xs">
                <Settings className="size-4" />
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              {/* Branding Tab */}
              <TabsContent value="branding" className="p-6 space-y-6 m-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="size-5 text-blue-600" />
                      Branding
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label>Shop Name</Label>
                    <Input
                      value={customization.shopName}
                      onChange={(e) => updateCustomization({ shopName: e.target.value })}
                      placeholder="Enter your shop name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-3">
                      {customization.logo ? (
                        <div className="size-20 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img src={customization.logo} alt="Logo" className="max-w-full max-h-full" />
                        </div>
                      ) : (
                        <div className="size-20 rounded border bg-gray-50 flex items-center justify-center">
                          <Upload className="size-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="size-4 mr-2" />
                          Upload Logo
                        </Button>
                        {customization.logo && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCustomization({ logo: null })}
                            className="w-full mt-1 text-red-600"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Design Tab */}
              <TabsContent value="design" className="p-6 space-y-6 m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Palette className="size-5 text-purple-600" />
                      Colors & Typography
                    </h3>
                  </div>

                  {/* Color Palette Selector */}
                  <div className="space-y-3">
                    <Label>Color Palette</Label>
                    <Select
                      value={customization.selectedColorPalette}
                      onValueChange={(value) => updateCustomization({ selectedColorPalette: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {template.colorPalettes.map((palette) => (
                          <SelectItem key={palette.id} value={palette.id}>
                            {palette.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(selectedPalette).slice(2, 5).map(([key, color]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-xs text-gray-500 capitalize">{key}</p>
                          <button
                            onClick={() => setShowColorPicker(showColorPicker === key ? null : key)}
                            className="w-full h-12 rounded border-2 border-gray-200 hover:border-blue-400 transition-colors relative"
                            style={{ backgroundColor: customization.customColors[key] || color as string }}
                          >
                            {customization.customColors[key] && (
                              <div className="absolute top-1 right-1 size-3 bg-blue-600 rounded-full" />
                            )}
                          </button>
                          {showColorPicker === key && (
                            <div className="absolute z-50 mt-2">
                              <div
                                className="fixed inset-0"
                                onClick={() => setShowColorPicker(null)}
                              />
                              <Card className="p-3 relative">
                                <HexColorPicker
                                  color={customization.customColors[key] || color as string}
                                  onChange={(value) => updateCustomColors(key, value)}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const { [key]: _, ...rest } = customization.customColors;
                                    setCustomization({ ...customization, customColors: rest });
                                  }}
                                  className="w-full mt-2"
                                >
                                  Reset
                                </Button>
                              </Card>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Typography */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Type className="size-4" />
                      Typography Style
                    </Label>
                    <Select
                      value={customization.selectedTypography}
                      onValueChange={(value) => updateCustomization({ selectedTypography: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {template.typographyStyles.map((typo) => (
                          <SelectItem key={typo.id} value={typo.id}>
                            {typo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <p
                        className="text-xl"
                        style={{
                          fontFamily: selectedTypography.headingFont,
                          fontWeight: selectedTypography.headingWeight,
                        }}
                      >
                        Heading Preview
                      </p>
                      <p style={{ fontFamily: selectedTypography.bodyFont }}>
                        Body text preview for product descriptions.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Visual Style */}
                  <div className="space-y-4">
                    <Label>Visual Style</Label>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Border Radius</p>
                        <p className="text-xs text-gray-500">{customization.visualStyle.borderRadius}px</p>
                      </div>
                      <div className="w-32">
                        <Slider
                          value={[customization.visualStyle.borderRadius]}
                          onValueChange={([value]) => updateVisualStyle({ borderRadius: value })}
                          min={0}
                          max={24}
                          step={2}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Spacing</p>
                        <p className="text-xs text-gray-500">{customization.visualStyle.spacing}px</p>
                      </div>
                      <div className="w-32">
                        <Slider
                          value={[customization.visualStyle.spacing]}
                          onValueChange={([value]) => updateVisualStyle({ spacing: value })}
                          min={8}
                          max={48}
                          step={4}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Drop Shadows</Label>
                      <Switch
                        checked={customization.visualStyle.shadows}
                        onCheckedChange={(checked) => updateVisualStyle({ shadows: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Hover Effects</Label>
                      <Switch
                        checked={customization.interactions.hoverEffect}
                        onCheckedChange={(checked) => updateInteractions({ hoverEffect: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Animations</Label>
                      <Select
                        value={customization.interactions.animations}
                        onValueChange={(value: AnimationType) => updateInteractions({ animations: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="fade">Fade</SelectItem>
                          <SelectItem value="slide">Slide</SelectItem>
                          <SelectItem value="scale">Scale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="p-6 space-y-6 m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Layout className="size-5 text-green-600" />
                      Layout & Structure
                    </h3>
                  </div>

                  {/* Main Layout */}
                  <div className="space-y-3">
                    <Label>Main Layout</Label>
                    <Select
                      value={customization.selectedLayout}
                      onValueChange={(value: LayoutVariant) => updateCustomization({ selectedLayout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {template.layoutVariants.map((layout) => (
                          <SelectItem key={layout} value={layout} className="capitalize">
                            {layout.replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Header Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Navigation className="size-4 text-blue-600" />
                      <Label>Header</Label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Style</Label>
                      <Select
                        value={customization.header.style}
                        onValueChange={(value: any) => updateHeader({ style: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="sticky">Sticky</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Categories</Label>
                      <Switch
                        checked={customization.header.showCategories}
                        onCheckedChange={(checked) => updateHeader({ showCategories: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Search</Label>
                      <Switch
                        checked={customization.header.showSearch}
                        onCheckedChange={(checked) => updateHeader({ showSearch: checked })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Product Grid Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="size-4 text-purple-600" />
                      <Label>Product Grid</Label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Columns</p>
                        <p className="text-xs text-gray-500">{customization.productGrid.columns} columns</p>
                      </div>
                      <div className="w-32">
                        <Slider
                          value={[customization.productGrid.columns]}
                          onValueChange={([value]) => updateProductGrid({ columns: value })}
                          min={2}
                          max={5}
                          step={1}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Image Ratio</Label>
                      <Select
                        value={customization.productGrid.imageRatio}
                        onValueChange={(value) => updateProductGrid({ imageRatio: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">Square (1:1)</SelectItem>
                          <SelectItem value="4:3">Standard (4:3)</SelectItem>
                          <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                          <SelectItem value="16:9">Wide (16:9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Quick Add Button</Label>
                      <Switch
                        checked={customization.productGrid.showQuickAdd}
                        onCheckedChange={(checked) => updateProductGrid({ showQuickAdd: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Ratings</Label>
                      <Switch
                        checked={customization.productGrid.showRatings}
                        onCheckedChange={(checked) => updateProductGrid({ showRatings: checked })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Footer Settings */}
                  <div className="space-y-4">
                    <Label>Footer</Label>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Columns</p>
                        <p className="text-xs text-gray-500">{customization.footer.columns} columns</p>
                      </div>
                      <div className="w-32">
                        <Slider
                          value={[customization.footer.columns]}
                          onValueChange={([value]) => updateFooter({ columns: value })}
                          min={2}
                          max={5}
                          step={1}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Newsletter Section</Label>
                      <Switch
                        checked={customization.footer.showNewsletter}
                        onCheckedChange={(checked) => updateFooter({ showNewsletter: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Social Links</Label>
                      <Switch
                        checked={customization.footer.showSocial}
                        onCheckedChange={(checked) => updateFooter({ showSocial: checked })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="p-6 space-y-6 m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ShoppingBag className="size-5 text-orange-600" />
                      Features & Modules
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(customization.features).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updateFeatures(key as any, checked)}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Tip:</strong> Enable features that match your business needs. You can always adjust these later.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className={`mx-auto transition-all duration-300 ${getDeviceWidth()}`}>
            <div
              className="bg-white shadow-2xl min-h-screen"
              style={{
                fontFamily: selectedTypography.bodyFont,
                color: finalColors.text,
              }}
            >
              {/* Mock Store Preview */}
              <LiveStorePreview
                customization={customization}
                template={template}
                colors={finalColors}
                typography={selectedTypography}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Live Store Preview Component
function LiveStorePreview({ customization, template, colors, typography }: any) {
  return (
    <div style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header
        className={`border-b ${customization.header.style === 'sticky' ? 'sticky top-0 z-40 bg-white' : ''}`}
        style={{ borderColor: `${colors.primary}20` }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {customization.logo ? (
                <img src={customization.logo} alt="Logo" className="h-10" />
              ) : (
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: typography.headingFont,
                    fontWeight: typography.headingWeight,
                    color: colors.primary,
                  }}
                >
                  {customization.shopName}
                </div>
              )}
              {customization.header.showCategories && (
                <nav className="hidden md:flex gap-6 text-sm">
                  <a href="#" className="hover:opacity-70">New Arrivals</a>
                  <a href="#" className="hover:opacity-70">Collections</a>
                  <a href="#" className="hover:opacity-70">Sale</a>
                </nav>
              )}
            </div>
            <div className="flex items-center gap-4">
              {customization.header.showSearch && customization.features.search && (
                <button className="text-sm hover:opacity-70">Search</button>
              )}
              {customization.features.wishlist && (
                <button className="text-sm hover:opacity-70">Wishlist</button>
              )}
              <button className="text-sm hover:opacity-70">Cart (0)</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {customization.sections.find((s: any) => s.type === 'hero' && s.enabled) && (
        <section
          className="py-20 px-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
          }}
        >
          <div className="container mx-auto max-w-3xl">
            <h1
              className="text-5xl mb-4"
              style={{
                fontFamily: typography.headingFont,
                fontWeight: typography.headingWeight,
              }}
            >
              Welcome to {customization.shopName}
            </h1>
            <p className="text-lg mb-8 opacity-80">
              Discover our curated collection of premium products
            </p>
            <button
              className="px-8 py-3 text-white font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                borderRadius: `${customization.visualStyle.borderRadius}px`,
                boxShadow: customization.visualStyle.shadows ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              Shop Now
            </button>
          </div>
        </section>
      )}

      {/* Products Grid */}
      {customization.sections.find((s: any) => s.type === 'products' && s.enabled) && (
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-3xl"
                style={{
                  fontFamily: typography.headingFont,
                  fontWeight: typography.headingWeight,
                }}
              >
                Featured Products
              </h2>
              {customization.features.filters && (
                <button className="text-sm font-medium" style={{ color: colors.primary }}>
                  Filter & Sort
                </button>
              )}
            </div>

            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${customization.productGrid.columns}, 1fr)`,
                gap: `${customization.visualStyle.spacing}px`,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="group cursor-pointer"
                  style={{
                    borderRadius: `${customization.visualStyle.borderRadius}px`,
                  }}
                >
                  <div
                    className="aspect-square bg-gray-100 mb-3 overflow-hidden relative"
                    style={{
                      aspectRatio: customization.productGrid.imageRatio.replace(':', '/'),
                      borderRadius: `${customization.visualStyle.borderRadius}px`,
                      boxShadow: customization.visualStyle.shadows ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform" />
                    {customization.features.badges && i <= 2 && (
                      <div
                        className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white"
                        style={{
                          backgroundColor: colors.accent,
                          borderRadius: `${customization.visualStyle.borderRadius / 2}px`,
                        }}
                      >
                        New
                      </div>
                    )}
                    {customization.productGrid.showQuickAdd && (
                      <button
                        className="absolute bottom-2 left-2 right-2 py-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: `${customization.visualStyle.borderRadius}px`,
                        }}
                      >
                        Quick Add
                      </button>
                    )}
                  </div>
                  <h3 className="font-medium mb-1">Premium Product {i}</h3>
                  {customization.productGrid.showRatings && (
                    <div className="flex items-center gap-1 mb-1 text-xs" style={{ color: colors.accent }}>
                      ★★★★★ <span className="text-gray-500">(24)</span>
                    </div>
                  )}
                  <p className="font-semibold" style={{ color: colors.primary }}>
                    ${(99 + i * 10).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      {customization.footer.showNewsletter &&
        customization.sections.find((s: any) => s.type === 'newsletter' && s.enabled) && (
          <section
            className="py-16 px-6"
            style={{ backgroundColor: `${colors.primary}10` }}
          >
            <div className="container mx-auto text-center max-w-2xl">
              <h2
                className="text-3xl mb-4"
                style={{
                  fontFamily: typography.headingFont,
                  fontWeight: typography.headingWeight,
                }}
              >
                Join Our Newsletter
              </h2>
              <p className="mb-6 opacity-80">
                Subscribe to get special offers and updates
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border"
                  style={{
                    borderRadius: `${customization.visualStyle.borderRadius}px`,
                    borderColor: `${colors.primary}40`,
                  }}
                />
                <button
                  className="px-6 py-3 text-white font-medium"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: `${customization.visualStyle.borderRadius}px`,
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        )}

      {/* Footer */}
      <footer
        className="py-12 px-6 border-t"
        style={{ borderColor: `${colors.primary}20` }}
      >
        <div className="container mx-auto">
          <div
            className="grid gap-8 mb-8"
            style={{ gridTemplateColumns: `repeat(${customization.footer.columns}, 1fr)` }}
          >
            {[...Array(customization.footer.columns)].map((_, i) => (
              <div key={i}>
                <h3
                  className="font-semibold mb-3"
                  style={{ fontFamily: typography.headingFont }}
                >
                  {['Shop', 'About', 'Help', 'Follow'][i] || 'Links'}
                </h3>
                <ul className="space-y-2 text-sm opacity-70">
                  <li>Link 1</li>
                  <li>Link 2</li>
                  <li>Link 3</li>
                </ul>
              </div>
            ))}
          </div>

          {customization.footer.showSocial && (
            <div className="flex justify-center gap-6 mb-8 text-sm">
              <a href="#" className="hover:opacity-70">Instagram</a>
              <a href="#" className="hover:opacity-70">Facebook</a>
              <a href="#" className="hover:opacity-70">Twitter</a>
            </div>
          )}

          <div className="text-center text-sm opacity-50 pt-8 border-t">
            © 2026 {customization.shopName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

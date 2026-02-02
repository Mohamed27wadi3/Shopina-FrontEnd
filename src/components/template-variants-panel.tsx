import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import {
  Palette,
  Type,
  Layout,
  Layers,
  Sparkles,
  GripVertical,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import type { TemplateConfig, LayoutVariant } from '../types/template-extended';

const getFontClass = (fontName: string) =>
  fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('playfair')
    ? 'font-serif'
    : 'font-sans';

interface TemplateVariantsPanelProps {
  template: TemplateConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomize: (templateId: string) => void;
}

interface DraggableSectionProps {
  section: any;
  onToggle: (id: string) => void;
}

function DraggableSection({ section, onToggle }: DraggableSectionProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
      <div className="flex items-center gap-3">
        <GripVertical className="size-4 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-900">{section.name}</p>
          <p className="text-xs text-gray-500 capitalize">{section.type}</p>
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onToggle(section.id)}
        className="size-8"
      >
        {section.enabled ? (
          <Eye className="size-4 text-blue-600" />
        ) : (
          <EyeOff className="size-4 text-gray-400" />
        )}
      </Button>
    </div>
  );
}

export function TemplateVariantsPanel({ template, open, onOpenChange, onCustomize }: TemplateVariantsPanelProps) {
  const [selectedPalette, setSelectedPalette] = useState(template.defaultColorPalette);
  const [selectedTypography, setSelectedTypography] = useState(template.defaultTypography);
  const [selectedLayout, setSelectedLayout] = useState<LayoutVariant>(template.defaultLayout);
  const [sections, setSections] = useState(template.sections);
  const [visualStyle, setVisualStyle] = useState(template.visualStyle);
  const [interactions, setInteractions] = useState(template.interactions);

  const toggleSection = (id: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const selectedPaletteData = template.colorPalettes.find((p) => p.id === selectedPalette);
  const selectedTypographyData = template.typographyStyles.find((t) => t.id === selectedTypography);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="size-6 text-blue-600" />
            {template.name} Variants
          </SheetTitle>
          <SheetDescription>
            Explore different styles and configurations for this template
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">
              <Palette className="size-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="size-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="size-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="sections">
              <Layers className="size-4 mr-2" />
              Sections
            </TabsTrigger>
          </TabsList>

          {/* Color Palettes */}
          <TabsContent value="colors" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Color Palettes</h3>
              <RadioGroup value={selectedPalette} onValueChange={setSelectedPalette}>
                <div className="space-y-3">
                  {template.colorPalettes.map((palette) => (
                    <div
                      key={palette.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPalette === palette.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPalette(palette.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={palette.id} id={palette.id} />
                          <Label htmlFor={palette.id} className="cursor-pointer font-medium">
                            {palette.name}
                          </Label>
                        </div>
                        {selectedPalette === palette.id && (
                          <Badge className="bg-blue-600">Selected</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {[
                          'bg-blue-600',
                          'bg-purple-600',
                          'bg-sky-500',
                          'bg-gray-100',
                          'bg-gray-900',
                        ].map((swatchClass, index) => (
                          <div key={`${palette.id}-swatch-${index}`} className="flex-1">
                            <div className={`h-12 rounded border border-gray-200 shadow-sm ${swatchClass}`} />
                            <p className="text-xs text-gray-500 mt-1">Color {index + 1}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Typography Styles</h3>
              <RadioGroup value={selectedTypography} onValueChange={setSelectedTypography}>
                <div className="space-y-3">
                  {template.typographyStyles.map((typo) => (
                    <div
                      key={typo.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTypography === typo.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTypography(typo.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={typo.id} id={typo.id} />
                          <Label htmlFor={typo.id} className="cursor-pointer font-medium">
                            {typo.name}
                          </Label>
                        </div>
                        {selectedTypography === typo.id && (
                          <Badge className="bg-blue-600">Selected</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-sm ${getFontClass(typo.headingFont)}`}>
                          Heading Font: {typo.headingFont}
                        </p>
                        <p className={`text-sm text-gray-500 ${getFontClass(typo.bodyFont)}`}>
                          Body Font: {typo.bodyFont}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          {/* Layout */}
          <TabsContent value="layout" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Layout Options</h3>
              <RadioGroup
                value={selectedLayout}
                onValueChange={(value) => setSelectedLayout(value as LayoutVariant)}
              >
                <div className="space-y-3">
                  {template.layoutVariants.map((layout) => (
                    <div
                      key={layout}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedLayout === layout
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedLayout(layout)}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={layout} id={layout} />
                        <Label htmlFor={layout} className="cursor-pointer font-medium capitalize">
                          {layout}
                        </Label>
                        {selectedLayout === layout && (
                          <Badge className="bg-blue-600 ml-auto">Selected</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Visual Style</h3>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Rounded Corners</p>
                  <p className="text-sm text-gray-500">Modern rounded design</p>
                </div>
                <Switch
                  checked={visualStyle.borderRadius > 0}
                  onCheckedChange={(checked) =>
                    setVisualStyle({
                      ...visualStyle,
                      borderRadius: checked ? 12 : 0,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Shadows</p>
                  <p className="text-sm text-gray-500">Add depth with shadows</p>
                </div>
                <Switch
                  checked={visualStyle.shadows}
                  onCheckedChange={(checked) =>
                    setVisualStyle({
                      ...visualStyle,
                      shadows: checked,
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Sections */}
          <TabsContent value="sections" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Page Sections</h3>
              <div className="space-y-3">
                {sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <DraggableSection key={section.id} section={section} onToggle={toggleSection} />
                  ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interactions</h3>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Hover Effects</p>
                  <p className="text-sm text-gray-500">Enable hover animations</p>
                </div>
                <Switch
                  checked={interactions.hoverEffect}
                  onCheckedChange={(checked) =>
                    setInteractions({
                      ...interactions,
                      hoverEffect: checked,
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button
            onClick={() => onCustomize(template.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Customize Template
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
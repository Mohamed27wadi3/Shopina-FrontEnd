import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
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
import { TemplateConfig, LayoutVariant } from '@/types/template';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface TemplateVariantsPanelProps {
  template: TemplateConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomize: (templateId: string) => void;
}

interface DraggableSectionProps {
  section: any;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  onToggle: (id: string) => void;
}

function DraggableSection({ section, index, moveSection, onToggle }: DraggableSectionProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'section',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
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

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const newSections = [...sections];
    const [removed] = newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, removed);
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const selectedPaletteData = template.colorPalettes.find(p => p.id === selectedPalette);
  const selectedTypographyData = template.typographyStyles.find(t => t.id === selectedTypography);

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
                        {Object.entries(palette).slice(2).map(([key, color]) => (
                          <div key={key} className="flex-1">
                            <div
                              className="h-12 rounded border border-gray-200 shadow-sm"
                              style={{ backgroundColor: color as string }}
                            />
                            <p className="text-xs text-gray-500 mt-1 capitalize">{key}</p>
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
                      <div className="flex items-center justify-between mb-3">
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
                      <div className="space-y-2">
                        <div>
                          <p
                            className="text-2xl"
                            style={{
                              fontFamily: typo.headingFont,
                              fontWeight: typo.headingWeight,
                            }}
                          >
                            Heading Preview
                          </p>
                          <p className="text-xs text-gray-500">
                            {typo.headingFont} • Weight: {typo.headingWeight}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: typo.bodyFont,
                              fontWeight: typo.bodyWeight,
                            }}
                          >
                            Body text preview for product descriptions and content.
                          </p>
                          <p className="text-xs text-gray-500">
                            {typo.bodyFont} • Weight: {typo.bodyWeight}
                          </p>
                        </div>
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
              <h3 className="text-lg font-semibold mb-4">Layout Variants</h3>
              <RadioGroup value={selectedLayout} onValueChange={(value) => setSelectedLayout(value as LayoutVariant)}>
                <div className="grid gap-3">
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={layout} id={layout} />
                          <div>
                            <Label htmlFor={layout} className="cursor-pointer font-medium capitalize">
                              {layout.replace('-', ' ')}
                            </Label>
                            <p className="text-sm text-gray-500">
                              {layout === 'grid' && 'Classic grid layout with equal-sized items'}
                              {layout === 'sidebar' && 'Grid with filters sidebar for better navigation'}
                              {layout === 'fullwidth' && 'Full-width layout for maximum impact'}
                            </p>
                          </div>
                        </div>
                        {selectedLayout === layout && (
                          <Badge className="bg-blue-600">Selected</Badge>
                        )}
                      </div>

                      {/* Visual representation */}
                      <div className="mt-3 h-20 bg-gray-100 rounded flex items-center justify-center p-3">
                        {layout === 'grid' && (
                          <div className="grid grid-cols-3 gap-2 w-full h-full">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="bg-white rounded" />
                            ))}
                          </div>
                        )}
                        {layout === 'sidebar' && (
                          <div className="flex gap-2 w-full h-full">
                            <div className="w-1/4 bg-white rounded" />
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded" />
                              ))}
                            </div>
                          </div>
                        )}
                        {layout === 'fullwidth' && (
                          <div className="grid grid-cols-1 gap-2 w-full h-full">
                            {[...Array(2)].map((_, i) => (
                              <div key={i} className="bg-white rounded" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <Separator className="my-6" />

              {/* Visual Style Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Visual Style</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Border Style</Label>
                    <p className="text-sm text-gray-500">
                      {visualStyle.borderRadius > 0 ? 'Rounded corners' : 'Sharp corners'}
                    </p>
                  </div>
                  <Switch
                    checked={visualStyle.borderRadius > 0}
                    onCheckedChange={(checked) =>
                      setVisualStyle({ ...visualStyle, borderRadius: checked ? 12 : 0 })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Drop Shadows</Label>
                    <p className="text-sm text-gray-500">Add depth with shadows</p>
                  </div>
                  <Switch
                    checked={visualStyle.shadows}
                    onCheckedChange={(checked) =>
                      setVisualStyle({ ...visualStyle, shadows: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hover Effects</Label>
                    <p className="text-sm text-gray-500">Interactive product cards</p>
                  </div>
                  <Switch
                    checked={interactions.hoverEffect}
                    onCheckedChange={(checked) =>
                      setInteractions({ ...interactions, hoverEffect: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sections */}
          <TabsContent value="sections" className="space-y-6">
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Section Manager</h3>
                <p className="text-sm text-gray-500">
                  Drag to reorder • Click eye icon to show/hide
                </p>
              </div>

              <DndProvider backend={HTML5Backend}>
                <div className="space-y-2">
                  {sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <DraggableSection
                        key={section.id}
                        section={section}
                        index={index}
                        moveSection={moveSection}
                        onToggle={toggleSection}
                      />
                    ))}
                </div>
              </DndProvider>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>{sections.filter(s => s.enabled).length}</strong> of {sections.length} sections enabled
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Section */}
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold mb-3">Your Configuration</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Color Palette:</span>
              <span className="font-medium">{selectedPaletteData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Typography:</span>
              <span className="font-medium">{selectedTypographyData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Layout:</span>
              <span className="font-medium capitalize">{selectedLayout}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Sections:</span>
              <span className="font-medium">{sections.filter(s => s.enabled).length}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white pt-6 pb-2 mt-6 border-t">
          <Button
            onClick={() => onCustomize(template.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            Customize This Template
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

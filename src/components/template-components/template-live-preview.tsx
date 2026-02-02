import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Tablet, Smartphone, X, ArrowRight } from 'lucide-react';
import { TemplateConfig } from '@/types/template';
import { useState } from 'react';

interface TemplateLivePreviewProps {
  template: TemplateConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomize: (templateId: string) => void;
}

export function TemplateLivePreview({ template, open, onOpenChange, onCustomize }: TemplateLivePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const palette = template.colorPalettes[0];
  const typography = template.typographyStyles[0];

  const getDeviceWidth = () => {
    switch (device) {
      case 'desktop': return 'w-full';
      case 'tablet': return 'w-[768px]';
      case 'mobile': return 'w-[375px]';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">{template.name}</h2>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
            <Badge>{template.category}</Badge>
          </div>

          <div className="flex items-center gap-2">
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

            <Button
              onClick={() => {
                onCustomize(template.id);
                onOpenChange(false);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Customize
              <ArrowRight className="size-4 ml-2" />
            </Button>

            <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className={`mx-auto bg-white shadow-2xl transition-all duration-300 ${getDeviceWidth()}`}>
            <div
              style={{
                fontFamily: typography.bodyFont,
                color: palette.text,
                backgroundColor: palette.background,
              }}
            >
              {/* Mock Header */}
              <header className="border-b" style={{ borderColor: `${palette.primary}20` }}>
                <div className="container mx-auto px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: typography.headingFont,
                          fontWeight: typography.headingWeight,
                          color: palette.primary,
                        }}
                      >
                        {template.name.split(' ')[0]}
                      </div>
                      {device === 'desktop' && (
                        <nav className="flex gap-6 text-sm">
                          <a href="#" className="hover:opacity-70">Shop</a>
                          <a href="#" className="hover:opacity-70">Collections</a>
                          <a href="#" className="hover:opacity-70">About</a>
                        </nav>
                      )}
                    </div>
                    {device === 'desktop' && (
                      <div className="flex gap-4 text-sm">
                        <a href="#" className="hover:opacity-70">Search</a>
                        <a href="#" className="hover:opacity-70">Cart</a>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* Mock Hero Section */}
              {template.sections.find(s => s.type === 'hero' && s.enabled) && (
                <section
                  className="py-16 px-6"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}15, ${palette.secondary}15)`,
                  }}
                >
                  <div className="container mx-auto text-center">
                    <h1
                      className="text-4xl md:text-6xl mb-4"
                      style={{
                        fontFamily: typography.headingFont,
                        fontWeight: typography.headingWeight,
                      }}
                    >
                      New Collection
                    </h1>
                    <p className="text-lg mb-8 opacity-80">
                      Discover our latest arrivals
                    </p>
                    <button
                      className="px-8 py-3 rounded text-white font-medium"
                      style={{
                        backgroundColor: palette.primary,
                        borderRadius: `${template.visualStyle.borderRadius}px`,
                      }}
                    >
                      Shop Now
                    </button>
                  </div>
                </section>
              )}

              {/* Mock Products Grid */}
              {template.sections.find(s => s.type === 'products' && s.enabled) && (
                <section className="py-12 px-6">
                  <div className="container mx-auto">
                    <h2
                      className="text-3xl mb-8"
                      style={{
                        fontFamily: typography.headingFont,
                        fontWeight: typography.headingWeight,
                      }}
                    >
                      Featured Products
                    </h2>

                    <div
                      className={`grid gap-6 ${
                        device === 'mobile'
                          ? 'grid-cols-1'
                          : device === 'tablet'
                          ? 'grid-cols-2'
                          : template.defaultLayout === 'sidebar'
                          ? 'grid-cols-3'
                          : 'grid-cols-4'
                      }`}
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="group cursor-pointer"
                          style={{
                            borderRadius: `${template.visualStyle.borderRadius}px`,
                          }}
                        >
                          <div
                            className="aspect-square bg-gray-100 mb-3 overflow-hidden"
                            style={{
                              borderRadius: `${template.visualStyle.borderRadius}px`,
                              boxShadow: template.visualStyle.shadows ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                            }}
                          >
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                          </div>
                          <h3 className="font-medium mb-1">Product {i}</h3>
                          <p style={{ color: palette.primary }} className="font-semibold">
                            $99.00
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Mock Newsletter */}
              {template.sections.find(s => s.type === 'newsletter' && s.enabled) && (
                <section
                  className="py-12 px-6"
                  style={{ backgroundColor: `${palette.primary}10` }}
                >
                  <div className="container mx-auto text-center max-w-2xl">
                    <h2
                      className="text-2xl mb-4"
                      style={{
                        fontFamily: typography.headingFont,
                        fontWeight: typography.headingWeight,
                      }}
                    >
                      Subscribe to our newsletter
                    </h2>
                    <p className="mb-6 opacity-80">
                      Get the latest updates and exclusive offers
                    </p>
                    <div className="flex gap-2 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="flex-1 px-4 py-2 border rounded"
                        style={{
                          borderRadius: `${template.visualStyle.borderRadius}px`,
                          borderColor: `${palette.primary}40`,
                        }}
                      />
                      <button
                        className="px-6 py-2 text-white font-medium"
                        style={{
                          backgroundColor: palette.primary,
                          borderRadius: `${template.visualStyle.borderRadius}px`,
                        }}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Mock Footer */}
              <footer
                className="py-8 px-6 border-t"
                style={{ borderColor: `${palette.primary}20` }}
              >
                <div className="container mx-auto">
                  <div
                    className={`grid gap-8 ${
                      device === 'mobile' ? 'grid-cols-1' : 'grid-cols-4'
                    }`}
                  >
                    <div>
                      <h3
                        className="font-semibold mb-3"
                        style={{ fontFamily: typography.headingFont }}
                      >
                        About
                      </h3>
                      <ul className="space-y-2 text-sm opacity-70">
                        <li>Our Story</li>
                        <li>Contact</li>
                      </ul>
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-3"
                        style={{ fontFamily: typography.headingFont }}
                      >
                        Shop
                      </h3>
                      <ul className="space-y-2 text-sm opacity-70">
                        <li>All Products</li>
                        <li>Collections</li>
                      </ul>
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-3"
                        style={{ fontFamily: typography.headingFont }}
                      >
                        Help
                      </h3>
                      <ul className="space-y-2 text-sm opacity-70">
                        <li>FAQ</li>
                        <li>Shipping</li>
                      </ul>
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-3"
                        style={{ fontFamily: typography.headingFont }}
                      >
                        Follow Us
                      </h3>
                      <ul className="space-y-2 text-sm opacity-70">
                        <li>Instagram</li>
                        <li>Facebook</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t text-center text-sm opacity-50">
                    © 2026 {template.name}. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

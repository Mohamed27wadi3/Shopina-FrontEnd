import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Eye, 
  Settings2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { templates } from '@/data/templates';
import { TemplateConfig } from '@/types/template';
import { TemplateVariantsPanel } from '@/components/template-variants-panel';
import { TemplateLivePreview } from '@/components/template-live-preview';

interface TemplateGalleryPageProps {
  onCustomizeTemplate: (templateId: string) => void;
}

export function TemplateGalleryPage({ onCustomizeTemplate }: TemplateGalleryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [variantsPanelOpen, setVariantsPanelOpen] = useState(false);
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleViewVariants = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    setVariantsPanelOpen(true);
  };

  const handleLivePreview = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    setLivePreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Choose Your Template</h1>
                <p className="text-sm text-gray-500">Select and customize a professional design for your store</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Templates Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Preview Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleLivePreview(template)}
                    className="bg-white/95 hover:bg-white"
                  >
                    <Eye className="size-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewVariants(template)}
                    className="bg-white/95 hover:bg-white"
                  >
                    <Settings2 className="size-4 mr-2" />
                    Variants
                  </Button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                    {template.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Features Preview */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>{template.colorPalettes.length} Color Palettes</span>
                    <span>•</span>
                    <span>{template.layoutVariants.length} Layouts</span>
                    <span>•</span>
                    <span>{template.sections.filter(s => s.enabled).length} Sections</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewVariants(template)}
                    className="w-full"
                  >
                    <Settings2 className="size-4 mr-2" />
                    View Variants
                  </Button>
                  <Button
                    onClick={() => onCustomizeTemplate(template.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Customize
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 mb-4">
              <Search className="size-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Variants Panel */}
      {selectedTemplate && (
        <TemplateVariantsPanel
          template={selectedTemplate}
          open={variantsPanelOpen}
          onOpenChange={setVariantsPanelOpen}
          onCustomize={onCustomizeTemplate}
        />
      )}

      {/* Live Preview Modal */}
      {selectedTemplate && (
        <TemplateLivePreview
          template={selectedTemplate}
          open={livePreviewOpen}
          onOpenChange={setLivePreviewOpen}
          onCustomize={onCustomizeTemplate}
        />
      )}
    </div>
  );
}

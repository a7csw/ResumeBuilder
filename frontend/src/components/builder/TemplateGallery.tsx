import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TemplatePreview from '@/components/TemplatePreview';
import { TEMPLATES_REGISTRY, findTemplateMeta, basicTemplates, premiumTemplates } from '@/lib/templatesRegistry';
import { ChevronLeft, ChevronRight, Download, Crown, CheckCircle, Sparkles, Palette, Star } from 'lucide-react';

import { useDownloadPdf } from '@/lib/useDownloadPdf';
import { cn } from '@/lib/utils';

interface TemplateGalleryProps {
  resumeData: any;
  mode: 'student' | 'professional' | 'freelancer';
  selectedTemplateId: string;
  selectedColor: string;
  onSelect: (templateId: string, color: string) => void;
}

const TemplateGallery = ({ resumeData, mode, selectedTemplateId, selectedColor, onSelect }: TemplateGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState(selectedTemplateId);
  const [activeColor, setActiveColor] = useState(selectedColor || 'indigo');
  const { downloadPdf, isDownloading } = useDownloadPdf();

  const basicCount = basicTemplates().length;
  const premiumCount = premiumTemplates().length;

  const getColorValue = (colorId: string): string => {
    const colorMap: Record<string, string> = {
      // Basic colors
      navy: '#1e3a8a', charcoal: '#374151', forest: '#065f46',
      slate: '#64748b', zinc: '#71717a', sky: '#0ea5e9',
      blue: '#3b82f6', violet: '#8b5cf6', teal: '#14b8a6',
      mint: '#6ee7b7', lavender: '#c7d2fe', indigo: '#6366f1',
      stone: '#78716c', burgundy: '#991b1b', olive: '#65a30d',
      
      // Premium colors
      emerald: '#10b981', cyan: '#06b6d4', coral: '#ff7875',
      purple: '#a855f7', magenta: '#d946ef', amber: '#f59e0b',
      electric: '#2563eb', matrix: '#22c55e', cyber: '#f97316',
      royal: '#4338ca', gold: '#eab308', fresh: '#34d399',
      ocean: '#0284c7', sunrise: '#fb923c', platinum: '#9ca3af',
      sage: '#84cc16', azure: '#0ea5e9', bronze: '#a3a3a3',
      lime: '#84cc16', neon: '#3b82f6', crimson: '#dc2626',
      turquoise: '#06b6d4', champagne: '#fbbf24', midnight: '#1f2937',
      'rose-gold': '#f59e0b', urban: '#6b7280', sunset: '#f97316',
      flowing: '#0284c7', energy: '#16a34a', passion: '#dc2626',
      palette: '#8b5cf6', canvas: '#f3f4f6', brush: '#111827',
      venture: '#3b82f6', growth: '#16a34a', disrupt: '#f97316',
      investment: '#eab308', market: '#2563eb', trust: '#059669',
      medical: '#2563eb', care: '#16a34a', academic: '#1e3a8a',
      discovery: '#0d9488', knowledge: '#7c3aed', pixel: '#3b82f6',
      code: '#16a34a', cloud: '#8b5cf6'
    };
    return colorMap[colorId] || '#64748b';
  };

  const handleOpenPreview = (id: string) => {
    setActiveTemplateId(id);
    const meta = findTemplateMeta(id);
    setActiveColor(meta?.colors?.[0]?.id || 'indigo');
    setOpen(true);
  };

  const changeTemplate = (dir: 1 | -1) => {
    const templates = TEMPLATES_REGISTRY;
    const idx = templates.findIndex(t => t.id === activeTemplateId);
    const nextIdx = (idx + dir + templates.length) % templates.length;
    const next = templates[nextIdx];
    setActiveTemplateId(next.id);
    setActiveColor(next.colors[0]?.id || 'indigo');
  };

  const handleExport = async () => {
    onSelect(activeTemplateId, activeColor);
    await downloadPdf(resumeData, activeTemplateId);
  };

  // Template Card Component
  const TemplateCard = ({ 
    template, 
    onPreview, 
    isSelected, 
    isPremium = false 
  }: { 
    template: any; 
    onPreview: (id: string) => void; 
    isSelected: boolean; 
    isPremium?: boolean;
  }) => (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative",
      isSelected && "ring-2 ring-primary ring-offset-2",
      isPremium && "border-purple-200 bg-gradient-to-br from-purple-50/50 to-white"
    )}>
      {isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Template Preview Mockup */}
          <div className="w-32 h-40 bg-white rounded border shadow-lg flex flex-col p-3 text-[6px] leading-tight transform group-hover:scale-105 transition-transform">
            <div className="h-2 bg-gradient-to-r from-slate-300 to-slate-400 rounded mb-1"></div>
            <div className="h-1 bg-slate-200 rounded mb-1 w-3/4"></div>
            <div className="h-1 bg-slate-200 rounded mb-3 w-1/2"></div>
            <div className="space-y-1 flex-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={cn(
                  "h-1 bg-slate-200 rounded",
                  i % 3 === 0 && "w-full",
                  i % 3 === 1 && "w-4/5",
                  i % 3 === 2 && "w-3/5"
                )} />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
          <CardDescription className="text-xs">
            Perfect for {template.audience.join(', ')} roles
          </CardDescription>
        </div>
        
        {/* Color Palette */}
        <div className="flex items-center gap-2">
          <Palette className="w-3 h-3 text-muted-foreground" />
          <div className="flex gap-1">
            {template.colors.slice(0, 4).map((color: any) => (
              <div
                key={color.id}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: getColorValue(color.id) }}
                title={color.label}
              />
            ))}
          </div>
        </div>
        
        <Button
          size="sm"
          className="w-full"
          variant={isSelected ? "default" : "outline"}
          onClick={() => onPreview(template.id)}
        >
          {isSelected ? "Selected" : "Preview"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Choose Your Perfect Template
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select from our collection of professionally designed templates. Basic plan includes {basicCount} templates, Premium unlocks all {premiumCount + basicCount} templates.
        </p>
        
        {/* Plan Stats */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              {basicCount} Free Templates
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Crown className="w-3 h-3 mr-1" />
              {premiumCount} Premium Templates
            </Badge>
          </div>
        </div>
      </div>
      
      {/* All Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-semibold">All Templates</h3>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completely Free
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES_REGISTRY.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={handleOpenPreview}
              isSelected={selectedTemplateId === template.id}
            />
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Preview: {findTemplateMeta(activeTemplateId)?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => changeTemplate(-1)} aria-label="Previous template">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => changeTemplate(1)} aria-label="Next template">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
            <div className="lg:col-span-3">
              <ScrollArea className="h-full">
                <div className="border rounded-lg p-6 bg-white">
                  <TemplatePreview 
                    resumeData={resumeData}
                    userType={mode}
                    templateId={activeTemplateId}
                    colorVariant={activeColor}
                    isPreview={false}
                  />
                </div>
              </ScrollArea>
            </div>
            
            <div className="space-y-6">
              {/* Color Selection */}
              <div>
                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Choose Color
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {findTemplateMeta(activeTemplateId)?.colors.map(c => (
                    <button
                      key={c.id}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                        activeColor === c.id ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:border-muted-foreground'
                      )}
                      onClick={() => setActiveColor(c.id)}
                      aria-label={`Color ${c.label}`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: getColorValue(c.id) }}
                      />
                      <span className="text-xs font-medium">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div>📄 Format: A4 Portrait</div>
                <div>📏 Margins: 0.5 inch</div>
                <div>🎯 ATS-Friendly</div>
                <div>📱 No photos required</div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={() => { onSelect(activeTemplateId, activeColor); setOpen(false); }} 
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Use This Template
                </Button>
                <Button 
                  onClick={handleExport} 
                  disabled={isDownloading} 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" /> 
                  {isDownloading ? 'Exporting...' : 'Export PDF'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateGallery;
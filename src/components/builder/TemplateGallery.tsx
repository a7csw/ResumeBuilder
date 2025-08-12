import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import TemplatePreview from '@/components/TemplatePreview';
import { TEMPLATES_REGISTRY, findTemplateMeta, TemplateMeta } from '@/lib/templatesRegistry';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useDownloadPdf } from '@/lib/useDownloadPdf';
import { paymentsDisabled } from '@/lib/flags';

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

  const templates = useMemo(() => {
    // In TEST MODE unlock all; in prod filter by plan later
    return TEMPLATES_REGISTRY;
  }, []);

  const handleOpenPreview = (id: string) => {
    setActiveTemplateId(id);
    const meta = findTemplateMeta(id);
    setActiveColor(meta?.colors?.[0]?.id || 'indigo');
    setOpen(true);
  };
  const changeTemplate = (dir: 1 | -1) => {
    const idx = templates.findIndex(t => t.id === activeTemplateId);
    const nextIdx = (idx + dir + templates.length) % templates.length;
    const next = templates[nextIdx];
    setActiveTemplateId(next.id);
    setActiveColor(next.colors[0]?.id || 'indigo');
  };

  const handleExport = async () => {
    // ensure selection is persisted to parent
    onSelect(activeTemplateId, activeColor);
    await downloadPdf(resumeData, activeTemplateId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pick Template & Color</span>
            <Badge variant="secondary">{templates.length} templates</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                className={`text-left border rounded-lg overflow-hidden hover:shadow-md transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedTemplateId === tpl.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleOpenPreview(tpl.id)}
                aria-label={`Open preview for ${tpl.name}`}
              >
                <div className="aspect-[3/4] bg-card p-2">
                  <div className="w-full h-full scale-75 origin-top-left overflow-hidden rounded">
                    <TemplatePreview resumeData={resumeData} userType={mode} templateId={tpl.id} isPreview />
                  </div>
                </div>
                <div className="p-3 border-t">
                  <div className="font-medium">{tpl.name}</div>
                  <div className="flex gap-2 mt-2">
                    {tpl.colors.slice(0,4).map(c => (
                      <span key={c.id} className="w-4 h-4 rounded-full border" data-color={c.id} />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Preview: {findTemplateMeta(activeTemplateId)?.name}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="border rounded-lg p-4">
                <TemplatePreview 
                  resumeData={resumeData}
                  userType={mode}
                  templateId={activeTemplateId}
                  isPreview={false}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Color</div>
                <div className="flex flex-wrap gap-2">
                  {findTemplateMeta(activeTemplateId)?.colors.map(c => (
                    <button
                      key={c.id}
                      className={`w-8 h-8 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary ${activeColor===c.id? 'ring-2 ring-primary': ''}`}
                      onClick={() => setActiveColor(c.id)}
                      aria-label={`Color ${c.label}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Page: A4 • Margins: 0.5in • No photos
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { onSelect(activeTemplateId, activeColor); setOpen(false); }} variant="secondary">Use This</Button>
                <Button onClick={handleExport} disabled={isDownloading} className="flex items-center gap-2">
                  <Download className="w-4 h-4" /> {isDownloading? 'Exporting...' : 'Export PDF'}
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

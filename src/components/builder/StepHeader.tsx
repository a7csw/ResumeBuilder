import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface StepHeaderProps {
  step: 1 | 2;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
}

const StepHeader = ({ step, onBack, onNext, canNext }: StepHeaderProps) => {
  return (
    <div className="bg-card/60 backdrop-blur border-b">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm ${step===1? 'bg-primary text-primary-foreground':'bg-muted text-muted-foreground'}`}>1</div>
          <span className={`font-medium ${step===1? 'text-foreground':'text-muted-foreground'}`}>Build Resume</span>
          <Separator orientation="vertical" className="mx-4 h-6" />
          <div className={`px-3 py-1 rounded-full text-sm ${step===2? 'bg-primary text-primary-foreground':'bg-muted text-muted-foreground'}`}>2</div>
          <span className={`font-medium ${step===2? 'text-foreground':'text-muted-foreground'}`}>Pick Template & Color</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack} disabled={step===1}>Back</Button>
          <Button onClick={onNext} disabled={!canNext}>{step===1? 'Next' : 'Finish'}</Button>
        </div>
      </div>
    </div>
  );
};

export default StepHeader;

import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface StepHeaderProps {
  step: 1 | 2;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  isLastStep?: boolean;
}

const StepHeader = ({ step, onBack, onNext, canNext, isLastStep = false }: StepHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-background to-primary/5 border-b">
      <div className="container py-6">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Step 1 */}
          <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Fill Your Information</span>
              <span className="text-xs text-muted-foreground">Add your personal details and experience</span>
            </div>
          </div>

          {/* Connector */}
          <div className={`h-px w-12 ${step > 1 ? 'bg-primary' : 'bg-muted'}`} />

          {/* Step 2 */}
          <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Choose Template & Design</span>
              <span className="text-xs text-muted-foreground">Select your perfect template and colors</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Information
            </Button>
          )}
          <Button 
            onClick={onNext} 
            disabled={!canNext}
            className="flex items-center gap-2"
          >
            {step === 1 ? (
              <>
                Continue to Templates
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isLastStep ? 'Save Resume' : 'Save & Continue'}
              </>
            )}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StepHeader;

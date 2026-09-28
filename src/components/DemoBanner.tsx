import { useGuidedDemo } from '@/hooks/use-guided-demo';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export function DemoBanner() {
  const demo = useGuidedDemo();
  if (!demo.active) return null;

  const step = demo.currentStepData;
  const progress = ((demo.currentStep + 1) / demo.totalSteps) * 100;

  return (
    <div className="border-b bg-primary text-white animate-slide-up">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            {demo.currentStep + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate">{step.title}</span>
              {step.route && (
                <span className="hidden sm:flex items-center gap-1 text-xs text-white/70">
                  <MapPin className="h-3 w-3" />
                  {step.route}
                </span>
              )}
            </div>
            <p className="text-xs text-white/80 truncate">{step.description}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={demo.prevStep}
              disabled={demo.currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-white hover:bg-white/20"
              onClick={demo.nextStep}
            >
              {demo.currentStep >= demo.totalSteps - 1 ? 'Concluir' : 'Próximo'}
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={demo.stopDemo}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="mt-2 h-1 bg-white/20" />
      </div>
    </div>
  );
}

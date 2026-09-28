import { AlertTriangle } from 'lucide-react';

interface DisclaimerBannerProps {
  text?: string;
}

export function DisclaimerBanner({
  text = 'Este conteúdo é complementar e não substitui treinamentos oficiais, protocolos institucionais ou orientações técnicas autorizadas.',
}: DisclaimerBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
      <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
      <p className="text-xs text-foreground/80">{text}</p>
    </div>
  );
}

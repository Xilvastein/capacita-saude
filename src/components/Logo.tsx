import { QrCode, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  const subSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative flex items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
          <HeartPulse className={cn(iconSize, 'text-white')} />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-border">
          <QrCode className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-bold tracking-tight text-foreground', textSize)}>
            Capacita<span className="text-primary">Saúde</span>
          </span>
          <span className={cn('mt-0.5 text-muted-foreground', subSize)}>
            Conhecimento acessível no momento certo
          </span>
        </div>
      )}
    </div>
  );
}

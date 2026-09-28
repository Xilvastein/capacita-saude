import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'accent';
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  accent: 'bg-accent text-accent-foreground',
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, color = 'primary' }: StatCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', colorClasses[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <span
              className={cn(
                'text-xs font-medium',
                trendUp ? 'text-success' : 'text-muted-foreground'
              )}
            >
              {trend}
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

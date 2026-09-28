import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QrCode, GraduationCap, BarChart3, Lightbulb, ShieldCheck } from 'lucide-react';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const helpTopics = [
  {
    icon: QrCode,
    title: 'Escaneie QR Codes',
    description: 'Cada equipamento possui um QR Code. Escaneie para acessar o conteúdo diretamente.',
  },
  {
    icon: GraduationCap,
    title: 'Treinamentos',
    description: 'Acesse treinamentos por equipamento, complete o questionário e marque como concluído.',
  },
  {
    icon: BarChart3,
    title: 'Indicadores',
    description: 'Gestores acompanham acessos, conclusões e demandas de capacitação em tempo real.',
  },
  {
    icon: Lightbulb,
    title: 'Necessidades',
    description: 'O sistema identifica padrões e sugere possíveis necessidades de capacitação.',
  },
  {
    icon: ShieldCheck,
    title: 'Conteúdo complementar',
    description: 'Este protótipo não substitui treinamentos oficiais, protocolos ou normas técnicas.',
  },
];

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajuda — CapacitaSaúde</DialogTitle>
          <DialogDescription>
            Guia rápido para navegar na plataforma
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {helpTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div key={topic.title} className="flex gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{topic.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

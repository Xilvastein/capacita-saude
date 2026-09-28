import {
  Info,
  HeartPulse,
  QrCode,
  GraduationCap,
  BarChart3,
  Target,
  Users,
  Building2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

const infoCards = [
  { label: 'Natureza', value: 'Protótipo demonstrativo', icon: Info },
  { label: 'Área', value: 'Inovação social e saúde pública', icon: HeartPulse },
  { label: 'Público-alvo', value: 'Profissionais e gestores de hospitais públicos', icon: Users },
  { label: 'Objetivo', value: 'Apoiar o acesso rápido à informação e à capacitação', icon: Target },
];

const features = [
  { icon: QrCode, title: 'QR Codes nos equipamentos', description: 'Cada equipamento possui um QR Code que direciona ao conteúdo de capacitação.' },
  { icon: GraduationCap, title: 'Conteúdos educativos', description: 'Passo a passo, segurança, erros comuns e questionários de verificação.' },
  { icon: BarChart3, title: 'Indicadores de acompanhamento', description: 'Acessos, conclusões, demandas e necessidades de capacitação.' },
  { icon: ShieldCheck, title: 'Responsabilidade', description: 'Conteúdo complementar que não substitui protocolos oficiais ou normas técnicas.' },
];

export function AboutPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Sobre o Projeto"
        description="Conheça o CapacitaSaúde e sua proposta de impacto social."
        icon={<Info className="h-5 w-5 text-primary" />}
      />

      {/* Hero */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Logo size="lg" showText={false} />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Capacita<span className="text-primary">Saúde</span>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Conhecimento acessível no momento certo.</p>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Protótipo de plataforma digital para apoio à capacitação operacional de profissionais da saúde pública,
              utilizando QR Codes, conteúdos educativos e indicadores de acompanhamento.
            </p>
            <p className="max-w-2xl text-sm font-medium italic text-primary">
              "Transformamos equipamentos hospitalares em pontos de aprendizagem acessíveis no próprio ambiente de trabalho."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {infoCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-sm font-semibold mt-0.5">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Principais características</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{f.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stack & architecture */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stack tecnológica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Lucide Icons', 'Recharts', 'React Router', 'qrcode.react', 'LocalStorage'].map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              A aplicação funciona localmente após instalação das dependências, sem banco de dados externo, API ou internet para a lógica principal.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Integração futura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Supabase', 'APIs hospitalares', 'Sistemas de gestão', 'Armazenamento de vídeos', 'Autenticação real', 'Banco de dados', 'Gestão de treinamentos'].map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              O código está estruturado para permitir integração futura com sistemas hospitalares e plataformas de gestão de treinamentos.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="mb-6 border-warning/30 bg-warning/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-warning mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Aviso importante</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Protótipo demonstrativo — não utilizar em ambiente de produção sem validação.</li>
                <li>• Não utiliza dados pessoais reais. Funcionários são anonimizados (FUNC-001, FUNC-002...).</li>
                <li>• Não utiliza nomes reais de hospitais, instituições ou fabricantes sem autorização.</li>
                <li>• Conteúdo complementar — não substitui treinamentos oficiais, protocolos ou normas técnicas.</li>
                <li>• Não afirma redução de erros ou acidentes. Utiliza "pode contribuir", "tem potencial", "apoia a melhoria".</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <h3 className="text-lg font-semibold">Explore o CapacitaSaúde</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Inicie a demonstração guiada para percorrer a solução completa, ou navegue livremente pelas telas.
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/dashboard">Ver indicadores</Link>
          </Button>
          <Button asChild variant="outline" className="gap-1.5">
            <Link to="/equipamentos">
              Catálogo de equipamentos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

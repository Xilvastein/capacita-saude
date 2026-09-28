import {
  Workflow,
  Search,
  Database,
  FileText,
  QrCode,
  Smartphone,
  ClipboardCheck,
  BarChart3,
  Lightbulb,
  Eye,
  RefreshCw,
  ShieldCheck,
  Lock,
  Accessibility,
  ScanLine,
  GraduationCap,
  Users,
  Ban,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  { icon: Search, title: 'Identificação da dor', description: 'Mapeamento das dificuldades operacionais dos profissionais em hospitais públicos: rotatividade, esquecimento de etapas e falta de acesso rápido a manuais.' },
  { icon: Database, title: 'Cadastro dos equipamentos', description: 'Registro dos equipamentos hospitalares no sistema com identificação, setor, categoria e responsável.' },
  { icon: FileText, title: 'Produção dos conteúdos', description: 'Criação de conteúdos educativos: descrição, finalidade, passo a passo, segurança, erros comuns e questionário.' },
  { icon: QrCode, title: 'Associação dos QR Codes', description: 'Cada equipamento recebe um QR Code único que direciona o funcionário diretamente à página de capacitação.' },
  { icon: Smartphone, title: 'Acesso pelos funcionários', description: 'O profissional escaneia o QR Code com seu celular no próprio ambiente de trabalho, acessando o conteúdo na hora.' },
  { icon: ClipboardCheck, title: 'Registro dos treinamentos', description: 'O sistema registra acessos, respostas aos questionários e conclusões de treinamentos localmente.' },
  { icon: BarChart3, title: 'Análise dos indicadores', description: 'Indicadores de acessos, conclusões, demandas por setor e equipamentos mais consultados são calculados.' },
  { icon: Lightbulb, title: 'Identificação de necessidades', description: 'Padrões observados geram possíveis necessidades de capacitação para avaliação humana.' },
  { icon: Eye, title: 'Revisão humana', description: 'Gestores avaliam as necessidades identificadas e decidem sobre ações de capacitação complementares.' },
  { icon: RefreshCw, title: 'Atualização contínua', description: 'Conteúdos são revisados e atualizados periodicamente, garantindo a relevância das informações.' },
];

const principles = [
  { icon: ShieldCheck, title: 'Segurança', description: 'Prioriza a segurança dos trabalhadores e pacientes em todas as orientações.' },
  { icon: Lock, title: 'Privacidade', description: 'Não utiliza dados pessoais reais. Funcionários são anonimizados (FUNC-001, FUNC-002...).' },
  { icon: Accessibility, title: 'Acessibilidade', description: 'Conteúdos acessíveis por celular, com QR Code, no momento e local da necessidade.' },
  { icon: ScanLine, title: 'Transparência', description: 'Todos os dados são identificados como simulados. Nenhum resultado fictício é apresentado como real.' },
  { icon: GraduationCap, title: 'Capacitação contínua', description: 'Apoia o aprendizado contínuo, não substituindo treinamentos oficiais.' },
  { icon: Users, title: 'Supervisão humana', description: 'Necessidades identificadas são indícios para avaliação humana, não decisões automatizadas.' },
  { icon: Ban, title: 'Não substituição de protocolos', description: 'Conteúdo complementar. Não substitui normas técnicas, protocolos ou orientações de fabricantes.' },
];

export function MethodologyPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Metodologia"
        description="Como o CapacitaSaúde funciona: do problema à atualização contínua."
        icon={<Workflow className="h-5 w-5 text-primary" />}
      />

      {/* Flow steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Fluxo da solução</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-4 border-l-2 border-primary/20 pl-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={i} className="relative">
                  <div className="absolute -left-[31px] flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Principles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Princípios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <Icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{p.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

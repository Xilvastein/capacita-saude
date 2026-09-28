import { useMemo } from 'react';
import {
  BarChart3,
  Eye,
  Clock,
  CheckCircle2,
  Microscope,
  GraduationCap,
  Users,
  FileText,
  Building2,
  Lightbulb,
  Heart,
  ShieldCheck,
  TrendingUp,
  Scale,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getDashboardStats,
  getAccessesOverTime,
  getMostConsultedEquipments,
  getSectorsDemand,
  getAverageAccessDuration,
  getOutdatedContents,
  getCapacityNeeds,
} from '@/services/analytics';
import { getEquipments, getTrainings, getEmployees } from '@/services/storage';

const PIE_COLORS = ['hsl(154 46% 34%)', 'hsl(156 48% 24%)', 'hsl(142 38% 48%)', 'hsl(147 28% 55%)', 'hsl(38 75% 48%)', 'hsl(150 20% 50%)', 'hsl(160 25% 45%)', 'hsl(35 50% 48%)'];

const impactPoints = [
  {
    icon: Heart,
    title: 'Acesso mais democrático à capacitação',
    description: 'Disponibiliza conhecimento no momento e local da necessidade, independentemente de treinamentos presenciais agendados.',
  },
  {
    icon: ShieldCheck,
    title: 'Apoio à segurança dos trabalhadores',
    description: 'Cuidados e orientações de segurança acessíveis diretamente no equipamento, podendo contribuir para a redução de riscos ocupacionais.',
  },
  {
    icon: Scale,
    title: 'Melhoria da padronização',
    description: 'Instruções padronizadas e sempre disponíveis apoiam a uniformização de procedimentos operacionais.',
  },
  {
    icon: TrendingDown,
    title: 'Redução potencial de dúvidas recorrentes',
    description: 'Acesso rápido a informações pode reduzir a dependência de colegas para dúvidas simples e frequentes.',
  },
  {
    icon: Sparkles,
    title: 'Fortalecimento da eficiência da saúde pública',
    description: 'Indiretamente, apoia a qualidade e eficiência do atendimento à população ao fortalecer a capacitação dos profissionais.',
  },
];

export function IndicatorsPage() {
  const stats = useMemo(() => getDashboardStats(), []);
  const accessesData = useMemo(() => getAccessesOverTime(30), []);
  const consultedEquipments = useMemo(() => getMostConsultedEquipments(), []);
  const sectorDemand = useMemo(() => getSectorsDemand(), []);
  const avgDuration = useMemo(() => getAverageAccessDuration(), []);
  const outdated = useMemo(() => getOutdatedContents(), []);
  const needs = useMemo(() => getCapacityNeeds(), []);
  const equipments = useMemo(() => getEquipments(), []);
  const trainings = useMemo(() => getTrainings(), []);
  const employees = useMemo(() => getEmployees(), []);

  const updatedCount = equipments.filter((e) => e.status === 'atualizado').length;
  const avgDurationMin = Math.round(avgDuration / 60);
  const trainedEmployees = employees.filter((e) => e.trainingsCompleted > 0).length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Indicadores de Impacto"
        description="Indicadores que poderiam ser utilizados em uma implementação real, calculados a partir dos dados simulados."
        icon={<BarChart3 className="h-5 w-5 text-primary" />}
      />

      <div className="mb-4">
        <Badge variant="secondary" className="text-xs">Dados simulados para demonstração</Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Consultas aos conteúdos" value={stats.totalAccesses} icon={Eye} color="primary" />
        <StatCard label="Tempo médio de acesso" value={`${avgDurationMin} min`} icon={Clock} color="accent" />
        <StatCard label="Taxa de conclusão" value={`${stats.completionRate}%`} icon={CheckCircle2} color="success" />
        <StatCard label="Equipamentos com demanda" value={consultedEquipments.filter((e) => e.consultas > 0).length} icon={Microscope} color="primary" />
        <StatCard label="Treinamentos disponíveis" value={trainings.length} icon={GraduationCap} color="accent" />
        <StatCard label="Funcionários capacitados" value={trainedEmployees} icon={Users} color="success" />
        <StatCard label="Conteúdos atualizados" value={updatedCount} icon={FileText} color="primary" />
        <StatCard label="Setores atendidos" value={sectorDemand.length} icon={Building2} color="accent" />
        <StatCard label="Necessidades identificadas" value={needs.length} icon={Lightbulb} color="warning" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Evolução das consultas aos conteúdos (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={accessesData}>
                <defs>
                  <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 38% 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142 38% 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={4} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <RTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="acessos" stroke="hsl(142 38% 48%)" strokeWidth={2} fill="url(#colorInd)" name="Consultas" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Equipamentos com maior demanda</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={consultedEquipments} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={130} />
                <RTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="consultas" fill="hsl(154 46% 34%)" radius={[0, 4, 4, 0]} name="Consultas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demanda por setor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={sectorDemand} dataKey="acessos" nameKey="sector" cx="50%" cy="50%" outerRadius={85} innerRadius={35} paddingAngle={2}>
                  {sectorDemand.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} formatter={(v) => (v.length > 22 ? v.substring(0, 22) + '…' : v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Impacto social esperado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {impactPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{point.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{point.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-warning mt-0.5" />
            <p className="text-xs text-foreground/80">
              <strong>Importante:</strong> Os indicadores apresentados são derivados de dados simulados para demonstração.
              Em uma implementação real, os indicadores seriam coletados a partir do uso efetivo da plataforma.
              A plataforma não garante redução de erros ou acidentes — pode contribuir, apoia a melhoria e tem potencial para reduzir dificuldades operacionais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { LayoutDashboard, Microscope, GraduationCap, Users, CheckCircle2, Clock, Eye, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getDashboardStats,
  getAccessesOverTime,
  getMostConsultedTrainings,
  getTrainingsBySector,
  getCompletionEvolution,
  getMostConsultedEquipments,
  getSectorsDemand,
} from '@/services/analytics';

const PIE_COLORS = ['hsl(154 46% 34%)', 'hsl(156 48% 24%)', 'hsl(142 38% 48%)', 'hsl(147 28% 55%)', 'hsl(38 75% 48%)', 'hsl(150 20% 50%)', 'hsl(160 25% 45%)', 'hsl(35 50% 48%)'];

export function DashboardPage() {
  const stats = useMemo(() => getDashboardStats(), []);
  const accessesData = useMemo(() => getAccessesOverTime(30), []);
  const consultedTrainings = useMemo(() => getMostConsultedTrainings(), []);
  const sectorData = useMemo(() => getTrainingsBySector(), []);
  const evolutionData = useMemo(() => getCompletionEvolution(), []);
  const consultedEquipments = useMemo(() => getMostConsultedEquipments(), []);
  const sectorDemand = useMemo(() => getSectorsDemand(), []);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Visão Geral"
        description="Dashboard executivo com indicadores calculados a partir dos dados simulados."
        icon={<LayoutDashboard className="h-5 w-5 text-primary" />}
      />

      <div className="mb-3 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Dados simulados para demonstração</Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Equipamentos cadastrados" value={stats.totalEquipments} icon={Microscope} color="primary" />
        <StatCard label="Treinamentos disponíveis" value={stats.totalTrainings} icon={GraduationCap} color="accent" />
        <StatCard label="Funcionários cadastrados" value={stats.totalEmployees} icon={Users} color="primary" />
        <StatCard label="Acessos aos conteúdos" value={stats.totalAccesses} icon={Eye} color="accent" />
        <StatCard label="Treinamentos concluídos" value={stats.completedTrainings} icon={CheckCircle2} color="success" />
        <StatCard label="Treinamentos pendentes" value={stats.pendingTrainings} icon={Clock} color="warning" />
        <StatCard label="Taxa de conclusão" value={`${stats.completionRate}%`} icon={TrendingUp} color="success" />
        <StatCard label="Setores atendidos" value={sectorDemand.length} icon={LayoutDashboard} color="primary" />
      </div>

      {/* Charts grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Accesses over time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Acessos aos treinamentos ao longo dos dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={accessesData}>
                <defs>
                  <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(154 46% 34%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(154 46% 34%)" stopOpacity={0} />
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
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="acessos"
                  stroke="hsl(154 46% 34%)"
                  strokeWidth={2}
                  fill="url(#colorAcessos)"
                  name="Acessos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most consulted trainings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Treinamentos mais consultados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={consultedTrainings} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={130}
                />
                <RTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="acessos" fill="hsl(156 48% 24%)" radius={[0, 4, 4, 0]} name="Acessos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trainings by sector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição de treinamentos por setor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={sectorData}
                  dataKey="treinamentos"
                  nameKey="sector"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {sectorData.map((_, i) => (
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
                <Legend
                  wrapperStyle={{ fontSize: '10px' }}
                  formatter={(value) => (value.length > 22 ? value.substring(0, 22) + '…' : value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução das capacitações</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <RTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="iniciados" stroke="hsl(147 28% 55%)" strokeWidth={2} name="Iniciados" />
                <Line type="monotone" dataKey="concluidos" stroke="hsl(142 38% 48%)" strokeWidth={2} name="Concluídos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most consulted equipments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Equipamentos com maior número de consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={consultedEquipments} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={130}
                />
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
      </div>

      {/* Sectors demand table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Setores com maior demanda de capacitação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sectorDemand.map((s, i) => (
              <div key={s.sector} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <span className="flex-1 text-sm font-medium">{s.sector}</span>
                <Badge variant="secondary">{s.acessos} acessos</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

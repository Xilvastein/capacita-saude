import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircle,
  GraduationCap,
  Clock,
  CheckCircle2,
  QrCode,
  History,
  Lightbulb,
  ArrowRight,
  Microscope,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/EmptyState';
import { useApp } from '@/hooks/use-app';
import {
  getTrainings,
  getEquipments,
  getCompletedTrainings,
} from '@/services/storage';
import {
  getRecommendedTrainings,
  getLastAccessedEquipments,
  getEmployeeHistory,
  getEmployeeTrainings,
} from '@/services/analytics';

export function EmployeeAreaPage() {
  const { user } = useApp();
  const navigate = useNavigate();

  // Use a demo employee code for the funcionário
  const employeeCode = 'FUNC-001';
  const allTrainings = useMemo(() => getTrainings(), []);
  const allEquipments = useMemo(() => getEquipments(), []);
  const completedIds = useMemo(() => new Set(getCompletedTrainings()), []);
  const recommended = useMemo(() => getRecommendedTrainings(employeeCode), []);
  const lastAccessed = useMemo(() => getLastAccessedEquipments(employeeCode, 5), []);
  const history = useMemo(() => getEmployeeHistory(employeeCode).slice(0, 8), []);
  const myRecords = useMemo(() => getEmployeeTrainings(employeeCode), []);

  const completedCount = allTrainings.filter((t) => completedIds.has(t.id)).length;
  const pendingCount = allTrainings.length - completedCount;
  const inProgressCount = myRecords.filter((r) => r.status === 'em_andamento').length;

  const eqMap = useMemo(() => Object.fromEntries(allEquipments.map((e) => [e.id, e])), [allEquipments]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Minha Área"
        description={`Bem-vindo(a), ${user?.name || 'Funcionário'}. Acompanhe seus treinamentos e capacitações.`}
        icon={<UserCircle className="h-5 w-5 text-primary" />}
        actions={
          <Button onClick={() => navigate('/qr-code')} className="gap-1.5">
            <QrCode className="h-4 w-4" />
            Acessar por QR Code
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Treinamentos disponíveis" value={allTrainings.length} icon={GraduationCap} color="primary" />
        <StatCard label="Concluídos" value={completedCount} icon={CheckCircle2} color="success" />
        <StatCard label="Pendentes" value={pendingCount} icon={Clock} color="warning" />
        <StatCard label="Em andamento" value={inProgressCount} icon={TrendingUp} color="accent" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Pending trainings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Treinamentos pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {allTrainings.filter((t) => !completedIds.has(t.id)).slice(0, 5).map((tr) => {
              const eq = eqMap[tr.equipmentId];
              return (
                <div key={tr.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tr.title}</p>
                    <p className="text-xs text-muted-foreground">{tr.durationMin} min · {tr.sector}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/treinamentos/${tr.id}`}>Acessar</Link>
                  </Button>
                </div>
              );
            })}
            {pendingCount === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhum treinamento pendente.</p>
            )}
          </CardContent>
        </Card>

        {/* Completed trainings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Treinamentos concluídos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {allTrainings.filter((t) => completedIds.has(t.id)).map((tr) => {
              const eq = eqMap[tr.equipmentId];
              return (
                <div key={tr.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tr.title}</p>
                    <p className="text-xs text-muted-foreground">{tr.sector}</p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/treinamentos/${tr.id}`}>Revisar</Link>
                  </Button>
                </div>
              );
            })}
            {completedCount === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Você ainda não concluiu nenhum treinamento.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Last accessed equipments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Microscope className="h-5 w-5 text-primary" />
              Últimos conteúdos acessados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lastAccessed.length > 0 ? (
              lastAccessed.map((eq) => (
                <div key={eq.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Microscope className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{eq.name}</p>
                    <p className="text-xs text-muted-foreground">{eq.code} · {eq.sector}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/equipamentos/${eq.id}`}>Ver</Link>
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Microscope}
                title="Nenhum acesso registrado"
                description="Seus conteúdos acessados aparecerão aqui."
              />
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Recomendações de capacitação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommended.map((tr) => (
              <div key={tr.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                  <Lightbulb className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tr.title}</p>
                  <p className="text-xs text-muted-foreground">{tr.durationMin} min · {tr.difficulty}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/treinamentos/${tr.id}`}>Iniciar</Link>
                </Button>
              </div>
            ))}
            {recommended.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Você concluiu todos os treinamentos disponíveis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personal history */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Histórico pessoal de acessos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin">
              {history.map((log) => {
                const eq = eqMap[log.equipmentId];
                return (
                  <div key={log.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Microscope className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{eq?.name || log.equipmentId}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.date).toLocaleDateString('pt-BR')} · {Math.round(log.durationSec / 60)} min
                      </p>
                    </div>
                    {log.completedQuestionnaire ? (
                      <Badge className="bg-success/10 text-success border-success/30 text-xs">Concluído</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Acesso</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="Sem histórico de acessos"
              description="Seus acessos a conteúdos aparecerão aqui."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

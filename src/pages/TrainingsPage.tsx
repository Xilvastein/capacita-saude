import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  Building2,
  ArrowRight,
  CheckCircle2,
  Loader,
  Circle,
  TrendingUp,
  Calendar,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { getTrainings, getEquipments, getTrainingRecords, getCompletedTrainings } from '@/services/storage';
import type { Training, TrainingStatus, Difficulty } from '@/types';

const difficultyConfig: Record<Difficulty, { label: string; class: string }> = {
  basico: { label: 'Básico', class: 'bg-success/10 text-success border-success/30' },
  intermediario: { label: 'Intermediário', class: 'bg-primary/10 text-primary border-primary/30' },
  avancado: { label: 'Avançado', class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export function TrainingsPage() {
  const trainings = useMemo(() => getTrainings(), []);
  const equipments = useMemo(() => getEquipments(), []);
  const records = useMemo(() => getTrainingRecords(), []);
  const completedIds = useMemo(() => new Set(getCompletedTrainings()), []);

  const eqMap = useMemo(() => Object.fromEntries(equipments.map((e) => [e.id, e])), [equipments]);

  const [filter, setFilter] = useState<string>('todos');

  // Compute per-training status from records
  const trainingStatusMap = useMemo(() => {
    const map: Record<string, { status: TrainingStatus; progress: number; totalStarted: number; totalCompleted: number }> = {};
    for (const tr of trainings) {
      const trRecords = records.filter((r) => r.trainingId === tr.id);
      const completed = trRecords.filter((r) => r.status === 'concluido').length;
      const inProgress = trRecords.filter((r) => r.status === 'em_andamento').length;
      const pending = trRecords.filter((r) => r.status === 'pendente').length;
      let status: TrainingStatus = 'pendente';
      if (completedIds.has(tr.id)) status = 'concluido';
      else if (inProgress > 0) status = 'em_andamento';
      else if (pending > 0) status = 'pendente';
      const avgProgress = trRecords.length > 0
        ? Math.round(trRecords.reduce((s, r) => s + r.progress, 0) / trRecords.length)
        : 0;
      map[tr.id] = { status, progress: avgProgress, totalStarted: trRecords.length, totalCompleted: completed };
    }
    return map;
  }, [trainings, records, completedIds]);

  const filteredTrainings = useMemo(() => {
    switch (filter) {
      case 'concluidos':
        return trainings.filter((tr) => completedIds.has(tr.id));
      case 'pendentes':
        return trainings.filter((tr) => !completedIds.has(tr.id) && trainingStatusMap[tr.id]?.status === 'pendente');
      case 'andamento':
        return trainings.filter((tr) => trainingStatusMap[tr.id]?.status === 'em_andamento');
      case 'recomendados':
        return trainings.filter((tr) => !completedIds.has(tr.id)).slice(0, 4);
      case 'recentes':
        return [...trainings].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
      default:
        return trainings;
    }
  }, [trainings, filter, completedIds, trainingStatusMap]);

  const statusIcon = (status: TrainingStatus) => {
    if (status === 'concluido') return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (status === 'em_andamento') return <Loader className="h-4 w-4 text-primary" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const statusLabel = (status: TrainingStatus) => {
    if (status === 'concluido') return 'Concluído';
    if (status === 'em_andamento') return 'Em andamento';
    return 'Pendente';
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Treinamentos"
        description="Capacitações operacionais disponíveis para os equipamentos hospitalares."
        icon={<GraduationCap className="h-5 w-5 text-primary" />}
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <div className="overflow-x-auto scrollbar-thin mb-4">
          <TabsList className="flex w-max h-auto">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="andamento">Em andamento</TabsTrigger>
            <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="recomendados">Recomendados</TabsTrigger>
            <TabsTrigger value="recentes">Atualizados recentemente</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={filter}>
          {filteredTrainings.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="Nenhum treinamento encontrado"
              description="Não há treinamentos nesta categoria no momento."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTrainings.map((tr) => {
                const eq = eqMap[tr.equipmentId];
                const stMap = trainingStatusMap[tr.id];
                const diff = difficultyConfig[tr.difficulty];
                return (
                  <Card key={tr.id} className="group flex flex-col transition-all hover:shadow-lg hover:border-primary/30">
                    <CardContent className="p-5 flex flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <Badge className={`border ${diff.class}`}>{diff.label}</Badge>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold leading-snug">{tr.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tr.description}</p>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{tr.sector}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{tr.durationMin} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Atualizado em {new Date(tr.updatedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      {stMap && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              {statusIcon(stMap.status)}
                              {statusLabel(stMap.status)}
                            </span>
                            <span className="text-muted-foreground">{stMap.progress}%</span>
                          </div>
                          <Progress value={stMap.progress} className="h-1.5" />
                        </div>
                      )}

                      <div className="mt-auto flex items-center gap-2 pt-1">
                        <Button asChild size="sm" className="flex-1 gap-1.5">
                          <Link to={`/treinamentos/${tr.id}`}>
                            Acessar
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        {eq && (
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/equipamentos/${eq.id}`}>Equipamento</Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

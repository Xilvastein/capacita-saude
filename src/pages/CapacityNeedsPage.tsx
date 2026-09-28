import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Clock,
  Building2,
  ArrowRight,
  CheckCircle2,
  Filter,
  FileSearch,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { getCapacityNeeds } from '@/services/analytics';
import type { CapacityNeed } from '@/types';

const typeConfig: Record<CapacityNeed['type'], { icon: typeof TrendingUp; label: string }> = {
  alta_procura: { icon: TrendingUp, label: 'Alta procura' },
  baixa_conclusao: { icon: AlertTriangle, label: 'Baixa conclusão' },
  conteudo_desatualizado: { icon: Clock, label: 'Conteúdo desatualizado' },
  setor_alta_demanda: { icon: Building2, label: 'Setor com alta demanda' },
};

const severityConfig: Record<CapacityNeed['severity'], { label: string; class: string }> = {
  alta: { label: 'Alta prioridade', class: 'bg-destructive/10 text-destructive border-destructive/30' },
  media: { label: 'Média prioridade', class: 'bg-warning/10 text-warning border-warning/30' },
  baixa: { label: 'Baixa prioridade', class: 'bg-primary/10 text-primary border-primary/30' },
};

export function CapacityNeedsPage() {
  const needs = useMemo(() => getCapacityNeeds(), []);
  const [filter, setFilter] = useState<string>('todas');
  const [resolved, setResolved] = useState<Set<string>>(new Set());

  const filteredNeeds = useMemo(() => {
    if (filter === 'todas') return needs;
    return needs.filter((n) => n.type === filter);
  }, [needs, filter]);

  const activeNeeds = filteredNeeds.filter((n) => !resolved.has(n.id));
  const resolvedCount = needs.length - activeNeeds.length;

  const filterOptions = [
    { value: 'todas', label: 'Todas' },
    { value: 'alta_procura', label: 'Alta procura' },
    { value: 'baixa_conclusao', label: 'Baixa conclusão' },
    { value: 'conteudo_desatualizado', label: 'Conteúdo desatualizado' },
    { value: 'setor_alta_demanda', label: 'Setor com alta demanda' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Necessidades de Capacitação"
        description="Padrões observados nos dados simulados que podem indicar necessidades de capacitação. Requer avaliação humana."
        icon={<Lightbulb className="h-5 w-5 text-primary" />}
      />

      <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
        <p className="text-xs text-foreground/80">
          As necessidades abaixo são geradas a partir de padrões observados na demonstração.
          O sistema não identifica falhas reais — são indícios que recomendam avaliação humana.
          Termos como "possível necessidade", "indício" e "padrão observado" são utilizados intencionalmente.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{needs.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total identificadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{activeNeeds.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Aguardando avaliação</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{needs.filter((n) => n.severity === 'alta').length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Alta prioridade</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all ${
              filter === opt.value
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Needs list */}
      {activeNeeds.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Nenhuma necessidade pendente"
          description="Todas as necessidades identificadas foram avaliadas. Continue acompanhando os indicadores."
        />
      ) : (
        <div className="space-y-4">
          {activeNeeds.map((need) => {
            const typeCfg = typeConfig[need.type];
            const sevCfg = severityConfig[need.severity];
            const Icon = typeCfg.icon;

            return (
              <Card key={need.id} className="transition-all hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{need.title}</h3>
                        <Badge className={`border ${sevCfg.class}`}>{sevCfg.label}</Badge>
                        <Badge variant="outline">{typeCfg.label}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{need.description}</p>

                      {/* Recommendation */}
                      <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <Lightbulb className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-primary">Recomendação para avaliação humana</p>
                          <p className="text-xs text-foreground/80 mt-0.5">{need.recommendation}</p>
                        </div>
                      </div>

                      {/* Evidence */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <FileSearch className="h-3.5 w-3.5" />
                          Evidências utilizadas (padrão observado na demonstração)
                        </p>
                        <ul className="space-y-1 ml-5">
                          {need.evidence.map((ev, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                              {ev}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {need.relatedEquipmentId && (
                          <Button asChild size="sm" variant="outline" className="gap-1.5">
                            <Link to={`/equipamentos/${need.relatedEquipmentId}`}>
                              Ver equipamento
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5"
                          onClick={() => {
                            setResolved(new Set([...resolved, need.id]));
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Marcar como avaliada
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

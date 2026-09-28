import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowLeft,
  Clock,
  Building2,
  Target,
  PlayCircle,
  ListChecks,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Video,
} from 'lucide-react';
import { AutoclaveTrainingVideo } from '@/components/AutoclaveTrainingVideo';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { getTrainings, getEquipmentById, isTrainingCompleted, markTrainingCompleted } from '@/services/storage';
import { toast } from 'sonner';
import type { Difficulty } from '@/types';

const difficultyConfig: Record<Difficulty, { label: string; class: string }> = {
  basico: { label: 'Básico', class: 'bg-success/10 text-success border-success/30' },
  intermediario: { label: 'Intermediário', class: 'bg-primary/10 text-primary border-primary/30' },
  avancado: { label: 'Avançado', class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trainings = useMemo(() => getTrainings(), []);
  const training = useMemo(() => trainings.find((t) => t.id === id), [trainings, id]);
  const equipment = useMemo(() => (training ? getEquipmentById(training.equipmentId) : undefined), [training]);
  const [completed, setCompleted] = useState(id ? isTrainingCompleted(id) : false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [activeSection, setActiveSection] = useState('introducao');

  const handleVideoComplete = useCallback(() => {
    setVideoCompleted(true);
  }, []);

  if (!training) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GraduationCap className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Treinamento não encontrado</h2>
        <Button asChild className="mt-4">
          <Link to="/treinamentos">Voltar aos treinamentos</Link>
        </Button>
      </div>
    );
  }

  const diff = difficultyConfig[training.difficulty];

  const handleComplete = () => {
    markTrainingCompleted(training.id);
    setCompleted(true);
    toast.success('Treinamento concluído!', {
      description: 'Seu registro foi salvo localmente.',
    });
  };

  const sections = [
    { id: 'introducao', label: 'Introdução', icon: BookOpen },
    { id: 'objetivos', label: 'Objetivos', icon: Target },
    { id: 'conteudo', label: 'Conteúdo', icon: BookOpen },
    { id: 'video', label: 'Vídeo', icon: PlayCircle },
    { id: 'passo-a-passo', label: 'Passo a passo', icon: ListChecks },
    { id: 'questionario', label: 'Questionário', icon: ClipboardCheck },
    { id: 'conclusao', label: 'Conclusão', icon: CheckCircle2 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/treinamentos')} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Treinamentos
        </Button>
      </div>

      {/* Header */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`border ${diff.class}`}>{diff.label}</Badge>
                <Badge variant="secondary">{training.sector}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {training.durationMin} min
                </Badge>
                {completed && (
                  <Badge className="bg-success/10 text-success border-success/30 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Concluído
                  </Badge>
                )}
              </div>
              <h1 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{training.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{training.description}</p>
              {equipment && (
                <div className="mt-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Equipamento: </span>
                  <Button asChild variant="link" className="h-auto p-0 text-sm font-medium">
                    <Link to={`/equipamentos/${equipment.id}`}>{equipment.name}</Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* Section navigation */}
        <Card className="h-fit lg:sticky lg:top-4">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </nav>
            <Separator className="my-3" />
            <Progress value={completed ? 100 : 30} className="h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">{completed ? '100% concluído' : '30% iniciado'}</p>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-4">
          {activeSection === 'introducao' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Introdução</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{training.content[0]}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{training.content[1]}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{training.content[2]}</p>
                <DisclaimerBanner />
                <Button onClick={() => setActiveSection('objetivos')} className="gap-1.5">
                  Próximo: Objetivos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'objetivos' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Objetivos de aprendizagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {training.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg border p-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <p className="text-sm pt-0.5">{obj}</p>
                  </div>
                ))}
                <Button onClick={() => setActiveSection('conteudo')} className="gap-1.5 mt-2">
                  Próximo: Conteúdo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'conteudo' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conteúdo do treinamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {training.content.map((c, i) => (
                  <p key={i} className="text-sm leading-relaxed">{c}</p>
                ))}
                {equipment && (
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold mb-1">{equipment.name}</h4>
                    <p className="text-xs text-muted-foreground">{equipment.description}</p>
                  </div>
                )}
                <Button onClick={() => setActiveSection('video')} className="gap-1.5 mt-2">
                  Próximo: Vídeo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'video' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  {equipment?.id === 'cica-001'
                    ? 'Como utilizar a Autoclave CISA 6410 para esterilização'
                    : 'Vídeo demonstrativo'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {equipment?.id === 'cica-001' ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Microtreinamento audiovisual sobre o procedimento de utilização da Autoclave CISA modelo 6410,
                      baseado no procedimento operacional padrão institucional (POP.UBCME.004 — versão 02).
                    </p>
                    <AutoclaveTrainingVideo onComplete={handleVideoComplete} />

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Video className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">
                          {videoCompleted ? 'Treinamento audiovisual concluído' : 'Treinamento audiovisual não assistido'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {videoCompleted
                            ? 'Você assistiu ao conteúdo completo. Prossiga para o checklist.'
                            : 'Assista ao treinamento completo para marcar como concluído.'}
                        </p>
                      </div>
                      {videoCompleted && <CheckCircle2 className="h-5 w-5 text-success" />}
                    </div>

                    {/* Post-video actions */}
                    {videoCompleted && (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-success/30 bg-success/5 p-3 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium">Conteúdo audiovisual concluído</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setActiveSection('passo-a-passo')} className="gap-1.5">
                            <ListChecks className="h-4 w-4" />
                            Ver checklist
                          </Button>
                          <Button size="sm" onClick={() => setActiveSection('questionario')} className="gap-1.5">
                            <ClipboardCheck className="h-4 w-4" />
                            Teste de fixação
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-xl bg-muted border-2 border-dashed border-border">
                    <div className="text-center">
                      <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Vídeo demonstrativo</p>
                      <p className="mt-1 text-xs text-muted-foreground">Placeholder para vídeo local.</p>
                    </div>
                  </div>
                )}
                <DisclaimerBanner />
                <Button onClick={() => setActiveSection('passo-a-passo')} className="gap-1.5">
                  Próximo: Passo a passo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'passo-a-passo' && equipment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Passo a passo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="relative space-y-3 border-l-2 border-primary/20 pl-6">
                  {equipment.steps.map((step) => (
                    <li key={step.step} className="relative">
                      <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {step.step}
                      </div>
                      <div className="rounded-lg border p-3">
                        <h4 className="text-sm font-semibold">{step.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Button onClick={() => setActiveSection('questionario')} className="gap-1.5">
                  Próximo: Questionário
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'questionario' && equipment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Questionário de verificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Acesse o questionário completo na página do equipamento para responder e verificar sua compreensão.
                </p>
                <Button asChild className="gap-1.5">
                  <Link to={`/equipamentos/${equipment.id}`}>
                    Ir para o questionário
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button onClick={() => setActiveSection('conclusao')} variant="outline" className="gap-1.5">
                  Próximo: Conclusão
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'conclusao' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conclusão do treinamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${completed ? 'bg-success/10' : 'bg-muted'}`}>
                    <CheckCircle2 className={`h-10 w-10 ${completed ? 'text-success' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {completed ? 'Treinamento concluído!' : 'Conclua seu treinamento'}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    {completed
                      ? 'Parabéns! Seu registro de conclusão foi salvo localmente. Lembre-se: este conteúdo é complementar e não substitui treinamentos oficiais.'
                      : 'Após responder o questionário com aproveitamento mínimo de 70%, marque o treinamento como concluído.'}
                  </p>
                  {!completed && equipment && (
                    <Button asChild className="gap-1.5">
                      <Link to={`/equipamentos/${equipment.id}`}>
                        Ir para o questionário
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {completed && (
                    <Button asChild variant="outline" className="gap-1.5">
                      <Link to="/treinamentos">Ver outros treinamentos</Link>
                    </Button>
                  )}
                </div>
                <DisclaimerBanner />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

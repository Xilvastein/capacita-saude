import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Microscope,
  Building2,
  Calendar,
  User,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  FileText,
  AlertTriangle,
  ShieldAlert,
  Info,
  ListChecks,
  ClipboardCheck,
  ArrowRight,
  Video,
} from 'lucide-react';
import { AutoclaveTrainingVideo } from '@/components/AutoclaveTrainingVideo';
import { QRCodeSVG } from 'qrcode.react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { getEquipmentById, isTrainingCompleted, markTrainingCompleted, addAccessLog } from '@/services/storage';
import { getTrainings } from '@/services/storage';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import type { SafetyNote, CommonError } from '@/types';

export function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useApp();
  const equipment = useMemo(() => (id ? getEquipmentById(id) : undefined), [id]);
  const trainings = useMemo(() => getTrainings(), []);
  const relatedTraining = useMemo(
    () => trainings.find((t) => t.equipmentId === id),
    [trainings, id]
  );
  const [completed, setCompleted] = useState(id ? isTrainingCompleted(`tr-${id}`) : false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('visao-geral');

  const handleVideoComplete = useCallback(() => {
    setVideoCompleted(true);
  }, []);

  // Register access on mount
  useMemo(() => {
    if (equipment && user) {
      addAccessLog({
        id: `acc-manual-${Date.now()}`,
        equipmentId: equipment.id,
        employeeCode: user.role === 'gestor' ? 'FUNC-001' : user.email,
        sector: equipment.sector,
        date: new Date().toISOString().split('T')[0],
        durationSec: 120,
        completedQuestionnaire: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Microscope className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Equipamento não encontrado</h2>
        <p className="mt-1 text-sm text-muted-foreground">O equipamento solicitado não está cadastrado.</p>
        <Button asChild className="mt-4">
          <Link to="/equipamentos">Voltar ao catálogo</Link>
        </Button>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/#/equipamentos/${equipment.id}` : `/equipamentos/${equipment.id}`;

  const handleMarkComplete = () => {
    if (relatedTraining) {
      markTrainingCompleted(relatedTraining.id);
      setCompleted(true);
      toast.success('Treinamento marcado como concluído!', {
        description: 'Seu registro foi salvo localmente.',
      });
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correct = equipment.questions.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / equipment.questions.length) * 100);
    if (score >= 70) {
      toast.success(`Questionário concluído! Acerto: ${score}%`, {
        description: 'Você pode marcar o treinamento como concluído.',
      });
    } else {
      toast.warning(`Questionário concluído: ${score}%`, {
        description: 'Aproveitamento abaixo de 70%. Revise o conteúdo e tente novamente.',
      });
    }
  };

  const correctCount = equipment.questions.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
  const quizScore = quizSubmitted ? Math.round((correctCount / equipment.questions.length) * 100) : 0;
  const allAnswered = equipment.questions.every((q) => quizAnswers[q.id] !== undefined);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/equipamentos')} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Catálogo de equipamentos
        </Button>
      </div>

      {/* Header card */}
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">{equipment.code}</Badge>
                <Badge variant="secondary">{equipment.category}</Badge>
                <Badge variant="outline">{equipment.sector}</Badge>
              </div>
              <h1 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{equipment.name}</h1>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{equipment.sector}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Atualizado em {new Date(equipment.lastUpdated).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Responsável: {equipment.responsible}</span>
                </div>
              </div>
            </div>
            {/* QR mini display */}
            <div className="flex flex-col items-center gap-2 rounded-xl border p-3 bg-muted/30">
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG value={baseUrl} size={80} level="M" fgColor="#2E7D5B" />
              </div>
              <span className="text-[10px] text-muted-foreground">QR Code do equipamento</span>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => navigate('/qr-code')}>
                <QrCode className="h-3 w-3" />
                Ver QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto scrollbar-thin">
          <TabsList className="mb-4 flex w-max h-auto">
            <TabsTrigger value="visao-geral" className="gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Visão geral
            </TabsTrigger>
            <TabsTrigger value="passo-a-passo" className="gap-1.5">
              <ListChecks className="h-3.5 w-3.5" />
              Passo a passo
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-1.5">
              <PlayCircle className="h-3.5 w-3.5" />
              Vídeo
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="erros" className="gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Erros comuns
            </TabsTrigger>
            <TabsTrigger value="materiais" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Materiais
            </TabsTrigger>
            <TabsTrigger value="questionario" className="gap-1.5">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Questionário
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Visão geral */}
        <TabsContent value="visao-geral">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descrição e Finalidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Descrição</h4>
                <p className="text-sm leading-relaxed">{equipment.description}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Finalidade</h4>
                <p className="text-sm leading-relaxed">{equipment.purpose}</p>
              </div>
              <DisclaimerBanner />
              {relatedTraining && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 bg-primary/5">
                  <span className="text-sm">Treinamento relacionado disponível</span>
                  <Button asChild size="sm" className="gap-1.5">
                    <Link to={`/treinamentos/${relatedTraining.id}`}>
                      Acessar treinamento
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passo a passo */}
        <TabsContent value="passo-a-passo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Instruções de utilização — Passo a passo</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-4 border-l-2 border-primary/20 pl-6">
                {equipment.steps.map((step) => (
                  <li key={step.step} className="relative">
                    <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {step.step}
                    </div>
                    <div className="rounded-lg border p-3">
                      <h4 className="text-sm font-semibold">{step.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      {step.warning && (
                        <div className="mt-2 flex items-start gap-2 rounded-md bg-warning/10 p-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
                          <span className="text-xs text-foreground/80">{step.warning}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <DisclaimerBanner />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vídeo */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                {equipment.id === 'cica-001'
                  ? 'Como utilizar a Autoclave CISA 6410 para esterilização'
                  : 'Vídeo demonstrativo'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipment.id === 'cica-001' ? (
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
                          ? 'Você assistiu ao conteúdo completo. Prossiga para o questionário.'
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
                        <Button size="sm" variant="outline" onClick={() => setActiveTab('passo-a-passo')} className="gap-1.5">
                          <ListChecks className="h-4 w-4" />
                          Ver checklist
                        </Button>
                        <Button size="sm" onClick={() => setActiveTab('questionario')} className="gap-1.5">
                          <ClipboardCheck className="h-4 w-4" />
                          Ir para o teste de fixação
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl bg-muted border-2 border-dashed border-border">
                  <div className="text-center">
                    <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Vídeo demonstrativo do equipamento</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placeholder para vídeo local. Em implementação real, seria integrado ao armazenamento de vídeos do hospital.
                    </p>
                  </div>
                </div>
              )}
              <DisclaimerBanner />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cuidados e orientações de segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {equipment.safetyNotes.map((note: SafetyNote, i) => {
                const levelConfig = {
                  danger: { bg: 'bg-destructive/5', border: 'border-destructive/30', icon: ShieldAlert, iconClass: 'text-destructive' },
                  warning: { bg: 'bg-warning/5', border: 'border-warning/30', icon: AlertTriangle, iconClass: 'text-warning' },
                  info: { bg: 'bg-primary/5', border: 'border-primary/30', icon: Info, iconClass: 'text-primary' },
                };
                const cfg = levelConfig[note.level];
                const Icon = cfg.icon;
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-lg border ${cfg.border} ${cfg.bg} p-3`}>
                    <Icon className={`h-5 w-5 shrink-0 ${cfg.iconClass} mt-0.5`} />
                    <div>
                      <h4 className="text-sm font-semibold">{note.title}</h4>
                      <p className="mt-0.5 text-sm text-muted-foreground">{note.description}</p>
                    </div>
                  </div>
                );
              })}
              <DisclaimerBanner />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Erros comuns */}
        <TabsContent value="erros">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Erros comuns e soluções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {equipment.commonErrors.map((err: CommonError, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-semibold">{err.error}</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-md bg-muted/50 p-2">
                          <span className="text-xs font-medium text-muted-foreground">Causa provável</span>
                          <p className="text-xs mt-0.5">{err.cause}</p>
                        </div>
                        <div className="rounded-md bg-success/5 p-2">
                          <span className="text-xs font-medium text-success">Solução sugerida</span>
                          <p className="text-xs mt-0.5">{err.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <DisclaimerBanner />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materiais */}
        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Materiais complementares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {equipment.complementaryMaterials.map((mat, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">{mat.title}</h4>
                    <p className="text-xs text-muted-foreground">{mat.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{mat.type}</Badge>
                    {mat.pages && <span className="text-xs text-muted-foreground">{mat.pages}p</span>}
                  </div>
                </div>
              ))}
              <DisclaimerBanner text="Os materiais são simulados para demonstração. Em ambiente real, seriam vinculados aos documentos oficiais do fabricante e da instituição." />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questionário */}
        <TabsContent value="questionario">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questionário de verificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {equipment.questions.map((q, qi) => (
                <div key={q.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {qi + 1}
                    </span>
                    <p className="text-sm font-medium pt-0.5">{q.question}</p>
                  </div>
                  <div className="ml-8 space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const isSelected = quizAnswers[q.id] === oi;
                      const isCorrect = oi === q.correctIndex;
                      const showResult = quizSubmitted;
                      return (
                        <button
                          key={oi}
                          onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: oi })}
                          disabled={quizSubmitted}
                          className={`flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-all ${
                            showResult && isCorrect
                              ? 'border-success bg-success/5'
                              : showResult && isSelected && !isCorrect
                              ? 'border-destructive bg-destructive/5'
                              : isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                            showResult && isCorrect
                              ? 'border-success bg-success text-success-foreground'
                              : showResult && isSelected && !isCorrect
                              ? 'border-destructive bg-destructive text-destructive-foreground'
                              : isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground'
                          }`}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span>{opt}</span>
                          {showResult && isCorrect && <CheckCircle2 className="ml-auto h-4 w-4 text-success" />}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <p className="ml-8 text-xs text-muted-foreground italic">{q.explanation}</p>
                  )}
                </div>
              ))}

              {quizSubmitted && (
                <div className={`rounded-lg border p-4 text-center ${quizScore >= 70 ? 'border-success bg-success/5' : 'border-warning bg-warning/5'}`}>
                  <p className="text-lg font-bold">{quizScore}% de acerto</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quizScore >= 70
                      ? 'Aproveitamento satisfatório! Você pode marcar o treinamento como concluído.'
                      : 'Aproveitamento abaixo de 70%. Revise o conteúdo e refaça o questionário.'}
                  </p>
                  {!quizSubmitted && (
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}>
                      Refazer questionário
                    </Button>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                {!quizSubmitted ? (
                  <Button onClick={handleQuizSubmit} disabled={!allAnswered} className="gap-1.5">
                    <ClipboardCheck className="h-4 w-4" />
                    Enviar respostas
                  </Button>
                ) : quizScore >= 70 ? (
                  <Button onClick={handleMarkComplete} disabled={completed} className="gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    {completed ? 'Treinamento concluído' : 'Marcar treinamento como concluído'}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} className="gap-1.5">
                    Refazer questionário
                  </Button>
                )}
                {quizSubmitted && quizScore >= 70 && (
                  <Button variant="outline" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}>
                    Refazer
                  </Button>
                )}
              </div>

              {completed && (
                <div className="flex items-center gap-2 rounded-lg border border-success bg-success/5 p-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-success">Treinamento concluído e registrado localmente.</span>
                </div>
              )}

              <DisclaimerBanner />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code section */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            QR Code do equipamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <QRCodeDisplay
              value={baseUrl}
              equipmentName={equipment.name}
              equipmentCode={equipment.code}
              size={180}
            />
            <div className="flex-1 space-y-2 text-sm">
              <p className="text-muted-foreground">
                Escaneie este QR Code para acessar diretamente a página deste equipamento.
                O código pode ser impresso e fixado no equipamento no ambiente hospitalar.
              </p>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Rota de acesso</p>
                <p className="font-mono text-sm mt-0.5 break-all">/equipamentos/{equipment.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

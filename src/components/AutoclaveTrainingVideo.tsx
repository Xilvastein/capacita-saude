import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Thermometer,
  Wind,
  DoorClosed,
  Beaker,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface VideoScene {
  id: number;
  title: string;
  duration: number;
  subtitle: string;
  narration: string;
  render: () => React.ReactNode;
}

export function AutoclaveTrainingVideo({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const scenes: VideoScene[] = [
    {
      id: 1,
      title: 'Introdução',
      duration: 10,
      subtitle: 'Neste treinamento, vamos apresentar o procedimento de utilização da Autoclave CISA modelo 6410, seguindo o procedimento operacional padrão institucional.',
      narration: 'Neste treinamento, vamos apresentar o procedimento de utilização da Autoclave CISA modelo 6410, seguindo o procedimento operacional padrão institucional.',
      render: () => <SceneIntroduction />,
    },
    {
      id: 2,
      title: 'Verificação antes do ciclo',
      duration: 10,
      subtitle: 'Antes de iniciar cada ciclo, verifique se a água da osmose reversa está próxima ou no nível da marcação do recipiente da osmose.',
      narration: 'Antes de iniciar cada ciclo, verifique se a água da osmose reversa está próxima ou no nível da marcação do recipiente da osmose.',
      render: () => <SceneWaterCheck />,
    },
    {
      id: 3,
      title: 'Primeiro ciclo do dia',
      duration: 10,
      subtitle: 'O primeiro ciclo do dia deve ser o Bowie Dick a 134 graus Celsius, realizado conforme o procedimento específico.',
      narration: 'O primeiro ciclo do dia deve ser o Bowie Dick a 134 graus Celsius, realizado conforme o procedimento específico.',
      render: () => <SceneBowieDick />,
    },
    {
      id: 4,
      title: 'Preparação da carga',
      duration: 20,
      subtitle: 'Coloque a carga dentro da autoclave de acordo com o tempo de esterilização de cada material. Distribua para que não toquem a parede e exista espaço para circulação de ar. Materiais em grau cirúrgico devem ter pacotes lateralizados.',
      narration: 'Coloque a carga a ser esterilizada dentro da autoclave de acordo com o tempo de esterilização de cada material. Distribua a carga de modo que os materiais não toquem a parede da autoclave e exista espaço para circulação de ar entre a carga. Caso o material esteja em grau cirúrgico, deixe os pacotes lateralizados.',
      render: () => <SceneLoadPreparation />,
    },
    {
      id: 5,
      title: 'Fechamento da porta',
      duration: 8,
      subtitle: 'Feche a porta da autoclave segurando o botão indicado na tela.',
      narration: 'Feche a porta da autoclave segurando o botão indicado na tela.',
      render: () => <SceneDoorClose />,
    },
    {
      id: 6,
      title: 'Início do processo',
      duration: 15,
      subtitle: 'Clique em iniciar. Informe o login e a senha e clique em OK. Selecione o ciclo de acordo com a carga. Em seguida, selecione iniciar.',
      narration: 'Clique em iniciar. Informe o login e a senha e clique em OK. Selecione o ciclo de acordo com a carga. Em seguida, selecione iniciar.',
      render: () => <SceneStartProcess />,
    },
    {
      id: 7,
      title: 'Ciclos de esterilização',
      duration: 25,
      subtitle: 'Selecione o ciclo correspondente à carga a ser esterilizada, seguindo a classificação do material e o procedimento institucional.',
      narration: 'Selecione o ciclo correspondente à carga a ser esterilizada, seguindo a classificação do material e o procedimento institucional.',
      render: () => <SceneCycles />,
    },
    {
      id: 8,
      title: 'Finalização do ciclo',
      duration: 12,
      subtitle: 'Ao término do ciclo, a autoclave aciona um alarme sonoro. Toque na tela para desligar o alarme. Aguarde a impressão do relatório final do ciclo.',
      narration: 'Ao término do ciclo, a autoclave aciona um alarme sonoro. Toque na tela para desligar o alarme. Aguarde a impressão do relatório final do ciclo.',
      render: () => <SceneCycleEnd />,
    },
    {
      id: 9,
      title: 'Abertura e retirada da carga',
      duration: 15,
      subtitle: 'A autoclave possui um barulho alto durante o funcionamento. Quando esse barulho cessar, abra parcialmente a porta. Retire a carga somente quando o calor estiver reduzido a temperaturas suportáveis.',
      narration: 'A autoclave possui um barulho alto durante o funcionamento. Quando esse barulho cessar, abra parcialmente a porta da autoclave. Retire a carga somente quando o calor estiver reduzido a temperaturas suportáveis.',
      render: () => <SceneUnload />,
    },
    {
      id: 10,
      title: 'Encerramento',
      duration: 10,
      subtitle: 'Você concluiu este treinamento sobre a utilização da Autoclave CISA 6410. Consulte sempre o POP institucional, o manual do fabricante e siga a capacitação oficial da instituição.',
      narration: 'Você concluiu este treinamento sobre a utilização da Autoclave CISA 6410. Consulte sempre o POP institucional, o manual do fabricante e siga a capacitação oficial da instituição.',
      render: () => <SceneClosing />,
    },
  ];

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [announcedComplete, setAnnouncedComplete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentScene = scenes[currentSceneIdx];
  const sceneStartTime = scenes.slice(0, currentSceneIdx).reduce((sum, s) => sum + s.duration, 0);
  const sceneElapsed = currentTime - sceneStartTime;
  const sceneProgress = Math.min(100, (sceneElapsed / currentScene.duration) * 100);
  const overallProgress = Math.min(100, (currentTime / totalDuration) * 100);

  // Determine current scene based on time
  useEffect(() => {
    let acc = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (currentTime < acc + scenes[i].duration) {
        if (i !== currentSceneIdx) {
          setCurrentSceneIdx(i);
        }
        break;
      }
      acc += scenes[i].duration;
    }
    if (currentTime >= totalDuration) {
      setIsPlaying(false);
      if (!finished) {
        setFinished(true);
        if (!announcedComplete) {
          setAnnouncedComplete(true);
          onComplete();
        }
      }
    }
  }, [currentTime, scenes, totalDuration, currentSceneIdx, finished, announcedComplete, onComplete]);

  // Playback timer
  useEffect(() => {
    if (isPlaying && currentTime < totalDuration) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => Math.min(totalDuration, t + 0.5));
      }, 500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTime, totalDuration]);

  // Narration using Web Speech API
  const speakNarration = useCallback((text: string) => {
    if (muted || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.volume = volume;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [muted, volume]);

  // Speak when scene changes during playback
  useEffect(() => {
    if (isPlaying) {
      speakNarration(currentScene.narration);
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSceneIdx, isPlaying]);

  // Update speech volume
  useEffect(() => {
    if (speechRef.current && typeof window !== 'undefined' && window.speechSynthesis) {
      // Can't change volume on active utterance; cancel and restart if playing
    }
  }, [volume, muted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (finished) return;
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (currentTime >= totalDuration) {
        setCurrentTime(0);
        setCurrentSceneIdx(0);
        setFinished(false);
        setAnnouncedComplete(false);
      }
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number) => {
    const newTime = (value / 100) * totalDuration;
    setCurrentTime(newTime);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const skipScene = (direction: 'next' | 'prev') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (direction === 'next' && currentSceneIdx < scenes.length - 1) {
      const nextStart = scenes.slice(0, currentSceneIdx + 1).reduce((sum, s) => sum + s.duration, 0);
      setCurrentTime(nextStart);
      setCurrentSceneIdx(currentSceneIdx + 1);
    } else if (direction === 'prev' && currentSceneIdx > 0) {
      const prevStart = scenes.slice(0, currentSceneIdx - 1).reduce((sum, s) => sum + s.duration, 0);
      setCurrentTime(prevStart);
      setCurrentSceneIdx(currentSceneIdx - 1);
    } else if (direction === 'prev' && currentSceneIdx === 0) {
      setCurrentTime(0);
    }
  };

  const restart = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentTime(0);
    setCurrentSceneIdx(0);
    setIsPlaying(false);
    setFinished(false);
    setAnnouncedComplete(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border bg-[#F7F9F7]"
    >
      {/* Video stage */}
      <div className="relative aspect-video w-full bg-gradient-to-b from-[#E8F3ED] to-[#F7F9F7]">
        {/* Scene content */}
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
          <div key={currentScene.id} className="animate-fade-in w-full h-full flex items-center justify-center">
            {currentScene.render()}
          </div>
        </div>

        {/* Scene indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/80 text-xs">
            Cena {currentScene.id}/{scenes.length}
          </Badge>
          <span className="text-xs font-medium text-foreground/70 bg-white/60 rounded px-2 py-0.5">
            {currentScene.title}
          </span>
        </div>

        {/* Subtitles */}
        {showSubtitles && (
          <div className="absolute bottom-16 left-1/2 w-[90%] max-w-2xl -translate-x-1/2">
            <div className="rounded-lg bg-black/60 px-4 py-2 text-center">
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-white">
                {currentScene.subtitle}
              </p>
            </div>
          </div>
        )}

        {/* Finished overlay */}
        {finished && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-base font-bold">Treinamento concluído</h3>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Você assistiu ao treinamento completo. Agora confira o checklist e responda ao teste de fixação.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={restart} variant="outline" className="gap-1.5">
                  <RotateCcw className="h-4 w-4" />
                  Assistir novamente
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Play button overlay when paused */}
        {!isPlaying && !finished && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors hover:bg-black/20"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110">
              <Play className="ml-1 h-7 w-7" />
            </div>
          </button>
        )}
      </div>

      {/* Controls bar */}
      <div className="border-t bg-white px-3 py-2.5 sm:px-4">
        {/* Progress bar */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={overallProgress}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="flex-1 h-1.5 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(154 46% 34%) ${overallProgress}%, hsl(var(--muted)) ${overallProgress}%)`,
            }}
          />
          <span className="text-xs tabular-nums text-muted-foreground w-10">
            {formatTime(totalDuration)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={restart} title="Reiniciar">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => skipScene('prev')} title="Cena anterior">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlay} title="Play/Pause">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => skipScene('next')} title="Próxima cena">
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Volume */}
          <div className="group relative flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMuted(!muted)}
              title="Volume"
            >
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : volume * 100}
              onChange={(e) => {
                setVolume(Number(e.target.value) / 100);
                setMuted(false);
              }}
              className="w-0 overflow-hidden transition-all duration-200 group-hover:w-16 h-1.5 cursor-pointer appearance-none rounded-full bg-muted accent-primary opacity-0 group-hover:opacity-100"
            />
          </div>

          {/* Subtitles toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', showSubtitles && 'text-primary')}
            onClick={() => setShowSubtitles(!showSubtitles)}
            title="Legendas"
          >
            <Subtitles className="h-4 w-4" />
          </Button>

          <div className="ml-auto flex items-center gap-1">
            <span className="hidden sm:inline text-xs text-muted-foreground mr-1">
              {overallProgress.toFixed(0)}% assistido
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullscreen} title="Tela cheia">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Scene timeline */}
      <div className="border-t bg-[#F7F9F7] px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {scenes.map((scene, i) => {
            const isCurrent = i === currentSceneIdx;
            const isPast = i < currentSceneIdx;
            return (
              <button
                key={scene.id}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  const start = scenes.slice(0, i).reduce((sum, s) => sum + s.duration, 0);
                  setCurrentTime(start);
                  setCurrentSceneIdx(i);
                  setFinished(false);
                }}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-all',
                  isCurrent && 'bg-primary text-primary-foreground font-medium',
                  isPast && !isCurrent && 'text-success',
                  !isCurrent && !isPast && 'text-muted-foreground hover:bg-muted'
                )}
                title={scene.title}
              >
                {isPast ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : isCurrent ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span className="h-3 w-3 flex items-center justify-center text-[10px]">{scene.id}</span>
                )}
                <span className="hidden sm:inline">{scene.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============ Scene Components ============ */

function SceneIntroduction() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Stylized CME environment */}
      <div className="relative flex h-32 w-full max-w-md items-end justify-center gap-3 rounded-lg bg-white border p-4">
        {/* Autoclave representation */}
        <div className="flex h-24 w-20 flex-col items-center justify-end rounded-lg border-2 border-primary/30 bg-[#E8F3ED]">
          <div className="mt-2 h-3 w-12 rounded-sm bg-primary/20" />
          <div className="mt-1 h-2 w-8 rounded-sm bg-primary/10" />
          <div className="mb-2 mt-auto h-16 w-16 rounded-md border-2 border-primary/20 bg-white/80" />
        </div>
        {/* Table */}
        <div className="h-4 w-32 rounded-sm bg-muted border" />
        {/* Shelf */}
        <div className="absolute right-3 top-3 h-12 w-16 rounded-sm border bg-white/60" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-primary">CapacitaSaúde</p>
        <p className="text-sm font-semibold">Como utilizar a Autoclave CISA 6410</p>
        <p className="text-xs text-muted-foreground">Treinamento operacional</p>
      </div>
      <Badge variant="outline" className="text-xs">Equipamento: Autoclave CISA 6410</Badge>
    </div>
  );
}

function SceneWaterCheck() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-40 w-full max-w-sm items-center justify-center rounded-lg bg-white border p-6">
        {/* Water container representation */}
        <div className="relative flex h-28 w-20 flex-col rounded-md border-2 border-border bg-[#E8F3ED] overflow-hidden">
          {/* Water level */}
          <div className="mt-auto h-20 bg-primary/20" />
          {/* Level mark line */}
          <div className="absolute left-0 right-0 top-6 border-t-2 border-dashed border-primary/50" />
          <span className="absolute -right-12 top-4 text-[10px] text-primary font-medium">Nível</span>
        </div>
        {/* Check icon */}
        <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
          <p className="text-sm font-semibold">Verifique o nível da água da osmose reversa</p>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs">
          A água deve estar próxima ou no nível da marcação do recipiente da osmose.
        </p>
      </div>
    </div>
  );
}

function SceneBowieDick() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-40 w-full max-w-sm items-center justify-center rounded-lg bg-white border p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-primary/30 bg-[#E8F3ED]">
            <Beaker className="h-10 w-10 text-primary" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <Thermometer className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">134°C</span>
          </div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <Badge className="bg-primary text-primary-foreground">PRIMEIRO CICLO DO DIA</Badge>
        <p className="text-sm font-semibold">Bowie Dick — 134°C</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Realizar conforme o POP específico do teste Bowie Dick.
        </p>
      </div>
    </div>
  );
}

function SceneLoadPreparation() {
  const items = [
    { label: 'Carga organizada', icon: CheckCircle2 },
    { label: 'Espaço para circulação de ar', icon: Wind },
    { label: 'Materiais sem contato com as paredes', icon: ShieldCheck },
    { label: 'Pacotes de grau cirúrgico lateralizados', icon: DoorClosed },
  ];
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <div className="relative flex h-36 w-full items-center justify-center rounded-lg bg-white border p-4">
        {/* Autoclave chamber with organized load */}
        <div className="relative flex h-28 w-full max-w-xs items-center justify-center rounded-lg border-2 border-primary/30 bg-[#E8F3ED] overflow-hidden gap-2 px-3">
          {/* Organized packages */}
          <div className="flex h-16 w-12 flex-col items-center justify-center rounded border border-primary/20 bg-white">
            <div className="h-3 w-8 rounded-sm bg-primary/10" />
            <span className="mt-1 text-[8px] text-muted-foreground">Pacote</span>
          </div>
          <div className="flex h-20 w-10 items-center justify-center rounded border border-primary/20 bg-white text-[8px] text-muted-foreground">
            Lateral
          </div>
          <div className="flex h-14 w-12 flex-col items-center justify-center rounded border border-primary/20 bg-white">
            <div className="h-2 w-8 rounded-sm bg-primary/10" />
            <span className="mt-1 text-[8px] text-muted-foreground">Pacote</span>
          </div>
          {/* Air circulation indicator */}
          <Wind className="absolute right-2 top-2 h-4 w-4 text-primary/40" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <Icon className="h-4 w-4 shrink-0 text-success" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneDoorClose() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-40 w-full max-w-sm items-center justify-center rounded-lg bg-white border p-6">
        {/* Autoclave door representation */}
        <div className="relative flex h-28 w-32 flex-col items-center justify-center rounded-lg border-2 border-primary/30 bg-[#E8F3ED]">
          <div className="h-20 w-24 rounded-md border-2 border-primary/20 bg-white/70" />
          {/* Door handle */}
          <div className="absolute right-1 top-1/2 h-8 w-2 -translate-y-1/2 rounded-sm bg-primary/40" />
        </div>
        {/* Closing arrow */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-primary text-2xl">←</div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold">Feche a porta da autoclave</p>
        <p className="text-xs text-muted-foreground mt-1">
          Segure o botão indicado na tela.
        </p>
        <p className="text-[10px] text-muted-foreground mt-2 italic">
          Representação ilustrativa. Consulte o painel real do equipamento.
        </p>
      </div>
    </div>
  );
}

function SceneStartProcess() {
  const steps = ['Iniciar', 'Login e senha', 'OK', 'Selecionar o ciclo', 'Iniciar'];
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <div className="relative flex h-36 w-full items-center justify-center rounded-lg bg-white border p-4">
        {/* Generic illustrative panel */}
        <div className="flex h-28 w-full max-w-xs flex-col gap-2 rounded-lg border-2 border-dashed border-primary/20 bg-[#F7F9F7] p-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded-sm bg-primary/20" />
            <div className="h-3 w-8 rounded-sm bg-muted" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-14 rounded border border-primary/20 bg-white" />
            <div className="h-5 w-14 rounded border border-primary/20 bg-white" />
          </div>
          <div className="ml-auto h-6 w-16 rounded bg-primary/30" />
        </div>
        <span className="absolute bottom-1 right-2 text-[9px] text-muted-foreground italic">
          Interface ilustrativa — não reproduz fielmente o painel real
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-xs font-medium">{step}</span>
            </div>
            {i < steps.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneCycles() {
  const cycles = [
    { name: 'Ciclo Borrachas', temp: '121°C', desc: 'Materiais de silicone ou borracha em geral.' },
    { name: 'Ciclo Tecido', temp: '134°C', desc: 'Tecidos, campo cirúrgico e materiais resistentes à temperatura.' },
    { name: 'Ciclo Instrumentos', temp: '134°C', desc: 'Instrumentos cirúrgicos.' },
    { name: 'Ciclo Bowie & Dick', temp: '134°C', desc: 'Pacote Bowie & Dick.' },
    { name: 'Ciclo Teste de Vácuo', temp: '—', desc: 'Câmara vazia.' },
  ];
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
      <div className="grid w-full gap-2 sm:grid-cols-2">
        {cycles.map((cycle) => (
          <div key={cycle.name} className="flex items-start gap-3 rounded-lg border bg-white p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Thermometer className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold">{cycle.name}</p>
                <Badge variant="outline" className="text-[10px] py-0">{cycle.temp}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{cycle.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-md">
        Selecione o ciclo correspondente à carga, seguindo a classificação do material e o procedimento institucional.
      </p>
    </div>
  );
}

function SceneCycleEnd() {
  const checks = [
    { label: 'Ciclo concluído', icon: CheckCircle2 },
    { label: 'Desligar o alarme', icon: AlertTriangle },
    { label: 'Aguardar o relatório final', icon: Clock },
  ];
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="relative flex h-36 w-full items-center justify-center rounded-lg bg-white border p-6">
        {/* Alarme indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 animate-pulse-soft">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <span className="text-xs font-medium text-warning">Alarme sonoro</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {checks.map((check) => {
          const Icon = check.icon;
          return (
            <div key={check.label} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <Icon className="h-4 w-4 text-success" />
              <span className="text-xs font-medium">{check.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneUnload() {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="relative flex h-36 w-full items-center justify-center rounded-lg bg-white border p-6">
        {/* Partially open door */}
        <div className="relative flex h-24 w-32 items-center justify-center rounded-lg border-2 border-primary/30 bg-[#E8F3ED]">
          <div className="h-18 w-20 rounded-md border-2 border-primary/20 bg-white/70" style={{ transform: 'rotateY(20deg)', transformOrigin: 'left' }} />
        </div>
        {/* Heat indicator */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-warning/10 px-2 py-1">
          <Thermometer className="h-3.5 w-3.5 text-warning" />
          <span className="text-[10px] font-medium text-warning">Atenção: calor</span>
        </div>
      </div>
      <div className="w-full rounded-lg border border-warning/30 bg-warning/5 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <p className="text-sm font-bold text-warning">ATENÇÃO</p>
        </div>
        <p className="text-xs text-foreground/80 mt-2">
          Aguarde condições adequadas antes de retirar a carga.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Quando o barulho do funcionamento cessar, abra parcialmente a porta. Retire a carga somente quando o calor estiver reduzido a temperaturas suportáveis.
        </p>
      </div>
    </div>
  );
}

function SceneClosing() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-8 w-8 text-success" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">Treinamento concluído</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Consulte sempre o POP institucional, o manual do fabricante e siga a capacitação oficial da instituição.
        </p>
      </div>
      <div className="rounded-lg bg-primary/5 px-4 py-2">
        <p className="text-sm font-bold text-primary">CapacitaSaúde</p>
        <p className="text-xs text-muted-foreground">Conhecimento acessível no momento certo.</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Agora confira o checklist e responda ao teste de fixação.
      </p>
    </div>
  );
}

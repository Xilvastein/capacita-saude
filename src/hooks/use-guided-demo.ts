import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface DemoStep {
  index: number;
  title: string;
  description: string;
  route?: string;
}

export const demoSteps: DemoStep[] = [
  {
    index: 0,
    title: 'Bem-vindo à demonstração do CapacitaSaúde',
    description:
      'Vamos percorrer a solução completa. O CapacitaSaúde transforma equipamentos hospitalares em pontos de aprendizagem acessíveis por QR Code no próprio ambiente de trabalho.',
  },
  {
    index: 1,
    title: '1. O problema da capacitação',
    description:
      'Em hospitais públicos, a rotatividade de funcionários e o esquecimento de etapas geram dúvidas operacionais. Veja como nossa solução resolve isso.',
    route: '/metodologia',
  },
  {
    index: 2,
    title: '2. Catálogo de equipamentos',
    description:
      'Cada equipamento hospitalar possui uma página de capacitação. Veja o catálogo completo de equipamentos cadastrados.',
    route: '/equipamentos',
  },
  {
    index: 3,
    title: '3. Equipamento Ciça',
    description:
      'Vamos acessar o equipamento de esterilização "Ciça", um dos mais consultados no ambiente hospitalar.',
    route: '/equipamentos/cica-001',
  },
  {
    index: 4,
    title: '4. QR Code associado',
    description:
      'Cada equipamento possui um QR Code. O funcionário escaneia e acessa diretamente o conteúdo. Veja o QR Code do Ciça.',
    route: '/qr-code',
  },
  {
    index: 5,
    title: '5. Treinamento completo',
    description:
      'Agora veja o treinamento completo do Ciça, com introdução, objetivos e conteúdo.',
    route: '/treinamentos/tr-cica-001',
  },
  {
    index: 6,
    title: '6. Passo a passo',
    description:
      'O treinamento traz o passo a passo numerado de utilização do equipamento, com avisos de segurança em cada etapa.',
    route: '/equipamentos/cica-001',
  },
  {
    index: 7,
    title: '7. Questionário de verificação',
    description:
      'Ao final, o funcionário responde um questionário para verificar a compreensão do conteúdo.',
    route: '/equipamentos/cica-001',
  },
  {
    index: 8,
    title: '8. Conclusão do treinamento',
    description:
      'Após responder o questionário, o funcionário marca o treinamento como concluído. O registro é persistido localmente.',
    route: '/equipamentos/cica-001',
  },
  {
    index: 9,
    title: '9. Indicadores de impacto',
    description:
      'O gestor acompanha indicadores de acessos, conclusões e demandas. Veja o dashboard executivo.',
    route: '/indicadores',
  },
  {
    index: 10,
    title: '10. Necessidade de capacitação identificada',
    description:
      'O sistema identifica padrões e gera possíveis necessidades de capacitação para avaliação humana. Veja a central de necessidades.',
    route: '/necessidades',
  },
];

export function useGuidedDemo() {
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const startDemo = useCallback(() => {
    setActive(true);
    setCurrentStep(0);
    toast.success('Demonstração guiada iniciada', {
      description: 'Siga os passos para explorar a solução completa.',
    });
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep >= demoSteps.length - 1) {
      setActive(false);
      setCurrentStep(0);
      toast.success('Demonstração concluída!', {
        description: 'Você percorreu toda a solução CapacitaSaúde.',
      });
      return;
    }
    const next = currentStep + 1;
    setCurrentStep(next);
    const step = demoSteps[next];
    if (step.route) {
      navigate(step.route);
    }
  }, [currentStep, navigate]);

  const prevStep = useCallback(() => {
    if (currentStep <= 0) return;
    const prev = currentStep - 1;
    setCurrentStep(prev);
    const step = demoSteps[prev];
    if (step.route) {
      navigate(step.route);
    }
  }, [currentStep, navigate]);

  const stopDemo = useCallback(() => {
    setActive(false);
    setCurrentStep(0);
    toast('Demonstração interrompida');
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= demoSteps.length) return;
      setCurrentStep(step);
      const s = demoSteps[step];
      if (s.route) navigate(s.route);
    },
    [navigate]
  );

  return {
    active,
    currentStep,
    currentStepData: demoSteps[currentStep],
    totalSteps: demoSteps.length,
    startDemo,
    nextStep,
    prevStep,
    stopDemo,
    goToStep,
  };
}

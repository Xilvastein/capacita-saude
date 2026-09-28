import type {
  Equipment,
  Training,
  Employee,
  AccessLog,
  TrainingRecord,
  Notification,
} from '@/types';

export const seedEquipments: Equipment[] = [
  {
    id: 'cica-001',
    code: 'EST-001',
    name: 'Equipamento de Esterilização Ciça',
    sector: 'Centro de Material e Esterilização',
    category: 'Esterilização',
    description:
      'Equipamento de esterilização por vapor saturado sob pressão, conhecido no ambiente hospitalar como "Ciça". Utilizado para esterilização de materiais termorresistentes por meio de ciclos automatizados de vapor.',
    purpose:
      'Garantir a esterilização de instrumentais e materiais médico-hospitalares por meio de ciclos controlados de temperatura, pressão e tempo, assegurando segurança para reuso.',
    imageQuery: 'sterilization autoclave machine hospital',
    status: 'atualizado',
    responsible: 'Enf. Carla Mendes',
    lastUpdated: '2026-08-15',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Preparação do material',
        description:
          'Verifique se os materiais estão limpos, secos e corretamente acondicionados em embalagens adequadas para esterilização a vapor.',
        warning: 'Materiais com sujidade visível não devem entrar no ciclo.',
      },
      {
        step: 2,
        title: 'Carregamento da câmara',
        description:
          'Distribua os pacotes na câmara sem sobrecarga, mantendo espaços entre eles para circulação do vapor.',
        warning: 'Não empilhar pacotes diretamente uns sobre os outros.',
      },
      {
        step: 3,
        title: 'Seleção do ciclo',
        description:
          'Selecione o ciclo adequado conforme o tipo de material: 121°C por 15 min (ciclo padrão) ou 134°C por 10 min (ciclo rápido).',
        warning: 'Ciclo incorreto pode comprometer a esterilização.',
      },
      {
        step: 4,
        title: 'Início do ciclo',
        description:
          'Feche a porta herméticamente e inicie o ciclo. Acompanhe o painel de indicadores de temperatura, pressão e tempo.',
      },
      {
        step: 5,
        title: 'Monitoramento',
        description:
          'Acompanhe os indicadores do painel durante todo o ciclo. Verifique se os parâmetros de temperatura e pressão são atingidos.',
      },
      {
        step: 6,
        title: 'Finalização e descarga',
        description:
          'Após o ciclo completo e secagem, aguarde o resfriamento antes de manipular os pacotes. Confira os indicadores químicos e biológicos.',
        warning: 'Materiais quentes podem causar queimaduras.',
      },
    ],
    safetyNotes: [
      {
        title: 'EPI obrigatório',
        description: 'Utilize luvas térmicas, óculos de proteção e avental ao manipular materiais quentes.',
        level: 'danger',
      },
      {
        title: 'Pressão e temperatura',
        description: 'Nunca abra a câmara sob pressão. Aguarde a liberação automática antes de acessar.',
        level: 'danger',
      },
      {
        title: 'Controle de qualidade',
        description: 'Verifique os indicadores químicos e biológicos em cada ciclo antes de liberar o material.',
        level: 'warning',
      },
      {
        title: 'Registro documental',
        description: 'Registre cada ciclo em planilha de controle com data, ciclo, responsável e resultado.',
        level: 'info',
      },
    ],
    commonErrors: [
      {
        error: 'Ciclo não concluído',
        cause: 'Sobrecarga da câmara ou embalagens inadequadas impedindo circulação de vapor.',
        solution: 'Redistribua os pacotes e verifique o tipo de embalagem utilizada.',
      },
      {
        error: 'Material úmido ao final',
        cause: 'Falha na etapa de secagem ou excesso de umidade na câmara.',
        solution: 'Aumente o tempo de secagem e verifique a drenagem da câmara.',
      },
      {
        error: 'Indicador químico não altera',
        cause: 'Temperatura interna não atingiu o parâmetro mínimo do ciclo.',
        solution: 'Verifique a seleção do ciclo e a vedação da porta. Acione a manutenção se persistir.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual Operacional Ciça — Edição 2025',
        type: 'manual',
        description: 'Manual completo do fabricante com especificações técnicas e ciclos recomendados.',
        pages: 48,
      },
      {
        title: 'Checklist de Ciclo de Esterilização',
        type: 'checklist',
        description: 'Lista de verificação para cada etapa do ciclo, do carregamento à descarga.',
        pages: 2,
      },
      {
        title: 'Protocolo de Controle de Qualidade — CME',
        type: 'protocolo',
        description: 'Protocolo institucional para monitoramento de indicadores químicos e biológicos.',
        pages: 12,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Qual é a temperatura recomendada para o ciclo padrão de esterilização?',
        options: ['100°C por 30 min', '121°C por 15 min', '134°C por 20 min', '90°C por 60 min'],
        correctIndex: 1,
        explanation: 'O ciclo padrão utiliza 121°C por 15 minutos para garantir esterilização efetiva.',
      },
      {
        id: 'q2',
        question: 'Quando é seguro abrir a câmara após o ciclo?',
        options: [
          'Imediatamente após o bip',
          'Quando a pressão estiver totalmente liberada',
          'Após 5 minutos do término',
          'A qualquer momento, se usar luvas',
        ],
        correctIndex: 1,
        explanation: 'A câmara só deve ser aberta após a liberação total da pressão para evitar acidentes.',
      },
      {
        id: 'q3',
        question: 'O que pode comprometer a esterilização por sobrecarga da câmara?',
        options: [
          'Aumento do tempo de ciclo',
          'Impedimento da circulação de vapor entre os pacotes',
          'Maior consumo de energia',
          'Ressecamento dos materiais',
        ],
        correctIndex: 1,
        explanation: 'A sobrecarga impede a circulação adequada do vapor, comprometendo a esterilização.',
      },
      {
        id: 'q4',
        question: 'Qual EPI é obrigatório ao manipular materiais após o ciclo?',
        options: [
          'Apenas máscara',
          'Apenas luvas de procedimento',
          'Luvas térmicas, óculos e avental',
          'Nenhum, se o material estiver seco',
        ],
        correctIndex: 2,
        explanation: 'Luvas térmicas, óculos de proteção e avental são obrigatórios devido à temperatura.',
      },
    ],
    createdAt: '2026-01-10',
  },
  {
    id: 'autoclave-002',
    code: 'EST-002',
    name: 'Autoclave Hospitalar',
    sector: 'Centro de Material e Esterilização',
    category: 'Esterilização',
    description:
      'Autoclave vertical para esterilização de líquidos e materiais termorresistentes, com controle manual de pressão e temperatura.',
    purpose:
      'Esterilização de soluções, instrumentais e materiais de laboratório por meio de vapor saturado sob pressão.',
    imageQuery: 'autoclave laboratory sterilization equipment',
    status: 'atualizado',
    responsible: 'Enf. Carla Mendes',
    lastUpdated: '2026-07-20',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Verificação do nível de água',
        description: 'Confira o nível de água no reservatório antes de iniciar o ciclo.',
        warning: 'Nunca operar sem água suficiente na câmara.',
      },
      {
        step: 2,
        title: 'Carregamento',
        description: 'Coloque os materiais na cesta interna sem exceder a capacidade máxima.',
      },
      {
        step: 3,
        title: 'Fechamento e aquecimento',
        description: 'Feche a tampa hermeticamente e ligue o aquecimento. Aguarde atingir a temperatura de operação.',
      },
      {
        step: 4,
        title: 'Contagem de tempo',
        description: 'Inicie a contagem do tempo de esterilização quando atingir a temperatura desejada.',
      },
      {
        step: 5,
        title: 'Resfriamento e descarga',
        description: 'Desligue o aquecimento, aguarde a pressão zerar e a temperatura baixar antes de abrir.',
        warning: 'Abrir antes do resfriamento pode causar queimaduras graves.',
      },
    ],
    safetyNotes: [
      {
        title: 'Risco de queimadura',
        description: 'A autoclave atinge temperaturas elevadas. Aguarde o resfriamento completo antes de manipular.',
        level: 'danger',
      },
      {
        title: 'Vazamento de vapor',
        description: 'Verifique a vedação da tampa antes de cada ciclo. Vapores podem causar queimaduras.',
        level: 'warning',
      },
    ],
    commonErrors: [
      {
        error: 'Temperatura não atinge o alvo',
        cause: 'Resistência de aquecimento desgastada ou nível de água insuficiente.',
        solution: 'Verifique o nível de água e acione a manutenção para inspeção da resistência.',
      },
      {
        error: 'Vapor escapando pela tampa',
        cause: 'Vedação (borracha) danificada ou tampa mal fechada.',
        solution: 'Substitua a vedação e certifique-se de fechar a tampa corretamente.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual da Autoclave Vertical',
        type: 'manual',
        description: 'Especificações técnicas e procedimentos de operação.',
        pages: 32,
      },
      {
        title: 'Checklist de Segurança — Autoclave',
        type: 'checklist',
        description: 'Verificações antes, durante e após o ciclo.',
        pages: 1,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'O que deve ser verificado antes de iniciar o ciclo?',
        options: ['A cor do painel', 'O nível de água no reservatório', 'A temperatura ambiente', 'O horário'],
        correctIndex: 1,
        explanation: 'O nível de água é essencial para a geração de vapor e segurança do equipamento.',
      },
      {
        id: 'q2',
        question: 'Quando é seguro abrir a autoclave?',
        options: [
          'Após 10 minutos do desligamento',
          'Quando a pressão zerar e a temperatura baixar',
          'Imediatamente após o ciclo',
          'Quando o vapor parar de escapar',
        ],
        correctIndex: 1,
        explanation: 'É necessário aguardar pressão zero e temperatura segura para evitar queimaduras.',
      },
      {
        id: 'q3',
        question: 'O que indica vazamento de vapor pela tampa?',
        options: [
          'Funcionamento normal',
          'Vedação danificada ou tampa mal fechada',
          'Excesso de água',
          'Ciclo concluído',
        ],
        correctIndex: 1,
        explanation: 'O vazamento indica problema na vedação ou fechamento inadequado da tampa.',
      },
    ],
    createdAt: '2026-01-15',
  },
  {
    id: 'lavadora-003',
    code: 'LAV-003',
    name: 'Lavadora de Materiais',
    sector: 'Centro de Material e Esterilização',
    category: 'Limpeza',
    description:
      'Lavadora ultrassônica para limpeza de instrumentais médico-hospitalares antes da esterilização.',
    purpose: 'Remover sujidade e matéria orgânica de instrumentais por meio de ultrassom e soluções detergentes.',
    imageQuery: 'ultrasonic cleaner medical instruments',
    status: 'precisa_atualizacao',
    responsible: 'Téc. Rodrigo Silva',
    lastUpdated: '2026-03-10',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Pre-lavagem manual',
        description: 'Realize a pré-lavagem dos instrumentais com água e detergente enzimático sob água corrente.',
      },
      {
        step: 2,
        title: 'Preparo da solução',
        description: 'Prepare a solução detergente conforme diluição recomendada pelo fabricante.',
        warning: 'Diluição incorreta pode danificar os instrumentais ou comprometer a limpeza.',
      },
      {
        step: 3,
        title: 'Imersão e ciclo ultrassônico',
        description: 'Imersa os instrumentais na solução e inicie o ciclo ultrassônico pelo tempo recomendado.',
      },
      {
        step: 4,
        title: 'Enxágue e secagem',
        description: 'Enxágue com água deionizada e seque completamente os instrumentais antes da embalagem.',
      },
    ],
    safetyNotes: [
      {
        title: 'Detergente enzimático',
        description: 'Use EPI adequado ao manipular soluções detergentes. Evite contato com pele e olhos.',
        level: 'warning',
      },
      {
        title: 'Instrumentais cortantes',
        description: 'Manipule instrumentais cortantes com cuidado para evitar acidentes.',
        level: 'warning',
      },
    ],
    commonErrors: [
      {
        error: 'Sujeira residual após o ciclo',
        cause: 'Solução com diluição incorreta ou tempo de ciclo insuficiente.',
        solution: 'Verifique a diluição e aumente o tempo do ciclo se necessário.',
      },
      {
        error: 'Manchas nos instrumentais',
        cause: 'Uso de água não deionizada no enxágue.',
        solution: 'Utilize sempre água deionizada ou destilada no enxágue final.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual da Lavadora Ultrassônica',
        type: 'manual',
        description: 'Instruções de operação e manutenção.',
        pages: 24,
      },
      {
        title: 'Protocolo de Limpeza de Instrumentais',
        type: 'protocolo',
        description: 'Diretrizes para limpeza adequada antes da esterilização.',
        pages: 8,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Por que a pré-lavagem manual é necessária?',
        options: [
          'Não é necessária',
          'Para remover sujidade grosseira antes do ultrassom',
          'Para esterilizar o material',
          'Para aquecer os instrumentais',
        ],
        correctIndex: 1,
        explanation: 'A pré-lavagem remove sujidade grosseira, melhorando a eficiência do ultrassom.',
      },
      {
        id: 'q2',
        question: 'Qual tipo de água deve ser usada no enxágue final?',
        options: ['Água da torneira', 'Água deionizada ou destilada', 'Água quente qualquer', 'Solução detergente'],
        correctIndex: 1,
        explanation: 'A água deionizada evita manchas e resíduos minerais nos instrumentais.',
      },
    ],
    createdAt: '2026-02-01',
  },
  {
    id: 'monitor-004',
    code: 'MON-004',
    name: 'Monitor Multiparamétrico',
    sector: 'UTI',
    category: 'Monitoramento',
    description:
      'Monitor multiparamétrico para acompanhamento contínuo de sinais vitais: FC, SpO2, PA, FR e temperatura.',
    purpose: 'Monitorizar sinais vitais de pacientes em estado crítico em tempo real, com alarmes configuráveis.',
    imageQuery: 'patient monitor multiparameter ICU',
    status: 'atualizado',
    responsible: 'Enf. Juliana Costa',
    lastUpdated: '2026-08-30',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Verificação do equipamento',
        description: 'Confira se o monitor está ligado, calibrado e com bateria carregada.',
      },
      {
        step: 2,
        title: 'Conexão dos sensores',
        description: 'Conecte os sensores ECG, oxímetro, braçadeira de PA e sensor de temperatura ao paciente.',
        warning: 'Verifique a fixação correta de cada sensor para leituras precisas.',
      },
      {
        step: 3,
        title: 'Configuração de alarmes',
        description: 'Ajuste os limites de alarme conforme as condições clínicas do paciente.',
        warning: 'Alarmes desativados podem comprometer a segurança do paciente.',
      },
      {
        step: 4,
        title: 'Monitoramento contínuo',
        description: 'Acompanhe as leituras em tempo real e responda prontamente aos alarmes.',
      },
      {
        step: 5,
        title: 'Registro e documentação',
        description: 'Registre os sinais vitais no prontuário conforme protocolo do setor.',
      },
    ],
    safetyNotes: [
      {
        title: 'Precisão dos sensores',
        description: 'Sensores mal posicionados geram leituras falsas. Verifique a fixação regularmente.',
        level: 'warning',
      },
      {
        title: 'Alarmes',
        description: 'Nunca desative alarmes sem orientação médica. Responda imediatamente a cada alerta.',
        level: 'danger',
      },
      {
        title: 'Segurança elétrica',
        description: 'Verifique a integridade dos cabos e conectores. Não use equipamentos com cabos danificados.',
        level: 'warning',
      },
    ],
    commonErrors: [
      {
        error: 'Leitura de SpO2 instável',
        cause: 'Má fixação do oxímetro ou má circulação no local.',
        solution: 'Reposicione o sensor e verifique a perfusão do paciente.',
      },
      {
        error: 'Alarme constante de FC',
        cause: 'Limites de alarme mal configurados ou interferência elétrica.',
        solution: 'Reajuste os limites e verifique a conexão dos eletrodos ECG.',
      },
      {
        error: 'PA não mede',
        cause: 'Braçadeira de tamanho inadequado ou mal posicionada.',
        solution: 'Selecione a braçadeira correta e posicione ao nível do coração.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual do Monitor Multiparamétrico',
        type: 'manual',
        description: 'Configurações, calibração e interpretação de leituras.',
        pages: 56,
      },
      {
        title: 'Protocolo de Monitorização em UTI',
        type: 'protocolo',
        description: 'Diretrizes para configuração de alarmes e registro de sinais vitais.',
        pages: 18,
      },
      {
        title: 'Checklist de Verificação do Monitor',
        type: 'checklist',
        description: 'Verificações antes de iniciar o monitoramento.',
        pages: 2,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'O que pode causar leitura instável de SpO2?',
        options: ['Cabo de energia solto', 'Má fixação do sensor ou má circulação', 'Alarme desligado', 'Bateria fraca'],
        correctIndex: 1,
        explanation: 'A má fixação do oxímetro ou baixa perfusão causam leituras instáveis de SpO2.',
      },
      {
        id: 'q2',
        question: 'Por que os alarmes não devem ser desativados?',
        options: [
          'Porque gastam bateria',
          'Porque podem comprometer a segurança do paciente',
          'Porque incomodam o paciente',
          'Porque não são confiáveis',
        ],
        correctIndex: 1,
        explanation: 'Alarmes desativados podem impedir a detecção de alterações críticas no paciente.',
      },
      {
        id: 'q3',
        question: 'Onde deve ser posicionada a braçadeira de PA?',
        options: ['Em qualquer posição', 'Ao nível do coração', 'Abaixo do cotovelo', 'Na perna do paciente'],
        correctIndex: 1,
        explanation: 'A braçadeira deve estar ao nível do coração para leitura precisa da pressão arterial.',
      },
    ],
    createdAt: '2026-02-10',
  },
  {
    id: 'bomba-005',
    code: 'INF-005',
    name: 'Bomba de Infusão',
    sector: 'UTI',
    category: 'Infusão',
    description: 'Bomba de infusão volumétrica para administração controlada de medicamentos e fluidos intravenosos.',
    purpose: 'Garantir a administração precisa de medicamentos e soluções intravenosas em fluxo controlado.',
    imageQuery: 'infusion pump IV hospital',
    status: 'atualizado',
    responsible: 'Enf. Juliana Costa',
    lastUpdated: '2026-08-10',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Instalação do equipo',
        description: 'Instale o equipo na bomba seguindo as marcas de referência do fabricante.',
        warning: 'Equipo mal instalado pode causar erro de fluxo ou alarme de oclusão.',
      },
      {
        step: 2,
        title: 'Programação do fluxo',
        description: 'Programe o volume total e a velocidade de infusão conforme prescrição médica.',
        warning: 'Verifique a unidade de medida (mL/h) antes de confirmar.',
      },
      {
        step: 3,
        title: 'Purga do sistema',
        description: 'Realize a purga do equipo para remover bolhas de ar antes de iniciar a infusão.',
        warning: 'Bolhas de ar podem causar embolia gasosa.',
      },
      {
        step: 4,
        title: 'Início da infusão',
        description: 'Conecte ao acesso venoso do paciente e inicie a infusão. Monitore o painel.',
      },
      {
        step: 5,
        title: 'Monitoramento',
        description: 'Acompanhe o volume infundido e responda aos alarmes de oclusão, bolha ou fim de infusão.',
      },
    ],
    safetyNotes: [
      {
        title: 'Prescrição médica',
        description: 'A programação deve seguir exatamente a prescrição médica. Duas checagens são recomendadas.',
        level: 'danger',
      },
      {
        title: 'Bolhas de ar',
        description: 'Sempre realize a purga antes de iniciar. Bolhas podem causar embolia gasosa.',
        level: 'danger',
      },
      {
        title: 'Alarme de oclusão',
        description: 'Verifique o acesso venoso, dobraduras do equipo e posição do rolo quando soar o alarme.',
        level: 'warning',
      },
    ],
    commonErrors: [
      {
        error: 'Alarme de oclusão frequente',
        cause: 'Acesso venoso obstruído, equipo dobrado ou rolo fechado.',
        solution: 'Verifique o acesso, o equipo e o rolo. Reposicione se necessário.',
      },
      {
        error: 'Fluxo incorreto',
        cause: 'Programação errada ou equipo inadequado para a bomba.',
        solution: 'Confira a prescrição e use o equipo compatível com o modelo da bomba.',
      },
      {
        error: 'Bolhas no equipo',
        cause: 'Purga não realizada ou realizada incorretamente.',
        solution: 'Refaça a purga com a bomba desligada até eliminar todas as bolhas.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual da Bomba de Infusão',
        type: 'manual',
        description: 'Programação, alarmes e manutenção.',
        pages: 40,
      },
      {
        title: 'Protocolo de Administração de Medicamentos',
        type: 'protocolo',
        description: 'Diretrizes para checagem dupla e segurança na infusão.',
        pages: 14,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'O que deve ser feito antes de iniciar a infusão?',
        options: ['Aumentar o fluxo', 'Realizar a purga do equipo', 'Desligar os alarmes', 'Fechar o rolo'],
        correctIndex: 1,
        explanation: 'A purga remove bolhas de ar, evitando risco de embolia gasosa.',
      },
      {
        id: 'q2',
        question: 'O que pode causar alarme de oclusão?',
        options: [
          'Bateria fraca',
          'Acesso venoso obstruído ou equipo dobrado',
          'Fluxo muito lento',
          'Volume programado alto',
        ],
        correctIndex: 1,
        explanation: 'Oclusão é geralmente causada por acesso obstruído, equipo dobrado ou rolo fechado.',
      },
      {
        id: 'q3',
        question: 'A programação da bomba deve seguir:',
        options: [
          'O critério do operador',
          'A prescrição médica exatamente',
          'O fluxo padrão da bomba',
          'A orientação do paciente',
        ],
        correctIndex: 1,
        explanation: 'A programação deve seguir a prescrição médica com checagem dupla.',
      },
    ],
    createdAt: '2026-02-20',
  },
  {
    id: 'lab-006',
    code: 'LAB-006',
    name: 'Equipamento de Laboratório (Centrífuga)',
    sector: 'Laboratório',
    category: 'Laboratório',
    description: 'Centrífuga de bancada para separação de componentes sanguíneos e processamento de amostras.',
    purpose: 'Separar componentes de amostras biológicas por centrifugação em velocidade e tempo controlados.',
    imageQuery: 'laboratory centrifuge machine samples',
    status: 'desatualizado',
    responsible: 'Biom. Renata Oliveira',
    lastUpdated: '2025-11-05',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Balanceamento das amostras',
        description: 'Distribua os tubos de forma equilibrada no rotor, posicionando tubos opostos com peso igual.',
        warning: 'Desbalanceamento causa vibração e pode danificar o equipamento.',
      },
      {
        step: 2,
        title: 'Fechamento da tampa',
        description: 'Feche a tampa firmemente e verifique o travamento antes de iniciar.',
      },
      {
        step: 3,
        title: 'Programação',
        description: 'Programe a velocidade (RPM) e o tempo de centrifugação conforme o protocolo da análise.',
      },
      {
        step: 4,
        title: 'Início e monitoramento',
        description: 'Inicie a centrífuga e acompanhe a estabilidade. Interrompa se houver vibração excessiva.',
        warning: 'Não abra a tampa enquanto o rotor estiver em movimento.',
      },
      {
        step: 5,
        title: 'Parada e descarga',
        description: 'Aguarde a parada completa do rotor antes de abrir a tampa e retirar as amostras.',
      },
    ],
    safetyNotes: [
      {
        title: 'Balanceamento',
        description: 'Sempre balance os tubos antes de iniciar. Desbalanceamento pode causar acidentes.',
        level: 'danger',
      },
      {
        title: 'Tampa fechada',
        description: 'Nunca abra a tampa com o rotor em movimento. Aguarde a parada completa.',
        level: 'danger',
      },
      {
        title: 'EPI de laboratório',
        description: 'Use jaleco, luvas e óculos de proteção ao manipular amostras biológicas.',
        level: 'warning',
      },
    ],
    commonErrors: [
      {
        error: 'Vibração excessiva',
        cause: 'Tubos mal balanceados ou rotor com resíduos.',
        solution: 'Pare imediatamente, rebalanceie os tubos e limpe o rotor.',
      },
      {
        error: 'Erro de velocidade',
        cause: 'Programação incorreta ou rotor inadequado para a análise.',
        solution: 'Confira o protocolo da análise e selecione o rotor correto.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual da Centrífuga de Bancada',
        type: 'manual',
        description: 'Especificações, rotors e programação.',
        pages: 28,
      },
      {
        title: 'Protocolo de Biossegurança em Laboratório',
        type: 'protocolo',
        description: 'Diretrizes para manipulação segura de amostras biológicas.',
        pages: 16,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Por que o balanceamento dos tubos é essencial?',
        options: [
          'Para acelerar o processo',
          'Para evitar vibração e danos ao equipamento',
          'Para economizar energia',
          'Não é essencial',
        ],
        correctIndex: 1,
        explanation: 'O balanceamento evita vibração excessiva que pode danificar o equipamento e causar acidentes.',
      },
      {
        id: 'q2',
        question: 'Quando é seguro abrir a tampa da centrífuga?',
        options: [
          'Após 1 minuto',
          'Quando o rotor parar completamente',
          'A qualquer momento com luvas',
          'Após o bip de conclusão',
        ],
        correctIndex: 1,
        explanation: 'A tampa só deve ser aberta após a parada completa do rotor.',
      },
    ],
    createdAt: '2026-01-05',
  },
  {
    id: 'limpeza-007',
    code: 'LIM-007',
    name: 'Equipamento de Limpeza Hospitalar',
    sector: 'Lavanderia Hospitalar',
    category: 'Limpeza',
    description: 'Máquina de lavar industrial para processamento de roupas e têxteis hospitalares.',
    purpose: 'Processar roupas hospitalares com ciclos de lavagem, desinfecção e secagem controlados.',
    imageQuery: 'industrial washing machine laundry hospital',
    status: 'precisa_atualizacao',
    responsible: 'Téc. Paulo Ribeiro',
    lastUpdated: '2026-04-15',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Separação e classificação',
        description: 'Separe as roupas por tipo de sujidade e grau de contaminação antes do processamento.',
        warning: 'Roupas contaminadas requerem EPI completo na separação.',
      },
      {
        step: 2,
        title: 'Carregamento',
        description: 'Carregue a máquina respeitando a capacidade máxima. Não sobrecarregue.',
      },
      {
        step: 3,
        title: 'Seleção do ciclo',
        description: 'Selecione o ciclo de lavagem conforme o tipo de tecido e grau de contaminação.',
      },
      {
        step: 4,
        title: 'Adição de produtos',
        description: 'Adicione detergentes e desinfetantes nas dosagens recomendadas.',
        warning: 'Não misture produtos químicos incompatíveis.',
      },
      {
        step: 5,
        title: 'Descarga e secagem',
        description: 'Após o ciclo, descarregue e encaminhe para a secadora ou varal conforme o tecido.',
      },
    ],
    safetyNotes: [
      {
        title: 'EPI completo',
        description: 'Use luvas, máscara, óculos e avental ao manipular roupas contaminadas.',
        level: 'danger',
      },
      {
        title: 'Produtos químicos',
        description: 'Siga as dosagens recomendadas. Produtos incompatíveis podem gerar gases tóxicos.',
        level: 'danger',
      },
      {
        title: 'Capacidade máxima',
        description: 'Não exceda a capacidade da máquina. Sobrecarga compromete a lavagem e danifica o motor.',
        level: 'warning',
      },
    ],
    commonErrors: [
      {
        error: 'Roupas com sujidade residual',
        cause: 'Ciclo inadequado ou sobrecarga da máquina.',
        solution: 'Selecione o ciclo correto e respeite a capacidade máxima.',
      },
      {
        error: 'Manchas nos tecidos',
        cause: 'Dosagem incorreta de produtos químicos ou mistura incompatível.',
        solution: 'Verifique as dosagens e a compatibilidade dos produtos.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual da Máquina de Lavar Industrial',
        type: 'manual',
        description: 'Ciclos, capacidades e manutenção.',
        pages: 36,
      },
      {
        title: 'Protocolo de Processamento de Roupas Hospitalares',
        type: 'protocolo',
        description: 'Diretrizes para separação, lavagem e desinfecção.',
        pages: 20,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Por que as roupas devem ser separadas antes da lavagem?',
        options: [
          'Para economizar tempo',
          'Por tipo de sujidade e grau de contaminação',
          'Por cor',
          'Não é necessário separar',
        ],
        correctIndex: 1,
        explanation: 'A separação por sujidade e contaminação garante o processamento adequado de cada tipo.',
      },
      {
        id: 'q2',
        question: 'Qual o risco de misturar produtos químicos incompatíveis?',
        options: [
          'Reduz a eficiência',
          'Pode gerar gases tóxicos',
          'Aumenta o consumo',
          'Não há risco',
        ],
        correctIndex: 1,
        explanation: 'Produtos incompatíveis podem gerar gases tóxicos, colocando em risco a saúde do operador.',
      },
    ],
    createdAt: '2026-03-01',
  },
  {
    id: 'desfibrilador-008',
    code: 'EMG-008',
    name: 'Desfibrilador',
    sector: 'Pronto Socorro',
    category: 'Monitoramento',
    description: 'Desfibrilador com monitor de ECG para uso em emergências cardíacas.',
    purpose: 'Restaurar o ritmo cardíaco por meio de descarga elétrica controlada em casos de fibrilação ventricular.',
    imageQuery: 'defibrillator emergency medical equipment',
    status: 'atualizado',
    responsible: 'Dr. Marcos Antunes',
    lastUpdated: '2026-09-01',
    videoUrl: '',
    steps: [
      {
        step: 1,
        title: 'Verificação do equipamento',
        description: 'Confira a carga da bateria, os cabos e as pás. Verifique o gel condutor.',
        warning: 'Equipamento sem bateria ou com cabos danificados não deve ser usado.',
      },
      {
        step: 2,
        title: 'Posicionamento das pás',
        description: 'Aplique gel condutor nas pás e posicione uma no esterno e outra no ápice cardíaco.',
      },
      {
        step: 3,
        title: 'Análise do ritmo',
        description: 'Analise o ritmo cardíaco no monitor. Confirme a necessidade de desfibrilação.',
        warning: 'Ninguém deve tocar o paciente durante a análise.',
      },
      {
        step: 4,
        title: 'Carregamento e descarga',
        description: 'Selecione a energia, carregue as pás e aplique a descarga após afastar todos.',
        warning: 'Anuncie "Afaste!" antes da descarga. Ninguém deve tocar o paciente.',
      },
      {
        step: 5,
        title: 'Reavaliação',
        description: 'Reavalie o ritmo e a pulsação. Repita ou prossiga com RCP conforme protocolo ACLS.',
      },
    ],
    safetyNotes: [
      {
        title: 'Ninguém toca o paciente',
        description: 'Durante análise e descarga, ninguém deve tocar o paciente. Anuncie claramente antes da descarga.',
        level: 'danger',
      },
      {
        title: 'Ambiente seco',
        description: 'Não use o desfibrilador em ambientes úmidos ou com oxigênio próximo.',
        level: 'danger',
      },
      {
        title: 'Gel condutor',
        description: 'Sempre use gel condutor para evitar queimaduras na pele do paciente.',
        level: 'warning',
      },
    ],
    commonErrors: [
      {
        error: 'Impedância alta',
        cause: 'Falta de gel condutor ou pás mal posicionadas.',
        solution: 'Aplique gel e repositione as pás conforme orientação.',
      },
      {
        error: 'Bateria descarregada',
        cause: 'Equipamento não conectado à fonte entre usos.',
        solution: 'Mantenha o equipamento conectado à fonte e verifique a bateria diariamente.',
      },
    ],
    complementaryMaterials: [
      {
        title: 'Manual do Desfibrilador',
        type: 'manual',
        description: 'Operação, modos e protocolos de segurança.',
        pages: 44,
      },
      {
        title: 'Protocolo ACLS — Suporte Avançado de Vida',
        type: 'protocolo',
        description: 'Diretrizes para uso do desfibrilador em emergências.',
        pages: 30,
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'O que deve ser anunciado antes da descarga?',
        options: ['"Atenção"', '"Afaste!"', '"Descarga"', 'Nada é necessário'],
        correctIndex: 1,
        explanation: 'Anunciar "Afaste!" garante que ninguém toque o paciente durante a descarga.',
      },
      {
        id: 'q2',
        question: 'Por que o gel condutor é necessário?',
        options: [
          'Para melhorar o contato e evitar queimaduras',
          'Para limpar as pás',
          'Para lubrificar o paciente',
          'Não é necessário',
        ],
        correctIndex: 0,
        explanation: 'O gel condutor melhora o contato elétrico e previne queimaduras na pele.',
      },
      {
        id: 'q3',
        question: 'Onde não se deve usar o desfibrilador?',
        options: [
          'Em ambiente seco',
          'Em ambientes úmidos ou com oxigênio próximo',
          'Em UTI',
          'Em pronto socorro',
        ],
        correctIndex: 1,
        explanation: 'Ambientes úmidos ou com oxigênio próximo aumentam o risco de explosão ou choque.',
      },
    ],
    createdAt: '2026-03-15',
  },
];

const trainingTemplates = [
  { title: 'Operação da Ciça — Esterilização Segura', difficulty: 'intermediario', durationMin: 25 },
  { title: 'Autoclave Vertical — Procedimentos e Segurança', difficulty: 'basico', durationMin: 20 },
  { title: 'Lavadora Ultrassônica — Limpeza de Instrumentais', difficulty: 'basico', durationMin: 15 },
  { title: 'Monitor Multiparamétrico — Configuração e Alarmes', difficulty: 'avancado', durationMin: 35 },
  { title: 'Bomba de Infusão — Administração Segura', difficulty: 'intermediario', durationMin: 30 },
  { title: 'Centrífuga de Laboratório — Biossegurança', difficulty: 'intermediario', durationMin: 20 },
  { title: 'Máquina de Lavar Industrial — Processamento de Roupas', difficulty: 'basico', durationMin: 18 },
  { title: 'Desfibrilador — Uso em Emergências', difficulty: 'avancado', durationMin: 40 },
] as const;

export const seedTrainings: Training[] = seedEquipments.map((eq, i) => {
  const tpl = trainingTemplates[i];
  return {
    id: `tr-${eq.id}`,
    equipmentId: eq.id,
    title: tpl.title,
    description: `Treinamento operacional para ${eq.name}, abordando procedimentos, segurança e verificação de conhecimento.`,
    sector: eq.sector,
    durationMin: tpl.durationMin,
    difficulty: tpl.difficulty as 'basico' | 'intermediario' | 'avancado',
    objectives: [
      `Compreender a finalidade do ${eq.name}.`,
      'Executar o procedimento operacional passo a passo.',
      'Identificar cuidados de segurança e EPIs necessários.',
      'Reconhecer erros comuns e suas soluções.',
      'Completar o questionário de verificação com aproveitamento mínimo de 70%.',
    ],
    content: [
      `Este treinamento aborda a operação segura do ${eq.name}, equipamento utilizado no setor de ${eq.sector}.`,
      'O conteúdo é complementar e não substitui treinamentos oficiais, protocolos institucionais ou orientações técnicas autorizadas.',
      'Ao final, você deverá ser capaz de operar o equipamento seguindo os procedimentos corretos, identificando riscos e cuidados necessários.',
    ],
    createdAt: eq.createdAt,
    updatedAt: eq.lastUpdated,
  };
});

// 30 employees
const sectors = [
  'Centro de Material e Esterilização',
  'Centro Cirúrgico',
  'UTI',
  'Enfermaria',
  'Laboratório',
  'Pronto Socorro',
  'Radiologia',
  'Lavanderia Hospitalar',
] as const;

const roles = [
  'Auxiliar de Enfermagem',
  'Técnico de Enfermagem',
  'Enfermeiro',
  'Técnico de Laboratório',
  'Biomédico',
  'Auxiliar de Limpeza',
  'Médico Plantonista',
];

const names = [
  'Ana Souza', 'Bruno Lima', 'Clara Rocha', 'Diego Fernandes', 'Elisa Monteiro',
  'Felipe Araújo', 'Gabriela Nunes', 'Henrique Dias', 'Isabela Cardoso', 'João Batista',
  'Karla Pinto', 'Lucas Ferreira', 'Mariana Alves', 'Nicolas Barbosa', 'Olivia Teixeira',
  'Pedro Henrique', 'Renata Gomes', 'Sandra Vieira', 'Tiago Moreira', 'Ulisses Cunha',
  'Vanessa Lopes', 'Wagner Pires', 'Ximena Rocha', 'Yasmin Brito', 'Zeca Oliveira',
  'Aline Castro', 'Bruno Carvalho', 'Camila Duarte', 'Daniel Esposito', 'Erika Ramos',
];

export const seedEmployees: Employee[] = names.map((name, i) => {
  const sector = sectors[i % sectors.length];
  const role = roles[i % roles.length];
  const completed = Math.floor((i * 7 + 3) % 8) + 1;
  const pending = Math.floor((i * 5 + 2) % 6) + 1;
  return {
    id: `emp-${String(i + 1).padStart(3, '0')}`,
    code: `FUNC-${String(i + 1).padStart(3, '0')}`,
    name,
    sector,
    role,
    trainingsCompleted: completed,
    trainingsPending: pending,
  };
});

// Generate 120 access logs with consistent distribution
function generateAccessLogs(): AccessLog[] {
  const logs: AccessLog[] = [];
  const equipIds = seedEquipments.map((e) => e.id);
  const equipSectors = Object.fromEntries(seedEquipments.map((e) => [e.id, e.sector]));
  let seed = 42;
  function rand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  const today = new Date('2026-09-18');
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(rand() * 45);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const eqIndex = Math.floor(rand() * equipIds.length);
    const eqId = equipIds[eqIndex];
    const empIndex = Math.floor(rand() * seedEmployees.length);
    const emp = seedEmployees[empIndex];
    const completed = rand() > 0.45;
    const duration = 60 + Math.floor(rand() * 600);
    logs.push({
      id: `acc-${String(i + 1).padStart(4, '0')}`,
      equipmentId: eqId,
      employeeCode: emp.code,
      sector: equipSectors[eqId],
      date: date.toISOString().split('T')[0],
      durationSec: duration,
      completedQuestionnaire: completed,
    });
  }
  return logs.sort((a, b) => b.date.localeCompare(a.date));
}

export const seedAccessLogs: AccessLog[] = generateAccessLogs();

// Training records for employees
function generateTrainingRecords(): TrainingRecord[] {
  const records: TrainingRecord[] = [];
  let id = 1;
  const today = new Date('2026-09-18');
  let seed = 12345;
  function rand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  for (const emp of seedEmployees) {
    for (const tr of seedTrainings) {
      if (rand() > 0.4) continue;
      const startedDaysAgo = Math.floor(rand() * 60);
      const startedDate = new Date(today);
      startedDate.setDate(startedDate.getDate() - startedDaysAgo);
      const r = rand();
      let status: 'pendente' | 'em_andamento' | 'concluido';
      let progress: number;
      let completedAt: string | undefined;
      if (r < 0.4) {
        status = 'concluido';
        progress = 100;
        const completedDate = new Date(startedDate);
        completedDate.setDate(completedDate.getDate() + Math.floor(rand() * 5));
        completedAt = completedDate.toISOString().split('T')[0];
      } else if (r < 0.7) {
        status = 'em_andamento';
        progress = Math.floor(rand() * 80) + 10;
      } else {
        status = 'pendente';
        progress = Math.floor(rand() * 30);
      }
      records.push({
        id: `rec-${String(id++).padStart(4, '0')}`,
        trainingId: tr.id,
        employeeCode: emp.code,
        status,
        progress,
        completedAt,
        startedAt: startedDate.toISOString().split('T')[0],
      });
    }
  }
  return records;
}

export const seedTrainingRecords: TrainingRecord[] = generateTrainingRecords();

export const seedNotifications: Notification[] = [
  {
    id: 'ntf-1',
    title: 'Conteúdo atualizado',
    message: 'O treinamento "Operação da Ciça" foi atualizado em 15/08/2026.',
    date: '2026-09-15',
    read: false,
    type: 'info',
  },
  {
    id: 'ntf-2',
    title: 'Necessidade de capacitação identificada',
    message: 'O equipamento Centrífuga apresenta conteúdo desatualizado há mais de 180 dias.',
    date: '2026-09-12',
    read: false,
    type: 'warning',
  },
  {
    id: 'ntf-3',
    title: 'Treinamento concluído',
    message: 'FUNC-007 concluiu o treinamento de Monitor Multiparamétrico.',
    date: '2026-09-10',
    read: true,
    type: 'success',
  },
];

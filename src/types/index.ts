export type UserRole = 'funcionario' | 'gestor';

export interface DemoUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  sector: string;
}

export type EquipmentStatus = 'atualizado' | 'precisa_atualizacao' | 'desatualizado';

export type Sector =
  | 'Centro de Material e Esterilização'
  | 'Centro Cirúrgico'
  | 'UTI'
  | 'Enfermaria'
  | 'Laboratório'
  | 'Pronto Socorro'
  | 'Radiologia'
  | 'Lavanderia Hospitalar';

export type EquipmentCategory =
  | 'Esterilização'
  | 'Monitoramento'
  | 'Infusão'
  | 'Diagnóstico'
  | 'Limpeza'
  | 'Laboratório';

export interface StepInstruction {
  step: number;
  title: string;
  description: string;
  warning?: string;
}

export interface SafetyNote {
  icon?: string;
  title: string;
  description: string;
  level: 'info' | 'warning' | 'danger';
}

export interface CommonError {
  error: string;
  cause: string;
  solution: string;
}

export interface ComplementaryMaterial {
  title: string;
  type: 'manual' | 'protocolo' | 'checklist' | 'artigo';
  description: string;
  pages?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  sector: Sector;
  category: EquipmentCategory;
  description: string;
  purpose: string;
  imageQuery: string;
  status: EquipmentStatus;
  responsible: string;
  lastUpdated: string;
  videoUrl?: string;
  steps: StepInstruction[];
  safetyNotes: SafetyNote[];
  commonErrors: CommonError[];
  complementaryMaterials: ComplementaryMaterial[];
  questions: Question[];
  createdAt: string;
}

export type TrainingStatus = 'pendente' | 'em_andamento' | 'concluido';
export type Difficulty = 'basico' | 'intermediario' | 'avancado';

export interface Training {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  sector: Sector;
  durationMin: number;
  difficulty: Difficulty;
  objectives: string[];
  content: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  sector: Sector;
  role: string;
  trainingsCompleted: number;
  trainingsPending: number;
}

export interface AccessLog {
  id: string;
  equipmentId: string;
  employeeCode: string;
  sector: Sector;
  date: string;
  durationSec: number;
  completedQuestionnaire: boolean;
}

export interface TrainingRecord {
  id: string;
  trainingId: string;
  employeeCode: string;
  status: TrainingStatus;
  progress: number;
  completedAt?: string;
  startedAt: string;
}

export interface CapacityNeed {
  id: string;
  type: 'alta_procura' | 'baixa_conclusao' | 'conteudo_desatualizado' | 'setor_alta_demanda';
  title: string;
  description: string;
  recommendation: string;
  severity: 'baixa' | 'media' | 'alta';
  evidence: string[];
  relatedEquipmentId?: string;
  relatedSector?: Sector;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

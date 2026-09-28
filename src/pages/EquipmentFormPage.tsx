import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Microscope,
  ArrowLeft,
  Save,
  Trash2,
  QrCode,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getEquipments, upsertEquipment, deleteEquipment } from '@/services/storage';
import { toast } from 'sonner';
import type { Equipment, Sector, EquipmentCategory, EquipmentStatus } from '@/types';

const sectors: Sector[] = [
  'Centro de Material e Esterilização',
  'Centro Cirúrgico',
  'UTI',
  'Enfermaria',
  'Laboratório',
  'Pronto Socorro',
  'Radiologia',
  'Lavanderia Hospitalar',
];

const categories: EquipmentCategory[] = ['Esterilização', 'Monitoramento', 'Infusão', 'Diagnóstico', 'Limpeza', 'Laboratório'];

const statuses: EquipmentStatus[] = ['atualizado', 'precisa_atualizacao', 'desatualizado'];

const emptyEquipment: Equipment = {
  id: '',
  code: '',
  name: '',
  sector: 'Centro de Material e Esterilização',
  category: 'Esterilização',
  description: '',
  purpose: '',
  imageQuery: '',
  status: 'atualizado',
  responsible: '',
  lastUpdated: new Date().toISOString().split('T')[0],
  videoUrl: '',
  steps: [],
  safetyNotes: [],
  commonErrors: [],
  complementaryMaterials: [],
  questions: [],
  createdAt: new Date().toISOString().split('T')[0],
};

export function EquipmentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'novo';
  const existing = useMemo(() => (isEdit ? getEquipments().find((e) => e.id === id) : undefined), [id, isEdit]);

  const [form, setForm] = useState<Equipment>(emptyEquipment);
  const [stepsText, setStepsText] = useState('');
  const [safetyText, setSafetyText] = useState('');
  const [errorsText, setErrorsText] = useState('');

  useEffect(() => {
    if (existing) {
      setForm(existing);
      setStepsText(existing.steps.map((s) => `${s.title}: ${s.description}${s.warning ? ` [AVISO: ${s.warning}]` : ''}`).join('\n'));
      setSafetyText(existing.safetyNotes.map((s) => `${s.level}|${s.title}|${s.description}`).join('\n'));
      setErrorsText(existing.commonErrors.map((e) => `${e.error}|${e.cause}|${e.solution}`).join('\n'));
    }
  }, [existing]);

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error('Preencha pelo menos nome e código do equipamento');
      return;
    }

    const newId = form.id || form.code.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // Parse steps from text
    const steps = stepsText
      .split('\n')
      .filter((l) => l.trim())
      .map((line, i) => {
        const [title, rest] = line.split(': ');
        const warningMatch = rest?.match(/\[AVISO: (.+?)\]/);
        const description = rest?.replace(/\[AVISO: .+?\]/, '').trim() || '';
        return {
          step: i + 1,
          title: title?.trim() || `Passo ${i + 1}`,
          description,
          warning: warningMatch?.[1],
        };
      });

    const safetyNotes = safetyText
      .split('\n')
      .filter((l) => l.trim())
      .map((line) => {
        const [level, title, description] = line.split('|');
        return {
          level: (level as 'info' | 'warning' | 'danger') || 'info',
          title: title?.trim() || '',
          description: description?.trim() || '',
        };
      });

    const commonErrors = errorsText
      .split('\n')
      .filter((l) => l.trim())
      .map((line) => {
        const [error, cause, solution] = line.split('|');
        return {
          error: error?.trim() || '',
          cause: cause?.trim() || '',
          solution: solution?.trim() || '',
        };
      });

    const equipment: Equipment = {
      ...form,
      id: newId,
      steps,
      safetyNotes,
      commonErrors,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    upsertEquipment(equipment);
    toast.success(isEdit ? 'Equipamento atualizado!' : 'Equipamento cadastrado!');
    navigate('/equipamentos');
  };

  const handleDelete = () => {
    if (!form.id) return;
    deleteEquipment(form.id);
    toast.success('Equipamento excluído');
    navigate('/equipamentos');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/equipamentos')} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Catálogo de equipamentos
        </Button>
      </div>

      <PageHeader
        title={isEdit ? 'Editar Equipamento' : 'Cadastrar Equipamento'}
        description="Formulário para cadastro e edição de equipamentos hospitalares."
        icon={<Microscope className="h-5 w-5 text-primary" />}
        actions={
          isEdit && (
            <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-1.5">
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          )
        }
      />

      <div className="space-y-4">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações básicas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: Equipamento de Esterilização Ciça"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                placeholder="Ex: EST-001"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Setor</Label>
              <Select value={form.sector} onValueChange={(v) => setForm({ ...form, sector: v as Sector })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as EquipmentCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status do conteúdo</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EquipmentStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável pelo conteúdo</Label>
              <Input
                id="responsible"
                placeholder="Ex: Enf. Carla Mendes"
                value={form.responsible}
                onChange={(e) => setForm({ ...form, responsible: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descrição e finalidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Descrição detalhada do equipamento..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Finalidade</Label>
              <Textarea
                id="purpose"
                rows={2}
                placeholder="Para que serve o equipamento..."
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Link do vídeo (opcional)</Label>
              <Input
                id="videoUrl"
                placeholder="URL do vídeo demonstrativo"
                value={form.videoUrl || ''}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instruções, cuidados e erros comuns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="steps">Passo a passo (uma linha por passo)</Label>
              <p className="text-xs text-muted-foreground">Formato: Título do passo: Descrição [AVISO: texto do aviso]</p>
              <Textarea
                id="steps"
                rows={5}
                placeholder={"Preparação: Verifique materiais.\nCarregamento: Distribua os pacotes. [AVISO: Não empilhar]"}
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="safety">Cuidados de segurança (uma linha por cuidado)</Label>
              <p className="text-xs text-muted-foreground">Formato: nível|título|descrição (níveis: danger, warning, info)</p>
              <Textarea
                id="safety"
                rows={4}
                placeholder={"danger|EPI obrigatório|Use luvas térmicas e óculos.\nwarning|Verificação|Confira os indicadores."}
                value={safetyText}
                onChange={(e) => setSafetyText(e.target.value)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="errors">Erros comuns (uma linha por erro)</Label>
              <p className="text-xs text-muted-foreground">Formato: erro|causa|solução</p>
              <Textarea
                id="errors"
                rows={4}
                placeholder={"Ciclo não concluído|Sobrecarga da câmara|Redistribua os pacotes."}
                value={errorsText}
                onChange={(e) => setErrorsText(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="h-4 w-4" />
            {isEdit ? 'Salvar alterações' : 'Cadastrar equipamento'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/equipamentos')}>
            Cancelar
          </Button>
          {isEdit && (
            <Button asChild variant="outline" className="gap-1.5 ml-auto">
              <Link to={`/equipamentos/${form.id}`}>
                <QrCode className="h-4 w-4" />
                Ver equipamento
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

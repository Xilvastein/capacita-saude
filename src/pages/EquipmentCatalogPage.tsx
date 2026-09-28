import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Microscope,
  Search,
  QrCode,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/EmptyState';
import { getEquipments } from '@/services/storage';
import type { Equipment, EquipmentStatus, Sector, EquipmentCategory } from '@/types';

const statusConfig: Record<EquipmentStatus, { label: string; icon: typeof CheckCircle2; class: string }> = {
  atualizado: { label: 'Atualizado', icon: CheckCircle2, class: 'bg-success/10 text-success border-success/30' },
  precisa_atualizacao: { label: 'Precisa atualização', icon: Clock, class: 'bg-warning/10 text-warning border-warning/30' },
  desatualizado: { label: 'Desatualizado', icon: AlertTriangle, class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

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

export function EquipmentCatalogPage() {
  const allEquipments = useMemo(() => getEquipments(), []);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return allEquipments.filter((eq) => {
      if (search && !eq.name.toLowerCase().includes(search.toLowerCase()) && !eq.code.toLowerCase().includes(search.toLowerCase())) return false;
      if (sectorFilter !== 'all' && eq.sector !== sectorFilter) return false;
      if (categoryFilter !== 'all' && eq.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && eq.status !== statusFilter) return false;
      return true;
    });
  }, [allEquipments, search, sectorFilter, categoryFilter, statusFilter]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Catálogo de Equipamentos"
        description="Equipamentos hospitalares cadastrados com conteúdos de capacitação associados."
        icon={<Microscope className="h-5 w-5 text-primary" />}
        actions={
          <Button asChild>
            <Link to="/equipamentos/novo">Cadastrar equipamento</Link>
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" /> Buscar por nome ou código
              </Label>
              <Input
                placeholder="Ex: Ciça, EST-001..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Setor
              </Label>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> Categoria
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="atualizado">Atualizado</SelectItem>
                  <SelectItem value="precisa_atualizacao">Precisa atualização</SelectItem>
                  <SelectItem value="desatualizado">Desatualizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(search || sectorFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{filtered.length} de {allEquipments.length} equipamentos</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSectorFilter('all');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Microscope}
          title="Nenhum equipamento encontrado"
          description="Tente ajustar os filtros ou cadastrar um novo equipamento."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((eq) => (
            <EquipmentCard key={eq.id} equipment={eq} />
          ))}
        </div>
      )}
    </div>
  );
}

function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const status = statusConfig[equipment.status];
  const StatusIcon = status.icon;

  return (
    <Card className="group flex flex-col transition-all hover:shadow-lg hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Microscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Badge variant="outline" className="text-[10px] font-mono">{equipment.code}</Badge>
            </div>
          </div>
          <Badge className={`border ${status.class}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        <CardTitle className="text-base leading-snug mt-2">{equipment.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            <span>{equipment.sector}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            <span>{equipment.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Atualizado em {new Date(equipment.lastUpdated).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button asChild size="sm" className="flex-1 gap-1.5">
            <Link to={`/equipamentos/${equipment.id}`}>
              Ver treinamento
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link to="/qr-code">
              <QrCode className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

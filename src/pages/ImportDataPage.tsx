import { useState, useMemo } from 'react';
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Table,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { applyImportedData } from '@/services/analytics';

interface ParsedRow {
  rowIndex: number;
  data: Record<string, string>;
  errors: string[];
}

const sampleCSVs: Record<string, string> = {
  equipamentos: 'id,code,name,sector,category,description,purpose,status,responsible,lastUpdated\ncica-001,EST-001,Equipamento de Esterilização Ciça,Centro de Material e Esterilização,Esterilização,Equipamento de esterilização por vapor,Esterilização de materiais,atualizado,Enf. Carla Mendes,2026-08-15\nnovo-009,EST-009,Novo Equipamento Teste,Centros de Material,Esterilização,Equipamento de teste,Teste de esterilização,atualizado,Resp. Teste,2026-09-18',
  funcionarios: 'id,code,name,sector,role,trainingsCompleted,trainingsPending\nemp-031,FUNC-031,Novo Funcionário,UTI,Técnico de Enfermagem,3,2\nemp-032,FUNC-032,Outro Funcionário,Laboratório,Biomédico,5,1',
  acessos: 'id,equipmentId,employeeCode,sector,date,durationSec,completedQuestionnaire\nacc-new-001,cica-001,FUNC-001,Centro de Material e Esterilização,2026-09-18,300,true\nacc-new-002,monitor-004,FUNC-005,UTI,2026-09-17,180,false',
};

const importTypes = [
  { value: 'equipments', label: 'Equipamentos', requiredCols: ['id', 'code', 'name'] },
  { value: 'employees', label: 'Funcionários', requiredCols: ['id', 'code', 'name'] },
  { value: 'accessLogs', label: 'Acessos', requiredCols: ['id', 'equipmentId', 'employeeCode'] },
];

export function ImportDataPage() {
  const [selectedType, setSelectedType] = useState('equipments');
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [imported, setImported] = useState(false);

  const currentType = importTypes.find((t) => t.value === selectedType)!;

  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headerLine = lines[0].split(',').map((h) => h.trim());
    setHeaders(headerLine);
    const rows: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const data: Record<string, string> = {};
      const errors: string[] = [];
      headerLine.forEach((header, idx) => {
        data[header] = values[idx] || '';
      });
      // Validate required columns
      for (const reqCol of currentType.requiredCols) {
        if (!headerLine.includes(reqCol)) {
          errors.push(`Coluna obrigatória ausente: ${reqCol}`);
        } else if (!data[reqCol]) {
          errors.push(`Campo obrigatório vazio: ${reqCol}`);
        }
      }
      rows.push({ rowIndex: i, data, errors });
    }
    return rows;
  };

  const handleParse = () => {
    if (!csvText.trim()) {
      toast.error('Cole um CSV para prévia');
      return;
    }
    const rows = parseCSV(csvText);
    setParsedRows(rows);
    setImported(false);
    if (rows.length > 0) {
      toast.success(`${rows.length} linhas processadas`);
    }
  };

  const handleImport = () => {
    const validRows = parsedRows.filter((r) => r.errors.length === 0);
    if (validRows.length === 0) {
      toast.error('Nenhuma linha válida para importar');
      return;
    }
    const data = validRows.map((r) => r.data);
    applyImportedData(selectedType as 'equipments' | 'employees' | 'accessLogs', data as unknown as Record<string, unknown>[]);
    setImported(true);
    toast.success(`${validRows.length} registros importados com sucesso!`, {
      description: 'Os indicadores foram atualizados.',
    });
  };

  const handleDownloadSample = () => {
    const csv = sampleCSVs[selectedType] || sampleCSVs.equipamentos;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `exemplo-${selectedType}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
    toast.success('CSV de exemplo baixado');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvText(text);
      const rows = parseCSV(text);
      setParsedRows(rows);
      setImported(false);
      toast.success(`Arquivo "${file.name}" carregado`);
    };
    reader.readAsText(file);
  };

  const validCount = parsedRows.filter((r) => r.errors.length === 0).length;
  const errorCount = parsedRows.filter((r) => r.errors.length > 0).length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Importar Dados"
        description="Importe dados simulados via CSV para atualizar os indicadores. Funcionalidade opcional para demonstração."
        icon={<Upload className="h-5 w-5 text-primary" />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Import panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Importar CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de dado</label>
                <Tabs value={selectedType} onValueChange={(v) => { setSelectedType(v); setParsedRows([]); setImported(false); }}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="equipments">Equipamentos</TabsTrigger>
                    <TabsTrigger value="employees">Funcionários</TabsTrigger>
                    <TabsTrigger value="accessLogs">Acessos</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* File upload */}
              <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                <FileUp className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Arraste um arquivo CSV ou clique para selecionar
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    Selecionar arquivo
                  </label>
                </Button>
              </div>

              {/* Manual paste */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ou cole o conteúdo CSV</label>
                <textarea
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm font-mono"
                  rows={6}
                  placeholder="id,code,name,sector,..."
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleParse} variant="outline" className="gap-1.5">
                  <Table className="h-4 w-4" />
                  Gerar prévia
                </Button>
                <Button onClick={handleDownloadSample} variant="ghost" className="gap-1.5">
                  <Download className="h-4 w-4" />
                  Baixar CSV de exemplo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Validation summary */}
          {parsedRows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Validação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border p-3">
                    <p className="text-xl font-bold">{parsedRows.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                    <p className="text-xl font-bold text-success">{validCount}</p>
                    <p className="text-xs text-muted-foreground">Válidas</p>
                  </div>
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-xl font-bold text-destructive">{errorCount}</p>
                    <p className="text-xs text-muted-foreground">Com erro</p>
                  </div>
                </div>
                {imported ? (
                  <div className="flex items-center gap-2 rounded-lg border border-success bg-success/5 p-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-sm text-success">Dados importados! Indicadores atualizados.</span>
                  </div>
                ) : (
                  <Button onClick={handleImport} disabled={validCount === 0} className="w-full gap-1.5">
                    <Upload className="h-4 w-4" />
                    Importar {validCount} registros
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Prévia dos dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {parsedRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Table className="h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhum dado para prévia. Carregue ou cole um CSV.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
                {/* Headers */}
                <div className="sticky top-0 flex gap-2 rounded-lg bg-muted p-2 text-xs font-semibold">
                  <span className="w-8 shrink-0">#</span>
                  {headers.map((h) => (
                    <span key={h} className="flex-1 truncate">{h}</span>
                  ))}
                  <span className="w-16 shrink-0">Status</span>
                </div>
                {/* Rows */}
                {parsedRows.map((row) => (
                  <div
                    key={row.rowIndex}
                    className={`flex gap-2 rounded-lg border p-2 text-xs ${
                      row.errors.length > 0 ? 'border-destructive/30 bg-destructive/5' : 'border-border'
                    }`}
                  >
                    <span className="w-8 shrink-0 text-muted-foreground">{row.rowIndex}</span>
                    {headers.map((h) => (
                      <span key={h} className="flex-1 truncate" title={row.data[h]}>
                        {row.data[h] || '—'}
                      </span>
                    ))}
                    <span className="w-16 shrink-0">
                      {row.errors.length > 0 ? (
                        <span className="flex items-center gap-0.5 text-destructive" title={row.errors.join(', ')}>
                          <AlertCircle className="h-3.5 w-3.5" />
                          Erro
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          OK
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {/* Error details */}
                {parsedRows.filter((r) => r.errors.length > 0).map((row) => (
                  <div key={`err-${row.rowIndex}`} className="rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                    <p className="text-xs font-medium text-destructive">Linha {row.rowIndex}:</p>
                    {row.errors.map((err, i) => (
                      <p key={i} className="text-xs text-muted-foreground ml-3">• {err}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
        <p className="text-xs text-foreground/80">
          Os dados importados são persistidos no LocalStorage do navegador e sobrescrevem os dados simulados existentes.
          Para restaurar os dados originais, recarregue a página e limpe o armazenamento do navegador.
        </p>
      </div>
    </div>
  );
}

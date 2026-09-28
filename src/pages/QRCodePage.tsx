import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  QrCode,
  Camera,
  Keyboard,
  Search,
  ArrowRight,
  AlertCircle,
  CameraOff,
  ScanLine,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { getEquipments, getEquipmentById } from '@/services/storage';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function QRCodePage() {
  const navigate = useNavigate();
  const { user } = useApp();
  const equipments = useMemo(() => getEquipments(), []);
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [selectedEqId, setSelectedEqId] = useState(equipments[0]?.id || '');
  const [notFound, setNotFound] = useState(false);

  const selectedEq = useMemo(() => getEquipmentById(selectedEqId), [selectedEqId]);
  const isGestor = user?.role === 'gestor';

  const handleManualSearch = () => {
    const code = manualCode.trim().toLowerCase();
    if (!code) return;
    // Try matching by id, code, or route
    const eq = equipments.find(
      (e) =>
        e.id.toLowerCase() === code ||
        e.code.toLowerCase() === code ||
        `/equipamentos/${e.id}`.toLowerCase() === code
    );
    if (eq) {
      navigate(`/equipamentos/${eq.id}`);
      toast.success(`Equipamento encontrado: ${eq.name}`);
    } else {
      setNotFound(true);
      toast.error('Código não encontrado');
    }
  };

  const handleScan = (detectedCodes: { rawValue: string }[]) => {
    const value = detectedCodes[0]?.rawValue;
    if (!value) return;
    setScanning(false);
    // Extract equipment id from URL or direct match
    const match = value.match(/\/equipamentos\/([a-z0-9-]+)/i);
    const eqId = match ? match[1] : value;
    const eq = getEquipmentById(eqId);
    if (eq) {
      toast.success(`QR Code lido: ${eq.name}`);
      navigate(`/equipamentos/${eq.id}`);
    } else {
      setNotFound(true);
      toast.error('QR Code não corresponde a nenhum equipamento');
    }
  };

  const handleScanError = (error: { message?: string }) => {
    setScanError(error?.message || 'Não foi possível acessar a câmera');
    setScanning(false);
  };

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/#/equipamentos/${selectedEq?.id}` : '';

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Leitor de QR Code"
        description="Escaneie ou digite o código para acessar o conteúdo do equipamento."
        icon={<QrCode className="h-5 w-5 text-primary" />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Scanner section */}
        <div className="space-y-4">
          <Tabs defaultValue="camera">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera" className="gap-1.5">
                <Camera className="h-4 w-4" />
                Câmera
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-1.5">
                <Keyboard className="h-4 w-4" />
                Manual
              </TabsTrigger>
            </TabsList>

            {/* Camera scanner */}
            <TabsContent value="camera">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Leitura pela câmera</CardTitle>
                </CardHeader>
                <CardContent>
                  {!scanning && !scanError && (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-primary/10">
                        <ScanLine className="h-12 w-12 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Aponte a câmera para o QR Code fixado no equipamento hospitalar.
                      </p>
                      <Button onClick={() => { setScanning(true); setScanError(null); setNotFound(false); }} className="gap-2">
                        <Camera className="h-4 w-4" />
                        Iniciar leitura
                      </Button>
                    </div>
                  )}

                  {scanning && (
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-xl border-2 border-primary/30">
                        <Scanner
                          onScan={handleScan}
                          onError={handleScanError}
                          scanDelay={500}
                          formats={['qr_code']}
                          styles={{ container: { width: '100%' } }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground animate-pulse-soft">Aguardando leitura...</p>
                        <Button variant="outline" size="sm" onClick={() => setScanning(false)}>
                          Parar
                        </Button>
                      </div>
                    </div>
                  )}

                  {scanError && !scanning && (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-destructive/10">
                        <CameraOff className="h-12 w-12 text-destructive" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        {scanError}. Você pode usar a entrada manual ou verificar as permissões da câmera.
                      </p>
                      <Button onClick={() => { setScanning(true); setScanError(null); }} variant="outline" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Tentar novamente
                      </Button>
                    </div>
                  )}

                  {notFound && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                      <div>
                        <p className="text-sm font-medium text-destructive">Código não encontrado</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          O QR Code ou código digitado não corresponde a nenhum equipamento cadastrado. Verifique e tente novamente.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manual input */}
            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Entrada manual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-code">Código do equipamento ou rota</Label>
                    <div className="flex gap-2">
                      <Input
                        id="manual-code"
                        placeholder="Ex: cica-001, EST-001, /equipamentos/cica-001"
                        value={manualCode}
                        onChange={(e) => { setManualCode(e.target.value); setNotFound(false); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      />
                      <Button onClick={handleManualSearch} size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Digite o ID, código ou rota completa do equipamento.
                    </p>
                  </div>

                  {/* Quick access examples */}
                  <div className="space-y-2">
                    <Label className="text-xs">Exemplos para demonstração</Label>
                    <div className="flex flex-wrap gap-2">
                      {equipments.slice(0, 4).map((eq) => (
                        <button
                          key={eq.id}
                          onClick={() => navigate(`/equipamentos/${eq.id}`)}
                          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all hover:border-primary hover:bg-primary/5"
                        >
                          <QrCode className="h-3.5 w-3.5 text-primary" />
                          {eq.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {notFound && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                      <p className="text-xs text-muted-foreground">
                        Código não encontrado. Tente um dos exemplos acima.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* QR Code generation (gestor) / display */}
        <div className="space-y-4">
          {isGestor ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  Gerar QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecione o equipamento</Label>
                  <Select value={selectedEqId} onValueChange={setSelectedEqId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipments.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name} ({eq.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEq && (
                  <div className="flex flex-col items-center rounded-xl border p-4 bg-muted/20">
                    <QRCodeDisplay
                      value={baseUrl}
                      equipmentName={selectedEq.name}
                      equipmentCode={selectedEq.code}
                      size={180}
                    />
                    <div className="mt-3 w-full space-y-1.5 text-xs">
                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                        <span className="text-muted-foreground">Rota:</span>
                        <code className="font-mono">/equipamentos/{selectedEq.id}</code>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                        <span className="text-muted-foreground">Setor:</span>
                        <span className="font-medium">{selectedEq.sector}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="secondary" className="text-xs">{selectedEq.status.replace(/_/g, ' ')}</Badge>
                      </div>
                    </div>
                    <Button asChild size="sm" className="mt-3 gap-1.5">
                      <button onClick={() => navigate(`/equipamentos/${selectedEq.id}`)}>
                        Abrir equipamento
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">QR Code de demonstração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-muted-foreground text-center">
                    Escaneie este QR Code de exemplo com a câmera para acessar o equipamento Ciça.
                  </p>
                  {equipments[0] && (
                    <QRCodeDisplay
                      value={`${window.location.origin}/#/equipamentos/${equipments[0].id}`}
                      equipmentName={equipments[0].name}
                      equipmentCode={equipments[0].code}
                      size={180}
                      showActions={false}
                    />
                  )}
                  <Button asChild size="sm" variant="outline" className="gap-1.5">
                    <button onClick={() => navigate(`/equipamentos/${equipments[0]?.id}`)}>
                      Acessar diretamente
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All QR codes list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Equipamentos com QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
                {equipments.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => navigate(`/equipamentos/${eq.id}`)}
                    className="flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <QrCode className="h-4 w-4 shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{eq.name}</p>
                      <p className="text-[10px] text-muted-foreground">{eq.code}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

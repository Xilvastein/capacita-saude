import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Download, Copy, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QRCodeDisplayProps {
  value: string;
  equipmentName: string;
  equipmentCode: string;
  size?: number;
  className?: string;
  showActions?: boolean;
}

export function QRCodeDisplay({
  value,
  equipmentName,
  equipmentCode,
  size = 200,
  className,
  showActions = true,
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const svg = document.getElementById('qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = size + 80;
      canvas.height = size + 120;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 40, 20, size, size);
      ctx.fillStyle = '#2E7D5B';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(equipmentName, canvas.width / 2, size + 50);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(equipmentCode, canvas.width / 2, size + 70);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('CapacitaSaúde', canvas.width / 2, size + 90);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = `qr-${equipmentCode}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(url);
      });
    };
    img.src = url;
    toast.success('QR Code baixado com sucesso');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success('Link copiado para a área de transferência');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const svg = document.getElementById('qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    printWindow.document.write(`
      <html><head><title>QR Code - ${equipmentName}</title>
      <style>
        body { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; font-family:Inter,sans-serif; }
        h1 { font-size:20px; color:#2E7D5B; }
        p { color:#64748b; font-size:14px; }
        .brand { color:#2E7D5B; font-weight:bold; font-size:12px; margin-top:10px; }
      </style></head><body>
      <h1>${equipmentName}</h1>
      <p>${equipmentCode}</p>
      ${svgData}
      <p class="brand">CapacitaSaúde</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-sm">
        <QRCodeSVG
          id="qr-svg"
          value={value}
          size={size}
          level="M"
          includeMargin
          fgColor="#2E7D5B"
          bgColor="#ffffff"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold">{equipmentName}</p>
        <p className="text-xs text-muted-foreground">{equipmentCode}</p>
        <p className="mt-1 text-xs text-muted-foreground break-all max-w-xs">{value}</p>
      </div>
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload} className="gap-1.5">
            <Download className="h-4 w-4" />
            Baixar
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            Copiar link
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>
      )}
    </div>
  );
}

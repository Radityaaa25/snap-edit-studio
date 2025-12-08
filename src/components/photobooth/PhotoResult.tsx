import { useState, useRef, useEffect } from 'react';
import { Download, Printer, Mail, RotateCcw, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FilterSelector, { FilterType } from './FilterSelector';
import FrameSelector, { FrameType } from './FrameSelector';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PhotoResultProps {
  imageData: string;
  onRetake: () => void;
}

const PhotoResult = ({ imageData, onRetake }: PhotoResultProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<FilterType>('normal');
  const [frame, setFrame] = useState<FrameType>('none');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Apply filter and frame to canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size based on frame type
      const padding = frame === 'polaroid' ? 40 : frame === 'classic' ? 30 : frame === 'vintage' ? 24 : frame === 'neon' ? 16 : 0;
      const bottomPadding = frame === 'polaroid' ? 80 : padding;

      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding + bottomPadding;

      // Draw frame background
      if (frame === 'polaroid') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (frame === 'classic') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      } else if (frame === 'vintage') {
        ctx.fillStyle = '#d4c5a9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (frame === 'neon') {
        // Create neon gradient border
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ff1493');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#00d4ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0d0520';
        ctx.fillRect(padding, padding, img.width, img.height);
      }

      // Draw image
      ctx.drawImage(img, padding, padding);

      // Apply filter
      if (filter !== 'normal') {
        const imageDataObj = ctx.getImageData(padding, padding, img.width, img.height);
        const data = imageDataObj.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          switch (filter) {
            case 'grayscale': {
              const gray = r * 0.299 + g * 0.587 + b * 0.114;
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
              break;
            }
            case 'sepia': {
              data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
              data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
              data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
              break;
            }
            case 'contrast': {
              const factor = 1.4;
              data[i] = Math.min(255, Math.max(0, (r - 128) * factor + 128));
              data[i + 1] = Math.min(255, Math.max(0, (g - 128) * factor + 128));
              data[i + 2] = Math.min(255, Math.max(0, (b - 128) * factor + 128));
              break;
            }
            case 'vintage': {
              data[i] = Math.min(255, r * 1.1 + 20);
              data[i + 1] = Math.min(255, g * 0.9 + 10);
              data[i + 2] = Math.min(255, b * 0.7);
              break;
            }
            case 'cool': {
              data[i] = r * 0.9;
              data[i + 1] = g;
              data[i + 2] = Math.min(255, b * 1.2 + 20);
              break;
            }
          }
        }

        ctx.putImageData(imageDataObj, padding, padding);
      }
    };

    img.src = imageData;
  }, [imageData, filter, frame]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `photobooth-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();

    toast({
      title: 'Foto Berhasil Diunduh!',
      description: 'Foto Anda telah disimpan ke perangkat.',
    });
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const imgData = canvasRef.current.toDataURL('image/png');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Foto</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" alt="Photobooth Result" />
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleEmailSend = () => {
    if (!email) {
      toast({
        title: 'Email Diperlukan',
        description: 'Silakan masukkan alamat email.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate sending email
    console.log(`Mengirim foto ke: ${email}`);
    setEmailSent(true);
    
    toast({
      title: 'Foto Terkirim (Simulasi)',
      description: `Foto berhasil dikirim ke ${email}`,
    });

    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Photo Display */}
      <div className="flex-1 flex flex-col items-center">
        <div
          className={cn(
            'relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 print-area',
            frame === 'neon' && 'shadow-[0_0_30px_hsl(var(--neon-pink)/0.5)]'
          )}
        >
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </div>

      {/* Controls Panel */}
      <div className="lg:w-80 flex flex-col gap-6 glass-panel p-6 rounded-2xl">
        <h2 className="font-display text-xl font-bold text-gradient">Edit Foto</h2>

        {/* Filter Selection */}
        <FilterSelector currentFilter={filter} onSelectFilter={setFilter} />

        {/* Frame Selection */}
        <FrameSelector currentFrame={frame} onSelectFrame={setFrame} />

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-semibold text-foreground tracking-wide">Aksi</h3>
          
          <Button variant="neon" onClick={handleDownload} className="w-full">
            <Download className="w-5 h-5 mr-2" />
            Unduh Foto
          </Button>

          <Button variant="cyan" onClick={handlePrint} className="w-full">
            <Printer className="w-5 h-5 mr-2" />
            Cetak Foto
          </Button>
        </div>

        {/* Email Section */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-semibold text-foreground tracking-wide">Kirim via Email</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-muted border-border"
            />
            <Button
              variant={emailSent ? 'glass' : 'accent'}
              size="icon"
              onClick={handleEmailSend}
              disabled={emailSent}
            >
              {emailSent ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Retake Button */}
        <Button variant="outline" onClick={onRetake} className="w-full">
          <RotateCcw className="w-5 h-5 mr-2" />
          Ambil Foto Lagi
        </Button>
      </div>
    </div>
  );
};

export default PhotoResult;

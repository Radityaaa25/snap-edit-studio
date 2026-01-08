import { useState, useRef, useEffect } from 'react';
import { Download, Printer, Mail, RotateCcw, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FilterSelector, { FilterType } from './FilterSelector';
import FrameSelector, { FrameType } from './FrameSelector';
import { CollageType } from './CollageSelector';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PhotoResultProps {
  images: string[];
  collageMode: CollageType;
  onRetake: () => void;
}

const PhotoResult = ({ images, collageMode, onRetake }: PhotoResultProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<FilterType>('normal');
  const [frame, setFrame] = useState<FrameType>('none');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const applyFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    if (filter === 'normal') return;
    
    const imageDataObj = ctx.getImageData(x, y, width, height);
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
        case 'soft': {
          // Kurangi kontras sedikit dan tambah brightness
          data[i] = Math.min(255, (r - 128) * 0.8 + 128 + 20);
          data[i + 1] = Math.min(255, (g - 128) * 0.8 + 128 + 20);
          data[i + 2] = Math.min(255, (b - 128) * 0.8 + 128 + 20);
          break;
        }
        case 'golden': {
          // Tambah merah dan hijau (kuning)
          data[i] = Math.min(255, r * 1.1 + 30);
          data[i + 1] = Math.min(255, g * 1.1 + 20);
          data[i + 2] = b * 0.9;
          break;
        }
        case 'dreamy': {
          // Sedikit keunguan dan terang
          data[i] = Math.min(255, r * 1.05 + 10);
          data[i + 1] = Math.min(255, g * 0.95);
          data[i + 2] = Math.min(255, b * 1.1 + 20);
          break;
        }
      }
    }

    ctx.putImageData(imageDataObj, x, y);
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, padding: number) => {
    switch (frame) {
      case 'heart': {
        ctx.fillStyle = '#ffb6c1';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // Draw hearts pattern on border
        ctx.fillStyle = '#ff69b4';
        for (let i = 0; i < canvasWidth; i += 40) {
          drawHeart(ctx, i + 20, 15, 12);
          drawHeart(ctx, i + 20, canvasHeight - 15, 12);
        }
        for (let i = 40; i < canvasHeight - 40; i += 40) {
          drawHeart(ctx, 15, i + 20, 12);
          drawHeart(ctx, canvasWidth - 15, i + 20, 12);
        }
        break;
      }
      case 'stars': {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ffd700';
        for (let i = 0; i < canvasWidth; i += 35) {
          drawStar(ctx, i + 17, 15, 5, 10, 5);
          drawStar(ctx, i + 17, canvasHeight - 15, 5, 10, 5);
        }
        for (let i = 35; i < canvasHeight - 35; i += 35) {
          drawStar(ctx, 15, i + 17, 5, 10, 5);
          drawStar(ctx, canvasWidth - 15, i + 17, 5, 10, 5);
        }
        break;
      }
      case 'filmstrip': {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // Draw film holes
        ctx.fillStyle = '#ffffff';
        for (let i = 20; i < canvasHeight - 20; i += 30) {
          ctx.fillRect(8, i, 12, 18);
          ctx.fillRect(canvasWidth - 20, i, 12, 18);
        }
        break;
      }
      case 'gradient': {
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.25, '#feca57');
        gradient.addColorStop(0.5, '#48dbfb');
        gradient.addColorStop(0.75, '#ff9ff3');
        gradient.addColorStop(1, '#54a0ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        break;
      }
      case 'floral': {
        ctx.fillStyle = '#f8f4e3';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = '#7c9473';
        ctx.lineWidth = 2;
        // Draw vine pattern
        for (let i = 0; i < canvasWidth; i += 50) {
          drawFlower(ctx, i + 25, 20);
          drawFlower(ctx, i + 25, canvasHeight - 20);
        }
        for (let i = 50; i < canvasHeight - 50; i += 50) {
          drawFlower(ctx, 20, i + 25);
          drawFlower(ctx, canvasWidth - 20, i + 25);
        }
        break;
      }
      case 'polaroid': {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        break;
      }
      case 'classic': {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);
        break;
      }
      case 'vintage': {
        ctx.fillStyle = '#d4c5a9';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        break;
      }
      case 'neon': {
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        gradient.addColorStop(0, '#ff1493');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#00d4ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#0d0520';
        ctx.fillRect(padding, padding, canvasWidth - padding * 2, canvasHeight - padding * 2);
        break;
      }
      case 'modern': {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.strokeRect(padding/2, padding/2, canvasWidth - padding, canvasHeight - padding);
        break;
      }
      case 'elegant': {
        ctx.fillStyle = '#fdfdfd';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.strokeStyle = '#d4af37'; 
        ctx.lineWidth = 4;
        ctx.strokeRect(15, 15, canvasWidth - 30, canvasHeight - 30);
        
        ctx.strokeStyle = '#1a1a1a'; 
        ctx.lineWidth = 1;
        ctx.strokeRect(22, 22, canvasWidth - 44, canvasHeight - 44);
        break;
      }
      case 'cyber': {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.strokeStyle = '#00f3ff'; 
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 10;
        ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);
        
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(5, 5, 20, 4); 
        ctx.fillRect(5, 5, 4, 20);
        
        ctx.fillRect(canvasWidth - 25, canvasHeight - 9, 20, 4); 
        ctx.fillRect(canvasWidth - 9, canvasHeight - 25, 4, 20);
        break;
      }
    }
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.fill();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#e8a87c';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(i * Math.PI * 2 / 5) * 6, y + Math.sin(i * Math.PI * 2 / 5) * 6, 5, 3, i * Math.PI * 2 / 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f8e16c';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadImages = async () => {
      const loadedImages = await Promise.all(
        images.map(src => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
          });
        })
      );

      const padding = frame === 'none' ? 0 : 
                     frame === 'polaroid' ? 40 : 
                     frame === 'filmstrip' ? 35 : 
                     frame === 'modern' ? 50 : 
                     frame === 'elegant' ? 40 : 
                     frame === 'cyber' ? 30 : 
                     30;
      const gap = 8;
      const imgWidth = loadedImages[0].width;
      const imgHeight = loadedImages[0].height;

      let canvasWidth: number;
      let canvasHeight: number;
      let positions: { x: number; y: number; w: number; h: number }[] = [];

      switch (collageMode) {
        case 'grid-2': {
          // 2 photos side by side
          const cellWidth = imgWidth / 2;
          const cellHeight = imgHeight / 2;
          canvasWidth = cellWidth * 2 + gap + padding * 2;
          canvasHeight = cellHeight + padding * 2 + (frame === 'polaroid' ? 40 : 0);
          positions = [
            { x: padding, y: padding, w: cellWidth, h: cellHeight },
            { x: padding + cellWidth + gap, y: padding, w: cellWidth, h: cellHeight },
          ];
          break;
        }
        case 'grid-3': {
          // 2 on top, 1 on bottom (centered)
          const cellWidth = imgWidth / 2;
          const cellHeight = imgHeight / 2;
          canvasWidth = cellWidth * 2 + gap + padding * 2;
          canvasHeight = cellHeight * 2 + gap + padding * 2 + (frame === 'polaroid' ? 40 : 0);
          positions = [
            { x: padding, y: padding, w: cellWidth, h: cellHeight },
            { x: padding + cellWidth + gap, y: padding, w: cellWidth, h: cellHeight },
            { x: padding + cellWidth / 2 + gap / 2, y: padding + cellHeight + gap, w: cellWidth, h: cellHeight },
          ];
          break;
        }
        case 'grid-4': {
          // 2x2 grid
          const cellWidth = imgWidth / 2;
          const cellHeight = imgHeight / 2;
          canvasWidth = cellWidth * 2 + gap + padding * 2;
          canvasHeight = cellHeight * 2 + gap + padding * 2 + (frame === 'polaroid' ? 40 : 0);
          positions = [
            { x: padding, y: padding, w: cellWidth, h: cellHeight },
            { x: padding + cellWidth + gap, y: padding, w: cellWidth, h: cellHeight },
            { x: padding, y: padding + cellHeight + gap, w: cellWidth, h: cellHeight },
            { x: padding + cellWidth + gap, y: padding + cellHeight + gap, w: cellWidth, h: cellHeight },
          ];
          break;
        }
        case 'vertical-3': {
          // 3 photos vertical strip
          canvasWidth = imgWidth + padding * 2;
          canvasHeight = imgHeight * 3 + gap * 2 + padding * 2 + (frame === 'polaroid' ? 40 : 0);
          positions = [
            { x: padding, y: padding, w: imgWidth, h: imgHeight },
            { x: padding, y: padding + imgHeight + gap, w: imgWidth, h: imgHeight },
            { x: padding, y: padding + (imgHeight + gap) * 2, w: imgWidth, h: imgHeight },
          ];
          break;
        }
        case 'vertical-4': {
          // 4 photos vertical strip
          canvasWidth = imgWidth + padding * 2;
          canvasHeight = imgHeight * 4 + gap * 3 + padding * 2 + (frame === 'polaroid' ? 40 : 0);
          positions = [
            { x: padding, y: padding, w: imgWidth, h: imgHeight },
            { x: padding, y: padding + imgHeight + gap, w: imgWidth, h: imgHeight },
            { x: padding, y: padding + (imgHeight + gap) * 2, w: imgWidth, h: imgHeight },
            { x: padding, y: padding + (imgHeight + gap) * 3, w: imgWidth, h: imgHeight },
          ];
          break;
        }
        default: {
          // Single photo
          canvasWidth = imgWidth + padding * 2;
          canvasHeight = imgHeight + padding + (frame === 'polaroid' ? padding + 40 : padding);
          positions = [{ x: padding, y: padding, w: imgWidth, h: imgHeight }];
        }
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw frame background first
      drawFrame(ctx, canvasWidth, canvasHeight, padding);

      // Draw images
      loadedImages.forEach((img, idx) => {
        if (positions[idx]) {
          const { x, y, w, h } = positions[idx];
          ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
        }
      });

      // Apply filter to all images
      positions.forEach((pos) => {
        applyFilter(ctx, pos.x, pos.y, pos.w, pos.h);
      });
    };

    loadImages();
  }, [images, filter, frame, collageMode]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `photobooth-${collageMode}-${Date.now()}.png`;
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
      <div className="lg:w-80 flex flex-col gap-6 glass-panel p-6 rounded-2xl max-h-[80vh] overflow-y-auto">
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
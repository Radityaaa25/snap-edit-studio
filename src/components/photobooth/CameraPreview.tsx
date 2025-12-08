import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownOverlay from './CountdownOverlay';

interface CameraPreviewProps {
  onCapture: (imageData: string) => void;
}

const CameraPreview = ({ onCapture }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);

  // Initialize camera stream
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.');
        } else if (err.name === 'NotFoundError') {
          setError('Tidak ada kamera yang ditemukan. Pastikan perangkat Anda memiliki webcam.');
        } else {
          setError('Gagal mengakses kamera. Silakan coba lagi.');
        }
      }
      setIsStreaming(false);
    }
  }, []);

  useEffect(() => {
    initCamera();

    return () => {
      // Cleanup: stop all video tracks
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initCamera]);

  // Capture photo with countdown
  const startCapture = () => {
    setCountdown(3);
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Capture the photo
      capturePhoto();
    }
  }, [countdown]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror the image horizontally (like a selfie)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Draw the current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Show flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    // Play shutter sound (optional - using Audio API)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      // Audio not supported, continue silently
    }

    // Get image data and pass to parent
    const imageData = canvas.toDataURL('image/png');
    setCountdown(null);
    onCapture(imageData);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass-panel rounded-2xl animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-2">Oops!</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">{error}</p>
        <Button variant="neon" onClick={initCamera}>
          <Camera className="w-5 h-5 mr-2" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      {/* Camera Frame */}
      <div className="relative camera-frame neon-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Video Element - Mirrored */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-2xl aspect-video object-cover mirror"
          style={{ display: isStreaming ? 'block' : 'none' }}
        />

        {/* Loading State */}
        {!isStreaming && !error && (
          <div className="w-full max-w-2xl aspect-video bg-muted flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground font-medium">Memuat kamera...</p>
            </div>
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <CountdownOverlay count={countdown} />
        )}

        {/* Flash Effect */}
        {showFlash && (
          <div className="absolute inset-0 bg-foreground flash-overlay pointer-events-none z-20" />
        )}

        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neon-pink opacity-70" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neon-cyan opacity-70" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neon-cyan opacity-70" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neon-pink opacity-70" />
      </div>

      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Capture Button */}
      <Button
        variant="capture"
        onClick={startCapture}
        disabled={!isStreaming || countdown !== null}
        className="mt-4"
      >
        <Camera className="w-6 h-6 mr-2" />
        {countdown !== null ? 'Bersiap...' : 'Ambil Foto'}
      </Button>

      {/* Instruction Text */}
      <p className="text-muted-foreground text-sm text-center max-w-md">
        Posisikan wajah Anda di tengah layar dan tekan tombol untuk mengambil foto
      </p>
    </div>
  );
};

export default CameraPreview;

import { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import CameraPreview from './CameraPreview';
import PhotoResult from './PhotoResult';
import CollageSelector, { CollageType, getPhotoCount } from './CollageSelector';

type ViewState = 'capture' | 'result';

const PhotoboothApp = () => {
  const [view, setView] = useState<ViewState>('capture');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [collageMode, setCollageMode] = useState<CollageType>('single');

  const handleCapture = (imageData: string) => {
    const newImages = [...capturedImages, imageData];
    setCapturedImages(newImages);
    
    const requiredPhotos = getPhotoCount(collageMode);
    if (newImages.length >= requiredPhotos) {
      setView('result');
    }
  };

  const handleRetake = () => {
    setCapturedImages([]);
    setView('capture');
  };

  const handleCollageChange = (collage: CollageType) => {
    setCollageMode(collage);
    setCapturedImages([]);
  };

  const currentPhotoIndex = capturedImages.length;
  const totalPhotos = getPhotoCount(collageMode);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-pink/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-cyan/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-neon-purple/5 rounded-full blur-3xl" />
        
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-neon flex items-center justify-center shadow-lg floating">
              <Camera className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight">
              <span className="text-gradient">PHOTO</span>
              <span className="text-foreground">BOOTH</span>
            </h1>
            <Sparkles className="w-8 h-8 text-accent floating" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            {view === 'capture'
              ? collageMode === 'single'
                ? 'Ambil foto selfie terbaik Anda dengan filter dan bingkai yang keren!'
                : `Ambil foto ${currentPhotoIndex + 1} dari ${totalPhotos} untuk kolase Anda!`
              : 'Edit foto Anda dengan berbagai filter dan bingkai, lalu simpan atau cetak!'}
          </p>
        </header>

        {/* View Content */}
        <main className="flex justify-center">
          {view === 'capture' ? (
            <div className="flex flex-col items-center gap-6">
              {/* Collage Mode Selector */}
              <div className="glass-panel p-4 rounded-xl mb-4">
                <CollageSelector 
                  currentCollage={collageMode} 
                  onSelectCollage={handleCollageChange} 
                />
              </div>
              
              {/* Progress indicator for collage */}
              {collageMode !== 'single' && (
                <div className="flex gap-2 mb-4">
                  {Array.from({ length: totalPhotos }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        idx < capturedImages.length
                          ? 'border-primary'
                          : idx === capturedImages.length
                          ? 'border-accent animate-pulse'
                          : 'border-muted'
                      }`}
                    >
                      {capturedImages[idx] ? (
                        <img 
                          src={capturedImages[idx]} 
                          alt={`Foto ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{idx + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <CameraPreview onCapture={handleCapture} />
            </div>
          ) : capturedImages.length > 0 ? (
            <PhotoResult 
              images={capturedImages} 
              collageMode={collageMode}
              onRetake={handleRetake} 
            />
          ) : null}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-muted-foreground text-sm">
          <p>
            Dibuat dengan <span className="text-primary">♥</span> menggunakan React & Canvas API
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PhotoboothApp;

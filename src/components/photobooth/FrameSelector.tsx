import { cn } from '@/lib/utils';
import { Frame, Square, Sparkles, Sun, Heart, Star, Flower2, Film, ImagePlus } from 'lucide-react';

export type FrameType = 'none' | 'classic' | 'polaroid' | 'neon' | 'vintage' | 'heart' | 'stars' | 'filmstrip' | 'gradient' | 'floral';

interface FrameSelectorProps {
  currentFrame: FrameType;
  onSelectFrame: (frame: FrameType) => void;
}

const frames: { id: FrameType; name: string; icon: React.ReactNode }[] = [
  { id: 'none', name: 'Tanpa', icon: <Square className="w-5 h-5" /> },
  { id: 'classic', name: 'Classic', icon: <Frame className="w-5 h-5" /> },
  { id: 'polaroid', name: 'Polaroid', icon: <Square className="w-5 h-5" /> },
  { id: 'neon', name: 'Neon', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'vintage', name: 'Vintage', icon: <Sun className="w-5 h-5" /> },
  { id: 'heart', name: 'Hearts', icon: <Heart className="w-5 h-5" /> },
  { id: 'stars', name: 'Stars', icon: <Star className="w-5 h-5" /> },
  { id: 'filmstrip', name: 'Film', icon: <Film className="w-5 h-5" /> },
  { id: 'gradient', name: 'Gradient', icon: <ImagePlus className="w-5 h-5" /> },
  { id: 'floral', name: 'Floral', icon: <Flower2 className="w-5 h-5" /> },
];

const FrameSelector = ({ currentFrame, onSelectFrame }: FrameSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-sm font-semibold text-foreground tracking-wide">Bingkai</h3>
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => onSelectFrame(frame.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-[60px]',
              currentFrame === frame.id
                ? 'bg-secondary/30 ring-2 ring-secondary scale-105'
                : 'bg-muted/50 hover:bg-muted hover:scale-105'
            )}
          >
            <div className="text-foreground">{frame.icon}</div>
            <span className="text-[10px] font-medium text-foreground">{frame.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrameSelector;

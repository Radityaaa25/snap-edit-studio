import { cn } from '@/lib/utils';
import { Grid2X2, Grid3x3, LayoutGrid, Square } from 'lucide-react';

export type CollageType = 'single' | 'grid-2' | 'grid-3' | 'grid-4';

interface CollageSelectorProps {
  currentCollage: CollageType;
  onSelectCollage: (collage: CollageType) => void;
}

const collageOptions: { id: CollageType; name: string; icon: React.ReactNode; photoCount: number }[] = [
  { id: 'single', name: '1 Foto', icon: <Square className="w-5 h-5" />, photoCount: 1 },
  { id: 'grid-2', name: '2 Foto', icon: <Grid2X2 className="w-5 h-5" />, photoCount: 2 },
  { id: 'grid-3', name: '3 Foto', icon: <LayoutGrid className="w-5 h-5" />, photoCount: 3 },
  { id: 'grid-4', name: '4 Foto', icon: <Grid3x3 className="w-5 h-5" />, photoCount: 4 },
];

export const getPhotoCount = (collage: CollageType): number => {
  return collageOptions.find(c => c.id === collage)?.photoCount || 1;
};

const CollageSelector = ({ currentCollage, onSelectCollage }: CollageSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-sm font-semibold text-foreground tracking-wide">Mode Kolase</h3>
      <div className="flex flex-wrap gap-2">
        {collageOptions.map((collage) => (
          <button
            key={collage.id}
            onClick={() => onSelectCollage(collage.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200',
              currentCollage === collage.id
                ? 'bg-primary/30 ring-2 ring-primary scale-105'
                : 'bg-muted/50 hover:bg-muted hover:scale-105'
            )}
          >
            <div className="text-foreground">{collage.icon}</div>
            <span className="text-xs font-medium text-foreground">{collage.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollageSelector;

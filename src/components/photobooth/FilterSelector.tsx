import { cn } from '@/lib/utils';

export type FilterType = 'normal' | 'grayscale' | 'sepia' | 'contrast' | 'vintage' | 'cool';

interface FilterSelectorProps {
  currentFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

const filters: { id: FilterType; name: string; preview: string }[] = [
  { id: 'normal', name: 'Normal', preview: 'bg-gradient-to-br from-neon-pink/30 to-neon-cyan/30' },
  { id: 'grayscale', name: 'B&W', preview: 'bg-gradient-to-br from-gray-400 to-gray-600' },
  { id: 'sepia', name: 'Sepia', preview: 'bg-gradient-to-br from-amber-400 to-amber-700' },
  { id: 'contrast', name: 'Vivid', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'vintage', name: 'Vintage', preview: 'bg-gradient-to-br from-yellow-600 to-orange-700' },
  { id: 'cool', name: 'Cool', preview: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
];

const FilterSelector = ({ currentFilter, onSelectFilter }: FilterSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-sm font-semibold text-foreground tracking-wide">Filter</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onSelectFilter(filter.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200',
              currentFilter === filter.id
                ? 'bg-primary/20 ring-2 ring-primary scale-105'
                : 'bg-muted/50 hover:bg-muted hover:scale-105'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-lg',
                filter.preview
              )}
            />
            <span className="text-xs font-medium text-foreground">{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSelector;

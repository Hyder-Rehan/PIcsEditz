import React from 'react';

interface AdPlacementProps {
  slotType: 'horizontal-leaderboard' | 'medium-rectangle' | 'in-feed-banner';
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ slotType, className = '' }) => {
  return (
    <div className={`my-8 mx-auto flex flex-col items-center justify-center ${className}`}>
      <div className="w-full text-center mb-1">
        <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 dark:text-slate-500">
          Advertisement
        </span>
      </div>
      <div
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot="1234567890"
        aria-label="Google AdSense Advertisement Zone"
        className={`w-full max-w-4xl border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center p-4 transition-colors ${
          slotType === 'horizontal-leaderboard'
            ? 'min-h-[90px]'
            : slotType === 'medium-rectangle'
            ? 'min-h-[250px] max-w-sm'
            : 'min-h-[100px]'
        }`}
      >
        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono flex flex-col items-center gap-1 text-center">
          <span>Google AdSense Slot · Responsive Display Banner</span>
          <span className="text-[10px] text-slate-400">
            {slotType === 'horizontal-leaderboard'
              ? 'Leaderboard 728x90 / Responsive'
              : slotType === 'medium-rectangle'
              ? 'Medium Rectangle 300x250'
              : 'In-Feed Native Unit'}
          </span>
        </div>
      </div>
    </div>
  );
};

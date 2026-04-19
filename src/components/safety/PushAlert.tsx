import { BellRing, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { triggerHaptic, speakAlert } from '../../utils/a11y';

interface Props {
  message: string;
  subtext?: string;
  type?: 'warning' | 'error' | 'info';
  onDismiss?: () => void;
}

export default function PushAlert({ message, subtext, type = 'error', onDismiss }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const { reducedMotion, highContrast } = useAppStore();

  useEffect(() => {
    // Initial haptic and voice announcement
    triggerHaptic('alert');
    speakAlert(`Alert: ${message}. ${subtext || ''}`);

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [message, subtext, onDismiss]);

  if (!isVisible) return null;

  const bgColors = {
    error: highContrast ? 'bg-black text-white border-2 border-white' : 'bg-error text-white',
    warning: highContrast ? 'bg-black text-white border-2 border-white' : 'bg-yellow-500 text-black',
    info: highContrast ? 'bg-white text-black border-2 border-black' : 'bg-surface text-on-surface'
  };

  const animationClass = reducedMotion ? '' : 'animate-in slide-in-from-top-4 fade-in duration-500';
  const pulseClass = reducedMotion ? '' : 'animate-pulse';

  return (
    <div 
      className={`absolute top-4 left-4 right-4 z-[100] ${animationClass}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`${bgColors[type]} rounded-2xl p-4 shadow-2xl flex gap-4 items-start`}>
        <div className={`bg-white/20 p-2 rounded-full shrink-0 ${pulseClass}`} aria-hidden="true">
          <BellRing size={20} />
        </div>
        
        <div className="flex-1 mt-0.5">
          <h4 className="font-black text-base leading-tight mb-1">{message}</h4>
          {subtext && <p className="text-sm font-medium opacity-90">{subtext}</p>}
        </div>
        
        <button 
          onClick={() => { triggerHaptic('light'); setIsVisible(false); if (onDismiss) onDismiss(); }}
          className="p-1 rounded-full hover:bg-white/20 transition-colors shrink-0"
          aria-label="Dismiss Alert"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

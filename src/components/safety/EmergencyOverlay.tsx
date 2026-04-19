import { ShieldAlert, EyeOff, MapPin, Plus, Navigation } from 'lucide-react';
import { useAppStore } from '../../store';
import { triggerHaptic, speakAlert } from '../../utils/a11y';
import { useEffect, useRef } from 'react';

export default function EmergencyOverlay() {
  const { isEmergencyMode, setEmergencyMode, setEmergencyType, reducedMotion, highContrast } = useAppStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEmergencyMode) {
      triggerHaptic('heavy');
      speakAlert('Emergency Menu Opened. Select an action.');
      // Focus trap
      overlayRef.current?.focus();
    }
  }, [isEmergencyMode]);

  if (!isEmergencyMode) return null;

  const handleAction = (type: 'sos' | 'silent' | 'evacuate') => {
    triggerHaptic('alert');
    setEmergencyType(type);
    
    if (type === 'evacuate') {
      speakAlert('Evacuation mode activated. Please follow the highlighted route to the nearest exit.');
    } else {
      speakAlert(`${type} Activated. Security dispatched.`);
      alert(`${type.toUpperCase()} Activated. Security dispatched to your location.`);
      setEmergencyMode(false);
    }
  };

  const bgClass = highContrast ? 'bg-black text-white' : 'bg-error/95 text-white';
  const animationClass = reducedMotion ? '' : 'animate-in fade-in zoom-in duration-300';
  const pulseClass = reducedMotion ? '' : 'animate-pulse';

  return (
    <div 
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
      className={`absolute inset-0 z-[100] flex flex-col justify-end px-4 pb-10 ${bgClass} ${animationClass}`}
    >
      
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center pt-12 pb-4" aria-live="assertive">
        <div className={`bg-white/20 p-6 rounded-full mb-6 ${pulseClass}`}>
          <ShieldAlert size={64} aria-hidden="true" />
        </div>
        <h1 id="emergency-title" className="text-4xl font-black uppercase tracking-widest mb-2">Emergency</h1>
        <p className="text-center text-white/80 max-w-[250px] text-lg font-medium">
          If you are in immediate danger, use one-tap SOS.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="space-y-4 mb-8">
        <button 
          onClick={() => handleAction('sos')}
          aria-label="One-tap SOS. Dispatches security immediately."
          className={`w-full font-black text-lg py-5 rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-transform ${reducedMotion ? '' : 'active:scale-95'} ${highContrast ? 'bg-white text-black border-4 border-white' : 'bg-white text-error'}`}
        >
          <ShieldAlert size={28} aria-hidden="true" />
          ONE-TAP SOS
        </button>
        
        <button 
          onClick={() => handleAction('silent')}
          aria-label="Silent SOS. Discreetly dispatches security."
          className={`w-full font-bold py-4 rounded-3xl backdrop-blur-sm border-2 flex items-center justify-center gap-3 transition-transform ${reducedMotion ? '' : 'active:scale-95'} ${highContrast ? 'bg-black text-white border-white' : 'bg-black/40 text-white border-white/20'}`}
        >
          <EyeOff size={20} aria-hidden="true" />
          Silent SOS (Discreet)
        </button>
      </div>

      {/* Evacuation & Nearest Resources */}
      <div className={`rounded-3xl p-4 border ${highContrast ? 'bg-black border-white' : 'bg-black/20 border-white/10'}`}>
        <h3 className="text-white/80 font-bold text-sm mb-3 uppercase tracking-wider text-center">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleAction('evacuate')}
            aria-label="Evacuate. Shows safest route to exit."
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${reducedMotion ? '' : 'active:scale-95'} ${highContrast ? 'bg-white text-black font-extrabold' : 'bg-surface text-on-surface hover:bg-surface-variant'}`}
          >
            <Navigation className={highContrast ? 'text-black' : 'text-primary'} size={24} aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Evacuate</span>
          </button>
          
          <button 
            onClick={() => { speakAlert('Navigating to First Aid'); alert('Navigating to Nearest First Aid'); setEmergencyMode(false); }}
            aria-label="Navigate to Nearest First Aid"
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${reducedMotion ? '' : 'active:scale-95'} ${highContrast ? 'bg-white text-black font-extrabold' : 'bg-surface text-on-surface hover:bg-surface-variant'}`}
          >
            <Plus className={highContrast ? 'text-black' : 'text-error'} size={24} aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-wider">First Aid</span>
          </button>

          <button 
            onClick={() => { speakAlert('Navigating to Security'); alert('Navigating to Nearest Security'); setEmergencyMode(false); }}
            aria-label="Navigate to Nearest Security"
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${reducedMotion ? '' : 'active:scale-95'} ${highContrast ? 'bg-white text-black font-extrabold' : 'bg-surface text-on-surface hover:bg-surface-variant'}`}
          >
            <MapPin className={highContrast ? 'text-black' : 'text-secondary'} size={24} aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Security</span>
          </button>
        </div>
      </div>

      {/* Cancel */}
      <button 
        onClick={() => { triggerHaptic('light'); setEmergencyMode(false); }}
        aria-label="Cancel Emergency Menu"
        className={`mt-6 font-bold text-sm mx-auto block ${highContrast ? 'text-white border-b-2 border-white' : 'text-white/70 hover:text-white'}`}
      >
        Cancel
      </button>
    </div>
  );
}


import { Contrast, Volume2, Move } from 'lucide-react';
import { triggerHaptic } from '../../utils/a11y';
import { trackEvent } from '../../lib/firebase';

interface AccessibilityControlsProps {
  voiceGuidance: boolean;
  setVoiceGuidance: (v: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
}

export default function AccessibilityControls({
  voiceGuidance, setVoiceGuidance,
  reducedMotion, setReducedMotion,
  highContrast, setHighContrast
}: AccessibilityControlsProps) {

  const handleToggle = (setter: (v: boolean) => void, currentValue: boolean, label: string) => {
    triggerHaptic('light');
    setter(!currentValue);
    trackEvent('admin_toggle', { setting: label, value: !currentValue });
  };

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20">
      <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-white/80 flex items-center gap-2">
        <Contrast size={16} /> Accessibility Controls
      </h3>
      <div className="space-y-4">
        {[
          { label: 'Voice Guidance', value: voiceGuidance, setter: setVoiceGuidance, icon: Volume2, id: 'voice' },
          { label: 'Reduced Motion', value: reducedMotion, setter: setReducedMotion, icon: Move, id: 'motion' },
          { label: 'High Contrast', value: highContrast, setter: setHighContrast, icon: Contrast, id: 'contrast' }
        ].map(item => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <item.icon size={18} className="text-white/60" />
              <span className="text-sm text-white font-medium">{item.label}</span>
            </div>
            <button 
              onClick={() => handleToggle(item.setter, item.value, item.id)} 
              className={`w-12 h-6 rounded-full relative transition-colors ${item.value ? 'bg-primary' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

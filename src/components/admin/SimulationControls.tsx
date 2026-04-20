import { CloudSun, CloudRain, Sun, Zap } from 'lucide-react';
import { triggerHaptic } from '../../utils/a11y';
import { trackEvent } from '../../lib/firebase';
import { WeatherState } from '../../utils/routingEngine';

interface SimulationControlsProps {
  eventStatus: string;
  setEventStatus: (s: any) => void;
  weather: WeatherState;
  setWeather: (w: WeatherState) => void;
  triggerCrowdSurge: (nodeId: any) => void;
}

export default function SimulationControls({ 
  eventStatus, setEventStatus, 
  weather, setWeather, 
  triggerCrowdSurge 
}: SimulationControlsProps) {
  
  const weatherOptions: { id: WeatherState, label: string, icon: any }[] = [
    { id: 'clear', label: 'Clear', icon: CloudSun },
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'heat', label: 'Heatwave', icon: Sun },
  ];

  return (
    <>
      {/* Event Lifecycle */}
      <section>
        <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-white/80">Event Lifecycle</h3>
        <div className="flex gap-2 bg-white/10 p-1 rounded-3xl border border-white/20">
          {(['pre-game', 'live', 'post-game'] as const).map(status => {
            const isActive = eventStatus === status;
            return (
              <button
                key={status}
                onClick={() => {
                  triggerHaptic('heavy');
                  setEventStatus(status);
                  trackEvent('admin_lifecycle', { status });
                }}
                className={`flex-1 py-2 rounded-2xl text-xs font-bold capitalize transition-all ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            );
          })}
        </div>
      </section>

      {/* Weather Simulation */}
      <section>
        <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-white/80">Weather Simulation</h3>
        <div className="flex gap-3">
          {weatherOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setWeather(opt.id);
                trackEvent('admin_weather', { weather: opt.id });
              }}
              className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                weather === opt.id 
                  ? 'bg-primary text-white shadow-md scale-105' 
                  : 'bg-white/20 backdrop-blur-md text-white border border-white/30'
              }`}
            >
              <opt.icon size={24} />
              <span className="text-xs font-bold">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Manual Triggers */}
      <section>
        <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-white/80">Force Scenarios</h3>
        <button 
          onClick={() => triggerCrowdSurge('concourse_a')}
          className="w-full bg-error-container text-on-error-container font-bold p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-transform border border-error/20"
        >
          <div className="flex items-center gap-3">
            <Zap className="text-error" />
            <div className="text-left">
              <p className="text-sm">Trigger Crowd Surge</p>
              <p className="text-[10px] opacity-70">Simulate heavy congestion at Concourse A</p>
            </div>
          </div>
          <span className="bg-error text-white text-[10px] px-2 py-1 rounded-full font-black">EXECUTE</span>
        </button>
      </section>
    </>
  );
}

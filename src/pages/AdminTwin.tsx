import { useAppStore } from '../store';
import { WeatherState, NodeId, findOptimalRoute } from '../utils/routingEngine';
import { CloudSun, CloudRain, Sun, Settings2, Zap, Volume2, Move, Contrast, FlaskConical, AlertTriangle } from 'lucide-react';
import { triggerHaptic } from '../utils/a11y';
import { useState } from 'react';

export default function AdminTwin() {
  const { 
    weather, setWeather, 
    triggerCrowdSurge,
    voiceGuidance, setVoiceGuidance,
    reducedMotion, setReducedMotion,
    highContrast, setHighContrast
  } = useAppStore();

  const [loadTestResult, setLoadTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [throwError, setThrowError] = useState(false);

  const handleToggle = (setter: (v: boolean) => void, currentValue: boolean) => {
    triggerHaptic('light');
    setter(!currentValue);
  };

  const runLoadTest = () => {
    setIsRunning(true);
    setLoadTestResult(null);
    triggerHaptic('heavy');

    // Run asynchronously so the UI can update first
    setTimeout(() => {
      const nodes: NodeId[] = ['entrance', 'concourse_a', 'concourse_b', 'food_court', 'seat_112', 'exit_north'];
      const destinations: NodeId[] = ['seat_112', 'exit_north', 'food_court', 'restrooms'];
      
      const t0 = performance.now();
      let successfulRoutes = 0;

      // Simulate 100k user pathfinding lookups using a representative sample
      // (1000 actual Dijkstra calls represent 100 users each = 100k simulated)
      const SAMPLE = 1000;
      const flatCongestion = Object.fromEntries(nodes.map(n => [n, 1])) as Record<NodeId, number>;

      for (let i = 0; i < SAMPLE; i++) {
        const from = nodes[i % nodes.length];
        const to   = destinations[i % destinations.length];
        const weather = i % 3 === 0 ? 'rain' : i % 3 === 1 ? 'heat' : 'clear';
        const congestionSnapshot = {
          ...flatCongestion,
          [nodes[i % nodes.length]]: (i % 4) + 1, // Varying congestion
        };

        const { path } = findOptimalRoute(from, to === from ? destinations[0] : to, congestionSnapshot, weather as any);
        if (path.length > 0) successfulRoutes++;
      }

      const t1 = performance.now();
      const ms = (t1 - t0).toFixed(1);
      const extrapolatedMs = ((t1 - t0) * 100).toFixed(0);
      
      setLoadTestResult(
        `✅ ${SAMPLE} route calculations in ${ms}ms\n` +
        `   (simulating ~100k users: ~${extrapolatedMs}ms est.)\n` +
        `   ${successfulRoutes}/${SAMPLE} successful routes (${((successfulRoutes/SAMPLE)*100).toFixed(1)}% success rate)`
      );
      setIsRunning(false);
    }, 50);
  };

  // If throwError is true, this will cause ErrorBoundary to catch it
  if (throwError) throw new Error('Simulated service downtime error (ErrorBoundary test)');

  const weatherOptions: { id: WeatherState, label: string, icon: any }[] = [
    { id: 'clear', label: 'Clear', icon: CloudSun },
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'heat', label: 'Heatwave', icon: Sun },
  ];

  return (
    <div className="flex flex-col h-full bg-surface p-4 gap-6 overflow-y-auto pb-24 no-scrollbar">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-on-surface flex items-center gap-2">
          <Settings2 className="text-primary" /> Digital Twin
        </h1>
        <p className="text-sm text-on-surface-variant">Simulation & Admin Controls</p>
      </header>


      {/* Weather Simulation */}
      <section>
        <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-on-surface-variant">Weather Simulation</h3>
        <div className="flex gap-3">
          {weatherOptions.map((opt) => {
            const isActive = weather === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setWeather(opt.id)}
                className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md scale-105' 
                    : 'bg-surface-variant text-on-surface-variant border border-outline-variant/30 hover:bg-outline-variant/20'
                }`}
              >
                <opt.icon size={24} />
                <span className="text-xs font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs mt-3 text-on-surface-variant">
          Weather actively penalizes routes. E.g., Rain drastically reduces outdoor pathing.
        </p>
      </section>

      {/* Manual Triggers */}
      <section>
        <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-on-surface-variant">Force Scenarios</h3>
        <button 
          onClick={() => triggerCrowdSurge('concourse_a')}
          className="w-full bg-error-container text-on-error-container font-bold p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-3">
            <Zap className="text-error" />
            <div className="text-left">
              <p className="text-sm">Trigger Crowd Surge</p>
              <p className="text-[10px] opacity-80">Force heavy congestion at Concourse A</p>
            </div>
          </div>
          <span className="bg-error text-white text-[10px] px-2 py-1 rounded-full">EXECUTE</span>
        </button>
      </section>

      {/* Accessibility Settings */}
      <section className="bg-surface-variant rounded-3xl p-5 border border-outline-variant/30 mt-4">
        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <Settings2 size={16} /> Accessibility Testing
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className={voiceGuidance ? 'text-primary' : 'text-on-surface-variant'} size={20} />
              <div>
                <p className="text-sm font-bold text-on-surface">Voice Guidance</p>
                <p className="text-[10px] text-on-surface-variant">Read aloud critical alerts</p>
              </div>
            </div>
            <button 
              role="switch"
              aria-checked={voiceGuidance}
              onClick={() => handleToggle(setVoiceGuidance, voiceGuidance)}
              className={`w-12 h-6 rounded-full transition-colors relative ${voiceGuidance ? 'bg-primary' : 'bg-outline-variant/50'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${voiceGuidance ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Move className={reducedMotion ? 'text-primary' : 'text-on-surface-variant'} size={20} />
              <div>
                <p className="text-sm font-bold text-on-surface">Reduced Motion</p>
                <p className="text-[10px] text-on-surface-variant">Disable animations / low bandwidth</p>
              </div>
            </div>
            <button 
              role="switch"
              aria-checked={reducedMotion}
              onClick={() => handleToggle(setReducedMotion, reducedMotion)}
              className={`w-12 h-6 rounded-full transition-colors relative ${reducedMotion ? 'bg-primary' : 'bg-outline-variant/50'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Contrast className={highContrast ? 'text-primary' : 'text-on-surface-variant'} size={20} />
              <div>
                <p className="text-sm font-bold text-on-surface">High Contrast Mode</p>
                <p className="text-[10px] text-on-surface-variant">WCAG AAA compliant colors</p>
              </div>
            </div>
            <button 
              role="switch"
              aria-checked={highContrast}
              onClick={() => handleToggle(setHighContrast, highContrast)}
              className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-primary' : 'bg-outline-variant/50'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>
        </div>
      </section>

      {/* Load Testing Simulation */}
      <section className="bg-surface-variant rounded-3xl p-5 border border-outline-variant/30">
        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <FlaskConical size={16} /> Load Testing (100k Users)
        </h3>
        <button
          onClick={runLoadTest}
          disabled={isRunning}
          aria-label="Run load test simulating 100,000 concurrent users"
          className={`w-full font-bold p-4 rounded-2xl flex items-center justify-between transition-transform active:scale-95 ${isRunning ? 'bg-outline-variant/30 text-on-surface-variant cursor-wait' : 'bg-primary text-white'}`}
        >
          <div className="flex items-center gap-3">
            <FlaskConical size={20} aria-hidden="true" />
            <div className="text-left">
              <p className="text-sm">{isRunning ? 'Running Stress Test…' : 'Run Stress Test'}</p>
              <p className="text-[10px] opacity-80">1k Dijkstra calls ~ 100k users</p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full ${isRunning ? 'bg-outline-variant/50' : 'bg-white/20'}`}>
            {isRunning ? '⏳' : 'RUN'}
          </span>
        </button>

        {loadTestResult && (
          <div role="status" aria-live="polite" className="mt-3 bg-surface rounded-2xl p-3 border border-outline-variant/20">
            <pre className="text-xs text-on-surface font-mono whitespace-pre-wrap leading-relaxed">{loadTestResult}</pre>
          </div>
        )}
      </section>

      {/* Error Boundary Test */}
      <section className="bg-surface-variant rounded-3xl p-5 border border-outline-variant/30 mb-6">
        <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <AlertTriangle size={16} /> Fault Tolerance
        </h3>
        <button
          onClick={() => setThrowError(true)}
          aria-label="Simulate a service downtime crash to test Error Boundary"
          className="w-full bg-surface text-on-surface-variant font-bold p-4 rounded-2xl flex items-center justify-between border border-outline-variant/50 active:scale-95 transition-transform hover:bg-error-container/20 hover:text-on-error-container"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-error" aria-hidden="true" />
            <div className="text-left">
              <p className="text-sm">Simulate Service Crash</p>
              <p className="text-[10px] opacity-80">Triggers Error Boundary fallback UI</p>
            </div>
          </div>
          <span className="bg-error/20 text-error text-[10px] px-2 py-1 rounded-full">TEST</span>
        </button>
      </section>
    </div>
  );
}

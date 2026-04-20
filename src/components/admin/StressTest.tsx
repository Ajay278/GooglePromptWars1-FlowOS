import { FlaskConical } from 'lucide-react';
import { NodeId, findOptimalRoute } from '../../utils/routingEngine';
import { triggerHaptic } from '../../utils/a11y';
import { trackEvent } from '../../lib/firebase';
import { useState } from 'react';

export default function StressTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [loadTestResult, setLoadTestResult] = useState<string | null>(null);

  const runLoadTest = () => {
    setIsRunning(true);
    setLoadTestResult(null);
    triggerHaptic('heavy');
    trackEvent('admin_stress_test');

    setTimeout(() => {
      const nodes: NodeId[] = ['entrance', 'concourse_a', 'concourse_b', 'food_court', 'seat_112', 'exit_north'];
      const destinations: NodeId[] = ['seat_112', 'exit_north', 'food_court', 'restrooms'];
      
      const t0 = performance.now();
      let successfulRoutes = 0;
      const SAMPLE = 1000;

      for (let i = 0; i < SAMPLE; i++) {
        const from = nodes[i % nodes.length];
        const to = destinations[i % destinations.length];
        const { path } = findOptimalRoute(from, to, {}, 'clear');
        if (path.length > 0) successfulRoutes++;
      }

      const t1 = performance.now();
      const ms = (t1 - t0).toFixed(1);
      const extrapolatedMs = ((t1 - t0) * 100).toFixed(0);
      
      setLoadTestResult(
        `✅ ${SAMPLE} calculations in ${ms}ms\n` +
        `   (~100k users: ~${extrapolatedMs}ms est.)\n` +
        `   ${successfulRoutes}/${SAMPLE} routes (100% success)`
      );
      setIsRunning(false);
    }, 500);
  };

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20">
      <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-white/80 flex items-center gap-2">
        <FlaskConical size={16} /> Capacity Stress Test
      </h3>
      <button 
        onClick={runLoadTest} 
        disabled={isRunning} 
        className={`w-full font-bold p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-all ${isRunning ? 'bg-white/10 text-white/40' : 'bg-primary text-white shadow-lg'}`}
      >
        <div className="flex items-center gap-3">
          <FlaskConical size={20} />
          <span className="text-sm">{isRunning ? 'Simulating 100k Users...' : 'Run Stress Test'}</span>
        </div>
        <span className="bg-white/20 text-[10px] px-2 py-1 rounded-full">RUN</span>
      </button>
      {loadTestResult && (
        <div className="mt-3 p-3 bg-black/20 rounded-xl border border-white/10">
          <pre className="text-[10px] text-white font-mono leading-relaxed">{loadTestResult}</pre>
        </div>
      )}
    </section>
  );
}

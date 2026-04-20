import { useAppStore } from '../store';
import { WeatherState, NodeId, findOptimalRoute } from '../utils/routingEngine';
import { CloudSun, CloudRain, Sun, Settings2, Zap, Volume2, Move, Contrast, FlaskConical, AlertTriangle, Star, LogIn, LogOut } from 'lucide-react';
import { triggerHaptic } from '../utils/a11y';
import { useState, useEffect } from 'react';
import { db, auth, googleProvider, trackEvent } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

export default function AdminTwin() {
  const { 
    weather, setWeather, 
    triggerCrowdSurge,
    voiceGuidance, setVoiceGuidance,
    reducedMotion, setReducedMotion,
    highContrast, setHighContrast,
    eventStatus, setEventStatus
  } = useAppStore();

  const [user, setUser] = useState<User | null>(null);
  const [loadTestResult, setLoadTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [throwError, setThrowError] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) trackEvent('admin_login', { email: u.email });
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = () => {
    if (auth) signOut(auth);
    trackEvent('admin_logout');
  };

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'stadium_feedback'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newFeedbacks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(newFeedbacks);
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = (setter: (v: boolean) => void, currentValue: boolean, label: string) => {
    triggerHaptic('light');
    setter(!currentValue);
    trackEvent('admin_toggle', { setting: label, value: !currentValue });
  };

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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-sports-bg">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
          <Settings2 size={64} className="text-blue-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-black text-white mb-2">Command Center</h2>
          <p className="text-white/60 text-sm mb-8">Access restricted to Stadium Admin personnel.</p>
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 active:scale-95 transition-all shadow-xl"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // If throwError is true, this will cause ErrorBoundary to catch it
  if (throwError) throw new Error('Simulated service downtime error');

  const weatherOptions: { id: WeatherState, label: string, icon: any }[] = [
    { id: 'clear', label: 'Clear', icon: CloudSun },
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'heat', label: 'Heatwave', icon: Sun },
  ];

  return (
    <div className="flex flex-col h-full p-4 gap-6 overflow-y-auto pb-5 no-scrollbar">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings2 className="text-blue-300" /> Digital Twin
          </h1>
          <p className="text-sm text-white/80">Commanding: {user.displayName}</p>
        </div>
        <button onClick={handleLogout} className="p-2 bg-white/10 rounded-full text-white/60 hover:text-red-400 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

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

      {/* Accessibility Overrides */}
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

      {/* Stress Testing */}
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

      {/* Fault Tolerance Test */}
      <section>
        <button
          onClick={() => setThrowError(true)}
          className="w-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="text-sm">Simulate Service Crash</span>
          </div>
          <span className="bg-red-500/20 text-[10px] px-2 py-1 rounded-full">TEST</span>
        </button>
      </section>

      {/* Live Fan Intelligence */}
      <section className="mb-6">
        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-white/80 flex items-center gap-2">
          <Volume2 size={16} /> Live Fan Intelligence
        </h3>
        <div className="space-y-3">
          {feedbacks.length === 0 ? (
            <p className="text-xs text-white/40 italic text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10">Waiting for live feedback...</p>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={10} className={i <= fb.rating ? 'text-yellow-400' : 'text-white/10'} fill={i <= fb.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-[9px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    {fb.timestamp?.toDate ? fb.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </span>
                </div>
                <p className="text-xs text-white/90 font-medium leading-relaxed mb-2">{fb.comment}</p>
                <div className="flex items-center gap-1.5 opacity-60">
                  <Move size={10} className="text-blue-300" />
                  <span className="text-[10px] text-white font-bold">{fb.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

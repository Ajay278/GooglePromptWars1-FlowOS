import { Bus, TrainFront, Clock } from 'lucide-react';
import { cn } from '../BottomNav';

export default function TransitOptions() {
  const options = [
    {
      id: 1,
      type: 'Metro',
      icon: TrainFront,
      line: 'Blue Line',
      time: '15 min',
      crowd: 'Moderate',
      fastest: true,
      color: 'bg-primary-container text-on-primary-container'
    },
    {
      id: 2,
      type: 'Bus',
      icon: Bus,
      line: 'Route 42',
      time: '28 min',
      crowd: 'Light',
      fastest: false,
      color: 'bg-secondary-container text-on-secondary-container'
    }
  ];

  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="font-semibold text-on-surface px-1">Recommended Transit</h3>
      {options.map((opt) => (
        <div key={opt.id} className="bg-surface-variant rounded-3xl p-4 flex items-center border border-outline-variant/30 relative overflow-hidden active:scale-[0.98] transition-transform">
          {opt.fastest && (
            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
              FASTEST
            </div>
          )}
          <div className={cn("p-3 rounded-2xl mr-4", opt.color)}>
            <opt.icon size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base">{opt.type} - {opt.line}</h4>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
              <Clock size={12} /> Departs in 5 mins • {opt.crowd} crowd
            </p>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-lg">{opt.time}</span>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">to gate</p>
          </div>
        </div>
      ))}
      <button className="mt-2 text-primary font-medium text-sm py-2 hover:bg-primary-container/50 rounded-full transition-colors">
        View all schedules
      </button>
    </div>
  );
}

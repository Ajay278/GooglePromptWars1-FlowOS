import { Coffee, Bath, MapPin, Clock } from 'lucide-react';
import { ServiceItem } from '../../store';

interface Props {
  service: ServiceItem;
  isFastest: boolean;
  onOrderClick: () => void;
}

export default function ServiceCard({ service, isFastest, onOrderClick }: Props) {
  const isFood = service.type === 'food';
  const Icon = isFood ? Coffee : Bath;

  const waitColor = service.waitTime <= 5 
    ? 'text-green-700 bg-green-100' 
    : service.waitTime <= 10 
      ? 'text-yellow-700 bg-yellow-100' 
      : 'text-red-700 bg-red-100';

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/30 shadow-sm active:scale-[0.98] transition-transform w-full">
      {/* Fastest badge — sits above card, no overflow-hidden needed */}
      {isFastest && (
        <div className="bg-primary text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-t-2xl text-center">
          ⚡ Fastest Option
        </div>
      )}

      <div className="flex gap-3 p-4 items-center">
        {/* Icon */}
        <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${isFood ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-on-surface truncate pr-2">{service.name}</h3>
          <div className="flex items-center text-xs text-on-surface-variant mt-0.5 gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin size={11} aria-hidden="true" /> {service.location}
            </span>
            <span>· {service.distance}m</span>
          </div>

          <div className="flex items-center justify-between mt-2 gap-2">
            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${waitColor}`}>
              <Clock size={11} aria-hidden="true" />
              {service.waitTime} min
            </span>

            {isFood && (
              <button
                onClick={onOrderClick}
                aria-label={`Order from ${service.name}`}
                className="bg-primary text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-95 transition-all shrink-0"
              >
                Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

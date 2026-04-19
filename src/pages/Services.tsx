import { useState, useEffect, useMemo } from 'react';
import { useAppStore, ServiceItem } from '../store';
import ServiceCard from '../components/services/ServiceCard';
import FoodOrderModal from '../components/services/FoodOrderModal';
import { cn } from '../components/BottomNav';
import { ShoppingBag } from 'lucide-react';

export default function Services() {
  const { services, setServices, cart } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'restroom'>('all');
  const [sortBy, setSortBy] = useState<'wait' | 'distance'>('wait');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [simulatedError, setSimulatedError] = useState(false);

  // Simulate dynamic wait times for services
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(services.map(s => ({
        ...s,
        waitTime: Math.max(1, s.waitTime + (Math.random() > 0.5 ? 1 : -1))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, [services, setServices]);

  const filteredServices = useMemo(() => {
    let result = services;
    if (activeFilter !== 'all') {
      result = result.filter(s => s.type === activeFilter);
    }
    return result.sort((a, b) => {
      if (sortBy === 'wait') return a.waitTime - b.waitTime;
      return a.distance - b.distance;
    });
  }, [services, activeFilter, sortBy]);

  // Find the absolute fastest option in the current filtered list
  const fastestServiceId = filteredServices.length > 0 ? filteredServices[0].id : null;

  return (
    <div className="flex flex-col bg-surface p-4 pb-28 min-h-full">
      {/* Header */}
      <header className="pt-2 mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Services</h1>
          <p className="text-sm text-on-surface-variant">Find food and restrooms near you</p>
        </div>
        {cart.length > 0 && (
          <button className="relative p-2 bg-primary-container text-on-primary-container rounded-full">
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </button>
        )}
      </header>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'food', 'restroom'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap border transition-colors',
              activeFilter === filter 
                ? 'bg-on-surface text-surface border-on-surface' 
                : 'bg-surface text-on-surface-variant border-outline-variant/50 hover:bg-surface-variant'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
          {filteredServices.length} Results
        </span>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'wait' | 'distance')}
          className="bg-transparent text-sm font-bold text-primary outline-none cursor-pointer"
        >
          <option value="wait">Sort by Lowest Wait</option>
          <option value="distance">Sort by Distance</option>
        </select>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {simulatedError ? (
          <div className="bg-surface-variant rounded-3xl p-8 text-center border border-outline-variant/30 animate-in fade-in duration-500">
            <div className="bg-error-container/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-error opacity-60" size={32} />
            </div>
            <h3 className="font-bold text-on-surface mb-2">Service Data Unavailable</h3>
            <p className="text-xs text-on-surface-variant mb-6">
              We're having trouble connecting to the stadium's live concession feed.
            </p>
            <button 
              onClick={() => setSimulatedError(false)}
              className="bg-primary text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform shadow-md"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          filteredServices.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              isFastest={sortBy === 'wait' && service.id === fastestServiceId}
              onOrderClick={() => setSelectedService(service)}
            />
          ))
        )}
      </div>

      {/* Hidden trigger for testing graceful degradation (Shift + click header) */}
      <div className="mt-8 opacity-0 hover:opacity-10 text-[8px] text-center" onClick={() => setSimulatedError(true)}>
        Debug: Simulate Server Error
      </div>

      {/* Modals */}
      {selectedService && (
        <FoodOrderModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
}

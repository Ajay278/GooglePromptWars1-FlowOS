import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ServiceItem, useAppStore } from '../../store';

interface Props {
  service: ServiceItem;
  onClose: () => void;
}

const MOCK_MENU = [
  { id: 'm1', name: 'Classic Burger', price: 12.00 },
  { id: 'm2', name: 'Fries', price: 5.50 },
  { id: 'm3', name: 'Large Soda', price: 4.00 },
];

export default function FoodOrderModal({ service, onClose }: Props) {
  const { addToCart } = useAppStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pickupTime, setPickupTime] = useState<'asap' | 'halftime'>('asap');

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => {
      const newQ = (prev[id] || 0) + delta;
      return { ...prev, [id]: Math.max(0, newQ) };
    });
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = MOCK_MENU.reduce((acc, item) => acc + (item.price * (quantities[item.id] || 0)), 0);

  const handleOrder = () => {
    MOCK_MENU.forEach(item => {
      if (quantities[item.id] > 0) {
        addToCart({ id: item.id, name: item.name, price: item.price, quantity: quantities[item.id] });
      }
    });
    // In a real app, we'd process payment here
    alert(`Order placed for ${pickupTime === 'asap' ? 'ASAP pickup' : 'Halftime pickup'}!`);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-outline-variant/30">
          <div>
            <h2 className="text-xl font-bold">{service.name}</h2>
            <p className="text-xs text-on-surface-variant">Mobile Order</p>
          </div>
          <button onClick={onClose} className="p-2 bg-surface-variant rounded-full hover:bg-outline-variant transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-5">
          <h3 className="font-bold mb-4">Menu</h3>
          <div className="space-y-4">
            {MOCK_MENU.map(item => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b border-outline-variant/20 last:border-0">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-on-surface-variant">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-variant rounded-full p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full bg-surface text-on-surface hover:bg-outline-variant">
                    <Minus size={16} />
                  </button>
                  <span className="w-4 text-center font-bold text-sm">{quantities[item.id] || 0}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full bg-primary text-white hover:bg-primary/90">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-bold mt-8 mb-4">Pickup Time</h3>
          <div className="flex gap-3">
            <button 
              onClick={() => setPickupTime('asap')}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${pickupTime === 'asap' ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant/30 text-on-surface-variant'}`}
            >
              ASAP (~{service.waitTime} min)
            </button>
            <button 
              onClick={() => setPickupTime('halftime')}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${pickupTime === 'halftime' ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant/30 text-on-surface-variant'}`}
            >
              Halftime
            </button>
          </div>
        </div>

        {/* Footer / Checkout */}
        <div className="p-5 border-t border-outline-variant/30 bg-surface">
          <button 
            disabled={totalItems === 0}
            onClick={handleOrder}
            className="w-full bg-primary disabled:bg-surface-variant disabled:text-on-surface-variant text-white font-bold py-4 rounded-full shadow-md flex justify-between items-center px-6 transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2"><ShoppingBag size={20} /> Place Order</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

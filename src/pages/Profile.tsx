import { User, Settings, CreditCard, Ticket } from 'lucide-react';

export default function Profile() {
  const menuItems = [
    { name: 'My Tickets', icon: Ticket },
    { name: 'Payment Methods', icon: CreditCard },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-surface p-4">
      <div className="flex flex-col items-center mt-8 mb-8">
        <div className="bg-secondary-container p-6 rounded-full mb-4 text-on-secondary-container">
          <User size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Alex Johnson</h1>
        <p className="text-on-surface-variant">FlowOS Member since 2023</p>
      </div>

      <div className="space-y-4 w-full">
        {menuItems.map((item) => (
          <button key={item.name} className="w-full flex items-center p-4 bg-surface-variant rounded-2xl active:scale-95 transition-transform">
            <item.icon className="text-on-surface-variant mr-4" size={24} />
            <span className="font-semibold flex-1 text-left text-on-surface">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

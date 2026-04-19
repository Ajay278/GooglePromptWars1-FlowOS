import { useEffect } from 'react';
import { useAppStore } from '../store';
import StadiumMap from '../components/navigation/StadiumMap';
import DestinationPanel from '../components/navigation/DestinationPanel';

export default function NavigatePage() {
  const { setCongestion, congestion, destination } = useAppStore();

  // Simulate dynamic real-time congestion changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Create a new congestion map with random spikes
      const newCongestion = { ...congestion };
      
      // Randomly spike food_court or concourse_a to trigger dynamic rerouting
      if (Math.random() > 0.5) {
        newCongestion.food_court = Math.random() > 0.5 ? 3.0 : 1.0;
      } else {
        newCongestion.concourse_a = Math.random() > 0.5 ? 2.5 : 1.0;
      }
      
      // Update store, which triggers recalculation if there is an active destination
      setCongestion(newCongestion);
    }, 4000); // Update every 4 seconds for simulation

    return () => clearInterval(interval);
  }, [congestion, setCongestion]);

  return (
    <div className="relative h-full w-full bg-[#121212] overflow-hidden">
      {/* Full bleed map */}
      <StadiumMap />
      
      {/* Floating UI */}
      <DestinationPanel />
      
      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent z-40 pointer-events-none">
        <h1 className="text-2xl font-bold text-white drop-shadow-md">Stadium Nav</h1>
        <p className="text-sm font-medium text-white/90 drop-shadow-md">
          {destination ? 'Live routing active' : 'Select a destination'}
        </p>
      </div>
    </div>
  );
}

interface TransitData {
  id: string;
  type: 'bus' | 'train' | 'metro';
  line: string;
  waitTime: number;
  status: 'on-time' | 'delayed' | 'crowded';
  lastUpdated: number;
}

const CACHE_KEY = 'flowos_transit_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Your Google Maps API Key (Shared with Firebase)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const STADIUM_LOCATION = "Narendra+Modi+Stadium,+Ahmedabad";
const DESTINATIONS = [
  { id: '1', name: 'Motera Metro', type: 'metro', query: 'Motera+Stadium+Metro+Station' },
  { id: '2', name: 'Sabarmati Stn', type: 'train', query: 'Sabarmati+Railway+Station' }
];

export const getTransitWaitTimes = async (): Promise<TransitData[]> => {
  // 1. Check Cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('🚌 Using cached transit data');
      return data;
    }
  }

  try {
    console.log('📡 Fetching Real Google Maps Data...');
    
    // Construct destinations string
    const destQueries = DESTINATIONS.map(d => d.query).join('|');
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${STADIUM_LOCATION}&destinations=${destQueries}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') throw new Error('Maps API Error: ' + data.status);

    const freshData: TransitData[] = data.rows[0].elements.map((element: any, index: number) => {
      const destination = DESTINATIONS[index];
      // Travel time in minutes
      const travelTimeMinutes = Math.round(element.duration.value / 60);
      
      // Heuristic for status based on traffic (duration vs duration_in_traffic)
      // For simplicity, we'll use duration for now or just mock the status
      return {
        id: destination.id,
        type: destination.type,
        line: destination.name,
        waitTime: travelTimeMinutes,
        status: travelTimeMinutes > 15 ? 'crowded' : 'on-time',
        lastUpdated: Date.now()
      };
    });

    // 3. Save to Cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: freshData,
      timestamp: Date.now()
    }));

    return freshData;
  } catch (err) {
    console.warn('Google Maps API failed, falling back to mock data:', err);
    // Fallback to mock data if API fails (e.g. quota exceeded or key restricted)
    return [
      { id: '1', type: 'metro', line: 'Motera Metro', waitTime: 5, status: 'on-time', lastUpdated: Date.now() },
      { id: '2', type: 'train', line: 'Sabarmati Stn', waitTime: 14, status: 'crowded', lastUpdated: Date.now() }
    ];
  }
};

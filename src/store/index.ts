import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { NodeId, findOptimalRoute, WeatherState } from '../utils/routingEngine';

type ArrivalTab = 'transit' | 'parking' | 'ticket';
export type EventStatus = 'pre-game' | 'live' | 'post-game';

export interface ServiceItem {
  id: string;
  type: 'food' | 'restroom';
  name: string;
  location: string;
  waitTime: number;
  distance: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface GroupMember {
  id: string;
  name: string;
  status: 'nearby' | 'separated' | 'lost';
  locationId: NodeId;
  avatarColor: string;
}

export interface LostFoundItem {
  id: string;
  description: string;
  location: string;
  time: string;
}

interface AppState {
  currentSector: string;
  setSector: (sector: string) => void;
  isSOSActive: boolean;
  setSOSActive: (active) => void;
  arrivalTab: ArrivalTab;
  setArrivalTab: (tab: ArrivalTab) => void;
  gateWaitTime: number;
  setGateWaitTime: (time: number) => void;
  eventStatus: EventStatus;
  setEventStatus: (status: EventStatus) => void;
  isEmergencyMode: boolean;
  setEmergencyMode: (active: boolean) => void;
  emergencyType: 'sos' | 'silent' | 'evacuate' | null;
  setEmergencyType: (type: 'sos' | 'silent' | 'evacuate' | null) => void;
  cachedEvacuationRoute: NodeId[];
  setCachedEvacuationRoute: (route: NodeId[]) => void;
  destination: NodeId | null;
  setDestination: (dest: NodeId | null) => void;
  congestion: Record<NodeId, number>;
  setCongestion: (congestion: Record<NodeId, number>) => void;
  activePath: NodeId[];
  eta: number;
  calculateRoute: () => void;
  syncWithFirestore: () => void;
  services: ServiceItem[];
  setServices: (services: ServiceItem[]) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  isPrivacyMode: boolean;
  setPrivacyMode: (active: boolean) => void;
  groupMembers: GroupMember[];
  setGroupMembers: (members: GroupMember[]) => void;
  updateMemberStatus: (id: string, status: GroupMember['status'], locationId: NodeId) => void;
  weather: WeatherState;
  setWeather: (weather: WeatherState) => void;
  triggerCrowdSurge: (nodeId: NodeId) => void;
  lostFoundItems: LostFoundItem[];
  addLostFoundItem: (item: LostFoundItem) => void;
  readNotificationIds: string[];
  markNotificationRead: (id: string) => void;
  voiceGuidance: boolean;
  setVoiceGuidance: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const initialCongestion: Record<NodeId, number> = {
  entrance: 1, concourse_a: 1.2, concourse_b: 1, food_court: 2.5, restrooms: 1.5, seat_112: 1, exit_north: 1
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentSector: '112',
      setSector: (sector) => set({ currentSector: sector }),
      isSOSActive: false,
      setSOSActive: (active) => set({ isSOSActive: active }),
      arrivalTab: 'transit',
      setArrivalTab: (tab) => set({ arrivalTab: tab }),
      gateWaitTime: 12,
      setGateWaitTime: (time) => set({ gateWaitTime: time }),
      eventStatus: 'live',
      setEventStatus: (status) => set({ eventStatus: status }),
      isEmergencyMode: false,
      setEmergencyMode: (active) => set({ isEmergencyMode: active }),
      emergencyType: null,
      setEmergencyType: (type) => set({ emergencyType: type }),
      cachedEvacuationRoute: [],
      setCachedEvacuationRoute: (route) => set({ cachedEvacuationRoute: route }),
      destination: null,
      setDestination: (dest) => {
        set({ destination: dest });
        get().calculateRoute();
      },
      congestion: initialCongestion,
      setCongestion: (congestion) => {
        set({ congestion });
        if (get().destination) get().calculateRoute();
      },
      activePath: [],
      eta: 0,
      calculateRoute: () => {
        const dest = get().destination;
        if (!dest) return;
        const result = findOptimalRoute('entrance', dest, get().congestion, get().weather);
        set({ activePath: result.path, eta: result.estimatedTime });
      },
      // syncWithFirestore is now handled via useStadiumData hook in MainLayout
      services: [
        { id: 's1', type: 'food', name: 'Stadium Burgers', location: 'Section 112', waitTime: 15, distance: 50 },
        { id: 's2', type: 'food', name: 'Pizza Corner', location: 'Section 115', waitTime: 5, distance: 120 },
        { id: 's3', type: 'food', name: 'Cold Drinks & Snacks', location: 'Section 110', waitTime: 2, distance: 30 },
        { id: 's4', type: 'restroom', name: 'Restrooms North', location: 'Section 114', waitTime: 8, distance: 80 },
        { id: 's5', type: 'restroom', name: 'Restrooms South', location: 'Section 108', waitTime: 1, distance: 60 },
      ],
      setServices: (services) => set({ services }),
      cart: [],
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
      clearCart: () => set({ cart: [] }),
      isPrivacyMode: true,
      setPrivacyMode: (active) => set({ isPrivacyMode: active }),
      groupMembers: [
        { id: 'u1', name: 'You', status: 'nearby', locationId: 'entrance', avatarColor: 'bg-primary' },
        { id: 'u2', name: 'Sarah', status: 'nearby', locationId: 'concourse_a', avatarColor: 'bg-purple-500' },
        { id: 'u3', name: 'Mike', status: 'nearby', locationId: 'concourse_b', avatarColor: 'bg-green-500' },
      ],
      setGroupMembers: (members) => set({ groupMembers: members }),
      updateMemberStatus: (id, status, locationId) => set((state) => ({
        groupMembers: state.groupMembers.map(m => m.id === id ? { ...m, status, locationId } : m)
      })),
      weather: 'clear',
      setWeather: (weather) => {
        set({ weather });
        if (get().destination) get().calculateRoute();
      },
      triggerCrowdSurge: (nodeId) => {
        set((state) => {
          const newCongestion = { ...state.congestion, [nodeId]: 3.5 };
          if (db) setDoc(doc(db, 'stadium_state', 'congestion'), newCongestion, { merge: true });
          return { congestion: newCongestion };
        });
      },
      lostFoundItems: [],
      addLostFoundItem: (item) => set((state) => ({ lostFoundItems: [...state.lostFoundItems, item] })),
      readNotificationIds: [],
      markNotificationRead: (id) => set((state) => ({ 
        readNotificationIds: state.readNotificationIds.includes(id) ? state.readNotificationIds : [...state.readNotificationIds, id] 
      })),
      voiceGuidance: false,
      setVoiceGuidance: (enabled) => set({ voiceGuidance: enabled }),
      reducedMotion: false,
      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
      highContrast: false,
      setHighContrast: (enabled) => set({ highContrast: enabled }),
    }),
    {
      name: 'flowos-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        eventStatus: state.eventStatus,
        weather: state.weather,
        highContrast: state.highContrast,
        voiceGuidance: state.voiceGuidance,
        reducedMotion: state.reducedMotion
      }),
    }
  )
);

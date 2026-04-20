import { useEffect } from 'react';
import { useAppStore } from '../store';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { CongestionSchema, LifecycleSchema } from '../utils/schemas';
import { NodeId } from '../utils/routingEngine';

/**
 * useStadiumData Hook
 * Professional real-time synchronization engine with Zod validation.
 */
export function useStadiumData() {
  const { setCongestion, setEventStatus } = useAppStore();

  useEffect(() => {
    if (!db) return;

    // 1. Sync Congestion (Validated)
    const congestionRef = doc(db, 'stadium_state', 'congestion');
    const unsubCongestion = onSnapshot(congestionRef, (docSnap) => {
      if (docSnap.exists()) {
        const result = CongestionSchema.safeParse(docSnap.data());
        if (result.success) {
          setCongestion(result.data as Record<NodeId, number>);
        } else {
          console.warn("Congestion Data Validation Failed:", result.error);
        }
      }
    });

    // 2. Sync Lifecycle (Validated)
    const lifecycleRef = doc(db, 'stadium_state', 'lifecycle');
    const unsubLifecycle = onSnapshot(lifecycleRef, (docSnap) => {
      if (docSnap.exists()) {
        const result = LifecycleSchema.safeParse(docSnap.data());
        if (result.success) {
          setEventStatus(result.data.status);
        } else {
          console.warn("Lifecycle Data Validation Failed:", result.error);
        }
      }
    });

    return () => {
      unsubCongestion();
      unsubLifecycle();
    };
  }, [setCongestion, setEventStatus]);
}

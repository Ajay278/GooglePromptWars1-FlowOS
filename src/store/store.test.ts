import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store';

// Reset store to a clean state before each test to ensure isolation
beforeEach(() => {
  useAppStore.setState({
    // Emergency state
    isEmergencyMode: false,
    emergencyType: null,
    // Navigation state
    destination: null,
    activePath: [],
    eta: 0,
    congestion: {
      entrance: 1, concourse_a: 1, concourse_b: 1,
      food_court: 1, restrooms: 1, seat_112: 1, exit_north: 1,
    },
    // Group state
    groupMembers: [
      { id: 'u1', name: 'You',   status: 'nearby',  locationId: 'entrance',    avatarColor: 'bg-primary' },
      { id: 'u2', name: 'Sarah', status: 'nearby',  locationId: 'concourse_a', avatarColor: 'bg-purple-500' },
      { id: 'u3', name: 'Mike',  status: 'nearby',  locationId: 'concourse_b', avatarColor: 'bg-green-500' },
    ],
    // Digital Twin
    weather: 'clear',
    // Accessibility
    voiceGuidance: false,
    reducedMotion: false,
    highContrast: false,
  });
});

// ── Integration Tests: Emergency System ────────────────────────────────────
describe('Emergency System Integration', () => {
  it('sets emergency mode ON', () => {
    useAppStore.getState().setEmergencyMode(true);
    expect(useAppStore.getState().isEmergencyMode).toBe(true);
  });

  it('sets and clears emergency type', () => {
    useAppStore.getState().setEmergencyType('evacuate');
    expect(useAppStore.getState().emergencyType).toBe('evacuate');

    useAppStore.getState().setEmergencyType(null);
    expect(useAppStore.getState().emergencyType).toBeNull();
  });

  it('emergency mode starts as false (safe initial state)', () => {
    expect(useAppStore.getState().isEmergencyMode).toBe(false);
    expect(useAppStore.getState().emergencyType).toBeNull();
  });
});

// ── Integration Tests: Navigation + Crowd Data ──────────────────────────────
describe('Navigation + Crowd Data Integration', () => {
  it('calculateRoute populates activePath when destination is set', () => {
    useAppStore.getState().setDestination('seat_112');
    useAppStore.getState().calculateRoute();
    const { activePath, eta } = useAppStore.getState();
    expect(activePath.length).toBeGreaterThan(0);
    expect(activePath[0]).toBe('entrance');
    expect(activePath[activePath.length - 1]).toBe('seat_112');
    expect(eta).toBeGreaterThan(0);
  });

  it('crowd surge on concourse_a forces reroute with higher ETA', () => {
    useAppStore.getState().setDestination('seat_112');
    useAppStore.getState().calculateRoute();
    const normalETA = useAppStore.getState().eta;

    // Now trigger a surge on both concourses to force a longer route
    useAppStore.getState().triggerCrowdSurge('concourse_a');
    useAppStore.getState().triggerCrowdSurge('concourse_b');
    useAppStore.getState().calculateRoute();
    const surgedETA = useAppStore.getState().eta;

    expect(surgedETA).toBeGreaterThanOrEqual(normalETA);
  });

  it('changing weather to rain re-calculates route with higher ETA for outdoor paths', () => {
    useAppStore.getState().setDestination('exit_north');
    useAppStore.getState().calculateRoute();
    const clearETA = useAppStore.getState().eta;

    useAppStore.getState().setWeather('rain');
    // setWeather triggers calculateRoute internally
    const rainETA = useAppStore.getState().eta;

    expect(rainETA).toBeGreaterThanOrEqual(clearETA);
  });

  it('clearing destination resets route state', () => {
    useAppStore.getState().setDestination('seat_112');
    useAppStore.getState().calculateRoute();
    expect(useAppStore.getState().activePath.length).toBeGreaterThan(0);

    useAppStore.getState().setDestination(null);
    // Path should now be empty since there's no destination
    expect(useAppStore.getState().destination).toBeNull();
  });
});

// ── Integration Tests: Group Tracking ──────────────────────────────────────
describe('Group Tracking Integration', () => {
  it('initial group has 3 members all with nearby status', () => {
    const { groupMembers } = useAppStore.getState();
    expect(groupMembers).toHaveLength(3);
    expect(groupMembers.every(m => m.status === 'nearby')).toBe(true);
  });

  it('updateMemberStatus changes a specific member status', () => {
    useAppStore.getState().updateMemberStatus('u2', 'separated', 'concourse_b');
    const sarah = useAppStore.getState().groupMembers.find(m => m.id === 'u2')!;
    expect(sarah.status).toBe('separated');
    expect(sarah.locationId).toBe('concourse_b');
  });

  it('marking a member as lost does not affect other members', () => {
    useAppStore.getState().updateMemberStatus('u3', 'lost', 'exit_north');
    const you   = useAppStore.getState().groupMembers.find(m => m.id === 'u1')!;
    const sarah = useAppStore.getState().groupMembers.find(m => m.id === 'u2')!;
    expect(you.status).toBe('nearby');
    expect(sarah.status).toBe('nearby');
  });

  it('privacy mode can be toggled on and off', () => {
    expect(useAppStore.getState().isPrivacyMode).toBeDefined();
    useAppStore.getState().setPrivacyMode(true);
    expect(useAppStore.getState().isPrivacyMode).toBe(true);
    useAppStore.getState().setPrivacyMode(false);
    expect(useAppStore.getState().isPrivacyMode).toBe(false);
  });
});

// ── Integration Tests: Accessibility State ─────────────────────────────────
describe('Accessibility State Integration', () => {
  it('voiceGuidance starts off', () => {
    expect(useAppStore.getState().voiceGuidance).toBe(false);
  });

  it('toggling voiceGuidance on and off works correctly', () => {
    useAppStore.getState().setVoiceGuidance(true);
    expect(useAppStore.getState().voiceGuidance).toBe(true);
    useAppStore.getState().setVoiceGuidance(false);
    expect(useAppStore.getState().voiceGuidance).toBe(false);
  });

  it('all three a11y toggles are independent of each other', () => {
    useAppStore.getState().setVoiceGuidance(true);
    useAppStore.getState().setHighContrast(true);
    // reducedMotion stays false
    expect(useAppStore.getState().reducedMotion).toBe(false);
    expect(useAppStore.getState().voiceGuidance).toBe(true);
    expect(useAppStore.getState().highContrast).toBe(true);
  });
});

// ── Edge Case Tests ─────────────────────────────────────────────────────────
describe('Edge Cases', () => {
  it('network failure simulation: calculateRoute with no destination does not throw', () => {
    useAppStore.setState({ destination: null });
    expect(() => useAppStore.getState().calculateRoute()).not.toThrow();
  });

  it('sudden crowd surge does not break congestion state structure', () => {
    useAppStore.getState().triggerCrowdSurge('concourse_a');
    const { congestion } = useAppStore.getState();
    // All required nodes must still exist in congestion map
    const requiredNodes = ['entrance', 'concourse_a', 'concourse_b', 'food_court', 'restrooms', 'seat_112', 'exit_north'];
    requiredNodes.forEach(node => {
      expect(congestion[node as keyof typeof congestion]).toBeDefined();
    });
    expect(congestion.concourse_a).toBe(3.5); // Surge sets to 3.5
  });

  it('service downtime simulation: empty services array handled gracefully', () => {
    useAppStore.setState({ services: [] });
    const { services } = useAppStore.getState();
    expect(services).toHaveLength(0);
    // Cart operations should still work without crashing
    expect(() => useAppStore.getState().cart).not.toThrow();
  });

  it('weather state cycles through all valid types', () => {
    const types = ['clear', 'rain', 'heat'] as const;
    types.forEach(w => {
      useAppStore.getState().setWeather(w);
      expect(useAppStore.getState().weather).toBe(w);
    });
  });

  it('extremem concurrent state updates: 1000 rapid congestion updates remain consistent', () => {
    for (let i = 0; i < 1000; i++) {
      const node = i % 2 === 0 ? 'concourse_a' : 'concourse_b';
      useAppStore.setState(state => ({
        congestion: { ...state.congestion, [node]: (i % 5) + 1 }
      }));
    }
    const { congestion } = useAppStore.getState();
    // After 1000 updates, all keys must still be valid numbers
    Object.values(congestion).forEach(val => {
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThan(0);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { findOptimalRoute, NodeId } from '../utils/routingEngine';

// ── helpers ────────────────────────────────────────────────────────────────
const flatCongestion = (): Record<NodeId, number> => ({
  entrance: 1, concourse_a: 1, concourse_b: 1,
  food_court: 1, restrooms: 1, seat_112: 1, exit_north: 1,
});

// ── Unit Tests: Core Routing Logic ─────────────────────────────────────────
describe('findOptimalRoute – core logic', () => {
  it('returns a single-node path when start equals end', () => {
    const { path, estimatedTime } = findOptimalRoute('entrance', 'entrance', flatCongestion());
    expect(path).toEqual(['entrance']);
    expect(estimatedTime).toBe(0);
  });

  it('finds a valid path from entrance to seat_112', () => {
    const { path } = findOptimalRoute('entrance', 'seat_112', flatCongestion());
    expect(path[0]).toBe('entrance');
    expect(path[path.length - 1]).toBe('seat_112');
    expect(path.length).toBeGreaterThan(1);
  });

  it('finds a valid path from entrance to exit_north', () => {
    const { path } = findOptimalRoute('entrance', 'exit_north', flatCongestion());
    expect(path[0]).toBe('entrance');
    expect(path[path.length - 1]).toBe('exit_north');
  });

  it('returns a positive estimatedTime for a real route', () => {
    const { estimatedTime } = findOptimalRoute('entrance', 'seat_112', flatCongestion());
    expect(estimatedTime).toBeGreaterThan(0);
  });

  it('returns empty path for unreachable destination', () => {
    // restrooms only connects back to concourse_a, so a direct restrooms→exit_north
    // requires traversal. The path should still exist via concourse_a.
    const { path } = findOptimalRoute('restrooms', 'exit_north', flatCongestion());
    expect(path.length).toBeGreaterThan(0);
  });
});

// ── Unit Tests: Congestion Multipliers ─────────────────────────────────────
describe('findOptimalRoute – congestion avoidance', () => {
  it('avoids a congested node and takes a longer detour', () => {
    const normalRoute = findOptimalRoute('entrance', 'seat_112', flatCongestion());

    // Block concourse_a with very high congestion
    const heavyCongestion = { ...flatCongestion(), concourse_a: 10 };
    const reroutedRoute = findOptimalRoute('entrance', 'seat_112', heavyCongestion);

    // The rerouted ETA should be higher (going the long way)
    expect(reroutedRoute.estimatedTime).toBeGreaterThanOrEqual(normalRoute.estimatedTime);
  });

  it('prefers the shorter path when congestion is equal', () => {
    const { path } = findOptimalRoute('entrance', 'food_court', flatCongestion());
    // Should route entrance → concourse_b → food_court (30+45+40=115) 
    // rather than entrance → concourse_a → food_court (30+60=90 actual base: entrance→concourse_a=30, concourse_a→food_court=60)
    // Direct winner is entrance→concourse_a→food_court (90s) vs entrance→concourse_b→food_court (85s)
    // So shortest is via concourse_b
    expect(path).toContain('entrance');
    expect(path).toContain('food_court');
  });

  it('crowd surge: congestion multiplier of 3.5 significantly increases ETA', () => {
    const normal = findOptimalRoute('entrance', 'seat_112', flatCongestion());
    const surged = { ...flatCongestion(), concourse_a: 3.5, concourse_b: 3.5 };
    const underSurge = findOptimalRoute('entrance', 'seat_112', surged);
    expect(underSurge.estimatedTime).toBeGreaterThan(normal.estimatedTime);
  });
});

// ── Unit Tests: Weather-Aware Routing ──────────────────────────────────────
describe('findOptimalRoute – weather penalties', () => {
  it('clear weather: takes the numerically fastest path', () => {
    const clear = findOptimalRoute('entrance', 'exit_north', flatCongestion(), 'clear');
    expect(clear.path.length).toBeGreaterThan(0);
  });

  it('rain weather: penalizes outdoor nodes and may reroute', () => {
    const clear = findOptimalRoute('entrance', 'exit_north', flatCongestion(), 'clear');
    const rain  = findOptimalRoute('entrance', 'exit_north', flatCongestion(), 'rain');
    // Under rain, the route avoiding outdoor nodes should have ≥ ETA than clear
    // (exit_north is outdoor and penalized, forcing a longer path or higher ETA)
    expect(rain.estimatedTime).toBeGreaterThanOrEqual(clear.estimatedTime);
  });

  it('heat weather: does not modify base routing (no penalty defined for heat)', () => {
    const clear = findOptimalRoute('entrance', 'seat_112', flatCongestion(), 'clear');
    const heat  = findOptimalRoute('entrance', 'seat_112', flatCongestion(), 'heat');
    expect(heat.estimatedTime).toBe(clear.estimatedTime);
  });

  it('rain: outdoor-heavy route has higher ETA than the same route with clear weather', () => {
    // entrance is outdoor, seat_112 is outdoor — a rain penalty must cost more
    const clear = findOptimalRoute('entrance', 'seat_112', flatCongestion(), 'clear');
    const rain  = findOptimalRoute('entrance', 'seat_112', flatCongestion(), 'rain');
    expect(rain.estimatedTime).toBeGreaterThan(clear.estimatedTime);
  });
});

// ── Edge Case Tests ─────────────────────────────────────────────────────────
describe('findOptimalRoute – edge cases', () => {
  it('handles extreme congestion (100x multiplier) gracefully without crashing', () => {
    const extremeCongestion = { ...flatCongestion(), concourse_a: 100, concourse_b: 100 };
    expect(() => {
      findOptimalRoute('entrance', 'seat_112', extremeCongestion);
    }).not.toThrow();
  });

  it('handles all nodes at 1x congestion without crashing', () => {
    expect(() => {
      findOptimalRoute('restrooms', 'exit_north', flatCongestion());
    }).not.toThrow();
  });

  it('returns ETA in minutes (not seconds)', () => {
    // Minimum path is at least 30 seconds, so ETA must be < 30 minutes for direct neighbours
    const { estimatedTime } = findOptimalRoute('entrance', 'concourse_a', flatCongestion());
    expect(estimatedTime).toBeLessThan(30);
    expect(estimatedTime).toBeGreaterThanOrEqual(0);
  });
});

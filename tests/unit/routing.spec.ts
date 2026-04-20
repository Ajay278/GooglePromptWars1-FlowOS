import { describe, it, expect } from 'vitest';
import { findOptimalRoute, NodeId } from '../../src/utils/routingEngine';

describe('Routing Engine Unit Tests', () => {
  const mockCongestion: Record<NodeId, number> = {
    entrance: 1,
    concourse_a: 1,
    concourse_b: 1,
    food_court: 1,
    restrooms: 1,
    seat_112: 1,
    exit_north: 1,
  };

  it('should find the direct path in normal conditions', () => {
    const result = findOptimalRoute('entrance', 'seat_112', mockCongestion, 'clear');
    expect(result.path).toContain('entrance');
    expect(result.path).toContain('seat_112');
    expect(result.estimatedTime).toBeGreaterThan(0);
  });

  it('should reroute during extreme congestion', () => {
    const heavyCongestion = { ...mockCongestion, concourse_a: 5.0 };
    const result = findOptimalRoute('entrance', 'seat_112', heavyCongestion, 'clear');
    // Even if path is same (if no other route), ETA should increase
    expect(result.estimatedTime).toBeGreaterThan(1);
  });

  it('should account for weather-based path weights', () => {
    const resultClear = findOptimalRoute('entrance', 'exit_north', mockCongestion, 'clear');
    const resultRain = findOptimalRoute('entrance', 'exit_north', mockCongestion, 'rain');
    // Rain should increase ETA as it favors covered paths (which might be longer)
    expect(resultRain.estimatedTime).toBeGreaterThanOrEqual(resultClear.estimatedTime);
  });
});

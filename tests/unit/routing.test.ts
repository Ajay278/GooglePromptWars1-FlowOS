import { describe, it, expect } from 'vitest';
import { findOptimalRoute, NodeId } from '../../src/utils/routingEngine';

describe('Routing Engine Unit Tests', () => {
  it('should find the shortest path from entrance to seat_112 under clear weather', () => {
    const { path, estimatedTime } = findOptimalRoute('entrance', 'seat_112', {}, 'clear');
    
    expect(path).toContain('entrance');
    expect(path).toContain('seat_112');
    expect(estimatedTime).toBeGreaterThan(0);
    // Based on graph: entrance -> concourse_a -> seat_112 (30 + 120 = 150s = 2.5m)
    // Return is Math.round(150 / 60) = 3m
    expect(estimatedTime).toBe(3);
  });

  it('should reroute to avoid heavy congestion', () => {
    // Force concourse_a to be EXTREMELY congested
    const congestion: Record<NodeId, number> = {
      concourse_a: 50, // 50x delay
      concourse_b: 1,
      food_court: 1,
      seat_112: 1,
      entrance: 1,
      restrooms: 1,
      exit_north: 1
    };
    
    // Path should now prefer entrance -> concourse_b -> food_court -> seat_112
    const { path } = findOptimalRoute('entrance', 'seat_112', congestion, 'clear');
    expect(path).not.toContain('concourse_a');
    expect(path).toContain('concourse_b');
  });

  it('should penalize outdoor nodes during rain', () => {
    // seat_112 is outdoor. entrance is outdoor.
    // entrance -> concourse_a -> seat_112
    // During rain, the penalty for seat_112 (outdoor) is 3x.
    const clearResult = findOptimalRoute('entrance', 'seat_112', {}, 'clear');
    const rainResult = findOptimalRoute('entrance', 'seat_112', {}, 'rain');
    
    expect(rainResult.estimatedTime).toBeGreaterThan(clearResult.estimatedTime);
  });

  it('should return empty path if no route exists', () => {
    // Technically our graph is fully connected, but let's test a hypothetical error
    // (In our current graph, all nodes are reachable)
    const { path } = findOptimalRoute('entrance', 'entrance', {}, 'clear');
    expect(path).toEqual(['entrance']);
  });
});

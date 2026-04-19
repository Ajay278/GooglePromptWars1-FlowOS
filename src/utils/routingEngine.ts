// Simple graph implementation for stadium nodes
export type NodeId = 'entrance' | 'concourse_a' | 'concourse_b' | 'food_court' | 'restrooms' | 'seat_112' | 'exit_north';
export type WeatherState = 'clear' | 'rain' | 'heat';

export interface RouteEdge {
  to: NodeId;
  baseTime: number; // in seconds
}

export const STADIUM_GRAPH: Record<NodeId, RouteEdge[]> = {
  entrance: [
    { to: 'concourse_a', baseTime: 30 },
    { to: 'concourse_b', baseTime: 45 },
  ],
  concourse_a: [
    { to: 'entrance', baseTime: 30 },
    { to: 'food_court', baseTime: 60 },
    { to: 'restrooms', baseTime: 20 },
    { to: 'seat_112', baseTime: 120 },
  ],
  concourse_b: [
    { to: 'entrance', baseTime: 45 },
    { to: 'food_court', baseTime: 40 },
    { to: 'exit_north', baseTime: 90 },
  ],
  food_court: [
    { to: 'concourse_a', baseTime: 60 },
    { to: 'concourse_b', baseTime: 40 },
    { to: 'seat_112', baseTime: 50 },
  ],
  restrooms: [
    { to: 'concourse_a', baseTime: 20 },
  ],
  seat_112: [
    { to: 'concourse_a', baseTime: 120 },
    { to: 'food_court', baseTime: 50 },
    { to: 'exit_north', baseTime: 180 },
  ],
  exit_north: [
    { to: 'concourse_b', baseTime: 90 },
    { to: 'seat_112', baseTime: 180 },
  ]
};

// Open-air nodes that are heavily penalized during rain
const OUTDOOR_NODES: NodeId[] = ['entrance', 'seat_112', 'exit_north'];

// Calculate optimal path using Dijkstra-like approach, considering dynamic congestion and weather
export function findOptimalRoute(
  start: NodeId, 
  end: NodeId, 
  congestionMultipliers: Record<NodeId, number>,
  weather: WeatherState = 'clear'
): { path: NodeId[], estimatedTime: number } {
  
  if (start === end) return { path: [start], estimatedTime: 0 };

  const distances: Record<NodeId, number> = {} as Record<NodeId, number>;
  const previous: Record<NodeId, NodeId | null> = {} as Record<NodeId, NodeId | null>;
  const unvisited = new Set<NodeId>(Object.keys(STADIUM_GRAPH) as NodeId[]);

  for (const node of unvisited) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current: NodeId | null = null;
    let minDistance = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null || current === end) break;
    unvisited.delete(current);

    const neighbors = STADIUM_GRAPH[current];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;

      let weatherPenalty = 1;
      // If it's raining and the target node is outdoors, apply a 3x penalty to discourage the route
      if (weather === 'rain' && OUTDOOR_NODES.includes(neighbor.to)) {
        weatherPenalty = 3;
      }

      // Multiply base time by the congestion factor and weather penalty
      const congestionFactor = congestionMultipliers[neighbor.to] || 1;
      const altDistance = distances[current] + (neighbor.baseTime * congestionFactor * weatherPenalty);

      if (altDistance < distances[neighbor.to]) {
        distances[neighbor.to] = altDistance;
        previous[neighbor.to] = current;
      }
    }
  }

  // Build path
  const path: NodeId[] = [];
  let curr: NodeId | null = end;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { 
    path: path[0] === start ? path : [], 
    estimatedTime: Math.round(distances[end] / 60) // Return ETA in minutes
  };
}

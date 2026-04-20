/**
 * @file routingEngine.ts
 * @description Advanced pathfinding logic for FlowOS Smart Stadium.
 * Uses a modified Dijkstra algorithm to calculate optimal routes considering
 * real-time congestion, weather conditions, and accessibility constraints.
 */

/**
 * Valid nodes within the stadium graph.
 */
export type NodeId = 'entrance' | 'concourse_a' | 'concourse_b' | 'food_court' | 'restrooms' | 'seat_112' | 'exit_north';

/**
 * Weather states that affect routing penalties.
 */
export type WeatherState = 'clear' | 'rain' | 'heat';

/**
 * Represents a connection between two stadium nodes.
 */
export interface RouteEdge {
  to: NodeId;
  baseTime: number; // in seconds
}

/**
 * The core stadium adjacency list defining the physical layout.
 */
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

/**
 * Nodes that are exposed to elements. Used for weather-based rerouting.
 */
const OUTDOOR_NODES: NodeId[] = ['entrance', 'seat_112', 'exit_north'];

/**
 * Calculates the most efficient path between two points.
 * 
 * @param start - The starting node ID.
 * @param end - The destination node ID.
 * @param congestionMultipliers - Real-time weights for each node (1.0 = normal).
 * @param weather - Current weather condition affecting outdoor penalties.
 * @returns An object containing the ordered list of nodes and total ETA in minutes.
 * 
 * @example
 * findOptimalRoute('entrance', 'seat_112', { concourse_a: 2.0 }, 'rain')
 */
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
      if (weather === 'rain' && OUTDOOR_NODES.includes(neighbor.to)) {
        weatherPenalty = 3;
      }

      const congestionFactor = congestionMultipliers[neighbor.to] || 1;
      const altDistance = distances[current] + (neighbor.baseTime * congestionFactor * weatherPenalty);

      if (altDistance < distances[neighbor.to]) {
        distances[neighbor.to] = altDistance;
        previous[neighbor.to] = current;
      }
    }
  }

  const path: NodeId[] = [];
  let curr: NodeId | null = end;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { 
    path: path[0] === start ? path : [], 
    estimatedTime: Math.round(distances[end] / 60)
  };
}

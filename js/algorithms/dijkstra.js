import { samePosition } from "../environment.js";
import { BFSAlgorithm } from "./bfs.js";

export class DijkstraAlgorithm extends BFSAlgorithm {
  constructor() {
    super();
    this.name = "Dijkstra";
    this.reset();
  }

  reset() {
    super.reset();
    this.setHeuristicDescription("Dijkstra uses cumulative path cost only.");
  }

  findPath(state, start, goal, options = {}) {
    if (!start || !goal) {
      return null;
    }

    if (samePosition(start, goal)) {
      return [{ x: start.x, y: start.y }];
    }

    const avoidFirstStepKey = options.avoidFirstStepToPosition
      ? this.positionKey(options.avoidFirstStepToPosition)
      : null;

    if (!avoidFirstStepKey) {
      const cachedPath = this.getCachedPath(state, start, goal);

      if (cachedPath !== undefined) {
        return cachedPath;
      }
    }

    const path = this.runDijkstra(state, start, goal, avoidFirstStepKey);

    if (!avoidFirstStepKey) {
      this.cachePath(state, start, goal, path);
    }

    return path;
  }

  runDijkstra(state, start, goal, avoidFirstStepKey) {
    const normalizedStart = { x: start.x, y: start.y };
    const startKey = this.positionKey(normalizedStart);
    const openSet = [
      {
        position: normalizedStart,
        path: [normalizedStart],
        cost: 0,
      },
    ];
    const bestCost = new Map([[startKey, 0]]);
    const closedKeys = new Set();

    this.recordMemoryUsage(openSet.length + closedKeys.size);

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.cost - b.cost);
      const node = openSet.shift();
      const current = node.position;
      const currentKey = this.positionKey(current);

      if (closedKeys.has(currentKey)) {
        continue;
      }

      this.recordNodeVisit({
        position: current,
        g: node.cost,
        h: this.manhattanDistance(current, goal),
      });
      this.recordMemoryUsage(openSet.length + closedKeys.size);

      if (samePosition(current, goal)) {
        return this.clonePath(node.path);
      }

      closedKeys.add(currentKey);

      for (const candidate of this.getMoveCandidates(current)) {
        const neighborKey = this.positionKey(candidate.position);

        if (closedKeys.has(neighborKey) || !this.canMoveTo(state, candidate.position)) {
          continue;
        }

        if (node.path.length === 1 && avoidFirstStepKey && neighborKey === avoidFirstStepKey) {
          continue;
        }

        const nextCost = node.cost + 1;
        if (nextCost >= (bestCost.get(neighborKey) ?? Infinity)) {
          continue;
        }

        bestCost.set(neighborKey, nextCost);
        openSet.push({
          position: candidate.position,
          path: [...node.path, candidate.position],
          cost: nextCost,
        });
        this.recordMemoryUsage(openSet.length + closedKeys.size);
      }
    }

    return null;
  }
}

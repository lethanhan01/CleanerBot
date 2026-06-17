import { samePosition } from "../environment.js";
import { BFSAlgorithm } from "./bfs.js";

export class GreedyBestFirstAlgorithm extends BFSAlgorithm {
  constructor() {
    super();
    this.name = "Greedy Best-First";
    this.reset();
  }

  reset() {
    super.reset();
    this.setHeuristicDescription("Greedy Best-First Search uses only heuristic distance to the goal.");
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

    const path = this.runGreedyBestFirst(state, start, goal, avoidFirstStepKey);

    if (!avoidFirstStepKey) {
      this.cachePath(state, start, goal, path);
    }

    return path;
  }

  runGreedyBestFirst(state, start, goal, avoidFirstStepKey) {
    const normalizedStart = { x: start.x, y: start.y };
    const startKey = this.positionKey(normalizedStart);
    const openSet = [
      {
        position: normalizedStart,
        path: [normalizedStart],
      },
    ];
    const visited = new Set([startKey]);

    this.recordMemoryUsage(openSet.length + visited.size);

    while (openSet.length > 0) {
      openSet.sort((a, b) => {
        const aScore = this.manhattanDistance(a.position, goal);
        const bScore = this.manhattanDistance(b.position, goal);
        return aScore - bScore;
      });

      const node = openSet.shift();
      const current = node.position;
      const currentKey = this.positionKey(current);

      this.recordNodeVisit({
        position: current,
        h: this.manhattanDistance(current, goal),
      });
      this.recordMemoryUsage(openSet.length + visited.size);

      if (samePosition(current, goal)) {
        return this.clonePath(node.path);
      }

      for (const candidate of this.getMoveCandidates(current)) {
        const neighborKey = this.positionKey(candidate.position);

        if (visited.has(neighborKey) || !this.canMoveTo(state, candidate.position)) {
          continue;
        }

        if (node.path.length === 1 && avoidFirstStepKey && neighborKey === avoidFirstStepKey) {
          continue;
        }

        visited.add(neighborKey);
        openSet.push({
          position: candidate.position,
          path: [...node.path, candidate.position],
        });
        this.recordMemoryUsage(openSet.length + visited.size);
      }
    }

    return null;
  }
}

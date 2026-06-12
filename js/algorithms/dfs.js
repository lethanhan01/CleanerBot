import { samePosition } from "../environment.js";
import { BFSAlgorithm } from "./bfs.js";

export class DFSAlgorithm extends BFSAlgorithm {
  constructor() {
    super();
    this.name = "DFS";
    this.reset();
  }

  reset() {
    super.reset();
    this.setHeuristicDescription("DFS does not use heuristic.");
  }

  chooseWorkTarget(state) {
    const committedTarget = this.getCommittedRouteTarget(state);

    if (committedTarget) {
      return committedTarget;
    }

    return super.chooseWorkTarget(state);
  }

  getCommittedRouteTarget(state) {
    if (!this.cachedRoute || this.cachedRoute.length < 2) {
      return null;
    }

    const target = this.cachedRoute[this.cachedRoute.length - 1];

    if (
      this.cachedTargetKey !== this.positionKey(target) ||
      this.cachedMapKey !== this.getStaticMapKey(state)
    ) {
      this.clearRoute();
      return null;
    }

    const route = this.syncCachedRoute(state, target);

    if (!route || route.length < 2) {
      return null;
    }

    const { robot, map } = state;
    const isValidTarget =
      samePosition(target, map.chargingStation) ||
      (samePosition(target, map.trashCan) && this.shouldEmptyTrash(state)) ||
      (this.isTrashPosition(state, target) &&
        robot.capacity < robot.maxCapacity);

    if (!isValidTarget) {
      this.clearRoute();
      return null;
    }

    return { x: target.x, y: target.y };
  }

  findNearestSafeTrashTarget(state) {
    const { robot } = state;

    return this.runDFS(state, robot, (current, path) => {
      if (this.isTrashPosition(state, current)) {
        const route = path.map((position) => ({ ...position }));
        this.cachePath(state, robot, current, route);

        if (!this.hasEnoughBatteryForTarget(state, current)) {
          return null;
        }

        return {
          target: { x: current.x, y: current.y },
          route,
        };
      }

      return null;
    });
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

    const resultPath = this.runDFS(
      state,
      start,
      (current, path) => {
        if (samePosition(current, goal)) {
          return path.map((position) => ({ ...position }));
        }

        return null;
      },
      avoidFirstStepKey
    );

    if (!avoidFirstStepKey) {
      this.cachePath(state, start, goal, resultPath);
    }

    return resultPath;
  }

  cachePath(state, start, goal, path) {
    if (!this.pathCache) {
      this.pathCache = new Map();
    }

    const cacheKey = this.getPathCacheKey(state, start, goal);
    this.pathCache.set(cacheKey, this.clonePath(path));
  }

  runDFS(state, start, onFound, avoidFirstStepKey = null) {
    const normalizedStart = { x: start.x, y: start.y };
    const startKey = this.positionKey(normalizedStart);
    const stack = [
      {
        position: normalizedStart,
        path: [normalizedStart],
      },
    ];
    const visited = new Set([startKey]);
    const maxVisits = this.getWalkableCellCount(state);

    this.recordMemoryUsage(stack.length + visited.size);

    while (stack.length > 0 && visited.size <= maxVisits) {
      const node = stack.pop();
      const current = node.position;
      this.recordNodeVisit({ position: current });
      this.recordMemoryUsage(stack.length + visited.size);

      const found = onFound(current, node.path);

      if (found) {
        return found;
      }

      const candidates = [...this.getMoveCandidates(current)].reverse();

      for (const candidate of candidates) {
        const key = this.positionKey(candidate.position);

        if (node.path.length === 1 && avoidFirstStepKey && key === avoidFirstStepKey) {
          continue;
        }

        if (visited.has(key) || !this.canMoveTo(state, candidate.position)) {
          continue;
        }

        const nextPosition = {
          x: candidate.position.x,
          y: candidate.position.y,
        };

        visited.add(key);
        stack.push({
          position: nextPosition,
          path: [...node.path, nextPosition],
        });
        this.recordMemoryUsage(stack.length + visited.size);
      }
    }

    return null;
  }

  getWalkableCellCount(state) {
    const { map } = state;
    return Math.max(
      0,
      map.grid_size_x * map.grid_size_y - map.obstaclePositions.length
    );
  }
}

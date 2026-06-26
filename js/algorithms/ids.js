import { samePosition } from "../environment.js";
import { DFSAlgorithm } from "./dfs.js";

export class IDSAlgorithm extends DFSAlgorithm {
  constructor() {
    super();
    this.name = "IDS";
    this.reset();
  }

  reset() {
    super.reset();
    this.setHeuristicDescription("IDS does not use heuristic.");
  }

  findNearestSafeTrashTarget(state) {
    const { robot } = state;
    const rejectedTrashKeys = new Set();

    while (rejectedTrashKeys.size < state.map.trashPositions.length) {
      const candidate = this.findNearestTrashTarget(
        state,
        robot,
        rejectedTrashKeys
      );

      if (!candidate) {
        return null;
      }

      const targetKey = this.positionKey(candidate.target);

      if (this.hasEnoughBatteryForTarget(state, candidate.target)) {
        return candidate;
      }

      rejectedTrashKeys.add(targetKey);
    }

    return null;
  }

  findNearestTrashTarget(state, start, rejectedTrashKeys) {
    const maxDepth = this.getSearchDepthLimit(state);

    for (let depthLimit = 0; depthLimit <= maxDepth; depthLimit += 1) {
      const result = this.depthLimitedTargetSearch(
        state,
        start,
        depthLimit,
        rejectedTrashKeys
      );

      if (result) {
        return result;
      }
    }

    return null;
  }

  depthLimitedTargetSearch(state, start, depthLimit, rejectedTrashKeys = new Set()) {
    const path = [{ x: start.x, y: start.y }];
    const startKey = this.positionKey(start);
    const pathSet = new Set([startKey]);
    const bestDepthByNode = new Map([[startKey, 0]]);

    return this.depthLimitedTraverse(
      state,
      path,
      pathSet,
      depthLimit,
      (currentPath) => {
        const current = currentPath[currentPath.length - 1];
        const currentKey = this.positionKey(current);

        if (
          this.isTrashPosition(state, current) &&
          !rejectedTrashKeys.has(currentKey)
        ) {
          return {
            target: { x: current.x, y: current.y },
            route: currentPath.map((position) => ({ ...position })),
          };
        }

        return null;
      },
      null,
      bestDepthByNode
    );
  }

  findPath(state, start, goal, options = {}) {
    if (!start || !goal) {
      return null;
    }

    if (samePosition(start, goal)) {
      return [{ x: start.x, y: start.y }];
    }

    const maxDepth = this.getSearchDepthLimit(state);
    const avoidFirstStepKey = options.avoidFirstStepToPosition
      ? this.positionKey(options.avoidFirstStepToPosition)
      : null;

    for (let depthLimit = 0; depthLimit <= maxDepth; depthLimit += 1) {
      const path = [{ x: start.x, y: start.y }];
      const startKey = this.positionKey(start);
      const pathSet = new Set([startKey]);
      const bestDepthByNode = new Map([[startKey, 0]]);

      const result = this.depthLimitedTraverse(
        state,
        path,
        pathSet,
        depthLimit,
        (currentPath) => {
          const current = currentPath[currentPath.length - 1];

          if (samePosition(current, goal)) {
            return currentPath.map((position) => ({ ...position }));
          }

          return null;
        },
        avoidFirstStepKey,
        bestDepthByNode
      );

      if (result) {
        return result;
      }
    }

    return null;
  }

  depthLimitedTraverse(
    state,
    path,
    pathSet,
    remainingDepth,
    onFound,
    avoidFirstStepKey = null,
    bestDepthByNode = new Map()
  ) {
    const current = path[path.length - 1];
    this.recordNodeVisit({ position: current });
    this.recordMemoryUsage(path.length + pathSet.size);

    const found = onFound(path);

    if (found) {
      return found;
    }

    if (remainingDepth === 0) {
      return null;
    }

    // IDS uses recursion, not stack/LIFO, so do NOT reverse candidates.
    // DFSAlgorithm.getMoveCandidates() already returns:
    // UP -> RIGHT -> DOWN -> LEFT.
    const candidates = this.getMoveCandidates(current);

    for (const candidate of candidates) {
      const key = this.positionKey(candidate.position);
      const nextDepth = path.length;
      const bestSeenDepth = bestDepthByNode.get(key);

      if (path.length === 1 && avoidFirstStepKey && key === avoidFirstStepKey) {
        continue;
      }

      if (pathSet.has(key) || !this.canMoveTo(state, candidate.position)) {
        continue;
      }

      if (bestSeenDepth !== undefined && bestSeenDepth <= nextDepth) {
        continue;
      }

      bestDepthByNode.set(key, nextDepth);
      path.push({ x: candidate.position.x, y: candidate.position.y });
      pathSet.add(key);
      this.recordMemoryUsage(path.length + bestDepthByNode.size);

      const result = this.depthLimitedTraverse(
        state,
        path,
        pathSet,
        remainingDepth - 1,
        onFound,
        avoidFirstStepKey,
        bestDepthByNode
      );

      if (result) {
        return result;
      }

      path.pop();
      pathSet.delete(key);
    }

    return null;
  }

  getSearchDepthLimit(state) {
    return Math.max(0, this.getWalkableCellCount(state) - 1);
  }
}

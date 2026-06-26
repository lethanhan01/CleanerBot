import { ACTIONS } from "../models.js";
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

    // Chỉ xoá cache đường cũ khi reset thuật toán.
    // Không xoá mỗi bước, tránh robot bị lặp qua lại.
    if (this.pathCache && typeof this.pathCache.clear === "function") {
      this.pathCache.clear();
    }

    this.setHeuristicDescription("DFS does not use heuristic.");
  }

  // GIỮ committed route.
  // Nếu đang có route tới mục tiêu cũ và route còn hợp lệ,
  // robot sẽ tiếp tục đi theo route đó để tránh lặp.
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

  // Tắt pathCache dài hạn cho DFS/IDS.
  // Nghĩa là mỗi lần cần tìm đường mới, thuật toán sẽ chạy lại thật.
  getCachedPath() {
    return undefined;
  }

  cachePath() {
    // Không lưu pathCache dài hạn.
    // Nhưng committed route của BFS vẫn có thể hoạt động thông qua cachedRoute.
  }

  // Chỉ đổi thứ tự duyệt riêng cho DFS/IDS.
  // Không sửa baseAlgorithm.js nên không ảnh hưởng BFS/thuật toán khác.
  getMoveCandidates(robot) {
    return [
      { action: ACTIONS.UP, position: { x: robot.x, y: robot.y - 1 } },
      { action: ACTIONS.RIGHT, position: { x: robot.x + 1, y: robot.y } },
      { action: ACTIONS.DOWN, position: { x: robot.x, y: robot.y + 1 } },
      { action: ACTIONS.LEFT, position: { x: robot.x - 1, y: robot.y } },
    ];
  }

  findNearestSafeTrashTarget(state) {
    const { robot } = state;

    return this.runDFS(state, robot, (current, path) => {
      if (this.isTrashPosition(state, current)) {
        const route = path.map((position) => ({ ...position }));

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

    return this.runDFS(
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

      // DFS dùng stack LIFO.
      // Muốn pop theo UP -> RIGHT -> DOWN -> LEFT
      // thì phải push ngược lại.
      const candidates = [...this.getMoveCandidates(current)].reverse();

      for (const candidate of candidates) {
        const key = this.positionKey(candidate.position);

        if (
          node.path.length === 1 &&
          avoidFirstStepKey &&
          key === avoidFirstStepKey
        ) {
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
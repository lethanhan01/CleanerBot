import { ACTIONS } from "../models.js";
import { samePosition } from "../environment.js";
import { BaseAlgorithm } from "./baseAlgorithm.js";

// Phạt score mỗi lần ô đã được ghé thăm trước đó (tránh đi lại ô cũ và tìm ô mới)
const VISIT_PENALTY = 3;
// Phạt nặng khi robot định quay ngay lại ô vừa rời (tránh lặp lại 2 ô)
const BACKTRACK_PENALTY = 10;
// Hằng số nhỏ dùng để so sánh số thực, tránh lỗi làm tròn floating-point
const EPSILON = 1e-9;

export class GreedyAlgorithm extends BaseAlgorithm {
  constructor() {
    super();
    this.name = "Greedy";
    this.reset();
  }

  reset() {
    super.reset();
    // Đếm số lần robot ghé qua mỗi ô, tính visit penalty
    this.visitCounts = new Map();
    this.currentPosition = null;
    this.previousPosition = null;
    this.setHeuristicDescription(
      `Greedy score = Manhattan distance + visits * ${VISIT_PENALTY} + backtrack penalty ${BACKTRACK_PENALTY}.`
    );
  }

  // Điểm vào chính: được gọi mỗi bước để quyết định bước tiếp theo của robot.
  // Xử lý theo ưu tiên sau: đổ rác => sạc => hút rác => di chuyển đến target.
  computeNextAction(state) {
    const { robot, map } = state;
    
    // Nhớ vị trí hiện tại để tính visit penalty và backtrack penalty
    this.rememberPosition(robot);
    this.recordNodeVisit({ position: state.robot });
    
    // Mỗi bước luôn là 1
    this.recordMemoryUsage(1);

    // Ưu tiên 1: Đang đứng trên thùng rác và robot đang giữ rác => đổ rác ngay
    if (this.isAtTrashCan(state) && robot.capacity > 0) {
      this.setCurrentTarget(map.trashCan);
      return this.hasEnoughBatteryForTarget(state, map.trashCan)
        ? ACTIONS.LET_TRASH_OUT
        : this.getChargingAction(state);
    }

    // Ưu tiên 2: Đang ở trạm sạc và cần sạc => sạc ngay
    if (this.isAtChargingStation(state) && this.shouldCharge(state)) {
      this.setCurrentTarget(map.chargingStation);
      return ACTIONS.CHARGE;
    }

    // Ưu tiên 3: Đang đứng trên rác và chưa đầy => hút rác ngay
    if (this.hasTrashAtRobot(state) && robot.capacity < robot.maxCapacity) {
      this.setCurrentTarget(robot);
      return this.hasEnoughBatteryForTarget(state, robot)
        ? ACTIONS.SUCK_TRASH
        : this.getChargingAction(state);
    }

    // Chọn target công việc tiếp theo (rác, thùng rác, hoặc trạm sạc)
    let target = this.chooseWorkTarget(state);

    // Nếu không đủ pin đến target nhưng pin đầy thì có thể xử lý → ghé trạm sạc trước
    if (
      target &&
      !samePosition(target, map.chargingStation) &&
      !this.hasEnoughBatteryForTarget(state, target) &&
      this.canFullBatteryHandleTarget(state, target)
    ) {
      target = map.chargingStation;
    }

    // Nếu vẫn không đủ pin → ưu tiên về sạc
    if (
      target &&
      !samePosition(target, map.chargingStation) &&
      !this.hasEnoughBatteryForTarget(state, target)
    ) {
      return this.getChargingAction(state);
    }

    // Không tìm được target nào khả thi → về sạc
    if (!target) {
      return this.getChargingAction(state);
    }

    this.setCurrentTarget(target);

    // Đã đứng tại target → thực hiện hành động phù hợp (hút/đổ/sạc)
    if (samePosition(robot, target)) {
      return this.getActionAtTarget(state, target);
    }

    // Pin không đủ cho 1 bước di chuyển → đứng yên chờ
    if (this.getBatteryLoss(state) > robot.battery && !this.isAtChargingStation(state)) {
      return ACTIONS.STAY;
    }

    // Dùng heuristic greedy để chọn bước di chuyển tốt nhất về hướng target
    return this.chooseMoveTowardTarget(state, target);
  }

  // Xử lý tình huống cần về sạc: nếu đang ở trạm thì sạc, nếu chưa thì di chuyển về.
  getChargingAction(state) {
    const { robot, map } = state;
    this.setCurrentTarget(map.chargingStation);

    if (this.isAtChargingStation(state)) {
      return robot.battery < this.getMaxBattery(state)
        ? ACTIONS.CHARGE
        : ACTIONS.STAY;
    }

    if (
      this.hasEnoughBatteryForTrip(
        state,
        robot,
        map.chargingStation,
        robot.battery
      )
    ) {
      return this.chooseMoveTowardTarget(state, map.chargingStation);
    }

    return ACTIONS.STAY;
  }

  // Xác định công việc tiếp theo cho robot theo ưu tiên: nếu đầy hoặc hết rác trên map thì đổ rác => nhặt rác gần nhất.
  chooseWorkTarget(state) {
    const { robot, map } = state;

    // Đầy rác hoặc không còn rác trên map nhưng đang giữ rác => đến thùng rác để đổ
    if (robot.capacity >= robot.maxCapacity || (map.trashPositions.length === 0 && robot.capacity > 0)) {
      return this.canFullBatteryHandleTarget(state, map.trashCan)
        ? map.trashCan
        : null;
    }

    // Còn rác trên map => chọn rác gần nhất theo Manhattan mà pin đầy có thể xử lý được
    if (map.trashPositions.length > 0) {
      const manageableTrashPositions = map.trashPositions.filter((trash) =>
        this.canFullBatteryHandleTarget(state, trash)
      );

      return this.findNearestPosition(robot, manageableTrashPositions);
    }

    return null;
  }

  // Xác định hành động khi robot đã ở đúng vị trí target.
  getActionAtTarget(state, target) {
    const { robot, map } = state;

    if (samePosition(target, map.chargingStation) && robot.battery < this.getMaxBattery(state)) {
      return ACTIONS.CHARGE;
    }

    if (
      samePosition(target, map.trashCan) &&
      robot.capacity > 0 &&
      this.hasEnoughBatteryForTarget(state, target)
    ) {
      return ACTIONS.LET_TRASH_OUT;
    }

    if (
      this.hasTrashAtRobot(state) &&
      robot.capacity < robot.maxCapacity &&
      this.hasEnoughBatteryForTarget(state, target)
    ) {
      return ACTIONS.SUCK_TRASH;
    }

    return ACTIONS.STAY;
  }

  // Hàm heuristic chính của Greedy: chọn bước di chuyển dựa trên score.
  // score = Manhattan(ô, target) + số lần đã ghé * VISIT_PENALTY + backtrack penalty.
  // Ngoại lệ: khi target là trạm sạc, dùng BFS để đảm bảo tìm được đường về.
  chooseMoveTowardTarget(state, target) {
    // Khi đi về trạm sạc: dùng BFS thay heuristic để đảm bảo robot không bị kẹt
    if (samePosition(target, state.map.chargingStation)) {
      return this.chooseShortestPathMoveToTarget(state, target);
    }

    const candidates = this.getMoveCandidates(state.robot)
      .filter((candidate) => this.canMoveTo(state, candidate.position))
      .filter((candidate) =>
        this.canMoveAndKeepChargingReserve(state, candidate.position)
      )
      .map((candidate, index) => {
        // h(n): khoảng cách Manhattan đến target — thành phần heuristic chính
        const distance = this.manhattanDistance(candidate.position, target);
        // Phạt ô đã ghé nhiều lần để tránh lặp vòng
        const visits = this.getVisitCount(candidate.position);
        // Phạt nặng nếu robot định quay ngay lại ô vừa rời (trừ khi đó là target)
        const backtrackPenalty =
          this.previousPosition &&
          samePosition(candidate.position, this.previousPosition) &&
          !samePosition(candidate.position, target)
            ? BACKTRACK_PENALTY
            : 0;

        return {
          ...candidate,
          index,
          distance,
          visits,
          score: distance + visits * VISIT_PENALTY + backtrackPenalty,
        };
      });

    // Không có ô nào đủ điều kiện di chuyển → đứng yên
    if (candidates.length === 0) {
      return ACTIONS.STAY;
    }

    // Sắp xếp theo score tăng dần; tie-break bằng distance, visits, rồi index
    candidates.sort((a, b) => {
      return (
        a.score - b.score ||
        a.distance - b.distance ||
        a.visits - b.visits ||
        a.index - b.index
      );
    });

    return candidates[0].action;
  }

  // Dùng BFS nội bộ để tìm đường ngắn nhất đến target rồi đi bước đầu tiên.
  // Chỉ được gọi khi target là trạm sạc — đảm bảo robot luôn về được dù heuristic không đủ tốt.
  chooseShortestPathMoveToTarget(state, target) {
    const path = this.findShortestPath(state, state.robot, target);

    if (!path || path.length < 2) {
      return ACTIONS.STAY;
    }

    if (!this.canMoveAndKeepChargingReserve(state, path[1])) {
      return ACTIONS.STAY;
    }

    return this.getActionForStep(path[0], path[1]);
  }

  // Chuyển đổi hai vị trí liên tiếp trên path thành hành động di chuyển tương ứng.
  getActionForStep(fromPosition, toPosition) {
    if (toPosition.x === fromPosition.x && toPosition.y === fromPosition.y - 1) {
      return ACTIONS.UP;
    }

    if (toPosition.x === fromPosition.x && toPosition.y === fromPosition.y + 1) {
      return ACTIONS.DOWN;
    }

    if (toPosition.x === fromPosition.x - 1 && toPosition.y === fromPosition.y) {
      return ACTIONS.LEFT;
    }

    if (toPosition.x === fromPosition.x + 1 && toPosition.y === fromPosition.y) {
      return ACTIONS.RIGHT;
    }

    return ACTIONS.STAY;
  }

  // Kiểm tra xem robot có đủ pin để di chuyển đến nextPosition và còn đủ pin để về trạm sạc không.
  canMoveAndKeepChargingReserve(state, nextPosition) {
    const { robot, map } = state;
    const batteryLoss = this.getBatteryLoss(state);

    // Không đủ pin cho 1 bước di chuyển thì trả false
    if (robot.battery + EPSILON < batteryLoss) {
      return false;
    }

    const batteryAfterMove = robot.battery - batteryLoss;

    // Nếu bước tiếp theo chính là trạm sạc → chỉ cần đủ pin đi 1 bước
    if (samePosition(nextPosition, map.chargingStation)) {
      return batteryAfterMove + EPSILON >= 0;
    }

    // Tính khoảng cách thực tế từ nextPosition về trạm sạc để kiểm tra pin dự trữ
    const distanceToChargingStation = this.getShortestPathDistance(
      state,
      nextPosition,
      map.chargingStation
    );

    if (!Number.isFinite(distanceToChargingStation)) {
      return false;
    }

    return (
      batteryAfterMove + EPSILON >=
      distanceToChargingStation * batteryLoss
    );
  }

  // Cập nhật lịch sử vị trí: ghi nhớ previousPosition và tăng visitCount của ô hiện tại.
  rememberPosition(position) {
    if (this.currentPosition && samePosition(this.currentPosition, position)) {
      return;
    }

    this.previousPosition = this.currentPosition
      ? { ...this.currentPosition }
      : null;
    this.currentPosition = { x: position.x, y: position.y };
    const key = this.positionKey(position);
    this.visitCounts.set(key, this.getVisitCount(position) + 1);
  }

  // Trả về số lần robot đã ghé qua ô position trong lần chạy hiện tại.
  getVisitCount(position) {
    return this.visitCounts.get(this.positionKey(position)) ?? 0;
  }

  positionKey(position) {
    return `${position.x},${position.y}`;
  }

  // Quyết định có cần sạc ngay hay không trước khi xử lý target tiếp theo.
  shouldCharge(state) {
    const { robot } = state;
    const maxBattery = this.getMaxBattery(state);

    // Pin đã đầy => không cần sạc
    if (robot.battery >= maxBattery) {
      return false;
    }


    // Không có target công việc nào => không cần sạc
    const workTarget = this.chooseWorkTarget(state);
    if (!workTarget) {
      return false;
    }

    return !this.hasEnoughBatteryForTarget(state, workTarget);
  }

  // Kiểm tra pin hiện tại có đủ để đi đến target và thoát an toàn sau đó không.
  hasEnoughBatteryForTarget(state, target) {
    const { robot } = state;
    return this.hasEnoughBatteryForTrip(state, robot, target, robot.battery);
  }

  // Kiểm tra xem với pin đầy xuất phát từ trạm sạc có đủ để xử lý target không.
  // Dùng để lọc các rác mà robot không bao giờ có thể xử lý dù pin đầy.
  canFullBatteryHandleTarget(state, target) {
    const { map } = state;
    return this.hasEnoughBatteryForTrip(
      state,
      map.chargingStation,
      target,
      this.getMaxBattery(state)
    );
  }

  // Kiểm tra xem pin của robot có đủ để đến target không
  hasEnoughBatteryForTrip(state, fromPosition, target, battery) {
    return battery >= this.getRequiredBatteryForTarget(state, fromPosition, target);
  }

  // Tính tổng pin cần thiết để đi từ fromPosition đến target và thoát an toàn.
  // Bao gồm: di chuyển đến target + chi phí hành động + di chuyển về điểm an toàn tiếp theo.
  getRequiredBatteryForTarget(state, fromPosition, target) {
    const { robot, map } = state;
    const batteryLoss = this.getBatteryLoss(state);
    const actionCost = this.getActionCost(state);
    const distanceToTarget = this.getShortestPathDistance(state, fromPosition, target);

    if (!Number.isFinite(distanceToTarget)) {
      return Number.POSITIVE_INFINITY;
    }

    let requiredBattery = distanceToTarget * batteryLoss;

    // Target là trạm sạc => chỉ cần pin đi đến đó, không cần tính thêm
    if (samePosition(target, map.chargingStation)) {
      return requiredBattery;
    }

    // Target là thùng rác và robot đang giữ rác => cộng thêm chi phí đổ + về trạm
    if (samePosition(target, map.trashCan) && robot.capacity > 0) {
      const distanceToChargingStation = this.getShortestPathDistance(
        state,
        target,
        map.chargingStation
      );

      if (!Number.isFinite(distanceToChargingStation)) {
        return Number.POSITIVE_INFINITY;
      }

      requiredBattery += actionCost;
      requiredBattery += distanceToChargingStation * batteryLoss;
      return requiredBattery;
    }

    // Target là rác và robot chưa đầy => cộng thêm chi phí hút + đường thoát an toàn
    if (
      map.trashPositions.some((trash) => samePosition(trash, target)) &&
      robot.capacity < robot.maxCapacity
    ) {
      requiredBattery += actionCost;

      const willBeFull = robot.capacity + 1 >= robot.maxCapacity;

      // Sau khi hút sẽ đầy => phải đến thùng rác trước rồi mới về trạm
      if (willBeFull) {
        const distanceToTrashCan = this.getShortestPathDistance(
          state,
          target,
          map.trashCan
        );
        const distanceTrashCanToChargingStation = this.getShortestPathDistance(
          state,
          map.trashCan,
          map.chargingStation
        );

        if (
          !Number.isFinite(distanceToTrashCan) ||
          !Number.isFinite(distanceTrashCanToChargingStation)
        ) {
          return Number.POSITIVE_INFINITY;
        }

        requiredBattery += distanceToTrashCan * batteryLoss;
        requiredBattery += actionCost; // chi phí đổ rác tại thùng
        requiredBattery += distanceTrashCanToChargingStation * batteryLoss;
      } else {
        
        // Sau khi hút chưa đầy => có thể về trạm trực tiếp
        const distanceToChargingStation = this.getShortestPathDistance(
          state,
          target,
          map.chargingStation
        );

        if (!Number.isFinite(distanceToChargingStation)) {
          return Number.POSITIVE_INFINITY;
        }

        requiredBattery += distanceToChargingStation * batteryLoss;
      }

      return requiredBattery;
    }

    // Trường hợp còn lại: cộng thêm đường từ target về trạm sạc
    const distanceToChargingStation = this.getShortestPathDistance(
      state,
      target,
      map.chargingStation
    );

    if (!Number.isFinite(distanceToChargingStation)) {
      return Number.POSITIVE_INFINITY;
    }

    requiredBattery += distanceToChargingStation * batteryLoss;
    return requiredBattery;
  }

  // Tính số bước ngắn nhất giữa hai vị trí bằng BFS nội bộ,nếu không có đường đi trả về POSITIVE_INFINITY
  getShortestPathDistance(state, fromPosition, target) {
    const path = this.findShortestPath(state, fromPosition, target);

    if (!path) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.max(0, path.length - 1);
  }

  // Tìm đường ngắn nhất từ fromPosition đến target trên map hiện tại bằng BFS nội bộ
  // Chỉ dùng để tính khoảng cách (kiểm tra pin) và để về trạm sạc — không phải thuật toán điều hướng chính.
  findShortestPath(state, fromPosition, target) {
    if (!fromPosition || !target) {
      return null;
    }

    if (samePosition(fromPosition, target)) {
      return [{ x: fromPosition.x, y: fromPosition.y }];
    }

    const start = { x: fromPosition.x, y: fromPosition.y };
    const queue = [{ position: start, path: [start] }];
    const visited = new Set([this.positionKey(start)]);

    while (queue.length > 0) {
      const currentNode = queue.shift();

      for (const candidate of this.getMoveCandidates(currentNode.position)) {
        const key = this.positionKey(candidate.position);

        if (visited.has(key) || !this.canMoveTo(state, candidate.position)) {
          continue;
        }

        const nextPath = [...currentNode.path, candidate.position];

        if (samePosition(candidate.position, target)) {
          return nextPath;
        }

        visited.add(key);
        queue.push({
          position: candidate.position,
          path: nextPath,
        });
      }
    }

    return null;
  }
}

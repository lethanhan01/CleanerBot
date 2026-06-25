// ============================================================
// environment.js — Luật vật lý của thế giới simulation
// Nhiệm vụ: thực thi hành động, sinh bản đồ, quản lý trạng thái thế giới
// Đây là "luật chơi" — quyết định robot được làm gì và thế giới thay đổi ra sao
// ============================================================

import { ACTIONS, CleanerMap, Robot, SimulationState, simulationStateFromPlain } from "./models.js";

const DEFAULT_MAX_BATTERY = 100;
const ACTION_COST = 1; // chi phí pin cho các hành động không di chuyển (hút rác, đổ rác)

// Cấu hình mặc định khi khởi tạo mà không truyền config
const DEFAULT_CONFIG = Object.freeze({
  gridSizeX: 8,
  gridSizeY: 8,
  trashCount: 4,
  obstacleCount: 5,
  maxCapacity: 5,
  maxBattery: DEFAULT_MAX_BATTERY,
  batteryLoss: 1, // pin hao mỗi bước di chuyển
});

export class Environment {
  constructor(config = {}) {
    this.config = this.normalizeConfig(config);
    this.initialState = this.createInitialState(this.config); // trạng thái ban đầu để reset
    this.state = this.initialState.clone();                   // trạng thái hiện tại đang chạy
  }

  // Tạo trạng thái ban đầu từ config:
  // - Đặt trạm sạc ở góc trên trái (0,0)
  // - Đặt thùng rác ở góc dưới phải
  // - Sinh tường ngẫu nhiên đảm bảo bản đồ luôn thông
  // - Sinh rác ngẫu nhiên ở các ô còn lại
  createInitialState(config = this.config) {
    const gridSizeX = config.gridSizeX;
    const gridSizeY = config.gridSizeY;
    const start = { x: 0, y: 0 };
    const chargingStation = { ...start };
    const trashCan = { x: gridSizeX - 1, y: gridSizeY - 1 };
    const reservedPositions = [start, trashCan]; // các ô không được đặt tường/rác

    // Sinh tường đảm bảo bản đồ luôn thông (dùng BFS kiểm tra sau mỗi lần đặt tường)
    const obstaclePositions = this.pickConnectedObstaclePositions(
      config.obstacleCount,
      reservedPositions,
      gridSizeX,
      gridSizeY
    );

    // Lấy danh sách ô có thể đi được từ vị trí xuất phát
    const reachablePositions = this.getReachablePositions(
      start,
      obstaclePositions,
      gridSizeX,
      gridSizeY
    );

    // Sinh rác chỉ ở những ô đi được và không phải ô đặc biệt
    const trashPositions = this.pickRandomPositionsFromList(
      config.trashCount,
      reachablePositions.filter((position) => {
        return ![...reservedPositions, ...obstaclePositions].some((blocked) =>
          samePosition(blocked, position)
        );
      })
    );

    const map = new CleanerMap({
      grid_size_x: gridSizeX,
      grid_size_y: gridSizeY,
      start_x: start.x,
      start_y: start.y,
      trashPositions,
      obstaclePositions,
      chargingStation,
      trashCan,
    });

    const robot = new Robot({
      battery: config.maxBattery,
      capacity: 0,
      maxCapacity: config.maxCapacity,
      x: map.start_x,
      y: map.start_y,
    });

    return new SimulationState({
      robot,
      map,
      config: this.createStateConfig(config),
    });
  }

  // Sinh bản đồ mới hoàn toàn theo config mới
  generate(config = this.config) {
    this.config = this.normalizeConfig(config);
    this.initialState = this.createInitialState(this.config);
    this.state = this.initialState.clone();
    return this.getState();
  }

  // Cập nhật config mà không nhất thiết phải sinh lại bản đồ
  // Chỉ sinh lại nếu thay đổi kích thước lưới, số rác, số tường
  updateConfig(config = this.config) {
    const nextConfig = this.normalizeConfig(config);
    const shouldRegenerateMap =
      nextConfig.gridSizeX !== this.config.gridSizeX ||
      nextConfig.gridSizeY !== this.config.gridSizeY ||
      nextConfig.trashCount !== this.config.trashCount ||
      nextConfig.obstacleCount !== this.config.obstacleCount;

    if (shouldRegenerateMap) {
      return this.generate(nextConfig);
    }

    // Chỉ cập nhật các thông số pin/sức chứa mà không sinh lại bản đồ
    const wasAtFullBattery =
      this.state.robot.battery >= this.config.maxBattery;
    this.config = nextConfig;
    this.state.config = this.createStateConfig(nextConfig);
    this.state.robot.maxCapacity = nextConfig.maxCapacity;
    this.state.robot.battery = wasAtFullBattery
      ? nextConfig.maxBattery
      : Math.min(this.state.robot.battery, nextConfig.maxBattery);
    this.state.robot.capacity = Math.min(
      this.state.robot.capacity,
      nextConfig.maxCapacity
    );
    this.initialState.config = this.createStateConfig(nextConfig);
    this.initialState.robot.maxCapacity = nextConfig.maxCapacity;
    this.initialState.robot.battery = nextConfig.maxBattery;
    this.initialState.robot.capacity = Math.min(
      this.initialState.robot.capacity,
      nextConfig.maxCapacity
    );
    this.updateDoneStatus();
    return this.getState();
  }

  // Reset về trạng thái ban đầu của bản đồ hiện tại (không sinh bản đồ mới)
  reset() {
    this.state = this.initialState.clone();
    return this.getState();
  }

  // Lưu trạng thái hiện tại làm trạng thái ban đầu mới
  // Dùng sau khi người dùng chỉnh sửa bản đồ thủ công
  saveCurrentAsInitialState() {
    const cleanInitialState = this.state.clone();
    this.config = this.normalizeConfig({
      gridSizeX: cleanInitialState.map.grid_size_x,
      gridSizeY: cleanInitialState.map.grid_size_y,
      trashCount: cleanInitialState.map.trashPositions.length,
      obstacleCount: cleanInitialState.map.obstaclePositions.length,
      maxCapacity: this.config.maxCapacity,
      maxBattery: this.config.maxBattery,
      batteryLoss: this.config.batteryLoss,
    });
    cleanInitialState.config = this.createStateConfig(this.config);
    // Reset robot về vị trí xuất phát với pin đầy và túi rỗng
    cleanInitialState.robot.battery = this.config.maxBattery;
    cleanInitialState.robot.capacity = 0;
    cleanInitialState.robot.maxCapacity = this.config.maxCapacity;
    cleanInitialState.robot.x = cleanInitialState.map.start_x;
    cleanInitialState.robot.y = cleanInitialState.map.start_y;
    cleanInitialState.steps = 0;
    cleanInitialState.latestAction = null;
    cleanInitialState.latestLog = "Map ready.";
    cleanInitialState.map.done =
      cleanInitialState.map.trashPositions.length === 0 &&
      cleanInitialState.robot.capacity === 0 &&
      samePosition(cleanInitialState.robot, cleanInitialState.map.chargingStation);
    this.initialState = cleanInitialState;
  }

  // Chuẩn hóa config: ép về kiểu số nguyên và clamp trong khoảng hợp lệ
  normalizeConfig(config) {
    const gridSizeX = clampInteger(config.gridSizeX, 4, 20, DEFAULT_CONFIG.gridSizeX);
    const gridSizeY = clampInteger(config.gridSizeY, 4, 20, DEFAULT_CONFIG.gridSizeY);
    const usableCellCount = Math.max(0, gridSizeX * gridSizeY - 2); // trừ 2 ô đặc biệt
    const obstacleCount = clampInteger(config.obstacleCount, 0, usableCellCount, DEFAULT_CONFIG.obstacleCount);
    const maxTrashCount = Math.max(0, usableCellCount - obstacleCount);
    const trashCount = clampInteger(config.trashCount, 0, maxTrashCount, DEFAULT_CONFIG.trashCount);
    const maxCapacity = clampInteger(config.maxCapacity, 1, 20, DEFAULT_CONFIG.maxCapacity);
    const maxBattery = clampInteger(config.maxBattery, 1, 100, DEFAULT_CONFIG.maxBattery);
    const batteryLoss = clampNumber(config.batteryLoss, 0, 100, DEFAULT_CONFIG.batteryLoss);

    return {
      gridSizeX,
      gridSizeY,
      trashCount,
      obstacleCount,
      maxCapacity,
      maxBattery,
      batteryLoss,
    };
  }

  // Tạo config nhúng vào SimulationState (chỉ giữ các thông số thuật toán cần dùng)
  createStateConfig(config = this.config) {
    return {
      maxBattery: config.maxBattery,
      batteryLoss: config.batteryLoss,
      actionCost: ACTION_COST,
    };
  }

  // Sinh ngẫu nhiên `count` vị trí trong lưới, tránh các ô đã bị chiếm
  pickRandomPositions(count, blockedPositions, gridSizeX, gridSizeY) {
    const availablePositions = [];

    for (let y = 0; y < gridSizeY; y += 1) {
      for (let x = 0; x < gridSizeX; x += 1) {
        const position = { x, y };

        if (!blockedPositions.some((blocked) => samePosition(blocked, position))) {
          availablePositions.push(position);
        }
      }
    }

    shuffleArray(availablePositions);
    return availablePositions.slice(0, count);
  }

  // Sinh tường đảm bảo bản đồ luôn thông sau mỗi lần đặt tường
  // Cách làm: thử từng ứng viên, sau khi thêm tường thì BFS kiểm tra còn thông không
  // Nếu không thông → bỏ qua ứng viên đó, thử cái tiếp theo
  pickConnectedObstaclePositions(count, reservedPositions, gridSizeX, gridSizeY) {
    const candidates = this.pickRandomPositions(
      gridSizeX * gridSizeY,
      reservedPositions,
      gridSizeX,
      gridSizeY
    );
    const obstaclePositions = [];

    for (const candidate of candidates) {
      if (obstaclePositions.length >= count) {
        break;
      }

      const nextObstaclePositions = [...obstaclePositions, candidate];

      // Kiểm tra bản đồ còn thông không nếu thêm tường này
      if (
        this.isWalkableAreaConnected(
          nextObstaclePositions,
          gridSizeX,
          gridSizeY
        )
      ) {
        obstaclePositions.push(candidate);
      }
    }

    return obstaclePositions;
  }

  // Chọn ngẫu nhiên `count` vị trí từ danh sách có sẵn (shuffle rồi slice)
  pickRandomPositionsFromList(count, positions) {
    const availablePositions = positions.map((position) => ({ ...position }));
    shuffleArray(availablePositions);
    return availablePositions.slice(0, count);
  }

  // Kiểm tra toàn bộ vùng đi được có liên thông không (dùng BFS)
  // Nếu số ô BFS tìm được = số ô không phải tường → thông
  isWalkableAreaConnected(obstaclePositions, gridSizeX, gridSizeY) {
    const start = this.findFirstWalkablePosition(
      obstaclePositions,
      gridSizeX,
      gridSizeY
    );

    if (!start) {
      return true; // không có ô nào đi được → coi như thông (edge case)
    }

    const reachablePositions = this.getReachablePositions(
      start,
      obstaclePositions,
      gridSizeX,
      gridSizeY
    );
    const walkableCellCount =
      gridSizeX * gridSizeY - obstaclePositions.length;

    return reachablePositions.length === walkableCellCount;
  }

  // Tìm ô đi được đầu tiên trong lưới (theo thứ tự từ trái sang phải, trên xuống dưới)
  findFirstWalkablePosition(obstaclePositions, gridSizeX, gridSizeY) {
    for (let y = 0; y < gridSizeY; y += 1) {
      for (let x = 0; x < gridSizeX; x += 1) {
        const position = { x, y };

        if (!isPositionBlocked(position, obstaclePositions)) {
          return position;
        }
      }
    }
    return null;
  }

  // BFS tìm tất cả ô có thể đến được từ `start` (không xuyên qua tường, không ra ngoài lưới)
  getReachablePositions(start, obstaclePositions, gridSizeX, gridSizeY) {
    const reachablePositions = [];
    const queue = [start];
    const visited = new Set([positionKey(start)]);

    while (queue.length > 0) {
      const current = queue.shift();
      reachablePositions.push(current);

      for (const neighbor of getNeighborPositions(current)) {
        const key = positionKey(neighbor);

        if (
          visited.has(key) ||
          neighbor.x < 0 ||
          neighbor.y < 0 ||
          neighbor.x >= gridSizeX ||
          neighbor.y >= gridSizeY ||
          isPositionBlocked(neighbor, obstaclePositions)
        ) {
          continue;
        }

        visited.add(key);
        queue.push(neighbor);
      }
    }

    return reachablePositions;
  }

  // Lấy snapshot state hiện tại (clone để tránh bị mutate từ bên ngoài)
  getState() {
    return this.state.clone();
  }

  getInitialState() {
    return this.initialState.clone();
  }

  // Nạp state từ plain object (ví dụ từ JSON) — chuẩn hóa và lưu làm initialState mới
  loadState(state) {
    const nextState = simulationStateFromPlain(state);

    this.config = this.normalizeConfig({
      gridSizeX: nextState.map.grid_size_x,
      gridSizeY: nextState.map.grid_size_y,
      trashCount: nextState.map.trashPositions.length,
      obstacleCount: nextState.map.obstaclePositions.length,
      maxCapacity: nextState.robot.maxCapacity,
      maxBattery:
        nextState.config?.maxBattery ??
        nextState.robot.battery ??
        this.config.maxBattery,
      batteryLoss: nextState.config?.batteryLoss ?? this.config.batteryLoss,
    });

    nextState.config = this.createStateConfig(this.config);
    nextState.robot.battery = Math.min(
      nextState.robot.battery,
      this.config.maxBattery
    );
    this.initialState = nextState.clone();
    this.state = nextState.clone();
    this.updateDoneStatus();
    this.initialState.map.done = this.state.map.done;
    return this.getState();
  }

  // Khôi phục state về một snapshot cụ thể (dùng cho undo trong simulator)
  restoreState(state) {
    this.state = simulationStateFromPlain(state);
    return this.getState();
  }

  // Xử lý khi người dùng chỉnh sửa bản đồ thủ công bằng tool
  applyMapEdit(tool, x, y) {
    if (!this.isInsideMap(x, y)) {
      this.state.latestLog = `Cannot edit (${x}, ${y}): outside map.`;
      return this.getState();
    }

    switch (tool) {
      case "inspect":   this.inspectCell(x, y); break;
      case "empty":     this.clearCell(x, y); break;
      case "trash":     this.placeTrash(x, y); break;
      case "obstacle":  this.placeObstacle(x, y); break;
      case "charger":   this.placeChargingStation(x, y); break;
      case "trash_can": this.placeTrashCan(x, y); break;
      case "robot_start": this.placeRobotStart(x, y); break;
      default:
        this.state.latestLog = `Unknown edit tool: ${tool}`;
        break;
    }

    this.updateDoneStatus();
    this.state.latestAction = `edit:${tool}`;
    return this.getState();
  }

  inspectCell(x, y) {
    this.state.latestLog = this.getCellInfo(x, y);
  }

  // Trả về mô tả text về ô (x,y) — robot ở đây, có rác, có tường, ...
  getCellInfo(x, y) {
    if (!this.isInsideMap(x, y)) {
      return `Cell (${x}, ${y}) is outside map.`;
    }

    const position = { x, y };
    const labels = [];
    const { robot, map } = this.state;

    if (samePosition(robot, position)) {
      labels.push(
        `robot battery ${formatNumber(robot.battery)}/${formatNumber(this.state.config.maxBattery)}, capacity ${robot.capacity}/${robot.maxCapacity}`
      );
    }

    if (this.hasTrash(x, y)) labels.push("trash");
    if (this.hasObstacle(x, y)) labels.push("obstacle");
    if (samePosition(map.chargingStation, position)) labels.push("charging station");
    if (samePosition(map.trashCan, position)) labels.push("trash can");

    return labels.length > 0
      ? `Cell (${x}, ${y}): ${labels.join(", ")}.`
      : `Cell (${x}, ${y}) is empty.`;
  }

  // Xóa rác và tường tại ô (x,y)
  clearCell(x, y) {
    this.removeTrashAt(x, y);
    this.removeObstacleAt(x, y);
    this.state.latestLog = `Cleared editable items at (${x}, ${y}).`;
  }

  // Đặt rác tại (x,y) — kiểm tra không được đặt trên tường hoặc ô đặc biệt
  placeTrash(x, y) {
    const position = { x, y };

    if (this.hasObstacle(x, y)) {
      this.state.latestLog = "Cannot place trash on obstacle.";
      return;
    }

    if (samePosition(this.state.map.chargingStation, position) || samePosition(this.state.map.trashCan, position)) {
      this.state.latestLog = "Cannot place trash on station cells.";
      return;
    }

    if (!this.hasTrash(x, y)) {
      this.state.map.trashPositions.push(position);
    }

    this.state.latestLog = `Placed trash at (${x}, ${y}).`;
  }

  // Đặt tường tại (x,y) — không được đặt trên robot hoặc ô đặc biệt
  placeObstacle(x, y) {
    const position = { x, y };

    if (samePosition(this.state.robot, position)) {
      this.state.latestLog = "Cannot place obstacle on robot.";
      return;
    }

    if (samePosition(this.state.map.chargingStation, position) || samePosition(this.state.map.trashCan, position)) {
      this.state.latestLog = "Cannot place obstacle on station cells.";
      return;
    }

    this.removeTrashAt(x, y); // tường ghi đè rác nếu có
    if (!this.hasObstacle(x, y)) {
      this.state.map.obstaclePositions.push(position);
    }

    this.state.latestLog = `Placed obstacle at (${x}, ${y}).`;
  }

  // Di chuyển trạm sạc đến vị trí mới
  placeChargingStation(x, y) {
    const position = { x, y };

    if (samePosition(this.state.map.trashCan, position)) {
      this.state.latestLog = "Cannot place charging station on trash can.";
      return;
    }

    this.removeTrashAt(x, y);
    this.removeObstacleAt(x, y);
    this.state.map.chargingStation = position;
    this.state.latestLog = `Moved charging station to (${x}, ${y}).`;
  }

  // Di chuyển thùng rác đến vị trí mới
  placeTrashCan(x, y) {
    const position = { x, y };

    if (samePosition(this.state.map.chargingStation, position)) {
      this.state.latestLog = "Cannot place trash can on charging station.";
      return;
    }

    this.removeTrashAt(x, y);
    this.removeObstacleAt(x, y);
    this.state.map.trashCan = position;
    this.state.latestLog = `Moved trash can to (${x}, ${y}).`;
  }

  // Đặt vị trí xuất phát của robot (cũng là vị trí hiện tại của robot)
  placeRobotStart(x, y) {
    this.removeObstacleAt(x, y);
    this.state.robot.x = x;
    this.state.robot.y = y;
    this.state.map.start_x = x;
    this.state.map.start_y = y;
    this.state.latestLog = `Moved robot start to (${x}, ${y}).`;
  }

  // Sinh thêm rác ngẫu nhiên vào bản đồ đang chạy (dùng để test mid-simulation)
  spawnRandomTrash(count = 1) {
    const { robot, map } = this.state;
    const reservedPositions = [
      { x: robot.x, y: robot.y },
      map.chargingStation,
      map.trashCan,
      ...map.trashPositions,
      ...map.obstaclePositions,
    ];
    const spawnPositions = this.pickRandomPositions(
      count,
      reservedPositions,
      map.grid_size_x,
      map.grid_size_y
    );

    if (spawnPositions.length === 0) {
      this.state.latestAction = "spawn_trash";
      this.state.latestLog = "No available cell for new trash.";
      return this.getState();
    }

    for (const position of spawnPositions) {
      this.state.map.trashPositions.push({ ...position });
    }

    this.state.latestAction = "spawn_trash";
    this.state.latestLog =
      spawnPositions.length === 1
        ? `Spawned random trash at (${spawnPositions[0].x}, ${spawnPositions[0].y}).`
        : `Spawned ${spawnPositions.length} random trash items.`;
    this.updateDoneStatus();
    return this.getState();
  }

  // ============================================================
  // THỰC THI HÀNH ĐỘNG — điểm vào duy nhất để thay đổi state
  // Thuật toán gọi hàm này thông qua Simulator
  // ============================================================
  applyAction(action) {
    if (this.state.map.done) {
      this.state.latestAction = ACTIONS.STAY;
      this.state.latestLog = "Simulation already done.";
      return this.getState();
    }

    this.state.latestAction = action ?? ACTIONS.STAY;

    switch (action) {
      case ACTIONS.UP:    this.moveRobot(0, -1, action); break;
      case ACTIONS.DOWN:  this.moveRobot(0, 1, action); break;
      case ACTIONS.LEFT:  this.moveRobot(-1, 0, action); break;
      case ACTIONS.RIGHT: this.moveRobot(1, 0, action); break;
      case ACTIONS.CHARGE:        this.chargeRobot(); break;
      case ACTIONS.SUCK_TRASH:    this.suckTrash(); break;
      case ACTIONS.LET_TRASH_OUT: this.letTrashOut(); break;
      case ACTIONS.STAY:
      case null:
      case undefined:
        this.state.latestLog = "Robot stayed in place.";
        break;
      default:
        this.state.latestAction = `${action}`;
        this.state.latestLog = `Unknown action: ${action}`;
        break;
    }

    this.updateDoneStatus();
    return this.getState();
  }

  // Di chuyển robot theo hướng (deltaX, deltaY)
  // Kiểm tra: pin còn không, không ra ngoài lưới, không đâm vào tường
  moveRobot(deltaX, deltaY, actionName) {
    const nextX = this.state.robot.x + deltaX;
    const nextY = this.state.robot.y + deltaY;

    if (this.state.robot.battery <= 0) {
      this.state.latestLog = "Cannot move: battery is empty.";
      return;
    }

    if (!this.isInsideMap(nextX, nextY)) {
      this.state.latestLog = `Cannot move ${actionName}: outside map.`;
      return;
    }

    if (this.hasObstacle(nextX, nextY)) {
      this.state.latestLog = `Cannot move ${actionName}: obstacle blocked.`;
      return;
    }

    this.state.robot.x = nextX;
    this.state.robot.y = nextY;
    this.consumeBattery(this.config.batteryLoss); // trừ pin theo batteryLoss config
    this.state.steps += 1;
    this.state.latestLog = `Moved ${actionName}.`;
  }

  // Sạc pin về đầy — chỉ được khi robot đang đứng tại trạm sạc
  chargeRobot() {
    const { robot, map } = this.state;

    if (!samePosition(robot, map.chargingStation)) {
      this.state.latestLog = "Cannot charge: robot is not at charging station.";
      return;
    }

    robot.battery = this.config.maxBattery;
    this.state.steps += 1;
    this.state.latestLog = "Battery charged.";
  }

  // Hút rác — chỉ được khi đứng trên ô có rác và túi chưa đầy
  suckTrash() {
    const { robot, map } = this.state;
    const trashIndex = map.trashPositions.findIndex((trash) => samePosition(robot, trash));

    if (trashIndex === -1) {
      this.state.latestLog = "Cannot suck trash: no trash at this cell.";
      return;
    }

    if (robot.capacity >= robot.maxCapacity) {
      this.state.latestLog = "Cannot suck trash: capacity is full.";
      return;
    }

    map.trashPositions.splice(trashIndex, 1); // xóa đống rác khỏi bản đồ
    robot.capacity += 1;
    this.consumeBattery(ACTION_COST);
    this.state.steps += 1;
    this.state.latestLog = "Trash collected.";
  }

  // Đổ rác — chỉ được khi đứng tại thùng rác và túi có rác
  letTrashOut() {
    const { robot, map } = this.state;

    if (!samePosition(robot, map.trashCan)) {
      this.state.latestLog = "Cannot empty trash: robot is not at trash can.";
      return;
    }

    if (robot.capacity === 0) {
      this.state.latestLog = "Trash container is already empty.";
      return;
    }

    robot.capacity = 0; // đổ hết rác
    this.consumeBattery(ACTION_COST);
    this.state.steps += 1;
    this.state.latestLog = "Trash container emptied.";
  }

  // Kiểm tra điều kiện hoàn thành: hết rác + túi rỗng + robot ở trạm sạc
  updateDoneStatus() {
    const { robot, map } = this.state;
    map.done =
      map.trashPositions.length === 0 &&
      robot.capacity === 0 &&
      samePosition(robot, map.chargingStation);
  }

  // Kiểm tra tọa độ (x,y) có nằm trong lưới không
  isInsideMap(x, y) {
    return x >= 0 && y >= 0 && x < this.state.map.grid_size_x && y < this.state.map.grid_size_y;
  }

  hasObstacle(x, y) {
    return this.state.map.obstaclePositions.some((obstacle) => obstacle.x === x && obstacle.y === y);
  }

  hasTrash(x, y) {
    return this.state.map.trashPositions.some((trash) => trash.x === x && trash.y === y);
  }

  removeTrashAt(x, y) {
    this.state.map.trashPositions = this.state.map.trashPositions.filter((trash) => {
      return trash.x !== x || trash.y !== y;
    });
  }

  removeObstacleAt(x, y) {
    this.state.map.obstaclePositions = this.state.map.obstaclePositions.filter((obstacle) => {
      return obstacle.x !== x || obstacle.y !== y;
    });
  }

  // Trừ pin, không cho xuống dưới 0
  consumeBattery(amount) {
    this.state.robot.battery = Math.max(0, this.state.robot.battery - amount);
  }
}

// Kiểm tra hai vị trí có trùng nhau không
export function samePosition(a, b) {
  return a.x === b.x && a.y === b.y;
}

// ============================================================
// Các hàm tiện ích nội bộ
// ============================================================

// Ép value về số nguyên trong khoảng [min, max], dùng fallback nếu không hợp lệ
function clampInteger(value, min, max, fallback) {
  const numberValue = Number.parseInt(value, 10);
  if (Number.isNaN(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

// Ép value về số thực trong khoảng [min, max], dùng fallback nếu không hợp lệ
function clampNumber(value, min, max, fallback) {
  const numberValue = Number.parseFloat(value);
  if (Number.isNaN(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function formatNumber(value) {
  return Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(2))}`;
}

function isPositionBlocked(position, blockedPositions) {
  return blockedPositions.some((blocked) => samePosition(blocked, position));
}

// Tạo key dạng "x,y" để dùng làm key trong Set/Map
function positionKey(position) {
  return `${position.x},${position.y}`;
}

// Trả về 4 ô xung quanh (trên, dưới, trái, phải)
function getNeighborPositions(position) {
  return [
    { x: position.x, y: position.y - 1 },
    { x: position.x, y: position.y + 1 },
    { x: position.x - 1, y: position.y },
    { x: position.x + 1, y: position.y },
  ];
}

// Fisher-Yates shuffle — xáo trộn mảng ngẫu nhiên tại chỗ
function shuffleArray(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = items[index];
    items[index] = items[randomIndex];
    items[randomIndex] = currentItem;
  }
}

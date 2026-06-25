// ============================================================
// models.js — Định nghĩa toàn bộ cấu trúc dữ liệu của simulation
// Đây là nền tảng: mọi file khác đều import và dùng các class này
// ============================================================

// Danh sách tất cả hành động hợp lệ mà robot có thể thực hiện
// Object.freeze → không ai được thêm/sửa/xóa sau khi khai báo
export const ACTIONS = Object.freeze({
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  CHARGE: "charge",           // sạc pin (phải đứng tại trạm sạc)
  SUCK_TRASH: "suck_trash",   // hút rác (phải đứng trên ô có rác)
  LET_TRASH_OUT: "let_trash_out", // đổ rác (phải đứng tại thùng rác)
  STAY: "stay",               // đứng yên (không làm gì)
});

// Trạng thái của robot tại một thời điểm
export class Robot {
  constructor({ battery = 100, capacity = 0, maxCapacity = 5, x = 0, y = 0 } = {}) {
    this.battery = battery;       // pin hiện tại
    this.capacity = capacity;     // lượng rác đang mang
    this.maxCapacity = maxCapacity; // sức chứa tối đa của túi
    this.x = x;                   // vị trí cột
    this.y = y;                   // vị trí hàng
  }

  // Tạo bản sao độc lập — dùng để lưu lịch sử (undo) mà không ảnh hưởng bản gốc
  clone() {
    return new Robot({
      battery: this.battery,
      capacity: this.capacity,
      maxCapacity: this.maxCapacity,
      x: this.x,
      y: this.y,
    });
  }
}

// Trạng thái của bản đồ tại một thời điểm
export class CleanerMap {
  constructor({
    grid_size_x = 8,
    grid_size_y = 8,
    start_x = 0,
    start_y = 0,
    trashPositions = [],
    obstaclePositions = [],
    chargingStation = { x: 0, y: 0 },
    trashCan = { x: 7, y: 7 },
    done = false,
  } = {}) {
    this.grid_size_x = grid_size_x;           // chiều rộng lưới
    this.grid_size_y = grid_size_y;           // chiều cao lưới
    this.start_x = start_x;                   // vị trí xuất phát của robot (cột)
    this.start_y = start_y;                   // vị trí xuất phát của robot (hàng)
    this.trashPositions = trashPositions;     // mảng {x,y} của từng đống rác còn lại
    this.obstaclePositions = obstaclePositions; // mảng {x,y} của các tường/chướng ngại
    this.chargingStation = chargingStation;   // vị trí trạm sạc pin {x,y}
    this.trashCan = trashCan;                 // vị trí thùng rác {x,y}
    this.done = done;                         // true khi hoàn thành toàn bộ nhiệm vụ
  }

  // Tạo bản sao sâu (deep clone) — mảng positions phải clone từng phần tử
  clone() {
    return new CleanerMap({
      grid_size_x: this.grid_size_x,
      grid_size_y: this.grid_size_y,
      start_x: this.start_x,
      start_y: this.start_y,
      trashPositions: this.trashPositions.map((position) => ({ ...position })),
      obstaclePositions: this.obstaclePositions.map((position) => ({ ...position })),
      chargingStation: { ...this.chargingStation },
      trashCan: { ...this.trashCan },
      done: this.done,
    });
  }
}

// Snapshot toàn bộ trạng thái simulation tại một thời điểm cụ thể
// Đây là "ảnh chụp" — lưu cái này là có thể undo về đúng thời điểm đó
export class SimulationState {
  constructor({ robot, map, config = {}, steps = 0, latestAction = null, latestLog = "No action yet." }) {
    this.robot = robot;               // trạng thái robot
    this.map = map;                   // trạng thái bản đồ
    this.config = { ...config };      // cấu hình (pin tối đa, mức hao pin, ...)
    this.steps = steps;               // tổng số bước đã thực hiện
    this.latestAction = latestAction; // hành động vừa thực hiện (để hiển thị UI)
    this.latestLog = latestLog;       // thông báo mô tả bước vừa xảy ra
  }

  // Tạo bản sao độc lập hoàn toàn
  clone() {
    return new SimulationState({
      robot: this.robot.clone(),
      map: this.map.clone(),
      config: { ...this.config },
      steps: this.steps,
      latestAction: this.latestAction,
      latestLog: this.latestLog,
    });
  }
}

// Chuyển đổi object thô (plain object) thành SimulationState có đầy đủ method
// Dùng khi load state từ JSON hoặc từ localStorage
export function simulationStateFromPlain(value = {}) {
  if (value instanceof SimulationState) {
    return value.clone();
  }

  return new SimulationState({
    robot: value.robot instanceof Robot ? value.robot.clone() : new Robot(value.robot),
    map: value.map instanceof CleanerMap ? value.map.clone() : new CleanerMap(value.map),
    config: { ...(value.config ?? {}) },
    steps: value.steps ?? 0,
    latestAction: value.latestAction ?? null,
    latestLog: value.latestLog ?? "No action yet.",
  });
}

// Chuyển SimulationState thành plain object thuần túy (để lưu JSON, gửi API, ...)
export function simulationStateToPlain(state) {
  const snapshot = simulationStateFromPlain(state);

  return {
    robot: {
      battery: snapshot.robot.battery,
      capacity: snapshot.robot.capacity,
      maxCapacity: snapshot.robot.maxCapacity,
      x: snapshot.robot.x,
      y: snapshot.robot.y,
    },
    map: {
      grid_size_x: snapshot.map.grid_size_x,
      grid_size_y: snapshot.map.grid_size_y,
      start_x: snapshot.map.start_x,
      start_y: snapshot.map.start_y,
      trashPositions: snapshot.map.trashPositions.map((position) => ({ ...position })),
      obstaclePositions: snapshot.map.obstaclePositions.map((position) => ({ ...position })),
      chargingStation: { ...snapshot.map.chargingStation },
      trashCan: { ...snapshot.map.trashCan },
      done: snapshot.map.done,
    },
    config: { ...snapshot.config },
    steps: snapshot.steps,
    latestAction: snapshot.latestAction,
    latestLog: snapshot.latestLog,
  };
}

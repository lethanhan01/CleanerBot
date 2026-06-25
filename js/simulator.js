// ============================================================
// simulator.js — Điều phối vòng lặp chính của simulation
// Nhiệm vụ: biết khi nào chạy, khi nào dừng, hỏi thuật toán,
// gọi environment thực thi, lưu lịch sử để undo
// ============================================================

// Số bước tối đa lưu trong lịch sử vết đường đi (để vẽ trail trên bản đồ)
const MAX_POSITION_HISTORY_ENTRIES = 1000;

export class Simulator {
  constructor({ environment, algorithm, onStateChange, tickMs = 400 }) {
    this.environment = environment;     // environment xử lý luật vật lý
    this.algorithm = algorithm;         // thuật toán quyết định hành động
    this.onStateChange = onStateChange; // callback thông báo cho UI mỗi khi state thay đổi
    this.baseTickMs = tickMs;           // tốc độ gốc (ms/bước)
    this.tickMs = tickMs;               // tốc độ hiện tại (có thể thay đổi theo multiplier)
    this.speedMultiplier = 1;
    this.intervalId = null;             // id của setInterval khi đang chạy tự động
    this.cachedNextAction = undefined;  // cache hành động tiếp theo (để hiển thị preview)
    this.previousStates = [];           // stack lưu các state cũ để undo
    this.previousMetricSnapshots = [];  // stack lưu metrics của thuật toán để undo
    this.positionHistory = [];          // lịch sử vị trí robot (để vẽ vết đường đi)
    this.positionHistoryTotal = 0;      // tổng số bước đã đi (kể cả phần đã bị cắt khỏi mảng)
    this.resetPositionHistory(this.environment.getState());
  }

  // Đổi thuật toán giữa chừng — reset toàn bộ và bắt đầu lại với thuật toán mới
  setAlgorithm(algorithm) {
    this.stop();
    this.algorithm = algorithm;
    this.algorithm.reset();
    this.clearNextActionCache();
    this.clearHistory();
    this.resetPositionHistory(this.environment.getState());
  }

  // Sinh bản đồ mới ngẫu nhiên theo config
  generate(config) {
    this.stop();
    this.algorithm.reset();
    this.clearNextActionCache();
    this.clearHistory();
    const state = this.environment.generate(config);
    this.resetPositionHistory(state);
    this.onStateChange(state); // thông báo UI cập nhật
  }

  // Nạp lại một state cụ thể (ví dụ load từ file)
  loadState(state) {
    this.stop();
    this.algorithm.reset();
    this.clearNextActionCache();
    this.clearHistory();
    const nextState = this.environment.loadState(state);
    this.resetPositionHistory(nextState);
    this.onStateChange(nextState);
  }

  // Cập nhật config (pin tối đa, kích thước bản đồ, ...) mà không đổi bản đồ nếu không cần
  updateConfig(config) {
    this.stop();
    this.algorithm.reset();
    this.clearNextActionCache();
    this.clearHistory();
    const state = this.environment.updateConfig(config);
    this.resetPositionHistory(state);
    this.onStateChange(state);
  }

  // Reset về trạng thái ban đầu của bản đồ hiện tại
  reset() {
    this.stop();
    this.algorithm.reset();
    this.clearNextActionCache();
    this.clearHistory();
    const state = this.environment.reset();
    this.resetPositionHistory(state);
    this.onStateChange(state);
  }

  // Thực hiện 1 bước simulation:
  // 1. Hỏi thuật toán hành động tiếp theo
  // 2. Lưu state hiện tại vào stack undo
  // 3. Gọi environment thực thi hành động
  // 4. Ghi vết đường đi
  // 5. Thông báo UI
  step() {
    const previousState = this.environment.getState();
    const action = this.peekNextAction();
    const previousMetrics = this.algorithm.getMetricsSnapshot();
    this.clearNextActionCache();
    this.previousStates.push(previousState);           // lưu vào stack để có thể undo
    this.previousMetricSnapshots.push(previousMetrics);
    const nextState = this.environment.applyAction(action); // environment thực thi hành động
    // Pin tiêu thụ thực tế lấy từ state thật, không dùng ước tính của thuật toán
    this.algorithm.addBatteryConsumed(
      Math.max(0, previousState.robot.battery - nextState.robot.battery)
    );
    this.positionHistory.push(this.createPositionHistoryEntry(nextState)); // ghi vết đường đi
    this.positionHistoryTotal += 1;
    this.trimPositionHistory(); // cắt bớt nếu vượt quá giới hạn 1000 entry

    // Tự dừng khi simulation hoàn thành
    if (nextState.map.done) {
      this.stop();
    }

    this.onStateChange(nextState); // thông báo UI cập nhật
  }

  // Quay lại 1 bước (undo) — pop stack và restore state cũ
  previousStep() {
    const previousState = this.previousStates.pop();
    const previousMetrics = this.previousMetricSnapshots.pop();

    if (!previousState) {
      return; // không có gì để undo
    }

    this.stop();
    this.algorithm.reset();
    this.algorithm.restoreMetrics(previousMetrics);
    this.clearNextActionCache();
    const restoredState = this.environment.restoreState(previousState);
    if (this.positionHistory.length > 1) {
      this.positionHistory.pop();
      this.positionHistoryTotal = Math.max(1, this.positionHistoryTotal - 1);
    }
    this.onStateChange(restoredState);
  }

  // Xem trước hành động tiếp theo mà không thực hiện (dùng để hiển thị preview trên UI)
  // Kết quả được cache để không gọi thuật toán nhiều lần không cần thiết
  peekNextAction() {
    if (this.cachedNextAction === undefined) {
      const state = this.environment.getState();
      this.cachedNextAction = this.algorithm.nextAction(state);
    }

    return this.cachedNextAction;
  }

  // Lấy đích hiện tại mà thuật toán đang nhắm đến (để hiển thị trên bản đồ)
  getCurrentTarget() {
    return this.algorithm?.getCurrentTarget?.() ?? null;
  }

  clearNextActionCache() {
    this.cachedNextAction = undefined;
  }

  clearHistory() {
    this.previousStates = [];
    this.previousMetricSnapshots = [];
  }

  // Kiểm tra có thể undo không (stack còn state cũ không)
  canStepBack() {
    return this.previousStates.length > 0;
  }

  // Reset lịch sử vết đường đi về trạng thái ban đầu
  resetPositionHistory(state, action = state.latestAction) {
    this.positionHistory = [
      this.createPositionHistoryEntry({
        ...state,
        latestAction: action,
      }),
    ];
    this.positionHistoryTotal = this.positionHistory.length;
  }

  // Tạo một entry lịch sử vị trí từ state hiện tại
  createPositionHistoryEntry(state) {
    const { robot } = state;

    return {
      step: state.steps,
      action: state.latestAction,
      x: robot.x,
      y: robot.y,
      battery: robot.battery,
      capacity: robot.capacity,
      maxCapacity: robot.maxCapacity,
    };
  }

  // Lấy lịch sử vị trí (tối đa 1000 entry gần nhất)
  getPositionHistory() {
    return this.getPositionHistorySlice(MAX_POSITION_HISTORY_ENTRIES);
  }

  getPositionHistorySlice(limit = MAX_POSITION_HISTORY_ENTRIES) {
    const safeLimit = clampHistoryLimit(limit, MAX_POSITION_HISTORY_ENTRIES);
    const startIndex = Math.max(0, this.positionHistory.length - safeLimit);

    return this.positionHistory
      .slice(startIndex)
      .map((entry) => ({ ...entry }));
  }

  getPositionHistoryCount() {
    return this.positionHistoryTotal;
  }

  // Các hàm lấy thống kê từ thuật toán để hiển thị trên UI
  getAlgorithmMetricSummary() {
    return this.algorithm?.getMetricSummary() ?? null;
  }

  getAlgorithmTraceSlice(limit) {
    return this.algorithm?.getTraceSlice(limit) ?? [];
  }

  getAlgorithmMetrics() {
    return this.algorithm?.getMetrics() ?? null;
  }

  // Điều chỉnh tốc độ chạy — tickMs = baseTickMs / multiplier
  // Nếu đang chạy thì restart để áp dụng tốc độ mới ngay
  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
    this.tickMs = this.baseTickMs / multiplier;

    if (this.isRunning()) {
      this.stop();
      this.run();
    }
  }

  // Bắt đầu chạy tự động — setInterval gọi step() mỗi tickMs milliseconds
  run() {
    if (this.intervalId !== null) {
      return; // đang chạy rồi, không chạy thêm
    }

    this.intervalId = window.setInterval(() => {
      this.step();
    }, this.tickMs);
  }

  // Dừng chạy tự động
  stop() {
    if (this.intervalId === null) {
      return; // đã dừng rồi
    }

    window.clearInterval(this.intervalId);
    this.intervalId = null;
  }

  isRunning() {
    return this.intervalId !== null;
  }

  // Cắt bớt lịch sử vết đường đi nếu vượt quá 1000 entry
  trimPositionHistory() {
    if (this.positionHistory.length <= MAX_POSITION_HISTORY_ENTRIES) {
      return;
    }

    this.positionHistory = this.positionHistory.slice(
      this.positionHistory.length - MAX_POSITION_HISTORY_ENTRIES
    );
  }
}

// Giới hạn limit trong khoảng hợp lệ [0, MAX_POSITION_HISTORY_ENTRIES]
function clampHistoryLimit(value, fallback) {
  const numericValue = Number.parseInt(value, 10);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(fallback, Math.max(0, numericValue));
}

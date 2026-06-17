# Session Notes – CleanerBot

## Dự án là gì
Web simulator mô phỏng robot hút bụi trên lưới 2D. Chạy bằng `npm start` → mở `http://localhost:3000`.

- **Frontend**: Vanilla JS ES Modules (`js/`)
- **Backend**: Node.js HTTP server (`server.js`) + REST API lưu bản đồ tại `/api/maps`
- **Entry point**: `index.html` + `js/main.js`

---

## Kiến trúc nhanh
```
models.js        → Robot, CleanerMap, SimulationState
environment.js   → Quản lý state, apply action, sinh map, kiểm tra pin
simulator.js     → Vòng lặp setInterval, step/undo, metrics
render.js        → Vẽ lưới + stats lên DOM
algorithms/
  baseAlgorithm.js   → Lớp cha: metrics, trace, helpers
  bfs.js             → BFS (+ battery management, path cache)
  dfs.js             → DFS (kế thừa BFS)
  ids.js             → IDS (kế thừa DFS)
  astar.js           → A* (kế thừa BFS)
  idastar.js         → IDA* (kế thừa BFS)
  dijkstra.js        → Dijkstra (kế thừa BFS)
  greedy-best-first.js → Greedy Best-First (kế thừa BFS)
  greedy.js          → Greedy (kế thừa BaseAlgorithm, per-move battery check)
  registry.js        → Danh sách 8 thuật toán, lazy load
main.js          → UI controller: bind events, openComparePanel, renderMiniGrid...
mapStorage.js    → Gọi REST API lưu/tải bản đồ
sampleMaps.js    → Demo map 10x10
```

---

## Công việc đang làm dở (CHƯA XONG)

### Yêu cầu gốc
Sửa popup "So sánh 8 thuật toán" trong `index.html`:
1. **Layout 4x2**: 4 card mỗi hàng, 2 hàng (cho 8 thuật toán)
2. **Animation**: Hiển thị quá trình chạy thật sự (không chỉ kết quả cuối)
3. **Nút Final**: Bỏ qua animation, nhảy thẳng ra kết quả cuối

### Đã làm xong
- [x] `style.css`: Sửa `#compareGrid` thành `grid-template-columns: repeat(4, minmax(0, 1fr))`
- [x] `style.css`: Tăng `.compare-panel-inner` width lên `min(1360px, calc(100vw - 32px))`
- [x] `style.css`: Bỏ `max-height` cứng trên `#compareGrid .compare-card-grid` (để aspect-ratio tự điều)
- [x] `style.css`: Thêm `.compare-panel-actions { display:flex; gap:8px; align-items:center; flex-shrink:0 }`
- [x] `index.html`: Thêm `<button id="finalizeCompareButton">Final</button>` vào header của compare panel
- [x] `js/main.js`: Thêm `finalizeCompareButton` vào object `elements`
- [x] `js/main.js`: Thêm `let compareSimulators = []` sau `let simulator = null`
- [x] `js/main.js`: Thêm event binding cho `finalizeCompareButton` trong `bindEvents()`

### CÒN LẠI – CHƯA LÀM (quan trọng)
Cần viết lại toàn bộ phần logic compare trong `js/main.js`.

**Xóa các hàm cũ** (từ khoảng dòng 390–558 trong main.js):
- `openComparePanel()` – xóa và viết lại
- `closeComparePanel()` – xóa và viết lại  
- `runCompareAlgorithm()` – xóa hoàn toàn
- `createCompareCard()` – xóa hoàn toàn
- `renderMiniGrid()` – **GIỮ LẠI**, vẫn dùng

**Thêm các hàm mới** vào main.js:

```javascript
// ─── Compare panel (animated) ────────────────────────────────────────────────

async function openComparePanel() {
  if (!elements.comparePanel || !elements.compareGrid) return;

  // Dừng và xoá run cũ
  compareSimulators.forEach(({ sim }) => sim.stop());
  compareSimulators = [];
  elements.compareGrid.innerHTML = "";
  elements.comparePanel.classList.remove("hidden");

  if (elements.finalizeCompareButton) {
    elements.finalizeCompareButton.disabled = false;
  }

  const initialState = environment.getInitialState();

  for (const definition of algorithmRegistry) {
    const algorithm = await createAlgorithm(definition.id);
    const compareEnv = new Environment();
    compareEnv.loadState(initialState);

    const { card, gridEl, statsEl, statusEl } = buildCompareCard(definition.label);
    elements.compareGrid.appendChild(card);

    // slot dùng để update DOM và để finalizeComparePanel tắt update
    const slot = { gridEl, statsEl, statusEl, skipUpdates: false };

    const sim = new Simulator({
      environment: compareEnv,
      algorithm,
      onStateChange: (state) => {
        if (slot.skipUpdates) return;
        renderMiniGrid(gridEl, state);
        updateCompareCardStats(slot, state, sim);
        // Khi tất cả đã xong thì disable nút Final
        if (state.map.done) {
          const allDone = compareSimulators.every(({ env }) => env.getState().map.done);
          if (allDone && elements.finalizeCompareButton) {
            elements.finalizeCompareButton.disabled = true;
          }
        }
      },
      tickMs: 100,
    });

    compareSimulators.push({ sim, env: compareEnv, algorithm, slot });

    // Render trạng thái ban đầu
    renderMiniGrid(gridEl, compareEnv.getState());
    updateCompareCardStats(slot, compareEnv.getState(), sim);

    sim.run();
  }
}

function buildCompareCard(label) {
  const card = document.createElement("section");
  card.className = "compare-card";

  const header = document.createElement("div");
  header.className = "compare-card-header";

  const title = document.createElement("h3");
  title.className = "compare-card-title";
  title.textContent = label;

  const statusEl = document.createElement("span");
  statusEl.className = "compare-status running";
  statusEl.textContent = "Running";

  header.append(title, statusEl);

  const gridEl = document.createElement("div");
  gridEl.className = "compare-card-grid";

  const statsEl = document.createElement("div");
  statsEl.className = "compare-card-body";

  card.append(header, gridEl, statsEl);
  return { card, gridEl, statsEl, statusEl };
}

function updateCompareCardStats({ statsEl, statusEl }, state, sim, hitLimit = false) {
  const metrics = sim.getAlgorithmMetricSummary();
  const done = state.map.done;
  const statusClass = done ? "done" : hitLimit ? "stopped" : "running";
  const statusText = done ? "Done" : hitLimit ? "Stopped" : "Running";

  statusEl.className = `compare-status ${statusClass}`;
  statusEl.textContent = statusText;

  const rows = [
    ["Steps", state.steps],
    ["Visited", metrics?.visitedNodes ?? "-"],
    ["Runtime ms", typeof metrics?.runtimeMs === "number" ? metrics.runtimeMs.toFixed(2) : "-"],
    ["Battery used", typeof metrics?.batteryConsumed === "number" ? Math.round(metrics.batteryConsumed * 10) / 10 : "-"],
    ["Memory", metrics?.peakMemory ?? "-"],
  ];

  statsEl.innerHTML = "";
  for (const [labelText, value] of rows) {
    const row = document.createElement("div");
    row.className = "compare-stat";
    const labelEl = document.createElement("span");
    labelEl.textContent = labelText;
    const valueEl = document.createElement("strong");
    valueEl.textContent = `${value}`;
    row.append(labelEl, valueEl);
    statsEl.appendChild(row);
  }
}

function finalizeComparePanel() {
  const MAX_STEPS = 2000;

  if (elements.finalizeCompareButton) {
    elements.finalizeCompareButton.disabled = true;
  }

  compareSimulators.forEach(({ sim, env, algorithm, slot }) => {
    sim.stop();
    slot.skipUpdates = true; // tắt per-step render

    let state = env.getState();
    let steps = 0;

    while (!state.map.done && steps < MAX_STEPS) {
      const prevBattery = state.robot.battery;
      const action = algorithm.nextAction(state);
      state = env.applyAction(action);
      algorithm.addBatteryConsumed(Math.max(0, prevBattery - state.robot.battery));
      steps++;
    }

    const hitLimit = steps >= MAX_STEPS && !state.map.done;
    renderMiniGrid(slot.gridEl, state);
    updateCompareCardStats(slot, state, sim, hitLimit);
  });
}

function closeComparePanel() {
  if (!elements.comparePanel) return;
  compareSimulators.forEach(({ sim }) => sim.stop());
  compareSimulators = [];
  elements.comparePanel.classList.add("hidden");
  elements.compareGrid.innerHTML = "";
}
```

---

## Lưu ý khi tiếp tục

1. **Xoá đúng chỗ** trong `main.js`: Tìm và xóa 4 hàm cũ là `openComparePanel`, `closeComparePanel`, `runCompareAlgorithm`, `createCompareCard`. Hàm `renderMiniGrid` giữ nguyên.

2. **Import**: `main.js` đã import `Environment`, `Simulator` – không cần thêm import.

3. **Kiểm tra**: Sau khi sửa, nhấn "Compare 8 algorithms" → phải thấy 8 card chạy animation cùng lúc, layout 4x2. Nút "Final" skip animation ra kết quả ngay.

4. **Không sửa** `compare.html` / `js/compare.js` – đó là trang so sánh riêng biệt, không liên quan đến popup trong `index.html`.

---

## Trạng thái file hiện tại

| File | Trạng thái |
|---|---|
| `style.css` | ✅ Đã sửa xong |
| `index.html` | ✅ Đã sửa xong |
| `js/main.js` | ⚠️ Còn thiếu: xóa hàm cũ + thêm hàm mới (xem mục trên) |
| Các file khác | Không cần sửa |

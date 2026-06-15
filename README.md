# CleanerBot

Skeleton project cho môn Nhập môn AI: mô phỏng robot hút bụi trên web bằng HTML, CSS và JavaScript thuần.

## Cấu trúc project

```text
CleanerBot/
├── index.html
├── style.css
├── js/
│   ├── main.js
│   ├── models.js
│   ├── environment.js
│   ├── simulator.js
│   ├── render.js
│   └── algorithms/
│       ├── registry.js
│       ├── baseAlgorithm.js
│       ├── bfs.js
│       ├── ids.js
│       ├── astar.js
│       ├── idastar.js
│       └── greedy.js
└── README.md
```

## Cách chạy

Cách khuyến nghị:

1. Mở project bằng VS Code.
2. Cài extension Live Server nếu chưa có.
3. Right click `index.html`.
4. Chọn `Open with Live Server`.

Project không dùng backend và không dùng framework ngoài. Do code sử dụng ES modules (`import/export`), một số trình duyệt có thể chặn khi mở trực tiếp bằng đường dẫn `file://`. Nếu gặp lỗi đó, hãy chạy bằng Live Server.

Nếu trang chỉ hiện khung trắng, dropdown rỗng, và stats vẫn là `-`, gần như chắc chắn JavaScript module chưa chạy. Hãy kiểm tra Console của trình duyệt và chạy bằng Live Server.

## Tùy chỉnh map

Panel Controls có các input:

- `Map width`: số cột của map
- `Map height`: số hàng của map
- `Trash`: số ô rác được sinh ngẫu nhiên
- `Obstacles`: số vật cản được sinh ngẫu nhiên
- `Max capacity`: số rác tối đa robot có thể mang
- `Battery loss`: số phần trăm pin bị trừ mỗi khi robot di chuyển 1 ô

Sau khi sửa thông số, bấm `Generate map` để tạo lại map. Charging station mặc định ở `(0, 0)`, trash can mặc định ở góc dưới phải của map.

Panel Map Editor cho phép chỉnh từng ô trên grid:

- `Inspect`: xem thông tin ô
- `Empty`: xóa trash và obstacle tại ô đó
- `Trash`: thêm rác
- `Obstacle`: thêm vật cản
- `Charging station`: chuyển trạm sạc đến ô đó
- `Trash can`: chuyển thùng rác đến ô đó
- `Robot start`: chuyển robot đến ô đó và cập nhật start position

Chọn tool, sau đó click vào ô trên map. Khi simulator đang Run, editor tạm thời bị khóa. Map sau khi chỉnh bằng editor sẽ được lưu làm mốc mới cho nút `Reset map`.

Map hiển thị các đối tượng bằng icon SVG trong `assets/icons/`. Nếu muốn đổi sticker, chỉ cần thay file SVG tương ứng:

- `robot.svg`
- `trash.svg`
- `obstacle.svg`
- `charger.svg`
- `trash-can.svg`

## Điều khiển simulator

- `Generate map`: sinh map ngẫu nhiên mới theo thông số hiện tại.
- `Reset map`: đưa robot, trash, obstacle và các trạm về lại trạng thái ban đầu của map hiện tại.
- `Previous Step`: quay lại trạng thái trước action gần nhất.
- `Next Step`: chạy đúng một action tiếp theo.
- `Run`: chạy liên tục.
- `Stop`: dừng chạy liên tục.
- `Speed 1x/2x/3x/5x`: đổi tốc độ khi chạy liên tục.

Panel `Action` hiện:

- `Latest action`: action vừa được gửi vào environment.
- `Next action`: action simulator đang preview và sẽ dùng cho lần Next Step tiếp theo.

## Mô hình dữ liệu

Robot có các thuộc tính:

- `battery`
- `capacity`
- `maxCapacity`
- `x`
- `y`

Map có các thuộc tính:

- `grid_size_x`
- `grid_size_y`
- `start_x`
- `start_y`
- `trashPositions`
- `obstaclePositions`
- `chargingStation`
- `trashCan`
- `done`

Action nằm trong `ACTIONS` tại `js/models.js`:

- `up`
- `down`
- `left`
- `right`
- `charge`
- `suck_trash`
- `let_trash_out`
- `stay`

## Cách thêm hoặc sửa thuật toán

Mỗi thuật toán nằm trong một file riêng tại `js/algorithms/` và export một class riêng. Tất cả class nên kế thừa `BaseAlgorithm`.

Interface cần tuân thủ:

```js
class YourAlgorithm extends BaseAlgorithm {
  constructor() {
    super();
    this.name = "Your Algorithm";
  }

  reset() {
    // Xóa trạng thái nội bộ của thuật toán.
  }

  nextAction(state) {
    // Nhận state hiện tại, trả về một ACTIONS.* hoặc null.
  }
}
```

`state` gồm:

- `state.robot`
- `state.map`
- `state.config`
- `state.steps`
- `state.latestLog`

Ví dụ action hợp lệ:

```js
return ACTIONS.UP;
return ACTIONS.SUCK_TRASH;
return ACTIONS.STAY;
```

## Ghi chú về skeleton thuật toán

Hiện tại các file:

- `ids.js`
- `astar.js`
- `idastar.js`

mới chỉ có class skeleton và TODO comment. Chưa có logic IDS, A*, IDA* thật.

`BaseAlgorithm.nextAction(state)` mặc định trả về `stay`. Vì vậy các thuật toán skeleton như IDS, A*, IDA* sẽ đứng yên cho đến khi thành viên nhóm override `nextAction(state)`.

Khi thành viên nhóm bắt đầu cài đặt thuật toán thật, hãy override `nextAction(state)` trong file thuật toán tương ứng.

`greedy.js` là một mẫu thuật toán cơ bản để tham khảo. Nó đọc `robot.maxCapacity` và `state.config.batteryLoss`, chọn mục tiêu gần nhất theo Manhattan distance, ưu tiên về trash can khi đầy rác, và về charging station khi pin không đủ an toàn cho mục tiêu tiếp theo. Đây chỉ là greedy đơn giản, không đảm bảo tìm đường tối ưu và có thể bị kẹt nếu map phức tạp.

## Cách để dropdown tự nhận thuật toán mới

Vì project chạy trên frontend tĩnh, trình duyệt không thể tự đọc danh sách file trong thư mục `js/algorithms/`. Thay vào đó, project dùng `js/algorithms/registry.js` làm danh sách đăng ký thuật toán.

Khi thêm một thuật toán mới:

1. Tạo file mới, ví dụ `js/algorithms/bfs.js`.
2. Export class thuật toán trong file đó.
3. Thêm một entry vào `algorithmRegistry`.

Ví dụ:

```js
{
  id: "bfs",
  label: "BFS",
  loadClass: () => import("./bfs.js").then((module) => module.BFSAlgorithm),
}
```

Sau đó dropdown sẽ tự hiện BFS, không cần sửa `index.html` hoặc `main.js`.

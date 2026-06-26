# Hướng Dẫn Test Và Lấy Số Liệu So Sánh Thuật Toán

File này dùng để lấy số liệu điền vào mục `9.2. Kết Quả Test Và So Sánh Các Thuật Toán` trong `REPORT.md`.

## 1. Chuẩn Bị

- Cài Node.js.
- Mở terminal tại thư mục project `CleanerBot`.
- Chạy server:

```bash
npm start
```

Nếu dùng Windows PowerShell và `npm` bị chặn script, dùng:

```bash
npm.cmd start
```

- Mở trình duyệt tại:

```text
http://localhost:3000
```

## 2. Test Tự Động

### Mục tiêu

Kiểm tra các module chính: Environment, Simulator, DFS, IDS, Dijkstra, Greedy, Greedy Best-First, lưu/tải map và current target.

### Cách chạy

```bash
npm.cmd run test
```

Hoặc:

```bash
npm run test
```

### Cách ghi kết quả

Sau khi chạy, ghi lại các dòng tổng kết cuối output:

```text
tests ...
pass ...
fail ...
duration_ms ...
```

Điền vào bảng "Kết quả test tự động" trong `REPORT.md`.

## 3. Test So Sánh 7 Thuật Toán

### Đầu vào test cố định

Dùng map demo 10x10 để tất cả thuật toán chạy trên cùng một đầu vào.

| Thành phần | Giá trị |
| --- | --- |
| Kích thước bản đồ | 10 x 10 |
| Vị trí robot ban đầu | A1 |
| Trạm sạc | A1 |
| Thùng rác | J10 |
| Pin tối đa | 100 |
| Hao pin mỗi bước | 1 |
| Sức chứa rác tối đa | 3 |
| Rác | A5, E1, J1, J5, E10, J10 |
| Chướng ngại vật | B2, C2, D2, F2, G2, H2, I2, D3, F3, I3, B4, D4, F4, G4, I4, B5, D5, G5, I5, B6, D6, F6, G6, I6, B7, F7, I7, B8, C8, D8, F8, H8, I8, D9, F9 |

### Cách chạy trên giao diện

1. Mở `http://localhost:3000`.
2. Bấm `Load demo`.
3. Bấm `Compare 7 algorithms`.
4. Chờ các thuật toán chạy hoặc bấm `Final` để chạy nhanh tới trạng thái cuối.
5. Với từng thuật toán, ghi lại:
   - `Status`: Done hoặc Stopped.
   - `Steps`: tổng số bước/hành động.
   - `Visited`: số node đã duyệt.
   - `Runtime ms`: thời gian chạy.
   - `Battery used`: năng lượng đã tiêu thụ.
   - `Memory`: bộ nhớ ước lượng theo số node.

### Thuật toán cần ghi

| Thuật toán | File cài đặt |
| --- | --- |
| BFS | `js/algorithms/bfs.js` |
| DFS | `js/algorithms/dfs.js` |
| IDS | `js/algorithms/ids.js` |
| A* | `js/algorithms/astar.js` |
| IDA* | `js/algorithms/idastar.js` |
| Dijkstra | `js/algorithms/dijkstra.js` |
| Greedy | `js/algorithms/greedy.js` |

## 4. Cách So Sánh Và Nhận Xét

Khi điền bảng trong `REPORT.md`, so sánh theo các tiêu chí:

| Tiêu chí | Ý nghĩa | Cách nhận xét |
| --- | --- | --- |
| Status | Thuật toán có hoàn thành nhiệm vụ không | `Done` là hoàn thành; `Stopped` là chưa xong trong giới hạn bước |
| Steps | Độ dài kế hoạch/hành trình | Ít bước hơn thường tốt hơn vì robot đi ngắn hơn |
| Battery used | Mức năng lượng tiêu thụ | Thấp hơn thường tốt hơn, thường liên quan trực tiếp đến số bước |
| Visited | Số node đã duyệt khi tìm kiếm | Thấp hơn nghĩa là thuật toán tìm kiếm ít hơn |
| Runtime ms | Thời gian tính toán | Thấp hơn là nhanh hơn, nhưng có thể dao động theo máy |
| Memory | Bộ nhớ ước lượng | Thấp hơn nghĩa là thuật toán cần ít không gian lưu trữ hơn |

Gợi ý nhận xét:

- BFS và Dijkstra thường cho đường đi ổn định trong bản đồ chi phí đồng nhất; Dijkstra có ý nghĩa rõ hơn khi bài toán có trọng số.
- DFS có thể hoàn thành nhưng không đảm bảo số bước tối ưu vì ưu tiên đi sâu.
- IDS cải thiện tính đầy đủ so với DFS nhưng có thể duyệt lại nhiều node ở các giới hạn độ sâu khác nhau.
- A* thường giảm số node duyệt nhờ heuristic Manhattan.
- IDA* tiết kiệm bộ nhớ hơn A* trong một số trường hợp nhưng có thể tốn thời gian do lặp theo ngưỡng.
- Greedy ra quyết định nhanh nhưng phụ thuộc heuristic cục bộ, nên có thể không cho hành trình ngắn nhất.

## 5. Lưu Ý Khi Ghi Báo Cáo

- Với `Runtime ms`, nên ghi đúng số liệu hiện trên giao diện sau khi bấm `Final`.
- Nếu chạy lại nhiều lần thấy runtime khác nhau, lấy một lần chạy đại diện và ghi chú rằng runtime phụ thuộc máy/chrome/tab đang mở.
- Các chỉ số `Steps`, `Battery used`, `Visited`, `Memory` trên cùng một map demo thường ổn định hơn runtime.
- Có thể chụp màn hình panel so sánh sau khi bấm `Final` để làm minh chứng khi thuyết trình.

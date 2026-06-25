# Thuật toán A* — Phân tích chi tiết

## Mục lục

1. [Tổng quan về A*](#1-tổng-quan-về-a)
2. [Cách A* hoạt động từng bước](#2-cách-a-hoạt-động-từng-bước)
3. [A* trong dự án CleanerBot](#3-a-trong-dự-án-cleanerbot)
4. [Ví dụ cụ thể trên bản đồ](#4-ví-dụ-cụ-thể-trên-bản-đồ)
5. [Khi nào A* tối ưu — khi nào không](#5-khi-nào-a-tối-ưu--khi-nào-không)
6. [So sánh A* với các thuật toán khác trong dự án](#6-so-sánh-a-với-các-thuật-toán-khác-trong-dự-án)
7. [Kết luận](#7-kết-luận)

---

## 1. Tổng quan về A\*

### A\* là gì?

A\* (đọc là "A-star") là thuật toán **tìm kiếm đường đi có thông tin** (informed search). Nó kết hợp hai ý tưởng:

- **Chi phí thực tế `g(n)`** — đã tốn bao nhiêu bước để đến ô `n`
- **Ước lượng heuristic `h(n)`** — ước tính cần bao nhiêu bước nữa từ `n` đến đích

Kết hợp lại thành hàm đánh giá:

```
f(n) = g(n) + h(n)
```

A\* luôn mở rộng (expand) ô có `f(n)` **thấp nhất** — tức là ô mà theo ước lượng có tổng chi phí đường đi qua nó là ít nhất.

### Heuristic trong dự án này

```js
// astar.js:14
this.setHeuristicDescription("Heuristic: h(n) = |x_goal - x_current| + |y_goal - y_current|");
```

Heuristic được dùng là **Manhattan distance** — khoảng cách theo ô lưới (không tính đường chéo):

```
h(n) = |x_đích - x_n| + |y_đích - y_n|
```

Manhattan distance là **admissible** (không bao giờ ước lượng quá mức thực tế) vì trên lưới 4 hướng, không thể đến đích bằng ít bước hơn Manhattan distance. Điều này đảm bảo A\* tìm được **đường ngắn nhất**.

---

## 2. Cách A\* hoạt động từng bước

### Các cấu trúc dữ liệu

| Tên | Kiểu | Mục đích |
|-----|------|---------|
| `openSet` | Mảng (priority queue) | Danh sách ô chờ được xét, sắp xếp theo `f` |
| `closedKeys` | Set | Ô đã expand xong, không xét lại |
| `cameFrom` | Map | Lưu "ô nào dẫn đến ô này" để dựng lại đường |
| `gScore` | Map | Chi phí thực tế từ start đến mỗi ô |
| `fScore` | Map | `g + h` của mỗi ô |

### Thuật toán

```
Khởi tạo:
  openSet   ← [ start, g=0 ]
  gScore    ← { start: 0 }
  fScore    ← { start: h(start) }
  cameFrom  ← {}

Lặp:
  current ← ô có f thấp nhất trong openSet
  Xoá current khỏi openSet

  Nếu current == goal:
    Dựng lại đường đi qua cameFrom → trả về

  Thêm current vào closedSet

  Với mỗi hàng xóm của current (4 hướng):
    Bỏ qua nếu là tường hoặc đã trong closedSet

    tentative_g ← gScore[current] + 1

    Nếu tentative_g < gScore[hàng_xóm]:
      cameFrom[hàng_xóm]  ← current
      gScore[hàng_xóm]    ← tentative_g
      fScore[hàng_xóm]    ← tentative_g + h(hàng_xóm)
      Thêm hàng_xóm vào openSet nếu chưa có

Nếu openSet rỗng: không tìm được đường → trả về null
```

### Cơ chế chọn ô khi f bằng nhau

```js
// astar.js:169–206  findLowestScoreIndex()
// Ưu tiên 1: f thấp hơn
// Ưu tiên 2: h thấp hơn (gần đích hơn theo heuristic)
// Ưu tiên 3: g thấp hơn (chi phí đã đi ít hơn)
```

Cơ chế tie-breaking này giúp A\* ưu tiên những ô **vừa gần đích vừa ít tốn chi phí**, giảm số ô phải duyệt.

### Dựng lại đường đi

```js
// astar.js:157–167  reconstructPath()
reconstructPath(cameFrom, nodeByKey, currentKey) {
  const path = [nodeByKey.get(currentKey)];  // bắt đầu từ goal
  let nextKey = currentKey;

  while (cameFrom.has(nextKey)) {
    nextKey = cameFrom.get(nextKey);          // đi ngược về start
    path.unshift(nodeByKey.get(nextKey));     // chèn vào đầu
  }

  return path;  // [start, ..., goal]
}
```

---

## 3. A\* trong dự án CleanerBot

### Vai trò của A\*

A\* trong dự án này **không trực tiếp điều khiển robot**. Nó chỉ đảm nhận **một việc duy nhất**: tìm đường đi ngắn nhất từ điểm A đến điểm B trên bản đồ.

Logic điều khiển robot (chọn đích nào, khi nào hút rác, khi nào sạc pin) được kế thừa hoàn toàn từ `BFSAlgorithm`.

```
AStarAlgorithm
    │ kế thừa
    └─► BFSAlgorithm
            │ kế thừa
            └─► BaseAlgorithm
```

`AStarAlgorithm` chỉ override **một hàm duy nhất**: `findPath()` — thay BFS bằng A\* để tìm đường.

### Luồng hoạt động đầy đủ mỗi bước

```
simulator.step()
    │
    └─► algorithm.nextAction(state)          [baseAlgorithm.js:21]
            │ đo thời gian
            └─► computeNextAction(state)      [bfs.js:25 — kế thừa]
                    │
                    ├─► [Ưu tiên 1] Ở thùng rác + đang mang rác?
                    │       └─► LET_TRASH_OUT
                    │
                    ├─► [Ưu tiên 2] Ở trạm sạc + pin không đủ làm việc tiếp?
                    │       └─► CHARGE
                    │
                    ├─► [Ưu tiên 3] Đứng trên ô có rác + túi chưa đầy?
                    │       └─► SUCK_TRASH
                    │
                    └─► [Di chuyển] chooseWorkTarget()       [bfs.js:111]
                            │
                            ├─ Hết rác + túi rỗng → về trạm sạc
                            ├─ Túi đầy hoặc hết rác trên map → đến thùng rác
                            └─ Còn rác → findNearestSafeTrashTarget()
                                    │  [astar.js:17]
                                    │  Sắp xếp rác theo Manhattan distance
                                    │  Thử từng cái → tìm cái đến được + đủ pin
                                    │
                                    └─► findPath(robot, trash)   [astar.js:47]
                                            │ Kiểm tra pathCache trước
                                            └─► runAStar()       [astar.js:75]
                                                    │ Tìm đường ngắn nhất
                                                    │ Cache kết quả
                                                    └─► route[1] → action
```

### Cache — điểm mạnh của A\* trong dự án

```js
// astar.js:64–72
const cachedPath = this.getCachedPath(state, start, goal);
if (cachedPath !== undefined) {
  return cachedPath;
}
const path = this.runAStar(state, start, goal, null);
this.cachePath(state, start, goal, path);   // lưu cả chiều thuận và chiều ngược
```

Cache key bao gồm: kích thước map + vị trí tường + điểm xuất phát + điểm đích. Khi bản đồ (tường) không thay đổi, các đường đi giữa cùng cặp điểm **không cần tính lại**.

Ví dụ: robot đã từng đi từ (2,2) đến trạm sạc (0,0) → đường đó được cache → lần sau cần quay về sạc, dùng lại ngay.

### Tính pin trước khi chọn đích

```js
// bfs.js:421–430  hasEnoughBatteryForTarget()
hasEnoughBatteryForTarget(state, target) {
  const requiredBattery = this.getRequiredBatteryForTarget(state, target);
  return robot.battery + EPSILON >= requiredBattery;
}
```

`getRequiredBatteryForTarget()` dùng chính A\* để tính:
- Pin cần đến đích
- Pin cần làm hành động tại đích (hút rác / đổ rác)
- Pin cần đi từ đích đến điểm an toàn tiếp theo (thùng rác hoặc trạm sạc)

Robot sẽ **không bao giờ đi đến một đích mà nó không thể về an toàn**.

---

## 4. Ví dụ cụ thể trên bản đồ

### Bản đồ

```
     x=0  x=1  x=2  x=3  x=4
y=0 [ S ][ . ][ . ][ # ][ . ]
y=1 [ . ][ # ][ . ][ . ][ . ]
y=2 [ . ][ . ][ R ][ . ][ T ]
y=3 [ . ][ # ][ . ][ . ][ . ]
y=4 [ . ][ . ][ . ][ . ][ B ]

S = Trạm sạc (0,0)    R = Robot (2,2)
T = Rác (4,2)         B = Thùng rác (4,4)
# = Tường
```

### A\* tìm đường từ Robot (2,2) đến Rác (4,2)

**Khởi tạo**

```
openSet   = [ (2,2) g=0 f=2 ]      ← h(2,2) = |4-2|+|2-2| = 2
closedSet = {}
cameFrom  = {}
```

---

**Vòng 1 — Expand (2,2)**

```
Lấy ra: (2,2)  f=2  (thấp nhất)
→ closedSet = {(2,2)}

Hàng xóm:
  UP    (2,1): g=1, h=|4-2|+|2-1|=3, f=4   cameFrom[(2,1)]=(2,2)
  DOWN  (2,3): g=1, h=|4-2|+|2-3|=3, f=4   cameFrom[(2,3)]=(2,2)
  LEFT  (1,2): g=1, h=|4-1|+|2-2|=3, f=4   cameFrom[(1,2)]=(2,2)
  RIGHT (3,2): g=1, h=|4-3|+|2-2|=1, f=2 ★ cameFrom[(3,2)]=(2,2)

openSet = [ (3,2) f=2,  (2,1) f=4,  (2,3) f=4,  (1,2) f=4 ]
```

---

**Vòng 2 — Expand (3,2)**

```
Lấy ra: (3,2)  f=2  (thấp nhất)
→ closedSet = {(2,2), (3,2)}

Hàng xóm:
  UP    (3,1): g=2, h=|4-3|+|2-1|=2, f=4   cameFrom[(3,1)]=(3,2)
  DOWN  (3,3): g=2, h=|4-3|+|2-3|=2, f=4   cameFrom[(3,3)]=(3,2)
  LEFT  (2,2): đã trong closedSet → bỏ qua
  RIGHT (4,2): g=2, h=|4-4|+|2-2|=0, f=2 ★ cameFrom[(4,2)]=(3,2)
```

---

**Vòng 3 — Expand (4,2)**

```
Lấy ra: (4,2)  f=2
(4,2) == goal → DỪNG!

reconstructPath:
  (4,2) ← cameFrom ← (3,2) ← cameFrom ← (2,2)
  path = [ (2,2), (3,2), (4,2) ]
```

**Kết quả:** `route[1]` = **(3,2)** → action = **RIGHT**

Chỉ cần expand **3 ô** để tìm ra đường đi tối ưu.

---

### A\* vượt qua tường

```
     x=2  x=3  x=4
y=1 [ . ][ . ][ . ]
y=2 [ R ][ # ][ T ]   ← tường tại (3,2)
y=3 [ . ][ . ][ . ]
```

**Vòng 1 — Expand (2,2)**

```
  RIGHT (3,2): là tường → bỏ qua hoàn toàn
  UP    (2,1): g=1, h=|4-2|+|2-1|=3, f=4
  DOWN  (2,3): g=1, h=|4-2|+|2-3|=3, f=4
  LEFT  (1,2): g=1, h=|4-1|+|2-2|=3, f=4
```

**Vòng 2 — Expand (2,1)**

```
  RIGHT (3,1): g=2, h=|4-3|+|2-1|=2, f=4  ← ô này vòng qua được tường
  UP    (2,0): g=2, h=|4-2|+|2-0|=4, f=6
```

**Các vòng tiếp theo — A\* dẫn qua (3,1) → (4,1) → (4,2)**

```
Đường tìm được: (2,2) → (2,1) → (3,1) → (4,1) → (4,2)   — 4 bước
```

A\* **tự tìm ra đường vòng ngắn nhất** mà không cần hướng dẫn.

---

## 5. Khi nào A\* tối ưu — khi nào không

### A\* đảm bảo đường ngắn nhất khi:

**Điều kiện 1: Heuristic admissible**

> Heuristic không được ước lượng **quá mức** so với chi phí thực tế.
> `h(n) ≤ chi_phí_thực_tế(n → goal)` với mọi ô n.

Manhattan distance trong dự án này **luôn admissible** vì:
- Trên lưới 4 hướng, không thể đi ít bước hơn Manhattan distance
- Tường chỉ làm đường dài hơn, không ngắn hơn
- `h(n)` không bao giờ phóng đại

**Điều kiện 2: Chi phí các bước đều nhau hoặc không âm**

Trong dự án: mỗi bước di chuyển = 1 đơn vị pin = chi phí đồng đều → thỏa mãn.

**Kết luận: A\* trong dự án này LUÔN tìm được đường ngắn nhất** (nếu đường tồn tại).

---

### A\* không đảm bảo tối ưu toàn cục (robot làm sạch hoàn toàn) vì:

Bài toán CleanerBot là bài toán **nhiều đích** (multi-target): hút hết tất cả rác, đổ vào thùng, quay về trạm sạc. Thứ tự hút rác tối ưu là bài toán dạng **Travelling Salesman Problem (TSP)** — NP-hard.

A\* trong dự án chỉ tối ưu **từng chặng** (robot → rác gần nhất → thùng rác → trạm sạc), không tối ưu **toàn bộ hành trình**.

```
Ví dụ 3 đống rác: A, B, C
  A* chọn: đến A (gần nhất) → đến B → đến C   = 20 bước tổng
  Thứ tự tối ưu thực sự: A → C → B            = 15 bước tổng
```

Để tối ưu toàn cục cần thuật toán lập kế hoạch nhiều bước (planning), không phải tìm đường.

---

## 6. So sánh A\* với các thuật toán khác trong dự án

Dự án có 7 thuật toán: **BFS, DFS, IDS, Dijkstra, A\*, IDA\*, Greedy**.

### Bảng so sánh

| Thuật toán | Heuristic | Đường ngắn nhất? | Bộ nhớ | Tốc độ tìm đường |
|-----------|-----------|-----------------|--------|-----------------|
| **BFS** | Không | Có | O(n) — lưu toàn bộ hàng đợi | Chậm hơn A\* |
| **DFS** | Không | Không | O(d) — chỉ lưu stack hiện tại | Không dự đoán được |
| **IDS** | Không | Có | O(d) — rất thấp | Chậm hơn A\* |
| **Dijkstra** | Không | Có | O(n) — giống BFS | Bằng BFS ở đây |
| **A\*** | Có (Manhattan) | Có | O(n) | **Nhanh nhất trong nhóm tối ưu** |
| **IDA\*** | Có (Manhattan) | Có | O(d) — rất thấp | Chậm hơn A\* vì duyệt lại |
| **Greedy** | Không (heuristic cục bộ) | Không | O(1) — chỉ nhớ visitCounts | **Nhanh nhất tuyệt đối** |

*n = số ô đi được trên bản đồ, d = độ sâu của đường đi (số bước)*

---

### A\* vs BFS

**Giống nhau:**
- Cả hai đều tìm đường ngắn nhất
- Cùng kế thừa logic điều khiển robot từ `BFSAlgorithm`
- Cùng dùng cache path

**Khác nhau:**

```
BFS mở rộng theo "vòng tròn" từ start ra:
  Duyệt tất cả ô cách 1 bước → tất cả ô cách 2 bước → ...
  Không biết đích ở đâu → duyệt đều mọi hướng

A* mở rộng theo "hướng về đích":
  Luôn chọn ô có f = g + h thấp nhất
  Hướng về phía đích nhanh hơn
```

**Ví dụ bản đồ 10×10, robot (0,0), đích (9,9) — không có tường:**

| | BFS | A\* |
|--|-----|-----|
| Số ô expand | ~50 ô (toàn bộ "vòng tròn" bán kính 9) | ~10–15 ô (dọc đường chéo đến đích) |
| Đường tìm được | Ngắn nhất | Ngắn nhất |

BFS duyệt đồng đều, A\* tập trung vào hướng đích. Kết quả như nhau nhưng A\* nhanh hơn đáng kể.

> **Trong dự án:** Khi bản đồ đơn giản, ít tường, A\* nhanh hơn BFS rõ rệt. Khi nhiều tường phức tạp, khoảng cách giảm dần.

---

### A\* vs Dijkstra

Trong dự án này, **Dijkstra và A\* cho cùng kết quả** vì mọi bước di chuyển có chi phí đồng đều = 1.

```
Dijkstra: f(n) = g(n)               — chỉ dùng chi phí thực tế
A*:       f(n) = g(n) + h(n)        — cộng thêm heuristic hướng dẫn
```

Khi chi phí đồng đều, Dijkstra hoạt động như BFS có weighted priority. A\* nhanh hơn vì `h(n)` hướng tìm kiếm về phía đích, giảm số ô phải xét.

> **Kết luận:** A\* luôn nhanh hơn hoặc bằng Dijkstra trong dự án này, không bao giờ chậm hơn.

---

### A\* vs IDA\*

Cả hai đều dùng heuristic Manhattan distance và tìm đường ngắn nhất.

**IDA\* hoạt động:**
```
Lặp với ngưỡng bound = h(start), sau đó tăng dần:
  Duyệt DFS, cắt nhánh khi f(n) > bound
  Nếu không tìm được → tăng bound lên mức f nhỏ nhất đã bị cắt
  Lặp lại đến khi tìm được
```

**So sánh:**

| | A\* | IDA\* |
|--|-----|-------|
| **Bộ nhớ** | O(n) — lưu toàn bộ openSet | O(d) — chỉ lưu path hiện tại |
| **Tốc độ** | Nhanh hơn — mỗi ô expand đúng 1 lần | Chậm hơn — các ô gần start bị duyệt lại nhiều lần qua mỗi vòng lặp |
| **Đường tìm được** | Ngắn nhất | Ngắn nhất |

Trong bản đồ lưới nhỏ–vừa (8×8 đến 16×16) như dự án này, bộ nhớ không phải vấn đề → **A\* nhanh hơn IDA\*** vì không tốn công duyệt lại.

> **Khi nào IDA\* có lợi hơn:** Bản đồ rất lớn (hàng trăm × hàng trăm ô) khi bộ nhớ là giới hạn thực sự. Dự án này không rơi vào trường hợp đó.

---

### A\* vs IDS

IDS không có heuristic — nó lặp DFS với độ sâu tăng dần từ 0:

```
depth=0: kiểm tra chỉ start
depth=1: kiểm tra start + 4 hàng xóm
depth=2: ...
```

IDS tìm được đường ngắn nhất nhưng **rất chậm** vì:
- Duyệt lại từ đầu mỗi lần tăng depth
- Không có heuristic → không biết hướng đích
- Số ô duyệt tăng theo cấp số nhân với mỗi lần lặp

> **Kết luận:** A\* nhanh hơn IDS nhiều lần. IDS dùng khi bộ nhớ cực kỳ hạn chế và không có heuristic tốt.

---

### A\* vs DFS

DFS đi sâu theo một nhánh cho đến cùng trước khi thử nhánh khác.

**DFS không đảm bảo đường ngắn nhất:**

```
Ví dụ: Robot (0,0), đích (2,0)
Bản đồ thẳng: (0,0)→(1,0)→(2,0)  — đường ngắn nhất: 2 bước

DFS có thể đi: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,1)→(2,0) — 6 bước
Tuỳ thuộc vào thứ tự hàng xóm được xét
```

> **Kết luận:** A\* luôn tốt hơn DFS về chất lượng đường đi. DFS chỉ hữu ích khi cần tìm "bất kỳ đường nào tồn tại" với bộ nhớ thấp.

---

### A\* vs Greedy (greedy.js)

Đây là so sánh thú vị nhất vì hai thuật toán có triết lý hoàn toàn khác:

| | A\* | Greedy |
|--|-----|--------|
| **Lập kế hoạch** | Tìm toàn bộ đường đi trước | Không — quyết định từng bước |
| **Đảm bảo tối ưu** | Có | Không |
| **Tốc độ tính mỗi bước** | Chậm hơn | Gần như tức thì |
| **Tổng số bước robot** | Ít hơn | Có thể nhiều hơn nếu đi vòng |
| **Xử lý tường** | Tìm đường vòng tối ưu | Có thể bị kẹt hoặc đi vòng lãng phí |
| **Bộ nhớ runtime** | openSet + closedSet + cameFrom | visitCounts (Map nhỏ) |

**Tình huống Greedy thắng:** Bản đồ trống, ít tường, đường đi gần thẳng → Greedy chạm đích ngay mà không cần tính toán nặng.

**Tình huống A\* thắng:** Nhiều tường, đường đi phức tạp → Greedy lạc hướng, A\* tìm chính xác đường ngắn nhất.

---

### Tóm tắt vị trí của A\*

```
            Đường ngắn nhất?
                 │
         Có ─────┼───── Không
                 │              └─► DFS, Greedy
         ┌───────┴────────┐
         │                │
    Có heuristic?    Không heuristic
         │                │
        A*              BFS, Dijkstra, IDS
       IDA*
         │
    Bộ nhớ thấp?
    Không → A* (nhanh hơn)
    Có    → IDA* (ít RAM hơn)
```

Trong điều kiện bình thường của dự án (bản đồ ≤ 16×16, bộ nhớ không giới hạn):

> **A\* là lựa chọn tối ưu nhất trong nhóm đảm bảo đường ngắn nhất.**

---

## 7. Kết luận

### A\* phù hợp nhất khi

- Bản đồ có **nhiều tường** hoặc bố cục phức tạp
- Cần đảm bảo **đường đi ngắn nhất** (tiết kiệm pin)
- Bộ nhớ không phải giới hạn
- Bản đồ thay đổi ít (cache phát huy tác dụng)

### Giới hạn của A\* trong dự án này

- **Không tối ưu toàn cục:** Chỉ tối ưu từng chặng, không giải quyết bài toán thứ tự hút rác tối ưu.
- **Chi phí tính khi mới bắt đầu:** Mỗi khi cần đường mới phải chạy lại toàn bộ thuật toán (dù có cache giảm thiểu).
- **Trên bản đồ trống:** Không có lợi thế nhiều so với BFS — cả hai đều tìm ngay đường thẳng.

### Thứ tự ưu tiên thực tế cho dự án

| Ưu tiên | Thuật toán | Lý do |
|---------|-----------|-------|
| Tốc độ robot hoàn thành | **A\*** | Đường ngắn nhất → ít bước nhất |
| Tốc độ tính toán | **Greedy** | Không cần tìm đường toàn bộ |
| Tiết kiệm bộ nhớ | **IDA\*** hoặc **IDS** | Stack nhỏ thay vì openSet lớn |
| Đơn giản nhất | **BFS** | Không cần heuristic, vẫn tìm đường tối ưu |

---

*File này phân tích thuật toán A\* (`js/algorithms/astar.js`) trong dự án CleanerBot.*
*Các thuật toán so sánh: BFS (`bfs.js`), DFS (`dfs.js`), IDS (`ids.js`), Dijkstra (`dijkstra.js`), IDA\* (`idastar.js`), Greedy (`greedy.js`).*

---

## Thuật toán Dijkstra — Phân tích chi tiết

### Dijkstra là gì?

Dijkstra là thuật toán tìm đường đi ngắn nhất từ một điểm đến một điểm khác, dựa hoàn toàn vào **chi phí thực tế đã đi** — không có heuristic, không đoán trước.

```
f(n) = g(n)

g(n) = tổng chi phí thực tế từ start đến ô n
```

Luôn expand ô có `g(n)` **thấp nhất** trong openSet.

---

### Dijkstra quyết định bước tiếp theo như thế nào khi đang ở giữa map?

Giả sử robot đang đứng ở ô **(3,3)** và cần đến đích **(6,1)**:

**Khởi tạo:**
```
openSet  = [ (3,3) cost=0 ]
bestCost = { (3,3): 0 }
closedSet = {}
```

**Vòng 1 — Expand (3,3):**
```
Sắp xếp openSet theo cost → lấy ra (3,3) cost=0

Xét 4 hàng xóm:
  UP    (3,2): cost = 0+1 = 1  → thêm vào openSet
  DOWN  (3,4): cost = 0+1 = 1  → thêm vào openSet
  LEFT  (2,3): cost = 0+1 = 1  → thêm vào openSet
  RIGHT (4,3): cost = 0+1 = 1  → thêm vào openSet

openSet = [ (3,2)c=1, (3,4)c=1, (2,3)c=1, (4,3)c=1 ]
```

**Vòng 2 — Expand ô có cost thấp nhất (tất cả đều = 1, lấy cái đầu tiên):**
```
Lấy ra (3,2) cost=1

Xét hàng xóm:
  UP    (3,1): cost = 1+1 = 2  → thêm vào openSet
  RIGHT (4,2): cost = 1+1 = 2  → thêm vào openSet
  LEFT  (2,2): cost = 1+1 = 2  → thêm vào openSet
  DOWN  (3,3): đã trong closedSet → bỏ qua
```

**→ Dijkstra lan ra theo "vòng tròn" đều nhau** — không biết đích ở hướng nào, duyệt cả những ô đi ngược lại.

**Khi tìm thấy đích (6,1):**
```
Lấy ra (6,1) từ openSet
→ samePosition(current, goal) == true → DỪNG
→ trả về path đã lưu: [(3,3), (4,3), (5,2), (6,1)]
→ route[1] = (4,3) → action = RIGHT
```

---

### Cấu trúc dữ liệu Dijkstra dùng

| Tên | Vai trò |
|-----|---------|
| `openSet` | Mảng các ô chờ xét, **sort theo cost** trước mỗi lần lấy |
| `bestCost` | Map lưu chi phí tốt nhất đã biết đến mỗi ô |
| `closedKeys` | Set các ô đã expand xong, không xét lại |
| `path` | Lưu đường đi từ start đến ô hiện tại |

---

### Điểm khác biệt then chốt so với A\*

```
Dijkstra:  chỉ nhìn LẠI  → g(n) = đã tốn bao nhiêu
A*:        nhìn LẠI + nhìn TRƯỚC → g(n) + h(n) = đã tốn + còn bao nhiêu nữa
```

Vì Dijkstra không biết đích ở đâu nên nó duyệt **đều mọi hướng**. A\* nhờ heuristic biết đích ở hướng nào nên tập trung duyệt về phía đó trước.

---

### Khi nào Dijkstra thật sự cần thiết hơn A\*?

Khi **chi phí các bước khác nhau** và **không có heuristic admissible tốt**:

```
Ví dụ: đi qua ô bùn tốn 5 pin, đi qua ô bình thường tốn 1 pin
→ Manhattan distance không còn admissible
→ A* có thể bỏ qua đường ngắn nhất
→ Dijkstra vẫn tìm đúng vì chỉ dựa vào chi phí thực tế
```

Trong dự án này chi phí đồng đều = 1 nên **A\* luôn tốt hơn hoặc bằng Dijkstra**, không bao giờ tệ hơn.

---

## 8. Nếu được phân công làm Simulator Core — làm về cái gì?

### Simulator Core là gì?

**Simulator Core** là phần **lõi của toàn bộ hệ thống mô phỏng** — không phải thuật toán, không phải giao diện. Đây là "động cơ" chạy bên dưới, quyết định thế giới hoạt động như thế nào.

Simulator Core gồm **3 file chính**:

| File | Class / Export | Vai trò |
|------|---------------|---------|
| `js/simulator.js` | `Simulator` | Vòng lặp chính: điều phối step, run, stop, tốc độ, lịch sử |
| `js/environment.js` | `Environment` | Thực thi vật lý: applyAction, sinh bản đồ, quản lý trạng thái thế giới |
| `js/models.js` | `Robot`, `CleanerMap`, `SimulationState`, `ACTIONS` | Cấu trúc dữ liệu: định nghĩa mọi thứ tồn tại trong simulation |

---

### Sơ đồ tương tác giữa các thành phần

```
┌─────────────────────────────────────────────────────────┐
│                     main.js / UI                        │
│   Người dùng bấm Play / Step / Reset / chỉnh tốc độ    │
└──────────────────────┬──────────────────────────────────┘
                       │ gọi
                       ▼
┌──────────────────────────────────────────────────────────┐
│              simulator.js  (Simulator)                   │
│  - run() → setInterval → step() lặp theo tickMs         │
│  - step() → hỏi algorithm → gọi environment.applyAction │
│  - previousStep() → undo một bước                       │
│  - lưu positionHistory, previousStates (undo stack)     │
└──────┬───────────────────────────────┬───────────────────┘
       │ getState() / applyAction()    │ nextAction(state)
       ▼                               ▼
┌─────────────────┐         ┌──────────────────────────────┐
│  environment.js │         │  algorithms/  (BFS, A*, ...) │
│  (Environment)  │         │  Thuật toán quyết định hành  │
│                 │         │  động tiếp theo là gì        │
│ - applyAction() │         └──────────────────────────────┘
│ - moveRobot()   │
│ - chargeRobot() │
│ - suckTrash()   │
│ - letTrashOut() │
│ - generate()    │
│ - loadState()   │
└──────┬──────────┘
       │ đọc/ghi
       ▼
┌──────────────────────────────────────────────────────────┐
│                     models.js                            │
│  Robot            — vị trí, pin, túi rác                │
│  CleanerMap       — lưới, tường, rác, trạm sạc, thùng   │
│  SimulationState  — snapshot đầy đủ tại một thời điểm   │
│  ACTIONS          — danh sách hành động hợp lệ           │
└──────────────────────────────────────────────────────────┘
```

---

### Chi tiết từng phần

#### `js/models.js` — Dữ liệu

Định nghĩa **tất cả cấu trúc dữ liệu** mà mọi thành phần khác dùng:

```js
// 8 hành động hợp lệ
ACTIONS = { UP, DOWN, LEFT, RIGHT, CHARGE, SUCK_TRASH, LET_TRASH_OUT, STAY }

// Trạng thái robot
Robot { x, y, battery, capacity, maxCapacity }

// Bản đồ
CleanerMap {
  grid_size_x, grid_size_y,
  trashPositions[],       // mảng {x, y} của từng đống rác còn lại
  obstaclePositions[],    // mảng {x, y} của tường
  chargingStation,        // {x, y}
  trashCan,               // {x, y}
  done,                   // true khi hoàn thành
}

// Snapshot toàn bộ trạng thái tại một bước
SimulationState { robot, map, config, steps, latestAction, latestLog }
```

Mỗi class có `.clone()` để tạo bản sao độc lập — quan trọng để undo không ảnh hưởng lẫn nhau.

---

#### `js/environment.js` — Vật lý thế giới

`Environment` là **"luật chơi"**: nó biết rô-bốt được phép làm gì và làm thế nào thì hợp lệ.

**Các nhóm chức năng chính:**

```
1. Sinh bản đồ
   generate(config)               — sinh ngẫu nhiên bản đồ mới
   createInitialState()           — tạo trạng thái ban đầu
   pickConnectedObstaclePositions — đặt tường đảm bảo bản đồ luôn thông

2. Thực thi hành động
   applyAction(action)            — điểm vào duy nhất để thay đổi trạng thái
     moveRobot(dx, dy)            — kiểm tra hợp lệ rồi di chuyển + tiêu pin
     chargeRobot()                — sạc pin nếu đang ở trạm sạc
     suckTrash()                  — hút rác nếu đứng trên rác
     letTrashOut()                — đổ rác nếu ở thùng rác

3. Điều kiện kết thúc
   updateDoneStatus()             — map.done = true khi hết rác + túi rỗng + ở trạm sạc

4. Chỉnh sửa bản đồ thủ công
   applyMapEdit(tool, x, y)       — người dùng đặt/xóa tường, rác, trạm,... trực tiếp

5. Quản lý trạng thái
   getState() / reset()           — lấy snapshot hoặc reset về trạng thái ban đầu
   loadState() / restoreState()   — nạp lại trạng thái từ ngoài
```

**Tại sao tường luôn được đặt đảm bảo bản đồ thông?**

`pickConnectedObstaclePositions()` dùng BFS để kiểm tra: sau khi thêm mỗi tường, toàn bộ ô đi được vẫn phải liên thông. Nếu không → bỏ qua tường đó. Điều này đảm bảo robot luôn có thể đến mọi đống rác.

---

#### `js/simulator.js` — Vòng lặp chính

`Simulator` là **"nhạc trưởng"**: nó biết khi nào chạy, khi nào dừng, điều phối thuật toán và environment.

**Các chức năng chính:**

```
run()           — bắt đầu chạy tự động (setInterval theo tickMs)
stop()          — dừng lại
step()          — thực hiện 1 bước:
                    1. Hỏi algorithm: hành động tiếp theo là gì?
                    2. Gọi environment.applyAction(action)
                    3. Ghi positionHistory để hiển thị vết đường đi
                    4. Nếu map.done → tự stop()

previousStep()  — quay lại 1 bước (pop previousStates stack)
peekNextAction()— xem trước hành động tiếp theo mà không thực hiện (dùng để hiển thị "preview")

setSpeedMultiplier(x)  — chạy x lần nhanh hơn (tickMs = baseTickMs / x)
setAlgorithm(algo)     — đổi thuật toán giữa chừng
```

**Cơ chế undo (`previousStep`)**

Mỗi lần `step()`, Simulator lưu:
- `previousStates[]` — bản sao `SimulationState` trước khi thực hiện bước
- `previousMetricSnapshots[]` — snapshot các chỉ số của thuật toán

`previousStep()` pop ra trạng thái cũ, restore lại environment và algorithm → hoàn tác hoàn toàn.

**Position History**

Sau mỗi bước, Simulator ghi `{step, action, x, y, battery, capacity}` vào `positionHistory`. Tối đa 1000 entry (cũ hơn bị cắt). Dùng để vẽ **vết đường đi** của robot trên bản đồ.

---

### Tóm tắt: phân công Simulator Core thì làm gì?

Nếu được giao phần **Simulator Core**, bạn chịu trách nhiệm về:

| Nhiệm vụ | Nằm ở đâu |
|----------|-----------|
| Định nghĩa cấu trúc dữ liệu (Robot, Map, State, Actions) | `models.js` |
| Luật vật lý: robot được làm gì, khi nào hợp lệ | `environment.js` — `applyAction()` và các hàm phụ |
| Sinh bản đồ ngẫu nhiên đảm bảo luôn thông | `environment.js` — `pickConnectedObstaclePositions()` |
| Điều phối vòng lặp: chạy/dừng/step/undo/tốc độ | `simulator.js` |
| Quản lý lịch sử bước (undo stack + vết đi) | `simulator.js` — `previousStates`, `positionHistory` |
| Xử lý điều kiện kết thúc simulation | `environment.js` — `updateDoneStatus()` |
| Tích hợp với thuật toán (nhận `nextAction`, truyền `state`) | `simulator.js` — `step()` và `peekNextAction()` |

**Lưu ý quan trọng:** Simulator Core **không biết** thuật toán hoạt động như thế nào bên trong — nó chỉ gọi `algorithm.nextAction(state)` và nhận về một action. Tương tự, nó **không biết** giao diện hiển thị như thế nào — nó chỉ gọi `onStateChange(nextState)` sau mỗi bước. Đây là thiết kế tách biệt rõ ràng giữa các tầng.

# HƯỚNG DẪN GREEDY BEST-FIRST SEARCH CHO PHẦN BẢO VỆ CLEANERBOT

Tài liệu này dành cho phần bảo vệ thêm thuật toán Greedy Best-First Search. Phần Environment và DFS vẫn học trong
HUONG_DAN_DFS_ENVIRONMENT_CHO_MINH.md.

---

## 1. Câu trả lời 30 giây

> Greedy Best-First Search chọn bước đi tiếp theo dựa hoàn toàn vào heuristic h(n) — ước lượng khoảng cách đến goal — mà không tính chi phí đã đi. Vì vậy thuật toán thường nhanh, nhưng không đảm bảo tìm đường ngắn nhất và có thể bị kẹt.

Trong project:

- Greedy đã được cài đặt thật trong js/algorithms/greedy.js.
- Greedy có trong dropdown thuật toán và trang Compare.
- Greedy kế thừa trực tiếp từ BaseAlgorithm, không qua BFS hay DFS.
- Greedy dùng heuristic Manhattan distance có điều chỉnh penalty.
- Greedy không cache route và không có route commitment như BFS/DFS/IDS.

---

## 2. Chuỗi kế thừa

~~~text
BaseAlgorithm
      ^
      |
GreedyAlgorithm
~~~

Greedy kế thừa:

- từ BaseAlgorithm: metrics, trace, helper pin/vị trí, canMoveTo, manhattanDistance;
- tự cài đặt: toàn bộ logic chọn target, chọn bước đi, kiểm tra pin, heuristic scoring.

### Vì sao Greedy không kế thừa BFS?

Greedy không dùng queue BFS, không dùng route cache, không dùng findPath() của BFS. Kiến trúc của Greedy hoàn toàn khác: thay vì lập kế hoạch trước một route rồi đi theo, Greedy ra quyết định từng bước một dựa trên heuristic tại thời điểm đó.

### Câu trả lời phòng vệ

> Greedy kế thừa BaseAlgorithm để tái sử dụng metrics và các helper chung, nhưng toàn bộ logic điều hướng là tự cài đặt theo heuristic greedy, không dùng bất kỳ code tìm đường nào của BFS hay DFS.

---

## 3. Ý tưởng thuật toán

Greedy Best-First Search tại mỗi bước:

~~~text
1. Nhìn tất cả ô hàng xóm có thể đến.
2. Tính score cho mỗi ô:
       score = Manhattan(ô đó, target) + visits * VISIT_PENALTY + backtrack_penalty
3. Chọn ô có score thấp nhất.
4. Di chuyển vào ô đó.
~~~

Pseudo-code:

~~~text
computeNextAction(state):
    xác định target (rác, thùng rác, hoặc trạm sạc)
    nếu đang ở target:
        thực hiện hành động tại target
    
    candidates = hàng xóm hợp lệ
    với mỗi candidate:
        score = Manhattan(candidate, target)
               + visitCount(candidate) * VISIT_PENALTY
               + backtrackPenalty(candidate)
    
    trả về hành động đến candidate có score nhỏ nhất
~~~

Các hằng số trong code:

~~~js
const VISIT_PENALTY = 3;
const BACKTRACK_PENALTY = 10;
const EPSILON = 1e-9;
~~~

---

## 4. Các method chính trong code

| Method | Vai trò |
|---|---|
| computeNextAction() | Điểm vào chính: xử lý hành động mỗi bước |
| chooseWorkTarget() | Chọn target tiếp theo (rác, thùng rác, trạm sạc) |
| chooseMoveTowardTarget() | Tính score heuristic và chọn bước di chuyển |
| chooseShortestPathMoveToTarget() | Đi theo BFS path khi về trạm sạc |
| findShortestPath() | BFS nội bộ chỉ dùng để tính pin và về trạm sạc |
| rememberPosition() | Cập nhật visitCounts và previousPosition |
| getVisitCount() | Lấy số lần đã ghé qua một ô |
| getRequiredBatteryForTarget() | Tính pin cần thiết dùng Manhattan distance |
| canMoveAndKeepChargingReserve() | Kiểm tra pin có đủ để về trạm sau khi di chuyển |
| shouldCharge() | Quyết định có cần sạc ngay không |

---

## 5. computeNextAction() hoạt động thế nào?

### Bước 1: ghi nhớ vị trí

~~~js
this.rememberPosition(robot);
this.recordNodeVisit({ position: state.robot });
this.recordMemoryUsage(1);
~~~

Greedy chỉ ghi nhớ 1 node mỗi bước — memory metric luôn là 1 trên mỗi quyết định.

### Bước 2: xử lý ưu tiên cao

Theo thứ tự ưu tiên:

1. Nếu đang ở thùng rác và robot có rác → đổ rác (nếu đủ pin).
2. Nếu đang ở trạm sạc và cần sạc → sạc.
3. Nếu đang đứng trên rác và chưa đầy → hút rác (nếu đủ pin).

### Bước 3: chọn work target

Gọi chooseWorkTarget() để xác định:

- Nếu đầy rác hoặc hết rác trên map → trả về thùng rác.
- Nếu còn rác → trả về rác gần nhất theo Manhattan mà pin full battery có thể xử lý.

### Bước 4: kiểm tra pin

Nếu target không phải trạm sạc nhưng không đủ pin để đi rồi thoát an toàn, chuyển target về trạm sạc. Nếu vẫn không đủ pin, gọi getChargingAction().

### Bước 5: di chuyển

Gọi chooseMoveTowardTarget() để tính score và chọn bước di chuyển.

---

## 6. chooseMoveTowardTarget() hoạt động thế nào?

Đây là nơi heuristic thực sự được dùng.

~~~js
score = distance + visits * VISIT_PENALTY + backtrackPenalty
~~~

Chi tiết:

- **distance**: `manhattanDistance(candidate.position, target)` — thành phần heuristic chính.
- **visits**: số lần robot đã ghé qua ô đó, nhân với `VISIT_PENALTY = 3`.
- **backtrackPenalty**: nếu candidate là ô robot vừa đứng trước đó (previousPosition) và không phải target → cộng thêm `BACKTRACK_PENALTY = 10`.

Tie-breaking khi score bằng nhau:

~~~js
a.score - b.score || a.distance - b.distance || a.visits - b.visits || a.index - b.index
~~~

### Ngoại lệ: đi về trạm sạc

Khi target là trạm sạc, Greedy không dùng heuristic mà gọi chooseShortestPathMoveToTarget() → chạy BFS nội bộ để đảm bảo tìm được đường.

### Câu trả lời phòng vệ

> Greedy dùng heuristic Manhattan khi di chuyển đến rác hoặc thùng rác, nhưng khi cần về trạm sạc nó tự chuyển sang BFS để đảm bảo về được. Đây là thiết kế thực tế để tránh robot bị kẹt khi pin cạn.

---

## 7. Vai trò của visitCounts và previousPosition

### visitCounts

Map lưu số lần robot đã ghé qua mỗi ô trong suốt một lần chạy. Giá trị này tăng mỗi khi robot di chuyển đến ô mới.

Mục đích: phạt các ô đã ghé nhiều lần, khuyến khích robot khám phá ô mới thay vì lặp vòng.

~~~text
Ô A đã ghé 5 lần → score tăng thêm 5 * 3 = 15
~~~

### previousPosition

Lưu vị trí robot ở bước trước đó. Mục đích: phạt nặng (BACKTRACK_PENALTY = 10) nếu robot định quay lại ô vừa rời, trừ khi đó là target.

### Khác với visited của BFS/DFS

- BFS/DFS dùng visited để loại hoàn toàn các ô đã đi khỏi hàng đợi.
- Greedy không loại ô nào — nó chỉ phạt score, nên robot vẫn có thể quay lại ô cũ nếu không còn lựa chọn tốt hơn.

---

## 8. findShortestPath() trong Greedy là gì?

Greedy có một hàm findShortestPath() chạy BFS nội bộ. Hàm này **không** phải là thuật toán tìm đường chính của Greedy — nó được dùng cho hai mục đích phụ:

1. **Kiểm tra pin**: tính số bước thực tế để ước lượng pin cần thiết qua getShortestPathDistance().
2. **Về trạm sạc**: chooseShortestPathMoveToTarget() dùng findShortestPath() để đảm bảo robot tìm được đường về.

### Câu trả lời phòng vệ

> findShortestPath() trong Greedy là BFS helper nội bộ, không phải thuật toán điều hướng chính. Greedy vẫn dùng heuristic score để chọn từng bước đi đến rác và thùng rác.

---

## 9. Greedy chọn rác như thế nào?

chooseWorkTarget() gọi findNearestPosition() — hàm dùng **Manhattan distance** để chọn rác gần nhất trong danh sách các rác mà pin full battery có thể xử lý.

~~~text
manageableTrashPositions = filter rác bằng canFullBatteryHandleTarget()
target = argmin Manhattan(robot, trash) trong danh sách đó
~~~

Greedy **không** chạy BFS để tìm rác — nó chọn theo Manhattan. Do đó, target được chọn là rác gần nhất theo đường chim bay, không phải rác gần nhất theo đường đi thực tế.

### Nếu có nhiều rác cùng Manhattan distance

Rác được chọn phụ thuộc vào thứ tự trong mảng trashPositions và cách reduce hoạt động (giữ phần tử đầu tiên khi bằng nhau).

### Greedy có tối ưu toàn bộ lịch trình không?

Không. Greedy chỉ chọn rác gần nhất theo Manhattan tại mỗi thời điểm, không tối ưu toàn bộ thứ tự:

~~~text
trash 1 → trash 2 → trash can → station
~~~

---

## 10. Greedy kiểm tra pin như thế nào?

Greedy **không** dùng route thật như BFS/IDS để kiểm tra pin. Nó dùng Manhattan distance qua getShortestPathDistance() → findShortestPath() (BFS) để ước lượng khoảng cách.

Hàm getRequiredBatteryForTarget() tính pin cần thiết bao gồm:

- Di chuyển từ robot đến target.
- Chi phí hành động tại target (hút/đổ).
- Di chuyển từ target về điểm an toàn tiếp theo.

~~~text
Nếu target là rác, chưa đầy:
    pin = (robot→rác) * loss + actionCost + (rác→station) * loss

Nếu target là rác, sẽ đầy sau khi hút:
    pin = (robot→rác) * loss + actionCost + (rác→thùng) * loss + actionCost + (thùng→station) * loss
~~~

### Điểm quan trọng

> Greedy dùng BFS nội bộ để tính khoảng cách thực tế cho phép kiểm tra pin, nhưng dùng heuristic score để ra quyết định di chuyển từng bước.

---

## 11. Tính đầy đủ và tối ưu

### Greedy có đầy đủ không?

**Không đảm bảo.** Greedy có thể bị kẹt trong chu trình nếu các penalty không đủ mạnh để phá vòng. Trong project, visitCounts và backtrack penalty giúp giảm khả năng này, nhưng không đảm bảo hoàn toàn với mọi map.

### Greedy có tối ưu không?

**Không.** Greedy chỉ nhìn heuristic h(n), không tính chi phí đã đi g(n). Đường tìm được thường dài hơn đường ngắn nhất.

### Greedy có dùng heuristic không?

**Có.** Đây là điểm phân biệt lớn nhất với DFS, BFS và IDS. Greedy là thuật toán informed search duy nhất trong project không phải A*/IDA*.

~~~text
Heuristic: h(n) = Manhattan(n, target)
Greedy score = h(n) + visit_penalty + backtrack_penalty
~~~

---

## 12. Độ phức tạp

Ký hiệu:

- n: số ô đi được trên map;
- b: branching factor (thường ≤ 4 trên grid);
- d: độ sâu nghiệm.

Lý thuyết cơ bản:

~~~text
Time:   O(b^m) với m là độ sâu tối đa (không đảm bảo tối ưu)
Memory: O(b^m) nếu dùng queue (Greedy dùng greedy move, không có queue)
~~~

### Lưu ý với implementation project

Greedy trong project **không dùng priority queue hay open list**. Nó ra quyết định từng bước mà không lưu trạng thái tương lai, nên:

- Memory mỗi bước: O(1) candidates (4 hàng xóm).
- Không đảm bảo tìm thấy goal dù có tồn tại route.

Nên nói:

> Greedy trong project quyết định từng bước theo heuristic score mà không duy trì frontier, nên memory dùng thực tế rất thấp, nhưng không đảm bảo đầy đủ hay tối ưu.

---

## 13. So sánh Greedy, BFS, DFS và IDS

| Tiêu chí | Greedy | BFS | DFS | IDS |
|---|---|---|---|---|
| Cấu trúc chính | Heuristic step-by-step | Queue | Stack | DLS lặp với limit tăng dần |
| Heuristic | Có (Manhattan + penalty) | Không | Không | Không |
| Đầy đủ | Không đảm bảo | Có | Có với visited | Có |
| Đường ngắn nhất theo số bước | Không | Có | Không | Có |
| Memory frontier lý thuyết | Rất thấp (O(1) per step) | Có thể cao | Thấp | Gần DFS |
| Target trash | Rác gần nhất theo Manhattan | Rác gần nhất theo BFS path | Rác đầu tiên theo DFS | Rác ở độ sâu nhỏ nhất |
| Kiểm tra pin | BFS nội bộ để ước lượng | Route BFS thật | Manhattan | Route IDS thật |

### Câu so sánh dễ ghi điểm

> Greedy là thuật toán informed duy nhất trong nhóm DFS/BFS/IDS/Greedy. Nó thường nhanh vì hướng thẳng về goal theo heuristic, nhưng không đảm bảo tối ưu và có thể bị kẹt. BFS và IDS chậm hơn nhưng tìm đường ngắn nhất; DFS nhanh nhưng không tối ưu.

---

## 14. Khác Greedy với A* và IDA*

Không được nhầm:

~~~text
Greedy: chỉ dùng h(n) = heuristic đến goal
A*:     dùng f(n) = g(n) + h(n), cân bằng chi phí đã đi và heuristic
IDA*:   dùng ngưỡng f = g + h, tăng dần mỗi iteration
~~~

A* và IDA* đảm bảo tối ưu với heuristic admissible. Greedy không đảm bảo tối ưu dù dùng cùng heuristic Manhattan.

---

## 15. Những giới hạn cần chủ động thừa nhận

1. Greedy không đảm bảo đầy đủ — có thể bị kẹt dù có route đến goal.
2. Greedy không đảm bảo tối ưu — route tìm được thường dài hơn BFS/IDS.
3. Greedy chọn rác theo Manhattan, không theo đường đi thực tế — có thể chọn rác ở "gần" theo đường chim bay nhưng thực ra bị vật cản.
4. visitCounts và backtrack penalty giúp phá vòng nhưng không đảm bảo hoàn toàn.
5. Khi về trạm sạc, Greedy dùng BFS thay heuristic — không thuần Greedy.
6. Metric memory (1 mỗi bước) phản ánh thiết kế step-by-step, không phải bộ nhớ RAM thật.
7. Greedy không tối ưu toàn bộ lịch trình gom rác, chỉ tối ưu cục bộ từng bước.
8. Map chỉnh tay có thể mất liên thông hoặc không khả thi với pin tối đa.

---

## 16. Kịch bản demo 2 phút

### Demo đề xuất

Tạo map có:

- robot ở góc trái;
- một target ở gần theo đường thẳng nhưng có vật cản;
- một target khác xa hơn theo Manhattan nhưng đường thực tế ngắn hơn.

Chạy lần lượt:

1. BFS — tìm đường ngắn nhất thực sự.
2. Reset map.
3. Greedy — chọn target theo Manhattan, route có thể khác.

### Lời nói

> Greedy hướng thẳng về goal theo ước lượng Manhattan. Trên map không có vật cản, Greedy thường đi nhanh gần với BFS. Trên map có nhiều vật cản, Greedy có thể chọn nhầm hướng vì heuristic không tính đến vật cản. Đó là sự đánh đổi giữa tốc độ và tính đúng đắn.

### Chỉ số nên chỉ

- Path/position history.
- Visited nodes.
- Runtime.
- Required memory.
- Battery consumed.

Không hứa trước Greedy luôn nhanh hơn hoặc luôn dùng ít memory hơn trên mọi map.

---

## 17. Câu hỏi phản biện

### 1. Tại sao Greedy không đảm bảo tối ưu?

> Vì Greedy chỉ nhìn h(n) — khoảng cách đến goal — mà không tính g(n) — chi phí đã đi. Nó có thể chọn bước trông có vẻ gần goal nhưng thực ra đi vòng.

### 2. Tại sao Greedy có thể bị kẹt?

> Nếu hướng về goal bị chặn hoàn toàn, Greedy không có cơ chế backtrack có hệ thống. visitCounts penalty giúp giảm nguy cơ lặp vòng, nhưng không đảm bảo thoát được mọi tình huống.

### 3. Greedy có phải informed search không?

> Có. Greedy dùng heuristic h(n) để hướng dẫn tìm kiếm. Đây là điểm khác biệt với BFS, DFS và IDS đều là uninformed search.

### 4. Tại sao Greedy dùng BFS để về trạm sạc?

> Khi về trạm sạc để tránh hết pin, cần đảm bảo chắc chắn tìm được đường. Heuristic greedy có thể không tìm được đường trong mọi trường hợp nên lúc đó Greedy tự chuyển sang chooseShortestPathMoveToTarget() dùng BFS để đảm bảo an toàn.

### 5. VISIT_PENALTY và BACKTRACK_PENALTY có ý nghĩa gì?

> VISIT_PENALTY (3) phạt ô đã đi nhiều lần để khuyến khích khám phá mới. BACKTRACK_PENALTY (10) phạt nặng việc quay ngay lại ô vừa rời để tránh lặp lại hai ô. Hai giá trị này được chọn bằng thực nghiệm.

### 6. Heuristic của Greedy có admissible không?

> Manhattan distance là admissible trên grid không trọng số vì không bao giờ ước lượng quá khoảng cách thực. Tuy nhiên, sau khi cộng VISIT_PENALTY và BACKTRACK_PENALTY, heuristic tổng hợp không còn admissible — nó có thể ước lượng cao hơn chi phí thực. Do đó không thể dùng heuristic tổng hợp này cho A* mà vẫn đảm bảo tối ưu.

### 7. Greedy có dùng code BFS không?

> Greedy có hàm findShortestPath() chạy BFS nội bộ, nhưng chỉ để tính khoảng cách cho phép kiểm tra pin và để về trạm sạc. Logic điều hướng chính dùng heuristic score, không phải BFS route.

### 8. Greedy khác A* ở điểm nào cụ thể trong code?

> A* trong project dùng priority queue (min-heap) với khóa là f = g + h, đảm bảo mở rộng node theo chi phí tổng hợp. Greedy chỉ tính score = h(n) + penalty để chọn bước kế tiếp trong 4 hàng xóm, không duy trì open list.

### 9. Greedy có thể hết pin giữa đường không?

> Trước khi di chuyển, canMoveAndKeepChargingReserve() kiểm tra xem sau khi di chuyển có đủ pin để về trạm sạc không. Nếu không, robot dừng lại (STAY). Tuy vậy, không nên khẳng định hệ thống hoàn hảo cho mọi map chỉnh tay.

### 10. Điểm cải tiến tiếp theo là gì?

> Có thể cải tiến bằng cách dùng A* thay vì greedy step-by-step để đảm bảo tối ưu, hoặc thêm look-ahead để phát hiện dead-end trước khi di chuyển vào.

---

## 18. Những câu không nên nói

### Sai: "Greedy tìm đường ngắn nhất."

Nên nói:

> Greedy hướng về goal nhanh theo heuristic, nhưng không đảm bảo đường ngắn nhất. BFS và IDS mới tìm đường ngắn nhất theo số bước.

### Sai: "Greedy luôn nhanh hơn BFS."

Nên nói:

> Greedy thường ít duyệt node hơn BFS khi heuristic tốt, nhưng hiệu năng phụ thuộc map và vật cản.

### Sai: "Greedy không dùng BFS."

Nên nói:

> Greedy có BFS nội bộ để tính khoảng cách kiểm tra pin và để về trạm sạc, nhưng heuristic greedy mới là cơ chế điều hướng chính khi đến rác và thùng rác.

### Sai: "Greedy và A* giống nhau vì cùng dùng Manhattan."

Nên nói:

> Cả hai dùng Manhattan làm heuristic, nhưng A* cộng thêm g(n) để đảm bảo tối ưu, còn Greedy chỉ dùng h(n) nên nhanh hơn nhưng không đảm bảo.

### Sai: "Greedy tối ưu toàn bộ nhiệm vụ."

Nên nói:

> Greedy chọn hướng di chuyển tốt nhất theo heuristic tại mỗi bước, không tối ưu toàn bộ thứ tự target hay route.

### Sai: "Memory của Greedy là O(1) hoàn toàn."

Nên nói:

> Greedy không duy trì frontier lớn, nhưng còn lưu visitCounts, findShortestPath cache, và metrics trace. Memory metric trong UI là 1 mỗi bước quyết định, phản ánh thiết kế step-by-step.

---

## 19. Checklist trước bảo vệ

- [ ] Greedy Best-First Search là gì?
- [ ] Heuristic của Greedy trong project là gì?
- [ ] VISIT_PENALTY và BACKTRACK_PENALTY làm gì?
- [ ] Vì sao Greedy không đảm bảo tối ưu?
- [ ] Vì sao Greedy có thể bị kẹt?
- [ ] Greedy kế thừa từ lớp nào?
- [ ] findShortestPath() trong Greedy dùng để làm gì?
- [ ] Khi nào Greedy chuyển sang BFS?
- [ ] Greedy chọn rác theo tiêu chí nào?
- [ ] Heuristic admissible có ảnh hưởng gì đến Greedy?
- [ ] Greedy kiểm tra pin bằng cách nào?
- [ ] Greedy khác BFS, DFS, IDS và A* thế nào?
- [ ] Điểm yếu lớn nhất của Greedy là gì?

---

## 20. Tờ ghi nhớ 45 giây

1. Greedy Best-First Search = chọn bước theo h(n), không tính g(n).
2. Heuristic chính: Manhattan distance đến target.
3. Có penalty: visits * 3 và backtrack * 10.
4. Không đảm bảo đầy đủ hay tối ưu.
5. Greedy là informed search; DFS, BFS, IDS là uninformed.
6. Khi về trạm sạc, Greedy tự chuyển sang BFS nội bộ.
7. Chọn rác theo Manhattan, không theo đường đi thực tế.
8. Memory mỗi bước quyết định là O(1) candidates.
9. Không cache route — ra quyết định từng bước.
10. Phân biệt: Greedy chỉ dùng h(n), A* dùng g(n) + h(n).

### Câu kết

> Greedy Best-First Search minh họa sức mạnh và giới hạn của heuristic search thuần túy: khi heuristic tốt và map đơn giản, nó nhanh và hiệu quả; khi có vật cản phức tạp, nó có thể đi vòng hoặc bị kẹt. A* giải quyết giới hạn này bằng cách cân bằng heuristic với chi phí đã đi.

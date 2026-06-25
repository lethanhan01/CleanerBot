# HƯỚNG DẪN IDS CHO PHẦN BẢO VỆ CLEANERBOT

Tài liệu này dành cho phần bảo vệ thêm thuật toán IDS. Phần Environment và DFS vẫn học trong
HUONG_DAN_DFS_ENVIRONMENT_CHO_MINH.md.

---

## 1. Câu trả lời 30 giây

> IDS, hay Iterative Deepening Search, chạy Depth-Limited DFS nhiều lần với giới hạn độ sâu tăng dần từ 0. Nhờ vậy, IDS tìm được nghiệm nông nhất giống BFS trên graph có chi phí mỗi bước bằng nhau, nhưng mỗi lần tìm kiếm vẫn mang đặc trưng chiều sâu của DFS. Đổi lại, các node ở tầng nông bị duyệt lại nhiều lần nên runtime có thể lớn hơn.

Trong project:

- IDS đã được cài đặt thật trong js/algorithms/ids.js.
- IDS có trong dropdown thuật toán và trang Compare.
- IDS kế thừa logic điều phối, pin, hút, đổ và sạc.
- IDS override phần tìm rác và tìm route bằng iterative deepening.
- IDS không dùng heuristic.

---

## 2. Chuỗi kế thừa

~~~text
BaseAlgorithm
      ^
      |
BFSAlgorithm
      ^
      |
DFSAlgorithm
      ^
      |
IDSAlgorithm
~~~

IDS kế thừa:

- từ BaseAlgorithm: metrics, trace và các helper chung;
- từ BFSAlgorithm: bộ điều phối target, pin, hút, đổ, sạc và route cache;
- từ DFSAlgorithm: route commitment, cache một chiều và một số helper;
- tự override: cách tìm rác và cách tìm path.

### Vì sao IDS kế thừa DFS?

Vì IDS là DFS có giới hạn độ sâu được chạy lặp lại. Ngoài ra, project đã đặt route commitment của
DFS trong lớp DFSAlgorithm, nên IDS tái sử dụng được hành vi đó.

### Câu trả lời phòng vệ

> IDS không gọi runDFS() của DFS để tìm đường. Nó kế thừa kiến trúc và route commitment, nhưng tự cài đặt findPath() bằng Depth-Limited Search với giới hạn tăng dần.

---

## 3. Ý tưởng thuật toán

Giả sử goal nằm ở độ sâu 3:

~~~text
Lần 1: depthLimit = 0
Lần 2: depthLimit = 1
Lần 3: depthLimit = 2
Lần 4: depthLimit = 3 -> tìm thấy goal
~~~

Pseudo-code:

~~~text
for limit = 0 to maxDepth:
    result = DepthLimitedSearch(start, limit)
    if result found:
        return result
return failure
~~~

Depth-Limited Search:

~~~text
DLS(node, remainingDepth):
    nếu node là goal:
        trả kết quả

    nếu remainingDepth == 0:
        dừng nhánh

    với mỗi hàng xóm hợp lệ:
        nếu chưa nằm trong path hiện tại:
            tiếp tục DLS(hàng xóm, remainingDepth - 1)
~~~

---

## 4. Các method chính trong code

| Method | Vai trò |
|---|---|
| findNearestSafeTrashTarget() | Tìm rác gần nhất theo độ sâu và kiểm tra pin |
| findNearestTrashTarget() | Tăng depthLimit từ 0 đến giới hạn tối đa |
| depthLimitedTargetSearch() | Chạy một lượt DLS để tìm rác |
| findPath() | Chạy IDS để tìm route từ start đến goal |
| depthLimitedTraverse() | Hàm đệ quy Depth-Limited Search dùng chung |
| getSearchDepthLimit() | Giới hạn độ sâu tối đa của map |

---

## 5. findPath() hoạt động thế nào?

### Bước 1: xử lý input đặc biệt

Nếu thiếu start hoặc goal, trả null. Nếu start trùng goal, path chỉ có một node.

### Bước 2: kiểm tra cache

Nếu không có yêu cầu tránh bước đầu tiên, IDS thử lấy route đã cache.

### Bước 3: iterative deepening

~~~js
for (let depthLimit = 0; depthLimit <= maxDepth; depthLimit += 1) {
  // chạy depthLimitedTraverse(...)
}
~~~

Mỗi vòng lặp tạo lại:

- path;
- pathSet;
- bestDepthByNode.

Nếu tìm thấy goal ở giới hạn đầu tiên có nghiệm, route đó có số bước nhỏ nhất.

### Bước 4: cache kết quả

Nếu tìm được route, IDS cache route. Nếu đã thử hết giới hạn mà không tìm thấy, IDS cache null.

---

## 6. depthLimitedTraverse() hoạt động thế nào?

Hàm nhận:

- state: trạng thái hiện tại;
- path: đường đi hiện tại;
- pathSet: các node đang nằm trên path;
- remainingDepth: số cạnh còn được phép đi sâu;
- onFound: callback kiểm tra goal hoặc trash;
- avoidFirstStepKey: ô cần tránh ở bước đầu;
- bestDepthByNode: độ sâu tốt nhất từng dùng để đến mỗi node.

### Thứ tự xử lý

1. Lấy node cuối của path.
2. Ghi metrics.
3. Gọi onFound(path).
4. Nếu remainingDepth bằng 0, dừng mở rộng.
5. Lấy các hàng xóm có thể đi.
6. Loại ô đang có trong pathSet.
7. Loại đường đến cùng node nhưng không tốt hơn độ sâu đã biết.
8. Push hàng xóm vào path.
9. Gọi đệ quy với remainingDepth giảm 1.
10. Nếu thất bại, pop để backtrack.

---

## 7. Vai trò của pathSet

pathSet chỉ chứa các node trên nhánh đang xét.

Ví dụ:

~~~text
A -> B -> C
~~~

Khi đang ở C, thuật toán không được quay lại A hoặc B trong cùng path, vì sẽ tạo chu trình.

Khi backtrack khỏi C, C được xóa khỏi pathSet, nên một nhánh khác vẫn có thể đi qua C nếu cần.

### Khác visited của DFS

- DFS dùng visited toàn cục trong một lượt tìm kiếm.
- IDS dùng pathSet để chống chu trình trên path hiện tại.
- IDS còn dùng bestDepthByNode để giảm việc mở rộng lại một node bằng đường không tốt hơn.

---

## 8. Vai trò của bestDepthByNode

Map này ghi lại độ sâu nhỏ nhất đã biết để đến mỗi node trong một lượt DLS.

Nếu node X đã được đến ở độ sâu 3, một đường khác đến X ở độ sâu 5 không có lợi hơn vì nó để lại ít
ngân sách độ sâu hơn.

~~~text
bestSeenDepth <= nextDepth -> bỏ nhánh mới
~~~

Nếu sau đó tìm được đường đến X ở độ sâu 2, nhánh mới vẫn được phép vì tốt hơn.

### Câu trả lời phòng vệ

> pathSet chống chu trình trong nhánh hiện tại, còn bestDepthByNode tránh mở rộng lại cùng node bằng một đường sâu hơn hoặc bằng nhau trong cùng lượt Depth-Limited Search.

---

## 9. IDS chọn rác như thế nào?

findNearestSafeTrashTarget():

1. Chạy IDS để tìm rác ở độ sâu nhỏ nhất.
2. Dùng route IDS thật để kiểm tra pin.
3. Nếu đủ pin, chọn rác đó.
4. Nếu không đủ pin, thêm rác vào rejectedTrashKeys.
5. Chạy lại để tìm rác an toàn khác.

Vì map là unweighted grid, mỗi bước có cùng chi phí di chuyển, nên độ sâu chính là số bước.

### Nếu có nhiều rác cùng độ sâu

Rác được gặp trước phụ thuộc thứ tự hàng xóm. Project dùng thứ tự kế thừa từ BFS rồi đảo trước khi
đệ quy để giữ thứ tự mở rộng mong muốn.

### Có phải IDS tối ưu toàn bộ lịch trình gom rác không?

Không. IDS chỉ tìm route ngắn nhất đến target hiện tại. Nó không tối ưu toàn bộ thứ tự:

~~~text
trash 1 -> trash 2 -> trash can -> station
~~~

---

## 10. IDS kiểm tra pin và sạc

IDS kế thừa logic pin từ BFSAlgorithm.

Pin cần thiết có thể gồm:

- đi từ robot đến rác;
- 1 pin để hút;
- đi từ rác về trạm;
- hoặc đi đến thùng rác nếu sau khi hút sẽ đầy;
- 1 pin để đổ;
- đi từ thùng rác về trạm.

~~~text
movementCost = (path.length - 1) * batteryLoss
~~~

Điểm quan trọng:

> IDS dùng route IDS thực tế để tính pin, không dùng Manhattan.

Vì IDS tìm route ngắn nhất theo số bước, phép kiểm tra pin thường ít bảo thủ hơn DFS trên cùng target.

---

## 11. Tính đầy đủ và tối ưu

### IDS có đầy đủ không?

Có trong không gian trạng thái hữu hạn của project, nếu có route đến goal và giới hạn tối đa đủ lớn.

getSearchDepthLimit() dùng:

~~~text
số ô đi được - 1
~~~

Một simple path trên graph hữu hạn không cần dài hơn số node trừ 1.

### IDS có tối ưu không?

Có theo số bước trong project vì:

- mỗi cạnh di chuyển có cùng chi phí;
- depth limit tăng lần lượt 0, 1, 2, ...;
- nghiệm đầu tiên xuất hiện ở độ sâu nhỏ nhất.

Không nên nói IDS tối ưu nếu các cạnh có chi phí khác nhau.

### IDS có dùng heuristic không?

Không. IDS là uninformed search.

---

## 12. Độ phức tạp

Ký hiệu:

- b: branching factor;
- d: độ sâu nghiệm nông nhất.

Lý thuyết thường dùng:

~~~text
Time:   O(b^d)
Memory: O(bd)
~~~

IDS duyệt lại tầng nông nhiều lần, nhưng số node ở tầng sâu nhất thường chiếm phần lớn nên overhead
không nhất thiết quá lớn khi b lớn hơn 1.

### Lưu ý với implementation project

Không nên khẳng định memory đúng tuyệt đối là O(bd) vì code còn có:

- bestDepthByNode;
- route cache;
- metrics trace;
- các object vị trí.

Nên nói:

> IDS có đặc trưng bộ nhớ gần DFS hơn BFS, nhưng metric và implementation cụ thể còn lưu thêm map độ sâu, cache và trace.

---

## 13. So sánh DFS, IDS và BFS

| Tiêu chí | DFS | IDS | BFS |
|---|---|---|---|
| Cấu trúc chính | Stack | DLS lặp với limit tăng dần | Queue |
| Đầy đủ trên graph hữu hạn | Có với visited | Có | Có |
| Đường ngắn nhất theo số bước | Không | Có | Có |
| Duyệt lại tầng nông | Không đáng kể | Có | Không |
| Frontier memory lý thuyết | Thấp | Gần DFS | Có thể cao |
| Heuristic | Không | Không | Không |
| Target trash | Rác đầu tiên theo DFS | Rác ở độ sâu nhỏ nhất | Rác ở độ sâu nhỏ nhất |

### Câu so sánh dễ ghi điểm

> IDS kết hợp thứ tự mở rộng theo chiều sâu của DFS với tính tối ưu theo độ sâu của BFS. Cái giá phải trả là tìm kiếm lặp lại ở các tầng nông.

---

## 14. Khác IDS với IDA*

Không được nhầm:

~~~text
IDS:  tăng giới hạn depth
IDA*: tăng giới hạn f = g + h
~~~

IDS không dùng heuristic. IDA* dùng heuristic Manhattan trong project.

---

## 15. Những giới hạn cần chủ động thừa nhận

1. IDS duyệt lại nhiều node nên visitedNodes và runtime có thể cao.
2. Hàm DLS dùng đệ quy; map rất lớn có thể gặp giới hạn call stack.
3. Project chỉ tối ưu từng route, không tối ưu toàn bộ lịch trình gom rác.
4. Map chỉnh tay có thể mất liên thông.
5. Một map liên thông vẫn có thể không khả thi với pin tối đa.
6. Metric memory không phải số byte RAM thật.
7. IDS có test riêng cho path ngắn nhất, chọn rác và hoàn thành nhiệm vụ, nhưng chưa phải kiểm chứng hình thức cho mọi map.

---

## 16. Kịch bản demo 2 phút

### Demo đề xuất

Tạo map có:

- robot ở góc trái;
- một target ở gần;
- vật cản khiến DFS đi vòng dài;
- vẫn tồn tại một route ngắn rõ ràng.

Chạy lần lượt:

1. DFS.
2. Reset map.
3. IDS.

### Lời nói

> Hai thuật toán dùng cùng Environment và cùng luật pin. DFS đi sâu theo thứ tự node nên route có thể dài. IDS chạy DFS giới hạn độ sâu từ nhỏ lên lớn, nên chỉ khi không có nghiệm ở tầng nông nó mới cho phép đi sâu hơn. Vì vậy IDS tìm route ngắn nhất theo số bước, nhưng số node duyệt có thể tăng do lặp lại các tầng nông.

### Chỉ số nên chỉ

- Path/position history.
- Visited nodes.
- Runtime.
- Required memory.
- Battery consumed.

Không hứa trước IDS luôn nhanh hơn hoặc luôn dùng ít memory hơn trên mọi map.

---

## 17. Câu hỏi phản biện

### 1. Tại sao không dùng BFS luôn?

> BFS cũng tìm đường ngắn nhất, nhưng phải giữ frontier theo từng tầng. IDS minh họa một đánh đổi khác: dùng tìm kiếm chiều sâu lặp để giảm frontier memory theo tinh thần DFS, đổi lại phải duyệt lại tầng nông.

### 2. Tại sao IDS tìm được đường ngắn nhất?

> Vì depth limit tăng từng đơn vị. Nếu goal đầu tiên xuất hiện ở limit d thì đã chứng minh không có goal nào ở độ sâu nhỏ hơn d.

### 3. Nếu có hai goal cùng độ sâu thì sao?

> Cả hai đều tối ưu theo số bước. Goal được chọn trước phụ thuộc thứ tự mở rộng hàng xóm.

### 4. Tại sao reset pathSet sau mỗi depth limit?

> Mỗi limit là một lượt tìm kiếm độc lập. Nếu giữ dữ liệu visited từ lượt trước, các node tầng nông có thể bị chặn và IDS mất tính đúng đắn.

### 5. Tại sao dùng pathSet thay vì visited toàn cục?

> DLS cần cho phép cùng node được xem xét qua một đường tốt hơn trong cùng limit hoặc trong iteration khác. pathSet ngăn chu trình trên nhánh hiện tại, còn bestDepthByNode loại các đường không tốt hơn.

### 6. Vì sao giới hạn tối đa là số ô đi được trừ 1?

> Nếu route tồn tại thì có một simple path không lặp node. Simple path dài nhất trên graph V node có tối đa V - 1 cạnh.

### 7. IDS có phải heuristic search không?

> Không. IDS không có hàm h(n), chỉ tăng depth limit.

### 8. IDS có dùng code DFS không?

> IDS kế thừa kiến trúc của DFS nhưng không dùng runDFS() để tìm path. Nó tự cài đặt Depth-Limited Search trong depthLimitedTraverse().

### 9. IDS có thể hết pin giữa đường không?

> Trước khi chọn target, bộ điều phối kiểm tra pin bằng route IDS thật và cả đường thoát an toàn. Tuy vậy, không nên khẳng định hệ thống hoàn hảo cho mọi map chỉnh tay hoặc mọi tình huống ngoài mô hình.

### 10. Điểm cải tiến tiếp theo là gì?

> Có thể tách bộ điều phối khỏi BFS thành lớp riêng, thêm watchdog maxSteps, và dùng parent pointer để giảm object/path được tạo trong tìm kiếm.

---

## 18. Những câu không nên nói

### Sai: “IDS không duyệt lại node.”

Nên nói:

> IDS cố ý duyệt lại các tầng nông khi tăng depth limit.

### Sai: “IDS luôn nhanh hơn BFS.”

Nên nói:

> Hiệu năng phụ thuộc map; IDS có overhead tìm kiếm lặp.

### Sai: “IDS luôn dùng O(d) memory trong code này.”

Nên nói:

> Lý thuyết frontier của IDS gần DFS, nhưng code còn lưu bestDepthByNode, cache và metrics.

### Sai: “IDS và IDA* giống nhau.”

Nên nói:

> IDS tăng depth limit; IDA* tăng ngưỡng f = g + h.

### Sai: “IDS tối ưu toàn bộ nhiệm vụ.”

Nên nói:

> IDS tối ưu route đến target hiện tại theo số bước, không tối ưu toàn bộ thứ tự target.

---

## 19. Checklist trước bảo vệ

- [ ] IDS viết tắt của gì?
- [ ] Iterative deepening hoạt động thế nào?
- [ ] Depth-Limited Search dừng ở đâu?
- [ ] IDS kế thừa những gì từ DFS/BFS?
- [ ] Method nào thật sự cài IDS?
- [ ] pathSet làm gì?
- [ ] bestDepthByNode làm gì?
- [ ] Vì sao IDS đầy đủ?
- [ ] Vì sao IDS tối ưu theo số bước?
- [ ] Khi nào không được nói IDS tối ưu?
- [ ] IDS kiểm tra pin bằng route nào?
- [ ] IDS khác DFS, BFS và IDA* thế nào?
- [ ] Điểm yếu lớn nhất của IDS là gì?

---

## 20. Tờ ghi nhớ 45 giây

1. IDS = Iterative Deepening Search.
2. IDS chạy Depth-Limited DFS với limit 0, 1, 2, ...
3. IDS không dùng heuristic.
4. IDS tìm nghiệm nông nhất trên unweighted grid.
5. IDS đầy đủ trên graph hữu hạn khi limit đủ lớn.
6. IDS duyệt lại tầng nông nên runtime/visited nodes có thể tăng.
7. pathSet chống chu trình trong path hiện tại.
8. bestDepthByNode loại đường đến node không tốt hơn.
9. IDS dùng route thật để kiểm tra pin.
10. IDS chỉ tối ưu từng route, không tối ưu toàn bộ lịch trình.

### Câu kết

> DFS cho thấy sức mạnh và hạn chế của tìm kiếm chiều sâu. IDS cải thiện tính tối ưu theo độ sâu bằng cách chạy DFS có giới hạn nhiều lần, tạo ra một điểm cân bằng thú vị giữa BFS và DFS.

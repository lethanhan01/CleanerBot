# Thiết kế slide báo cáo CleanerBot trong 8-9 phút

Giả định hiện tại:

- Slide 1: Bìa.
- Slide 2: Thành viên nhóm và phân công.
- Tổng thời lượng mục tiêu: 8-9 phút, nên deck nên có khoảng 10-11 slide. Không nên vượt 12 slide nếu còn demo trực tiếp.

## Nhịp trình bày đề xuất

| Slide | Nội dung | Thời lượng |
|---|---:|---:|
| 1 | Bìa | 15 giây |
| 2 | Thành viên + phân công | 25 giây |
| 3 | Bài toán và mục tiêu | 50 giây |
| 4 | Mô hình môi trường | 55 giây |
| 5 | Luồng hoạt động hệ thống | 60 giây |
| 6 | Các thuật toán trong project | 70 giây |
| 7 | Logic chọn mục tiêu và quản lý pin | 70 giây |
| 8 | So sánh thuật toán | 75 giây |
| 9 | Demo/kết quả thực nghiệm | 90-120 giây |
| 10 | Đánh giá, giới hạn, hướng phát triển | 55 giây |
| 11 | Kết luận | 30 giây |

Tổng khoảng 8 phút 25 giây đến 9 phút.

## Style chung

- Tông màu: nền sáng, chữ đậm, accent xanh dương/xanh lá theo chủ đề robot sạch.
- Mỗi slide chỉ giữ 1 ý chính. Tránh bê nguyên đoạn văn từ báo cáo vào slide.
- Nên dùng ảnh chụp màn hình app thật ở các slide 3, 4, 8, 9.
- Ký hiệu thống nhất:
  - Robot: xanh dương.
  - Rác: xanh lá.
  - Vật cản: xám/đen.
  - Trạm sạc: vàng.
  - Thùng rác: cam.
- Font dễ đọc: Aptos, Calibri, Inter hoặc Segoe UI.
- Tiêu đề nên là câu kết luận, không chỉ là nhãn chủ đề.

---

## Slide 3 - CleanerBot biến bài toán tìm kiếm thành mô phỏng trực quan

**Mục tiêu slide:** Giảng viên hiểu project làm gì trong 30 giây đầu sau phần giới thiệu nhóm.

**Bố cục:**

- Bên trái: ảnh/screenshot giao diện chính của CleanerBot.
- Bên phải: 3 khối ngắn:
  1. Robot di chuyển trên lưới 2D.
  2. Thu gom rác, tránh vật cản, quản lý pin.
  3. So sánh 8 thuật toán tìm kiếm trên cùng một bản đồ.

**Text đưa lên slide:**

Tiêu đề: `CleanerBot mô phỏng robot dọn rác bằng các thuật toán tìm kiếm`

Gạch đầu dòng:

- Môi trường dạng lưới 2D: robot, rác, vật cản, trạm sạc, thùng rác.
- Robot phải gom hết rác, đổ rác và quay về trạm sạc.
- Project dùng để quan sát và so sánh hành vi của nhiều thuật toán AI.

**Lời nói ngắn:**

“CleanerBot là một web simulator. Thay vì chỉ học thuật toán trên lý thuyết, nhóm đưa thuật toán vào một môi trường có luật cụ thể: có vật cản, có pin, có sức chứa và có điều kiện hoàn thành rõ ràng.”

---

## Slide 4 - Môi trường đặt ra luật, thuật toán chỉ ra quyết định

**Mục tiêu slide:** Tách rõ Environment và Algorithm.

**Bố cục:**

- Trung tâm: sơ đồ lưới nhỏ 6x6 hoặc screenshot map.
- Xung quanh: 5 nhãn:
  - Robot start/trạm sạc `(0,0)`.
  - Thùng rác ở góc dưới phải.
  - Rác nằm ở ô có thể tiếp cận.
  - Vật cản không được đi qua.
  - Pin và sức chứa là ràng buộc.

**Text đưa lên slide:**

Tiêu đề: `Môi trường kiểm tra luật trước khi robot được di chuyển`

Nội dung ngắn:

- Di chuyển 4 hướng, không đi chéo.
- Không ra khỏi map, không đi vào vật cản.
- Hút rác, đổ rác, sạc pin chỉ hợp lệ tại đúng vị trí.
- Hoàn thành khi: hết rác + túi rỗng + robot ở trạm sạc.

**Lời nói ngắn:**

“Điểm quan trọng là thuật toán không tự sửa trạng thái. Thuật toán chỉ trả về action tiếp theo, còn Environment đóng vai trò trọng tài: kiểm tra hành động có hợp lệ hay không rồi mới cập nhật pin, vị trí và trạng thái hoàn thành.”

---

## Slide 5 - Một bước chạy gồm: nghĩ, kiểm tra, cập nhật, vẽ lại

**Mục tiêu slide:** Cho thấy kiến trúc hệ thống và luồng xử lý.

**Bố cục:**

Sơ đồ ngang 5 bước:

`User Run/Next -> Simulator -> Algorithm -> Environment -> Renderer/UI`

Thêm dòng nhỏ dưới sơ đồ:

`state -> nextAction(state) -> applyAction(action) -> new state`

**Text đưa lên slide:**

Tiêu đề: `Hệ thống tách riêng phần mô phỏng và phần tìm kiếm`

Các module chính:

- `models.js`: Robot, map, action.
- `environment.js`: luật môi trường và cập nhật trạng thái.
- `simulator.js`: vòng lặp chạy từng bước.
- `algorithms/`: BFS, DFS, IDS, A*, IDA*, Dijkstra, Greedy Best-First, Greedy.
- `render.js/main.js`: giao diện và tương tác.

**Lời nói ngắn:**

“Cách tách này giúp nhóm thêm thuật toán mới mà không cần viết lại giao diện. Miễn thuật toán tuân theo interface `nextAction(state)`, Simulator có thể chạy nó giống các thuật toán khác.”

---

## Slide 6 - Project triển khai 8 thuật toán nhưng tập trung vào đánh đổi chính

**Mục tiêu slide:** Không sa vào giải thích quá nhiều thuật toán.

**Bố cục:**

Bảng 2 nhóm:

| Tìm kiếm mù | Tìm kiếm có thông tin/heuristic |
|---|---|
| BFS | A* |
| DFS | IDA* |
| IDS | Greedy Best-First |
| Dijkstra | Greedy |

Ở góc dưới: công thức Manhattan.

`h = |x_goal - x| + |y_goal - y|`

**Text đưa lên slide:**

Tiêu đề: `Các thuật toán khác nhau chủ yếu ở cách chọn node tiếp theo`

Nội dung:

- BFS/DFS/IDS không dùng heuristic.
- A*, IDA*, Greedy Best-First, Greedy dùng khoảng cách Manhattan.
- Dijkstra tối ưu theo chi phí, tương tự BFS khi mọi bước có chi phí bằng nhau.

**Lời nói ngắn:**

“Vì thời lượng có hạn, nhóm không đọc lý thuyết của cả 8 thuật toán. Trọng tâm là so sánh cách chúng đánh đổi giữa đường đi, số node duyệt và bộ nhớ.”

---

## Slide 7 - Robot không chỉ đi đến rác gần nhất, mà phải đi an toàn

**Mục tiêu slide:** Làm nổi bật logic pin/sức chứa, đây là điểm project khác ví dụ tìm đường đơn giản.

**Bố cục:**

Sơ đồ quyết định dạng cây hoặc flow:

1. Đã xong? -> Stay.
2. Đang ở thùng rác và cần đổ? -> Let trash out.
3. Đang ở trạm sạc và cần sạc? -> Charge.
4. Đang đứng trên rác và đủ điều kiện? -> Suck trash.
5. Còn lại -> chọn mục tiêu + tìm đường.

Bên phải: công thức pin an toàn rút gọn:

`Pin cần >= đi tới mục tiêu + hành động + đường về an toàn`

**Text đưa lên slide:**

Tiêu đề: `Quyết định của robot có thêm ràng buộc pin và sức chứa`

Nội dung:

- Nếu đầy rác: ưu tiên đi đến thùng rác.
- Nếu pin không đủ cho chu trình an toàn: quay về trạm sạc.
- Nếu còn rác và đủ pin: chọn mục tiêu rồi tìm đường.
- Mỗi thuật toán dùng cách tìm đường khác nhau, nhưng dùng chung luật an toàn.

**Lời nói ngắn:**

“Một viên rác nhìn có vẻ gần vẫn có thể bị bỏ qua nếu sau khi hút robot không đủ pin để đi đổ rác hoặc quay về trạm sạc. Đây là phần làm bài toán thực tế hơn so với tìm đường từ A đến B đơn thuần.”

---

## Slide 8 - So sánh thuật toán bằng cùng một bản đồ và cùng chỉ số

**Mục tiêu slide:** Trình bày tiêu chí đánh giá trước khi demo.

**Bố cục:**

- Bên trái: screenshot/popup Compare 8 algorithms nếu có.
- Bên phải: bảng chỉ số.

**Text đưa lên slide:**

Tiêu đề: `So sánh công bằng: cùng map, khác chiến lược tìm kiếm`

Chỉ số:

| Chỉ số | Ý nghĩa |
|---|---|
| Steps | Số bước robot thực hiện |
| Visited nodes | Số node thuật toán đã duyệt |
| Runtime | Thời gian xử lý |
| Peak memory | Bộ nhớ ước lượng qua frontier/visited |
| Battery consumed | Lượng pin tiêu thụ |

**Gợi ý câu chốt:**

- BFS: đảm bảo đường ngắn nhưng thường tốn bộ nhớ.
- DFS: nhẹ hơn nhưng không đảm bảo ngắn nhất.
- IDS: kết hợp đường ngắn của BFS và bộ nhớ thấp của DFS, đổi lại duyệt lại.
- A*/IDA*: dùng heuristic để định hướng tìm kiếm.

---

## Slide 9 - Demo hoặc kết quả thực nghiệm

**Mục tiêu slide:** Dành nhiều thời gian nhất cho phần thấy được sản phẩm chạy thật.

**Bố cục nếu demo trực tiếp:**

- Slide chỉ có tiêu đề + checklist demo, không nhồi chữ.
- Mở app thật ở trình duyệt.

**Text đưa lên slide:**

Tiêu đề: `Demo: cùng một map, quan sát sự khác biệt giữa các thuật toán`

Checklist demo:

1. Tạo/chọn một bản đồ mẫu.
2. Chạy một thuật toán từng bước để thấy robot ra quyết định.
3. Mở Compare để so sánh 8 thuật toán.
4. Chỉ vào Steps, Visited nodes, Peak memory, Battery consumed.

**Nếu không demo live, dùng ảnh chụp kết quả:**

Tạo một bảng nhỏ:

| Thuật toán | Steps | Visited | Memory | Nhận xét |
|---|---:|---:|---:|---|
| BFS | ... | ... | ... | Ngắn nhưng lưu nhiều |
| DFS | ... | ... | ... | Có thể đi dài hơn |
| IDS | ... | ... | ... | Ngắn, nhớ thấp, duyệt lại |
| A* | ... | ... | ... | Heuristic định hướng tốt |

Không cần điền số nếu chưa có kết quả cố định, nhưng khi báo cáo nên lấy số từ một map mẫu cụ thể.

**Lời nói ngắn khi demo:**

“Em sẽ chạy trên cùng một bản đồ để các chỉ số có ý nghĩa so sánh. Ta không kết luận thuật toán nào luôn tốt nhất, mà nhìn vào đánh đổi trên tình huống cụ thể.”

---

## Slide 10 - Đánh giá project: làm được gì và còn giới hạn gì

**Mục tiêu slide:** Cho thấy nhóm hiểu giới hạn, không nói quá.

**Bố cục:**

Hai cột:

- Đã hoàn thành.
- Giới hạn/hướng phát triển.

**Text đưa lên slide:**

Tiêu đề: `CleanerBot minh họa rõ đánh đổi giữa các chiến lược tìm kiếm`

Đã hoàn thành:

- Mô phỏng robot trên bản đồ lưới có vật cản, pin, sức chứa.
- Triển khai 8 thuật toán theo cùng interface.
- Có điều khiển Run/Step/Reset và chỉnh sửa map.
- Có chỉ số để so sánh thuật toán.

Giới hạn và hướng phát triển:

- Chưa tối ưu thứ tự gom nhiều rác ở mức toàn cục.
- Map tự chỉnh tay có thể tạo tình huống không giải được.
- Có thể tách bộ điều phối ra khỏi BFS để kiến trúc rõ hơn.
- Có thể thêm thống kê nhiều lần chạy và biểu đồ kết quả.

---

## Slide 11 - Kết luận

**Mục tiêu slide:** Kết thúc gọn, nhắc lại giá trị học thuật.

**Bố cục:**

- Một câu kết luận lớn ở giữa.
- Ba ý nhỏ bên dưới.

**Text đưa lên slide:**

Tiêu đề: `Từ thuật toán tìm kiếm đến một hệ thống robot có ràng buộc`

Ba ý chốt:

- Cùng một môi trường, mỗi thuật toán tạo ra hành vi khác nhau.
- Chỉ số Steps, Visited nodes, Memory và Battery giúp thấy rõ đánh đổi.
- Project giúp nhóm hiểu cách áp dụng AI search vào bài toán mô phỏng có luật.

**Câu kết:**

“Qua CleanerBot, nhóm thấy rằng trong AI, thuật toán không chỉ cần tìm được đường đi, mà còn phải phù hợp với ràng buộc của môi trường.”

---

## Phương án rút gọn nếu chỉ muốn 10 slide

Nếu giảng viên yêu cầu rất sát 8 phút, gộp slide 10 và 11:

- Slide 10: `Kết luận và hướng phát triển`
- Giữ 3 ý kết luận + 3 giới hạn quan trọng.
- Không thêm slide 11.

## Phân vai nói gợi ý

Nếu nhóm có 3 người:

- Người 1: slide 1-4, giới thiệu bài toán và môi trường.
- Người 2: slide 5-7, kiến trúc và thuật toán.
- Người 3: slide 8-11, so sánh, demo, kết luận.

Nếu nhóm có 4 người:

- Người 1: slide 1-3.
- Người 2: slide 4-5.
- Người 3: slide 6-7.
- Người 4: slide 8-11 và demo.

## Lưu ý để không bị hỏi khó

- Không nói “hút hết rác là xong”. Phải nói đủ: hết rác, túi rỗng, robot về trạm sạc.
- Không nói “IDS không duyệt lại”. IDS cố ý duyệt lại tầng nông.
- Không nói “DFS tìm đường ngắn nhất”. DFS không đảm bảo ngắn nhất.
- Không nói “thuật toán nào luôn tốt nhất”. Kết quả phụ thuộc map và tiêu chí.
- Khi nói về memory, gọi là “bộ nhớ ước lượng/peak memory”, không phải RAM thật.

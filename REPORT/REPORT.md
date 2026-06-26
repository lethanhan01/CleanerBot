<span style="color:red">**THẦY NHẮC: BỔ SUNG KẾT QUẢ TEST VÀ SO SÁNH CÁC THUẬT TOÁN. ĐẦU VÀO THẾ NÀO, HOẠT ĐỘNG THẾ NÀO, KẾT QUẢ THẾ NÀO, VÀ SO SÁNH, NHẬN XÉT.**</span>


- [BÁO CÁO PROJECT: CLEANERBOT AI SIMULATOR](#báo-cáo-project-cleanerbot-ai-simulator)
  - [1. Thông Tin Chung](#1-thông-tin-chung)
  - [2. Mô Tả Bài Toán](#2-mô-tả-bài-toán)
    - [2.1. Các Thành Phần Trong Môi Trường](#21-các-thành-phần-trong-môi-trường)
    - [2.2. Tập Hành Động Của Robot](#22-tập-hành-động-của-robot)
    - [2.3. Ràng Buộc Bài Toán](#23-ràng-buộc-bài-toán)
  - [3. Chức Năng Đã Xây Dựng](#3-chức-năng-đã-xây-dựng)
    - [3.1. Mô Phỏng Robot Trên Bản Đồ Lưới](#31-mô-phỏng-robot-trên-bản-đồ-lưới)
    - [3.2. Tùy Chỉnh Bản Đồ Và Tham Số](#32-tùy-chỉnh-bản-đồ-và-tham-số)
    - [3.3. Lưu Và Tải Bản Đồ](#33-lưu-và-tải-bản-đồ)
    - [3.4. So Sánh Thuật Toán](#34-so-sánh-thuật-toán)
  - [4. Thiết Kế Hệ Thống](#4-thiết-kế-hệ-thống)
    - [4.1. Cấu Trúc Thư Mục Chính](#41-cấu-trúc-thư-mục-chính)
    - [4.2. Lớp Dữ Liệu Cốt Lõi](#42-lớp-dữ-liệu-cốt-lõi)
    - [4.3. Environment](#43-environment)
    - [4.4. Simulator](#44-simulator)
    - [4.5. BaseAlgorithm Và Cơ Chế Kế Thừa](#45-basealgorithm-và-cơ-chế-kế-thừa)
  - [5. Các Thuật Toán Đã Triển Khai](#5-các-thuật-toán-đã-triển-khai)
    - [5.1. BFS - Breadth-First Search](#51-bfs---breadth-first-search)
    - [5.2. DFS - Depth-First Search](#52-dfs---depth-first-search)
    - [5.3. IDS - Iterative Deepening Search](#53-ids---iterative-deepening-search)
    - [5.4. Dijkstra](#54-dijkstra)
    - [5.5. A\* Search](#55-a-search)
    - [5.6. IDA\* - Iterative Deepening A\*](#56-ida---iterative-deepening-a)
    - [5.7. Greedy](#57-greedy)
    - [5.8. Greedy Best-First Search Bổ Sung](#58-greedy-best-first-search-bổ-sung)
  - [6. Luồng Hoạt Động Của Ứng Dụng](#6-luồng-hoạt-động-của-ứng-dụng)
  - [7. Giao Diện Người Dùng](#7-giao-diện-người-dùng)
    - [7.1. Màn Hình Mô Phỏng](#71-màn-hình-mô-phỏng)
    - [7.2. Map Editor](#72-map-editor)
    - [7.3. Panel So Sánh](#73-panel-so-sánh)
  - [8. Lưu Trữ Và API](#8-lưu-trữ-và-api)
  - [9. Kiểm Thử](#9-kiểm-thử)
    - [9.1. Các Nhóm Test Chính](#91-các-nhóm-test-chính)
    - [9.2. Kết Quả Test Và So Sánh Các Thuật Toán](#92-kết-quả-test-và-so-sánh-các-thuật-toán)
  - [10. Hướng Dẫn Chạy Project](#10-hướng-dẫn-chạy-project)
    - [10.1. Yêu Cầu](#101-yêu-cầu)
    - [10.2. Chạy Ứng Dụng](#102-chạy-ứng-dụng)
    - [10.3. Chạy Test](#103-chạy-test)
  - [11. Đánh Giá Kết Quả](#11-đánh-giá-kết-quả)
  - [12. Hạn Chế Và Hướng Phát Triển](#12-hạn-chế-và-hướng-phát-triển)
    - [12.1. Hạn Chế](#121-hạn-chế)
    - [12.2. Hướng Phát Triển](#122-hướng-phát-triển)
  - [13. Phân Công Công Việc](#13-phân-công-công-việc)
    - [13.1. Công Việc Chung Của Nhóm](#131-công-việc-chung-của-nhóm)
  - [14. Kết Luận](#14-kết-luận)



# BÁO CÁO PROJECT: CLEANERBOT AI SIMULATOR

## 1. Thông Tin Chung

**Tên project:** CleanerBot AI Simulator

**Chủ đề:** Mô phỏng robot dọn rác trên bản đồ dạng lưới và so sánh các thuật toán tìm kiếm đường đi trong trí tuệ nhân tạo.

**Mục tiêu:** Xây dựng một ứng dụng web cho phép người dùng tạo bản đồ, mô phỏng robot dọn rác, quan sát hành vi của nhiều thuật toán tìm kiếm và so sánh các chỉ số thực nghiệm như số bước, số nút đã duyệt, bộ nhớ sử dụng, thời gian chạy và năng lượng tiêu thụ.

**Công nghệ sử dụng:**

| Thành phần | Công nghệ |
| --- | --- |
| Giao diện | HTML, CSS, JavaScript ES Modules |
| Mô phỏng | JavaScript hướng đối tượng |
| Server lưu bản đồ | Node.js HTTP server |
| Lưu trữ dữ liệu | File JSON `data/saved-maps.json` |
| Kiểm thử | `node:test`, `node:assert/strict` |

## 2. Mô Tả Bài Toán

Project mô phỏng một robot dọn rác hoạt động trong môi trường dạng lưới hai chiều. Mỗi ô trên bản đồ có thể là ô trống, rác, chướng ngại vật, trạm sạc, thùng rác hoặc vị trí hiện tại của robot. Robot cần lập kế hoạch di chuyển qua các ô hợp lệ, hút rác, đổ rác vào thùng rác và quay về trạm sạc sau khi hoàn thành nhiệm vụ.

### 2.1. Các Thành Phần Trong Môi Trường

| Thành phần | Ý nghĩa |
| --- | --- |
| Robot | Tác nhân chính cần lập kế hoạch và thực hiện hành động |
| Trash | Rác cần thu gom |
| Obstacle | Chướng ngại vật, robot không được đi qua |
| Charging station | Trạm sạc, nơi robot có thể sạc đầy pin |
| Trash can | Thùng rác, nơi robot đổ rác đã thu gom |
| Grid map | Không gian hoạt động dạng lưới có kích thước tùy chỉnh |

### 2.2. Tập Hành Động Của Robot

Robot có các hành động được định nghĩa trong `js/models.js`:

| Hành động | Mô tả |
| --- | --- |
| `up`, `down`, `left`, `right` | Di chuyển lên, xuống, trái, phải |
| `suck_trash` | Hút rác tại ô hiện tại |
| `let_trash_out` | Đổ rác khi robot đứng tại thùng rác |
| `charge` | Sạc pin khi robot đứng tại trạm sạc |
| `stay` | Đứng yên |

### 2.3. Ràng Buộc Bài Toán

Robot chỉ được di chuyển trong phạm vi bản đồ và không được đi xuyên qua chướng ngại vật. Mỗi bước di chuyển làm giảm pin theo cấu hình `batteryLoss`; hành động hút rác và đổ rác có chi phí riêng `actionCost`. Robot có giới hạn sức chứa `maxCapacity`, vì vậy khi túi rác đầy, robot phải đi đến thùng rác để đổ rác trước khi tiếp tục thu gom.

Điều kiện hoàn thành mô phỏng:

1. Không còn rác trên bản đồ.
2. Túi rác của robot rỗng.
3. Robot quay về trạm sạc.

## 3. Chức Năng Đã Xây Dựng

### 3.1. Mô Phỏng Robot Trên Bản Đồ Lưới

Ứng dụng hiển thị bản đồ lưới trực quan, có tọa độ hàng/cột và biểu tượng riêng cho robot, rác, chướng ngại vật, trạm sạc, thùng rác. Người dùng có thể chạy từng bước, chạy tự động, tạm dừng, quay lại bước trước và reset bản đồ.

### 3.2. Tùy Chỉnh Bản Đồ Và Tham Số

Người dùng có thể cấu hình:

- Chiều rộng và chiều cao bản đồ.
- Số lượng rác.
- Số lượng chướng ngại vật.
- Sức chứa rác tối đa của robot.
- Dung lượng pin tối đa.
- Mức hao pin mỗi bước di chuyển.

Ngoài sinh bản đồ ngẫu nhiên, ứng dụng hỗ trợ chỉnh sửa trực tiếp trên lưới: thêm/xóa rác, thêm/xóa chướng ngại vật, đổi vị trí trạm sạc, đổi vị trí thùng rác, đổi vị trí xuất phát của robot và sinh thêm rác khi mô phỏng đang tạm dừng.

### 3.3. Lưu Và Tải Bản Đồ

Project có module `MapStorage` phía client và `MapRepository` phía server để lưu bản đồ theo tên. Dữ liệu được lưu trong file JSON. Các thao tác chính gồm:

- Liệt kê bản đồ đã lưu.
- Lưu bản đồ mới hoặc ghi đè bản đồ cũ.
- Tải lại bản đồ đã lưu.
- Xóa bản đồ.

### 3.4. So Sánh Thuật Toán

Ứng dụng có panel so sánh nhiều thuật toán trên cùng một bản đồ ban đầu. Mỗi thuật toán chạy độc lập trên một `Environment` riêng để đảm bảo công bằng. Giao diện so sánh hiển thị:

- Số bước đã đi.
- Số nút đã duyệt.
- Thời gian chạy.
- Năng lượng đã tiêu thụ.
- Bộ nhớ đỉnh ước lượng theo số node.
- Trạng thái hoàn thành.

## 4. Thiết Kế Hệ Thống

Project được tổ chức theo hướng tách rõ model, môi trường, simulator, thuật toán, render giao diện và lưu trữ.

### 4.1. Cấu Trúc Thư Mục Chính

```text
CleanerBot/
|-- index.html
|-- compare.html
|-- style.css
|-- server.js
|-- package.json
|-- data/
|   `-- saved-maps.json
|-- server/
|   `-- mapRepository.js
|-- js/
|   |-- models.js
|   |-- environment.js
|   |-- simulator.js
|   |-- render.js
|   |-- main.js
|   |-- compare.js
|   |-- mapStorage.js
|   |-- sampleMaps.js
|   `-- algorithms/
|       |-- baseAlgorithm.js
|       |-- bfs.js
|       |-- dfs.js
|       |-- ids.js
|       |-- astar.js
|       |-- idastar.js
|       |-- dijkstra.js
|       |-- greedy.js
|       |-- greedy-best-first.js
|       `-- registry.js
`-- tests/
    `-- *.test.mjs
```

### 4.2. Lớp Dữ Liệu Cốt Lõi

File `js/models.js` định nghĩa các cấu trúc dữ liệu nền tảng:

| Lớp / hằng số | Vai trò |
| --- | --- |
| `ACTIONS` | Tập hành động hợp lệ của robot |
| `Robot` | Lưu pin, sức chứa và vị trí hiện tại |
| `CleanerMap` | Lưu kích thước bản đồ, rác, chướng ngại vật, trạm sạc, thùng rác |
| `SimulationState` | Snapshot trạng thái đầy đủ của mô phỏng |
| `simulationStateFromPlain` | Chuyển object JSON thành state có method |
| `simulationStateToPlain` | Chuyển state thành object thuần để lưu hoặc truyền qua API |

Việc tách riêng model giúp các module khác không phụ thuộc trực tiếp vào DOM hay server. Thuật toán chỉ cần nhận `SimulationState` và trả về hành động tiếp theo.

### 4.3. Environment

`js/environment.js` đóng vai trò như luật vận hành của thế giới mô phỏng. Đây là nơi quản lý trạng thái thật và là điểm duy nhất thực thi hành động của robot.

Nhiệm vụ chính:

- Tạo bản đồ ban đầu từ cấu hình.
- Sinh chướng ngại vật sao cho vùng đi được vẫn liên thông.
- Sinh rác tại các ô có thể tiếp cận.
- Kiểm tra hợp lệ khi robot di chuyển, hút rác, đổ rác, sạc pin.
- Xử lý chỉnh sửa bản đồ khi mô phỏng đang tạm dừng.
- Cập nhật điều kiện hoàn thành.
- Clone và restore state cho reset/undo.

Khi sinh chướng ngại vật, project dùng BFS để kiểm tra tính liên thông của toàn bộ vùng có thể đi. Cách này giúp tránh trường hợp bản đồ sinh ra có rác, thùng rác hoặc trạm sạc bị cô lập.

### 4.4. Simulator

`js/simulator.js` điều phối vòng lặp chạy mô phỏng. Simulator không tự quyết định robot đi đâu, mà gọi `algorithm.nextAction(state)` để lấy hành động tiếp theo, sau đó đưa hành động cho `Environment.applyAction`.

Nhiệm vụ chính:

- Chạy từng bước hoặc chạy tự động bằng interval.
- Cache hành động tiếp theo để UI hiển thị preview.
- Quản lý tốc độ chạy.
- Lưu lịch sử state để undo.
- Lưu lịch sử vị trí robot.
- Thu thập và hiển thị metric của thuật toán.
- Tự dừng khi mô phỏng hoàn thành.

### 4.5. BaseAlgorithm Và Cơ Chế Kế Thừa

`js/algorithms/baseAlgorithm.js` là lớp cơ sở cho các thuật toán. Lớp này gồm các tiện ích dùng chung:

- Tính khoảng cách Manhattan.
- Kiểm tra robot đang ở trạm sạc, thùng rác hoặc ô có rác.
- Sinh các ô kề cận.
- Kiểm tra ô có thể đi được hay không.
- Quản lý `currentTarget`.
- Ghi metric: runtime, visited nodes, peak memory, battery consumed.
- Lưu trace các node đã duyệt để phục vụ quan sát và so sánh.

Thiết kế này giúp các thuật toán không phải lặp lại phần code chung. Mỗi thuật toán có thể tập trung vào chiến lược tìm đường hoặc chọn hành động.

## 5. Các Thuật Toán Đã Triển Khai

### 5.1. BFS - Breadth-First Search

File: `js/algorithms/bfs.js`

BFS sử dụng hàng đợi FIFO để duyệt theo từng lớp. Trong môi trường có chi phí di chuyển đồng nhất, BFS tìm được đường đi ngắn nhất theo số bước từ vị trí hiện tại đến mục tiêu.

Trong project, BFS không chỉ tìm đường mà còn xử lý logic nhiệm vụ:

- Nếu túi rác đầy hoặc hết rác trên bản đồ nhưng robot còn mang rác, robot chọn thùng rác làm mục tiêu.
- Nếu hết rác và túi rỗng, robot quay về trạm sạc.
- Nếu đang đứng trên ô có rác và còn sức chứa, robot hút rác.
- Trước khi chọn mục tiêu, thuật toán kiểm tra pin có đủ để đi đến mục tiêu và vẫn đảm bảo đường lui an toàn hay không.
- Có cache đường đi để tránh tính lại không cần thiết.
- Có cơ chế phát hiện lặp giữa hai ô và tìm lại route khi cần.

### 5.2. DFS - Depth-First Search

File: `js/algorithms/dfs.js`

DFS dùng ngăn xếp LIFO, ưu tiên đi sâu vào một nhánh trước khi quay lui. DFS không đảm bảo đường ngắn nhất, nhưng minh họa rõ chiến lược tìm kiếm theo chiều sâu.

Trong project, DFS kế thừa logic điều phối nhiệm vụ từ BFS nhưng thay phần tìm đường bằng DFS. DFS có thêm cơ chế "committed route": khi đã chọn một route hợp lệ, robot tiếp tục đi theo route đó nếu route còn phù hợp. Điều này giúp hạn chế hiện tượng robot thay đổi quyết định liên tục và dao động qua lại.

### 5.3. IDS - Iterative Deepening Search

File: `js/algorithms/ids.js`

IDS kết hợp ý tưởng của DFS và BFS: thực hiện DFS có giới hạn độ sâu, sau đó tăng dần giới hạn. Nếu mục tiêu nằm ở độ sâu nhỏ, IDS có thể tìm được lời giải theo độ sâu tương tự BFS nhưng dùng cơ chế duyệt theo chiều sâu từng mức.

Trong project, IDS:

- Tăng `depthLimit` từ 0 đến số ô có thể đi.
- Dùng để tìm đường tới rác gần nhất theo độ sâu.
- Có cơ chế loại bỏ mục tiêu rác không an toàn về pin.
- Ghi số nút đã duyệt và bộ nhớ ước lượng thông qua `BaseAlgorithm`.

### 5.4. Dijkstra

File: `js/algorithms/dijkstra.js`

Dijkstra tìm đường ngắn nhất theo chi phí tích lũy `g(n)`. Trong phiên bản hiện tại, mỗi bước đi có chi phí 1, vì vậy kết quả của Dijkstra gần với BFS trên đồ thị không trọng số. Tuy nhiên, việc triển khai Dijkstra tạo nền tảng để mở rộng sang bài toán có chi phí khác nhau giữa các ô, ví dụ khu vực tiêu hao pin cao hơn.

Dijkstra trong project:

- Sử dụng open set sắp xếp theo chi phí nhỏ nhất.
- Lưu `bestCost` cho mỗi node.
- Bỏ qua node đã đóng trong `closedKeys`.
- Ghi trace với `g` và `h` để hỗ trợ quan sát/so sánh.

### 5.5. A* Search

File: `js/algorithms/astar.js`

A* sử dụng hàm đánh giá:

```text
f(n) = g(n) + h(n)
```

Trong đó:

- `g(n)` là chi phí từ điểm bắt đầu đến node hiện tại.
- `h(n)` là heuristic ước lượng từ node hiện tại đến đích.
- Project dùng khoảng cách Manhattan làm heuristic:

```text
h(n) = |x_goal - x_current| + |y_goal - y_current|
```

Khoảng cách Manhattan phù hợp với bản đồ lưới chỉ cho phép đi bốn hướng và không đi chéo. A* thường duyệt ít node hơn BFS/Dijkstra khi heuristic định hướng tốt.

### 5.6. IDA* - Iterative Deepening A*

File: `js/algorithms/idastar.js`

IDA* kết hợp A* và iterative deepening. Thuật toán dùng ngưỡng `bound` trên giá trị `f(n) = g(n) + h(n)`. Nếu `f(n)` vượt quá bound hiện tại, nhánh đó bị cắt. Sau mỗi vòng, bound được tăng lên ngưỡng nhỏ nhất tiếp theo.

Trong project, IDA*:

- Dùng heuristic Manhattan giống A*.
- Duyệt theo giới hạn `f`.
- Tiết kiệm bộ nhớ hơn A* trong nhiều trường hợp vì không cần giữ toàn bộ open set lớn.
- Phù hợp để minh họa sự khác nhau giữa A* và biến thể iterative-deepening.

### 5.7. Greedy

File: `js/algorithms/greedy.js`

Greedy trong project là thuật toán ra quyết định cục bộ dựa trên điểm số:

```text
score = Manhattan distance + visits * VISIT_PENALTY + backtrack penalty
```

Trong đó:

- `Manhattan distance` giúp robot tiến gần mục tiêu.
- `visits` phạt các ô đã đi qua nhiều lần.
- `backtrack penalty` hạn chế quay lại ngay ô vừa đi qua.

Greedy có tốc độ ra quyết định nhanh, nhưng không đảm bảo lời giải tối ưu. Để tăng tính thực tế, project bổ sung kiểm tra pin: robot chỉ chọn mục tiêu nếu đủ pin hoặc có thể quay về trạm sạc an toàn.

### 5.8. Greedy Best-First Search Bổ Sung

File: `js/algorithms/greedy-best-first.js`

Ngoài các thuật toán chính trong giao diện, mã nguồn có thêm Greedy Best-First Search. Thuật toán này sắp xếp open set theo heuristic `h(n)` đến đích, không cộng chi phí đã đi `g(n)`. Nó có thể tìm nhanh trong một số trường hợp, nhưng dễ bị đánh lừa bởi chướng ngại vật và không đảm bảo đường ngắn nhất.

## 6. Luồng Hoạt Động Của Ứng Dụng

Một vòng mô phỏng diễn ra như sau:

1. UI gọi `simulator.step()` hoặc interval từ `simulator.run()`.
2. Simulator lấy state hiện tại từ Environment.
3. Simulator gọi `algorithm.nextAction(state)`.
4. Thuật toán phân tích state, chọn mục tiêu và trả về hành động.
5. Simulator lưu state cũ để phục vụ undo.
6. Environment thực thi hành động bằng `applyAction`.
7. Environment cập nhật pin, sức chứa, vị trí, rác còn lại và điều kiện hoàn thành.
8. Simulator cập nhật metric và lịch sử vị trí.
9. Renderer vẽ lại bản đồ và các thông số lên giao diện.

Thiết kế này đảm bảo thuật toán không sửa trực tiếp trạng thái mô phỏng. Mọi thay đổi thật đều đi qua Environment, giúp logic tập trung và dễ kiểm thử.

## 7. Giao Diện Người Dùng

Giao diện chính nằm trong `index.html`, `style.css`, `js/main.js` và `js/render.js`.

### 7.1. Màn Hình Mô Phỏng

Màn hình gồm:

- Bản đồ lưới có tọa độ.
- Chú giải cho các loại ô.
- Bảng điều khiển chọn thuật toán.
- Nút sinh bản đồ, reset, next, previous, run, pause.
- Điều khiển tốc độ 1x, 2x, 3x, 5x.
- Bảng trạng thái robot: pin, sức chứa, vị trí, số bước, done.
- Bảng hành động: hành động vừa thực hiện, hành động tiếp theo, log mới nhất.

### 7.2. Map Editor

Map Editor cho phép người dùng thay đổi bản đồ khi mô phỏng đang tạm dừng:

- Inspect ô bất kỳ.
- Làm trống ô.
- Đặt rác.
- Đặt chướng ngại vật.
- Di chuyển trạm sạc.
- Di chuyển thùng rác.
- Di chuyển vị trí xuất phát của robot.

Sau mỗi thay đổi, project lưu trạng thái hiện tại làm initial state mới để các lần reset/chạy lại dùng đúng bản đồ vừa sửa.

### 7.3. Panel So Sánh

Nút "Compare 7 algorithms" mở panel chạy các thuật toán trên cùng một bản đồ ban đầu. Mỗi card có grid nhỏ và các chỉ số riêng. Chức năng `Final` cho phép chạy nhanh đến khi hoàn thành hoặc đạt giới hạn số bước, giúp người dùng lấy kết quả cuối cùng thay vì phải đợi render từng bước.

## 8. Lưu Trữ Và API

Server trong `server.js` vừa phục vụ file tĩnh, vừa cung cấp API quản lý bản đồ.

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/maps` | Liệt kê các bản đồ đã lưu |
| `POST` | `/api/maps` | Lưu bản đồ theo tên |
| `GET` | `/api/maps/:name` | Tải một bản đồ |
| `DELETE` | `/api/maps/:name` | Xóa một bản đồ |

Server có xử lý:

- Giới hạn kích thước request JSON tối đa 2 MB.
- Kiểm tra đường dẫn khi phục vụ static file để tránh truy cập ra ngoài thư mục project.
- Chuẩn hóa tên map, giới hạn tối đa 60 ký tự.
- Ghi file thông qua file tạm rồi rename để giảm nguy cơ hỏng file khi đang ghi.

## 9. Kiểm Thử

Project sử dụng test tự động với `node --test`. Lệnh test trong `package.json`:

```bash
npm run test
```

Trong môi trường Windows PowerShell, có thể cần chạy:

```bash
npm.cmd run test
```

Kết quả kiểm thử thực tế tại thời điểm lập báo cáo:

```text
tests 28
pass 28
fail 0
duration_ms 167.7345
```

### 9.1. Các Nhóm Test Chính

| Nhóm test | Nội dung |
| --- | --- |
| Environment | Cấu hình mặc định, sinh rác, sửa bản đồ, sinh bản đồ liên thông, chặn di chuyển sai, hút/đổ/sạc |
| Simulator | Lưu lịch sử vị trí và giới hạn slice lịch sử |
| DFS | Giữ committed route, hoàn thành nhiệm vụ đơn giản, đường hợp lệ nhưng không đảm bảo ngắn nhất |
| IDS | Tìm đường theo tầng độ sâu, chọn rác an toàn về pin, hoàn thành nhiệm vụ |
| Dijkstra | Tìm đường ngắn nhất quanh chướng ngại vật |
| Greedy | Ưu tiên ô ít thăm, tránh quay lui, tránh dao động, kiểm tra dự trữ pin |
| Greedy Best-First | Tìm đường hợp lệ đến đích |
| Map storage | Lưu/tải/xóa map, xử lý server không sẵn sàng |
| Current target | Thuật toán expose và reset mục tiêu hiện tại |

### 9.2. Kết Quả Test Và So Sánh Các Thuật Toán

Chi tiết các bước chạy test được mô tả trong file `TEST_GUIDE.md`. Phần này dùng để ghi kết quả thực nghiệm sau khi chạy test tự động và chạy panel `Compare 7 algorithms` trên cùng một bản đồ đầu vào.

#### 9.2.1. Kết Quả Test Tự Động

**Cách chạy:**

```bash
npm.cmd run test
```

Hoặc:

```bash
npm run test
```

**Kết quả cần điền sau khi chạy:**

| Chỉ số | Kết quả |
| --- | --- |
| Tổng số test | [điền số `tests`] |
| Số test pass | [điền số `pass`] |
| Số test fail | [điền số `fail`] |
| Thời gian chạy | [điền `duration_ms`] |

**Nhận xét:** [điền nhận xét ngắn, ví dụ: toàn bộ test pass, các module Environment/Simulator/thuật toán/lưu map hoạt động đúng theo các trường hợp đã kiểm thử.]

#### 9.2.2. Đầu Vào Test So Sánh Thuật Toán

Sử dụng map demo cố định để đảm bảo các thuật toán được so sánh công bằng trên cùng một trạng thái ban đầu.

| Thành phần | Giá trị |
| --- | --- |
| Kích thước bản đồ | 10 x 10 |
| Vị trí robot ban đầu | A1 |
| Trạm sạc | A1 |
| Thùng rác | J10 |
| Pin tối đa | 100 |
| Hao pin mỗi bước | 1 |
| Sức chứa rác tối đa | 3 |
| Vị trí rác | A5, E1, J1, J5, E10, J10 |
| Vị trí chướng ngại vật | B2, C2, D2, F2, G2, H2, I2, D3, F3, I3, B4, D4, F4, G4, I4, B5, D5, G5, I5, B6, D6, F6, G6, I6, B7, F7, I7, B8, C8, D8, F8, H8, I8, D9, F9 |

#### 9.2.3. Quy Trình Hoạt Động Khi Test

1. Chạy server bằng `npm start` hoặc `npm.cmd start`.
2. Mở `http://localhost:3000`.
3. Bấm `Load demo` để nạp map 10x10 cố định.
4. Bấm `Compare 7 algorithms`.
5. Bấm `Final` để các thuật toán chạy nhanh đến trạng thái cuối hoặc đến giới hạn bước.
6. Ghi lại các chỉ số hiển thị trong từng card thuật toán.

Trong quá trình chạy, mỗi thuật toán nhận cùng một bản đồ ban đầu nhưng chạy trên một `Environment` độc lập. Simulator gọi `nextAction(state)` của từng thuật toán, sau đó `Environment.applyAction(action)` cập nhật trạng thái robot, pin, rác còn lại, sức chứa và điều kiện hoàn thành. Vì vậy kết quả so sánh phản ánh khác biệt trong chiến lược tìm kiếm/chọn hành động của từng thuật toán.

#### 9.2.4. Kết Quả So Sánh

| Thuật toán | Status | Steps | Visited nodes | Runtime ms | Battery used | Memory | Nhận xét ngắn |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| BFS | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] |
| DFS | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] |
| IDS | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] |
| A* | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] |
| IDA* | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] |
| Dijkstra | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] |
| Greedy | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [điền] |

#### 9.2.5. So Sánh Và Nhận Xét

**Về khả năng hoàn thành:** [điền thuật toán nào `Done`, thuật toán nào `Stopped` nếu có. Thuật toán hoàn thành nhiệm vụ là thuật toán thu gom hết rác, đổ rác và quay về trạm sạc.]

**Về số bước và năng lượng:** [điền thuật toán có `Steps` và `Battery used` thấp nhất/cao nhất. Ít bước và ít pin hơn cho thấy hành trình hiệu quả hơn.]

**Về số node đã duyệt:** [điền thuật toán có `Visited nodes` thấp nhất/cao nhất. Chỉ số này phản ánh lượng không gian trạng thái mà thuật toán phải xét.]

**Về thời gian chạy:** [điền thuật toán có `Runtime ms` thấp nhất/cao nhất. Runtime có thể dao động theo máy, trình duyệt và trạng thái tab, nên nên dùng như chỉ số tham khảo.]

**Về bộ nhớ:** [điền thuật toán có `Memory` thấp nhất/cao nhất. Thuật toán dùng ít bộ nhớ phù hợp hơn khi bản đồ lớn hoặc không gian trạng thái rộng.]

**Nhận xét tổng hợp:** [điền 3-5 câu kết luận. Có thể nhận xét rằng BFS/Dijkstra ổn định trên bản đồ chi phí đồng nhất; A*/IDA* tận dụng heuristic Manhattan để định hướng tìm kiếm; DFS/IDS minh họa chiến lược tìm kiếm theo chiều sâu; Greedy nhanh nhưng phụ thuộc quyết định cục bộ và không đảm bảo tối ưu.]

## 10. Hướng Dẫn Chạy Project

### 10.1. Yêu Cầu

- Cài đặt Node.js.
- Mở terminal tại thư mục project.

### 10.2. Chạy Ứng Dụng

```bash
npm start
```

Sau đó mở trình duyệt tại:

```text
http://localhost:3000
```

### 10.3. Chạy Test

```bash
npm.cmd run test
```

Nếu dùng terminal không bị chặn script PowerShell, có thể chạy:

```bash
npm run test
```

## 11. Đánh Giá Kết Quả

Project đã đạt được các mục tiêu chính:

- Có mô phỏng robot dọn rác trên bản đồ lưới.
- Có nhiều thuật toán AI/tìm kiếm để lựa chọn và so sánh.
- Có ràng buộc thực tế về pin, sức chứa rác, trạm sạc và thùng rác.
- Có giao diện trực quan để quan sát từng bước.
- Có công cụ sửa bản đồ và lưu/tải bản đồ.
- Có metric phục vụ so sánh thuật toán.
- Có test tự động bao phủ các module quan trọng.

Về mặt học thuật, project minh họa được sự khác nhau giữa các nhóm thuật toán:

- BFS và Dijkstra ưu tiên tính tối ưu theo chi phí đường đi trong bài toán không trọng số.
- DFS thể hiện chiến lược tìm sâu, có thể nhanh trong một số trường hợp nhưng không tối ưu.
- IDS cải thiện tính đầy đủ của DFS bằng cách tăng dần độ sâu.
- A* và IDA* dùng heuristic để định hướng tìm kiếm.
- Greedy ra quyết định nhanh, phụ thuộc vào heuristic và có thể không tối ưu.

## 12. Hạn Chế Và Hướng Phát Triển

### 12.1. Hạn Chế

- Chi phí di chuyển hiện tại gần như đồng nhất, nên Dijkstra chưa thể hiện hết ưu điểm so với BFS.
- Robot chỉ đi bốn hướng, chưa hỗ trợ đi chéo.
- Môi trường chưa có vật cản động hoặc rác sinh theo kịch bản phức tạp.
- Greedy phụ thuộc vào hàm điểm cục bộ nên có thể không tối ưu trên bản đồ khó.
- Phần so sánh hiện tại phụ thuộc vào metric ước lượng trong quá trình chạy, chưa có bảng export kết quả riêng.

### 12.2. Hướng Phát Triển

- Bổ sung trọng số khác nhau cho từng loại địa hình để Dijkstra/A* có ý nghĩa rõ hơn.
- Thêm chế độ xuất kết quả so sánh ra CSV hoặc JSON.
- Thêm biểu đồ so sánh runtime, visited nodes, battery consumed.
- Thêm các kịch bản benchmark cố định để đánh giá thuật toán công bằng hơn.
- Cải thiện priority queue cho A* và Dijkstra để tăng hiệu năng với bản đồ lớn.
- Bổ sung unit test cho A*, IDA* và panel compare ở mức cao hơn.

## 13. Phân Công Công Việc

Bảng phân công dưới đây được hoàn thiện từ phần phân công ban đầu và đối chiếu với cấu trúc mã nguồn hiện tại của project.

| Thành viên | Mã sinh viên | Công việc chính | Mô tả chi tiết |
| --- | --- | --- | --- |
| Bùi Tuấn Anh | - | Thiết kế thuật toán BFS và IDA*; tích hợp thuật toán | Nghiên cứu và triển khai BFS để tìm đường ngắn nhất trên bản đồ không trọng số; xây dựng logic chọn mục tiêu gồm rác, thùng rác và trạm sạc; bổ sung kiểm tra pin an toàn khi chọn mục tiêu; triển khai IDA* với heuristic Manhattan và cơ chế tăng ngưỡng `f = g + h`; tham gia tích hợp thuật toán vào `algorithmRegistry` và đồng bộ với simulator/UI. |
| Lê Thành An | 20235631 | Thiết kế thuật toán Greedy; xây dựng hạ tầng dùng chung `BaseAlgorithm`; render UI | Triển khai Greedy dựa trên khoảng cách Manhattan, số lần ghé thăm và penalty quay lui; bổ sung logic dự trữ pin để robot có thể quay về trạm sạc; thiết kế `BaseAlgorithm` làm lớp nền cho các thuật toán, gồm metric, trace, target, tiện ích Manhattan và kiểm tra di chuyển; phát triển `Renderer` để vẽ grid, icon, tọa độ, trạng thái robot, hành động tiếp theo và current target lên giao diện. |
| Nguyễn Hoàng Long | 20235771 | Thiết kế thuật toán A* và Dijkstra; thiết kế Simulator Core | Triển khai A* với hàm `f(n) = g(n) + h(n)` và heuristic Manhattan; triển khai Dijkstra dựa trên chi phí tích lũy và open set; xây dựng `Simulator` làm bộ điều phối vòng lặp mô phỏng, gồm step/run/stop/reset/undo, cache next action, lịch sử vị trí, metric của thuật toán và callback cập nhật UI; đảm bảo thuật toán không sửa trực tiếp state mà thông qua Environment. |
| Trịnh Văn Minh | 20235787 | Thiết kế thuật toán DFS và IDS; thiết kế Environment | Triển khai DFS bằng stack LIFO và committed route để hạn chế dao động; triển khai IDS bằng depth-limited search với giới hạn tăng dần; xây dựng `Environment` quản lý luật của thế giới mô phỏng: tạo bản đồ, đảm bảo liên thông, thực thi hành động, quản lý pin/sức chứa, hút rác, đổ rác, sạc pin, chỉnh sửa bản đồ, spawn rác và xác định trạng thái hoàn thành. |

### 13.1. Công Việc Chung Của Nhóm

Ngoài các phần việc cá nhân, nhóm cùng thực hiện:

- Thống nhất mô hình dữ liệu `Robot`, `CleanerMap`, `SimulationState`.
- Thống nhất tập hành động robot và điều kiện hoàn thành.
- Tích hợp các thuật toán vào cùng một giao diện.
- Kiểm tra các trường hợp lỗi: đi ra ngoài bản đồ, gặp chướng ngại vật, hết pin, túi rác đầy, không ở đúng trạm/thùng.
- Viết test tự động cho các module quan trọng.
- Chuẩn bị demo map và giao diện so sánh thuật toán.

## 14. Kết Luận

CleanerBot AI Simulator là project mô phỏng có tính ứng dụng tốt cho môn Trí tuệ nhân tạo. Project không chỉ cài đặt riêng lẻ các thuật toán tìm kiếm, mà còn đặt chúng vào một bài toán có ràng buộc thực tế: pin, sức chứa, chướng ngại vật, rác, trạm sạc và thùng rác.

Thông qua ứng dụng, người học có thể quan sát trực tiếp cách robot ra quyết định, cách các thuật toán khác nhau duyệt không gian trạng thái và sự đánh đổi giữa tính tối ưu, tốc độ, bộ nhớ và khả năng định hướng bằng heuristic. Đây là nền tảng tốt để tiếp tục mở rộng sang các bài toán lập kế hoạch, tối ưu lộ trình và tác nhân tự hành trong môi trường phức tạp hơn.

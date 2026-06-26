<!-- Trang bìa được trình bày riêng trong bản in/slide -->

- [BÁO CÁO PROJECT: CLEANERBOT AI SIMULATOR](#báo-cáo-project-cleanerbot-ai-simulator)
  - [1. Thông Tin Chung](#1-thông-tin-chung)
  - [2. Phân Công Công Việc](#2-phân-công-công-việc)
    - [2.1. Bảng Phân Công](#21-bảng-phân-công)
    - [2.2. Công Việc Chung Của Nhóm](#22-công-việc-chung-của-nhóm)
  - [3. Mô Tả Bài Toán](#3-mô-tả-bài-toán)
    - [3.1. Các Thành Phần Trong Môi Trường](#31-các-thành-phần-trong-môi-trường)
    - [3.2. Tập Hành Động Của Robot](#32-tập-hành-động-của-robot)
    - [3.3. Ràng Buộc Bài Toán](#33-ràng-buộc-bài-toán)
  - [4. Các Chức Năng Đã Xây Dựng](#4-các-chức-năng-đã-xây-dựng)
    - [4.1. Mô Phỏng Robot Trên Bản Đồ Lưới](#41-mô-phỏng-robot-trên-bản-đồ-lưới)
    - [4.2. Tùy Chỉnh Bản Đồ Và Tham Số](#42-tùy-chỉnh-bản-đồ-và-tham-số)
    - [4.3. Lưu Và Tải Bản Đồ](#43-lưu-và-tải-bản-đồ)
    - [4.4. So Sánh Thuật Toán](#44-so-sánh-thuật-toán)
  - [5. Các Thuật Toán Đã Triển Khai](#5-các-thuật-toán-đã-triển-khai)
    - [5.1. BFS - Breadth-First Search](#51-bfs---breadth-first-search)
    - [5.2. DFS - Depth-First Search](#52-dfs---depth-first-search)
    - [5.3. IDS - Iterative Deepening Search](#53-ids---iterative-deepening-search)
    - [5.4. Dijkstra](#54-dijkstra)
    - [5.5. A* Search](#55-a-search)
    - [5.6. IDA* - Iterative Deepening A*](#56-ida---iterative-deepening-a)
    - [5.7. Greedy](#57-greedy)
  - [6. So Sánh Các Thuật Toán](#6-so-sánh-các-thuật-toán)
    - [6.1. Đầu Vào Test So Sánh](#61-đầu-vào-test-so-sánh)
    - [6.2. Quy Trình Chạy So Sánh](#62-quy-trình-chạy-so-sánh)
    - [6.3. Kết Quả So Sánh](#63-kết-quả-so-sánh)
    - [6.4. Nhận Xét Và Phân Tích](#64-nhận-xét-và-phân-tích)
    - [6.5. Bảng Ưu Nhược Điểm](#65-bảng-ưu-nhược-điểm)
  - [7. Xây Dựng Hệ Thống](#7-xây-dựng-hệ-thống)
    - [7.1. Cấu Trúc Tổng Thể](#71-cấu-trúc-tổng-thể)
    - [7.2. Lớp Dữ Liệu Cốt Lõi](#72-lớp-dữ-liệu-cốt-lõi)
    - [7.3. Module Môi Trường](#73-module-môi-trường)
    - [7.4. Module Simulator](#74-module-simulator)
    - [7.5. Lớp Cơ Sở Thuật Toán](#75-lớp-cơ-sở-thuật-toán)
    - [7.6. Luồng Hoạt Động](#76-luồng-hoạt-động)
    - [7.7. Giao Diện Người Dùng](#77-giao-diện-người-dùng)
    - [7.8. Lưu Trữ Và API](#78-lưu-trữ-và-api)
  - [8. Kiểm Thử](#8-kiểm-thử)
    - [8.1. Các Nhóm Test Chính](#81-các-nhóm-test-chính)
    - [8.2. Kết Quả Kiểm Thử Tự Động](#82-kết-quả-kiểm-thử-tự-động)
  - [9. Đánh Giá](#9-đánh-giá)
    - [9.1. Kết Quả Đạt Được](#91-kết-quả-đạt-được)
    - [9.2. Hạn Chế](#92-hạn-chế)
    - [9.3. Hướng Phát Triển](#93-hướng-phát-triển)
  - [10. Kết Luận](#10-kết-luận)



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
| Lưu trữ dữ liệu | File JSON |
| Kiểm thử | Node.js test runner tích hợp |

---

## 2. Phân Công Công Việc

### 2.1. Bảng Phân Công

| Thành viên | Mã sinh viên | Công việc chính | Mô tả chi tiết |
| --- | --- | --- | --- |
| Bùi Tuấn Anh | - | Thiết kế thuật toán BFS và IDA\*; tích hợp thuật toán | Nghiên cứu và triển khai BFS để tìm đường ngắn nhất trên bản đồ không trọng số; xây dựng logic chọn mục tiêu gồm rác, thùng rác và trạm sạc; bổ sung kiểm tra pin an toàn khi chọn mục tiêu; triển khai IDA\* với heuristic Manhattan và cơ chế tăng ngưỡng f = g + h; tham gia tích hợp thuật toán vào registry và đồng bộ với simulator/UI. |
| Lê Thành An | 20235631 | Thiết kế thuật toán Greedy; xây dựng hạ tầng dùng chung BaseAlgorithm; render UI | Triển khai Greedy dựa trên khoảng cách Manhattan, số lần ghé thăm và penalty quay lui; bổ sung logic dự trữ pin để robot có thể quay về trạm sạc; thiết kế lớp cơ sở BaseAlgorithm làm nền cho các thuật toán, gồm metric, trace, target, tiện ích Manhattan và kiểm tra di chuyển; phát triển Renderer để vẽ grid, icon, tọa độ, trạng thái robot, hành động tiếp theo và mục tiêu hiện tại lên giao diện. |
| Nguyễn Hoàng Long | 20235771 | Thiết kế thuật toán A\* và Dijkstra; thiết kế Simulator Core | Triển khai A\* với hàm f(n) = g(n) + h(n) và heuristic Manhattan; triển khai Dijkstra dựa trên chi phí tích lũy và open set; xây dựng Simulator làm bộ điều phối vòng lặp mô phỏng, gồm step/run/stop/reset/undo, cache hành động tiếp theo, lịch sử vị trí, metric của thuật toán và callback cập nhật UI; đảm bảo thuật toán không sửa trực tiếp state mà thông qua Environment. |
| Trịnh Văn Minh | 20235787 | Thiết kế thuật toán DFS và IDS; thiết kế Environment | Triển khai DFS bằng ngăn xếp LIFO và committed route để hạn chế dao động; triển khai IDS bằng tìm kiếm theo độ sâu có giới hạn tăng dần; xây dựng Environment quản lý luật của thế giới mô phỏng: tạo bản đồ, đảm bảo liên thông, thực thi hành động, quản lý pin/sức chứa, hút rác, đổ rác, sạc pin, chỉnh sửa bản đồ, sinh rác và xác định trạng thái hoàn thành. |

### 2.2. Công Việc Chung Của Nhóm

Ngoài các phần việc cá nhân, nhóm cùng thực hiện:

- Thống nhất mô hình dữ liệu Robot, CleanerMap, SimulationState.
- Thống nhất tập hành động robot và điều kiện hoàn thành.
- Tích hợp các thuật toán vào cùng một giao diện.
- Kiểm tra các trường hợp lỗi: đi ra ngoài bản đồ, gặp chướng ngại vật, hết pin, túi rác đầy, không ở đúng trạm/thùng.
- Viết test tự động cho các module quan trọng.
- Chuẩn bị demo map và giao diện so sánh thuật toán.

---

## 3. Mô Tả Bài Toán

Project mô phỏng một robot dọn rác hoạt động trong môi trường dạng lưới hai chiều. Mỗi ô trên bản đồ có thể là ô trống, rác, chướng ngại vật, trạm sạc, thùng rác hoặc vị trí hiện tại của robot. Robot cần lập kế hoạch di chuyển qua các ô hợp lệ, hút rác, đổ rác vào thùng rác và quay về trạm sạc sau khi hoàn thành nhiệm vụ.

### 3.1. Các Thành Phần Trong Môi Trường

| Thành phần | Ý nghĩa |
| --- | --- |
| Robot | Tác nhân chính cần lập kế hoạch và thực hiện hành động |
| Trash (Rác) | Rác cần thu gom, xuất hiện ngẫu nhiên trên bản đồ |
| Obstacle (Tường) | Chướng ngại vật, robot không được đi qua |
| Charging Station (Trạm sạc) | Nơi robot nạp đầy pin |
| Trash Can (Thùng rác) | Nơi robot đổ rác đã thu gom |
| Grid Map (Bản đồ lưới) | Không gian hoạt động dạng lưới có kích thước tùy chỉnh |

### 3.2. Tập Hành Động Của Robot

| Hành động | Mô tả |
| --- | --- |
| Lên / Xuống / Trái / Phải | Di chuyển robot một ô theo hướng tương ứng |
| Hút rác | Thu gom rác tại ô robot đang đứng |
| Đổ rác | Trút rác vào thùng khi robot đứng tại thùng rác |
| Sạc pin | Nạp đầy pin khi robot đứng tại trạm sạc |
| Đứng yên | Không làm gì trong bước hiện tại |

### 3.3. Ràng Buộc Bài Toán

Robot chỉ được di chuyển trong phạm vi bản đồ và không được đi xuyên qua chướng ngại vật. Mỗi bước di chuyển làm giảm pin theo mức hao pin cấu hình. Hành động hút rác và đổ rác cũng tiêu hao một lượng pin nhỏ. Robot có giới hạn sức chứa, khi túi rác đầy phải đi đến thùng rác đổ trước khi tiếp tục thu gom.

**Điều kiện hoàn thành mô phỏng** — cả ba điều kiện phải đồng thời đúng:

1. Không còn rác nào trên bản đồ.
2. Túi rác của robot rỗng.
3. Robot đang đứng tại trạm sạc.

---

## 4. Các Chức Năng Đã Xây Dựng

### 4.1. Mô Phỏng Robot Trên Bản Đồ Lưới

Ứng dụng hiển thị bản đồ lưới trực quan với tọa độ hàng/cột và biểu tượng riêng cho từng loại ô. Người dùng có thể chạy từng bước, chạy tự động, tạm dừng, quay lại bước trước và reset bản đồ. Ô mục tiêu hiện tại của thuật toán được highlight để quan sát chiến lược tìm kiếm.

### 4.2. Tùy Chỉnh Bản Đồ Và Tham Số

Người dùng có thể cấu hình chiều rộng/chiều cao bản đồ, số lượng rác, số lượng chướng ngại vật, sức chứa rác tối đa, dung lượng pin tối đa và mức hao pin mỗi bước.

Ngoài sinh bản đồ ngẫu nhiên, ứng dụng hỗ trợ chỉnh sửa trực tiếp trên lưới: thêm/xóa rác, thêm/xóa chướng ngại vật, đổi vị trí trạm sạc, đổi vị trí thùng rác, đổi vị trí xuất phát của robot và sinh thêm rác khi mô phỏng đang tạm dừng.

### 4.3. Lưu Và Tải Bản Đồ

Project hỗ trợ lưu bản đồ theo tên, tải lại bản đồ đã lưu và xóa bản đồ. Dữ liệu được lưu trên server dưới dạng file JSON. Nếu server không chạy, ứng dụng thông báo rõ và người dùng vẫn có thể dùng bản đồ ngẫu nhiên hoặc bản đồ demo.

### 4.4. So Sánh Thuật Toán

Ứng dụng có panel so sánh chạy đồng thời bảy thuật toán trên cùng một bản đồ ban đầu. Mỗi thuật toán chạy trên một môi trường riêng biệt để đảm bảo công bằng. Giao diện so sánh hiển thị số bước, số nút đã duyệt, thời gian chạy, năng lượng tiêu thụ, bộ nhớ đỉnh ước lượng và trạng thái hoàn thành.

Chế độ **Final** cho phép chạy nhanh đến kết quả cuối mà không cần render từng bước, giúp lấy số liệu so sánh nhanh hơn.

---

## 5. Các Thuật Toán Đã Triển Khai

Mỗi thuật toán trong project không chỉ đảm nhận việc tìm đường mà còn phải xử lý toàn bộ logic điều phối nhiệm vụ của robot: quyết định khi nào hút rác, khi nào đổ rác, khi nào sạc pin, và quan trọng nhất là đảm bảo robot không bao giờ hết pin giữa đường. Phần logic chung này được chia sẻ qua một lớp cơ sở, các thuật toán chỉ cần thay thế chiến lược tìm đường của riêng mình.

Trước khi chọn bất kỳ mục tiêu nào, hầu hết thuật toán đều thực hiện kiểm tra an toàn pin: ước tính tổng pin cần thiết để đến mục tiêu, thực hiện hành động tại đó, rồi di chuyển đến điểm thoát an toàn tiếp theo. Nếu không đủ pin, robot ưu tiên về trạm sạc trước.

---

### 5.1. BFS - Breadth-First Search

#### Tổng quan lý thuyết

BFS (Tìm kiếm theo chiều rộng) duyệt đồ thị theo từng lớp, sử dụng hàng đợi FIFO. Thuật toán khám phá tất cả các ô cách điểm xuất phát một bước trước khi tiến sang hai bước, rồi ba bước, và cứ thế tiếp tục. Trong môi trường có chi phí di chuyển đồng nhất, BFS đảm bảo tìm được đường đi ngắn nhất theo số bước.

| Đặc điểm | Giá trị |
| --- | --- |
| Tính đầy đủ | Có — luôn tìm được lời giải nếu tồn tại |
| Tính tối ưu | Có — đường ngắn nhất theo số bước |
| Độ phức tạp thời gian | O(b^d) với b là số nhánh, d là độ sâu lời giải |
| Độ phức tạp không gian | O(b^d) — cần lưu toàn bộ frontier |
| Heuristic | Không sử dụng |

#### Cách triển khai trong project

Tại mỗi bước, robot xét theo thứ tự ưu tiên cứng: đổ rác nếu đang ở thùng rác và mang theo rác; sạc pin nếu đang ở trạm và cần sạc; hút rác nếu đang đứng trên rác và túi chưa đầy. Nếu không có hành động tức thì nào phù hợp, thuật toán chọn mục tiêu tiếp theo rồi tìm đường đến đó bằng BFS.

Để tránh tính lại không cần thiết, đường đi đã tìm được lưu vào bộ nhớ đệm và dùng lại miễn là bản đồ chưa thay đổi. Ngoài ra, thuật toán theo dõi vị trí gần đây của robot; nếu phát hiện robot đang dao động qua lại giữa hai ô, nó sẽ tìm lại đường với ràng buộc tránh bước đầu tiên về ô vừa rời.

#### Mã giả

```
THUẬT TOÁN BFS — QUYẾT ĐỊNH BƯỚC TIẾP THEO(trạng_thái):
  // Kiểm tra hành động tức thì theo thứ tự ưu tiên
  NẾU đang_ở_thùng_rác VÀ có_rác_trong_túi:
    TRẢ VỀ đổ_rác
  NẾU đang_ở_trạm_sạc VÀ cần_sạc:
    TRẢ VỀ sạc_pin
  NẾU đứng_trên_rác VÀ túi_chưa_đầy:
    TRẢ VỀ hút_rác

  // Chọn mục tiêu và tìm đường
  mục_tiêu ← CHỌN_MỤC_TIÊU(trạng_thái)
  đường_đi ← TÌM_ĐƯỜNG(vị_trí_robot, mục_tiêu)

  NẾU phát_hiện_dao_động_giữa_hai_ô:
    đường_đi ← TÌM_ĐƯỜNG(vị_trí_robot, mục_tiêu, tránh_ô_vừa_rời)

  TRẢ VỀ hành_động_theo_bước_đầu_của(đường_đi)

THUẬT TOÁN CHỌN_MỤC_TIÊU(trạng_thái):
  NẾU túi_đầy HOẶC (không_còn_rác_trên_bản_đồ VÀ có_rác_trong_túi):
    NẾU đủ_pin_đến_thùng_rác: TRẢ VỀ thùng_rác
    KHÔNG THÌ:                 TRẢ VỀ trạm_sạc
  NẾU còn_rác VÀ túi_chưa_đầy:
    TRẢ VỀ rác_gần_nhất_đủ_pin_an_toàn(trạng_thái)
  TRẢ VỀ trạm_sạc

THUẬT TOÁN TÌM_ĐƯỜNG_BFS(điểm_đầu, đích):
  hàng_đợi ← [điểm_đầu]                // FIFO
  đã_thăm  ← {điểm_đầu}
  TRONG KHI hàng_đợi không_rỗng:
    ô_hiện_tại ← hàng_đợi.lấy_đầu()   // luôn lấy phần tử vào trước
    NẾU ô_hiện_tại == đích:
      TRẢ VỀ đường_đi_ngược_lại
    VỚI MỖI ô_kề của ô_hiện_tại:
      NẾU ô_kề chưa_thăm VÀ có_thể_đi_qua:
        hàng_đợi.thêm_vào_cuối(ô_kề)
        đã_thăm.thêm(ô_kề)
  TRẢ VỀ không_có_đường

THUẬT TOÁN KIỂM_TRA_PIN_AN_TOÀN(mục_tiêu):
  // Tổng pin cần = đến mục tiêu + hành động + về điểm an toàn tiếp theo
  pin_cần  ← độ_dài(đường_đến_mục_tiêu) × hao_pin_mỗi_bước
  pin_cần += chi_phí_hành_động_tại_mục_tiêu
  pin_cần += độ_dài(đường_từ_mục_tiêu_về_an_toàn) × hao_pin_mỗi_bước
  TRẢ VỀ pin_hiện_tại >= pin_cần
```

---

### 5.2. DFS - Depth-First Search

#### Tổng quan lý thuyết

DFS (Tìm kiếm theo chiều sâu) ưu tiên đi sâu vào một nhánh cho đến khi gặp ngõ cụt hoặc tìm được mục tiêu, rồi mới quay lui để thử nhánh khác. DFS sử dụng ngăn xếp LIFO thay vì hàng đợi, dẫn đến hành vi duyệt hoàn toàn khác BFS.

| Đặc điểm | Giá trị |
| --- | --- |
| Tính đầy đủ | Có — trên đồ thị hữu hạn khi kiểm soát nút đã thăm |
| Tính tối ưu | Không — đường tìm được có thể không ngắn nhất |
| Độ phức tạp thời gian | O(b^m) với m là độ sâu tối đa |
| Độ phức tạp không gian | O(b·m) — chỉ lưu nhánh hiện tại, tốt hơn BFS |
| Heuristic | Không sử dụng |

#### Cách triển khai trong project

DFS kế thừa toàn bộ logic ưu tiên hành động và chọn mục tiêu từ BFS, chỉ thay phần tìm đường bằng ngăn xếp LIFO. Điểm khác biệt quan trọng nhất là cơ chế **"committed route"**: khi đã tìm và chọn được một đường đi hợp lệ đến mục tiêu, robot kiên trì đi theo đường đó cho đến khi hoàn thành hoặc đường không còn hợp lệ. Cơ chế này giúp tránh hiện tượng robot đổi quyết định liên tục mỗi bước — vốn rất dễ xảy ra với DFS do thứ tự duyệt không nhất quán.

Bộ nhớ đệm đường dài hạn bị vô hiệu hóa để đảm bảo mỗi lần cần đường mới, thuật toán thực sự chạy lại từ đầu, phản ánh đúng bản chất DFS.

#### Mã giả

```
THUẬT TOÁN DFS — QUYẾT ĐỊNH BƯỚC TIẾP THEO(trạng_thái):
  // Ưu tiên committed route: nếu đang có đường hợp lệ thì tiếp tục đi
  mục_tiêu_cũ ← LẤY_MỤC_TIÊU_ĐANG_THEO(trạng_thái)
  NẾU mục_tiêu_cũ hợp_lệ:
    TRẢ VỀ bước_tiếp_theo_trên_đường_cũ

  // Nếu không có đường đang theo, dùng lại logic chọn mục tiêu của BFS
  [giống BFS — xét ưu tiên hành động tức thì, chọn mục tiêu, tìm đường]
  // Chỉ khác: tìm đường bằng DFS thay vì BFS

THUẬT TOÁN TÌM_ĐƯỜNG_DFS(điểm_đầu, đích):
  ngăn_xếp ← [điểm_đầu]              // LIFO
  đã_thăm  ← {điểm_đầu}
  TRONG KHI ngăn_xếp không_rỗng:
    ô_hiện_tại ← ngăn_xếp.lấy_đỉnh() // luôn lấy phần tử vào sau
    NẾU ô_hiện_tại == đích:
      TRẢ VỀ đường_đi_ngược_lại
    // Push ngược thứ tự để pop ra theo UP → RIGHT → DOWN → LEFT
    VỚI MỖI ô_kề theo thứ tự ngược:
      NẾU ô_kề chưa_thăm VÀ có_thể_đi_qua:
        ngăn_xếp.push(ô_kề)
        đã_thăm.thêm(ô_kề)
  TRẢ VỀ không_có_đường

THUẬT TOÁN LẤY_MỤC_TIÊU_ĐANG_THEO(trạng_thái):
  NẾU không có đường đang lưu HOẶC đường ngắn hơn 2 bước:
    TRẢ VỀ không_có
  mục_tiêu ← ô cuối cùng của đường đang lưu
  NẾU mục_tiêu không còn hợp lệ (rác đã bị lấy, túi đầy, ...):
    xóa đường đang lưu
    TRẢ VỀ không_có
  TRẢ VỀ mục_tiêu
```

---

### 5.3. IDS - Iterative Deepening Search

#### Tổng quan lý thuyết

IDS (Tìm kiếm sâu dần) kết hợp ưu điểm của cả BFS và DFS: thực hiện DFS có giới hạn độ sâu, bắt đầu từ độ sâu 0 và tăng dần cho đến khi tìm thấy mục tiêu. Kết quả là IDS tìm được lời giải nông nhất (ngắn nhất theo số bước) như BFS, nhưng chỉ tốn bộ nhớ tương đương DFS.

| Đặc điểm | Giá trị |
| --- | --- |
| Tính đầy đủ | Có |
| Tính tối ưu | Có — tìm được đường ngắn nhất như BFS |
| Độ phức tạp thời gian | O(b^d) — tương đương BFS dù duyệt lại nhiều nút |
| Độ phức tạp không gian | O(b·d) — chỉ lưu đường đi hiện tại |
| Heuristic | Không sử dụng |

#### Cách triển khai trong project

IDS kế thừa từ DFS và thay phần tìm đường bằng vòng lặp tăng dần độ sâu. Thay vì dùng ngăn xếp tường minh, IDS dùng đệ quy với tham số độ sâu còn lại: mỗi lần đệ quy giảm đi 1, khi về 0 thì dừng nhánh đó.

Với việc tìm rác, IDS áp dụng thêm cơ chế **lọc an toàn pin**: nếu tìm được rác gần nhất nhưng không đủ pin xử lý an toàn, đánh dấu rác đó là bị loại và tiếp tục tìm rác kế tiếp theo thứ tự độ sâu — cho đến khi tìm được rác vừa gần vừa đủ pin, hoặc xác nhận không có rác nào đạt yêu cầu.

#### Mã giả

```
THUẬT TOÁN TÌM_ĐƯỜNG_IDS(điểm_đầu, đích):
  VỚI MỖI giới_hạn_độ_sâu TỪ 0 ĐẾN tổng_ô_đi_được:
    kết_quả ← DFS_CÓ_GIỚI_HẠN(điểm_đầu, đích, giới_hạn_độ_sâu)
    NẾU kết_quả tìm_thấy:
      TRẢ VỀ kết_quả       // dừng sớm — đây là đường ngắn nhất
  TRẢ VỀ không_có_đường

THUẬT TOÁN DFS_CÓ_GIỚI_HẠN(đường_đi_hiện_tại, đích, độ_sâu_còn_lại):
  ô_hiện_tại ← ô cuối của đường_đi_hiện_tại
  NẾU ô_hiện_tại == đích:
    TRẢ VỀ đường_đi_hiện_tại          // tìm thấy
  NẾU độ_sâu_còn_lại == 0:
    TRẢ VỀ không_tìm_thấy             // hết độ sâu, cắt nhánh
  VỚI MỖI ô_kề của ô_hiện_tại:
    NẾU ô_kề có_thể_đi_qua VÀ chưa_trong_đường_đi_hiện_tại:
      thêm ô_kề vào đường_đi_hiện_tại
      kết_quả ← DFS_CÓ_GIỚI_HẠN(đường_đi_hiện_tại, đích, độ_sâu_còn_lại - 1)
      NẾU kết_quả tìm_thấy: TRẢ VỀ kết_quả
      xóa ô_kề khỏi đường_đi_hiện_tại  // quay lui
  TRẢ VỀ không_tìm_thấy

THUẬT TOÁN TÌM_RÁC_AN_TOÀN_IDS(trạng_thái):
  tập_bị_loại ← rỗng
  TRONG KHI tập_bị_loại < tổng_số_rác:
    ứng_viên ← TÌM_RÁC_IDS(trạng_thái, bỏ_qua = tập_bị_loại)
    NẾU không_có ứng_viên: TRẢ VỀ không_có
    NẾU đủ_pin_an_toàn(ứng_viên): TRẢ VỀ ứng_viên
    tập_bị_loại.thêm(ứng_viên)        // loại, tìm rác khác
  TRẢ VỀ không_có
```

---

### 5.4. Dijkstra

#### Tổng quan lý thuyết

Thuật toán Dijkstra tìm đường đi chi phí nhỏ nhất từ một đỉnh nguồn trong đồ thị có trọng số không âm. Tại mỗi bước, Dijkstra chọn nút có tổng chi phí tích lũy thấp nhất trong tập đang xét để mở rộng tiếp theo — đây chính là chiến lược "tham lam trên chi phí thực".

| Đặc điểm | Giá trị |
| --- | --- |
| Tính đầy đủ | Có |
| Tính tối ưu | Có — đảm bảo chi phí nhỏ nhất khi trọng số không âm |
| Độ phức tạp thời gian | O((V + E) log V) với priority queue |
| Độ phức tạp không gian | O(V) — lưu chi phí tốt nhất đến mỗi nút |
| Heuristic | Không sử dụng |

#### Cách triển khai trong project

Dijkstra kế thừa toàn bộ logic nhiệm vụ từ BFS, chỉ thay phần tìm đường. Thay vì dùng hàng đợi FIFO, Dijkstra dùng một tập mở (open set) được sắp xếp theo tổng chi phí tích lũy từ điểm xuất phát: nút nào chi phí thấp hơn sẽ được mở rộng trước. Mỗi nút chỉ được đóng (không xét lại) sau khi tìm được đường rẻ nhất đến nó.

Trong phiên bản hiện tại, mỗi bước di chuyển có chi phí bằng nhau (= 1), nên về mặt kết quả tìm đường Dijkstra tương đương BFS. Tuy nhiên, việc triển khai đầy đủ Dijkstra tạo nền tảng để mở rộng sang bản đồ có chi phí khác nhau giữa các loại ô.

#### Mã giả

```
THUẬT TOÁN TÌM_ĐƯỜNG_DIJKSTRA(điểm_đầu, đích):
  tập_mở   ← [(chi_phí=0, điểm_đầu, đường=[điểm_đầu])]
  chi_phí_tốt_nhất ← {điểm_đầu: 0}
  tập_đóng ← rỗng

  TRONG KHI tập_mở không_rỗng:
    // Luôn chọn nút có chi phí tích lũy nhỏ nhất
    (chi_phí, ô_hiện_tại, đường) ← tập_mở.lấy_chi_phí_thấp_nhất()

    NẾU ô_hiện_tại trong tập_đóng: bỏ_qua   // đã có đường tốt hơn
    tập_đóng.thêm(ô_hiện_tại)

    NẾU ô_hiện_tại == đích:
      TRẢ VỀ đường                           // đường chi phí thấp nhất

    VỚI MỖI ô_kề của ô_hiện_tại:
      NẾU ô_kề trong tập_đóng HOẶC không_thể_đi_qua: bỏ_qua
      chi_phí_mới ← chi_phí + chi_phí_bước(ô_hiện_tại, ô_kề)
      NẾU chi_phí_mới < chi_phí_tốt_nhất[ô_kề]:
        chi_phí_tốt_nhất[ô_kề] ← chi_phí_mới
        tập_mở.thêm((chi_phí_mới, ô_kề, đường + [ô_kề]))

  TRẢ VỀ không_có_đường
```

---

### 5.5. A\* Search

#### Tổng quan lý thuyết

A\* kết hợp chi phí tích lũy thực tế `g(n)` với ước lượng heuristic `h(n)` để định hướng tìm kiếm về phía đích. Hàm đánh giá tổng hợp `f(n) = g(n) + h(n)` giúp A\* ưu tiên các nút vừa gần điểm xuất phát vừa gần đích, thay vì chỉ quan tâm đến một trong hai. A\* là tối ưu khi heuristic không đánh giá quá (admissible).

```
f(n) = g(n) + h(n)
  g(n) : chi phí thực từ điểm xuất phát đến n
  h(n) : ước lượng chi phí từ n đến đích (heuristic)
```

**Heuristic trong project:** khoảng cách Manhattan — admissible trên bản đồ lưới 4 hướng:

```
h(n) = |x_đích - x_n| + |y_đích - y_n|
```

| Đặc điểm | Giá trị |
| --- | --- |
| Tính đầy đủ | Có |
| Tính tối ưu | Có — khi heuristic admissible |
| Độ phức tạp thời gian | O(b^d) trong xấu nhất, thường tốt hơn nhờ heuristic |
| Độ phức tạp không gian | O(b^d) — cần lưu open set |
| Heuristic | Manhattan distance |

#### Cách triển khai trong project

A\* kế thừa toàn bộ logic nhiệm vụ từ BFS. Phần tìm đường thay bằng thuật toán A\* với tập mở sắp xếp theo `f(n)`. Khi có nhiều nút cùng `f`, nút có `h` nhỏ hơn được ưu tiên — tức là ưu tiên nút gần đích hơn. Các ô kề được sắp xếp sẵn theo heuristic trước khi đưa vào tập mở để tăng tốc độ khám phá đúng hướng.

Với việc tìm rác gần nhất, A\* thử từng đống rác sắp xếp theo khoảng cách Manhattan, chọn đống đầu tiên tìm được đường thực tế và đủ pin an toàn. Nhờ heuristic, A\* thường duyệt ít nút hơn BFS/Dijkstra khi bản đồ có nhiều chướng ngại vật.

#### Mã giả

```
THUẬT TOÁN TÌM_ĐƯỜNG_ASTAR(điểm_đầu, đích):
  tập_mở   ← [(f=h(điểm_đầu), g=0, điểm_đầu)]
  g_score  ← {điểm_đầu: 0}
  cameFrom ← rỗng
  tập_đóng ← rỗng

  TRONG KHI tập_mở không_rỗng:
    ô_hiện_tại ← tập_mở.lấy_f_nhỏ_nhất()
    NẾU ô_hiện_tại == đích:
      TRẢ VỀ tái_tạo_đường(cameFrom, ô_hiện_tại)
    tập_đóng.thêm(ô_hiện_tại)

    // Sắp xếp ô kề theo heuristic để ưu tiên hướng gần đích
    VỚI MỖI ô_kề (đã sắp xếp theo h tăng dần):
      NẾU ô_kề trong tập_đóng HOẶC không_thể_đi_qua: bỏ_qua
      g_mới ← g_score[ô_hiện_tại] + 1
      NẾU g_mới < g_score[ô_kề] (hoặc chưa có):
        cameFrom[ô_kề]  ← ô_hiện_tại
        g_score[ô_kề]   ← g_mới
        f_score[ô_kề]   ← g_mới + h(ô_kề, đích)
        tập_mở.thêm(ô_kề)

  TRẢ VỀ không_có_đường
```

---

### 5.6. IDA\* - Iterative Deepening A\*

#### Tổng quan lý thuyết

IDA\* kết hợp chiến lược heuristic của A\* với kỹ thuật lặp sâu dần để giải quyết vấn đề bộ nhớ lớn của A\*. Thay vì lưu toàn bộ tập mở, IDA\* thực hiện DFS với giới hạn trên giá trị `f(n)`. Sau mỗi vòng lặp, ngưỡng được tăng lên bằng giá trị `f` nhỏ nhất đã vượt ngưỡng cũ, cho đến khi tìm thấy đích hoặc xác nhận không có đường đi.

| Đặc điểm | Giá trị |
| --- | --- |
| Tính đầy đủ | Có |
| Tính tối ưu | Có — khi heuristic admissible |
| Độ phức tạp thời gian | O(b^d) — tương đương A\* |
| Độ phức tạp không gian | O(d) — chỉ lưu đường đi hiện tại, tốt hơn A\* rất nhiều |
| Heuristic | Manhattan distance (giống A\*) |

#### Cách triển khai trong project

IDA\* kế thừa toàn bộ logic nhiệm vụ và cách chọn rác gần nhất từ BFS/A\*. Hàm tìm đường thay bằng vòng lặp tăng ngưỡng: mỗi vòng thực hiện DFS đệ quy có giới hạn `f`. Khi `f(n)` của một nút vượt ngưỡng hiện tại, nhánh đó bị cắt và giá trị `f` đó được ghi nhận để làm ngưỡng cho vòng tiếp theo. Cách này đảm bảo tìm đường tối ưu mà không cần giữ toàn bộ open set trong bộ nhớ.

#### Mã giả

```
THUẬT TOÁN TÌM_ĐƯỜNG_IDASTAR(điểm_đầu, đích):
  ngưỡng ← h(điểm_đầu, đích)          // ngưỡng ban đầu = heuristic từ điểm đầu
  TRONG KHI ngưỡng <= kích_thước_bản_đồ:
    đường ← [điểm_đầu]
    kết_quả ← DFS_GIỚI_HẠN_F(đường, đích, g=0, ngưỡng)
    NẾU kết_quả == TÌM_THẤY: TRẢ VỀ đường
    NẾU kết_quả == VÔ_CỰC:   TRẢ VỀ không_có_đường
    ngưỡng ← kết_quả             // tăng ngưỡng lên f nhỏ nhất tiếp theo
  TRẢ VỀ không_có_đường

THUẬT TOÁN DFS_GIỚI_HẠN_F(đường, đích, g, ngưỡng):
  ô_hiện_tại ← ô cuối của đường
  f ← g + h(ô_hiện_tại, đích)
  NẾU f > ngưỡng: TRẢ VỀ f             // cắt nhánh, trả f để cập nhật ngưỡng
  NẾU ô_hiện_tại == đích: TRẢ VỀ TÌM_THẤY

  ngưỡng_mới_nhỏ_nhất ← VÔ_CỰC
  VỚI MỖI ô_kề (đã sắp xếp theo h tăng dần):
    NẾU ô_kề trong đường HOẶC không_thể_đi_qua: bỏ_qua
    đường.thêm(ô_kề)
    kết_quả ← DFS_GIỚI_HẠN_F(đường, đích, g+1, ngưỡng)
    NẾU kết_quả == TÌM_THẤY: TRẢ VỀ TÌM_THẤY
    NẾU kết_quả < ngưỡng_mới_nhỏ_nhất:
      ngưỡng_mới_nhỏ_nhất ← kết_quả
    đường.xóa_cuối()                   // quay lui
  TRẢ VỀ ngưỡng_mới_nhỏ_nhất
```

---

### 5.7. Greedy

#### Tổng quan lý thuyết

Greedy (Tham lam) ra quyết định dựa trên tiêu chí tốt nhất tại thời điểm hiện tại mà không nhìn trước hậu quả lâu dài. Trong tìm kiếm đường đi, Greedy chọn bước tiếp theo chỉ dựa vào heuristic — ô nào đưa robot gần đích nhất thì chọn ô đó.

| Đặc điểm | Giá trị |
| --- | --- |
| Tính đầy đủ | Có — trên không gian hữu hạn khi tránh lặp |
| Tính tối ưu | Không — quyết định cục bộ có thể dẫn đến đường dài hơn |
| Độ phức tạp thời gian | O(b^m) trong trường hợp xấu nhất |
| Ưu điểm | Nhanh, ít tính toán, phản ứng tức thời |
| Heuristic | Khoảng cách Manhattan + penalty kép |

#### Cách triển khai trong project

Greedy không kế thừa từ BFS mà xây dựng riêng. Thay vì dùng open set và tìm đường trọn vẹn, mỗi bước robot nhìn vào bốn ô lân cận và chấm điểm từng ô theo công thức:

```
điểm(ô) = Manhattan(ô, mục_tiêu)
         + số_lần_đã_ghé_thăm(ô) × hệ_số_phạt_thăm
         + hệ_số_phạt_quay_lui (nếu ô này là ô vừa rời)
```

Robot chọn ô có điểm thấp nhất. Penalty thăm lại tránh robot đi vòng vòng một chỗ; penalty quay lui tránh robot lắc qua lại giữa hai ô liền kề.

Đặc biệt, khi mục tiêu là trạm sạc, Greedy chuyển sang dùng BFS nội bộ để tìm đường ngắn nhất đảm bảo về được — vì lúc này heuristic cục bộ không đủ tin cậy trong bản đồ phức tạp.

Ngoài ra, trước khi chọn bất kỳ ô nào để bước vào, thuật toán kiểm tra xem sau khi bước vào ô đó còn đủ pin để về trạm sạc không. Nếu không, ô đó bị loại khỏi danh sách ứng viên.

#### Mã giả

```
THUẬT TOÁN GREEDY — QUYẾT ĐỊNH BƯỚC TIẾP THEO(trạng_thái):
  // Hành động tức thì (giống BFS)
  NẾU đang_ở_thùng_rác VÀ có_rác_trong_túi: TRẢ VỀ đổ_rác
  NẾU đang_ở_trạm_sạc VÀ cần_sạc:           TRẢ VỀ sạc_pin
  NẾU đứng_trên_rác VÀ túi_chưa_đầy:        TRẢ VỀ hút_rác

  mục_tiêu ← CHỌN_MỤC_TIÊU_GREEDY(trạng_thái)

  // Đi về trạm sạc dùng BFS để đảm bảo tìm được đường
  NẾU mục_tiêu là trạm_sạc:
    TRẢ VỀ bước_đầu_của_BFS(vị_trí_robot, trạm_sạc)

  // Chọn bước bằng heuristic Greedy
  ứng_viên ← []
  VỚI MỖI ô_kề của robot:
    NẾU không_thể_đi_qua(ô_kề): bỏ_qua
    NẾU sau_bước_này_không_đủ_pin_về_trạm(ô_kề): bỏ_qua
    điểm ← Manhattan(ô_kề, mục_tiêu)
           + số_lần_thăm(ô_kề) × PHẠT_THĂM
           + (PHẠT_QUAY_LUI nếu ô_kề == ô_vừa_rời)
    ứng_viên.thêm((ô_kề, điểm))

  NẾU ứng_viên rỗng: TRẢ VỀ đứng_yên
  TRẢ VỀ hành_động_đến(ứng_viên.điểm_thấp_nhất)

THUẬT TOÁN CHỌN_MỤC_TIÊU_GREEDY(trạng_thái):
  NẾU túi_đầy HOẶC (không_còn_rác VÀ có_rác_trong_túi):
    TRẢ VỀ thùng_rác
  NẾU còn_rác:
    TRẢ VỀ rác_gần_nhất_theo_Manhattan_mà_pin_đầy_có_thể_xử_lý
  TRẢ VỀ trạm_sạc
```

---

## 6. So Sánh Các Thuật Toán

### 6.1. Đầu Vào Test So Sánh

Để so sánh công bằng và có khả năng lặp lại, project dùng 10 bản đồ cố định có sẵn trong nhóm **Test maps** của mục Saved Maps. Mỗi thuật toán được chạy từ cùng một trạng thái ban đầu của từng map, trên một `Environment` độc lập, không dùng lại trạng thái hoặc metric của thuật toán khác.

| Map | Kích thước | Số rác | Số chướng ngại | Sức chứa | Đặc điểm chính |
| --- | ---: | ---: | ---: | ---: | --- |
| Test 1 | 8x8 | 4 | 0 | 3 | Bản đồ mở, không có vật cản |
| Test 2 | 8x8 | 4 | 7 | 3 | Vật cản thưa, kiểm tra né tường cơ bản |
| Test 3 | 10x10 | 6 | 22 | 3 | Dạng hành lang, nhiều đường vòng |
| Test 4 | 10x10 | 6 | 26 | 4 | Các vách ngăn dạng phòng |
| Test 5 | 12x8 | 6 | 22 | 4 | Bản đồ rộng ngang |
| Test 6 | 8x12 | 6 | 19 | 4 | Bản đồ cao dọc |
| Test 7 | 12x12 | 7 | 34 | 5 | Bản đồ lớn và dày vật cản nhất |
| Test 8 | 6x6 | 4 | 6 | 2 | Bản đồ nhỏ, sức chứa thấp |
| Test 9 | 10x8 | 6 | 17 | 3 | Nhiều nhánh tách tuyến |
| Test 10 | 10x10 | 6 | 35 | 3 | Bản đồ demo so sánh thuật toán ban đầu |

Các vị trí rác, chướng ngại, trạm sạc và thùng rác được định nghĩa cố định trong `js/sampleMaps.js`. Tất cả 10 map đã được kiểm tra tự động để đảm bảo: không có rác nằm trên tường/trạm/thùng, các mục tiêu đều nằm trong lưới, và mọi rác/thùng rác đều đi tới được từ vị trí xuất phát.

### 6.2. Quy Trình Chạy So Sánh

Quy trình so sánh được thiết kế để mọi thuật toán nhận cùng một đầu vào và được đo theo cùng một cách. Với mỗi bản đồ Test 1 đến Test 10, hệ thống nạp lại trạng thái ban đầu sạch: robot quay về vị trí xuất phát, pin đầy, túi rác rỗng, danh sách rác và chướng ngại vật đúng như map gốc.

Sau đó, từng thuật toán được chạy riêng trên một môi trường độc lập. Việc tách môi trường là cần thiết vì trong quá trình chạy, robot sẽ di chuyển, hút rác, đổ rác, sạc pin và làm thay đổi trạng thái bản đồ. Nếu các thuật toán dùng chung một môi trường, thuật toán chạy sau sẽ không còn nhận đúng đầu vào ban đầu nữa.

Trong mỗi lượt chạy, thuật toán chỉ có nhiệm vụ trả về hành động kế tiếp cho robot. Môi trường sẽ kiểm tra hành động đó có hợp lệ hay không, cập nhật vị trí, pin, túi rác, số bước và trạng thái hoàn thành. Vòng lặp tiếp tục cho đến khi robot dọn hết rác, đổ hết rác đang mang và quay về trạm sạc; khi đó trạng thái được ghi là **Done**.

Để tránh trường hợp một thuật toán bị kẹt làm quá trình đo không kết thúc, mỗi lượt chạy có giới hạn tối đa 2000 lần hỏi hành động. Nếu vượt giới hạn này mà robot chưa hoàn thành nhiệm vụ, kết quả được ghi là **Stopped**. Trường hợp này xuất hiện ở DFS trên Test 7, nên báo cáo giữ nguyên kết quả đó thay vì loại bỏ hoặc chỉnh sửa số liệu.

Các chỉ số được ghi lại gồm:

| Chỉ số | Ý nghĩa |
| --- | --- |
| Status | Thuật toán hoàn thành nhiệm vụ (**Done**) hay bị dừng do chạm giới hạn (**Stopped**) |
| Steps | Số hành động hợp lệ thật sự làm tăng bước trong môi trường |
| Actions | Số lần thuật toán được hỏi hành động; có thể lớn hơn Steps nếu có hành động không hợp lệ hoặc không tạo tiến triển |
| Visited nodes | Tổng số node/ô mà thuật toán đã duyệt trong quá trình tìm đường, cộng dồn qua cả lượt chạy |
| Runtime ms avg | Thời gian xử lý trung bình của thuật toán, đo nhiều lần để giảm nhiễu do CPU |
| Battery used | Tổng lượng pin robot đã tiêu thụ trong lượt chạy |
| Memory | Đỉnh bộ nhớ ước lượng theo số node được thuật toán giữ đồng thời |
| Rác còn lại | Số rác chưa được xử lý khi kết thúc lượt chạy |
| Pin cuối | Lượng pin còn lại của robot ở trạng thái cuối |

Các chỉ số như Status, Steps, Actions, Visited nodes, Battery used và Memory ổn định theo logic thuật toán. Riêng Runtime phụ thuộc vào tải máy khi chạy, vì vậy chỉ nên dùng để so sánh tương đối trong cùng một lần đo.

### 6.3. Kết Quả So Sánh

#### Test 1

Map: 8x8, 4 rác, 0 chướng ngại, sức chứa 3.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 40 | 40 | 504 | 2,01 | 40,0 | 66 | 0 | 60,0 |
| DFS | Done | 167 | 167 | 1237 | 3,25 | 166,0 | 93 | 0 | 28,0 |
| IDS | Done | 40 | 40 | 11148 | 5,88 | 40,0 | 76 | 0 | 60,0 |
| A* | Done | 40 | 40 | 222 | 2,01 | 40,0 | 29 | 0 | 60,0 |
| IDA* | Done | 40 | 40 | 222 | 0,86 | 40,0 | 30 | 0 | 60,0 |
| Dijkstra | Done | 40 | 40 | 504 | 1,29 | 40,0 | 64 | 0 | 60,0 |
| Greedy | Done | 54 | 54 | 54 | 7,32 | 54,0 | 1 | 0 | 46,0 |

#### Test 2

Map: 8x8, 4 rác, 7 chướng ngại, sức chứa 3.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 56 | 56 | 627 | 1,45 | 56,0 | 61 | 0 | 44,0 |
| DFS | Done | 149 | 149 | 1402 | 3,03 | 148,0 | 78 | 0 | 52,0 |
| IDS | Done | 56 | 56 | 8587 | 5,14 | 56,0 | 69 | 0 | 44,0 |
| A* | Done | 56 | 56 | 431 | 2,05 | 56,0 | 25 | 0 | 44,0 |
| IDA* | Done | 56 | 56 | 482 | 1,47 | 56,0 | 30 | 0 | 44,0 |
| Dijkstra | Done | 56 | 56 | 627 | 1,16 | 56,0 | 59 | 0 | 44,0 |
| Greedy | Done | 86 | 86 | 86 | 9,18 | 86,0 | 1 | 0 | 14,0 |

#### Test 3

Map: 10x10, 6 rác, 22 chướng ngại, sức chứa 3.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 82 | 82 | 1392 | 2,56 | 82,0 | 83 | 0 | 18,0 |
| DFS | Done | 250 | 250 | 2779 | 4,85 | 248,0 | 111 | 0 | 4,0 |
| IDS | Done | 82 | 82 | 25062 | 12,80 | 82,0 | 95 | 0 | 18,0 |
| A* | Done | 86 | 86 | 1418 | 6,06 | 86,0 | 55 | 0 | 14,0 |
| IDA* | Done | 86 | 86 | 2116 | 4,55 | 86,0 | 63 | 0 | 14,0 |
| Dijkstra | Done | 82 | 82 | 1392 | 2,68 | 82,0 | 78 | 0 | 18,0 |
| Greedy | Done | 129 | 129 | 129 | 22,31 | 128,0 | 1 | 0 | 49,0 |

#### Test 4

Map: 10x10, 6 rác, 26 chướng ngại, sức chứa 4.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 78 | 78 | 1053 | 1,42 | 78,0 | 74 | 0 | 22,0 |
| DFS | Done | 177 | 177 | 1778 | 1,97 | 176,0 | 89 | 0 | 21,0 |
| IDS | Done | 78 | 78 | 31350 | 14,22 | 78,0 | 95 | 0 | 22,0 |
| A* | Done | 78 | 78 | 2487 | 5,61 | 78,0 | 67 | 0 | 22,0 |
| IDA* | Done | 78 | 78 | 7730 | 6,04 | 78,0 | 81 | 0 | 22,0 |
| Dijkstra | Done | 78 | 78 | 1053 | 1,68 | 78,0 | 71 | 0 | 22,0 |
| Greedy | Done | 100 | 100 | 100 | 16,80 | 100,0 | 1 | 0 | 0,0 |

#### Test 5

Map: 12x8, 6 rác, 22 chướng ngại, sức chứa 4.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 82 | 82 | 1348 | 1,57 | 82,0 | 78 | 0 | 18,0 |
| DFS | Done | 236 | 236 | 2133 | 2,16 | 234,0 | 93 | 0 | 43,0 |
| IDS | Done | 82 | 82 | 18180 | 7,88 | 82,0 | 90 | 0 | 18,0 |
| A* | Done | 82 | 82 | 1101 | 2,82 | 82,0 | 31 | 0 | 18,0 |
| IDA* | Done | 82 | 82 | 1178 | 1,67 | 82,0 | 40 | 0 | 18,0 |
| Dijkstra | Done | 82 | 82 | 1348 | 1,76 | 82,0 | 74 | 0 | 18,0 |
| Greedy | Done | 88 | 88 | 88 | 12,25 | 88,0 | 1 | 0 | 12,0 |

#### Test 6

Map: 8x12, 6 rác, 19 chướng ngại, sức chứa 4.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 68 | 68 | 858 | 0,86 | 68,0 | 82 | 0 | 32,0 |
| DFS | Done | 248 | 248 | 3314 | 2,85 | 246,0 | 103 | 0 | 28,0 |
| IDS | Done | 68 | 68 | 14873 | 6,39 | 68,0 | 91 | 0 | 32,0 |
| A* | Done | 68 | 68 | 1373 | 3,49 | 68,0 | 62 | 0 | 32,0 |
| IDA* | Done | 68 | 68 | 2648 | 2,44 | 68,0 | 76 | 0 | 32,0 |
| Dijkstra | Done | 68 | 68 | 858 | 1,16 | 68,0 | 76 | 0 | 32,0 |
| Greedy | Done | 76 | 76 | 76 | 9,21 | 76,0 | 1 | 0 | 24,0 |

#### Test 7

Map: 12x12, 7 rác, 34 chướng ngại, sức chứa 5.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 85 | 85 | 1411 | 1,64 | 85,0 | 112 | 0 | 15,0 |
| DFS | Stopped | 180 | 2000 | 1068594 | 719,15 | 178,0 | 137 | 3 | 100,0 |
| IDS | Done | 85 | 85 | 28516 | 20,06 | 85,0 | 130 | 0 | 15,0 |
| A* | Done | 85 | 85 | 2463 | 9,42 | 85,0 | 88 | 0 | 15,0 |
| IDA* | Done | 85 | 85 | 3378 | 6,27 | 85,0 | 96 | 0 | 15,0 |
| Dijkstra | Done | 85 | 85 | 1411 | 2,67 | 85,0 | 110 | 0 | 15,0 |
| Greedy | Done | 172 | 172 | 172 | 58,88 | 171,0 | 1 | 0 | 11,0 |

#### Test 8

Map: 6x6, 4 rác, 6 chướng ngại, sức chứa 2.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 42 | 42 | 337 | 0,44 | 42,0 | 36 | 0 | 58,0 |
| DFS | Done | 76 | 76 | 575 | 0,73 | 76,0 | 39 | 0 | 24,0 |
| IDS | Done | 42 | 42 | 3499 | 1,80 | 42,0 | 39 | 0 | 58,0 |
| A* | Done | 42 | 42 | 255 | 0,71 | 42,0 | 23 | 0 | 58,0 |
| IDA* | Done | 42 | 42 | 270 | 0,51 | 42,0 | 26 | 0 | 58,0 |
| Dijkstra | Done | 42 | 42 | 337 | 0,69 | 42,0 | 36 | 0 | 58,0 |
| Greedy | Done | 58 | 58 | 58 | 4,17 | 58,0 | 1 | 0 | 42,0 |

#### Test 9

Map: 10x8, 6 rác, 17 chướng ngại, sức chứa 3.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 90 | 90 | 1891 | 2,31 | 90,0 | 67 | 0 | 10,0 |
| DFS | Done | 159 | 159 | 1633 | 2,11 | 158,0 | 83 | 0 | 32,0 |
| IDS | Done | 90 | 90 | 20201 | 11,43 | 90,0 | 78 | 0 | 10,0 |
| A* | Done | 92 | 92 | 1776 | 5,42 | 92,0 | 51 | 0 | 8,0 |
| IDA* | Done | 90 | 90 | 4849 | 5,36 | 90,0 | 51 | 0 | 10,0 |
| Dijkstra | Done | 90 | 90 | 1891 | 2,57 | 90,0 | 67 | 0 | 10,0 |
| Greedy | Done | 175 | 175 | 175 | 29,65 | 174,0 | 1 | 0 | 4,0 |

#### Test 10

Map: 10x10, 6 rác, 35 chướng ngại, sức chứa 3.

| Thuật toán | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Rác còn lại | Pin cuối |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BFS | Done | 72 | 72 | 927 | 1,59 | 72,0 | 68 | 0 | 28,0 |
| DFS | Done | 236 | 236 | 2224 | 3,78 | 234,0 | 72 | 0 | 4,0 |
| IDS | Done | 72 | 72 | 14850 | 9,63 | 72,0 | 82 | 0 | 28,0 |
| A* | Done | 72 | 72 | 948 | 3,58 | 72,0 | 36 | 0 | 28,0 |
| IDA* | Done | 72 | 72 | 1091 | 2,38 | 72,0 | 52 | 0 | 28,0 |
| Dijkstra | Done | 72 | 72 | 927 | 1,93 | 72,0 | 65 | 0 | 28,0 |
| Greedy | Done | 74 | 74 | 74 | 11,08 | 74,0 | 1 | 0 | 26,0 |

#### Bảng Tóm Tắt Theo Map

| Map | Steps tốt nhất | Thuật toán đạt steps tốt nhất | Ít node duyệt nhất | Runtime thấp nhất | Memory thấp nhất |
| --- | ---: | --- | --- | --- | --- |
| Test 1 | 40 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (54) | IDA* (0,86 ms) | Greedy (1) |
| Test 2 | 56 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (86) | Dijkstra (1,16 ms) | Greedy (1) |
| Test 3 | 82 | BFS, IDS, Dijkstra | Greedy (129) | BFS (2,56 ms) | Greedy (1) |
| Test 4 | 78 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (100) | BFS (1,42 ms) | Greedy (1) |
| Test 5 | 82 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (88) | BFS (1,57 ms) | Greedy (1) |
| Test 6 | 68 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (76) | BFS (0,86 ms) | Greedy (1) |
| Test 7 | 85 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (172) | BFS (1,64 ms) | Greedy (1) |
| Test 8 | 42 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (58) | BFS (0,44 ms) | Greedy (1) |
| Test 9 | 90 | BFS, IDS, IDA*, Dijkstra | Greedy (175) | DFS (2,11 ms) | Greedy (1) |
| Test 10 | 72 | BFS, IDS, A*, IDA*, Dijkstra | Greedy (74) | BFS (1,59 ms) | Greedy (1) |

### 6.4. Nhận Xét Và Phân Tích

**Về khả năng hoàn thành:** Trong 70 lượt chạy chính (10 map x 7 thuật toán), có 69 lượt hoàn thành nhiệm vụ. Trường hợp không hoàn thành là DFS trên Test 7: sau 2000 action, robot mới thực hiện được 180 steps hợp lệ, còn 3 rác chưa xử lý. Đây là kết quả hợp lý với bản chất DFS: khi map lớn, nhiều nhánh và có committed route, thuật toán có thể bị kéo vào các đường đi rất kém hiệu quả hoặc lặp lại quyết định không tạo tiến triển.

**Về số bước:** BFS, IDS và Dijkstra luôn đạt số steps tốt nhất trên cả 10 map. Điều này phù hợp với lý thuyết vì môi trường hiện tại có chi phí di chuyển đồng nhất, nên BFS và Dijkstra tìm đường ngắn nhất như nhau, còn IDS tìm được lời giải nông nhất. A* và IDA* đa số cũng đạt steps tốt nhất, nhưng không tuyệt đối: trên Test 3, A* và IDA* cần 86 steps trong khi nhóm tối ưu cần 82; trên Test 9, A* cần 92 steps trong khi BFS/IDS/IDA*/Dijkstra cần 90. Nguyên nhân là bài toán không chỉ là một lần tìm đường từ A đến B, mà gồm chuỗi quyết định chọn rác, đổ rác, sạc pin và kiểm tra an toàn pin.

**Về DFS:** DFS hoàn thành 9/10 map nhưng thường dùng nhiều bước hơn đáng kể. Ví dụ Test 3 cần 250 steps so với 82 của BFS, Test 6 cần 248 steps so với 68, Test 10 cần 236 steps so với 72. DFS vì vậy minh họa rõ đánh đổi giữa chiến lược tìm sâu và chất lượng hành trình: có thể tìm được lời giải, nhưng không đảm bảo ngắn, và trên bản đồ lớn Test 7 còn không hoàn thành trong giới hạn.

**Về Greedy:** Greedy hoàn thành cả 10 map và luôn có số visited nodes thấp nhất, đúng bằng số action đã chạy, vì thuật toán không mở rộng toàn bộ frontier như BFS/A*/Dijkstra mà chỉ chấm điểm bước kế tiếp. Memory của Greedy luôn là 1 node. Tuy nhiên, Greedy trả giá bằng hành trình dài hơn: Test 7 cần 172 steps so với mức tốt nhất 85, Test 9 cần 175 steps so với 90. Trên Test 4, Greedy hoàn thành nhưng pin cuối bằng 0, cho thấy chiến lược tham lam có thể đi sát giới hạn an toàn hơn các thuật toán tìm đường đầy đủ.

**Về visited nodes:** IDS có chi phí duyệt node rất cao do lặp lại DFS với giới hạn độ sâu tăng dần: Test 4 duyệt 31.350 node, Test 7 duyệt 28.516 node. DFS trên Test 7 là ngoại lệ lớn nhất với 1.068.594 node do không hoàn thành và tiếp tục bị hỏi hành động đến giới hạn 2000 action. BFS và Dijkstra có số node giống nhau trên mọi map vì mỗi bước di chuyển có chi phí 1, làm Dijkstra suy biến gần với BFS trong bài toán không trọng số.

**Về runtime:** Runtime chỉ nên xem là chỉ số tương đối vì phụ thuộc máy chạy Node.js. Trong lần đo này, BFS thường nhanh nhất hoặc gần nhanh nhất ở 7/10 map; Dijkstra nhanh nhất ở Test 2; IDA* nhanh nhất ở Test 1; DFS nhanh nhất ở Test 9 dù số steps không tốt nhất. Greedy tuy duyệt ít node nhưng runtime không thấp nhất, vì mỗi bước còn có các kiểm tra an toàn và tính toán phụ trợ để tránh hết pin hoặc quay lui xấu.

**Về bộ nhớ:** Greedy thấp nhất tuyệt đối với peak memory 1 node. Trong nhóm tìm đường đầy đủ, A* thường dùng ít memory hơn BFS/Dijkstra nhờ heuristic Manhattan thu hẹp hướng tìm kiếm, ví dụ Test 5 A* dùng 31 node so với BFS 78 và Dijkstra 74. IDA* thường nằm giữa A* và BFS/Dijkstra trong cách đo hiện tại của project, vì metric đang tính cả đường đệ quy và bảng độ sâu tốt nhất đã ghi nhận.

**Kết luận so sánh:** Nếu ưu tiên lời giải ổn định, ngắn và dễ giải thích, BFS hoặc Dijkstra là lựa chọn tốt nhất trong môi trường chi phí đồng nhất hiện tại. IDS cho cùng chất lượng đường đi nhưng tốn visited nodes lớn hơn nhiều. A* và IDA* có lợi thế rõ về bộ nhớ trong nhiều map, nhưng do bài toán gồm nhiều mục tiêu tuần tự nên không phải lúc nào cũng cho tổng steps thấp nhất. Greedy rất nhẹ về memory và visited nodes, hoàn thành được tất cả test, nhưng không đảm bảo tối ưu và có thể dùng nhiều pin hơn. DFS phù hợp để minh họa chiến lược tìm sâu, nhưng là lựa chọn kém ổn định nhất cho bài toán robot dọn rác có nhiều mục tiêu.

### 6.5. Bảng Ưu Nhược Điểm

| Thuật toán | Ưu điểm thực tế | Nhược điểm / rủi ro | Kết quả thể hiện qua 10 test | Khi nên dùng |
| --- | --- | --- | --- | --- |
| BFS | Dễ hiểu, dễ kiểm chứng và rất ổn định trên bản đồ không trọng số. Luôn tìm được đường ngắn nhất theo số bước từ vị trí hiện tại đến mục tiêu. Trong bài toán này, BFS cũng cho tổng hành trình tốt vì các bước di chuyển đều có chi phí bằng nhau. | Tốn bộ nhớ hơn các thuật toán đi sâu vì phải giữ frontier theo từng lớp. Khi bản đồ lớn và thoáng, số node cần duyệt có thể tăng nhanh. BFS cũng không tận dụng thông tin mục tiêu ở hướng nào, nên vẫn có thể duyệt nhiều vùng không cần thiết. | Hoàn thành cả 10/10 map. Luôn nằm trong nhóm có Steps tốt nhất. Số node duyệt bằng Dijkstra trên mọi map vì chi phí di chuyển đồng nhất. Runtime thường thấp hoặc gần thấp nhất trong lần đo này. | Phù hợp nhất khi bản đồ không trọng số, cần kết quả ổn định, dễ giải thích và ưu tiên đường đi ngắn. Nên dùng làm thuật toán chuẩn để đối chiếu các thuật toán khác. |
| DFS | Cài đặt đơn giản, dùng ý tưởng tìm sâu trực quan. Bộ nhớ lý thuyết có thể thấp vì không cần giữ toàn bộ frontier theo lớp. Có ích để minh họa sự khác biệt giữa chiến lược tìm sâu và tìm rộng. | Không đảm bảo đường ngắn nhất, dễ đi vòng trên bản đồ nhiều nhánh. Với bài toán nhiều mục tiêu, DFS có thể tạo hành trình rất dài. Nếu thứ tự duyệt không thuận lợi, thuật toán có thể bị kẹt trong các nhánh kém hiệu quả và liên tục tạo hành động không tiến triển. | Hoàn thành 9/10 map nhưng thường cần nhiều Steps hơn rõ rệt: Test 3 cần 250 Steps so với 82 của BFS, Test 6 cần 248 so với 68. Trên Test 7, DFS bị Stopped sau 2000 Actions, còn 3 rác chưa xử lý. | Phù hợp để học và minh họa thuật toán tìm kiếm, hoặc khi chỉ cần tìm một lời giải bất kỳ trong không gian nhỏ. Không nên chọn làm thuật toán chính cho robot dọn rác nếu cần ổn định, tối ưu bước đi hoặc đảm bảo hoàn thành trên bản đồ phức tạp. |
| IDS | Kết hợp ưu điểm của DFS và BFS: tìm theo độ sâu tăng dần nên vẫn tìm được lời giải nông nhất như BFS trong bài toán không trọng số, đồng thời không cần giữ frontier lớn như BFS. Kết quả Steps rất ổn định. | Chi phí thời gian và số node duyệt cao vì các tầng độ sâu thấp bị duyệt lại nhiều lần. Khi mục tiêu xa hoặc bản đồ nhiều vật cản, số Visited nodes tăng mạnh. Việc lặp lại tìm kiếm khiến IDS không hiệu quả nếu chỉ nhìn vào tổng số node duyệt. | Hoàn thành cả 10/10 map và luôn đạt Steps tốt nhất. Tuy nhiên Visited nodes rất lớn: Test 4 duyệt 31.350 node, Test 7 duyệt 28.516 node, cao hơn nhiều so với BFS/Dijkstra. | Nên dùng khi muốn đảm bảo đường ngắn như BFS nhưng muốn trình bày một phương án tiết kiệm frontier hơn về mặt lý thuyết. Không phù hợp khi tiêu chí quan trọng là giảm số node duyệt hoặc giảm thời gian xử lý trên map lớn. |
| Dijkstra | Tổng quát hơn BFS vì hỗ trợ bài toán có trọng số không âm. Trong môi trường hiện tại, mọi bước có chi phí như nhau nên Dijkstra cho kết quả đường đi tương đương BFS. Thuật toán ổn định, dễ giải thích theo chi phí tích lũy thấp nhất. | Với bản đồ không trọng số, Dijkstra chưa thể hiện hết lợi thế so với BFS nhưng vẫn có overhead quản lý chi phí/open set. Nếu cấu trúc hàng đợi ưu tiên chưa tối ưu, hiệu năng có thể kém hơn khi mở rộng bản đồ lớn. | Hoàn thành cả 10/10 map. Steps và Visited nodes trùng BFS trên tất cả map. Runtime thường rất tốt, có map nhanh nhất hoặc gần nhanh nhất. | Nên dùng nếu sau này bản đồ có trọng số khác nhau, ví dụ ô trơn, ô khó đi, vùng tốn pin hơn. Với bản đồ đồng nhất hiện tại, Dijkstra là lựa chọn ổn định nhưng chưa khác biệt nhiều so với BFS. |
| A* | Dùng heuristic Manhattan để hướng tìm kiếm về phía mục tiêu, thường giảm bộ nhớ so với BFS/Dijkstra. Khi heuristic phù hợp, A* có thể tìm đường nhanh hơn vì không mở rộng đều ra mọi hướng. Kết quả dễ giải thích bằng công thức `f(n) = g(n) + h(n)`. | Hiệu quả phụ thuộc heuristic và cách chọn mục tiêu. Trong bài toán nhiều mục tiêu tuần tự, A* có thể tìm đường tốt đến mục tiêu đã chọn nhưng tổng hành trình chưa chắc tốt nhất nếu thứ tự mục tiêu không tối ưu. Trên bản đồ nhiều tường, heuristic Manhattan có thể đánh giá lạc quan quá mức. | Hoàn thành cả 10/10 map. Thường đạt Steps tốt nhất, nhưng Test 3 cần 86 Steps so với 82 của BFS/Dijkstra, Test 9 cần 92 so với 90. Memory thường thấp hơn BFS/Dijkstra, ví dụ Test 5 A* dùng 31 node so với BFS 78. | Nên dùng khi bản đồ lớn và có mục tiêu rõ ràng, đặc biệt khi muốn giảm frontier so với BFS. Cần cẩn thận nếu bài toán không chỉ là tìm đường đơn lẻ mà còn phải quyết định thứ tự nhiều mục tiêu. |
| IDA* | Kết hợp heuristic của A* với tìm kiếm theo ngưỡng, giúp tránh phải giữ toàn bộ open set lớn. Có thể đạt đường đi tốt với bộ nhớ thấp hơn nhóm duyệt rộng trong nhiều trường hợp. Phù hợp để trình bày sự đánh đổi giữa A* và IDS. | Phải lặp lại tìm kiếm theo các ngưỡng `f`, nên có thể duyệt lại nhiều node. Trong cách đo hiện tại, memory không phải lúc nào thấp hơn A* vì còn tính đường đệ quy và cấu trúc ghi nhận độ sâu tốt nhất. Cũng chịu ảnh hưởng của thứ tự chọn mục tiêu như A*. | Hoàn thành cả 10/10 map. Đa số đạt Steps tốt nhất, nhưng Test 3 cần 86 Steps so với 82. Visited nodes thường cao hơn A*, ví dụ Test 4 IDA* duyệt 7.730 node so với A* 2.487. | Nên dùng khi muốn tận dụng heuristic nhưng không muốn phụ thuộc vào open set lớn như A*. Phù hợp để so sánh học thuật; trong triển khai thực tế cần tối ưu lại cách lưu metric và cắt tỉa để thể hiện rõ lợi thế bộ nhớ. |
| Greedy | Rất nhẹ về bộ nhớ và số node duyệt. Mỗi bước chỉ chọn hành động có vẻ tốt nhất theo điểm heuristic, nên Visited nodes gần như bằng số Actions. Phản ứng nhanh, dễ quan sát trên giao diện vì quyết định mang tính cục bộ. | Không đảm bảo đường ngắn nhất và có thể đi sát giới hạn pin. Vì chỉ nhìn cục bộ, Greedy dễ chọn đường vòng nếu heuristic bị vật cản đánh lừa. Runtime không nhất thiết thấp nhất vì thuật toán còn phải kiểm tra an toàn pin, tránh quay lui và xử lý các tình huống phụ trợ. | Hoàn thành cả 10/10 map, Memory luôn là 1 và Visited nodes thấp nhất. Tuy nhiên Steps thường cao hơn nhóm tối ưu: Test 7 cần 172 Steps so với 85, Test 9 cần 175 so với 90. Test 4 hoàn thành với pin cuối bằng 0, cho thấy rủi ro về biên an toàn. | Nên dùng khi cần thuật toán nhẹ, dễ chạy, dễ quan sát hành vi và chấp nhận lời giải không tối ưu. Không nên dùng đơn độc nếu yêu cầu quan trọng là tối ưu năng lượng, đảm bảo pin dự phòng hoặc có chứng minh đường đi ngắn nhất. |

---
## 7. Xây Dựng Hệ Thống

### 7.1. Cấu Trúc Tổng Thể

Project được tổ chức theo hướng tách rõ model, môi trường, simulator, thuật toán, render giao diện và lưu trữ. Mỗi module có trách nhiệm riêng và chỉ giao tiếp với module bên cạnh qua interface định nghĩa sẵn.

```text
CleanerBot/
├── index.html          (giao diện mô phỏng chính)
├── compare.html        (giao diện so sánh thuật toán)
├── style.css
├── server.js           (Node.js HTTP server)
├── package.json
├── data/
│   └── saved-maps.json (lưu trữ bản đồ)
├── server/
│   └── mapRepository.js
├── js/
│   ├── models.js       (cấu trúc dữ liệu cốt lõi)
│   ├── environment.js  (luật vật lý, thực thi hành động)
│   ├── simulator.js    (điều phối vòng lặp mô phỏng)
│   ├── render.js       (vẽ UI)
│   ├── main.js         (khởi tạo, bind event)
│   ├── compare.js
│   ├── mapStorage.js
│   ├── sampleMaps.js
│   └── algorithms/
│       ├── baseAlgorithm.js
│       ├── bfs.js / dfs.js / ids.js
│       ├── astar.js / idastar.js
│       ├── dijkstra.js / greedy.js
│       └── registry.js
└── tests/
    └── *.test.mjs
```

**Nguyên tắc cốt lõi:** Thuật toán không bao giờ sửa trực tiếp trạng thái mô phỏng. Thuật toán nhận snapshot trạng thái (chỉ đọc), tính toán và trả về hành động. Mọi thay đổi thật đều đi qua Environment.

### 7.2. Lớp Dữ Liệu Cốt Lõi

File `models.js` định nghĩa các cấu trúc dữ liệu nền tảng:

| Lớp / hằng số | Vai trò |
| --- | --- |
| `ACTIONS` | Tập hành động hợp lệ của robot |
| `Robot` | Lưu pin, sức chứa và vị trí hiện tại |
| `CleanerMap` | Lưu kích thước bản đồ, rác, chướng ngại vật, trạm sạc, thùng rác |
| `SimulationState` | Snapshot đầy đủ của mô phỏng tại một thời điểm |

Việc tách riêng model giúp các module khác không phụ thuộc trực tiếp vào DOM hay server. Thuật toán chỉ cần nhận `SimulationState` và trả về hành động tiếp theo.

### 7.3. Module Môi Trường

`environment.js` đóng vai trò như luật vận hành của thế giới mô phỏng — là điểm duy nhất thực thi hành động của robot và thay đổi trạng thái thật.

**Nhiệm vụ chính:**

- Tạo bản đồ ban đầu từ cấu hình người dùng.
- Sinh chướng ngại vật đảm bảo bản đồ luôn liên thông: dùng BFS kiểm tra sau mỗi lần đặt tường, nếu đặt tường làm vùng đi được bị chia cắt thì bỏ qua ứng viên đó.
- Sinh rác chỉ ở những ô có thể đến được từ vị trí xuất phát.
- Kiểm tra tính hợp lệ khi robot di chuyển, hút rác, đổ rác, sạc pin.
- Xử lý chỉnh sửa bản đồ khi mô phỏng đang tạm dừng.
- Cập nhật điều kiện hoàn thành sau mỗi hành động.
- Clone và restore trạng thái phục vụ reset/undo.

### 7.4. Module Simulator

`simulator.js` điều phối vòng lặp chính. Simulator không tự quyết định robot đi đâu, mà hỏi thuật toán rồi đưa câu trả lời cho Environment thực thi.

**Nhiệm vụ chính:**

- Chạy từng bước hoặc chạy tự động bằng bộ đếm thời gian.
- Cache hành động tiếp theo để UI hiển thị preview mà không gọi thuật toán hai lần.
- Quản lý tốc độ chạy theo bội số (1×, 2×, 3×, 5×).
- Lưu lịch sử trạng thái để undo (quay lại bước trước).
- Lưu lịch sử vị trí robot để vẽ vết đường đi.
- Thu thập và chuyển metric của thuật toán lên UI.
- Tự dừng khi mô phỏng hoàn thành.

### 7.5. Lớp Cơ Sở Thuật Toán

`baseAlgorithm.js` là lớp cha mà hầu hết thuật toán kế thừa. Lớp này cung cấp các tiện ích dùng chung:

- Tính khoảng cách Manhattan.
- Kiểm tra robot đang ở trạm sạc, thùng rác hoặc ô có rác.
- Sinh các ô kề hợp lệ.
- Kiểm tra ô có thể đi được hay không.
- Quản lý mục tiêu hiện tại (hiển thị trên bản đồ).
- Ghi metric: thời gian chạy, số node đã duyệt, bộ nhớ đỉnh, pin tiêu thụ.
- Lưu trace các node đã duyệt (tối đa 1000 entry) để quan sát và so sánh.

### 7.6. Luồng Hoạt Động

**Khởi tạo:** Khi mở ứng dụng, hệ thống tạo Environment (sinh bản đồ mặc định), Renderer (gắn vào DOM) và Simulator (liên kết Environment + thuật toán + callback cập nhật UI). Tất cả event listener trên giao diện được gắn vào các nút và ô bản đồ.

**Một bước mô phỏng** diễn ra theo trình tự sau:

```
[Người dùng bấm Next / setInterval tự động]
    │
    ▼  Simulator
  1. Lấy snapshot trạng thái hiện tại từ Environment   (chỉ đọc)
  2. Gọi thuật toán → nhận hành động tiếp theo
  3. Lưu snapshot + metrics vào undo stack
  4. Gọi Environment.thực_thi_hành_động()
         ├── Kiểm tra hợp lệ (pin, biên bản đồ, tường)
         ├── Thực hiện: di chuyển / hút rác / đổ rác / sạc pin
         └── Cập nhật điều kiện hoàn thành
  5. Ghi pin tiêu thụ thực tế vào metrics thuật toán
  6. Ghi vị trí mới vào lịch sử vết đường đi
  7. Nếu hoàn thành → tự dừng
  8. Gọi callback → Renderer vẽ lại toàn bộ UI
```

**Undo:** Mỗi khi `step()` chạy, một bản sao trạng thái được đẩy vào stack. Khi người dùng bấm Previous, trạng thái đó được pop ra và khôi phục về Environment, đồng thời metrics của thuật toán cũng được khôi phục về giá trị tương ứng.

**So sánh thuật toán:** Panel so sánh tạo 7 cặp Environment + Simulator + thuật toán hoàn toàn độc lập, tất cả cùng nạp bản đồ ban đầu giống nhau. Mỗi Simulator chạy với bộ đếm 100ms/bước. Chế độ Final chạy vòng lặp đồng bộ không cần setInterval để lấy kết quả nhanh.

### 7.7. Giao Diện Người Dùng

Giao diện chính nằm trong `index.html`, `style.css`, `main.js` và `render.js`.

**Màn hình mô phỏng:**

- Bản đồ lưới có tọa độ hàng/cột và chú giải cho các loại ô.
- Bảng điều khiển chọn thuật toán, sinh bản đồ, reset, next, previous, run, pause.
- Điều khiển tốc độ 1×, 2×, 3×, 5×.
- Bảng trạng thái robot: pin, sức chứa, vị trí, số bước, done.
- Bảng hành động: hành động vừa thực hiện, hành động tiếp theo, log mới nhất.

**Map Editor:**

Người dùng có thể thay đổi bản đồ khi mô phỏng đang tạm dừng bằng cách chọn công cụ và click vào ô:

- Inspect ô bất kỳ.
- Làm trống ô, đặt rác, đặt chướng ngại vật.
- Di chuyển trạm sạc, thùng rác, vị trí xuất phát của robot.

Sau mỗi thay đổi, trạng thái hiện tại được lưu làm initial state mới để các lần reset dùng đúng bản đồ vừa sửa.

**Panel so sánh:**

Nút "Compare 7 algorithms" mở panel chạy các thuật toán trên cùng một bản đồ ban đầu. Mỗi card hiển thị mini-grid và các chỉ số riêng. Chức năng Final cho phép chạy nhanh đến khi hoàn thành hoặc đạt giới hạn 2000 bước.

### 7.8. Lưu Trữ Và API

Server trong `server.js` vừa phục vụ file tĩnh, vừa cung cấp API quản lý bản đồ.

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/maps` | Liệt kê các bản đồ đã lưu |
| `POST` | `/api/maps` | Lưu bản đồ theo tên |
| `GET` | `/api/maps/:name` | Tải một bản đồ |
| `DELETE` | `/api/maps/:name` | Xóa một bản đồ |

Các biện pháp an toàn được tích hợp trong server:

- Giới hạn kích thước request JSON tối đa 2 MB.
- Kiểm tra đường dẫn khi phục vụ static file để tránh truy cập ra ngoài thư mục project.
- Chuẩn hóa tên map, giới hạn tối đa 60 ký tự.
- Ghi file thông qua file tạm rồi đổi tên để giảm nguy cơ hỏng dữ liệu khi ghi đồng thời.

---

## 8. Kiểm Thử

### 8.1. Các Nhóm Test Chính

Project sử dụng test tự động chạy bằng lệnh `npm run test`. Các nhóm test bao phủ tất cả module quan trọng:

| Nhóm test | Nội dung kiểm thử |
| --- | --- |
| Environment | Cấu hình mặc định, sinh rác, chỉnh sửa bản đồ, sinh bản đồ liên thông, chặn di chuyển sai, hút/đổ/sạc |
| Simulator | Lưu lịch sử vị trí và giới hạn slice lịch sử |
| DFS | Giữ committed route, hoàn thành nhiệm vụ đơn giản, đường hợp lệ nhưng không đảm bảo ngắn nhất |
| IDS | Tìm đường theo tầng độ sâu, chọn rác an toàn về pin, hoàn thành nhiệm vụ |
| Dijkstra | Tìm đường ngắn nhất quanh chướng ngại vật |
| Greedy | Ưu tiên ô ít thăm, tránh quay lui, tránh dao động, kiểm tra dự trữ pin |
| Greedy Best-First | Tìm đường hợp lệ đến đích |
| Map storage | Lưu/tải/xóa map, xử lý server không sẵn sàng |
| Current target | Thuật toán expose và reset mục tiêu hiện tại |
| Sample maps | Đủ 10 map built-in, load ra bản sao độc lập, không trùng vị trí đặc biệt và mọi mục tiêu đều đi tới được |

### 8.2. Kết Quả Kiểm Thử Tự Động

**Cách chạy:**

```bash
npm run test
```

Hoặc trên Windows PowerShell:

```bash
npm.cmd run test
```

**Kết quả:**

| Chỉ số | Kết quả |
| --- | --- |
| Tổng số test | 30 |
| Số test pass | 30 |
| Số test fail | 0 |
| Thời gian chạy | 176,15 ms |

**Nhận xét:** Toàn bộ 30 test đều pass, không có test nào thất bại. Các module Environment, Simulator, DFS, IDS, Dijkstra, Greedy, MapStorage, Sample Maps và cơ chế expose mục tiêu hiện tại của thuật toán đều hoạt động đúng theo các trường hợp đã kiểm thử. Đặc biệt, test sinh bản đồ liên thông chạy 88 ms do phải kiểm tra BFS sau mỗi lần đặt tường — đây là chi phí chấp nhận được để đảm bảo bản đồ luôn hợp lệ.

---

## 9. Đánh Giá

### 9.1. Kết Quả Đạt Được

Project đã đạt được các mục tiêu đề ra:

- Có mô phỏng robot dọn rác trực quan trên bản đồ lưới, quan sát được từng bước.
- Triển khai đầy đủ 7 thuật toán tìm kiếm: BFS, DFS, IDS, Dijkstra, A\*, IDA\*, Greedy.
- Có ràng buộc thực tế về pin, sức chứa rác, trạm sạc và thùng rác — không phải chỉ tìm đường đơn thuần.
- Có công cụ sửa bản đồ và lưu/tải bản đồ.
- Có bộ so sánh thuật toán với metric định lượng.
- Có test tự động bao phủ các module quan trọng.

Về mặt học thuật, project minh họa được sự khác nhau giữa các nhóm thuật toán:

- **BFS và Dijkstra** ưu tiên tính tối ưu theo chi phí đường đi trong bài toán không trọng số.
- **DFS** thể hiện chiến lược tìm sâu, có thể nhanh trong một số trường hợp nhưng không tối ưu.
- **IDS** cải thiện tính đầy đủ và tối ưu của DFS bằng cách tăng dần độ sâu, đồng thời tiết kiệm bộ nhớ hơn BFS.
- **A\* và IDA\*** tận dụng heuristic Manhattan để định hướng tìm kiếm hiệu quả hơn BFS/Dijkstra — thường duyệt ít node hơn.
- **Greedy** ra quyết định nhanh, phụ thuộc vào heuristic cục bộ và không đảm bảo tối ưu nhưng phản ứng tức thời.

### 9.2. Hạn Chế

- Chi phí di chuyển hiện tại đồng nhất (1 bước = 1 đơn vị pin), nên Dijkstra chưa thể hiện hết ưu điểm so với BFS.
- Robot chỉ di chuyển bốn hướng, chưa hỗ trợ đi chéo.
- Môi trường chưa có vật cản động hoặc rác sinh theo kịch bản phức tạp.
- Greedy phụ thuộc vào hàm điểm cục bộ nên có thể không tối ưu trên bản đồ nhiều chướng ngại vật phức tạp.
- Phần so sánh chưa có chức năng xuất kết quả ra file CSV hoặc JSON.

### 9.3. Hướng Phát Triển

- Bổ sung trọng số khác nhau cho từng loại địa hình để Dijkstra và A\* thể hiện ưu điểm rõ hơn.
- Thêm chế độ xuất kết quả so sánh ra CSV hoặc JSON.
- Thêm biểu đồ trực quan so sánh các chỉ số: runtime, visited nodes, battery consumed.
- Thêm các kịch bản benchmark cố định để đánh giá thuật toán công bằng trên nhiều loại bản đồ.
- Cải thiện cấu trúc hàng đợi ưu tiên cho A\* và Dijkstra để tăng hiệu năng trên bản đồ lớn.
- Bổ sung test cho A\*, IDA\* và panel compare ở mức tích hợp cao hơn.

---

## 10. Kết Luận

CleanerBot AI Simulator là project mô phỏng có tính ứng dụng tốt cho môn Trí tuệ nhân tạo. Project không chỉ cài đặt riêng lẻ các thuật toán tìm kiếm mà còn đặt chúng vào một bài toán có ràng buộc thực tế: pin, sức chứa, chướng ngại vật, rác, trạm sạc và thùng rác — đòi hỏi mỗi thuật toán phải tích hợp thêm logic điều phối nhiệm vụ bên cạnh phần tìm đường thuần túy.

Thông qua ứng dụng, người học có thể quan sát trực tiếp cách robot ra quyết định theo từng chiến lược, cách các thuật toán khác nhau duyệt không gian trạng thái và sự đánh đổi giữa tính tối ưu, tốc độ, bộ nhớ và khả năng định hướng bằng heuristic.

Đây là nền tảng tốt để tiếp tục mở rộng sang các bài toán lập kế hoạch, tối ưu lộ trình và tác nhân tự hành trong môi trường phức tạp hơn.

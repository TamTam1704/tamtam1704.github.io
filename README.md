# Tam — Video Editor Portfolio V2

Website tĩnh dành cho GitHub Pages. Không cần cài đặt hoặc build.

## Cấu trúc dễ chỉnh sửa

- `components/home.html`: nội dung trang Home.
- `components/projects.html`: khung trang Projects và các nút lọc.
- `components/about.html`: giới thiệu và kỹ năng.
- `components/contact.html`: email, LinkedIn và showreel.
- `data/projects.js`: thêm, xoá, sửa project và link video.
- `data/i18n.js`: sửa toàn bộ câu chữ tiếng Anh và tiếng Việt.
- `styles/game-ui.css`: màu sắc, panel, button và popup.
- `styles/animations.css`: tốc độ và hiệu ứng chuyển động.
- `styles/responsive.css`: giao diện điện thoại và tablet.
- `scripts/app.js`: chuyển tab, lọc project và mở popup.

## Xem thử trên máy

Website tải các component bằng JavaScript nên cần một local server. Trong VS Code, cài extension **Live Server**, sau đó bấm chuột phải vào `index.html` → **Open with Live Server**.

## Ngôn ngữ

Website mặc định dùng tiếng Anh và có nút `EN / VI`. Lựa chọn của người xem được ghi nhớ trên trình duyệt. Muốn sửa câu chữ, mở `data/i18n.js`.

## Đăng lên GitHub Pages

Upload toàn bộ file và thư mục trong gói này vào thư mục gốc repository `tamtam1704.github.io`. Vào **Settings → Pages**, chọn branch `main` và folder `/(root)`.

## Thêm project

Mở `data/projects.js`, sao chép một object project, rồi sửa `id`, `title`, `subtitle`, `category`, `image`, `description`, `tags` và `videoUrl`. Ảnh đặt trong thư mục `assets`.

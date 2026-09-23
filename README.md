# TamTam Portfolio V2.2

Bản web tĩnh có Content Studio, project video/ảnh và Eye Lab. Không cần npm, React, build hay cài plugin After Effects.

## 1. Mở và chạy web

Giải nén trọn bộ thư mục. Trên Windows, chạy **START-PREVIEW.bat** nếu máy đã có Python 3. Mở **http://127.0.0.1:8765/** để xem web và **http://127.0.0.1:8765/studio.html** để sửa nội dung. Giữ cửa sổ lệnh mở khi sử dụng; Ctrl+C để dừng server.

Cũng có thể chạy `python preview_server.py` hoặc `python3 preview_server.py`. Server chỉ chạy trên máy của bạn, không tự đăng web. Cổng 8765 được giữ cố định để bản nháp trong trình duyệt không bị đổi nguồn lưu sau mỗi lần mở.

Nhấp đúp `index.html` vẫn xem được giao diện. Nên dùng server HTTP để thử video YouTube và bản nháp: chế độ `file://` có thể không gửi thông tin referrer mà trình phát cần. Không cần Python khi web đã được đăng trên hosting tĩnh.

## 2. Sửa nội dung bằng Content Studio

Mở `studio.html` trên cùng địa chỉ với web. Có 5 khu vực:

| Tab | Nội dung chỉnh sửa |
| --- | --- |
| Content | Tên, giới thiệu, ảnh chính, avatar, email, mạng xã hội, About, kinh nghiệm, học vấn, các lựa chọn Contact, SEO. |
| Projects | Thêm/xóa/sắp xếp project; dán link video; thêm ảnh và chú thích; chọn project nổi bật. |
| Lab | Bài tip, nội dung, các bước, code, link tham khảo, GIF, ảnh tĩnh và ẩn/hiện Eye Lab. |
| Tools & appearance | Tên/logo công cụ và màu nhấn mặc định. |
| Text & labels | Hơn 200 dòng chữ giao diện: menu, heading, nút, thông báo, nhãn Eye Lab. Có ô tìm kiếm. |

Nội dung được coi là văn bản thuần, không phải HTML. Trong các nhãn có `{count}`, `{title}`, `{name}`..., giữ nguyên phần trong ngoặc nhọn để web điền giá trị tự động.

**Preview draft** mở bản xem thử có nội dung đang sửa. Nếu trình duyệt chặn popup, cho phép popup cho trang này. Trang web thường không tự nhận bản nháp: chỉ bản Preview draft nhận thay đổi ngay.

Bản nháp lưu trong trình duyệt, không tự ghi đè file hay tự đăng lên hosting. Đây không phải CMS có tài khoản/máy chủ. Đổi trình duyệt, địa chỉ, cổng hoặc xóa dữ liệu web sẽ dùng kho nháp khác. Nên xuất bản sao lưu thường xuyên.

## 3. Project: video và Design

Có sẵn **3 project cho mỗi nhóm Motion, 3D, Story, Ads, Social**, tổng 15 project video. Tất cả dùng link mẫu bạn gửi: `https://youtu.be/0Nb1wj0NeP8`.

Trong Projects, mở project → thay **YouTube / video URL** → thay tên, mô tả và cover. Chỉ dán link video thông thường, không dán mã iframe. Thumbnail là ảnh riêng do bạn chọn; web không tự lấy thumbnail từ YouTube. Link ngắn, watch, embed và Shorts được nhận diện; chọn tỷ lệ 16/9, 9/16 hoặc 1/1 theo nội dung.

**Design có 3 project mẫu**, mỗi project có 2 ảnh. Đây là gallery ảnh, không phải video. Dùng **Add image**, nhập đường dẫn/link ảnh hoặc **Choose file**. Có chú thích, alt text, đổi thứ tự và xóa ảnh. Người xem dùng thumbnail, nút trước/sau hoặc phím mũi tên để chuyển ảnh. Gallery trống sẽ dùng cover làm ảnh thay thế.

Các ảnh cover và mô tả đang là nội dung mẫu, không phải trích xuất hay mô tả đã xác minh của video YouTube. Bỏ chọn **Sample project** sau khi thay bằng công việc thật của bạn.

Video chỉ tạo player khi bấm Play. Link **Open video on the source site** là lối mở ngoài nếu video hạn chế nhúng. Quyền xem, quyền nhúng, tài khoản và kết nối mạng do YouTube quyết định; bộ source không vượt qua các hạn chế này.

## 4. Lab: tip có GIF và Eye Lab

Popup tip hiển thị **bài viết bên trái, GIF bên phải** trên màn hình rộng. Màn hình nhỏ sắp thành một cột. Có 6 GIF minh họa mẫu và ảnh tĩnh đi kèm; đây không phải video quay thao tác thật trong After Effects/Blender.

Trong tab Lab, mở note → thay **GIF demo**, **Still poster for the GIF**, alt text và caption. Dán link trực tiếp tới file GIF, không phải trang bài viết chứa GIF. Ví dụ: `assets/lab/my-tip.gif`. GIF có nút dừng/chạy; khi dừng, web dùng poster. Không có poster thì hiện thẻ tạm dừng. Chế độ giảm chuyển động bắt đầu với GIF đã dừng.

Phần đầu Lab là **Eye Lab**: kéo joystick để đổi hướng nhìn, chỉnh Look X/Y, Blink left/right và Expression. Có Blink both, Wink L/R, Reset, Follow pointer và Auto blink. Bàn phím: mũi tên, Shift + mũi tên để di chuyển nhanh, Home để về giữa. Auto blink tắt khi đổi trang hoặc mở tip. Đây là tương tác trong trình duyệt, không kết nối với After Effects.

Bỏ chọn **Show the interactive eye controller** trong tab Lab để ẩn toàn bộ phần này. Các nhãn Eye Lab nằm trong **Text & labels → eye**. Bài chưa chọn Published không xuất vào dữ liệu công khai.

## 5. Ảnh upload và xuất bản

**Choose file** nhận PNG, JPG, WebP, GIF; tối đa 8 MB/file và khoảng 24 MB upload trong một bản nháp. Trình duyệt có thể hết dung lượng localStorage sớm hơn. Khi thấy **Storage unavailable. Export before closing this page.**, phải xuất ngay trước khi đóng tab. Ảnh chỉ chọn trong Studio sẽ được đóng gói cùng bản cập nhật; file chỉ nhập bằng đường dẫn thì bạn cần tự copy đúng vị trí.

Sau khi sửa, bấm **Export update**. Giải nén `tamtam-content-update.zip`, sao lưu web cũ rồi chép đè 3 file trong `data/` và chép thêm các file trong `assets/uploads/` vào web. Tải lại trang để xem bản chính thức. Gói update không chứa lại toàn bộ source website.

**Giữ `content.json` ngoại tuyến, không upload lên hosting.** Đây là bản sao lưu đầy đủ, có thể chứa note chưa công khai và upload riêng. Dùng **Import content.json** để tiếp tục sửa trên máy/trình duyệt khác. Bản 2.2 dùng kho nháp riêng, không tự lấy nháp cũ của 2.1; có thể import file JSON cũ để chuyển nội dung.

Để đăng lần đầu, upload nội dung bên trong thư mục V2.2 (gồm index.html, data, components, scripts, styles, assets) tới hosting tĩnh. Không đổi tên các thư mục phụ. Script preview Python và file .bat không cần trên hosting.

Các thẻ SEO/Open Graph trong `index.html` là bản tĩnh cho bot/link preview. Sau khi đổi tên, mô tả, domain hoặc ảnh share trong Studio, đồng bộ cả thẻ meta trong index.html. Dữ liệu hiển thị cho người dùng cập nhật qua data/site.js.

## 6. Sửa trực tiếp trong code

| File/thư mục | Vai trò |
| --- | --- |
| data/site.js | Thông tin cá nhân, About, Contact, theme; `copy` chứa nhãn giao diện. |
| data/projects.js | Project; `video` chứa link; `mediaType: "gallery"` và `images` cho Design. |
| data/lab.js | Tip; `demoGif`, `demoPoster`, `demoAlt`, `demoCaption` cho minh họa. |
| components/ | HTML template theo trang, đã xuống dòng và thụt lề. |
| scripts/app.js | Điều hướng, dialog, search, player, gallery và bản nháp. |
| scripts/eye-rig.js | Joystick, chuyển động mắt, chớp mắt và sự kiện. |
| scripts/studio.js | Form chỉnh sửa, upload, import và export ZIP. |
| styles/media-lab.css | Giao diện Eye Lab, gallery và popup GIF. |
| assets/lab/ | GIF và poster mẫu. |
| assets/uploads/ | File ảnh/GIF xuất từ Studio. |

Source không nén/minify. JavaScript, CSS và HTML đã tách dòng/thụt lề; file data dùng cấu trúc rõ ràng. `.editorconfig` giúp editor giữ quy cách. Không có dependency JavaScript bên ngoài.

## 7. Phạm vi kiểm tra

Xem `TEST-REPORT.md`. Source đã chạy qua kiểm tra cú pháp và kiểm thử giao diện trong Chromium ngoại tuyến, gồm desktop/mobile giả lập, Eye Lab, GIF, gallery, form và xuất/nhập ZIP. Chưa xác nhận video YouTube phát qua mạng thật, Safari/iOS hay hosting của bạn. Trước khi thay bản đang public, hãy sao lưu bản cũ và thử trên máy của bạn.

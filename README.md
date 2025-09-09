📄 frontend/README.md
🎯 Mục tiêu

Đây là frontend prototype của hệ thống tải & cắt video.
Nhiệm vụ của frontend:

Nhập URL video từ user.

Tải trực tiếp video/audio từ nguồn ngoài (YouTube, v.v).

Cắt video ngay tại client bằng ffmpeg.js (WebAssembly).

Lưu file cục bộ bằng LocalStorage / IndexedDB.

Gửi metadata/log về backend (FastAPI).

🏗️ Công nghệ sử dụng

Next.js (React) – framework frontend.

ffmpeg.js – xử lý cắt video client-side.

LocalStorage / IndexedDB – lưu file cục bộ.

Axios/Fetch – gọi API log từ backend.

📂 Cấu trúc thư mục
src/
├── components/
│ ├── DownloadModule.tsx
│ └── CutModule.tsx
├── pages/
│ ├── index.tsx # Trang nhập URL
│ └── logs.tsx # Trang hiển thị log
├── services/
│ └── logService.ts # Gọi API backend
└── utils/
└── storage.ts # Lưu file local

🔎 Từng folder làm gì?

app/

Nơi đặt các route chính của app.

page.tsx = Home page (form nhập URL).

logs/page.tsx = trang xem lịch sử log.

components/

Tách phần giao diện có logic riêng → dễ tái sử dụng.

DownloadModule.tsx = UI + logic tải video.

CutModule.tsx = UI + logic cắt video.

services/

Chỉ chứa code gọi API backend.

Ví dụ: sendLog() → gọi POST /api/logs.

utils/

Các hàm tiện ích chung.

Ví dụ: saveFileToLocal() → dùng File API / IndexedDB.

🚀 Cách chạy
npm install
npm run dev

Chạy ở http://localhost:3000

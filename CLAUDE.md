# CRM Frontend (Next.js) Developer Memory

## Lệnh Chạy & Build
- Chạy môi trường phát triển (Dev): `npm run dev`
- Build dự án: `npm run build`
- Chạy tests: `npm run test`

## Các Tính Năng AI Governance & Workflow Đã Tích Hợp
Chúng ta đã chuyển đổi giao diện AI Hub và cài đặt sang hệ thống quản trị mô hình đa dạng và giám sát thời gian thực.

### 1. AI Governance Settings (`/settings` page)
- Tab **AI Governance** mới (chỉ hiển thị với ADMIN và SALES_MANAGER).
- CRUD Providers & API Keys: Giao diện quản lý mã hóa API Key, test kết nối nhanh và scan model tự động.
- Agent Tree Canvas: Bản đồ cây sơ đồ đại lý AI phân cấp dạng mạng lưới sử dụng `@xyflow/react` (React Flow), cho phép kéo thả và chỉnh sửa cấu hình chi tiết (role, prompt, key/model override) ở thanh sidebar.

### 2. Workflow Monitor (`/ai-hub` page)
- Tab **Workflow Monitor** mới kế bên Chat Console.
- Luồng n8n-style Node Graph: Hiển thị quy trình thực thi **Trigger ➔ Agent ➔ Action ➔ Result** theo thời gian thực.
- SSE Real-time Logs Sync: Kết nối trực tiếp với backend SSE stream, tự động cập nhật trạng thái chạy và hiệu ứng animation nhấp nháy cho các node đang thực thi.
- Sidebar Logs History: Lịch sử chạy của các Agent, hỗ trợ phân trang và chọn để tải xem chi tiết sơ đồ luồng.

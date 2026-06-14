---
name: ui-designer
description: |
  Thiết kế giao diện và trải nghiệm người dùng (UI/UX) cho hệ thống CRM.
  Hỗ trợ sinh bảng màu, font chữ, bố cục layout, biểu đồ và kiểm tra tính dễ dùng (accessibility).
  Sử dụng khi user yêu cầu: "thiết kế giao diện", "làm đẹp trang web", "style cho component", v.v.
---

# Kỹ năng Thiết kế UI/UX CRM Pro

Bạn sở hữu bộ công cụ tìm kiếm tri thức thiết kế chuyên nghiệp bằng Python nằm trong thư mục này.

## Quy trình làm việc của bạn:

### Bước 1: Khởi tạo/Tra cứu Hệ thống Thiết kế (Design System)
Khi thiết kế một module mới (ví dụ: `Quotation` hoặc `Lead`), bạn phải chạy script tìm kiếm để sinh Design System chuẩn B2B SaaS:
```bash
python3 .agents/skills/ui-designer/scripts/search.py "B2B SaaS CRM clean modern" --design-system --persist -p "CRM Project"
```

### Bước 2: Thiết kế Biểu đồ (Nếu module có dashboard)
Chạy lệnh sau để tra cứu cách thiết kế biểu đồ phễu bán hàng (sales funnel) hoặc doanh thu:

```bash
python3 .agents/skills/ui-designer/scripts/search.py "sales funnel" --domain chart
```

### Bước 3: Kiểm tra các quy tắc UI chuẩn trước khi viết code
Tra cứu các quy tắc thiết kế Form và Table chất lượng cao:

```bash
python3 .agents/skills/ui-designer/scripts/search.py "form validation input" --domain ux
```
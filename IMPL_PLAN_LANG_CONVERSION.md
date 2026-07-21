# Language Conversion Plan: Vietnamese → English

## Objective
Standardize all user-facing UI text in the CRM frontend to English only. Currently many screens mix Vietnamese strings with English labels, tooltips, buttons, and placeholders.

## Files Requiring Changes (25 files)

### Group A — Auth & Core Hooks
| File | Changes |
|------|---------|
| `src/app/login/page.tsx` | MSG_LOGIN_SUCCESS, MSG_LOGIN_ERROR constants |
| `src/app/register/page.tsx` | MSG_REGISTER_SUCCESS, MSG_REGISTER_ERROR constants |
| `src/hooks/useAuth.ts` | Đăng nhập/Đăng ký/Đăng xuất success & error messages |
| `src/hooks/useAiChat.ts` | "Đã xảy ra lỗi kết nối..." error message |
| `src/hooks/api/useLead.ts` | "Đánh giá tự động Lead thất bại!" error |
| `src/hooks/api/useDeal.ts` | Milestone config save, approval success/error messages |

### Group B — Dashboard Components
| File | Changes |
|------|---------|
| `src/components/dashboard/AccountantDashboard.tsx` | Stat labels (Tổng nợ, Doanh thu, Hợp đồng, Dòng tiền, etc.) |
| `src/components/dashboard/ManagerDashboard.tsx` | Pipeline labels, stage names, table column titles |
| `src/components/dashboard/SalesDashboard.tsx` | Stat labels (Cơ hội, Dự thu), widget titles, activity log |

### Group C — AI Hub
| File | Changes |
|------|---------|
| `src/app/(dashboard)/ai-hub/page.tsx` | Welcome messages, agent descriptions, UI labels, log history |
| `src/app/(dashboard)/ai-hub/dashboard/page.tsx` | Debug sample text ("giới hạn trách nhiệm pháp lý") |

### Group D — Settings (largest file)
| File | Changes |
|------|---------|
| `src/app/(dashboard)/settings/page.tsx` | Section headers, tabs, table columns, form labels/messages, button texts, tooltips, modal texts, integration descriptions, language selector, validation messages |

### Group E — Deals
| File | Changes |
|------|---------|
| `src/app/(dashboard)/deals/page.tsx` | Table columns, page title/description, filter labels, search placeholder |
| `src/app/(dashboard)/deals/[id]/ClientPage.tsx` | Service items table columns, milestone forms, approval modals, error messages |

### Group F — Customers & Conversations
| File | Changes |
|------|---------|
| `src/app/(dashboard)/customers/page.tsx` | Delete confirmation modals |
| `src/app/(dashboard)/conversations/page.tsx` | Tab labels, timeline, CRM match profile sections, create-lead modal |

### Group G — Opportunities
| File | Changes |
|------|---------|
| `src/app/(dashboard)/opportunities/page.tsx` | Table columns, page header, filter labels, create/edit modals, close-lost modal |

### Group H — Payments
| File | Changes |
|------|---------|
| `src/app/(dashboard)/payments/page.tsx` | Table columns, search placeholder, filter labels |
| `src/app/(dashboard)/payments/[id]/ClientPage.tsx` | Invoice detail labels, sections, buttons |

### Group I — Quotations & Reports
| File | Changes |
|------|---------|
| `src/app/(dashboard)/quotations/[id]/ClientPage.tsx` | Table columns, tab names, section labels, buttons |
| `src/app/(dashboard)/reports/sales-forecast/page.tsx` | Column titles |

### Group J — Other Components
| File | Changes |
|------|---------|
| `src/components/ErpConflictModal.tsx` | All modal text, column titles, buttons, description |
| `src/app/(dashboard)/dashboard/page.tsx` | Dashboard selector titles, subtitles, welcome message |

## Strategy
1. All user-facing strings → English
2. Internal variable names / TypeScript identifiers → keep as-is
3. API error messages from backend → keep as-is (backend concern)
4. Comments and console.log → leave as-is
5. Use proper English capitalization (Sentence case for labels, Title Case for headers)

## Execution Order
Phase 1: Auth/Core hooks (Group A) — small, low risk
Phase 2: Dashboard components (Group B) — UI labels only
Phase 3: AI Hub (Group C) — conversation samples
Phase 4: All page files (Groups D–I) — bulk of work
Phase 5: Components (Group J) — remaining

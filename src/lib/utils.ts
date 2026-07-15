export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatVND(amount?: number) {
  if (amount === undefined || amount === null) return '0 VND';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

export function formatDate(dateString?: string) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(date.getDate()) +
      '/' +
      new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(date.getMonth() + 1) +
      '/' +
      date.getFullYear();
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  } catch {
    return dateString;
  }
}

export function getStatusColor(status?: string) {
  if (!status) return 'default';
  const s = status.toUpperCase();
  if (['NEW', 'PENDING', 'QUALIFICATION', 'DRAFT', 'UNPAID', 'ONLINE'].includes(s)) return 'blue';
  if (['CONTACTED', 'INTERNAL_REVIEW', 'CUSTOMER_REVIEW', 'REVIEW', 'SENT', 'SIGNING_IN_PROGRESS', 'THINKING', 'EXECUTING'].includes(s)) return 'warning';
  if (['QUALIFIED', 'WON', 'CLOSED_WON', 'ACTIVE', 'PAID', 'SIGNED', 'READY'].includes(s)) return 'success';
  if (['UNQUALIFIED', 'LOST', 'CLOSED_LOST', 'CANCELLED', 'OVERDUE', 'DECLINED', 'VOIDED', 'ERROR', 'OFFLINE'].includes(s)) return 'danger';
  return 'default';
}

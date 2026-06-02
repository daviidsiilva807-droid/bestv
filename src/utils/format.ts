export const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export function formatMoney(value: number): string {
  return moneyFormatter.format(value);
}

export function formatDate(value: string): string {
  return shortDateFormatter.format(new Date(value));
}

export function formatLongDate(value: string): string {
  return longDateFormatter.format(new Date(value));
}

export function monthKey(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonthLabel(value: string): string {
  const date = new Date(`${value}-01T00:00:00`);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function daysUntil(value: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(value);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
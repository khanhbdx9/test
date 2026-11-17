const DURATION_UNITS: Record<'s' | 'm' | 'h' | 'd', number> = {
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function parseDurationMs(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  const amount = match?.[1];
  const unit = match?.[2];
  if (!amount || (unit !== 's' && unit !== 'm' && unit !== 'h' && unit !== 'd')) {
    throw new Error('Định dạng thời hạn không hợp lệ');
  }

  return Number(amount) * DURATION_UNITS[unit];
}

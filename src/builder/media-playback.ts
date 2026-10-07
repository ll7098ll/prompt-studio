/** A finite clip, even when metadata is missing or a user enters times beyond it. */
export function mediaBounds(start: number, end: number, duration: number) {
  const known = Number.isFinite(duration) && duration > 0;
  const from = Math.max(
    0,
    Math.min(start || 0, known ? Math.max(0, duration - 0.05) : start || 0),
  );
  const to = known
    ? Math.min(duration, end > from ? end : duration)
    : end > from
      ? end
      : from;
  return { from, to, length: Math.max(0, to - from) };
}

export function mediaTime(seconds: number) {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const s = String(total % 60).padStart(2, "0"),
    m = Math.floor(total / 60);
  return m >= 60
    ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${s}`
    : `${m}:${s}`;
}

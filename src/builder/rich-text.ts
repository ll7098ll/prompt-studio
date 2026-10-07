export type InlineRun = {
  kind: "text" | "strong" | "em" | "code" | "link";
  text: string;
  start: number;
  end: number;
  href?: string;
};
export function safeRichLink(value: string): string | undefined {
  if (/[\s<>\u0000-\u001f\\]/.test(value)) return;
  if (/^#[\w-]+$/.test(value) || /^\/(?!\/)/.test(value)) return value;
  try {
    const url = new URL(value);
    if (["https:", "http:", "mailto:"].includes(url.protocol)) return value;
  } catch {
    /* incomplete links stay text */
  }
}
export const escapeRichText = (value: string) =>
  value.replace(/[\\*`\[\]]/g, "\\$&");
const decode = (value: string) => value.replace(/\\([\\*`\[\]])/g, "$1");
/** Small, bounded inline grammar. HTML is always rendered as React text. */
export function inlineRuns(source: string): InlineRun[] {
  const runs: InlineRun[] = [];
  let i = 0,
    plain = 0;
  const missing = new Set<string>();
  const endOf = (marker: string, start: number) => {
    if (missing.has(marker)) return -1;
    let at = source.indexOf(marker, start);
    while (at >= 0) {
      let slash = at - 1;
      while (slash >= 0 && source[slash] === "\\") slash--;
      if ((at - 1 - slash) % 2 === 0) return at;
      at = source.indexOf(marker, at + marker.length);
    }
    missing.add(marker);
    return -1;
  };
  const linkEnd = (start: number) => {
    let depth = 1;
    for (let j = start; j < source.length; j++) {
      if (source[j] === "(") depth++;
      else if (source[j] === ")" && --depth === 0) return j;
    }
    return -1;
  };
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    const marker = source.startsWith("**", i)
      ? "**"
      : source[i] === "*"
        ? "*"
        : source[i] === "`"
          ? "`"
          : "";
    let run: InlineRun | undefined,
      next = i + 1;
    if (marker) {
      const end = endOf(marker, i + marker.length);
      if (end > i + marker.length) {
        run = {
          kind: marker === "**" ? "strong" : marker === "*" ? "em" : "code",
          text: decode(source.slice(i + marker.length, end)),
          start: i + marker.length,
          end,
        };
        next = end + marker.length;
      }
    } else if (source[i] === "[") {
      const end = endOf("](", i + 1),
        close = end < 0 ? -1 : linkEnd(end + 2);
      const href =
        close < 0 ? undefined : safeRichLink(source.slice(end + 2, close));
      if (end > i + 1 && href) {
        run = {
          kind: "link",
          text: decode(source.slice(i + 1, end)),
          start: i + 1,
          end,
          href,
        };
        next = close + 1;
      }
    }
    if (run) {
      if (plain < i)
        runs.push({
          kind: "text",
          text: decode(source.slice(plain, i)),
          start: plain,
          end: i,
        });
      runs.push(run);
      plain = next;
      i = next;
    } else i++;
  }
  if (plain < source.length || !runs.length)
    runs.push({
      kind: "text",
      text: decode(source.slice(plain)),
      start: plain,
      end: source.length,
    });
  return runs;
}
export function replaceRichRun(
  source: string,
  start: number,
  end: number,
  text: string,
): string {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start ||
    end > source.length
  )
    return source;
  return source.slice(0, start) + escapeRichText(text) + source.slice(end);
}

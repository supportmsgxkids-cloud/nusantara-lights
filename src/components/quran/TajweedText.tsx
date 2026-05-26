// Renders Quran Cloud tajweed-encoded text with colored spans.
// Encoding format: [code[ ... code]] where code is 1-2 chars + optional ":n".
// Reference: https://alquran.cloud/tajweed-guide

const COLORS: Record<string, string> = {
  h: "#AA4242", // Hamzat al-Wasl
  s: "#AAAAAA", // Silent
  l: "#A0522D", // Laam Shamsiyyah
  n: "#537FFF", // Madd 2/4/6
  p: "#DD0008", // Qalqalah
  m: "#4050FF", // Madd permissible
  q: "#7B2D2D", // Madd necessary
  o: "#4050FF", // Madd obligatory
  c: "#A1A1A1", // Ikhafa Shafawi
  f: "#9400A8", // Ikhafa
  w: "#26BFFD", // Iqlab
  i: "#169200", // Idgham w/ Ghunnah
  a: "#169777", // Idgham Shafawi
};

type Node = { text: string; color?: string };

function parseTajweed(input: string): Node[] {
  // Match pairs like [X[ ... X]] or [X:N[ ... X:N]]
  const re = /\[([a-z])(?::\d+)?\[([\s\S]*?)\]\1(?::\d+)?\]/g;
  const out: Node[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) out.push({ text: input.slice(last, m.index) });
    out.push({ text: m[2], color: COLORS[m[1]] });
    last = m.index + m[0].length;
  }
  if (last < input.length) out.push({ text: input.slice(last) });
  return out;
}

export function TajweedText({ text, className }: { text: string; className?: string }) {
  const nodes = parseTajweed(text);
  return (
    <p className={className} dir="rtl" suppressHydrationWarning>
      {nodes.map((n, i) =>
        n.color ? (
          <span key={i} style={{ color: n.color }}>
            {n.text}
          </span>
        ) : (
          <span key={i}>{n.text}</span>
        ),
      )}
    </p>
  );
}

export function TajweedLegend() {
  const items: { code: string; label: string }[] = [
    { code: "p", label: "Qalqalah" },
    { code: "n", label: "Madd 2/4/6" },
    { code: "f", label: "Ikhafa" },
    { code: "i", label: "Idgham" },
    { code: "w", label: "Iqlab" },
    { code: "l", label: "Lam Syamsiah" },
    { code: "h", label: "Hamzah Washal" },
    { code: "s", label: "Huruf Mati" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it.code}
          className="inline-flex items-center gap-1.5 rounded-pill bg-card px-2.5 py-1 text-[11px] font-medium text-text-secondary"
          style={{ border: "1px solid var(--border)" }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: COLORS[it.code] }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

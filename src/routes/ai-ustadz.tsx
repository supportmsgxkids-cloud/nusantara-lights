import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ChevronLeft,
  Plus,
  Square,
  Mic,
  Sparkles,
  BookOpen,
  Moon,
  HeartHandshake,
  Sun,
  Copy,
  Check,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/ai-ustadz")({
  component: AIUstadz,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS: {
  icon: typeof BookOpen;
  category: string;
  title: string;
  prompt: string;
  tone: "primary" | "gold" | "violet" | "rose";
}[] = [
  {
    icon: BookOpen,
    category: "Al-Qur'an",
    title: "Adab membaca Al-Qur'an",
    prompt: "Jelaskan adab-adab membaca Al-Qur'an beserta dalilnya.",
    tone: "primary",
  },
  {
    icon: Moon,
    category: "Sholat",
    title: "Tata cara sholat Tahajud",
    prompt: "Bagaimana tata cara dan keutamaan sholat tahajud?",
    tone: "violet",
  },
  {
    icon: HeartHandshake,
    category: "Doa",
    title: "Doa pembuka rezeki",
    prompt: "Sebutkan doa-doa pembuka rezeki yang shahih beserta artinya.",
    tone: "gold",
  },
  {
    icon: Sun,
    category: "Fiqh",
    title: "Hukum puasa di hari Jumat",
    prompt: "Bagaimana hukum berpuasa khusus pada hari Jumat?",
    tone: "rose",
  },
];

const TONES: Record<string, { bg: string; ring: string; text: string }> = {
  primary: {
    bg: "from-primary-50 to-primary-50/30",
    ring: "ring-primary-500/15",
    text: "text-primary-900",
  },
  gold: {
    bg: "from-gold-50 to-gold-50/30",
    ring: "ring-gold-400/20",
    text: "text-gold-700",
  },
  violet: {
    bg: "from-[oklch(0.96_0.03_290)] to-[oklch(0.98_0.02_290)]",
    ring: "ring-[oklch(0.55_0.18_290)]/15",
    text: "text-[oklch(0.42_0.16_290)]",
  },
  rose: {
    bg: "from-[oklch(0.96_0.03_20)] to-[oklch(0.98_0.02_20)]",
    ring: "ring-[oklch(0.6_0.18_20)]/15",
    text: "text-[oklch(0.48_0.16_20)]",
  },
};

function AIUstadz() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // autosize textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const isEmpty = messages.length === 0;

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        const data = await resp.json().catch(() => ({ error: "Gagal terhubung" }));
        throw new Error(data.error || "Gagal terhubung");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              acc += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        // user stopped
      } else {
        const msg = e instanceof Error ? e.message : "Terjadi kesalahan";
        setError(msg);
        setMessages((prev) => {
          const copy = [...prev];
          if (copy[copy.length - 1]?.role === "assistant" && !copy[copy.length - 1].content) {
            copy.pop();
          }
          return copy;
        });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function newChat() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError(null);
  }

  function regenerate() {
    if (loading) return;
    // remove last assistant and re-send the prior user message
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const trimmed = messages.slice(0, messages.findIndex((m) => m === lastUser));
    setMessages(trimmed);
    send(lastUser.content);
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-surface">
      {/* Ambient aurora */}
      <Aurora hidden={!isEmpty} />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 pt-3 pb-2">
        <Link
          to="/home"
          aria-label="Kembali"
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-card/80 backdrop-blur press"
        >
          <ChevronLeft className="h-5 w-5 text-text-primary" />
        </Link>
        <div className="flex items-center gap-2 rounded-pill border border-border bg-card/80 px-3 py-1.5 backdrop-blur">
          <span className="relative flex h-6 w-6 items-center justify-center rounded-pill bg-gradient-to-br from-primary-500 to-primary-900 text-white">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-pill bg-success ring-2 ring-card" />
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-text-primary">AI Ustadz</div>
            <div className="text-[10px] -mt-0.5 text-text-muted">Online · adab pertama</div>
          </div>
        </div>
        <button
          onClick={newChat}
          aria-label="Obrolan baru"
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-card/80 backdrop-blur press"
        >
          <Plus className="h-5 w-5 text-text-primary" />
        </button>
      </header>

      {/* Body */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto no-scrollbar">
        {isEmpty ? (
          <EmptyState onPick={send} />
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-4">
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1;
              return (
                <MessageBubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  streaming={loading && isLast && m.role === "assistant"}
                  showActions={!loading && m.role === "assistant" && !!m.content && isLast}
                  onRegenerate={regenerate}
                />
              );
            })}
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
            <div className="h-28" />
          </div>
        )}
      </div>

      {/* Composer */}
      <Composer
        input={input}
        setInput={setInput}
        send={send}
        stop={stop}
        loading={loading}
        taRef={taRef}
      />
    </div>
  );
}

/* ---------------- Aurora background ---------------- */
function Aurora({ hidden }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-0 transition-opacity duration-700 ${
        hidden ? "opacity-30" : "opacity-100"
      }`}
    >
      <div
        className="absolute left-[-15%] top-[-10%] h-[60vh] w-[80vw] rounded-full blur-3xl animate-aurora"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary-500) 35%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute right-[-20%] top-[15%] h-[55vh] w-[75vw] rounded-full blur-3xl animate-aurora-2"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--gold-400) 30%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to top, var(--color-surface), color-mix(in oklab, var(--color-surface) 0%, transparent))",
        }}
      />
    </div>
  );
}

/* ---------------- Empty state ---------------- */
function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  const hour = new Date().getHours();
  const greet =
    hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 pt-2 pb-6">
      {/* Hero orb */}
      <div className="relative my-3 flex h-40 w-40 items-center justify-center">
        <div
          className="absolute inset-0 rounded-pill blur-2xl animate-orb"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--primary-500) 55%, transparent), transparent 70%)",
          }}
        />
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow opacity-70">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--color-gold-400)" />
              <stop offset="1" stopColor="var(--color-primary-500)" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="92" fill="none" stroke="url(#ring)" strokeWidth="1.2" strokeDasharray="2 8" />
          <circle cx="100" cy="100" r="78" fill="none" stroke="var(--color-gold-400)" strokeWidth="0.8" strokeDasharray="1 5" opacity="0.7" />
        </svg>
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-pill bg-gradient-to-br from-primary-500 to-primary-900 text-white shadow-2xl"
          style={{ boxShadow: "0 20px 60px -15px color-mix(in oklab, var(--primary-900) 60%, transparent)" }}
        >
          <Sparkles className="h-9 w-9" />
        </div>
      </div>

      <span className="animate-rise inline-flex items-center gap-1.5 rounded-pill bg-text-primary/90 px-1 py-1 pr-3 text-[11px] font-medium text-white">
        <span className="rounded-pill bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-text-primary">Baru</span>
        Bertanya dengan adab, dijawab dengan dalil
      </span>

      <h1 className="animate-rise mt-4 text-center text-[26px] font-bold leading-tight tracking-tight text-text-primary" style={{ animationDelay: "60ms" }}>
        {greet},
        <br />
        <span className="bg-gradient-to-r from-primary-900 to-primary-500 bg-clip-text text-transparent">
          ada yang ingin ditanyakan?
        </span>
      </h1>
      <p className="animate-rise mt-2 max-w-xs text-center text-[13px] leading-relaxed text-text-secondary" style={{ animationDelay: "120ms" }}>
        Fiqh, doa, tafsir ringkas, hingga adab harian — semuanya dengan referensi yang jelas.
      </p>

      {/* Category cards */}
      <div className="animate-rise mt-6 grid w-full grid-cols-2 gap-2.5" style={{ animationDelay: "180ms" }}>
        {SUGGESTIONS.map((s) => {
          const t = TONES[s.tone];
          const Icon = s.icon;
          return (
            <button
              key={s.title}
              onClick={() => onPick(s.prompt)}
              className={`group relative flex h-[112px] flex-col justify-between rounded-card border border-border bg-gradient-to-br p-3 text-left ring-1 ${t.bg} ${t.ring} press hover:-translate-y-0.5 transition-transform`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-md bg-card/70 ${t.text}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <div className={`text-[10px] font-semibold uppercase tracking-wider ${t.text} opacity-80`}>
                  {s.category}
                </div>
                <div className="mt-0.5 text-[13px] font-semibold leading-snug text-text-primary">
                  {s.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[10.5px] leading-relaxed text-text-muted">
        AI dapat keliru. Untuk perkara penting, rujuk ulama tepercaya.
      </p>
    </div>
  );
}

/* ---------------- Message bubble ---------------- */
function MessageBubble({
  role,
  content,
  streaming,
  showActions,
  onRegenerate,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  showActions?: boolean;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  if (role === "user") {
    return (
      <div className="flex justify-end animate-rise">
        <div
          className="max-w-[85%] rounded-card rounded-br-md bg-gradient-to-br from-primary-900 to-primary-500 px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
          style={{ boxShadow: "0 8px 24px -12px color-mix(in oklab, var(--primary-900) 50%, transparent)" }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise flex gap-2.5">
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-gradient-to-br from-primary-500 to-primary-900 text-white"
        style={{ boxShadow: "0 6px 16px -8px color-mix(in oklab, var(--primary-900) 60%, transparent)" }}
      >
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="prose prose-sm max-w-none rounded-card rounded-tl-md border border-border bg-card px-4 py-3 text-[14px] leading-relaxed text-text-primary prose-headings:text-text-primary prose-strong:text-text-primary prose-p:my-2 prose-li:my-0.5 prose-a:text-primary-500">
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <div className="flex gap-1 py-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-pill bg-text-muted" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-pill bg-text-muted" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-pill bg-text-muted" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          {streaming && content && (
            <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-primary-500 align-middle" />
          )}
        </div>
        {showActions && (
          <div className="mt-1.5 flex items-center gap-1 pl-1">
            <button
              onClick={copy}
              className="flex items-center gap-1 rounded-pill px-2 py-1 text-[11px] text-text-muted hover:bg-card2 hover:text-text-primary press"
              aria-label="Salin"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              {copied ? "Tersalin" : "Salin"}
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 rounded-pill px-2 py-1 text-[11px] text-text-muted hover:bg-card2 hover:text-text-primary press"
              aria-label="Ulang jawaban"
            >
              <RotateCcw className="h-3 w-3" />
              Ulang
            </button>
            <button
              className="ml-auto flex items-center gap-1 rounded-pill px-2 py-1 text-[11px] text-text-muted hover:bg-card2 hover:text-text-primary press"
              aria-label="Lainnya"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Composer ---------------- */
function Composer({
  input,
  setInput,
  send,
  stop,
  loading,
  taRef,
}: {
  input: string;
  setInput: (v: string) => void;
  send: (v: string) => void;
  stop: () => void;
  loading: boolean;
  taRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="relative z-20 px-3 pb-4 pt-2">
      {/* fade mask above composer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-6 h-6"
        style={{
          background:
            "linear-gradient(to top, var(--color-surface), color-mix(in oklab, var(--color-surface) 0%, transparent))",
        }}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mx-auto flex max-w-2xl items-end gap-2 rounded-[28px] border border-border bg-card p-2 pl-3"
        style={{ boxShadow: "0 10px 32px -16px color-mix(in oklab, var(--primary-900) 40%, transparent)" }}
      >
        <button
          type="button"
          aria-label="Lampirkan"
          className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-card2 text-text-secondary press"
        >
          <Plus className="h-4 w-4" />
        </button>
        <textarea
          ref={taRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Tanyakan pada AI Ustadz…"
          className="max-h-[160px] min-h-[36px] flex-1 resize-none bg-transparent px-1 py-2 text-[14px] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        <div className="mb-1 flex items-center gap-1.5">
          {!input.trim() && !loading && (
            <button
              type="button"
              aria-label="Pesan suara"
              className="flex h-9 w-9 items-center justify-center rounded-pill bg-card2 text-text-secondary press"
            >
              <Mic className="h-4 w-4" />
            </button>
          )}
          {loading ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Hentikan"
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-text-primary text-white press"
            >
              <Square className="h-3.5 w-3.5" fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Kirim"
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-gradient-to-br from-primary-500 to-primary-900 text-white press disabled:from-card2 disabled:to-card2 disabled:text-text-muted"
              style={
                input.trim()
                  ? { boxShadow: "0 8px 20px -8px color-mix(in oklab, var(--primary-900) 60%, transparent)" }
                  : undefined
              }
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
      <p className="mt-2 text-center text-[10px] text-text-muted">
        Tekan Enter untuk kirim · Shift + Enter baris baru
      </p>
    </div>
  );
}

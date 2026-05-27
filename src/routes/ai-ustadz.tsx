import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, Plus, Sparkles, Square, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/ai-ustadz")({
  component: AIUstadz,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Bagaimana tata cara sholat tahajud?",
  "Doa pembuka rezeki yang shahih",
  "Adab membaca Al-Qur'an",
  "Hukum puasa di hari Jumat",
];

function AIUstadz() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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

  return (
    <div className="relative flex h-[100dvh] flex-col bg-surface overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 h-[55vh] -z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, color-mix(in oklab, var(--primary-500) 22%, transparent), transparent 70%), radial-gradient(40% 35% at 65% 70%, color-mix(in oklab, var(--gold-400) 22%, transparent), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3">
        <Link
          to="/home"
          aria-label="Kembali"
          className="flex h-10 w-10 items-center justify-center rounded-pill bg-card border border-border press"
        >
          <ChevronLeft className="h-5 w-5 text-text-primary" />
        </Link>
        <div className="flex items-center gap-2 rounded-pill bg-card/70 border border-border px-3 py-1.5 backdrop-blur">
          <span className="flex h-6 w-6 items-center justify-center rounded-pill bg-gradient-to-br from-primary-500 to-primary-900 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold text-text-primary">AI Ustadz</span>
        </div>
        <div className="h-10 w-10" />
      </header>

      {/* Body */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-5">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center pb-32 text-center">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-pill bg-text-primary/90 px-1 py-1 pr-3 text-xs font-medium text-white"
            >
              <span className="rounded-pill bg-gold-400 px-2.5 py-1 text-[11px] font-bold text-text-primary">
                Baru
              </span>
              Tanya seputar Islam dengan adab
            </Link>
            <h2 className="mt-5 px-4 text-2xl font-bold leading-tight text-text-primary">
              Assalamu'alaikum,
              <br />
              ada yang ingin ditanyakan?
            </h2>
            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              Dalil, fiqh, doa, dan adab — semua dengan referensi yang jelas.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4 py-4">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} streaming={loading && i === messages.length - 1 && m.role === "assistant"} />
            ))}
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
            <div className="h-32" />
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="relative z-10 px-4 pb-6 pt-2">
        {isEmpty && (
          <div className="mx-auto mb-3 flex max-w-2xl flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-pill border border-border bg-card/70 px-3 py-1.5 text-xs text-text-secondary backdrop-blur press hover:text-text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mx-auto max-w-2xl rounded-card border border-border bg-card p-3"
          style={{ boxShadow: "var(--shadow-float)" }}
        >
          <textarea
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
            className="w-full resize-none bg-transparent px-1 py-1 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Lampirkan"
              className="flex h-9 w-9 items-center justify-center rounded-pill bg-card2 text-text-secondary press"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Suara"
                className="flex h-9 w-9 items-center justify-center rounded-pill bg-card2 text-text-secondary press"
              >
                <Mic className="h-4 w-4" />
              </button>
              {loading ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Hentikan"
                  className="flex h-10 w-10 items-center justify-center rounded-pill bg-text-primary text-white press"
                >
                  <Square className="h-4 w-4" fill="currentColor" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Kirim"
                  className="flex h-10 w-10 items-center justify-center rounded-pill bg-gradient-to-br from-primary-500 to-primary-900 text-white press disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ role, content, streaming }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-card rounded-br-md bg-primary-900 px-4 py-2.5 text-sm text-primary-foreground">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-gradient-to-br from-primary-500 to-primary-900 text-white">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="prose prose-sm max-w-[85%] rounded-card rounded-tl-md border border-border bg-card px-4 py-3 text-sm text-text-primary prose-headings:text-text-primary prose-strong:text-text-primary prose-p:my-2 prose-li:my-0.5 prose-a:text-primary-500">
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
    </div>
  );
}

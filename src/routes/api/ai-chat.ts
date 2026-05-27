import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Anda adalah "AI Ustadz" pada aplikasi Nusantara Edu — asisten Islami yang ramah, berbahasa Indonesia, dan menjawab dengan adab.
Aturan:
- Jawablah dengan bahasa yang sopan, sederhana, dan mudah dipahami.
- Sertakan dalil (Al-Qur'an / Hadits) bila relevan, beserta sumbernya secara ringkas.
- Bila pertanyaan menyangkut khilafiyah (perbedaan mazhab), sampaikan pandangan utama secara seimbang.
- Untuk masalah hukum yang berat atau pribadi (mis. talak, waris rumit), sarankan konsultasi langsung dengan ustadz/ulama.
- Gunakan format markdown ringan: judul kecil, bullet, dan **tebal** untuk penekanan.
- Buka dengan salam hanya pada balasan pertama jika user juga bersalam.`;

export const Route = createFileRoute("/api/ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages: Msg[] };
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "LOVABLE_API_KEY tidak tersedia" }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              stream: true,
              messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            }),
          });

          if (!upstream.ok) {
            if (upstream.status === 429) {
              return new Response(
                JSON.stringify({ error: "Terlalu banyak permintaan. Coba lagi sebentar." }),
                { status: 429, headers: { "content-type": "application/json" } },
              );
            }
            if (upstream.status === 402) {
              return new Response(
                JSON.stringify({ error: "Kuota AI habis. Tambahkan kredit pada workspace." }),
                { status: 402, headers: { "content-type": "application/json" } },
              );
            }
            const t = await upstream.text();
            return new Response(JSON.stringify({ error: "Gateway error", detail: t }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          return new Response(upstream.body, {
            headers: { "content-type": "text/event-stream" },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});

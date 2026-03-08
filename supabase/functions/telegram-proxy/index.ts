import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
const LOCAL_BOT_URL = Deno.env.get("LOCAL_BOT_URL"); // e.g., https://your-tunnel.ngrok.io/notify

serve(async (req) => {
    try {
        const payload = await req.json();
        const message = payload.message || "New notification from Megumi Massaje";

        console.log(`Processing notification: ${message}`);

        // --- Step 1: Try Local Bot (if URL is provided) ---
        if (LOCAL_BOT_URL) {
            try {
                console.log(`Attempting to reach local bot at ${LOCAL_BOT_URL}...`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

                const localResponse = await fetch(LOCAL_BOT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message, chat_id: TELEGRAM_CHAT_ID }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (localResponse.ok) {
                    console.log("✅ Successfully sent via local bot.");
                    return new Response(JSON.stringify({ status: "sent_via_local" }), { status: 200 });
                }
                console.warn(`Local bot returned status ${localResponse.status}. Falling back...`);
            } catch (err) {
                console.warn("⚠️ Local bot unreachable or timed out. Falling back to direct Telegram API.");
            }
        } else {
            console.log("ℹ️ No LOCAL_BOT_URL configured. Using direct Telegram API.");
        }

        // --- Step 2: Fallback to Direct Telegram API ---
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            throw new Error("Missing Telegram configuration (Token or Chat ID)");
        }

        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const tgResponse = await fetch(telegramApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            }),
        });

        if (!tgResponse.ok) {
            const errorText = await tgResponse.text();
            throw new Error(`Telegram API Error: ${errorText}`);
        }

        console.log("✅ Successfully sent via direct Telegram API.");
        return new Response(JSON.stringify({ status: "sent_via_telegram_api" }), { status: 200 });

    } catch (error) {
        console.error("❌ Error in telegram-proxy:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});

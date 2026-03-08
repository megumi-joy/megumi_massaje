import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Handles incoming webhooks from Supabase and sends a Telegram message.
 * Setup Instructions:
 * 1. Create a Bot in Telegram via @BotFather and get the BOT_TOKEN
 * 2. Get your Chat ID from @userinfobot or similar on Telegram
 * 3. Add secrets to Supabase:
 *    supabase secrets set TELEGRAM_BOT_TOKEN="your_token_here"
 *    supabase secrets set TELEGRAM_CHAT_ID="your_chat_id_here"
 * 4. Deploy this function:
 *    supabase functions deploy telegram-notification --no-verify-jwt
 * 5. Create a Database Webhook in Supabase to trigger this function on INSERT to your bookings table.
 */

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

serve(async (req) => {
    try {
        // We only accept POST requests from Supabase Webhooks
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
        }

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables.");
            return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
        }

        // Parse the JSON payload coming from the Supabase webhook
        const payload = await req.json();

        // Webhooks send { type: "INSERT", table: "bookings", schema: "public", record: { ... } }
        // We only care about the new record inserted.
        const booking = payload.record;

        if (!booking) {
            return new Response(JSON.stringify({ error: 'No record found in payload' }), { status: 400 });
        }

        // --- Customize this message format based on your bookings table columns ---
        // Assuming you have columns like name, email, phone, date, time, service
        const messageText = `
🎉 *New Booking Received!* 🎉

*Name:* ${booking.name || 'N/A'}
*Email:* ${booking.email || 'N/A'}
*Phone:* ${booking.phone || 'N/A'}
*Date:* ${booking.date || 'N/A'}
*Time:* ${booking.time || 'N/A'}
*Service:* ${booking.service || 'N/A'}

*Notes:* ${booking.notes || 'None'}
`;

        // Telegram Bot API URL for sending messages
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        // Make the request to Telegram
        const response = await fetch(telegramApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText,
                parse_mode: "Markdown", // Allows formatting with *bold*, _italic_, etc.
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Telegram API Error:", errorText);
            throw new Error(`Failed to send Telegram message: ${response.status} ${response.statusText}`);
        }

        return new Response(
            JSON.stringify({ message: "Telegram notification sent successfully!" }),
            { headers: { "Content-Type": "application/json" }, status: 200 }
        );

    } catch (error) {
        console.error("Error in telegram-notification function:", error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal Server Error' }),
            { headers: { "Content-Type": "application/json" }, status: 500 }
        );
    }
});

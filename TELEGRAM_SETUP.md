# 🛡️ Telegram Bot & Fallback Setup Guide

This guide explains how to set up your local Python bot and the Supabase fallback system.

## 1. Local Python Bot Setup

### Prerequisites
Install the required Python libraries:
```bash
pip install pyTelegramBotAPI flask python-dotenv
```

### Running the Bot
1. Open `bot.py` and ensure you have a `.env` file with your `TELEGRAM_BOT_TOKEN`.
2. Run the bot:
   ```bash
   python bot.py
   ```
3. **Get your Chat ID**: Open Telegram, search for your bot, and send `/start`. The bot will reply with your **Chat ID**.

## 2. Supabase Configuration

### Secrets
Set the following secrets in your Supabase project:
```bash
supabase secrets set TELEGRAM_BOT_TOKEN="your_token"
supabase secrets set TELEGRAM_CHAT_ID="your_chat_id"
# Optional: Set this if you use ngrok to tunnel to your local bot
supabase secrets set LOCAL_BOT_URL="https://your-tunnel.ngrok.io/notify"
```

### Deploying the Proxy Function
```bash
supabase functions deploy telegram-proxy --no-verify-jwt
```

## 3. How the Fallback Works

1. **Local Server is Up**: When a notification is triggered, the Supabase Edge Function tries to hit your `LOCAL_BOT_URL`. If it succeeds, your local bot sends the message.
2. **Local Server is Down**: If the Edge Function cannot reach your local server (due to timeout or connection error), it automatically sends the message directly using the Telegram API. 

> [!TIP]
> To test the fallback, stop your local `bot.py` script and trigger a notification. You should still receive the Telegram message!

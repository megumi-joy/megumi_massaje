import telebot
import os
import threading
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

if not BOT_TOKEN:
    print("❌ TELEGRAM_BOT_TOKEN not found.")
    exit(1)

bot = telebot.TeleBot(BOT_TOKEN)
app = Flask(__name__)

# --- Telegram Bot Logic ---

@bot.message_handler(commands=['start', 'id'])
def handle_start(message):
    chat_id = message.chat.id
    bot.reply_to(message, f"👋 Your Chat ID is: `{chat_id}`", parse_mode='Markdown')
    print(f"✅ Provided Chat ID {chat_id} to user.")

@bot.message_handler(func=lambda m: True)
def handle_all(message):
    chat_id = message.chat.id
    bot.reply_to(message, f"Received! Your Chat ID is `{chat_id}`")

# --- Flask Server Logic (for Fallback) ---

@app.route('/notify', methods=['POST'])
def notify():
    """
    Endpoint for the web app to trigger a Telegram message via the local bot.
    """
    data = request.json
    message = data.get('message', 'No message content')
    target_chat_id = data.get('chat_id', CHAT_ID)

    if not target_chat_id:
        return jsonify({"error": "No Chat ID provided"}), 400

    try:
        bot.send_message(target_chat_id, message, parse_mode='Markdown')
        return jsonify({"status": "success", "source": "local_bot"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

def run_bot():
    print("🤖 Bot polling started...")
    bot.infinity_polling()

def run_server():
    print("🌐 Local server started on http://localhost:5000")
    app.run(port=5000, host='0.0.0.0', debug=False, use_reloader=False)

if __name__ == "__main__":
    # Run Bot and Server in separate threads
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    server_thread = threading.Thread(target=run_server, daemon=True)

    bot_thread.start()
    server_thread.start()

    # Keep the main thread alive
    try:
        while True:
            bot_thread.join(timeout=1)
            server_thread.join(timeout=1)
            if not bot_thread.is_alive() or not server_thread.is_alive():
                break
    except KeyboardInterrupt:
        print("\n👋 Stopping...")

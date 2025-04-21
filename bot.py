import os
import json
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import sqlite3

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class PetBot:
    def __init__(self):
        self.token = "8135031305:AAHNRm3-PuG10Prai4z-dYV8N3FzElohCEA"
        self.conn = sqlite3.connect('pets.db', check_same_thread=False)
        self.cursor = self.conn.cursor()
        self._init_database()

    def _init_database(self):
        try:
            # Создание таблицы питомцев
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS pets (
                    user_id INTEGER PRIMARY KEY,
                    level INTEGER DEFAULT 0,
                    actions INTEGER DEFAULT 0,
                    pet TEXT,
                    img TEXT,
                    swipe_count INTEGER DEFAULT 0,
                    is_cracked INTEGER DEFAULT 0,
                    rarity TEXT DEFAULT "common",
                    coins INTEGER DEFAULT 0
                )
            ''')

            # Проверка наличия поля coins, если его нет, добавляем
            try:
                self.cursor.execute('SELECT coins FROM pets LIMIT 1')
            except sqlite3.OperationalError:
                self.cursor.execute('ALTER TABLE pets ADD COLUMN coins INTEGER DEFAULT 0')

            # Создание таблицы для квестов
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS quests (
                    quest_id INTEGER PRIMARY KEY,
                    description TEXT,
                    reward INTEGER
                )
            ''')

            # Создание таблицы для выполнения квестов пользователями
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_quests (
                    user_id INTEGER,
                    quest_id INTEGER,
                    completed INTEGER DEFAULT 0,
                    FOREIGN KEY(user_id) REFERENCES pets(user_id),
                    FOREIGN KEY(quest_id) REFERENCES quests(quest_id)
                )
            ''')

            # Создание таблицы для запросов на обмен питомцами
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS trade_requests (
                    from_user_id INTEGER,
                    to_user_id INTEGER,
                    pet_id INTEGER,
                    status TEXT DEFAULT "pending"
                )
            ''')

            self.conn.commit()

        except Exception as e:
            logger.error(f"Ошибка при инициализации базы данных: {e}")
            raise

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            user_id = update.effective_user.id
            self._init_user(user_id)

            # Получаем данные пользователя из базы
            self.cursor.execute('SELECT pet, img, swipe_count, is_cracked, coins FROM pets WHERE user_id = ?', (user_id,))
            result = self.cursor.fetchone()

            if result:
                pet_name, pet_img, swipe_count, is_cracked, coins = result

                if pet_name:  # Если питомец уже есть
                    msg = f"Твой питомец: {pet_name} 🐾\nУ тебя {coins} монет.\n/reset - начать заново"
                    await update.message.reply_photo(photo=pet_img, caption=msg)
                elif is_cracked:  # Если яйцо разбито, но питомец не выбран
                    await update.message.reply_text("Яйцо разбито, но питомец еще не выбран.")
                else:  # Если игра продолжается
                    await self._send_game_button(update, swipe_count)
            else:
                await self._send_game_button(update, 0)
        except Exception as e:
            logger.error(f"Ошибка в /start: {e}")
            await update.message.reply_text("Произошла ошибка. Попробуйте позже.")

    async def reset(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            user_id = update.effective_user.id
            self.cursor.execute('''UPDATE pets SET level = 0, actions = 0, pet = NULL, img = NULL, swipe_count = 0, is_cracked = 0, coins = 0 WHERE user_id = ?''', (user_id,))
            self.conn.commit()
            await update.message.reply_text("Прогресс сброшен. /start - новое яйцо")
        except Exception as e:
            logger.error(f"Ошибка в /reset: {e}")
            await update.message.reply_text("Произошла ошибка при сбросе прогресса.")

    async def handle_web_data(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            user_id = update.effective_user.id
            data = json.loads(update.message.web_app_data.data)

            swipe_count = data.get("actions", 0)
            is_cracked = swipe_count >= 10

            self.update_progress(user_id, swipe_count, is_cracked)

            if data.get("pet"):
                self.cursor.execute('''UPDATE pets SET pet = ?, img = ? WHERE user_id = ?''', (data["pet"], data["img"], user_id))
                self.conn.commit()
                await update.message.reply_text(f"Питомец {data['pet']} сохранён!")
            else:
                await update.message.reply_text("Прогресс сохранён!")
        except Exception as e:
            logger.error(f"Ошибка при обработке данных Web App: {e}")
            await update.message.reply_text("Произошла ошибка при сохранении данных.")

    def _init_user(self, user_id):
        self.cursor.execute('''INSERT OR IGNORE INTO pets (user_id, level, actions, pet, img, swipe_count, is_cracked, rarity, coins) VALUES (?, 0, 0, NULL, NULL, 0, 0, "common", 0)''', (user_id,))
        self.conn.commit()

    def update_progress(self, user_id, swipe_count, is_cracked=False):
        self.cursor.execute('''UPDATE pets SET swipe_count = ?, is_cracked = ? WHERE user_id = ?''', (swipe_count, int(is_cracked), user_id))
        self.conn.commit()

    async def _send_game_button(self, update, swipe_count):
        url = f"https://maximus9431.github.io/game/?swipe_count={swipe_count}"
        await update.message.reply_text(
            "Вылупи своего питомца! 🥚",
            reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("▶️ Играть", web_app={"url": url})]])
        )

if __name__ == "__main__":
    bot = PetBot()
    app = Application.builder().token(bot.token).build()

    app.add_handler(CommandHandler("start", bot.start))
    app.add_handler(CommandHandler("reset", bot.reset))
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, bot.handle_web_data))

    print("Бот запущен")
    app.run_polling()

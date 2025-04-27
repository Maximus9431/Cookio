from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Временное хранилище данных пользователей
users = {}

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect("progress.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            user_id TEXT PRIMARY KEY,
            quests_completed INTEGER,
            battles_won INTEGER
        )
    """)
    conn.commit()
    conn.close()

# Получение данных пользователя
@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = users.get(user_id, {
        "coins": 0,
        "energy": 100,
        "hunger": 50,
        "mood": 80,
        "inventory": []
    })
    return jsonify(user)

# Обновление данных пользователя
@app.route('/api/user/<int:user_id>', methods=['POST'])
def update_user(user_id):
    data = request.json
    users[user_id] = data
    return jsonify({"status": "success"})

@app.route("/get_progress", methods=["GET"])
def get_progress():
    user_id = request.args.get("user_id")
    conn = sqlite3.connect("progress.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM progress WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify({"user_id": row[0], "quests_completed": row[1], "battles_won": row[2]})
    else:
        return jsonify({"error": "User not found"}), 404

@app.route("/update_progress", methods=["POST"])
def update_progress():
    data = request.json
    user_id = data["user_id"]
    quests_completed = data["quests_completed"]
    battles_won = data["battles_won"]

    conn = sqlite3.connect("progress.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO progress (user_id, quests_completed, battles_won)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
        quests_completed = excluded.quests_completed,
        battles_won = excluded.battles_won
    """, (user_id, quests_completed, battles_won))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
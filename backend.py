from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Временное хранилище данных пользователей
users = {}

def generate_rarity():
    roll = random.randint(1, 100)
    if roll <= 60:
        return "common"
    elif roll <= 85:
        return "rare"
    elif roll <= 95:
        return "epic"
    else:
        return "legendary"

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

@app.route('/api/auth', methods=['POST'])
def auth_user():
    data = request.json
    telegram_id = data.get("telegram_id")
    if telegram_id not in users:
        users[telegram_id] = {
            "coins": 0,
            "energy": 100,
            "hunger": 50,
            "mood": 80,
            "inventory": [],
            "pets": []
        }
    return jsonify({"status": "success", "user": users[telegram_id]})

@app.route('/api/hatch', methods=['POST'])
def hatch_pet():
    data = request.json
    telegram_id = data.get("telegram_id")
    pet_id = data.get("pet_id")
    rarity = generate_rarity()  # Используем функцию для генерации редкости
    pet = {
        "id": pet_id,
        "level": 1,
        "strength": 10,
        "hunger": 50,
        "mood": 80,
        "rarity": rarity
    }
    users[telegram_id]["pets"].append(pet)
    return jsonify({"status": "success", "pet": pet})

@app.route('/api/currency', methods=['POST'])
def update_currency():
    data = request.json
    telegram_id = data.get("telegram_id")
    amount = data.get("amount")
    users[telegram_id]["coins"] += amount
    return jsonify({"status": "success", "coins": users[telegram_id]["coins"]})

@app.route('/api/pvp', methods=['POST'])
def pvp_battle():
    data = request.json
    player1 = users[data["player1_id"]]
    player2 = users[data["player2_id"]]
    # Простой алгоритм боя
    winner = player1 if player1["pets"][0]["strength"] > player2["pets"][0]["strength"] else player2
    return jsonify({"winner": winner})

@app.route('/api/quests', methods=['GET'])
def get_quests():
    return jsonify([
        {"id": 1, "description": "Победи 3 врагов", "reward": 50},
        {"id": 2, "description": "Покорми питомца 2 раза", "reward": 20}
    ])

if __name__ == '__main__':
    app.run(debug=True)
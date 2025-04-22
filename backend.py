from flask import Flask, request, jsonify

app = Flask(__name__)

# Пример базы данных (замените на реальную БД)
players = {}

@app.route('/api/hatch', methods=['POST'])
def hatch_pet():
    data = request.json
    user_id = data.get('telegram_id')
    pet_id = data.get('pet_id')

    # Сохраняем питомца
    players[user_id] = {
        'pet': {'id': pet_id, 'level': 1, 'strength': 10, 'hunger': 50, 'emotions': 50},
        'currency': 0
    }

    return jsonify({"success": True, "message": "Pet hatched!", "pet_id": pet_id})

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, request, jsonify

app = Flask(__name__)

# Временное хранилище данных пользователей
users = {}

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

if __name__ == '__main__':
    app.run(debug=True)
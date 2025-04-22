from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Пример хранилища игроков (замени на базу данных в будущем)
players = {}

@app.route('/api/hatch', methods=['POST'])
def hatch_pet():
    data = request.json
    telegram_id = str(data.get("telegram_id"))
    pet_id = data.get("pet_id")

    if telegram_id and pet_id:
        players[telegram_id] = {
            "pet_id": pet_id,
            "level": 1,
            "coins": 0
        }
        return jsonify({"status": "ok", "pet_id": pet_id})
    return jsonify({"status": "error"}), 400

if __name__ == '__main__':
    app.run(debug=True)



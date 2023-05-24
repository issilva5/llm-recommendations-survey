from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from src.recommenders import get_recommendations

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/recommendations', methods=['POST'])
def recommendations():
    request_data = request.get_json()
    return get_recommendations(request_data)

@app.route('/evaluation', methods=['POST'])
def evaluation():
    request_data = request.get_json()
    print(request_data)
    return ""

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=os.getenv("PORT"))
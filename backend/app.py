from flask import Flask, request
from flask_cors import CORS

import open_ai

app = Flask(__name__)
CORS(app)

@app.route('/recommendations', methods=['POST'])
def recommendations():
    request_data = request.get_json()
    return open_ai.ask_recommendations(request_data)

@app.route('/evaluation', methods=['POST'])
def evaluation():
    request_data = request.get_json()
    print(request_data)
    return ""

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
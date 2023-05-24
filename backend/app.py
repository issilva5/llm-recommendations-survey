from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from src.recommenders import get_recommendations
from src.database import ExperimentDatabase

load_dotenv()
app = Flask(__name__)
CORS(app)

bd = ExperimentDatabase('gptrecexp', 'adminuser', 'adminpass', 'localhost', 5432)

@app.route('/recommendations', methods=['POST'])
def recommendations():
    request_data = request.get_json()
    session_id = request.headers.get('Llm-Rec-Session-Id')
    
    for movie in request_data['1']:
        bd.insert_preference(session_id, movie['Title'], True)

    for movie in request_data['2']:
        bd.insert_preference(session_id, movie['Title'], False)

    recommendations = get_recommendations(request_data)
    for i, rec in enumerate(recommendations['recommendations']):
        bd.insert_recommendation(session_id, i, rec['title'], rec['shouldWatch'], rec['userBasedExplanation'],
                                 rec['explanation'], rec['recommender'])
    
    return recommendations

"""
'rec-eval1': {'1': 'false', '2': 5, '3': 5, '4': 5, '5': 5}, 'rec-eval2': {'1': 'false', '2': 5, '3': 5, '4': 5, '5': 5}, 'rec-eval3': {'1': 'true', '2': 5, '3': 5, '4': 5, '5': 5}, 'rec-eval4': {'1': 'false', '2': 5, '3': 5, '4': 5, '5': 5}, 'rec-eval5': {'1': 'true', '2': 5, '3': 5, '4': 5, '5': 5}, 'rec-eval6': {'1': 'false', '2': 5, '3': 5, '4': 5, '5': 5}}
"""

@app.route('/evaluation', methods=['POST'])
def evaluation():
    request_data = request.get_json()
    session_id = request.headers.get('Llm-Rec-Session-Id')
    number_of_evaluations = 6
    for i in range(1, number_of_evaluations+1):
        eval_resp = request_data[f'rec-eval{i}']
        for k, v in eval_resp.items():
            bd.insert_evaluation(session_id, i, int(k), v)
    return ""

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=os.getenv("PORT"))
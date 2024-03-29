from flask import Flask, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os

from src.recommenders import get_recommendations
from src.database import ExperimentDatabase

load_dotenv()
app = Flask(__name__)
CORS(app)

bd = ExperimentDatabase('gptrecexp', os.getenv('BD_USER'), os.getenv('BD_PASS'), 'localhost', 5432)

@app.route('/register', methods=['POST'])
def register():
    prolific_pid = request.headers.get('Prolific-Pid')
    study_id = request.headers.get('Study-Id')
    session_id = request.headers.get('Session-Id')

    if prolific_pid == "null" or study_id  == "null" or session_id == "null":
        return {"error": "PROLIFIC ID not found!"}
    
    if bd.exists_participant(prolific_pid):
        return {"error": f"Participant with PROLIFIC_ID {prolific_pid} has already answered."}

    bd.insert_participant(prolific_pid, study_id, session_id)
    
    return {"message": "All done!"}

@app.route('/recommendations', methods=['POST'])
def recommendations():

    request_data = request.get_json()
    prolific_pid = request.headers.get('Prolific-Pid')

    if prolific_pid == "null":
        return {"error": "PROLIFIC ID not found!"}

    if not bd.exists_participant(prolific_pid, 'started'):
        return {"error": f"Participant with PROFILIC_PID {prolific_pid} is not registered."}
    
    for movie in request_data['1']:
        bd.insert_preference(prolific_pid, movie['Title'], True)

    for movie in request_data['2']:
        bd.insert_preference(prolific_pid, movie['Title'], False)

    recommendations = get_recommendations(request_data)
    for i, rec in enumerate(recommendations['recommendations']):
        bd.insert_recommendation(prolific_pid, i, rec['title'], rec['shouldWatch'], rec['userBasedExplanation'],
                                 rec['explanation'], rec['recommender'])
    
    bd.update_participant_status(prolific_pid, 'recs')
    return recommendations

@app.route('/evaluation', methods=['POST'])
def evaluation():
    request_data = request.get_json()
    prolific_pid = request.headers.get('Prolific-Pid')

    if prolific_pid == "null":
        return {"error": "PROLIFIC ID not found!"}

    if not bd.exists_participant(prolific_pid, 'recs'):
        return {"error": f"Participant with PROFILIC_PID {prolific_pid} is not registered."}

    number_of_evaluations = 6
    for i in range(1, number_of_evaluations+1):
        eval_resp = request_data[f'rec-eval{i}']
        for k, v in eval_resp.items():
            bd.insert_evaluation(prolific_pid, i-1, int(k), v)
    
    bd.update_participant_status(prolific_pid, 'finished')
    return ""

@app.route('/data', methods=['GET'])
def data():

    admin_id = request.args.get('admin_id')
    if admin_id != os.getenv('ADMIN_ID'):
        return "Forbidden", 401

    zipfile_name = bd.retrive_data()
    return send_file(zipfile_name,
                 mimetype='zip',
                 download_name=zipfile_name.split('/')[1],
                 as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=os.getenv("PORT"))
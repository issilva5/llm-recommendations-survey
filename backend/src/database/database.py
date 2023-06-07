import psycopg2
import pandas as pd
import zipfile
import time

class ExperimentDatabase():

    def __init__(self, dbname, user, password, host, port) -> None:
        self.conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )

        self.create_participants_table()
        self.create_preferences_table()
        self.create_evaluation_table()
        self.create_recommendation_table()

    def create_participants_table(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''CREATE TABLE IF NOT EXISTS "participants" (
                                prolificPID TEXT PRIMARY KEY,
                                studyID TEXT,
                                sessionID TEXT,
                                created_at timestamp with time zone not null default CURRENT_TIMESTAMP
                            )''')
            self.conn.commit()
            cursor.close()
            print("participants table created successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while creating the preferences table:", error)

    def insert_participant(self, prolific_id, study_id, session_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO "participants" (prolificPID, studyID, sessionID)
                            VALUES (%s, %s, %s)''', (prolific_id, study_id, session_id))
            self.conn.commit()
            cursor.close()
            print("participant data inserted successfully.")
        except psycopg2.IntegrityError as error:
            raise Exception(f"Participant with PROLIFIC_ID {prolific_id} has already answered.")
        except (Exception, psycopg2.Error) as error:
            print("Error while inserting preference data:", error)
    
    def exists_participant(self, prolific_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f"SELECT * FROM participants WHERE prolificPID = \'{prolific_id}\'")
            rows = cursor.fetchall()
            cursor.close()
            return len(rows) != 0
        except (Exception, psycopg2.Error) as error:
            print("Error while retrieving preference data:", error)
            return []
    
    def get_participants(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM "participants"')
            rows = cursor.fetchall()
            cursor.close()
            return rows
        except (Exception, psycopg2.Error) as error:
            print("Error while retrieving preference data:", error)
            return []

    def create_preferences_table(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''CREATE TABLE IF NOT EXISTS "preferences" (
                                prolificPID TEXT,
                                movieTitle TEXT,
                                liked BOOLEAN,
                                created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
                                PRIMARY KEY (prolificPID, movieTitle),
                                CONSTRAINT fk_participant
                                    FOREIGN KEY(prolificPID) 
                                    REFERENCES participants(prolificPID)
                            )''')
            self.conn.commit()
            cursor.close()
            print("preferences table created successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while creating the preferences table:", error)

    def insert_preference(self, prolific_pid, movie_title, liked):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO "preferences" (prolificPID, movieTitle, liked)
                            VALUES (%s, %s, %s)''', (prolific_pid, movie_title, liked))
            self.conn.commit()
            cursor.close()
            print("preference data inserted successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while inserting preference data:", error)

    def get_preferences(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM "preferences"')
            rows = cursor.fetchall()
            cursor.close()
            return rows
        except (Exception, psycopg2.Error) as error:
            print("Error while retrieving preference data:", error)
            return []

    def create_recommendation_table(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''CREATE TABLE IF NOT EXISTS Recommendation (
                                prolificPID TEXT,
                                recID INTEGER,
                                movieTitle TEXT,
                                shouldWatch BOOLEAN,
                                userBasedExp BOOLEAN,
                                explanation TEXT,
                                recommender TEXT,
                                created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
                                PRIMARY KEY (prolificPID, recID),
                                CONSTRAINT fk_participant
                                    FOREIGN KEY(prolificPID) 
                                    REFERENCES participants(prolificPID)
                            )''')
            self.conn.commit()
            cursor.close()
            print("Recommendation table created successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while creating the Recommendation table:", error)

    def insert_recommendation(self, profilic_pid, rec_id, movie_title, should_watch, user_based_exp, explanation, recommender):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO Recommendation (prolificPID, recID, movieTitle, shouldWatch, userBasedExp, explanation, recommender)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)''', (profilic_pid, rec_id, movie_title, should_watch, user_based_exp, explanation, recommender))
            self.conn.commit()
            cursor.close()
            print("Recommendation data inserted successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while inserting recommendation data:", error)

    def get_recommendations(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM Recommendation")
            rows = cursor.fetchall()
            cursor.close()
            return rows
        except (Exception, psycopg2.Error) as error:
            print("Error while retrieving recommendation data:", error)
            return []

    def create_evaluation_table(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''CREATE TABLE IF NOT EXISTS Evaluation (
                    prolificPID TEXT,
                    recID INTEGER,
                    questionNumber INTEGER,
                    response TEXT,
                    created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
                    PRIMARY KEY (prolificPID, recID, questionNumber),
                    CONSTRAINT fk_participant
                        FOREIGN KEY(prolificPID) 
                        REFERENCES participants(prolificPID)
                )''')
            self.conn.commit()
            cursor.close()
            print("Evaluation table created successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while creating the Evaluation table:", error)

    def insert_evaluation(self, prolific_pid, rec_id, question_number, response):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO Evaluation (prolificPID, recID, questionNumber, response)
                            VALUES (%s, %s, %s, %s)''', (prolific_pid, rec_id, question_number, response))
            self.conn.commit()
            cursor.close()
            print("Evaluation data inserted successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while inserting evaluation data:", error)

    def get_evaluations(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM Evaluation")
            rows = cursor.fetchall()
            cursor.close()
            return rows
        except (Exception, psycopg2.Error) as error:
            print("Error while retrieving evaluation data:", error)
            return []
    
    def retrive_data(self):

        participants = pd.DataFrame(self.get_participants(), columns=['prolificPID', 'studyID', 'sessionID'])
        preferences = pd.DataFrame(self.get_preferences(), columns=['prolificPID', 'movieTitle', 'liked'])
        recommendations = pd.DataFrame(self.get_recommendations(), columns=['prolificPID', 'recID', 'movieTitle', 'shouldWatch', 'userBasedExp', 'explanation', 'recommender'])
        evaluations = pd.DataFrame(self.get_evaluations(), columns=['prolificPID', 'recID', 'questionNumber', 'response'])
        
        zipfile_name = 'data/bd_data_' + str(int(time.time())) + '.zip'
        with zipfile.ZipFile(zipfile_name, 'w') as csv_zip:
            csv_zip.writestr('participants.csv', participants.to_csv(index=False))
            csv_zip.writestr('preferences.csv', preferences.to_csv(index=False))
            csv_zip.writestr('recommendations.csv', recommendations.to_csv(index=False))
            csv_zip.writestr('evaluations.csv', evaluations.to_csv(index=False))

        return zipfile_name
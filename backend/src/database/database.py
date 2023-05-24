import psycopg2

class ExperimentDatabase():

    def __init__(self, dbname, user, password, host, port) -> None:
        self.conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )

        self.create_preferences_table()
        self.create_evaluation_table()
        self.create_recommendation_table()

    def create_preferences_table(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''CREATE TABLE IF NOT EXISTS "preferences" (
                                sessionID UUID,
                                movieTitle TEXT,
                                liked BOOLEAN,
                                PRIMARY KEY (sessionID, movieTitle)
                            )''')
            self.conn.commit()
            cursor.close()
            print("preferences table created successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while creating the preferences table:", error)

    def insert_preference(self, session_id, movie_title, liked):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO "preferences" (sessionID, movieTitle, liked)
                            VALUES (%s, %s, %s)''', (session_id, movie_title, liked))
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
                                sessionID UUID,
                                recID INTEGER,
                                movieTitle TEXT,
                                shouldWatch BOOLEAN,
                                userBasedExp BOOLEAN,
                                explanation TEXT,
                                recommender TEXT,
                                PRIMARY KEY (sessionID, recID)
                            )''')
            self.conn.commit()
            cursor.close()
            print("Recommendation table created successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while creating the Recommendation table:", error)

    def insert_recommendation(self, session_id, rec_id, movie_title, should_watch, user_based_exp, explanation, recommender):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO Recommendation (sessionID, recID, movieTitle, shouldWatch, userBasedExp, explanation, recommender)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)''', (session_id, rec_id, movie_title, should_watch, user_based_exp, explanation, recommender))
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
                    sessionID UUID,
                    recID INTEGER,
                    questionNumber INTEGER,
                    response TEXT,
                    PRIMARY KEY (sessionID, recID, questionNumber)
                )''')
            self.conn.commit()
            cursor.close()
            print("Evaluation table created successfully.")
        except (Exception, psycopg2.Error) as error:
            print("Error while creating the Evaluation table:", error)

    def insert_evaluation(self, session_id, rec_id, question_number, response):
        try:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO Evaluation (sessionID, recID, questionNumber, response)
                            VALUES (%s, %s, %s, %s)''', (session_id, rec_id, question_number, response))
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
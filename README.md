# Leveraging ChatGPT for Automated Human-centered Explanations in Recommender Systems

This repository holds the code for the paper entitled `Leveraging ChatGPT for Automated Human-centered Explanations in Recommender Systems` to be presented at the 29th Annual ACM Conference on Intelligent User Interfaces (IUI 2024). This paper was written by: ITALLO SILVA (Federal University of Campina Grande, Brazil), LEANDRO BALBY MARINHO (Federal University of Campina Grande, Brazil), ALAN SAID (University of Gothenburg, Sweden) and MARTIJN WILLEMSEN (TU Eindhoven & JADS, The Netherlands).

# Running the application

## Create a database

You will need a PostgreSQL Server to run the application's database.

To create the database run:
```shell
sudo -u postgres -i
psql -c 'CREATE DATABASE gptrecexp'
psql -c "CREATE USER adminuser WITH ENCRYPTED PASSWORD 'adminpass'"
psql -c "GRANT ALL PRIVILEGES ON DATABASE psim TO adminuser"
```

There's no need to create tables, once you run the backend they will be automatically created.

Be sure that the PostgreSQL default port is not public before setting up the database. You can also change the user and password for security, if you do this you will need to alter them in the backend environment file.

## Run the backend

1. Enter the `backend` directory.
2. Copy the `.env.example` to a file named `.env`.
3. Replace the dummy information in the `.env` file with the real information.
4. Make sure you have Python 3.8 or higher installed as well as pip.
5. Run `pip install -r requirements.txt` to install the app's required libraries.
6. Run `python app.py`. Now your app should be running in `localhost:PORT`.

## Run the frontend

1. Enter the `frontend` directory.
2. Copy the `.env.example` to a file named `.env`.
3. Replace the dummy information in the `.env` file with the real information.
4. Make sure you have React 18 (may work in higher version) installed as well as npm.
5. Run `npm ci` to install the app's required libraries.
6. Run `npm start`. Now your app should be running in `localhost:PORT`.

# Access the collected data

Once the app is running, the data can be accessed in two ways:
- Connecting to the database and doing SQL queries
- Or using the route `/data?admin_id=ADMIN_ID` from the backend. This route will download the tables from the database as CSV files. The ADMIN_ID must be set in the backend enviroment file.

If you want to access the data collected during our experiment it is available [here](analysis/data).

# Running the analysis

The analysis were made using R. The R Markdown used for the analysis are available [here](analysis/).

# Editing the survey

If you want to customize the survey with your own questions, this can be made by editing the file avalable [here](frontend/src/survey_model.js).

This file export a variable called `survey`. In order to edit the survey, you need to edit this variable.

A **Survey** is composed of pages. A page can be of four types: *text*, *question*, *recommendation* and *rec-question*. The first type will only present textual information. The second will present questions. The third will present a recommendation along with its explanation. And the last one will show a recommendation, its explanation and questions about it.

The questions a page may have can have four types: *text*, *likert*, *boolean* and *search-select*. The first one should be used for textual inputs. The second for likert-scale inputs. The third for boolean input. And the last for search and select movies (replacing movies with other items will request changes in the source code).

Examples of the usage of these elements can be found [here](frontend/src/survey_model.js).

# Running the arguments classification

The script to run the classification is [here](analysis/argument_classification.py). The instructions about how run it are commented in the start of the script. The analysis over the data is available [here](analysis/arguments_classification_analysis.Rmd).

# Contact information

If you have any doubts about the source code or the research, send me an email at itallo@copin.ufcg.edu.br.
import openai
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPEN_API_KEY")
omdb_api_key = os.getenv("OMDB_API_KEY")

def ask_recommendations(preferences):

    prompt = f"""Given the answers for the following questions about movie preferences of a person. Could you recommend they four movies along with an explanation for the recommendation?
    Question 1: What sort of movies do you like?
    Answer 1: {preferences['1']}

    Question 2: Name three of your favorite movies (separeted by semicolon).
    Answer 2: {"; ".join([movie['Title'] for movie in preferences['2']])}

    Question 3: What sort of movies do you dislike?
    Answer 3: {preferences['3']}

    Question 4: Name three of your favorite movies (separeted by semicolon).
    Answer 4: {"; ".join([movie['Title'] for movie in preferences['4']])}

    Write the answer in the format of a JSON file with an array with four objects with the attributes: title, explanation and imdbID. 
    Do not enumerate the movies. Don't put any additional text besides the JSON.
    """

    messages = [
        {
            "role": "system", 
            "content": "You are a helpful assistant that recommends movies to a user based on his previous watched movies."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages,
                                temperature=0, top_p=1, frequency_penalty=0,
                                presence_penalty=0, n = 1)
    
    
    recommendations = json.loads(response["choices"][0]["message"]["content"])
    for movie in recommendations['recommendations']:
        response = requests.get(url = f'http://www.omdbapi.com/?apikey={omdb_api_key}&i={movie["imdbID"]}')
        movie['poster'] = response.json()['Poster']

    return recommendations
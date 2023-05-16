import openai
import os
import json
import requests
import random
import time
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPEN_API_KEY")
omdb_api_key = os.getenv("OMDB_API_KEY")

def ask_recommendations(preferences):

    basePrompt = f"""Given the answers for the following questions about the movie preferences of a person.
    Question 1: What sort of movies do you like?
    Answer 1: {preferences['1']}

    Question 2: Name three of your favorite movies (separeted by semicolon).
    Answer 2: {"; ".join([movie['Title'] for movie in preferences['2']])}

    Question 3: What sort of movies do you dislike?
    Answer 3: {preferences['3']}

    Question 4: Name three of your favorite movies (separeted by semicolon).
    Answer 4: {"; ".join([movie['Title'] for movie in preferences['4']])}

    """

    prompt = basePrompt + """Could you recommend they four movies? Two of these movies should be a recommendation of a movie they must watch and two of movies they should avoid watching.
    Write the answer in the format of a JSON file with the attribute recommendations that is an array with four objects with the attributes: title, imdbID and shouldWatch.
    The title attribute must be the title of the recommended movie and the shouldWatch must be a boolean indicating if it the movie is a recommendation of a movie the user should or not watch. 
    Do not recommend movies given in the user preferences answers.
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
    
    print(response)
    recommendations = json.loads(response["choices"][0]["message"]["content"])
    for movie in recommendations['recommendations']:
        response = requests.get(url = f'http://www.omdbapi.com/?apikey={omdb_api_key}&i={movie["imdbID"]}')
        movie['poster'] = response.json()['Poster']
    
    shouldWatchExps, countSW = random.sample([False,True],2), 0
    dontShouldWatchExps, countDSW = random.sample([False,True],2), 0

    for movie in recommendations['recommendations']:
        if movie['shouldWatch']:
            movie['explanation'] = get_explanation(movie['title'], movie['shouldWatch'], shouldWatchExps[countSW], basePrompt)
            movie['userBasedExplanation'] = shouldWatchExps[countSW]
            countSW += 1
        else:
            movie['explanation'] = get_explanation(movie['title'], movie['shouldWatch'], dontShouldWatchExps[countDSW], basePrompt)
            movie['userBasedExplanation'] = shouldWatchExps[countDSW]
            countDSW += 1

    return recommendations

def get_explanation(movie, shouldWatch, userBased, userBasedBasePrompt):

    time.sleep(30)
    print(movie)

    prompt = f"""Why should {"someone with these preferences" if userBased else "someone"} {"not" if not shouldWatch else ""} watch the movie: {movie}?.
    Write the answer as a plain text with at least 300 and at most 500 characters and without any additional text besides the answer.
    Write the answer explanation as if you was talking to someone, for example: 'You should do this and that'.
    """

    if userBased:
        prompt = userBasedBasePrompt + prompt + "Don't use 'Based on the answers provided' on the explanation."

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages,
                                temperature=0, top_p=1, frequency_penalty=0,
                                presence_penalty=0, n = 1)
    
    return response["choices"][0]["message"]["content"]
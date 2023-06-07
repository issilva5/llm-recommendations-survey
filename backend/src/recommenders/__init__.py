from .gpt_rec import GPTRecommender
from .random_rec import RandomRecommender

import openai
import os
import random
import threading

from openai.error import RateLimitError
import time
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPEN_API_KEY")

def fill_base_prompt(preferences):
    return f"""Given the answers for the following questions about the movie preferences of a person.
    Question 1: Name three of your favorite movies (separated by semicolon).
    Answer 1: {"; ".join([movie['Title'] for movie in preferences['1']])}

    Question 2: Name three movies that you really disliked or hated (separated by semicolon).
    Answer 2: {"; ".join([movie['Title'] for movie in preferences['2']])}

    """

def get_gpt_recs(preferences):

    gptRec = GPTRecommender()

    basePrompt = fill_base_prompt(preferences)

    prompt = basePrompt + """Could you recommend they four movies? Two of these movies should be a recommendation of a movie they must watch and two of movies they should avoid watching.
    
    Additional instructions:
     1. Write the answer in the format of a JSON file with the attribute recommendations that is an array with four objects with the attributes: title, imdbID and shouldWatch.
     2. The title attribute must be the title of the recommended movie and the shouldWatch must be a boolean indicating if it the movie is a recommendation of a movie the user should or not watch. 
     3. Do not recommend movies given in the user preferences answers.
     4. Do not enumerate the movies.
     5. Don't put any additional text besides the JSON.
    """

    return gptRec.get_recommendations(prompt)

def get_pop_recs(n):
    popRec = RandomRecommender("data/imdb-top50-per-genre-votes.csv")
    return popRec.get_recommendations(n)

def get_recommendations(preferences):

    gptRecs = get_gpt_recs(preferences)
    popRecs = get_pop_recs(2)

    shouldWatchRecommendations = [r for r in gptRecs if r['shouldWatch']] + popRecs
    shouldNotWatchRecommendations = [r for r in gptRecs + popRecs if not r['shouldWatch']]

    userBasedExplanationsSW = random.sample([False,True],2) + random.sample([False,True],2)
    userBasedExplanationsSNW = random.sample([False,True],2)

    basePrompt = fill_base_prompt(preferences)

    threads = []
    explanations = {}

    for i, movie in enumerate(shouldWatchRecommendations):
        movie['userBasedExplanation'] = userBasedExplanationsSW[i]
        threads.append(
            threading.Thread(target=get_explanation,
                             args=(movie['title'], 
                                   True, 
                                   userBasedExplanationsSW[i],
                                   basePrompt,
                                   explanations,))
        )
    
    for i, movie in enumerate(shouldNotWatchRecommendations):
        movie['userBasedExplanation'] = userBasedExplanationsSNW[i]
        threads.append(
            threading.Thread(target=get_explanation,
                             args=(movie['title'], 
                                   False, 
                                   userBasedExplanationsSNW[i],
                                   basePrompt,
                                   explanations,))
        )
    
    for t in threads:
        t.start()
    
    for t in threads:
        t.join()

    random.shuffle(shouldWatchRecommendations)
    movie_recs = shouldWatchRecommendations + shouldNotWatchRecommendations
    for movie in movie_recs:
        movie['explanation'] = explanations[movie['title']]
    
    recommendations = {'recommendations': movie_recs}
    
    return recommendations

def get_explanation(movie, shouldWatch, userBased, userBasedBasePrompt, explanations):

    print(movie)

    prompt = f"""Why should {"someone with these preferences" if userBased else "someone"} {"not" if not shouldWatch else ""} watch the movie: {movie}?.
    
    Additional instructions:
     1. Write the answer as a plain text with at least 300 and at most 350 characters and without any additional text besides the answer.
     2. Write the explanation as if you was talking to someone, for example: 'You may like this and that'.
     {"3. Don't use 'Based on the answers provided' on the explanation." if userBased else ""}
    """

    if userBased:
        prompt = userBasedBasePrompt + prompt

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

    done = False
    while not done:
        try:

            response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages,
                                        temperature=0, top_p=1, frequency_penalty=0,
                                        presence_penalty=0, n = 1)
            done = True
        
        except RateLimitError:
            print(f'Going to sleep - {movie}')
            time.sleep(60)
    
    explanations[movie] = response["choices"][0]["message"]["content"]
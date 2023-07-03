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

REC_NOVELTY = ['popular', 'novel', 'surprising', 'challenging', 'unexpected']
EXP_GOAL = ['entertaining', 'convincing', 'transparent', 'trustworthy', 'effective']

def fill_base_prompt(preferences):

    prompt = "Given a person with the following movie preferences."

    if (len(preferences['1']['a']) > 0):
        prompt += f"""\nLiked movies: {"; ".join([movie['Title'] for movie in preferences['1']['a']])}"""

    if (len(preferences['1']['b']) > 0):
        prompt += f"""\nDisliked movies: {"; ".join([movie['Title'] for movie in preferences['1']['b']])}"""

    prompt += "\n\n"

    return prompt

def get_gpt_recs(preferences):

    gptRec = GPTRecommender()

    basePrompt = fill_base_prompt(preferences)

    prompt = basePrompt + f"""Could you recommend they four movies? Two of these movies should be a recommendation of a movie they must watch and two of movies they should avoid watching.
    
    {f"The recommendations must be {REC_NOVELTY[preferences['2']-1]}." if '2' in preferences else ""}

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
        exp_goal = EXP_GOAL[preferences['3']-1] if '3' in preferences else None
        threads.append(
            threading.Thread(target=get_explanation,
                             args=(movie['title'], 
                                   True, 
                                   userBasedExplanationsSW[i],
                                   basePrompt,
                                   explanations,
                                   exp_goal))
        )
    
    for i, movie in enumerate(shouldNotWatchRecommendations):
        movie['userBasedExplanation'] = userBasedExplanationsSNW[i]
        exp_goal = EXP_GOAL[preferences['3']-1] if '3' in preferences else None
        threads.append(
            threading.Thread(target=get_explanation,
                             args=(movie['title'], 
                                   False, 
                                   userBasedExplanationsSNW[i],
                                   basePrompt,
                                   explanations,
                                   exp_goal))
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

def get_explanation(movie, shouldWatch, userBased, userBasedBasePrompt, explanations, exp_goal):

    print(movie)

    prompt = f"""Why should {"someone with these preferences" if userBased else "someone"} {"not" if not shouldWatch else ""} watch the movie: {movie}?
    
    {f"The explanations must be {exp_goal}." if exp_goal is not None else ""}

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
        
        except RateLimitError as e:
            print(f'Going to sleep - {movie} - {str(e)}')
            time.sleep(60)
    
    explanations[movie] = response["choices"][0]["message"]["content"]
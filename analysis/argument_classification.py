# Script for classifying arguments in explanations
# This scripts was tested in Python 3.10.12 and Python 3.12.3
# Before running this script, please run:
#   pip install pandas==2.2.2 openai==1.45.1 sentence-splitter==1.4
# 
# Insert your openai key in the OPENAI_KEY variable

import pandas as pd

from openai import OpenAI
from sentence_splitter import split_text_into_sentences

from typing import List
from pydantic import BaseModel

# Auxiliary data types

class ArgClassification(BaseModel):
    classification: List[str]

# Prompt generation

def get_explanations_arguments(input_text: str):
    # Full prompt with classes and input instructions
    prompt = """\
Task: You will act as a Classifier. Your task is to identify the type of argument present in each input sentence based on the predefined classes below. Follow the instructions carefully and output your results in the specified format.

CLASSES:

1. No Argument
   Code: NA
   Description: Sentences that do not present an argument.
   Example: "Anna is eating ice cream."

2. Argument from Analogy
   Code: An
   Description: Argues that because two things are similar, what is true of one is also true of the other.
   Example: "Cycling on the grass is prohibited, because walking on the grass is prohibited."

3. Argument from Authority
   Code: Au
   Description: Relies on the opinion of an authority figure as evidence.
   Example: "We only use 10% of our brain, because Einstein said so."

4. Argument from Commitment
   Code: Comm
   Description: States a claim supported by something the addressee has previously said.
   Example: "You said it yourself, we’re the best in the world."

5. Argument from Comparison
   Code: Comp
   Description: Evaluates a situation, object, or idea by comparing it to another.
   Example: "The president in wartime should not be swapped, because horses when crossing streams should not be swapped."

6. Argument from Criterion
   Code: Cr
   Description: Makes an argument considering specific criteria.
   Example: "Haarlem is a better city to visit than Amsterdam because Haarlem has fewer tourists."

7. Argument from Disjuncts
   Code: Di
   Description: Concludes something happened because an alternative did not.
   Example: "He must have gone to the pub, because the interview is canceled."

8. Argument from Effect
   Code: Ef
   Description: Draws from consequences to infer the cause.
   Example: "In the centre of Amsterdam, parking rates must have gone up, because there are more empty spaces on the streets."

9. Argument from Equality
   Code: Eq
   Description: Based on the principle of equality, asserting that similar circumstances should lead to similar treatment.
   Example: "Dutch royals should pay taxes, because every other citizen pays taxes."

10. Argument from Evaluation
    Code: Ev
    Description: Argues based on personal experiences of good/bad or effective/ineffective.
    Example: "You should do paragliding because it is a great experience."

11. Argument from Opposites
    Code: Op
    Description: Concludes something by presenting the persuasiveness of its opposite.
    Example: "Since false statements are persuasive, you should believe the opposite too."

12. Argument from Sign
    Code: Sg
    Description: Asserts that the presence or absence of one thing indicates the presence or absence of another.
    Example: "She likes Patricia because she is looking at her all the time."

13. Argument from Similarity
    Code: Sim
    Description: Infers a fact based on its similarity to another fact.
    Example: "Establishing gun control in present-day U.S. will lead to genocide, because establishing gun control in historical Germany led to genocide."

14. Argumentum ad Populum
    Code: Po
    Description: Asserts something is true or correct because many people think so.
    Example: "Many people said I’m the best writer in the world, so I’m."

15. Pragmatic Argument
    Code: Pra
    Description: Evaluates actions, events, or rules based on their favorable or unfavorable consequences.
    Example: "Sleeping in the dark should be done by children, because sleeping in the dark prevents them from ruining their eyesight."

INPUT FORMAT

You will receive one or more sentences as input. Each sentence represents a potential argument.

INPUT:
"""
    # Split the input text into sentences
    sentences = split_text_into_sentences(input_text, language="en")
    
    # Add each sentence to the INPUT section
    for i, sentence in enumerate(sentences, start=1):
        prompt += f"{i}. {sentence.strip()}\n"
    
    # Add the OUTPUT section to the prompt
    prompt += """
OUTPUT FORMAT

Your output should be a JSON object with the following structure:

{
  "classification": [
    "Code_for_sentence_1",
    "Code_for_sentence_2",
    ...
  ]
}
"""
    return prompt, sentences

# LLM connection

OPENAI_KEY='sk-' # Insert your key here
MODEL = 'gpt-4o-2024-08-06' # If you want to use another model, please change this variable

client = OpenAI(api_key=OPENAI_KEY)

df = pd.read_csv('recommendations.csv')
explanations = df[['prolificPID', 'recID', 'movieTitle', 'shouldWatch', 'recommender', 'explanation']].drop_duplicates()

all_outputs = []
with open('error.log', 'a') as error_log:
    for row in explanations.iterrows():

        row = row[1]

        output = {}
        output['recommender'] = row['recommender']
        output['prolificPID'] = row['prolificPID'] 
        output['recID'] = row['recID']
        output['movieTitle'] = row['movieTitle']
        output['shouldWatch'] = row['shouldWatch']

        try:
            prompt, sentences = get_explanations_arguments(row['explanation'])

            completion = client.chat.completions.create(
                messages= [
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                model=MODEL,
                temperature=0,
                stream=False,
                response_format={"type": "json_object"},
            ).choices[0].message.content

            classifications = ArgClassification.model_validate_json(completion)
            classifications = classifications.model_dump()

            order = 0
            for sentence, classification in zip(sentences, classifications['classification']):
                output['order'] = order
                output['sentence'] = sentence
                output['classification'] = classification
                order += 1
                all_outputs.append(output.copy())

        except Exception as e:
            error_log.write(" ".join([row['recommender'], row['prolificPID'], row['movieTitle'], str(e)]))

        break

df_classifications = pd.DataFrame(all_outputs)
df_classifications.to_csv('arguments_classification.csv', index=False)

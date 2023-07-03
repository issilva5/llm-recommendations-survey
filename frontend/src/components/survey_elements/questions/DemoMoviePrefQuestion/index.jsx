import React, { useState } from 'react';
import Question from '../Question';
import { JSONSet } from '../../../../utils';
import styles from "./style.module.css";

const DemoMoviesQuestion = (props) => {
    const [answers, setAnswers] = useState(props.answer || {'a': new JSONSet(), 'b': new JSONSet()})

    const onAnswer = function(alternative, answer) {

        let invalidMessage = "";

        const newAnswers = {
            ...answers,
            [alternative]: answer
        }

        let intersect = new JSONSet([...newAnswers['a']].filter(i => newAnswers['b'].has(i)));
        if (intersect.size > 0)
            invalidMessage = 'You cannot specify the same movie as liked and disliked.'
        
        let union = new JSONSet([...newAnswers['a'], ...newAnswers['b']])
        if (union.size < props.minSelection)
            invalidMessage = `You need to specify at least ${props.minSelection} movies.`

        setAnswers(newAnswers)
        console.log(newAnswers)
        props.onAnswer(newAnswers, invalidMessage)

    }

    return (
        <>
            <Question 
                questionNumber={'a'}
                questionModel={{
                    title: 'Name up to three movies you like',
                    minSelection: 0,
                    maxSelection: 3,
                    type: 'search-select'
                }}
                onAnswer={onAnswer}
                answer={answers['a']}
                previousInvalidMessage={""}
                subquestion={true}
            />
            <Question 
                questionNumber={'b'}
                questionModel={{
                    title: 'Name up to three movies you dislike',
                    minSelection: 0,
                    maxSelection: 3,
                    type: 'search-select'
                }}
                onAnswer={onAnswer}
                answer={answers['b']}
                previousInvalidMessage={""}
                subquestion={true}
            />
        </>
    );
};

export default DemoMoviesQuestion;
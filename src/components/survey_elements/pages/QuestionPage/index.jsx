import { useState } from "react";
import Question from "../../questions/Question";

function QuestionPage(props) {

    const [answers, setAnswers] = useState(props.answers || {});

    const onAnswer = (number, answer) => {

        const newAnswers = {
            ...answers,
            [number]: answer
        }

        setAnswers(newAnswers)

        props.onAnswer(props.pageNumber, newAnswers)

    }

    return (
        <>
            {
                props.questions.map((question, i) => {
                    return <Question
                        key={i}
                        questionNumber={i + 1}
                        questionModel={question}
                        onAnswer={onAnswer}
                        answer={answers[i+1]}
                    />
                })
            }
        </>
    );

}

export default QuestionPage;
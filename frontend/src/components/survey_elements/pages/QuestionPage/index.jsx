import { useEffect, useState } from "react";
import Question from "../../questions/Question";

const getDefaultInvalidMessages = (startAt, questions) => {
    let invalidMessages = {}
    questions.forEach((q, i) => {
        invalidMessages = {
            ...invalidMessages,
            [startAt+i+1]: q.isRequired ? "This question is mandatory." : ""
        }
    })
    return invalidMessages;
}

function QuestionPage(props) {

    const [answers, setAnswers] = useState(props.answers || {});
    const [invalidQuestions, setInvalidQuestions] = useState(props.invalidMessages || getDefaultInvalidMessages(props.startAt, props.questions));

    useEffect(() => {
        props.onAnswer(props.groupNumber, answers, invalidQuestions);
    }, [])

    const onAnswer = (number, answer, invalidMessage) => {

        const newAnswers = {
            ...answers,
            [number]: answer
        }

        const newValid = {
            ...invalidQuestions,
            [number]: invalidMessage
        }

        setAnswers(newAnswers)
        setInvalidQuestions(newValid)

        props.onAnswer(props.groupNumber, newAnswers, newValid);

    }

    return (
        <>
            {
                props.questions.map((question, i) => {
                    return <Question
                        key={i}
                        questionNumber={props.startAt + i + 1}
                        questionModel={question}
                        onAnswer={onAnswer}
                        answer={answers[i+1]}
                        previousInvalidMessage={invalidQuestions[props.startAt+i+1]}
                    />
                })
            }
        </>
    );

}

export default QuestionPage;
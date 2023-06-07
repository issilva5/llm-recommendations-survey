import { useEffect, useState } from "react";
import Question from "../../questions/Question";
import { JSONSet } from "../../../../utils";

const getDefaultInvalidMessages = (startAt, questions) => {
    let invalidMessages = {}
    questions.forEach((q, i) => {
        invalidMessages = {
            ...invalidMessages,
            [startAt + i + 1]: q.isRequired ? "This question is mandatory." : ""
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
        
        if (props.answersShouldDiff && props.answersShouldDiff[number]) {
            props.answersShouldDiff[number].forEach((question) => {

                if (answers[question]) {

                    let intersect = new JSONSet([...answer].filter(i => answers[question].has(i)));
                    if (intersect.size > 0)
                        invalidMessage = `This answer cannot contain a movie provided in question ${question}`

                }

            })
        }

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
                        negative={props.negative}
                        questionModel={question}
                        onAnswer={onAnswer}
                        answer={answers[props.startAt + i + 1]}
                        previousInvalidMessage={invalidQuestions[props.startAt + i + 1]}
                    />
                })
            }
        </>
    );

}

export default QuestionPage;
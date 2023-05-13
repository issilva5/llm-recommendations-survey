import { useState } from "react";
import Question from "../survey_elements/questions/Question";
import styles from "./style.module.css";

function Survey(props) {

    const [answers, setAnswers] = useState({});

    const onAnswer = (number, answer) => {

        console.log(answers)

        setAnswers(
            {
                ...answers,
                [number]: answer
            }
        )

    }

    return (
        <div className={styles.container}>
            <div className={styles.survey}>
                {
                    props.questions.map((question, i) => {
                        return <Question
                            key={i}
                            questionNumber={i + 1}
                            questionModel={question}
                            onAnswer={onAnswer}
                        />
                    })
                }
            </div>
        </div>
    );

}

export default Survey;
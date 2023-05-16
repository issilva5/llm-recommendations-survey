import { useState } from "react";
import BooleanQuestion from "../BooleanQuestion";
import LikertScaleQuestion from "../LikertQuestion";
import SearchSelectQuestion from "../SearchSelectQuestion";
import TextQuestion from "../TextQuestion";
import styles from "./style.module.css";

function Question({ questionNumber, questionModel, onAnswer, answer, previousInvalidMessage }) {

    const [invalidMessage, setInvalidMessage] = useState(previousInvalidMessage || "");

    const questionTypes = {
        "text": TextQuestion,
        "likert": LikertScaleQuestion,
        "boolean": BooleanQuestion,
        "search-select": SearchSelectQuestion
    };
    
    const QuestionType = questionTypes[questionModel.type];

    const onAnswerQuestion = (answer, invalidMessage = "") => {
        setInvalidMessage(invalidMessage)
        onAnswer(questionNumber, answer, invalidMessage)
    }

    return (
        <div className={styles.question}>
            <p className={styles.questionEnunciation}>
                {questionNumber}. {questionModel.title}
                <span className={styles.required}>
                    {questionModel.isRequired ? '*' : ''}
                </span>
                {invalidMessage !== "" && <span className={styles.invalid}>{invalidMessage}</span>}
            </p>
            <QuestionType 
                onAnswer={onAnswerQuestion}
                answer={answer}
                {...questionModel}
            />
        </div>
    )

}

export default Question;
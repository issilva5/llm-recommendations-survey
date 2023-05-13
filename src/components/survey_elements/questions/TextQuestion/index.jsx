import { useState } from "react";
import styles from "./style.module.css";

function TextQuestion(props) {

    const [length, setLength] = useState(0);

    return (
        <div className={styles.questionTextareaContainer}>
            <textarea
                minLength={props.minLength}
                maxLength={props.maxLength}
                onChange={(e) => {
                    setLength(e.target.value.length)
                    props.onAnswer(e.target.value)
                }}
                className={styles.textQuestionInput}
            />
            {
                props.maxLength !== undefined ?
                    <div className={styles.questionTextareaCounter}>
                        <span>{length}</span>
                        /
                        <span>{props.maxLength}</span>
                    </div>
                    :
                    <></>
            }
        </div>
    );

}

export default TextQuestion;
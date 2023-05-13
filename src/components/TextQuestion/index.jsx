import { useState } from "react";
import styles from "./style.module.css";

function TextQuestion(props) {

    const [length, setLength] = useState(0);

    return (
        <div className={styles.question}>
            <p className={styles.questionEnunciation}>
                {props.no}. {props.title}
                <span className={styles.required}>
                    {props.isRequired ? '*' : ''}
                </span>
            </p>
            <div className={styles.questionTextareaContainer}>
                <textarea
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    onChange={(e) => {
                        setLength(e.target.value.length)
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
        </div>
    );

}

export default TextQuestion;
import { useState } from "react";
import styles from "./style.module.css";

function TextQuestion(props) {

    const [text, setText] = useState(props.answer);
    const [length, setLength] = useState(0);

    const onChangeText = (e) => {
        setLength(e.target.value.length)
        setText(e.target.value)
        props.onAnswer(e.target.value)
    }

    return (
        <div className={styles.questionTextareaContainer}>
            <textarea
                value={text}
                minLength={props.minLength}
                maxLength={props.maxLength}
                onChange={onChangeText}
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
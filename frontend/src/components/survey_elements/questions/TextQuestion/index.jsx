import { useState } from "react";
import styles from "./style.module.css";

function TextQuestion(props) {

    const [text, setText] = useState(props.answer);
    const [length, setLength] = useState(props.answer ? props.answer.length : 0);

    const onChangeText = (e) => {

        const responseLength = e.target.value.length;
        let invalidMessage = "";

        if (responseLength < props.minLength)
            invalidMessage = `This question requires a response of at least ${props.minLength} characters.`

        setLength(responseLength)
        setText(e.target.value)
        props.onAnswer(e.target.value, invalidMessage)
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
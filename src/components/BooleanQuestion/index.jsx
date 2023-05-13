import { useState } from "react";
import styles from "./style.module.css";

function BooleanQuestion(props) {

    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (option) => {
        props.onAnswer(props.no, option + 1);
        setSelectedOption(option);
    };

    return (
        <div className={styles.question}>
            <p className={styles.questionEnunciation}>
                {props.no}. {props.title}
                <span className={styles.required}>
                    {props.isRequired ? '*' : ''}
                </span>
            </p>
            <div className={styles.booleanQuestionOptions}>
                <label>
                    <input
                        type="radio"
                        value="false"
                        checked={selectedOption === 'false'}
                        onChange={(event) => handleOptionChange(event.target.value)}
                    />
                    {props.negativeText || "No"}
                </label>
                <label>
                    <input
                        type="radio"
                        value="true"
                        checked={selectedOption === 'true'}
                        onChange={(event) => handleOptionChange(event.target.value)}
                    />
                    {props.positiveText || "Yes"}
                </label>
            </div>
        </div>
    );

}

export default BooleanQuestion;
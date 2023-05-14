import { useState } from "react";
import styles from "./style.module.css";

function BooleanQuestion(props) {

    const [selectedOption, setSelectedOption] = useState(props.answer);

    const handleOptionChange = (option) => {
        props.onAnswer(option);
        setSelectedOption(option);
    };

    return (
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
    );

}

export default BooleanQuestion;
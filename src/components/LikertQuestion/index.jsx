import { useState } from "react";
import styles from "./style.module.css";

function LikertScaleQuestion(props) {

    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        props.onAnswer(props.no, option+1);
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
            <div className={styles.likertScaleContainer}>
            <div className={styles.likertScaleOptions}>
                {props.options.map((option, i) => (
                    <button
                        key={i}
                        value={i}
                        className={`${styles.likertScaleButton} ${
                        selectedOption === i ? styles.selected : ''
                        }`}
                        onClick={() => handleOptionClick(i)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            </div>
        </div>
    );

}

export default LikertScaleQuestion;
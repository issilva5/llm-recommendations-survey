import { useState } from "react";
import styles from "./style.module.css";

function LikertScaleQuestion(props) {

    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        props.onAnswer(option + 1);
        setSelectedOption(option);
    };

    return (
        <div className={styles.likertScaleContainer}>
            <div className={styles.likertScaleOptions}>
                {props.options.map((option, i) => (
                    <button
                        key={i}
                        value={i}
                        className={`${styles.likertScaleButton} ${selectedOption === i ? styles.selected : ''
                            }`}
                        onClick={() => handleOptionClick(i)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );

}

export default LikertScaleQuestion;
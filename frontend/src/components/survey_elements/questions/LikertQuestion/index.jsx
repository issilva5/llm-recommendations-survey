import { useState } from "react";
import styles from "./style.module.css";

function LikertScaleQuestion(props) {

    const [selectedOption, setSelectedOption] = useState(props.answer - 1);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        props.onAnswer(option + 1);
    };

    return (
        <div className={styles.likertScaleContainer}>
            <div className={styles.likertScaleOptions}>
                {props.options.map((option, i) => (
                    <>
                        <button
                            key={i}
                            value={i}
                            className={`${styles.likertScaleButton} ${selectedOption === i ? styles.selected : ''
                                }`}
                            onClick={() => handleOptionClick(i)}
                        >
                            {option}
                        </button>
                        <label>
                            <input
                                type="radio"
                                value={i}
                                checked={selectedOption === i}
                                onChange={() => handleOptionClick(i)}
                            />
                            {option}
                        </label>
                    </>
                ))}
            </div>
        </div>
    );

}

export default LikertScaleQuestion;
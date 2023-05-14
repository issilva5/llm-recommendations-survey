import BooleanQuestion from "../BooleanQuestion";
import LikertScaleQuestion from "../LikertQuestion";
import SearchSelectQuestion from "../SearchSelectQuestion";
import TextQuestion from "../TextQuestion";
import styles from "./style.module.css";

function Question({ questionNumber, questionModel, onAnswer, answer }) {

    const questionTypes = {
        "text": TextQuestion,
        "likert": LikertScaleQuestion,
        "boolean": BooleanQuestion,
        "search-select": SearchSelectQuestion
    };
    
    const QuestionType = questionTypes[questionModel.type];

    return (
        <div className={styles.question}>
            <p className={styles.questionEnunciation}>
                {questionNumber}. {questionModel.title}
                <span className={styles.required}>
                    {questionModel.isRequired ? '*' : ''}
                </span>
            </p>
            <QuestionType 
                onAnswer={(answer) => onAnswer(questionNumber, answer)}
                answer={answer}
                {...questionModel}
            />
        </div>
    )

}

export default Question;
import Question from "../Question";
import styles from "./style.module.css";

function Survey(props) {

    return (
        <div className={styles.container}>
            <div className={styles.survey}>
                {
                    props.questions.map((question, i) => {
                        return <Question key={i} questionNumber={i+1} questionModel={question} />
                    })
                }
            </div>
        </div>
    );

}

export default Survey;
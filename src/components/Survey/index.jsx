import { useState } from "react";
import styles from "./style.module.css";
import Page from "../survey_elements/pages/Page";

function Survey(props) {

    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    const onAnswer = (pageNumber, answer) => {

        setAnswers(
            {
                ...answers,
                [pageNumber]: answer
            }
        )

    }

    const setPreviousPage = () => {
        setCurrentPage(currentPage => currentPage - 1)
    }

    const setNextPage = () => {
        setCurrentPage(currentPage => currentPage + 1)
    }

    return (
        <div className={styles.container}>
            <div className={styles.survey}>
                {
                    props.pages.map((page, i) => {
                        return <Page
                            key={i}
                            {...page}
                            pageNumber={i}
                            onAnswer={onAnswer}
                            answers={answers[i]}
                            visible={i === currentPage}
                        />
                    })
                }
                {
                    currentPage > 0 ?
                        <button
                            className={styles.previousButton}
                            onClick={setPreviousPage}
                        >Previous</button> :
                        <></>
                }
                {
                    currentPage + 1 < props.pages.length ?
                        <button
                            className={styles.nextButton}
                            onClick={setNextPage}
                        >Next</button> :
                        <></>
                }
            </div>

        </div>
    );

}

export default Survey;
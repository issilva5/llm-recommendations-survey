import { useState } from "react";
import styles from "./style.module.css";
import Page from "../survey_elements/pages/Page";
import Title from "../survey_elements/textual/Title";

function Survey(props) {

    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(undefined);
    const [recommendations, setRecommendations] = useState([]);
    const [invalidPages, setInvalidPages] = useState({});

    const onAnswer = (pageNumber, answer, invalidMessages) => {

        setAnswers(
            {
                ...answers,
                [props.pages[pageNumber].name]: answer
            }
        )

        const newValid = {
            ...invalidPages,
            [pageNumber]: invalidMessages
        }

        setInvalidPages(newValid);

    }

    const setPreviousPage = () => {
        setCurrentPage(currentPage => currentPage - 1)
    }

    const setNextPage = () => {

        setCurrentPage(currentPage => currentPage + 1)

        if (props.pages[currentPage].onNextPage) {
            const action = props.pages[currentPage].onNextPage;
            setLoadingMessage(action[2])
            fetch(`http://${process.env.BACKEND_URL}/${action[1]}`, {
                method: action[0],
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(answers[props.pages[currentPage].name])
            })
                .then(response => response.json())
                .then(response => {
                    setRecommendations(response['recommendations'])
                    setLoadingMessage(undefined)
                })
        }

    }

    const onFinish = () => {

        const action = props.onFinish;

        fetch(`http://${process.env.BACKEND_URL}/${action[1]}`, {
            method: action[0],
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        })

        setCurrentPage(currentPage => currentPage + 1)

    }

    return (
        <>

            <div className={styles.container}>
                <Title title={props.title} />
                <div>
                    {
                        props.pages.map((page, i) => {
                            return <Page
                                key={i}
                                {...page}
                                item={page.itemID < recommendations.length ? recommendations[page.itemID] : page.item}
                                pageNumber={i}
                                invalidMessages={invalidPages[currentPage]}
                                onAnswer={onAnswer}
                                answers={answers[props.pages[i].name]}
                                visible={!loadingMessage && i === currentPage}
                            />
                        })
                    }
                    {
                        loadingMessage && <p>{loadingMessage}</p>
                    }
                </div>
                <div className={styles.buttons}>
                    <div className={styles.leftButtons}>
                        {
                            !props.pages[currentPage].nowayback && (currentPage > 0 ?
                                <button
                                    className={styles.previousButton}
                                    onClick={setPreviousPage}
                                >Previous</button> :
                                <></>)
                        }
                    </div>
                    <div className={styles.rightButtons}>
                        {
                            !loadingMessage && (currentPage + 1 < props.pages.length - (props.hasThanks ? 1 : 0)) ?
                                <button
                                    className={styles.nextButton}
                                    onClick={setNextPage}
                                    disabled={invalidPages[currentPage] && Object.keys(invalidPages[currentPage]).reduce((acc, curr) => acc + invalidPages[currentPage][curr], '') !== ""}
                                >Next</button> :
                                <></>
                        }
                        {
                            currentPage + 1 === props.pages.length - (props.hasThanks ? 1 : 0) ?
                                <button
                                    className={styles.nextButton}
                                    onClick={() => onFinish()}
                                >Finish</button> :
                                <></>
                        }
                    </div>
                </div>

            </div>
        </>
    );

}

export default Survey;
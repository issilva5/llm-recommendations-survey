import { useState } from "react";
import styles from "./style.module.css";
import Page from "../survey_elements/pages/Page";
import Title from "../survey_elements/textual/Title";

function Survey(props) {

    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [recommendations, setRecommendations] = useState([
        {
            title: "Harry Potter and the Deathly Hallows: Part 1",
            poster: "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
            explanation: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec."
        }
    ])

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
        <>

            <div className={styles.container}>
                <Title title={props.title} />
                <div >
                    <div>
                        {
                            props.pages.map((page, i) => {
                                return <Page
                                    key={i}
                                    {...page}
                                    item={page.itemID < recommendations.length ? recommendations[page.itemID] : page.item}
                                    pageNumber={i}
                                    onAnswer={onAnswer}
                                    answers={answers[i]}
                                    visible={i === currentPage}
                                />
                            })
                        }
                    </div>
                    <div className={styles.buttons}>
                        {
                            !props.pages[currentPage].nowayback && (currentPage > 0 ?
                                <button
                                    className={styles.previousButton}
                                    onClick={setPreviousPage}
                                >Previous</button> :
                                <></>)
                        }
                        {
                            currentPage + 1 < props.pages.length ?
                                <button
                                    className={styles.nextButton}
                                    onClick={setNextPage}
                                >Next</button> :
                                <></>
                        }
                        {
                            currentPage + 1 === props.pages.length ?
                                <button
                                    className={styles.nextButton}
                                // onClick={}
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
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import Page from "../survey_elements/pages/Page";
import Title from "../survey_elements/textual/Title";
import LoadingPage from "../survey_elements/pages/LoadingPage";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


function Survey(props) {

    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(undefined);
    const [recommendations, setRecommendations] = useState([]);
    const [invalidPages, setInvalidPages] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('PROLIFIC_PID', searchParams.get('PROLIFIC_PID') || ("DEMO-" + uuidv4()));
        localStorage.setItem('STUDY_ID', searchParams.get('STUDY_ID') || ("DEMO-" + uuidv4()));
        localStorage.setItem('SESSION_ID', searchParams.get('SESSION_ID') || ("DEMO-" + uuidv4()));

        setLoadingMessage('Wait while we prepare the experiment... Do not refresh the page!')
        fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Session-Id': localStorage.getItem('SESSION_ID'),
                'Prolific-Pid': localStorage.getItem('PROLIFIC_PID'),
                'Study-Id': localStorage.getItem('STUDY_ID')
            }
        })
            .then(response => response.json())
            .then(response => {

                if (response['error'])
                navigate("/error", {state:{"error": response['error']}})
                setLoadingMessage(undefined)
            })

    }, [])

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
            setLoadingMessage(action[3])
            fetch(`${process.env.REACT_APP_BACKEND_URL}/${action[1]}`, {
                method: action[0],
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Session-Id': localStorage.getItem('SESSION_ID'),
                    'Prolific-Pid': localStorage.getItem('PROLIFIC_PID'),
                    'Study-Id': localStorage.getItem('STUDY_ID')
                },
                body: JSON.stringify(answers[action[2]])
            })
                .then(response => response.json())
                .then(response => {

                    if (response['error'])
                        navigate("/error", {state:{"error": response['error']}})

                    setRecommendations(response['recommendations'])
                    setLoadingMessage(undefined)
                })
        }

    }

    const onFinish = () => {

        const action = props.onFinish;

        fetch(`${process.env.REACT_APP_BACKEND_URL}/${action[1]}`, {
            method: action[0],
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Session-Id': localStorage.getItem('SESSION_ID'),
                'Prolific-Pid': localStorage.getItem('PROLIFIC_PID'),
                'Study-Id': localStorage.getItem('STUDY_ID')
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
                                onAnswer={onAnswer}
                                answers={answers[props.pages[i].name]}
                                visible={!loadingMessage && i === currentPage}
                            />
                        })
                    }
                    {
                        <LoadingPage loadingMessage={loadingMessage} />
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
                                    disabled={invalidPages[currentPage]}
                                >Next</button> :
                                <></>
                        }
                        {
                            currentPage + 1 === props.pages.length - (props.hasThanks ? 1 : 0) ?
                                <button
                                    className={styles.nextButton}
                                    onClick={() => onFinish()}
                                    disabled={invalidPages[currentPage]}
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
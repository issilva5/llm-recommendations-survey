import React, { useState, useEffect } from "react";
import QuestionPage from "../QuestionPage";
import styles from "./style.module.css";

const collapseObject = (inputObj) => {
    const outputObj = {};

    for (const key in inputObj) {
        const innerObj = inputObj[key];
        for (const innerKey in innerObj) {
            outputObj[innerKey] = innerObj[innerKey];
        }
    }

    return outputObj
}

function GroupQuestionPage(props) {

    const [visibleGroups, setVisibleGroups] = useState({});
    const [answers, setAnswers] = useState({});
    const [invalidGroups, setInvalidGroups] = useState({});

    const toggleVisibileGroup = (groupId) => {
        console.log(groupId)
        console.log(visibleGroups)
        console.log({
            ...visibleGroups,
            [groupId]: !visibleGroups[groupId]
        })
        setVisibleGroups({
            ...visibleGroups,
            [groupId]: !visibleGroups[groupId]
        })
    }

    useEffect(() => {
        props.onAnswer(props.pageNumber, answers, true);
        setVisibleGroups({
            ...visibleGroups,
            [0]: true
        })
    }, [])

    const onAnswer = (groupNumber, answer, invalidMessages) => {

        const newAnswers = {
            ...answers,
            [groupNumber]: answer
        }

        setAnswers(newAnswers)

        const newValid = {
            ...invalidGroups,
            [groupNumber]: invalidMessages
        }
        
        setInvalidGroups(newValid);

        if (groupNumber + 1 < props.questions.length && !visibleGroups[groupNumber+1] && Object.keys(invalidMessages).reduce((acc, curr) => acc + invalidMessages[curr], '') === '') {
            
            const nVisible = {
                ...visibleGroups,
                [groupNumber+1]: !visibleGroups[groupNumber+1],
            }
            
            setVisibleGroups(nVisible)
        }

        const newAnswersC = collapseObject(newAnswers)
        const newValidC = collapseObject(newValid)

        let isInvalid = false;
        let invM = Object.keys(newValidC).reduce((acc, curr) => acc + newValidC[curr], '')
        if (invM !== '' || Object.keys(newValid).length !== props.questions.length) isInvalid = true;

        props.onAnswer(props.pageNumber, newAnswersC, isInvalid);

    }

    const getGroupQuestions = () => {
        let numberOfQuestions = 0;

        const questions = props.questions.map((group, i) => {
            const startAt = numberOfQuestions;
            numberOfQuestions += group.questions.length;

            return <>
                {group.groupName &&
                    <div onClick={() => toggleVisibileGroup(i)}>
                        <p className={styles.groupName}>
                            {group.groupName}
                            <i className="fa fa-chevron-down" />
                        </p>
                        <hr />
                    </div>
                }
                {
                    (visibleGroups[i] || !group.groupName) && <QuestionPage
                        {...props}
                        groupNumber={i}
                        questions={group.questions}
                        invalidMessages={invalidGroups[i]}
                        startAt={startAt}
                        onAnswer={onAnswer}
                    />
                }
            </>
        })

        return questions;
    }

    return (
        <>
            {
                getGroupQuestions()
            }
        </>
    );
}

export default GroupQuestionPage;
import React from "react";
import QuestionPage from "../QuestionPage";
import RecPage from "../RecPage";

function RecQuestionPage(props) {
    return (
        <>
            <RecPage {...props}/>
            <QuestionPage {...props} />
        </>
    );
}

export default RecQuestionPage;

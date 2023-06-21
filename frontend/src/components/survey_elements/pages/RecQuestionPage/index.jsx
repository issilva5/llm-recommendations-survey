import React from "react";
import GroupQuestionPage from "../GroupQuestionPage";
import RecPage from "../RecPage";

function RecQuestionPage(props) {
    return (
        <>
            <RecPage {...props}/>
            <GroupQuestionPage {...props} negative={!props.item.shouldWatch}/>
        </>
    );
}

export default RecQuestionPage;

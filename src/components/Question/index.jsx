import TextQuestion from "../TextQuestion";

function Question({ questionNumber, questionModel }) {

    if (questionModel.type === "text") {
        return <TextQuestion 
            no={questionNumber}
            {...questionModel}
        />
    }

}

export default Question;
import LikertScaleQuestion from "../LikertQuestion";
import TextQuestion from "../TextQuestion";

function Question({ questionNumber, questionModel, onAnswer }) {

    switch (questionModel.type) {
        case "text":
            return <TextQuestion
                no={questionNumber}
                onAnswer={onAnswer}
                {...questionModel}
            />
        
        case "likert":
            return <LikertScaleQuestion
                no={questionNumber}
                onAnswer={onAnswer}
                {...questionModel}
            />

        default:
            break;
    }

}

export default Question;
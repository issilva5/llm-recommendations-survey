import PageHeader from "../../textual/PageHeader";
import GroupQuestionPage from "../GroupQuestionPage";
import InfoPage from "../InfoPage";
import RecPage from "../RecPage";
import RecQuestionPage from "../RecQuestionPage";

function Page(props) {

    const pageTypes = {
        "question": GroupQuestionPage,
        "recommendation": RecPage,
        "rec-question": RecQuestionPage,
        "text": InfoPage
    };

    const PageType = pageTypes[props.type];

    return (
        <>
            {props.visible ? <>
                {(props.title || props.description) && <PageHeader title={props.title} description={props.description} />}
                <PageType {...props} />
            </> : <></>}
        </>
    )

}

export default Page;
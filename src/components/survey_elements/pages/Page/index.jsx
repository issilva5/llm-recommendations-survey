import PageHeader from "../../textual/PageHeader";
import QuestionPage from "../QuestionPage";

function Page(props) {

    const pageTypes = {
        "question": QuestionPage,
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
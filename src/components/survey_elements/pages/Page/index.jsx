import QuestionPage from "../QuestionPage";

function Page(props) {

    const pageTypes = {
        "question": QuestionPage,
    };

    const PageType = pageTypes[props.type];

    return (
        <>
            {props.visible ? <PageType {...props} /> : <></>}
        </>
    )

}

export default Page;
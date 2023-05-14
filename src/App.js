import Survey from "./components/Survey";

function App() {

  const questions = [
    {
      type: "text",
      title: "What sort of movies do you like?",
      isRequired: true,
      maxLength: 300,
      minLength: 150
    },
    {
      type: "likert",
      title: "This explanation helps me to determine how well I will like this movie.",
      isRequired: true,
      options: [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree"
      ]
    },
    {
      type: "boolean",
      title: "Have you watched this movie previously?",
      isRequired: true
    },
    {
      type: "search-select",
      title: "Name three of your favorite movies.",
      isRequired: true,
      maxSelection: 3
    }
  ]

  const questions2 = [
    {
      type: "boolean",
      title: "Have you watched this movie previously?",
      isRequired: true
    },
    {
      type: "search-select",
      title: "Name three of your favorite movies.",
      isRequired: true,
      maxSelection: 3
    }
  ]

  const questions3 = [
    {
      type: "boolean",
      title: "Have you watched this movie previously?",
      isRequired: true
    },
    {
      type: "search-select",
      title: "Name three of your favorite movies.",
      isRequired: true,
      maxSelection: 3
    }
  ]

  const pages = [
    {
      type: "question",
      title:"Part I - User Preferences",
      description:"In this section, we are interested in understanding a little more about your movies preferences.",
      questions: questions
    },
    {
      type: "question",
      title:"Part I - User Preferences",
      questions: questions2
    },
    {
      type: "question",
      description:"In this section, we are interested in understanding a little more about your movies preferences.",
      questions: questions3
    }
  ]

  return <Survey title="LLM-Based Recommender System" pages={pages}/>;

}

export default App;

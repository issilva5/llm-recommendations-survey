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
      questions: questions
    },
    {
      type: "question",
      questions: questions2
    },
    {
      type: "question",
      questions: questions3
    }
  ]

  return <Survey pages={pages}/>;

}

export default App;

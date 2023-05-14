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

  const pages = [
    {
      type: "text",
      text: "This survey is part of a research ...\nLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.\nAenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem."
    },
    {
      type: "recommendation",
      title: "Part II - Movies you may like",
      description: "In this section, we recommend movies you may like and ask you some questions about the recommendations.",
      itemID: 0,
    },
    {
      type: "recommendation",
      title: "Part II - Movies you may like",
      description: "In this section, we recommend movies you may like and ask you some questions about the recommendations.",
      item: {
        title: "Harry Potter and the Deathly Hallows: Part 2",
        poster: "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
        explanation: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec."
      },
    },
    {
      type: "question",
      title:"Part I - User Preferences",
      questions: questions
    },
  ]

  return <Survey title="LLM-Based Recommender System" pages={pages} />;

}

export default App;

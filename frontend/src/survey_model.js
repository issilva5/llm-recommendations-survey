const questionsEvaluation = [
  {
    groupName: "About the recommendation",
    questions: [
      {
        type: "boolean",
        title: "Have you watched this movie previously?",
        isRequired: true
      },
      {
        type: "boolean",
        title: "Did you like this recommendation?",
        isRequired: true
      },
    ]
  },
  {
    groupName: "About the recommendation",
    continueNumeration: true,
    questions: [
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
        type: "likert",
        title: "This explanation resonates well with what I find important in a movie.",
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
        type: "likert",
        title: "This explanation is compelling.",
        isRequired: true,
        options: [
          "Strongly disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly agree"
        ]
      },
    ]
  }
]

const questionsPreferences = [
  {
    type: "search-select",
    title: "Name three of your favorite movies.",
    isRequired: true,
    minSelection: 3,
    maxSelection: 3
  },
  {
    type: "search-select",
    title: "Name three movies that you really disliked (or hated).",
    isRequired: true,
    minSelection: 3,
    maxSelection: 3
  }
]

const pages = [
  {
    type: "text",
    name: "intro",
    text: "This survey is part of a research ...\nLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.\nAenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem."
  },
  {
    type: "question",
    name: "user_preferences",
    title: "Part I - User Preferences",
    description: "In this section, we are interested in understanding a little more about your movies preferences.",
    questions: questionsPreferences,
    onNextPage: ["POST", "/recommendations", "Wait while we process your recommendations..."]
  },
  {
    type: "rec-question",
    name: "rec-eval1",
    title: "Part II - Recommendations",
    description: "In this section, we will present you four recommendations and ask you to evaluate them.",
    itemID: 0,
    nowayback: true,
    questions: questionsEvaluation
  },
  {
    type: "rec-question",
    name: "rec-eval2",
    title: "Part II - Recommendations",
    description: "In this section, we will present you four recommendations and ask you to evaluate them.",
    itemID: 1,
    nowayback: true,
    questions: questionsEvaluation
  },
  {
    type: "rec-question",
    name: "rec-eval3",
    title: "Part II - Recommendations",
    description: "In this section, we will present you four recommendations and ask you to evaluate them.",
    itemID: 2,
    nowayback: true,
    questions: questionsEvaluation
  },
  {
    type: "rec-question",
    name: "rec-eval4",
    title: "Part II - Recommendations",
    description: "In this section, we will present you four recommendations and ask you to evaluate them.",
    itemID: 3,
    nowayback: true,
    questions: questionsEvaluation
  },
  {
    type: "text",
    name: "thanks",
    text: "Thanks for participating!",
    nowayback: true
  }
]

export const survey = {
  title: "LLM-Based Recommender System",
  pages: pages,
  onFinish: ["POST", "/evaluation"],
  hasThanks: true
}
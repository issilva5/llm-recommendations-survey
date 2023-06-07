const questionsEvaluation = [
  {
    groupName: "About the recommendation",
    questions: [
      {
        type: "boolean",
        title: "Do you know this movie?",
        isRequired: true
      },
      {
        type: "likert",
        title: "I enjoy this recommendation.",
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
  },
  {
    groupName: "About the explanation",
    continueNumeration: true,
    questions: [
      {
        type: "likert",
        title: "This explanation helps me to determine how well I will like this movie.",
        negativeTitle: "This explanation helps me to determine how well I will dislike this movie.",
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
        title: "This explanation resonates well with aspects of movies that I like.",
        negativeTitle: "This explanation resonates well with aspects of movies that I dislike.",
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
        title: "This explanation is convincing.",
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
    questions: [
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
  }
]

const pages = [
  {
    type: "question",
    name: "user_preferences",
    title: "Part I - User Preferences",
    description: "In this section, we are interested in understanding a little more about your movies preferences.",
    onNextPage: ["POST", "/recommendations", "user_preferences", "Wait while we process your recommendations... It may take up to one minute. Do not refresh the page."],
    questions: questionsPreferences,
    answersShouldDiff: {1: [2], 2: [1]}
  },
  {
    type: "text",
    name: "intro-part2",
    title: "Part II - Recommendations",
    nowayback: true,
    text: "In this section, we'll feature four movies that our recommendation system thinks you might like. Each film will be accompanied by an explanation of why you might like it. After each film is shown, you will be asked to complete a few questions to assess the recommendation."
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
    name: "intro-part3",
    title: "Part III - Non-recommendations",
    nowayback: true,
    text: "In this section, we'll feature two movies that our recommendation system thinks you might not like. Each film will be accompanied by an explanation of why you might not like it. After each film is shown, you will be asked to complete a few questions to assess the non-recommendation."
  },
  {
    type: "rec-question",
    name: "rec-eval5",
    title: "Part III - Non-recommendations",
    description: "In this section, we will present you two non-recommendations and ask you to evaluate them.",
    itemID: 4,
    nowayback: true,
    questions: questionsEvaluation
  },
  {
    type: "rec-question",
    name: "rec-eval6",
    title: "Part III - Non-recommendations",
    description: "In this section, we will present you two non-recommendations and ask you to evaluate them.",
    itemID: 5,
    nowayback: true,
    questions: questionsEvaluation
  },
  {
    type: "text",
    name: "thanks",
    text: "Thanks for participating! We are saving your response, you will be redirected back to Prolific in an instant.",
    nowayback: true
  }
]

export const survey = {
  title: "LLM-Based Recommender System",
  pages: pages,
  onFinish: ["POST", "/evaluation"],
  hasThanks: true
}
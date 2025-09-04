const QUESTION_BANK = [
  {
    question: "Which of the following is the highest civilian award in India?",
    options: [
      "Padma Shri",
      "Padma Bhushan",
      "Padma Vibhushan",
      "Bharat Ratna",
    ],
    correct: 3,
  },
  {
    question: "The Indian Constitution was adopted on which date?",
    options: [
      "26th November 1949",
      "15th August 1947",
      "26th January 1950",
      "1st January 1948",
    ],
    correct: 0,
  },
  {
    question: "Which river is known as the 'Ganga of the South'?",
    options: ["Krishna", "Godavari", "Kaveri", "Narmada"],
    correct: 2,
  },
  {
    question: "Who was the first Prime Minister of India?",
    options: [
      "Sardar Vallabhbhai Patel",
      "Jawaharlal Nehru",
      "Lal Bahadur Shastri",
      "Indira Gandhi",
    ],
    correct: 1,
  },
  {
    question: "Which article of the Indian Constitution deals with Fundamental Rights?",
    options: ["Article 12-35", "Article 36-51", "Article 51A", "Article 52-78"],
    correct: 0,
  },
  {
    question: "The 'Vibrant Villages Programme' is implemented by which ministry?",
    options: [
      "Ministry of Rural Development",
      "Ministry of Home Affairs",
      "Ministry of Finance",
      "Ministry of Urban Development",
    ],
    correct: 1,
  },
  {
    question: "Which state is associated with the 'Na Anka Famine' of 1866?",
    options: ["Odisha", "Bihar", "West Bengal", "Andhra Pradesh"],
    correct: 0,
  },
  {
    question: "What is the primary source of energy for Earth's climate system?",
    options: ["Geothermal energy", "Solar energy", "Nuclear energy", "Wind energy"],
    correct: 1,
  },
  {
    question: "Which organization developed India's first indigenous photonic radar?",
    options: [
      "Bharat Dynamics",
      "BrahMos Aerospace",
      "DRDO",
      "Larsen & Toubro",
    ],
    correct: 2,
  },
  {
    question: "The Polavaram Multipurpose Project is located in which state?",
    options: ["Kerala", "Karnataka", "Andhra Pradesh", "Maharashtra"],
    correct: 2,
  },
  {
    question: "Which of the following is a UNESCO World Heritage Site in India?",
    options: [
      "Gateway of India",
      "Taj Mahal",
      "Charminar",
      "India Gate",
    ],
    correct: 1,
  },
  {
    question: "Who won the Men’s Singles title at the Australian Open 2025?",
    options: [
      "Jannik Sinner",
      "Alexander Zverev",
      "Novak Djokovic",
      "Carlos Alcaraz",
    ],
    correct: 0,
  },
  {
    question: "The 'Siddha' system of medicine originated in which part of India?",
    options: ["North India", "South India", "East India", "West India"],
    correct: 1,
  },
  {
    question: "Which state launched the 'Brindavan Gram Scheme' for rural development?",
    options: ["Uttar Pradesh", "Gujarat", "Madhya Pradesh", "Assam"],
    correct: 2,
  },
  {
    question: "What is the name of the traditional beverage from Assam’s Bodo community that received a GI tag?",
    options: ["Bodo Tonba", "Bodo Apor", "Bodo Jou Gwran", "Bodo Aronai"],
    correct: 2,
  },
  {
    question: "Which of the following is a major source of revenue for the Government of India?",
    options: ["Income Tax", "Sales Tax", "Property Tax", "Wealth Tax"],
    correct: 0,
  },
  {
    question: "The Kaushalya Dam, important for flood control, is located in which state?",
    options: ["Punjab", "Himachal Pradesh", "Rajasthan", "Haryana"],
    correct: 3,
  },
  {
    question: "Which Indian state is known for the traditional 'Dongar' cultivation?",
    options: ["Odisha", "Jharkhand", "Chhattisgarh", "Assam"],
    correct: 0,
  },
  {
    question: "The Kesavananda Bharati case is associated with which concept of the Indian Constitution?",
    options: [
      "Fundamental Duties",
      "Basic Structure Doctrine",
      "Directive Principles",
      "Preamble",
    ],
    correct: 1,
  },
  {
    question: "Which country recognized Palestine as a state in September 2025?",
    options: ["Italy", "Germany", "France", "Japan"],
    correct: 2,
  },
];

const QUIZ_CONFIG = {
  TOTAL_QUESTIONS: QUESTION_BANK.length,
  TIME_LIMIT: QUESTION_BANK.length * 60, // 1 minute per question
  QUESTIONS_PER_ROW_DESKTOP: 5,
  QUESTIONS_PER_ROW_MOBILE: 3,
  PASSING_SCORE: 60, // Percentage
  APP_NAME: "IQnition",
  APP_DESCRIPTION: "Dynamic and responsive interactive quiz platform",
  TOPIC: "UPSC General Knowledge",
};
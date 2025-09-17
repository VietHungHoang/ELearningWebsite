import type {
  QuizTopic,
  QuizQuestion,
  QuizSession,
  QuizResult,
  QuizListResponse,
  QuizDetailResponse,
  QuizSessionResponse,
  QuizSubmitResponse,
  QuizResultResponse
} from '../types/quiz'

// Mock Quiz Questions for Advanced Mathematics Quiz
export const mockMathQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    question: 'What is the derivative of x² + 3x + 5?',
    type: 'Multiple Choice',
    points: 5,
    options: [
      { id: 'a', text: '2x + 3', isCorrect: true },
      { id: 'b', text: 'x + 3', isCorrect: false },
      { id: 'c', text: '2x + 5', isCorrect: false },
      { id: 'd', text: 'x² + 3', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant (5) is 0.'
  },
  {
    id: 'q2',
    questionNumber: 2,
    question: 'The limit of a function as x approaches infinity can be _____ if the function grows without bound.',
    type: 'Fill in the Blanks',
    points: 3,
    correctAnswer: 'infinity',
    explanation: 'When a function grows without bound as x approaches infinity, the limit is infinity.'
  },
  {
    id: 'q3',
    questionNumber: 3,
    question: 'Every continuous function on a closed interval is bounded.',
    type: 'True/False',
    points: 2,
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    correctAnswer: 'true',
    explanation: 'This is the Extreme Value Theorem - continuous functions on closed intervals are bounded.'
  },
  {
    id: 'q4',
    questionNumber: 4,
    question: 'Explain the concept of integration and how it relates to finding the area under a curve.',
    type: 'Short Answer',
    points: 10,
    correctAnswer: 'Integration is the reverse process of differentiation. It finds the area under a curve by summing infinitesimal rectangles.',
    explanation: 'Integration calculates the area under a curve by taking the limit of Riemann sums.'
  },
  {
    id: 'q5',
    questionNumber: 5,
    question: 'What is the integral of cos(x) dx?',
    type: 'Multiple Choice',
    points: 5,
    options: [
      { id: 'a', text: 'sin(x) + C', isCorrect: true },
      { id: 'b', text: '-sin(x) + C', isCorrect: false },
      { id: 'c', text: 'cos(x) + C', isCorrect: false },
      { id: 'd', text: '-cos(x) + C', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'The derivative of sin(x) is cos(x), so the integral of cos(x) is sin(x) + C.'
  },
  {
    id: 'q6',
    questionNumber: 6,
    question: 'What is the value of lim(x→0) (sin x)/x?',
    type: 'Multiple Choice',
    points: 4,
    options: [
      { id: 'a', text: '0', isCorrect: false },
      { id: 'b', text: '1', isCorrect: true },
      { id: 'c', text: '∞', isCorrect: false },
      { id: 'd', text: 'undefined', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'This is a fundamental limit in calculus, lim(x→0) (sin x)/x = 1.'
  },
  {
    id: 'q7',
    questionNumber: 7,
    question: 'The chain rule states that if y = f(g(x)), then dy/dx = _____',
    type: 'Fill in the Blanks',
    points: 3,
    correctAnswer: 'f\'(g(x)) * g\'(x)',
    explanation: 'The chain rule: derivative of composite function = derivative of outer function times derivative of inner function.'
  },
  {
    id: 'q8',
    questionNumber: 8,
    question: 'A function is differentiable at a point if and only if it is continuous at that point.',
    type: 'True/False',
    points: 2,
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    correctAnswer: 'false',
    explanation: 'Differentiability implies continuity, but continuity does not imply differentiability (e.g., |x| at x=0).'
  },
  {
    id: 'q9',
    questionNumber: 9,
    question: 'What is the second derivative of x³ - 2x² + 5x - 1?',
    type: 'Multiple Choice',
    points: 4,
    options: [
      { id: 'a', text: '6x - 4', isCorrect: true },
      { id: 'b', text: '3x² - 4x + 5', isCorrect: false },
      { id: 'c', text: '6x - 2', isCorrect: false },
      { id: 'd', text: '3x - 4', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'First derivative: 3x² - 4x + 5, Second derivative: 6x - 4.'
  },
  {
    id: 'q10',
    questionNumber: 10,
    question: 'Explain the Mean Value Theorem and provide an example of its application.',
    type: 'Short Answer',
    points: 8,
    correctAnswer: 'The Mean Value Theorem states that if f is continuous on [a,b] and differentiable on (a,b), then there exists c in (a,b) such that f\'(c) = (f(b)-f(a))/(b-a).',
    explanation: 'This theorem guarantees the existence of a point where the instantaneous rate of change equals the average rate of change.'
  }
]

// Mock Quiz Questions for Continuous Learning Quiz
export const mockLearningQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    question: 'Lifelong learning helps individuals stay _____ in their careers and adapt to new challenges in an ever-changing world.',
    type: 'Fill in the Blanks',
    points: 1,
    correctAnswer: 'current',
    explanation: 'Continuous learning keeps professionals up-to-date with industry trends and technologies.'
  },
  {
    id: 'q2',
    questionNumber: 2,
    question: 'What is a key benefit of continuous learning?',
    type: 'Multiple Choice',
    points: 1,
    options: [
      { id: 'a', text: 'Increased boredom', isCorrect: false },
      { id: 'b', text: 'Improved adaptability and skills', isCorrect: true },
      { id: 'c', text: 'Less job security', isCorrect: false },
      { id: 'd', text: 'Reduced opportunities for growth', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'Continuous learning enhances adaptability and develops new skills essential for career growth.'
  },
  {
    id: 'q3',
    questionNumber: 3,
    question: 'What is one effective strategy for staying motivated in lifelong learning?',
    type: 'Short Answer',
    points: 10,
    correctAnswer: 'Setting clear goals and tracking progress regularly',
    explanation: 'Goal-setting and progress tracking help maintain motivation and provide direction in learning.'
  },
  {
    id: 'q4',
    questionNumber: 4,
    question: 'Which of the following is an example of informal learning?',
    type: 'Multiple Choice',
    points: 1,
    options: [
      { id: 'a', text: 'Attending a university course', isCorrect: false },
      { id: 'b', text: 'Watching a documentary to learn about history', isCorrect: true },
      { id: 'c', text: 'Completing a certification program', isCorrect: false },
      { id: 'd', text: 'Participating in workplace training', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'Informal learning occurs outside formal educational settings, like watching documentaries.'
  },
  {
    id: 'q5',
    questionNumber: 5,
    question: 'Continuous learning is only beneficial for career growth, not for personal development.',
    type: 'True/False',
    points: 1,
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    correctAnswer: 'false',
    explanation: 'Continuous learning benefits both career growth and personal development, including hobbies and interests.'
  },
  {
    id: 'q6',
    questionNumber: 6,
    question: 'What is the primary advantage of microlearning?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'It requires more time commitment', isCorrect: false },
      { id: 'b', text: 'It allows for flexible, bite-sized learning sessions', isCorrect: true },
      { id: 'c', text: 'It is less effective than traditional learning', isCorrect: false },
      { id: 'd', text: 'It only works for technical subjects', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'Microlearning breaks content into small, manageable chunks that can be consumed flexibly.'
  },
  {
    id: 'q7',
    questionNumber: 7,
    question: 'The concept of "growth mindset" was popularized by _____',
    type: 'Fill in the Blanks',
    points: 2,
    correctAnswer: 'Carol Dweck',
    explanation: 'Carol Dweck\'s research on growth mindset emphasizes that abilities can be developed through dedication and hard work.'
  },
  {
    id: 'q8',
    questionNumber: 8,
    question: 'Which learning method is most effective for retaining information long-term?',
    type: 'Multiple Choice',
    points: 3,
    options: [
      { id: 'a', text: 'Cramming the night before', isCorrect: false },
      { id: 'b', text: 'Spaced repetition and active recall', isCorrect: true },
      { id: 'c', text: 'Reading material only once', isCorrect: false },
      { id: 'd', text: 'Passive listening to lectures', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'Spaced repetition and active recall are scientifically proven methods for long-term retention.'
  },
  {
    id: 'q9',
    questionNumber: 9,
    question: 'Learning agility is the ability to quickly learn and apply new skills in different situations.',
    type: 'True/False',
    points: 2,
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    correctAnswer: 'true',
    explanation: 'Learning agility is indeed the capacity to rapidly learn and adapt skills across various contexts.'
  },
  {
    id: 'q10',
    questionNumber: 10,
    question: 'Explain the importance of metacognition in the learning process.',
    type: 'Short Answer',
    points: 5,
    correctAnswer: 'Metacognition is thinking about thinking - it helps learners understand their own learning processes, identify effective strategies, and monitor their comprehension.',
    explanation: 'Metacognitive awareness allows learners to become more strategic and self-directed in their learning journey.'
  }
]

// Mock Quiz Questions for Web Development Fundamentals Quiz
export const mockWebDevQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    question: 'What does HTML stand for?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'HyperText Markup Language', isCorrect: true },
      { id: 'b', text: 'High-level Text Management Language', isCorrect: false },
      { id: 'c', text: 'Home Tool Markup Language', isCorrect: false },
      { id: 'd', text: 'Hyperlink and Text Markup Language', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'HTML stands for HyperText Markup Language, the standard markup language for creating web pages.'
  },
  {
    id: 'q2',
    questionNumber: 2,
    question: 'Which CSS property is used to change the text color?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'text-color', isCorrect: false },
      { id: 'b', text: 'color', isCorrect: true },
      { id: 'c', text: 'font-color', isCorrect: false },
      { id: 'd', text: 'text-style', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'The "color" property is used to set the color of text in CSS.'
  },
  {
    id: 'q3',
    questionNumber: 3,
    question: 'JavaScript is a _____ programming language.',
    type: 'Fill in the Blanks',
    points: 2,
    correctAnswer: 'client-side',
    explanation: 'JavaScript is primarily a client-side programming language that runs in web browsers.'
  },
  {
    id: 'q4',
    questionNumber: 4,
    question: 'What is the correct HTML tag for creating a hyperlink?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: '<link>', isCorrect: false },
      { id: 'b', text: '<a>', isCorrect: true },
      { id: 'c', text: '<href>', isCorrect: false },
      { id: 'd', text: '<url>', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'The <a> tag is used to create hyperlinks in HTML.'
  },
  {
    id: 'q5',
    questionNumber: 5,
    question: 'CSS can be applied to HTML elements in three ways: inline, internal, and external.',
    type: 'True/False',
    points: 2,
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    correctAnswer: 'true',
    explanation: 'CSS can indeed be applied inline (style attribute), internally (style tag), or externally (separate CSS file).'
  },
  {
    id: 'q6',
    questionNumber: 6,
    question: 'What does the "DOM" stand for in web development?',
    type: 'Multiple Choice',
    points: 3,
    options: [
      { id: 'a', text: 'Document Object Model', isCorrect: true },
      { id: 'b', text: 'Data Object Management', isCorrect: false },
      { id: 'c', text: 'Dynamic Object Method', isCorrect: false },
      { id: 'd', text: 'Document Order Management', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'DOM stands for Document Object Model, which represents the structure of HTML documents.'
  },
  {
    id: 'q7',
    questionNumber: 7,
    question: 'Which HTML tag is used to create an unordered list?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: '<ol>', isCorrect: false },
      { id: 'b', text: '<ul>', isCorrect: true },
      { id: 'c', text: '<li>', isCorrect: false },
      { id: 'd', text: '<list>', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'The <ul> tag creates an unordered (bulleted) list in HTML.'
  },
  {
    id: 'q8',
    questionNumber: 8,
    question: 'Explain the difference between "let" and "var" in JavaScript.',
    type: 'Short Answer',
    points: 5,
    correctAnswer: 'let has block scope while var has function scope. let is not hoisted and cannot be redeclared in the same scope.',
    explanation: 'let provides better scoping rules and helps avoid common JavaScript pitfalls compared to var.'
  }
]

// Mock Quiz Questions for React.js Advanced Concepts Quiz
export const mockReactQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    question: 'What is the primary purpose of React hooks?',
    type: 'Multiple Choice',
    points: 3,
    options: [
      { id: 'a', text: 'To replace class components entirely', isCorrect: false },
      { id: 'b', text: 'To add state and lifecycle features to functional components', isCorrect: true },
      { id: 'c', text: 'To improve performance of class components', isCorrect: false },
      { id: 'd', text: 'To simplify JSX syntax', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'React hooks allow functional components to use state and lifecycle methods that were previously only available in class components.'
  },
  {
    id: 'q2',
    questionNumber: 2,
    question: 'Which hook is used to perform side effects in functional components?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'useState', isCorrect: false },
      { id: 'b', text: 'useEffect', isCorrect: true },
      { id: 'c', text: 'useContext', isCorrect: false },
      { id: 'd', text: 'useReducer', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'useEffect is the hook used to perform side effects like data fetching, subscriptions, or manually changing the DOM.'
  },
  {
    id: 'q3',
    questionNumber: 3,
    question: 'React Context is used to avoid _____ drilling.',
    type: 'Fill in the Blanks',
    points: 2,
    correctAnswer: 'prop',
    explanation: 'React Context helps avoid prop drilling by providing a way to share values between components without passing props through every level.'
  },
  {
    id: 'q4',
    questionNumber: 4,
    question: 'What is the purpose of useMemo hook?',
    type: 'Multiple Choice',
    points: 3,
    options: [
      { id: 'a', text: 'To store data in memory', isCorrect: false },
      { id: 'b', text: 'To memoize expensive calculations', isCorrect: true },
      { id: 'c', text: 'To manage component state', isCorrect: false },
      { id: 'd', text: 'To handle form inputs', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'useMemo is used to memoize expensive calculations and only recalculate when dependencies change.'
  },
  {
    id: 'q5',
    questionNumber: 5,
    question: 'React.memo is a higher-order component that prevents unnecessary re-renders.',
    type: 'True/False',
    points: 2,
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    correctAnswer: 'true',
    explanation: 'React.memo is indeed a HOC that memoizes the result and only re-renders if props change.'
  },
  {
    id: 'q6',
    questionNumber: 6,
    question: 'What is the difference between controlled and uncontrolled components?',
    type: 'Short Answer',
    points: 5,
    correctAnswer: 'Controlled components have their value controlled by React state, while uncontrolled components manage their own state internally.',
    explanation: 'Controlled components provide better control and validation, while uncontrolled components are simpler but less predictable.'
  }
]

// Mock Quiz Questions for Python Programming Basics Quiz
export const mockPythonQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    question: 'What is the correct way to create a list in Python?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'list = [1, 2, 3]', isCorrect: true },
      { id: 'b', text: 'list = (1, 2, 3)', isCorrect: false },
      { id: 'c', text: 'list = {1, 2, 3}', isCorrect: false },
      { id: 'd', text: 'list = <1, 2, 3>', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'Lists in Python are created using square brackets [].'
  },
  {
    id: 'q2',
    questionNumber: 2,
    question: 'Which keyword is used to define a function in Python?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'function', isCorrect: false },
      { id: 'b', text: 'def', isCorrect: true },
      { id: 'c', text: 'func', isCorrect: false },
      { id: 'd', text: 'define', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'The "def" keyword is used to define functions in Python.'
  },
  {
    id: 'q3',
    questionNumber: 3,
    question: 'Python uses _____ for code blocks instead of curly braces.',
    type: 'Fill in the Blanks',
    points: 2,
    correctAnswer: 'indentation',
    explanation: 'Python uses indentation (whitespace) to define code blocks, making it more readable.'
  },
  {
    id: 'q4',
    questionNumber: 4,
    question: 'What is the output of: print(3 * 2 ** 2)?',
    type: 'Multiple Choice',
    points: 3,
    options: [
      { id: 'a', text: '12', isCorrect: true },
      { id: 'b', text: '18', isCorrect: false },
      { id: 'c', text: '36', isCorrect: false },
      { id: 'd', text: '6', isCorrect: false }
    ],
    correctAnswer: 'a',
    explanation: 'Exponentiation has higher precedence: 2**2 = 4, then 3*4 = 12.'
  },
  {
    id: 'q5',
    questionNumber: 5,
    question: 'Python is a compiled language.',
    type: 'True/False',
    points: 2,
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    correctAnswer: 'false',
    explanation: 'Python is an interpreted language, not compiled.'
  },
  {
    id: 'q6',
    questionNumber: 6,
    question: 'Explain the difference between a list and a tuple in Python.',
    type: 'Short Answer',
    points: 4,
    correctAnswer: 'Lists are mutable (can be changed) and use square brackets [], while tuples are immutable (cannot be changed) and use parentheses ().',
    explanation: 'Lists allow modification after creation, tuples do not.'
  }
]

// Mock Quiz Questions for General Knowledge Quiz
export const mockGeneralQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    question: 'What is the capital of Australia?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'Sydney', isCorrect: false },
      { id: 'b', text: 'Melbourne', isCorrect: false },
      { id: 'c', text: 'Canberra', isCorrect: true },
      { id: 'd', text: 'Perth', isCorrect: false }
    ],
    correctAnswer: 'c',
    explanation: 'Canberra is the capital city of Australia, located in the Australian Capital Territory.'
  },
  {
    id: 'q2',
    questionNumber: 2,
    question: 'Who painted the Mona Lisa?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'Vincent van Gogh', isCorrect: false },
      { id: 'b', text: 'Leonardo da Vinci', isCorrect: true },
      { id: 'c', text: 'Pablo Picasso', isCorrect: false },
      { id: 'd', text: 'Michelangelo', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503-1519.'
  },
  {
    id: 'q3',
    questionNumber: 3,
    question: 'The Great Wall of China is visible from space with the naked eye.',
    type: 'True/False',
    points: 2,
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    correctAnswer: 'false',
    explanation: 'This is a common myth. The Great Wall is not visible from space with the naked eye.'
  },
  {
    id: 'q4',
    questionNumber: 4,
    question: 'What is the largest planet in our solar system?',
    type: 'Fill in the Blanks',
    points: 2,
    correctAnswer: 'Jupiter',
    explanation: 'Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined.'
  },
  {
    id: 'q5',
    questionNumber: 5,
    question: 'Which ocean is the largest?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: 'Atlantic Ocean', isCorrect: false },
      { id: 'b', text: 'Pacific Ocean', isCorrect: true },
      { id: 'c', text: 'Indian Ocean', isCorrect: false },
      { id: 'd', text: 'Arctic Ocean', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'The Pacific Ocean is the largest ocean, covering more than 30% of Earth\'s surface.'
  },
  {
    id: 'q6',
    questionNumber: 6,
    question: 'What year did World War II end?',
    type: 'Multiple Choice',
    points: 2,
    options: [
      { id: 'a', text: '1944', isCorrect: false },
      { id: 'b', text: '1945', isCorrect: true },
      { id: 'c', text: '1946', isCorrect: false },
      { id: 'd', text: '1947', isCorrect: false }
    ],
    correctAnswer: 'b',
    explanation: 'World War II ended in 1945 with the surrender of Japan.'
  },
  {
    id: 'q7',
    questionNumber: 7,
    question: 'Explain the difference between weather and climate.',
    type: 'Short Answer',
    points: 3,
    correctAnswer: 'Weather refers to short-term atmospheric conditions, while climate refers to long-term patterns of weather in a specific area.',
    explanation: 'Weather changes daily, while climate patterns are observed over decades or longer periods.'
  }
]

// Mock Quiz Topics
export const mockQuizTopics: QuizTopic[] = [
  {
    id: '1',
    title: 'Advanced Mathematics Quiz',
    description: 'Test your knowledge of calculus, algebra, and geometry',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    category: 'Mathematics',
    difficulty: 'advanced',
    estimatedDuration: 60,
    totalQuestions: 10,
    totalMarks: 45,
    timeLimit: 60,
    status: 'upcoming',
    prerequisites: ['Basic Algebra', 'Trigonometry'],
    tags: ['calculus', 'algebra', 'geometry', 'mathematics'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    instructor: {
      id: 'instructor-1',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.8
    },
    questions: mockMathQuizQuestions
  },
  {
    id: '2',
    title: 'Continuous Learning: Embrace Lifelong Education Quiz',
    description: 'Learn about the importance of continuous learning and skill development',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    category: 'Education',
    difficulty: 'intermediate',
    estimatedDuration: 30,
    totalQuestions: 10,
    totalMarks: 20,
    timeLimit: 30,
    status: 'attempted',
    score: 12,
    prerequisites: [],
    tags: ['education', 'learning', 'skills', 'development'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    instructor: {
      id: 'instructor-2',
      name: 'Prof. Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.6
    },
    questions: mockLearningQuizQuestions
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    description: 'Test your knowledge of HTML, CSS, and JavaScript basics',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: 'Programming',
    difficulty: 'beginner',
    estimatedDuration: 45,
    totalQuestions: 8,
    totalMarks: 20,
    timeLimit: 45,
    status: 'upcoming',
    prerequisites: ['Basic Computer Skills'],
    tags: ['html', 'css', 'javascript', 'web-development'],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
    instructor: {
      id: 'instructor-3',
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.9
    },
    questions: mockWebDevQuizQuestions
  },
  {
    id: '5',
    title: 'React.js Advanced Concepts',
    description: 'Test your knowledge of React hooks, context, and performance optimization',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    category: 'Programming',
    difficulty: 'advanced',
    estimatedDuration: 90,
    totalQuestions: 6,
    totalMarks: 17,
    timeLimit: 90,
    status: 'upcoming',
    prerequisites: ['JavaScript', 'React Basics'],
    tags: ['react', 'hooks', 'context', 'performance'],
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    instructor: {
      id: 'instructor-5',
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.9
    },
    questions: mockReactQuizQuestions
  }
]

// Mock Quiz Session
export const mockQuizSession: QuizSession = {
  id: 'session-1',
  quizId: '1',
  userId: 'user-123',
  status: 'in_progress',
  startedAt: '2024-01-15T10:30:00Z',
  timeLimit: 3600, // 1 hour
  timeRemaining: 2400, // 40 minutes remaining
  currentQuestionIndex: 0,
  answers: {},
  totalQuestions: 5,
  totalMarks: 25,
  earnedMarks: 0,
  accuracy: 0,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}

// Mock Quiz Result
export const mockQuizResult: QuizResult = {
  id: 'result-1',
  sessionId: 'session-1',
  quizId: '1',
  userId: 'user-123',
  title: 'Advanced Mathematics Quiz',
  completedAt: '2024-01-15T11:30:00Z',
  totalQuestions: 5,
  totalMarks: 25,
  earnedMarks: 20,
  accuracy: 80,
  correctAnswers: 4,
  timeSpent: 3600,
  passed: true,
  passingGrade: 60,
  questions: [
    {
      questionId: 'q1',
      questionNumber: 1,
      question: 'What is the derivative of x² + 3x + 5?',
      type: 'Multiple Choice',
      status: 'Correct',
      points: { earned: 5, total: 5 },
      userAnswer: 'a',
      correctAnswer: 'a',
      explanation: 'The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant (5) is 0.',
      timeSpent: 45,
      options: [
        { id: 'a', text: '2x + 3', isCorrect: true, isSelected: true },
        { id: 'b', text: 'x + 3', isCorrect: false, isSelected: false },
        { id: 'c', text: '2x + 5', isCorrect: false, isSelected: false },
        { id: 'd', text: 'x² + 3', isCorrect: false, isSelected: false }
      ]
    },
    {
      questionId: 'q2',
      questionNumber: 2,
      question: 'The limit of a function as x approaches infinity can be _____ if the function grows without bound.',
      type: 'Fill in the Blanks',
      status: 'Incorrect',
      points: { earned: 0, total: 3 },
      userAnswer: 'unbounded',
      correctAnswer: 'infinity',
      explanation: 'When a function grows without bound as x approaches infinity, the limit is infinity.',
      timeSpent: 30
    },
    {
      questionId: 'q3',
      questionNumber: 3,
      question: 'Every continuous function on a closed interval is bounded.',
      type: 'True/False',
      status: 'Correct',
      points: { earned: 2, total: 2 },
      userAnswer: 'true',
      correctAnswer: 'true',
      explanation: 'This is the Extreme Value Theorem - continuous functions on closed intervals are bounded.',
      timeSpent: 15,
      options: [
        { id: 'true', text: 'True', isCorrect: true, isSelected: true },
        { id: 'false', text: 'False', isCorrect: false, isSelected: false }
      ]
    },
    {
      questionId: 'q4',
      questionNumber: 4,
      question: 'Explain the concept of integration and how it relates to finding the area under a curve.',
      type: 'Short Answer',
      status: 'Correct',
      points: { earned: 8, total: 10 },
      userAnswer: 'Integration finds the area under a curve by summing rectangles.',
      correctAnswer: 'Integration is the reverse process of differentiation. It finds the area under a curve by summing infinitesimal rectangles.',
      explanation: 'Integration calculates the area under a curve by taking the limit of Riemann sums.',
      timeSpent: 120
    },
    {
      questionId: 'q5',
      questionNumber: 5,
      question: 'What is the integral of cos(x) dx?',
      type: 'Multiple Choice',
      status: 'Correct',
      points: { earned: 5, total: 5 },
      userAnswer: 'a',
      correctAnswer: 'a',
      explanation: 'The derivative of sin(x) is cos(x), so the integral of cos(x) is sin(x) + C.',
      timeSpent: 20,
      options: [
        { id: 'a', text: 'sin(x) + C', isCorrect: true, isSelected: true },
        { id: 'b', text: '-sin(x) + C', isCorrect: false, isSelected: false },
        { id: 'c', text: 'cos(x) + C', isCorrect: false, isSelected: false },
        { id: 'd', text: '-cos(x) + C', isCorrect: false, isSelected: false }
      ]
    }
  ],
  summary: {
    totalTime: 3600,
    averageTimePerQuestion: 720,
    fastestQuestion: 15,
    slowestQuestion: 120,
    difficultyBreakdown: {
      'Multiple Choice': 15,
      'Fill in the Blanks': 3,
      'True/False': 2,
      'Short Answer': 10
    }
  },
  recommendations: [
    'Review derivative rules for polynomial functions',
    'Practice limit problems involving infinity',
    'Study the Extreme Value Theorem in detail'
  ],
  nextSteps: [
    'Take the Advanced Calculus Quiz',
    'Review integration techniques',
    'Practice with more complex derivative problems'
  ]
}

// Mock API Responses
export const mockQuizListResponse: QuizListResponse = {
  success: true,
  data: {
    quizzes: mockQuizTopics,
    pagination: {
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1
    },
    filters: {
      categories: ['Mathematics', 'Education', 'Programming'],
      difficulties: ['beginner', 'intermediate', 'advanced'],
      tags: ['calculus', 'algebra', 'geometry', 'mathematics', 'education', 'learning', 'skills', 'development', 'html', 'css', 'javascript', 'web-development']
    }
  }
}

export const mockQuizDetailResponse: QuizDetailResponse = {
  success: true,
  data: mockQuizTopics[0]
}

export const mockQuizSessionResponse: QuizSessionResponse = {
  success: true,
  data: mockQuizSession
}

export const mockQuizSubmitResponse: QuizSubmitResponse = {
  success: true,
  data: mockQuizResult
}

export const mockQuizResultResponse: QuizResultResponse = {
  success: true,
  data: mockQuizResult
}

// Mock Quiz History (attempted quizzes)
export const mockQuizHistory: QuizTopic[] = [
  {
    id: '2',
    title: 'Continuous Learning: Embrace Lifelong Education Quiz',
    description: 'Learn about the importance of continuous learning and skill development',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    category: 'Education',
    difficulty: 'intermediate',
    estimatedDuration: 30,
    totalQuestions: 10,
    totalMarks: 20,
    timeLimit: 30,
    status: 'attempted',
    score: 12,
    prerequisites: [],
    tags: ['education', 'learning', 'skills', 'development'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    instructor: {
      id: 'instructor-2',
      name: 'Prof. Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.6
    },
    questions: mockLearningQuizQuestions
  },
  {
    id: '4',
    title: 'General Knowledge Quiz',
    description: 'Test your general knowledge across various subjects',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    category: 'General',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    totalQuestions: 7,
    totalMarks: 15,
    timeLimit: 45,
    status: 'completed',
    score: 13,
    prerequisites: [],
    tags: ['general-knowledge', 'trivia', 'education'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    instructor: {
      id: 'instructor-4',
      name: 'Dr. Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 4.7
    },
    questions: mockGeneralQuizQuestions
  },
  {
    id: '6',
    title: 'Python Programming Basics',
    description: 'Test your knowledge of Python syntax, data structures, and basic algorithms',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
    category: 'Programming',
    difficulty: 'beginner',
    estimatedDuration: 60,
    totalQuestions: 10,
    totalMarks: 15,
    timeLimit: 60,
    status: 'attempted',
    score: 42,
    prerequisites: ['Basic Programming Concepts'],
    tags: ['python', 'programming', 'algorithms', 'data-structures'],
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-22T14:00:00Z',
    instructor: {
      id: 'instructor-6',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.8
    },
    questions: mockPythonQuizQuestions
  }
]

/**
 * QUIZORA - Question Bank
 * Contains structured questions for Web Development, General Knowledge, Science & Tech, and Data Structures & Algorithms.
 */

const QUESTION_BANK = [
  // ==========================================
  // WEB DEVELOPMENT
  // ==========================================
  {
    id: "web_1",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Easy",
    question: "Which JavaScript keyword is used to declare a variable whose value cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    correctIndex: 2,
    explanation: "The 'const' keyword creates a block-scoped variable that cannot be reassigned after its initial assignment."
  },
  {
    id: "web_2",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Easy",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink and Text Management Language",
      "Home Tool Markup Language"
    ],
    correctIndex: 0,
    explanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language used for creating web pages."
  },
  {
    id: "web_3",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Medium",
    question: "Which CSS property controls the layout model where items adjust dynamically across flex lines?",
    options: ["grid-template-columns", "display: flex", "position: absolute", "float: left"],
    correctIndex: 1,
    explanation: "'display: flex' activates the Flexible Box Layout module, enabling responsive dynamic alignment and distribution of elements."
  },
  {
    id: "web_4",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Medium",
    question: "What is the output of `typeof null` in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctIndex: 2,
    explanation: "In JavaScript, `typeof null` evaluates to `'object'`. This is a long-standing legacy bug in JS from its initial implementation."
  },
  {
    id: "web_5",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Medium",
    question: "Which browser API provides client-side key-value storage that persists across browser sessions?",
    options: ["sessionStorage", "localStorage", "Cookies", "IndexedDB Cache"],
    correctIndex: 1,
    explanation: "`localStorage` allows web applications to store key-value data in the browser with no expiration date."
  },
  {
    id: "web_6",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Hard",
    question: "What will `console.log(1 + - '1' + '2')` output in JavaScript?",
    options: ["'12'", "'02'", "3", "NaN"],
    correctIndex: 1,
    explanation: "unary minus on string `'1'` coerces it to `-1`. `1 + (-1)` equals `0`. `0 + '2'` coerces 0 to string, resulting in `'02'`."
  },
  {
    id: "web_7",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Hard",
    question: "Which JavaScript method registers an event handler that fires only once when triggered?",
    options: [
      "element.addEventListener(type, handler, { once: true })",
      "element.attachOnce(type, handler)",
      "element.on(type, handler, { single: true })",
      "element.addEventListener(type, handler.once())"
    ],
    correctIndex: 0,
    explanation: "Passing `{ once: true }` in the options object of `addEventListener` automatically removes the listener after its first invocation."
  },
  {
    id: "web_8",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Medium",
    question: "Which HTTP status code signifies that a requested resource was not found on the server?",
    options: ["200 OK", "403 Forbidden", "404 Not Found", "500 Internal Server Error"],
    correctIndex: 2,
    explanation: "HTTP 404 indicates that the server cannot locate the requested URI resource."
  },
  {
    id: "web_9",
    category: "web-dev",
    categoryName: "Web Development",
    difficulty: "Hard",
    question: "In CSS selector specificity, which of the following has the highest priority rank?",
    options: ["Class selector (.card)", "ID selector (#header)", "Element selector (div)", "Attribute selector ([type='text'])"],
    correctIndex: 1,
    explanation: "An ID selector `#header` (0,1,0,0) has higher specificity than class selectors (0,0,1,0) or element selectors (0,0,0,1)."
  },

  // ==========================================
  // GENERAL KNOWLEDGE
  // ==========================================
  {
    id: "gk_1",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Easy",
    question: "Which planet in our solar system is known as the 'Red Planet'?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctIndex: 2,
    explanation: "Mars is called the Red Planet because iron oxide (rust) on its surface gives it a reddish hue."
  },
  {
    id: "gk_2",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Easy",
    question: "What is the capital city of Japan?",
    options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"],
    correctIndex: 2,
    explanation: "Tokyo is the political, economic, and cultural capital city of Japan."
  },
  {
    id: "gk_3",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Medium",
    question: "Which ocean is the largest and deepest on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctIndex: 3,
    explanation: "The Pacific Ocean covers over 30% of Earth's surface and contains the deepest point on Earth, the Mariana Trench."
  },
  {
    id: "gk_4",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Medium",
    question: "Who authored the play 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctIndex: 1,
    explanation: "William Shakespeare wrote 'Romeo and Juliet' in the late 16th century."
  },
  {
    id: "gk_5",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Hard",
    question: "In which year did the United Nations (UN) officially come into existence?",
    options: ["1919", "1939", "1945", "1950"],
    correctIndex: 2,
    explanation: "The UN was founded on October 24, 1945, immediately following the conclusion of World War II."
  },
  {
    id: "gk_6",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Medium",
    question: "What is the chemical symbol for Gold on the Periodic Table?",
    options: ["Go", "Ag", "Au", "Fe"],
    correctIndex: 2,
    explanation: "The symbol for Gold is 'Au', derived from its Latin name 'Aurum', meaning 'glowing dawn'."
  },
  {
    id: "gk_7",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Hard",
    question: "Which desert is the largest hot desert in the world?",
    options: ["Gobi Desert", "Kalahari Desert", "Sahara Desert", "Arabian Desert"],
    correctIndex: 2,
    explanation: "The Sahara Desert in Northern Africa is the world's largest hot desert (Antarctica and the Arctic are larger cold deserts)."
  },
  {
    id: "gk_8",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Easy",
    question: "How many sides does a regular Heptagon have?",
    options: ["6", "7", "8", "9"],
    correctIndex: 1,
    explanation: "A heptagon (also known as a septagon) is a polygon with 7 sides and 7 angles."
  },
  {
    id: "gk_9",
    category: "general-knowledge",
    categoryName: "General Knowledge",
    difficulty: "Hard",
    question: "Who discovered Penicillin in 1928?",
    options: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Edward Jenner"],
    correctIndex: 0,
    explanation: "Sir Alexander Fleming discovered Penicillin produced by Penicillium notatum mold, revolutionizing antibiotic treatment."
  },

  // ==========================================
  // SCIENCE & TECH
  // ==========================================
  {
    id: "sci_1",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Easy",
    question: "What is the basic unit of life in all living organisms?",
    options: ["Atom", "Cell", "Tissue", "Organ"],
    correctIndex: 1,
    explanation: "The cell is the fundamental structural and functional unit of all living organisms."
  },
  {
    id: "sci_2",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Easy",
    question: "What does CPU stand for in computer hardware?",
    options: [
      "Central Processing Unit",
      "Computer Power Unit",
      "Core Program Utility",
      "Central Protocol Unit"
    ],
    correctIndex: 0,
    explanation: "CPU stands for Central Processing Unit, often called the brain of the computer."
  },
  {
    id: "sci_3",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Medium",
    question: "Which gas do plants absorb from the atmosphere during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctIndex: 2,
    explanation: "Plants absorb Carbon Dioxide ($CO_2$) and sunlight to produce glucose and release oxygen."
  },
  {
    id: "sci_4",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Medium",
    question: "What speed does light travel at in a vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "30,000 km/s"],
    correctIndex: 0,
    explanation: "Light travels at approximately $3 \\times 10^8$ meters per second (300,000 kilometers per second) in a vacuum."
  },
  {
    id: "sci_5",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Hard",
    question: "What does the acronym RAM stand for in memory architecture?",
    options: ["Random Access Memory", "Read Access Module", "Rapid Array Memory", "Run Automated Memory"],
    correctIndex: 0,
    explanation: "RAM stands for Random Access Memory, a volatile high-speed storage medium used for active data processing."
  },
  {
    id: "sci_6",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Hard",
    question: "Which subatomic particle carries a negative electrical charge?",
    options: ["Proton", "Neutron", "Electron", "Positron"],
    correctIndex: 2,
    explanation: "Electrons carry a negative elementary charge, orbiting the atomic nucleus of protons and neutrons."
  },
  {
    id: "sci_7",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Medium",
    question: "What law states that for every action, there is an equal and opposite reaction?",
    options: [
      "Newton's First Law",
      "Newton's Second Law",
      "Newton's Third Law",
      "Law of Universal Gravitation"
    ],
    correctIndex: 2,
    explanation: "Newton's Third Law of Motion states that when one body exerts a force on a second body, the second body exerts an equal and opposite force."
  },
  {
    id: "sci_8",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Hard",
    question: "What is the primary protocol used to securely transmit web pages over the internet?",
    options: ["HTTP", "HTTPS", "FTP", "SMTP"],
    correctIndex: 1,
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts communication using TLS/SSL protocols."
  },
  {
    id: "sci_9",
    category: "science-tech",
    categoryName: "Science & Tech",
    difficulty: "Medium",
    question: "Which artificial intelligence subfield focuses on enabling computers to learn from data without explicit programming?",
    options: ["Machine Learning", "Quantum Computing", "Cloud Computing", "Cybernetics"],
    correctIndex: 0,
    explanation: "Machine Learning develops algorithms that improve automatically through experience and data patterns."
  },

  // ==========================================
  // DATA STRUCTURES & ALGORITHMS (DSA)
  // ==========================================
  {
    id: "dsa_1",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Easy",
    question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctIndex: 1,
    explanation: "A Stack follows LIFO, where the last element inserted is the first element removed (like a stack of plates)."
  },
  {
    id: "dsa_2",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Easy",
    question: "What is the worst-case time complexity of Binary Search on a sorted array of size N?",
    options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
    correctIndex: 2,
    explanation: "Binary search repeatedly halves the search space, yielding logarithmic time complexity $O(\\log N)$."
  },
  {
    id: "dsa_3",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Medium",
    question: "Which data structure follows a First-In, First-Out (FIFO) access order?",
    options: ["Stack", "Queue", "Binary Tree", "Heap"],
    correctIndex: 1,
    explanation: "A Queue operates on FIFO, where elements leave in the exact order they arrived (like a real-world checkout line)."
  },
  {
    id: "dsa_4",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Medium",
    question: "What is the average time complexity of QuickSort?",
    options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"],
    correctIndex: 1,
    explanation: "QuickSort has an average case performance of $O(N \\log N)$ when pivot selection balances partitions reasonably."
  },
  {
    id: "dsa_5",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Hard",
    question: "Which graph traversal technique utilizes a Queue data structure?",
    options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
    correctIndex: 1,
    explanation: "BFS uses a Queue to explore graph nodes layer-by-layer starting from a root node."
  },
  {
    id: "dsa_6",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Hard",
    question: "What collision resolution technique in Hash Tables uses a linked list for each hash bucket?",
    options: ["Open Addressing", "Linear Probing", "Separate Chaining", "Double Hashing"],
    correctIndex: 2,
    explanation: "Separate Chaining stores colliding elements in a bucket list attached to that specific hash index."
  },
  {
    id: "dsa_7",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Medium",
    question: "In a Max-Heap, where is the largest element located?",
    options: ["At the root", "At the leftmost leaf", "At the rightmost leaf", "At a random position"],
    correctIndex: 0,
    explanation: "In a Max-Heap property, every parent node is greater than or equal to its children, placing the maximum value at the root."
  },
  {
    id: "dsa_8",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Hard",
    question: "What is the space complexity of Depth-First Search (DFS) on a tree of height H?",
    options: ["O(1)", "O(H)", "O(N^2)", "O(2^H)"],
    correctIndex: 1,
    explanation: "DFS uses a call stack proportional to the maximum recursion depth, which corresponds to tree height $O(H)$."
  },
  {
    id: "dsa_9",
    category: "dsa",
    categoryName: "Data Structures & Algorithms",
    difficulty: "Easy",
    question: "Which sorting algorithm is guaranteed to be stable and has a guaranteed $O(N \\log N)$ worst-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort"],
    correctIndex: 2,
    explanation: "Merge Sort recursively divides the array and merges sorted subarrays in stable $O(N \\log N)$ time."
  }
];

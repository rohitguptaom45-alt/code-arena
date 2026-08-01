export const contests = [
  {
    id: 'weekly-42',
    name: 'Weekly Marathon #42',
    tagline: 'A fast-paced 90 minute sprint across arrays, strings & graphs.',
    difficulty: 'Medium',
    duration: '90 min',
    participants: 12480,
    prizePool: '₹50,000',
    entryFee: 'Free',
    startsInSeconds: 3600 * 6,
    languages: ['C++', 'Java', 'Python', 'JavaScript'],
    banner: 'from-accent to-accent-soft',
  },
  {
    id: 'debug-royale-9',
    name: 'Debugging Royale #9',
    tagline: 'Hunt down bugs planted by our engineering team in real production-style code.',
    difficulty: 'Hard',
    duration: '60 min',
    participants: 6210,
    prizePool: '₹1,00,000',
    entryFee: '₹49',
    startsInSeconds: 3600 * 26,
    languages: ['Java', 'Python', 'JavaScript'],
    banner: 'from-ink to-ink-soft',
  },
  {
    id: 'react-tournament-3',
    name: 'React Tournament — Season 3',
    tagline: 'Build UI challenges under time pressure, judged on functionality & polish.',
    difficulty: 'Medium',
    duration: '120 min',
    participants: 4032,
    prizePool: '₹75,000',
    entryFee: '₹99',
    startsInSeconds: 3600 * 50,
    languages: ['JavaScript', 'TypeScript'],
    banner: 'from-accent-soft to-accent',
  },
  {
    id: 'sql-clash-7',
    name: 'SQL Clash #7',
    tagline: 'Query optimization battles against the clock on real-world datasets.',
    difficulty: 'Easy',
    duration: '45 min',
    participants: 3110,
    prizePool: '₹25,000',
    entryFee: 'Free',
    startsInSeconds: 3600 * 3,
    languages: ['SQL'],
    banner: 'from-ink-soft to-accent',
  },
]

export const categories = [
  { name: 'Debugging Challenge', icon: '🐞', count: 128 },
  { name: 'DSA Battle', icon: '🧠', count: 342 },
  { name: 'Java Championship', icon: '☕', count: 96 },
  { name: 'React Tournament', icon: '⚛️', count: 74 },
  { name: 'Python Arena', icon: '🐍', count: 210 },
  { name: 'SQL Challenge', icon: '🗄️', count: 88 },
  { name: 'Full Stack Contest', icon: '🧩', count: 61 },
  { name: 'AI Challenge', icon: '🤖', count: 53 },
  { name: 'Web Dev Battle', icon: '🌐', count: 102 },
  { name: 'Competitive Programming', icon: '🏁', count: 415 },
  { name: 'Weekly Marathon', icon: '📅', count: 42 },
  { name: 'Monthly Mega Contest', icon: '🏆', count: 12 },
]

export const leaderboard = Array.from({ length: 20 }).map((_, i) => ({
  rank: i + 1,
  username: [
    'shreya.codes', 'devraj_99', 'nullptr_ninja', 'ananya_dev', 'kernel_panic',
    'rhea_builds', 'stackoverflow_king', 'ishaan.py', 'byte_bandit', 'aria_debugs',
    'rohan_recursion', 'meera_ml', 'vikram_v8', 'sana_scripts', 'karthik_cpp',
    'priya_prod', 'arjun_async', 'neha_nodes', 'yash_yield', 'diya_docker',
  ][i],
  country: ['🇮🇳', '🇺🇸', '🇩🇪', '🇯🇵', '🇬🇧', '🇮🇳', '🇨🇦', '🇮🇳', '🇸🇬', '🇮🇳'][i % 10],
  rating: 2600 - i * 34,
  solved: 1200 - i * 22,
  wins: 88 - i * 3,
  streak: 40 - i,
}))

export const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    features: ['Practice Problems', 'Public Contests', 'Community Access'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    period: '/month',
    features: [
      'Everything in Free',
      'Premium Contests',
      'AI Code Review',
      'Resume Reviews',
      'Certificates',
      'Priority Support',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
    badge: null,
  },
  {
    name: 'Elite',
    price: '₹699',
    period: '/month',
    features: [
      'Everything in Pro',
      'Exclusive Tournaments',
      'Company Hiring Challenges',
      'Mock Interviews',
      'Premium Analytics',
      'Early Access Features',
    ],
    cta: 'Go Elite',
    highlight: false,
    badge: '🔥 Most Popular',
  },
]

export const techLogos = ['React', 'Node.js', 'Java', 'Python', 'C++', 'MySQL', 'MongoDB', 'Git', 'Docker']

export const developers = [
  {
    name: 'Rohit Gupta',
    role: 'Founder & CEO',
    qualification: 'B.Tech CSE, 3rd Year',
    skills: ['React', 'Node.js', 'System Design'],
    contributions: 412,
    exp: '3rd Year Student',
    bio: 'Started CodeArena in a hostel room to make competitive coding feel less lonely and more like an arena.',
    github: 'https://github.com/rohitguptaom45-alt',
    linkedin: 'https://www.linkedin.com/in/rohit-gupta-666502423/',
  },
  {
    name: 'Nagender Singh',
    role: 'Co-Founder & CTO',
    qualification: 'B.Tech CSE, 3rd Year',
    skills: ['Java', 'System Architecture', 'DevOps'],
    contributions: 389,
    exp: '3rd Year Student',
    bio: 'Owns everything under the hood — from the judge engine to keeping servers alive during contest spikes.',
  },
  {
    name: 'Isha Kapoor',
    role: 'Frontend Lead',
    qualification: 'B.Tech IT, 3rd Year',
    skills: ['React', 'TypeScript', 'Design Systems'],
    contributions: 268,
    exp: '3rd Year Student',
    bio: 'Obsessed with making the editor feel fast and the UI feel like it was built by people who actually code.',
  },
  {
    name: 'Aditya Verma',
    role: 'Backend Engineer',
    qualification: 'B.Tech CSE, 2nd Year',
    skills: ['Python', 'PostgreSQL', 'Judge Systems'],
    contributions: 201,
    exp: '2nd Year Student',
    bio: 'Builds and hardens the code execution sandbox that powers every submission on the platform.',
  },
]


export const quizzes = [
  {
    id: 'js-basics-easy',
    title: 'JavaScript Basics',
    language: 'JavaScript',
    difficulty: 'Easy',
    questions: [
      { q: 'Which keyword declares a block-scoped variable in JS?', options: ['var', 'let', 'define', 'global'], correct: 1 },
      { q: 'What does `typeof "5"` return?', options: ['number', 'string', 'boolean', 'undefined'], correct: 1 },
      { q: 'Which method adds an item to the end of an array?', options: ['push()', 'pop()', 'shift()', 'add()'], correct: 0 },
      { q: 'What is the result of `2 + "2"` in JavaScript?', options: ['4', '"22"', 'NaN', 'Error'], correct: 1 },
      { q: 'Which symbol is used for strict equality?', options: ['=', '==', '===', '!='], correct: 2 },
    ],
  },
  {
    id: 'js-arrays-medium',
    title: 'Arrays & Loops in JS',
    language: 'JavaScript',
    difficulty: 'Medium',
    questions: [
      { q: 'Which array method returns a new array with transformed elements?', options: ['forEach()', 'map()', 'filter()', 'reduce()'], correct: 1 },
      { q: 'What does `[1,2,3].filter(n => n > 1)` return?', options: ['[1]', '[2,3]', '[1,2,3]', '[]'], correct: 1 },
      { q: 'Which loop is best for iterating with early exit via break?', options: ['forEach', 'for', 'map', 'filter'], correct: 1 },
      { q: 'What does `Array.isArray([])` return?', options: ['true', 'false', 'undefined', 'Error'], correct: 0 },
      { q: '`[1,2,3].reduce((a,b) => a+b, 0)` evaluates to?', options: ['3', '6', '[1,2,3]', 'undefined'], correct: 1 },
    ],
  },
  {
    id: 'python-basics-easy',
    title: 'Python Basics',
    language: 'Python',
    difficulty: 'Easy',
    questions: [
      { q: 'How do you start a comment in Python?', options: ['//', '#', '/* */', '--'], correct: 1 },
      { q: 'Which data type is immutable in Python?', options: ['list', 'dict', 'tuple', 'set'], correct: 2 },
      { q: 'What does `len("hello")` return?', options: ['4', '5', '6', 'Error'], correct: 1 },
      { q: 'Which keyword defines a function?', options: ['func', 'def', 'function', 'lambda'], correct: 1 },
      { q: 'What is the output of `print(3 // 2)`?', options: ['1.5', '1', '2', 'Error'], correct: 1 },
    ],
  },
  {
    id: 'python-ds-hard',
    title: 'Python Data Structures',
    language: 'Python',
    difficulty: 'Hard',
    questions: [
      { q: 'What is the time complexity of dict lookups on average?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], correct: 2 },
      { q: 'Which structure would you use for FIFO behaviour?', options: ['list.append/pop', 'collections.deque', 'set', 'tuple'], correct: 1 },
      { q: 'What does a list comprehension `[x*x for x in range(5) if x % 2 == 0]` produce?', options: ['[0,4,16]', '[0,1,4,9,16]', '[1,9]', '[0,2,4]'], correct: 0 },
      { q: 'Which module gives you `Counter` and `defaultdict`?', options: ['itertools', 'functools', 'collections', 'heapq'], correct: 2 },
      { q: 'What does `heapq.heappush` maintain?', options: ['A sorted list', 'A min-heap', 'A max-heap', 'A balanced BST'], correct: 1 },
    ],
  },
  {
    id: 'java-oop-medium',
    title: 'Java OOP Concepts',
    language: 'Java',
    difficulty: 'Medium',
    questions: [
      { q: 'Which keyword is used to inherit a class in Java?', options: ['implements', 'extends', 'inherits', 'super'], correct: 1 },
      { q: 'What does encapsulation primarily achieve?', options: ['Faster loops', 'Data hiding', 'Multiple inheritance', 'Memory allocation'], correct: 1 },
      { q: 'Which keyword prevents a class from being subclassed?', options: ['static', 'private', 'final', 'const'], correct: 2 },
      { q: 'An interface method (default Java 8+) can have a body if marked with?', options: ['abstract', 'default', 'static final', 'virtual'], correct: 1 },
      { q: 'What is method overriding an example of?', options: ['Compile-time polymorphism', 'Runtime polymorphism', 'Encapsulation', 'Abstraction'], correct: 1 },
    ],
  },
  {
    id: 'cpp-pointers-hard',
    title: 'C++ Pointers & Memory',
    language: 'C++',
    difficulty: 'Hard',
    questions: [
      { q: 'What does `new` do in C++?', options: ['Stack allocation', 'Heap allocation', 'Deletes memory', 'Nothing'], correct: 1 },
      { q: 'What happens if you forget to `delete` heap memory?', options: ['Compile error', 'Memory leak', 'Segfault always', 'Nothing, GC handles it'], correct: 1 },
      { q: 'What does a dangling pointer point to?', options: ['Valid new memory', 'Freed/invalid memory', 'A function', 'Nothing, it errors immediately'], correct: 1 },
      { q: 'Which smart pointer allows only one owner?', options: ['shared_ptr', 'unique_ptr', 'weak_ptr', 'raw_ptr'], correct: 1 },
      { q: 'What does `*ptr` do when `ptr` is a pointer?', options: ['Gets the address', 'Dereferences to the value', 'Deletes the pointer', 'Increments it'], correct: 1 },
    ],
  },
]

export const currentUser = { id: 'me', username: 'you.codes', avatarColor: 'bg-accent' }

export const tutorials = {
  javascript: {
    label: 'JavaScript',
    icon: '🟨',
    lessons: [
      {
        title: 'Variables & Data Types',
        body: 'JavaScript has three ways to declare variables: var, let, and const. Prefer let and const — they are block-scoped, which avoids a lot of classic bugs. const means the binding cannot be reassigned, not that the value is frozen.',
        code: `let age = 21;\nconst name = "CodeArena";\nlet isActive = true;\n\nconsole.log(\`\${name} user, age \${age}\`);`,
      },
      {
        title: 'Functions & Arrow Functions',
        body: 'Functions can be declared normally or as arrow functions. Arrow functions have a shorter syntax and do not bind their own `this`, which makes them useful inside callbacks.',
        code: `function add(a, b) {\n  return a + b;\n}\n\nconst multiply = (a, b) => a * b;\n\nconsole.log(add(2, 3), multiply(2, 3));`,
      },
      {
        title: 'Arrays & Loops',
        body: 'Arrays come with powerful built-in methods like map, filter, and reduce that let you transform data without writing manual loops.',
        code: `const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\n\nconsole.log(doubled, evens);`,
      },
      {
        title: 'ES6+ Features',
        body: 'Destructuring, spread/rest operators, and template literals make modern JavaScript far more concise than older syntax.',
        code: `const user = { name: "Rohit", rank: 4 };\nconst { name, rank } = user;\nconst combined = [...[1,2], ...[3,4]];\n\nconsole.log(name, rank, combined);`,
      },
    ],
  },
  python: {
    label: 'Python',
    icon: '🐍',
    lessons: [
      {
        title: 'Basics & Syntax',
        body: 'Python uses indentation instead of curly braces to define code blocks. Variables do not need explicit type declarations.',
        code: `name = "CodeArena"\nage = 21\nis_active = True\n\nprint(f"{name} user, age {age}")`,
      },
      {
        title: 'Data Structures',
        body: 'Python has four built-in collection types: list (ordered, mutable), tuple (ordered, immutable), set (unordered, unique), and dict (key-value pairs).',
        code: `nums = [1, 2, 3, 4, 5]\nsquares = [n * n for n in nums]\nuser = {"name": "Rohit", "rank": 4}\n\nprint(squares, user["rank"])`,
      },
      {
        title: 'Functions & Modules',
        body: 'Functions are defined with `def`. Python also lets you import modules to reuse code across files.',
        code: `def greet(name, rank=0):\n    return f"Hello {name}, rank #{rank}"\n\nprint(greet("Rohit", 4))`,
      },
      {
        title: 'OOP in Python',
        body: 'Classes bundle data and behavior together. `self` refers to the current instance, similar to `this` in other languages.',
        code: `class Coder:\n    def __init__(self, name, rank):\n        self.name = name\n        self.rank = rank\n\n    def intro(self):\n        return f"{self.name} is rank #{self.rank}"\n\nprint(Coder("Rohit", 4).intro())`,
      },
    ],
  },
  java: {
    label: 'Java',
    icon: '☕',
    lessons: [
      {
        title: 'Basics & OOP',
        body: 'Java is statically typed and everything lives inside a class. Every program needs a `main` method as its entry point.',
        code: `public class Main {\n  public static void main(String[] args) {\n    String name = "CodeArena";\n    int rank = 4;\n    System.out.println(name + " rank " + rank);\n  }\n}`,
      },
      {
        title: 'Collections',
        body: 'The Java Collections Framework provides List, Set, and Map implementations like ArrayList, HashSet, and HashMap.',
        code: `List<Integer> nums = new ArrayList<>(List.of(1, 2, 3));\nMap<String, Integer> ranks = new HashMap<>();\nranks.put("Rohit", 4);\n\nSystem.out.println(nums);\nSystem.out.println(ranks);`,
      },
      {
        title: 'Exception Handling',
        body: 'Java uses try/catch/finally blocks to handle runtime errors gracefully instead of crashing the program.',
        code: `try {\n  int result = 10 / 0;\n} catch (ArithmeticException e) {\n  System.out.println("Cannot divide by zero: " + e.getMessage());\n} finally {\n  System.out.println("Done");\n}`,
      },
    ],
  },
  cpp: {
    label: 'C++',
    icon: '🔷',
    lessons: [
      {
        title: 'Basics & Pointers',
        body: 'C++ gives you direct memory control through pointers. A pointer stores the address of another variable.',
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int rank = 4;\n  int* ptr = &rank;\n  cout << "Rank: " << *ptr << endl;\n  return 0;\n}`,
      },
      {
        title: 'STL Containers',
        body: 'The Standard Template Library provides ready-made containers like vector, map, and set with efficient built-in operations.',
        code: `#include <vector>\n#include <iostream>\nusing namespace std;\n\nint main() {\n  vector<int> nums = {1, 2, 3, 4};\n  for (int n : nums) cout << n << " ";\n  return 0;\n}`,
      },
      {
        title: 'OOP in C++',
        body: 'C++ supports classes, inheritance, and polymorphism, giving you both low-level control and high-level abstractions.',
        code: `class Coder {\npublic:\n  string name;\n  int rank;\n  Coder(string n, int r) : name(n), rank(r) {}\n  void intro() { cout << name << " is rank #" << rank; }\n};`,
      },
    ],
  },
}



export const directMessages = [
  {
    id: 'dm-shreya',
    name: 'shreya.codes',
    country: '🇮🇳',
    online: true,
    role: 'Rank #1 · DSA Battle',
    messages: [
      { id: 1, from: 'them', text: "Hey! Saw you climbed the leaderboard this week 🔥", time: '9:12 AM' },
      { id: 2, from: 'me', text: "Haha thanks, that Debugging Royale round was brutal", time: '9:14 AM' },
      { id: 3, from: 'them', text: "Right?? The memory leak bug in problem 4 got me for 20 mins", time: '9:15 AM' },
      { id: 4, from: 'them', text: "Are you joining Weekly Marathon #42 tomorrow?", time: '9:15 AM' },
    ],
  },
  {
    id: 'dm-devraj',
    name: 'devraj_99',
    country: '🇺🇸',
    online: true,
    role: 'Rank #2 · Java Championship',
    messages: [
      { id: 1, from: 'them', text: "gg on the react tournament, that drag-and-drop UI was clean", time: 'Yesterday' },
      { id: 2, from: 'me', text: "thank you! yours was faster though 😅", time: 'Yesterday' },
    ],
  },
  {
    id: 'dm-ananya',
    name: 'ananya_dev',
    country: '🇩🇪',
    online: false,
    role: 'Rank #4 · Full Stack',
    messages: [
      { id: 1, from: 'them', text: "Can you review my solution for SQL Clash #7 when you get a sec?", time: 'Mon' },
      { id: 2, from: 'me', text: "Sure, send it over", time: 'Mon' },
      { id: 3, from: 'them', text: "Just shared it in the SQL Challenge community 🙏", time: 'Mon' },
    ],
  },
  {
    id: 'dm-kernel',
    name: 'kernel_panic',
    country: '🇯🇵',
    online: false,
    role: 'Rank #5 · Competitive Programming',
    messages: [
      { id: 1, from: 'them', text: "Your editorial for the graph problem was super clear, thanks!", time: 'Sat' },
    ],
  },
]

export const communityChannels = [
  {
    id: 'community-general',
    name: 'General',
    icon: '💬',
    description: 'Say hi, ask questions, talk shop with the whole CodeArena community.',
    members: 48210,
    messages: [
      { id: 1, from: 'other', user: 'ishaan.py', text: "Anyone else's editor lagging on the new Python runtime?", time: '8:02 AM' },
      { id: 2, from: 'other', user: 'byte_bandit', text: "Working fine for me, try clearing cache in Settings", time: '8:05 AM' },
      { id: 3, from: 'other', user: 'rhea_builds', text: "Weekly Marathon #42 starts in 6 hours, good luck everyone 🚀", time: '8:20 AM' },
    ],
  },
  {
    id: 'community-dsa',
    name: 'DSA Battle',
    icon: '🧠',
    description: 'Data structures, algorithms, and everything in between.',
    members: 21870,
    messages: [
      { id: 1, from: 'other', user: 'nullptr_ninja', text: "Segment trees or Fenwick trees for range updates + range queries?", time: '10:41 AM' },
      { id: 2, from: 'other', user: 'meera_ml', text: "Fenwick if you only need point updates, segment tree is more flexible", time: '10:44 AM' },
    ],
  },
  {
    id: 'community-react',
    name: 'React Tournament',
    icon: '⚛️',
    description: 'UI challenges, component patterns, and Season 3 discussion.',
    members: 9310,
    messages: [
      { id: 1, from: 'other', user: 'sana_scripts', text: "Season 3 judging criteria dropped, check the contest page", time: 'Yesterday' },
      { id: 2, from: 'other', user: 'arjun_async', text: "Anyone using a state machine lib for the drag-and-drop round?", time: 'Yesterday' },
      { id: 3, from: 'other', user: 'diya_docker', text: "Just useReducer, keeping it simple this time", time: 'Yesterday' },
    ],
  },
  {
    id: 'community-sql',
    name: 'SQL Challenge',
    icon: '🗄️',
    description: 'Query optimization tips and SQL Clash discussion.',
    members: 5460,
    messages: [
      { id: 1, from: 'other', user: 'ananya_dev', text: "Just shared my SQL Clash #7 solution, feedback welcome 🙏", time: 'Mon' },
      { id: 2, from: 'other', user: 'karthik_cpp', text: "Your index choice on the join is smart, saved a full scan", time: 'Mon' },
    ],
  },
]

const dmAutoReplies = [
  "Nice, I'll check that out!",
  "Haha true 😄",
  "Good point, hadn't thought of that",
  "Let's team up for the next contest",
  "One sec, mid-submission ⏳",
  "That's a solid approach",
]

const communityAutoReplies = [
  { user: 'stackoverflow_king', text: "Good discussion, following along 👀" },
  { user: 'priya_prod', text: "Same question here honestly" },
  { user: 'yash_yield', text: "This community is so helpful 🙌" },
]

export function getDmAutoReply() {
  return dmAutoReplies[Math.floor(Math.random() * dmAutoReplies.length)]
}

export function getCommunityAutoReply() {
  return communityAutoReplies[Math.floor(Math.random() * communityAutoReplies.length)]
}

export const languageStarters = {
  javascript: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
  python: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        need = target - n\n        if need in seen:\n            return [seen[need], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))`,
  java: `import java.util.*;\n\nclass Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (seen.containsKey(need)) return new int[]{seen.get(need), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15}, 9)));\n    }\n}`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int need = target - nums[i];\n        if (seen.count(need)) return {seen[need], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    auto res = twoSum(nums, 9);\n    cout << "[" << res[0] << ", " << res[1] << "]" << endl;\n}`,
}

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
  { name: 'Aarav Mehta', role: 'Founder & Full Stack Lead', skills: ['React', 'Node', 'AWS'], contributions: 812, exp: '5 yrs' },
  { name: 'Isha Kapoor', role: 'Frontend Architect', skills: ['React', 'TypeScript', 'Design Systems'], contributions: 640, exp: '4 yrs' },
  { name: 'Rohit Sinha', role: 'Backend Engineer', skills: ['Java', 'Spring', 'PostgreSQL'], contributions: 588, exp: '4 yrs' },
  { name: 'Nandini Rao', role: 'DevOps & Infra', skills: ['Docker', 'Kubernetes', 'AWS'], contributions: 411, exp: '3 yrs' },
]

export const currentUser = { id: 'me', username: 'you.codes', avatarColor: 'bg-accent' }

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
  javascript: `// Two Sum\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
  python: `# Two Sum\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        need = target - n\n        if need in seen:\n            return [seen[need], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))`,
  java: `import java.util.*;\n\nclass Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (seen.containsKey(need)) return new int[]{seen.get(need), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15}, 9)));\n    }\n}`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int need = target - nums[i];\n        if (seen.count(need)) return {seen[need], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    auto res = twoSum(nums, 9);\n    cout << "[" << res[0] << ", " << res[1] << "]" << endl;\n}`,
}

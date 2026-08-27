import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { quizzes, tutorials } from '../data/mockData.js'
import { problemBank as baseProblemBank } from '../data/problems.js'
import { recordProblemSolved, addSubmission, getSubmissions } from '../utils/appData.js'
import { fetchProblemRemote, fetchProblemTestCasesRemote, fetchPreloadedCodeRemote } from '../utils/problemApi.js'
import DiscussionPanel from '../components/DiscussionPanel.jsx'

// ───────────────────────── Extra problem set (LeetCode-style, Easy/Medium/Hard) ─────────────────────────
// Merged into problemBank below. Each entry: id, title, statement, difficulty, tags, constraints,
// timeComplexity, params, testCases, starter — same shape as the entries in ../data/problems.js
const extraProblems = [
  // ───────────────────────── EASY ─────────────────────────
  {
    id: 'two-sum',
    title: 'Two Sum',
    statement:
      'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Assume exactly one valid pair exists, and you may not use the same element twice.',
    difficulty: 'Easy',
    tags: ['array', 'hash map'],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i], target <= 10^9', 'Exactly one valid answer exists'],
    timeComplexity: 'Aim for O(n) time using a hash map, O(n) extra space',
    params: ['nums', 'target'],
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
    starter: 'function solve(nums, target) {\n  \n}\n',
    unordered: true,
  },
  {
    id: 'reverse-string-inplace',
    title: 'Reverse String',
    statement: 'Given an array of characters, return the array reversed.',
    difficulty: 'Easy',
    tags: ['string', 'two pointers'],
    constraints: ['1 <= s.length <= 10^5'],
    timeComplexity: 'Aim for O(n) time, O(1) extra space using two pointers',
    params: ['s'],
    testCases: [
      { args: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'] },
      { args: [['a', 'b']], expected: ['b', 'a'] },
    ],
    starter: 'function solve(s) {\n  \n}\n',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    statement:
      "Given a string containing only the characters '(', ')', '{', '}', '[' and ']', determine whether every bracket is closed by the matching type in the correct order.",
    difficulty: 'Easy',
    tags: ['string', 'stack'],
    constraints: ['1 <= s.length <= 10^4'],
    timeComplexity: 'Aim for O(n) time, O(n) space using a stack',
    params: ['s'],
    testCases: [
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([{}])'], expected: true },
      { args: ['((('], expected: false },
    ],
    starter: 'function solve(s) {\n  \n}\n',
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    statement: 'Given an array of integers, return true if any value appears at least twice, and false if every element is distinct.',
    difficulty: 'Easy',
    tags: ['array', 'hash set'],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    timeComplexity: 'Aim for O(n) time using a hash set, O(n) space',
    params: ['nums'],
    testCases: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
    ],
    starter: 'function solve(nums) {\n  \n}\n',
  },
  {
    id: 'single-number',
    title: 'Single Number',
    statement: 'Given a non-empty array where every element appears exactly twice except for one, find that single element.',
    difficulty: 'Easy',
    tags: ['array', 'bit manipulation'],
    constraints: ['1 <= nums.length <= 3*10^4', 'Exactly one element appears once, rest appear exactly twice'],
    timeComplexity: 'Aim for O(n) time, O(1) extra space (hint: XOR)',
    params: ['nums'],
    testCases: [
      { args: [[2, 2, 1]], expected: 1 },
      { args: [[4, 1, 2, 1, 2]], expected: 4 },
      { args: [[1]], expected: 1 },
    ],
    starter: 'function solve(nums) {\n  \n}\n',
  },
  {
    id: 'best-time-buy-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    statement:
      'Given an array where prices[i] is the stock price on day i, find the maximum profit from buying on one day and selling on a later day. Return 0 if no profit is possible.',
    difficulty: 'Easy',
    tags: ['array', 'greedy'],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    timeComplexity: 'Aim for O(n) time, O(1) extra space — single pass tracking the running minimum',
    params: ['prices'],
    testCases: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[2, 4, 1]], expected: 2 },
    ],
    starter: 'function solve(prices) {\n  \n}\n',
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    statement: 'Given an integer, return true if it reads the same forwards and backwards, without converting the whole number to a string.',
    difficulty: 'Easy',
    tags: ['math'],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    timeComplexity: 'Aim for O(log10 n) time, O(1) extra space',
    params: ['x'],
    testCases: [
      { args: [121], expected: true },
      { args: [-121], expected: false },
      { args: [10], expected: false },
      { args: [12321], expected: true },
    ],
    starter: 'function solve(x) {\n  \n}\n',
  },
  {
    id: 'missing-number',
    title: 'Missing Number',
    statement: 'Given an array containing n distinct numbers taken from the range 0 to n, find the one number missing from the range.',
    difficulty: 'Easy',
    tags: ['array', 'math', 'bit manipulation'],
    constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All values are distinct'],
    timeComplexity: 'Aim for O(n) time, O(1) extra space (hint: sum formula or XOR)',
    params: ['nums'],
    testCases: [
      { args: [[3, 0, 1]], expected: 2 },
      { args: [[0, 1]], expected: 2 },
      { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    ],
    starter: 'function solve(nums) {\n  \n}\n',
  },

  // ───────────────────────── MEDIUM ─────────────────────────
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    statement: 'Given an array of strings, group the ones that are anagrams of each other. Each group may be returned in any order, as may the groups themselves.',
    difficulty: 'Medium',
    tags: ['string', 'hash map', 'sorting'],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'Lowercase English letters only'],
    timeComplexity: 'Aim for O(n * k log k) time where k is max string length, using a sorted-key hash map',
    params: ['strs'],
    testCases: [
      {
        args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
      },
      { args: [['']], expected: [['']] },
      { args: [['a']], expected: [['a']] },
    ],
    starter: 'function solve(strs) {\n  \n}\n',
    unordered: true,
  },
  {
    id: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    statement: 'Given a string, find the length of the longest contiguous substring that has no repeated characters.',
    difficulty: 'Medium',
    tags: ['string', 'sliding window', 'hash map'],
    constraints: ['0 <= s.length <= 5*10^4'],
    timeComplexity: 'Aim for O(n) time using a sliding window, O(min(n, charset)) space',
    params: ['s'],
    testCases: [
      { args: ['abcabcbb'], expected: 3 },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3 },
      { args: [''], expected: 0 },
    ],
    starter: 'function solve(s) {\n  \n}\n',
  },
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    statement:
      'Given an array nums, return an array where each element is the product of every number in nums except itself, without using division.',
    difficulty: 'Medium',
    tags: ['array', 'prefix sum'],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    timeComplexity: 'Aim for O(n) time using prefix/suffix products, O(1) extra space besides output',
    params: ['nums'],
    testCases: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
    ],
    starter: 'function solve(nums) {\n  \n}\n',
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    statement: 'Given an integer array, find the contiguous subarray (containing at least one number) with the largest sum, and return that sum.',
    difficulty: 'Medium',
    tags: ['array', 'dynamic programming', 'divide and conquer'],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    timeComplexity: "Aim for O(n) time using Kadane's algorithm, O(1) extra space",
    params: ['nums'],
    testCases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
    ],
    starter: 'function solve(nums) {\n  \n}\n',
  },
  {
    id: 'three-sum',
    title: '3Sum',
    statement:
      'Given an array of integers, return all unique triplets [a, b, c] such that a + b + c = 0. The result should not contain duplicate triplets.',
    difficulty: 'Medium',
    tags: ['array', 'two pointers', 'sorting'],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    timeComplexity: 'Aim for O(n^2) time by sorting first, then using two pointers per fixed element',
    params: ['nums'],
    testCases: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
    ],
    starter: 'function solve(nums) {\n  \n}\n',
    unordered: true,
  },
  {
    id: 'rotate-array',
    title: 'Rotate Array',
    statement: 'Given an array, rotate it to the right by k steps and return the rotated array.',
    difficulty: 'Medium',
    tags: ['array', 'two pointers'],
    constraints: ['1 <= nums.length <= 10^5', '0 <= k <= 10^5'],
    timeComplexity: 'Aim for O(n) time, O(1) extra space (hint: reverse the whole array, then reverse the two parts)',
    params: ['nums', 'k'],
    testCases: [
      { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4] },
      { args: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100] },
    ],
    starter: 'function solve(nums, k) {\n  \n}\n',
  },
  {
    id: 'top-k-frequent',
    title: 'Top K Frequent Elements',
    statement: 'Given an integer array and an integer k, return the k most frequent elements. The order of the result does not matter.',
    difficulty: 'Medium',
    tags: ['array', 'hash map', 'heap', 'sorting'],
    constraints: ['1 <= nums.length <= 10^5', 'k is always valid: 1 <= k <= number of distinct elements'],
    timeComplexity: 'Aim for O(n log n) time (a bucket-sort approach can reach O(n))',
    params: ['nums', 'k'],
    testCases: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { args: [[1], 1], expected: [1] },
    ],
    starter: 'function solve(nums, k) {\n  \n}\n',
    unordered: true,
  },
  {
    id: 'search-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    statement:
      'A sorted array of distinct integers has been rotated at an unknown pivot. Given the rotated array and a target value, return the index of the target, or -1 if it is not present.',
    difficulty: 'Medium',
    tags: ['array', 'binary search'],
    constraints: ['1 <= nums.length <= 5000', 'All values in nums are unique'],
    timeComplexity: 'Aim for O(log n) time using a modified binary search',
    params: ['nums', 'target'],
    testCases: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
    ],
    starter: 'function solve(nums, target) {\n  \n}\n',
  },

  // ───────────────────────── HARD ─────────────────────────
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    statement:
      'Given an array where each element represents the height of a bar of width 1, compute how much water can be trapped between the bars after it rains.',
    difficulty: 'Hard',
    tags: ['array', 'two pointers', 'dynamic programming'],
    constraints: ['1 <= height.length <= 2*10^4', '0 <= height[i] <= 10^5'],
    timeComplexity: 'Aim for O(n) time using two pointers, O(1) extra space',
    params: ['height'],
    testCases: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    ],
    starter: 'function solve(height) {\n  \n}\n',
  },
  {
    id: 'median-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    statement: 'Given two sorted arrays, return the median of the combined sorted array.',
    difficulty: 'Hard',
    tags: ['array', 'binary search', 'divide and conquer'],
    constraints: ['0 <= nums1.length, nums2.length <= 1000', '1 <= nums1.length + nums2.length <= 2000'],
    timeComplexity: 'Aim for O(log(min(m, n))) time using binary search on the smaller array',
    params: ['nums1', 'nums2'],
    testCases: [
      { args: [[1, 3], [2]], expected: 2 },
      { args: [[1, 2], [3, 4]], expected: 2.5 },
      { args: [[0, 0], [0, 0]], expected: 0 },
    ],
    starter: 'function solve(nums1, nums2) {\n  \n}\n',
  },
  {
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    statement:
      'Given an array and a window size k, slide the window from the very left to the very right of the array, and return the maximum value inside the window at each position.',
    difficulty: 'Hard',
    tags: ['array', 'sliding window', 'deque'],
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= nums.length'],
    timeComplexity: 'Aim for O(n) time using a monotonic deque, O(k) extra space',
    params: ['nums', 'k'],
    testCases: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[1], 1], expected: [1] },
    ],
    starter: 'function solve(nums, k) {\n  \n}\n',
  },
  {
    id: 'edit-distance',
    title: 'Edit Distance',
    statement:
      'Given two strings word1 and word2, return the minimum number of single-character insertions, deletions, or substitutions required to turn word1 into word2.',
    difficulty: 'Hard',
    tags: ['string', 'dynamic programming'],
    constraints: ['0 <= word1.length, word2.length <= 500'],
    timeComplexity: 'Aim for O(m * n) time and space using 2D dynamic programming',
    params: ['word1', 'word2'],
    testCases: [
      { args: ['horse', 'ros'], expected: 3 },
      { args: ['intention', 'execution'], expected: 5 },
      { args: ['', 'abc'], expected: 3 },
    ],
    starter: 'function solve(word1, word2) {\n  \n}\n',
  },
  {
    id: 'largest-rectangle-histogram',
    title: 'Largest Rectangle in Histogram',
    statement:
      'Given an array of bar heights forming a histogram where each bar has width 1, find the area of the largest rectangle that fits entirely within the histogram.',
    difficulty: 'Hard',
    tags: ['array', 'stack'],
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    timeComplexity: 'Aim for O(n) time using a monotonic increasing stack',
    params: ['heights'],
    testCases: [
      { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { args: [[2, 4]], expected: 4 },
    ],
    starter: 'function solve(heights) {\n  \n}\n',
  },
  {
    id: 'first-missing-positive',
    title: 'First Missing Positive',
    statement: 'Given an unsorted integer array, find the smallest missing positive integer.',
    difficulty: 'Hard',
    tags: ['array', 'in-place hashing'],
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    timeComplexity: 'Aim for O(n) time, O(1) extra space by placing each value at its own index in place',
    params: ['nums'],
    testCases: [
      { args: [[1, 2, 0]], expected: 3 },
      { args: [[3, 4, -1, 1]], expected: 2 },
      { args: [[7, 8, 9, 11, 12]], expected: 1 },
    ],
    starter: 'function solve(nums) {\n  \n}\n',
  },
  {
    id: 'longest-valid-parentheses',
    title: 'Longest Valid Parentheses',
    statement: "Given a string containing only '(' and ')', find the length of the longest contiguous substring that forms valid parentheses.",
    difficulty: 'Hard',
    tags: ['string', 'stack', 'dynamic programming'],
    constraints: ['0 <= s.length <= 3*10^4'],
    timeComplexity: 'Aim for O(n) time using a stack of indices, O(n) space',
    params: ['s'],
    testCases: [
      { args: ['(()'], expected: 2 },
      { args: [')()())'], expected: 4 },
      { args: [''], expected: 0 },
    ],
    starter: 'function solve(s) {\n  \n}\n',
  },
  {
    id: 'n-queens-count',
    title: 'N-Queens (Count Solutions)',
    statement:
      'The n-queens puzzle asks you to place n queens on an n x n chessboard so that no two queens attack each other. Given n, return the total number of distinct solutions.',
    difficulty: 'Hard',
    tags: ['backtracking', 'recursion'],
    constraints: ['1 <= n <= 9'],
    timeComplexity: 'Backtracking with column/diagonal pruning; roughly O(n!) worst case but pruned heavily in practice',
    params: ['n'],
    testCases: [
      { args: [4], expected: 2 },
      { args: [1], expected: 1 },
      { args: [8], expected: 92 },
    ],
    starter: 'function solve(n) {\n  \n}\n',
  },
]

// Merge the built-in problem bank (from data/problems.js) with the extra set above.
const problemBank = [...baseProblemBank, ...extraProblems]

const modes = [
  {
    id: 'compiler',
    label: '💻 Compiler',
    desc: 'Write & run code',
  },
  {
    id: 'playground',
    label: '🛝 Playground',
    desc: 'Free-form learning compiler',
  },
  {
    id: 'quizzes',
    label: '🧠 Quizzes',
    desc: 'Test your knowledge',
  },
  {
    id: 'tutorials',
    label: '📘 Tutorials',
    desc: 'Learn step by step',
  },
]
export default function CodeEditor() {
  const [mode, setMode] = useState('compiler')
  const [searchParams] = useSearchParams()
  const problemIdParam = searchParams.get('problemId')
  const contestIdParam = searchParams.get('contestId')
  useEffect(() => {
    if (problemIdParam || contestIdParam) setMode('compiler')
  }, [problemIdParam, contestIdParam])
  return (
    <div className="bg-white">
      <div className="border-b border-border bg-bg-soft/60">
        <div className="max-w-[1400px] mx-auto px-5 flex gap-1 overflow-x-auto">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${mode === m.id ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'compiler' && <CompilerView />}
      {mode === 'playground' && <PlaygroundView />}
      {mode === 'quizzes' && <QuizzesView />}
      {mode === 'tutorials' && <TutorialsView />}
    </div>
  )
}
const languages = [
  {
    id: 'javascript',
    label: 'JavaScript',
  },
  {
    id: 'python',
    label: 'Python',
  },
  {
    id: 'java',
    label: 'Java',
  },
  {
    id: 'cpp',
    label: 'C++',
  },
]
const MONACO_LANG = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
}
const GRADED_LANGUAGES = ['javascript', 'python']
function deepClone(v) {
  return JSON.parse(JSON.stringify(v))
}
function normalize(v) {
  if (Array.isArray(v)) {
    return v.map(normalize).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  }
  return v
}
function valuesMatch(actual, expected, unordered) {
  if (unordered) return JSON.stringify(normalize(actual)) === JSON.stringify(normalize(expected))
  return JSON.stringify(actual) === JSON.stringify(expected)
}
function runJsAgainstTests(code, problem) {
  let solveFn
  try {
    solveFn = new Function(
      `${code}\nif (typeof solve !== 'function') { throw new Error("Define a function named solve(${problem.params.join(', ')})."); }\nreturn solve;`
    )()
  } catch (err) {
    return {
      compileError: err.message,
    }
  }
  const results = problem.testCases.map((tc) => {
    try {
      const actual = solveFn(...tc.args.map(deepClone))
      return {
        pass: valuesMatch(actual, tc.expected, problem.unordered),
        actual,
        expected: tc.expected,
        args: tc.args,
      }
    } catch (err) {
      return {
        pass: false,
        actual: `Runtime error: ${err.message}`,
        expected: tc.expected,
        args: tc.args,
      }
    }
  })
  return {
    results,
  }
}
async function runPythonAgainstTests(code, problem) {
  const results = []
  for (const tc of problem.testCases) {
    const argsJson = JSON.stringify(tc.args)
    const driver = `${code}

import json
_args = json.loads(${JSON.stringify(argsJson)})
try:
    _result = solve(*_args)
    print("__OK__" + json.dumps(_result))
except Exception as e:
    print("__ERR__" + str(e))
`
    const res = await runViaJudge0('python', driver, '')
    if (res.error) {
      results.push({
        pass: false,
        actual: `Error: ${res.error}`,
        expected: tc.expected,
        args: tc.args,
      })
      continue
    }
    const line = (res.output || '').trim().split('\n').pop()
    if (line.startsWith('__OK__')) {
      try {
        const actual = JSON.parse(line.slice(6))
        results.push({
          pass: valuesMatch(actual, tc.expected, problem.unordered),
          actual,
          expected: tc.expected,
          args: tc.args,
        })
      } catch {
        results.push({
          pass: false,
          actual: line,
          expected: tc.expected,
          args: tc.args,
        })
      }
    } else {
      results.push({
        pass: false,
        actual: line.replace('__ERR__', 'Runtime error: ') || '(no output)',
        expected: tc.expected,
        args: tc.args,
      })
    }
  }
  return {
    results,
  }
}
// ───────────────────────── Piston (public, free, no signup/API key) ─────────────────────────
// Used only for the freeform Playground and for non-graded languages in the Compiler.
// Remote (contest) problems now go through our own backend — see runProblemRemote / submitProblemRemote below.
const PISTON_ALIASES = {
  python: ['python', 'python3'],
  java: ['java'],
  cpp: ['c++', 'cpp', 'g++'],
}
// Piston's compilers (javac, g++) pick behavior off the file extension, and
// Java additionally requires the filename to match the public class name.
const PISTON_FILENAMES = {
  python: 'main.py',
  java: 'Main.java',
  cpp: 'main.cpp',
}
const PISTON_FALLBACK_RUNTIMES = {
  python: {
    language: 'python',
    version: '3.10.0',
  },
  java: {
    language: 'java',
    version: '15.0.2',
  },
  cpp: {
    language: 'c++',
    version: '10.2.0',
  },
}
let runtimesCache = null
let runtimesCacheAt = 0

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

async function withRetries(fn, attempts = 3, delayMs = 900) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)))
    }
  }
  throw lastErr
}

async function getRuntimes() {
  if (runtimesCache && Date.now() - runtimesCacheAt < 10 * 60 * 1000) return runtimesCache
  const res = await fetchWithTimeout('https://emkc.org/api/v2/piston/runtimes', {}, 10000)
  if (!res.ok) throw new Error(`Couldn't load compiler runtime list (${res.status}).`)
  runtimesCache = await res.json()
  runtimesCacheAt = Date.now()
  return runtimesCache
}

async function resolveRuntime(languageId) {
  const wanted = PISTON_ALIASES[languageId] || [languageId]
  try {
    const runtimes = await getRuntimes()
    const match = runtimes.find((r) => wanted.includes(r.language) || (r.aliases || []).some((a) => wanted.includes(a)))
    if (match)
      return {
        language: match.language,
        version: match.version,
      }
  } catch {}
  return PISTON_FALLBACK_RUNTIMES[languageId] || null
}

async function runViaJudge0(languageId, code, stdin) {
  const runtime = await resolveRuntime(languageId)
  if (!runtime)
    return {
      output: '',
      error: 'Unsupported language.',
    }
  try {
    const res = await withRetries(() =>
      fetchWithTimeout(
        'https://emkc.org/api/v2/piston/execute',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [
              {
                name: PISTON_FILENAMES[languageId] || `main.${languageId}`,
                content: code,
              },
            ],
            stdin: stdin || '',
          }),
        },
        15000
      )
    )
    const data = await res.json().catch(() => null)
    if (!res.ok)
      return {
        output: '',
        error: `Compiler service error (${res.status}): ${data?.message || 'The public Piston service may be rate-limited right now — try again shortly.'}`,
      }
    if (!data)
      return {
        output: '',
        error: 'Compiler service returned an unexpected response.',
      }
    if (data.compile && data.compile.code !== 0)
      return {
        output: '',
        error: data.compile.stderr || data.compile.output || 'Compile error.',
      }
    if (data.run) {
      const combined = (data.run.stdout || '') + (data.run.stderr ? '\n' + data.run.stderr : '')
      return {
        output: combined || '(no output)',
        error: null,
      }
    }
    return {
      output: '',
      error: data.message || 'Execution failed.',
    }
  } catch (err) {
    const timedOut = err.name === 'AbortError'
    return {
      output: '',
      error: timedOut
        ? 'The compiler service timed out after a few retries — it may be overloaded right now. Try again in a bit.'
        : `Couldn't reach the compiler service — check your internet connection. (${err.message})`,
    }
  }
}

// ───────────────────────── Our backend compiler APIs (contest / remote problems) ─────────────────────────
// Base server URL — reuse wherever the rest of the app already defines it (e.g. utils/api.js),
// swap this out instead of duplicating if that already exists.
const server = import.meta.env.VITE_API_URL

// POST {{server}}/api/v1/execute/:problemId/run
async function runProblemRemote(problemId, languageId, sourceCode) {
  try {
    const res = await fetch(`${server}/api/v1/execute/${problemId}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ languageId, sourceCode }),
      credentials: 'include', // include cookies for session auth
    })
    return await res.json()
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// POST {{server}}/api/v1/execute/:contestId/:problemId/submit
async function submitProblemRemote(contestId, problemId, languageId, sourceCode) {
  try {
    const res = await fetch(`${server}/api/v1/execute/${contestId}/${problemId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ languageId, sourceCode }),
      credentials: 'include',
    })
    return await res.json()
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// Backend sends { testcase, passed, input, expectedOutput, actualOutput, status, time, memory }.
// formatResults() below expects { pass, actual, expected, args }, so map field names here.
function mapBackendResults(backendResults) {
  return (backendResults || []).map((r) => ({
    pass: r.passed,
    actual: r.actualOutput,
    expected: r.expectedOutput,
    args: [r.input],
  }))
}

function pythonStub(problem) {
  return `def solve(${problem.params.join(', ')}):\n    pass\n`
}
function genericStub(languageId) {
  return languageId === 'java'
    ? 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Run freely here — auto-grading is available for JavaScript and Python.");\n    }\n}'
    : languageId === 'cpp'
      ? '#include <iostream>\nint main() {\n    std::cout << "Run freely here — auto-grading is available for JavaScript and Python.";\n    return 0;\n}'
      : ''
}
function starterFor(languageId, problem) {
  if (languageId === 'javascript') return problem.starter
  if (languageId === 'python') return pythonStub(problem)
  return genericStub(languageId)
}
const difficultyColors = {
  Easy: 'bg-success/10 text-success',
  Medium: 'bg-warning/10 text-warning',
  Hard: 'bg-danger/10 text-danger',
}

// ───────────────────────── Playground (free-form learning compiler) ─────────────────────────
const playgroundStarters = {
  javascript: '// Write any JavaScript here — use console.log to print output\nconsole.log("Hello, world!")\n',
  python: '# Write any Python here — use print to show output\nprint("Hello, world!")\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}\n',
}
function runJsFreeform(code) {
  const logs = []
  const stringify = (v) => (typeof v === 'string' ? v : (() => {
    try {
      return JSON.stringify(v)
    } catch {
      return String(v)
    }
  })())
  const fakeConsole = {
    log: (...args) => logs.push(args.map(stringify).join(' ')),
    error: (...args) => logs.push(args.map(stringify).join(' ')),
    warn: (...args) => logs.push(args.map(stringify).join(' ')),
  }
  try {
    const fn = new Function('console', code)
    fn(fakeConsole)
    return {
      output: logs.length ? logs.join('\n') : '(no output — use console.log(...) to print something)',
      error: null,
    }
  } catch (err) {
    return {
      output: logs.join('\n'),
      error: err.message,
    }
  }
}
function PlaygroundView() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(playgroundStarters.javascript)
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState('Run your code to see output here.')
  const [running, setRunning] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setCode(playgroundStarters[language] || '')
    setOutput('Run your code to see output here.')
  }, [language])

  const handleRun = async () => {
    setRunning(true)
    if (language === 'javascript') {
      const r = runJsFreeform(code)
      setOutput(r.error ? `${r.output ? r.output + '\n\n' : ''}❌ ${r.error}` : r.output)
    } else {
      const r = await runViaJudge0(language, code, stdin)
      setOutput(r.error ? `❌ ${r.error}` : r.output)
    }
    setRunning(false)
  }

  const handleClear = () => {
    setCode('')
    setOutput('Run your code to see output here.')
  }

  const handleReset = () => {
    setCode(playgroundStarters[language] || '')
    setOutput('Run your code to see output here.')
  }

  return (
    <div className={theme === 'dark' ? 'bg-ink' : 'bg-white'}>
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-0 min-h-[calc(100vh-112px)]">
        <div className="border-r border-border flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-soft gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm font-medium bg-white border border-border rounded-xl px-3 py-1.5"
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-ink-soft truncate">
                Free-form scratchpad — edit and run anything, nothing is graded.
              </span>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-sm px-3 py-1.5 rounded-xl border border-border hover:bg-white shrink-0"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={MONACO_LANG[language] || 'plaintext'}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              options={{
                fontSize: 14,
                minimap: {
                  enabled: false,
                },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: {
                  top: 12,
                },
              }}
              loading={<div className="h-full grid place-items-center text-sm text-ink-soft">Loading editor…</div>}
            />
          </div>
          <div className="flex gap-3 px-4 py-3 border-t border-border bg-bg-soft">
            <button
              onClick={handleRun}
              disabled={running}
              className="px-5 py-2 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              {running ? 'Running…' : '▶ Run code'}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-2xl border border-border font-semibold text-sm text-ink hover:bg-white"
            >
              Reset to example
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 rounded-2xl border border-border font-semibold text-sm text-ink hover:bg-white"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {language !== 'javascript' && (
            <div className="border-b border-border p-4">
              <p className="text-xs font-semibold text-ink-soft mb-2 uppercase tracking-wide">Stdin (optional)</p>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                rows={4}
                placeholder="Type any input your program reads from stdin…"
                className="w-full text-xs font-mono border border-border rounded-xl p-3"
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide px-4 pt-4">Output</p>
            <pre className="p-4 font-mono text-xs whitespace-pre-wrap text-ink-soft">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionsPanel({ problem, user, theme }) {
  const mine = user ? getSubmissions(problem.id, user.username) : []
  const [expanded, setExpanded] = useState(null)
  const mutedText = theme === 'dark' ? 'text-white/60' : 'text-ink-soft'
  const mainText = theme === 'dark' ? 'text-white' : 'text-ink'
  if (!user) {
    return <p className={`text-xs ${mutedText}`}>Log in to see your submission history for this problem.</p>
  }
  if (mine.length === 0) {
    return <p className={`text-xs ${mutedText}`}>You haven't submitted a solution to this problem yet.</p>
  }
  return (
    <div className="space-y-2.5">
      {mine.map((s) => (
        <div key={s.id} className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded((e) => (e === s.id ? null : s.id))}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs"
          >
            <span className={`font-semibold ${s.passed ? 'text-success' : 'text-danger'}`}>
              {s.passed ? '✅ Accepted' : `❌ ${s.passedCount}/${s.total} passed`}
            </span>
            <span className={mutedText}>
              {s.language} · {new Date(s.at).toLocaleString()}
            </span>
          </button>
          {expanded === s.id && (
            <pre
              className={`text-[11px] font-mono px-3 py-2.5 overflow-x-auto ${theme === 'dark' ? 'bg-black/30 text-white/80' : 'bg-muted text-ink'}`}
            >
              {s.code}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
function ProblemPicker({ problem, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [diff, setDiff] = useState('All')
  const filtered = problemBank.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    const matchesDiff = diff === 'All' || p.difficulty === diff
    return matchesQuery && matchesDiff
  })
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border text-sm font-medium hover:bg-bg-soft"
      >
        <span>📚 {problemBank.length} problems — click to browse</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2 border border-border rounded-xl p-3 bg-bg-soft">
          <div className="flex gap-2 mb-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or tag..."
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-border text-xs"
            />
            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-border text-xs bg-white"
            >
              {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelect(p)
                  setOpen(false)
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-white ${p.id === problem.id ? 'bg-white font-semibold' : ''}`}
              >
                <span className="truncate">{p.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${difficultyColors[p.difficulty]}`}
                >
                  {p.difficulty}
                </span>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-xs text-ink-soft text-center py-4">No matches.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
function normalizeRemoteProblem(remote, testCases) {
  return {
    id: remote.id,
    title: remote.title,
    statement: remote.statement,
    difficulty: (remote.difficulty || 'easy').replace(/^\w/, (c) => c.toUpperCase()),
    tags: remote.tags || [],
    constraints: remote.constraints || [],
    params: [],
    testCases: (testCases || []).map((tc) => ({ input: tc.input, output: tc.output })),
    isRemote: true,
    contestId: remote.contestId,
  }
}

function CompilerView() {
  const user = useSelector((s) => s.auth.user)
  const [searchParams] = useSearchParams()
  const remoteContestId = searchParams.get('contestId')
  const remoteProblemId = searchParams.get('problemId')
  const [problem, setProblem] = useState(problemBank[0])
  const [loadingRemote, setLoadingRemote] = useState(!!(remoteContestId && remoteProblemId))
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(starterFor('javascript', problemBank[0]))
  const [output, setOutput] = useState('Run your code to see output here.')
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('console')
  const [theme, setTheme] = useState('light')
  const [seconds, setSeconds] = useState(90 * 60)
  const [lastRun, setLastRun] = useState(null)
  const [leftTab, setLeftTab] = useState('statement')
  useEffect(() => setLeftTab('statement'), [problem.id])
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!remoteContestId || !remoteProblemId) return
    let cancelled = false
    setLoadingRemote(true)
    Promise.all([
      fetchProblemRemote(remoteContestId, remoteProblemId),
      fetchProblemTestCasesRemote(remoteContestId, remoteProblemId),
    ]).then(([problemRes, testCasesRes]) => {
      if (cancelled) return
      setLoadingRemote(false)
      if (problemRes.problem) {
        setProblem(normalizeRemoteProblem(problemRes.problem, testCasesRes.testCases))
      }
    })
    return () => {
      cancelled = true
    }
  }, [remoteContestId, remoteProblemId])

  useEffect(() => {
    if (problem.isRemote) {
      let cancelled = false
      fetchPreloadedCodeRemote(problem.contestId || remoteContestId, problem.id, language).then((res) => {
        if (!cancelled) setCode(res.code || genericStub(language))
      })
      setOutput('Run your code to see output here.')
      setLastRun(null)
      return () => {
        cancelled = true
      }
    }
    setCode(starterFor(language, problem))
    setOutput('Run your code to see output here.')
    setLastRun(null)
  }, [language, problem.id])
  const timeStr = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const isGraded = GRADED_LANGUAGES.includes(language)

  const handleRun = async () => {
    setRunning(true)
    setActiveTab('console')
    if (problem.isRemote) {
      const r = await runProblemRemote(problem.id, language, code)
      if (!r.success) {
        setOutput(`❌ ${r.message || 'Run failed'}`)
      } else {
        const mapped = mapBackendResults(r.data.results)
        setOutput(formatResults(mapped, false) + `\n\n${r.data.passed}/${r.data.total} passed`)
      }
      setRunning(false)
      return
    }
    if (language === 'javascript') {
      const r = runJsAgainstTests(code, {
        ...problem,
        testCases: [problem.testCases[0]],
      })
      setOutput(r.compileError ? `❌ ${r.compileError}` : formatResults(r.results, false))
    } else if (language === 'python') {
      const r = await runPythonAgainstTests(code, {
        ...problem,
        testCases: [problem.testCases[0]],
      })
      setOutput(formatResults(r.results, false))
    } else {
      const r = await runViaJudge0(language, code, '')
      setOutput(r.error ? `❌ ${r.error}` : r.output)
    }
    setRunning(false)
  }

  const handleSubmit = async () => {
    setRunning(true)
    setActiveTab('console')
    if (problem.isRemote) {
      const r = await submitProblemRemote(remoteContestId, problem.id, language, code)
      if (!r.success) {
        setOutput(`❌ ${r.message || 'Submit failed'}`)
        setRunning(false)
        return
      }
      const { passed, total, allPassed } = r.data
      const mapped = mapBackendResults(r.data.results)
      setLastRun({ results: mapped })
      if (user) {
        addSubmission(problem.id, user.username, { language, code, passed: allPassed, passedCount: passed, total })
        if (allPassed) recordProblemSolved(user.username)
      }
      setOutput(
        `${allPassed ? '✅' : '⚠️'} ${passed}/${total} test cases passed\n\n` +
          formatResults(mapped, true) +
          (allPassed
            ? user
              ? '\n\n+10 points added to your account. Streak updated.'
              : '\n\nLog in to earn points and keep your streak for solved problems.'
            : total === 0
              ? '\n\nThis problem has no test cases yet — nothing to grade against.'
              : '\n\nSome test cases failed — check the details above and try again.')
      )
      setRunning(false)
      return
    }
    if (!isGraded) {
      setOutput(
        '⚠️ Auto-grading is available for JavaScript and Python right now. Java/C++ can still be run freely above — full multi-language grading is on the roadmap.'
      )
      setRunning(false)
      return
    }
    const r = language === 'javascript' ? runJsAgainstTests(code, problem) : await runPythonAgainstTests(code, problem)
    if (r.compileError) {
      setOutput(`❌ ${r.compileError}`)
      setRunning(false)
      return
    }
    const results = r.results
    const passedCount = results.filter((x) => x.pass).length
    const total = results.length
    const allPassed = passedCount === total
    setLastRun({
      results,
    })
    if (user) {
      addSubmission(problem.id, user.username, {
        language,
        code,
        passed: allPassed,
        passedCount,
        total,
      })
    }
    if (allPassed && user) recordProblemSolved(user.username)
    setOutput(
      `${allPassed ? '✅' : '⚠️'} ${passedCount}/${total} test cases passed\n\n` +
        formatResults(results, true) +
        (allPassed
          ? user
            ? '\n\n+10 points added to your account. Streak updated.'
            : '\n\nLog in to earn points and keep your streak for solved problems.'
          : '\n\nSome test cases failed — check the details above and try again.')
    )
    setRunning(false)
  }
  function formatResults(results, verbose) {
    return results
      .map((r, i) => {
        const status = r.pass ? '✅ PASS' : '❌ FAIL'
        if (!verbose) return `${status}\nOutput: ${JSON.stringify(r.actual)}\nExpected: ${JSON.stringify(r.expected)}`
        return `Test ${i + 1}: ${status}${r.pass ? '' : `\n  Input: ${JSON.stringify(r.args)}\n  Got: ${JSON.stringify(r.actual)}\n  Expected: ${JSON.stringify(r.expected)}`}`
      })
      .join('\n')
  }
  return (
    <div className={theme === 'dark' ? 'bg-ink' : 'bg-white'}>
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.1fr_1.4fr_0.9fr] gap-0 min-h-[calc(100vh-112px)]">
        <div
          className={`border-r border-border p-6 overflow-y-auto ${theme === 'dark' ? 'text-white/80' : 'text-ink-soft'}`}
        >
          {loadingRemote ? (
            <p className="text-sm text-ink-soft">Loading problem from the contest…</p>
          ) : (
            <>
              <ProblemPicker problem={problem} onSelect={setProblem} />

              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyColors[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                <span className="font-mono text-sm font-semibold text-accent">⏱ {timeStr}</span>
              </div>
              <h1 className={`font-display font-bold text-xl mb-1 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>
                {problem.title}
              </h1>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {problem.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">{problem.statement}</p>

              <div className={`flex gap-1 border-b mb-4 -mt-1 ${theme === 'dark' ? 'border-white/10' : 'border-border'}`}>
                {[
                  {
                    id: 'statement',
                    label: 'Description',
                  },
                  {
                    id: 'submissions',
                    label: 'Solutions',
                  },
                  {
                    id: 'discussion',
                    label: 'Discussion',
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLeftTab(t.id)}
                    className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${leftTab === t.id ? 'border-accent text-accent' : `border-transparent ${theme === 'dark' ? 'text-white/50 hover:text-white' : 'text-ink-soft hover:text-ink'}`}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {leftTab === 'statement' && (
                <>
                  {!problem.isRemote && (
                    <div className="mb-4">
                      <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>
                        Function signature
                      </h3>
                      <div className="font-mono text-xs bg-muted rounded-xl p-3">solve({problem.params.join(', ')})</div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>
                      Examples
                    </h3>
                    {problem.testCases.length === 0 ? (
                      <p className="text-xs text-ink-soft/70">No example test cases have been added to this problem yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {problem.testCases.slice(0, 3).map((tc, i) =>
                          problem.isRemote ? (
                            <div key={i} className="font-mono text-xs bg-muted rounded-xl p-3">
                              <div>Input: {tc.input}</div>
                              <div>Output: {tc.output}</div>
                            </div>
                          ) : (
                            <div key={i} className="font-mono text-xs bg-muted rounded-xl p-3">
                              <div>
                                Input: {problem.params.map((p, j) => `${p} = ${JSON.stringify(tc.args[j])}`).join(', ')}
                              </div>
                              <div>Output: {JSON.stringify(tc.expected)}</div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {problem.constraints?.length > 0 && (
                    <div className="mb-4">
                      <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>
                        Constraints
                      </h3>
                      <ul className="text-xs font-mono bg-muted rounded-xl p-3 space-y-1">
                        {problem.constraints.map((c, i) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {problem.timeComplexity && (
                    <div>
                      <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>
                        Time complexity target
                      </h3>
                      <div className="text-xs font-mono bg-muted rounded-xl p-3">⏱ {problem.timeComplexity}</div>
                    </div>
                  )}
                </>
              )}

              {leftTab === 'submissions' && <SubmissionsPanel problem={problem} user={user} theme={theme} />}

              {leftTab === 'discussion' && (
                <DiscussionPanel
                  type="problem"
                  id={problem.id}
                  dark={theme === 'dark'}
                  placeholder="Ask about this problem…"
                />
              )}
            </>
          )}
        </div>

        <div className="border-r border-border flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-soft">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm font-medium bg-white border border-border rounded-xl px-3 py-1.5"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                  {GRADED_LANGUAGES.includes(l.id) ? '' : ' (freeform)'}
                </option>
              ))}
            </select>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-sm px-3 py-1.5 rounded-xl border border-border hover:bg-white"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={MONACO_LANG[language] || 'plaintext'}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              options={{
                fontSize: 14,
                minimap: {
                  enabled: false,
                },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: {
                  top: 12,
                },
              }}
              loading={<div className="h-full grid place-items-center text-sm text-ink-soft">Loading editor…</div>}
            />
          </div>
          <div className="flex gap-3 px-4 py-3 border-t border-border bg-bg-soft">
            <button
              onClick={handleRun}
              disabled={running}
              className="px-5 py-2 rounded-2xl border border-border font-semibold text-sm text-ink hover:bg-white disabled:opacity-50"
            >
              {running ? 'Running…' : '▶ Run (1st example)'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={running}
              className="px-5 py-2 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex border-b border-border">
            {['console', 'test cases', 'leaderboard'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-3 text-sm font-medium capitalize ${activeTab === t ? 'text-accent border-b-2 border-accent' : 'text-ink-soft'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === 'console' && (
            <pre className="p-4 font-mono text-xs whitespace-pre-wrap flex-1 text-ink-soft overflow-y-auto">
              {output}
            </pre>
          )}

          {activeTab === 'test cases' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-2">
              {problem.testCases.map((tc, i) => {
                const result = lastRun?.results?.[i]
                return (
                  <div
                    key={i}
                    className={`font-mono text-xs rounded-xl p-3 border ${result ? (result.pass ? 'border-success/40 bg-success/5' : 'border-danger/40 bg-danger/5') : 'border-border bg-muted'}`}
                  >
                    <div className="flex justify-between mb-1">
                      <span>Case {i + 1}</span>
                      {result && <span>{result.pass ? '✅' : '❌'}</span>}
                    </div>
                    <div>Args: {JSON.stringify(tc.args)}</div>
                    <div>Expected: {JSON.stringify(tc.expected)}</div>
                    {result && !result.pass && <div>Got: {JSON.stringify(result.actual)}</div>}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="p-4 space-y-2 overflow-y-auto">
              {['shreya.codes', 'devraj_99', 'nullptr_ninja', 'ananya_dev'].map((u, i) => (
                <div
                  key={u}
                  className="flex items-center justify-between text-sm border border-border rounded-xl px-3 py-2"
                >
                  <span className="text-ink-soft">
                    #{i + 1} {u}
                  </span>
                  <span className="font-mono text-accent text-xs">{40 - i * 3}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
const difficultyStyles = {
  Easy: 'bg-success/10 text-success',
  Medium: 'bg-warning/10 text-warning',
  Hard: 'bg-danger/10 text-danger',
}
function QuizzesView() {
  const [langFilter, setLangFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [activeQuiz, setActiveQuiz] = useState(null)
  const languagesList = ['All', ...new Set(quizzes.map((q) => q.language))]
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']
  const filtered = quizzes.filter(
    (q) => (langFilter === 'All' || q.language === langFilter) && (diffFilter === 'All' || q.difficulty === diffFilter)
  )
  if (activeQuiz) {
    return <QuizRunner quiz={activeQuiz} onExit={() => setActiveQuiz(null)} />
  }
  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Coding Quizzes</h1>
      <p className="text-ink-soft text-sm mb-6">Sharpen your fundamentals across languages and difficulty levels.</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {languagesList.map((l) => (
            <button
              key={l}
              onClick={() => setLangFilter(l)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${langFilter === l ? 'bg-ink text-white border-ink' : 'border-border text-ink-soft hover:bg-bg-soft'}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${diffFilter === d ? 'bg-accent text-white border-accent' : 'border-border text-ink-soft hover:bg-bg-soft'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => setActiveQuiz(quiz)}
            className="card-lift text-left bg-white border border-border rounded-2xl p-6 hover:border-accent-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-ink-soft">{quiz.language}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyStyles[quiz.difficulty]}`}>
                {quiz.difficulty}
              </span>
            </div>
            <h3 className="font-display font-semibold text-ink mb-1">{quiz.title}</h3>
            <p className="text-xs text-ink-soft">
              {quiz.questions.length} questions · ~{quiz.questions.length * 1} min
            </p>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-ink-soft col-span-2 text-center py-10">No quizzes match those filters.</p>
        )}
      </div>
    </div>
  )
}
function QuizRunner({ quiz, onExit }) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [finished, setFinished] = useState(false)
  const question = quiz.questions[step]
  const handleAnswer = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === question.correct) setScore((s) => s + 1)
  }
  const handleNext = () => {
    if (step + 1 < quiz.questions.length) {
      setStep((s) => s + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }
  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100)
    return (
      <div className="max-w-lg mx-auto px-5 py-16 text-center">
        <div className="text-5xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '🎯' : '📚'}</div>
        <h2 className="font-display font-bold text-2xl text-ink mb-2">Quiz Complete!</h2>
        <p className="text-ink-soft mb-6">
          You scored{' '}
          <span className="font-semibold text-accent">
            {score}/{quiz.questions.length}
          </span>{' '}
          on {quiz.title}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-2xl border border-border font-semibold text-sm hover:bg-bg-soft"
          >
            Back to Quizzes
          </button>
          <button
            onClick={() => {
              setStep(0)
              setSelected(null)
              setScore(0)
              setAnswered(false)
              setFinished(false)
            }}
            className="px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="text-sm text-ink-soft hover:text-accent">
          ← Exit quiz
        </button>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyStyles[quiz.difficulty]}`}>
          {quiz.difficulty}
        </span>
      </div>

      <div className="w-full h-1.5 bg-bg-soft rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{
            width: `${((step + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      <p className="text-xs text-ink-soft mb-2">
        Question {step + 1} of {quiz.questions.length}
      </p>
      <h2 className="font-display font-semibold text-xl text-ink mb-6">{question.q}</h2>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, idx) => {
          let style = 'border-border hover:border-accent-soft'
          if (answered) {
            if (idx === question.correct) style = 'border-success bg-success/10'
            else if (idx === selected) style = 'border-danger bg-danger/10'
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left px-4 py-3 rounded-2xl border text-sm text-ink transition-colors ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover"
        >
          {step + 1 < quiz.questions.length ? 'Next Question →' : 'See Results'}
        </button>
      )}
    </div>
  )
}
function TutorialsView() {
  const langKeys = Object.keys(tutorials)
  const [activeLang, setActiveLang] = useState(langKeys[0])
  const [activeLesson, setActiveLesson] = useState(0)
  const lang = tutorials[activeLang]
  const lesson = lang.lessons[activeLesson]
  const selectLang = (key) => {
    setActiveLang(key)
    setActiveLesson(0)
  }
  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-ink-soft mb-2 uppercase tracking-wide">Language</p>
          <div className="space-y-1">
            {langKeys.map((key) => (
              <button
                key={key}
                onClick={() => selectLang(key)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${activeLang === key ? 'bg-accent text-white' : 'text-ink-soft hover:bg-bg-soft'}`}
              >
                <span>{tutorials[key].icon}</span> {tutorials[key].label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-soft mb-2 uppercase tracking-wide">Lessons</p>
          <div className="space-y-1">
            {lang.lessons.map((l, i) => (
              <button
                key={l.title}
                onClick={() => setActiveLesson(i)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${activeLesson === i ? 'bg-bg-soft text-accent' : 'text-ink-soft hover:bg-bg-soft'}`}
              >
                {i + 1}. {l.title}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{lang.icon}</span>
          <span className="text-xs font-medium text-ink-soft">
            {lang.label} · Lesson {activeLesson + 1}/{lang.lessons.length}
          </span>
        </div>
        <h1 className="font-display font-bold text-2xl text-ink mb-4">{lesson.title}</h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">{lesson.body}</p>
        <div className="rounded-2xl overflow-hidden border border-border">
          <div className="bg-bg-soft px-4 py-2 text-xs font-mono text-ink-soft border-b border-border">
            example.
            {activeLang === 'javascript'
              ? 'js'
              : activeLang === 'python'
                ? 'py'
                : activeLang === 'java'
                  ? 'java'
                  : 'cpp'}
          </div>
          <pre className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-5 overflow-x-auto whitespace-pre">
            {lesson.code}
          </pre>
        </div>

        <div className="flex justify-between mt-8">
          <button
            disabled={activeLesson === 0}
            onClick={() => setActiveLesson((l) => l - 1)}
            className="px-5 py-2.5 rounded-2xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-bg-soft"
          >
            ← Previous
          </button>
          <button
            disabled={activeLesson === lang.lessons.length - 1}
            onClick={() => setActiveLesson((l) => l + 1)}
            className="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-medium disabled:opacity-40 hover:bg-accent-hover"
          >
            Next Lesson →
          </button>
        </div>
      </div>
    </div>
  )
}
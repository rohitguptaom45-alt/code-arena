// Auto-generated problem bank. Every testcase's expected output was computed
// by running a verified reference solution — nothing here is hand-typed/guessed.
// Each problem uses a simple function-call format: your code defines solve(...params)
// and it is called directly with the given arguments; the return value is compared
// to the expected value (order-insensitive where noted).
export const problemBank = [
  {
    "id": "p1",
    "title": "Two Sum",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Assume exactly one valid pair exists.",
    "params": [
      "nums",
      "target"
    ],
    "starter": "function solve(nums, target) {\n  // return [i, j]\n}",
    "testCases": [
      {
        "args": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "args": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            3,
            3
          ],
          6
        ],
        "expected": [
          0,
          1
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p2",
    "title": "Contains Duplicate",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Given an array of integers, return true if any value appears at least twice.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            1,
            1,
            1,
            3,
            3,
            4,
            3,
            2,
            4,
            2
          ]
        ],
        "expected": true
      }
    ],
    "unordered": false
  },
  {
    "id": "p3",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Greedy"
    ],
    "statement": "Given daily stock prices, return the maximum profit from one buy and one later sell. Return 0 if no profit is possible.",
    "params": [
      "prices"
    ],
    "starter": "function solve(prices) {\n  // return max profit\n}",
    "testCases": [
      {
        "args": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5
      },
      {
        "args": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            2,
            4,
            1
          ]
        ],
        "expected": 2
      }
    ],
    "unordered": false
  },
  {
    "id": "p4",
    "title": "Maximum Subarray",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "DP",
      "Greedy"
    ],
    "statement": "Return the largest sum of any contiguous subarray (Kadane's algorithm).",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return max subarray sum\n}",
    "testCases": [
      {
        "args": [
          [
            -2,
            1,
            -3,
            4,
            -1,
            2,
            1,
            -5,
            4
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            5,
            4,
            -1,
            7,
            8
          ]
        ],
        "expected": 23
      }
    ],
    "unordered": false
  },
  {
    "id": "p5",
    "title": "Move Zeroes",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Move all zeroes in the array to the end while keeping the relative order of the non-zero elements. Return the resulting array.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return reordered array\n}",
    "testCases": [
      {
        "args": [
          [
            0,
            1,
            0,
            3,
            12
          ]
        ],
        "expected": [
          1,
          3,
          12,
          0,
          0
        ]
      },
      {
        "args": [
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      },
      {
        "args": [
          [
            1,
            0,
            1
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p6",
    "title": "Product of Array Except Self",
    "difficulty": "Medium",
    "tags": [
      "Array"
    ],
    "statement": "Return an array where each element is the product of all other elements, without using division.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return array of products\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          24,
          12,
          8,
          6
        ]
      },
      {
        "args": [
          [
            -1,
            1,
            0,
            -3,
            3
          ]
        ],
        "expected": [
          0,
          0,
          9,
          0,
          0
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p7",
    "title": "Majority Element",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Greedy"
    ],
    "statement": "Return the element that appears more than n/2 times in the array (guaranteed to exist).",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return majority element\n}",
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            3
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            2,
            2,
            1,
            1,
            1,
            2,
            2
          ]
        ],
        "expected": 2
      }
    ],
    "unordered": false
  },
  {
    "id": "p8",
    "title": "Missing Number",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Math"
    ],
    "statement": "Given n distinct numbers taken from 0..n, find the one missing number.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return missing number\n}",
    "testCases": [
      {
        "args": [
          [
            3,
            0,
            1
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            0,
            1
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            9,
            6,
            4,
            2,
            3,
            5,
            7,
            0,
            1
          ]
        ],
        "expected": 8
      }
    ],
    "unordered": false
  },
  {
    "id": "p9",
    "title": "Single Number",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Bit Manipulation"
    ],
    "statement": "Every element appears twice except one — find that single element.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return the single number\n}",
    "testCases": [
      {
        "args": [
          [
            2,
            2,
            1
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            4,
            1,
            2,
            1,
            2
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "unordered": false
  },
  {
    "id": "p10",
    "title": "Merge Sorted Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Merge two already-sorted arrays into one sorted array.",
    "params": [
      "a",
      "b"
    ],
    "starter": "function solve(a, b) {\n  // return merged sorted array\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3
          ],
          [
            2,
            5,
            6
          ]
        ],
        "expected": [
          1,
          2,
          2,
          3,
          5,
          6
        ]
      },
      {
        "args": [
          [],
          [
            1
          ]
        ],
        "expected": [
          1
        ]
      },
      {
        "args": [
          [
            4,
            5,
            6
          ],
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          5,
          6
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p11",
    "title": "Find All Duplicates",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Return (sorted) every value that appears more than once in the array.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return array of duplicates\n}",
    "testCases": [
      {
        "args": [
          [
            4,
            3,
            2,
            7,
            8,
            2,
            3,
            1
          ]
        ],
        "expected": [
          2,
          3
        ]
      },
      {
        "args": [
          [
            1,
            1,
            2
          ]
        ],
        "expected": [
          1
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p12",
    "title": "Rotate Array",
    "difficulty": "Medium",
    "tags": [
      "Array"
    ],
    "statement": "Rotate the array to the right by k steps and return it.",
    "params": [
      "nums",
      "k"
    ],
    "starter": "function solve(nums, k) {\n  // return rotated array\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            5,
            6,
            7
          ],
          3
        ],
        "expected": [
          5,
          6,
          7,
          1,
          2,
          3,
          4
        ]
      },
      {
        "args": [
          [
            -1,
            -100,
            3,
            99
          ],
          2
        ],
        "expected": [
          3,
          99,
          -1,
          -100
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p13",
    "title": "Two Sum II (Sorted Input)",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Given a sorted array, return 1-indexed indices of the two numbers that add up to target.",
    "params": [
      "nums",
      "target"
    ],
    "starter": "function solve(nums, target) {\n  // return [i, j] 1-indexed\n}",
    "testCases": [
      {
        "args": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            2,
            3,
            4
          ],
          6
        ],
        "expected": [
          1,
          3
        ]
      },
      {
        "args": [
          [
            -1,
            0
          ],
          -1
        ],
        "expected": [
          1,
          2
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p14",
    "title": "Squares of a Sorted Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Given a sorted array (may include negatives), return the squares of each number, sorted ascending.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return sorted squares\n}",
    "testCases": [
      {
        "args": [
          [
            -4,
            -1,
            0,
            3,
            10
          ]
        ],
        "expected": [
          0,
          1,
          9,
          16,
          100
        ]
      },
      {
        "args": [
          [
            -7,
            -3,
            2,
            3,
            11
          ]
        ],
        "expected": [
          4,
          9,
          9,
          49,
          121
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p15",
    "title": "Remove Duplicates from Sorted Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Remove duplicates in-place from a sorted array and return the remaining unique values in order.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return array of unique values, in order\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            2
          ]
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            3,
            3,
            4
          ]
        ],
        "expected": [
          0,
          1,
          2,
          3,
          4
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p16",
    "title": "Valid Anagram",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "statement": "Return true if string t is an anagram of string s.",
    "params": [
      "s",
      "t"
    ],
    "starter": "function solve(s, t) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "args": [
          "rat",
          "car"
        ],
        "expected": false
      },
      {
        "args": [
          "listen",
          "silent"
        ],
        "expected": true
      }
    ],
    "unordered": false
  },
  {
    "id": "p17",
    "title": "Valid Palindrome",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Two Pointers"
    ],
    "statement": "Return true if the string is a palindrome, considering only alphanumeric characters and ignoring case.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "A man, a plan, a canal: Panama"
        ],
        "expected": true
      },
      {
        "args": [
          "race a car"
        ],
        "expected": false
      },
      {
        "args": [
          " "
        ],
        "expected": true
      }
    ],
    "unordered": false
  },
  {
    "id": "p18",
    "title": "Reverse String",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Two Pointers"
    ],
    "statement": "Return the characters of the string reversed.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return reversed string\n}",
    "testCases": [
      {
        "args": [
          "hello"
        ],
        "expected": "olleh"
      },
      {
        "args": [
          "Hannah"
        ],
        "expected": "hannaH"
      }
    ],
    "unordered": false
  },
  {
    "id": "p19",
    "title": "Longest Common Prefix",
    "difficulty": "Easy",
    "tags": [
      "String"
    ],
    "statement": "Return the longest common prefix shared by all strings in the array, or \"\" if none.",
    "params": [
      "strs"
    ],
    "starter": "function solve(strs) {\n  // return prefix string\n}",
    "testCases": [
      {
        "args": [
          [
            "flower",
            "flow",
            "flight"
          ]
        ],
        "expected": "fl"
      },
      {
        "args": [
          [
            "dog",
            "racecar",
            "car"
          ]
        ],
        "expected": ""
      }
    ],
    "unordered": false
  },
  {
    "id": "p20",
    "title": "Valid Parentheses",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Stack"
    ],
    "statement": "Given a string of just ()[]{}, return true if the brackets are properly matched and closed.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "()"
        ],
        "expected": true
      },
      {
        "args": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "args": [
          "(]"
        ],
        "expected": false
      },
      {
        "args": [
          "([)]"
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p21",
    "title": "Group Anagrams",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Hash Map"
    ],
    "statement": "Group strings that are anagrams of each other. Return the groups (order of groups/items does not matter).",
    "params": [
      "strs"
    ],
    "starter": "function solve(strs) {\n  // return array of groups\n}",
    "testCases": [
      {
        "args": [
          [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ]
        ],
        "expected": [
          [
            "eat",
            "tea",
            "ate"
          ],
          [
            "tan",
            "nat"
          ],
          [
            "bat"
          ]
        ]
      }
    ],
    "unordered": true
  },
  {
    "id": "p22",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Sliding Window"
    ],
    "statement": "Return the length of the longest substring without repeating characters.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return length\n}",
    "testCases": [
      {
        "args": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "args": [
          "bbbbb"
        ],
        "expected": 1
      },
      {
        "args": [
          "pwwkew"
        ],
        "expected": 3
      }
    ],
    "unordered": false
  },
  {
    "id": "p23",
    "title": "Roman to Integer",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Math"
    ],
    "statement": "Convert a Roman numeral string to an integer.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return integer\n}",
    "testCases": [
      {
        "args": [
          "III"
        ],
        "expected": 3
      },
      {
        "args": [
          "LVIII"
        ],
        "expected": 58
      },
      {
        "args": [
          "MCMXCIV"
        ],
        "expected": 1994
      }
    ],
    "unordered": false
  },
  {
    "id": "p24",
    "title": "Reverse Words in a String",
    "difficulty": "Medium",
    "tags": [
      "String"
    ],
    "statement": "Reverse the order of words in a string, collapsing extra whitespace.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return string with word order reversed\n}",
    "testCases": [
      {
        "args": [
          "the sky is blue"
        ],
        "expected": "blue is sky the"
      },
      {
        "args": [
          "  hello world  "
        ],
        "expected": "world hello"
      },
      {
        "args": [
          "a good   example"
        ],
        "expected": "example good a"
      }
    ],
    "unordered": false
  },
  {
    "id": "p25",
    "title": "Isomorphic Strings",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "statement": "Return true if the characters in s can be consistently mapped one-to-one to the characters in t.",
    "params": [
      "s",
      "t"
    ],
    "starter": "function solve(s, t) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "egg",
          "add"
        ],
        "expected": true
      },
      {
        "args": [
          "foo",
          "bar"
        ],
        "expected": false
      },
      {
        "args": [
          "paper",
          "title"
        ],
        "expected": true
      }
    ],
    "unordered": false
  },
  {
    "id": "p26",
    "title": "Word Pattern",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "statement": "Return true if the words in s follow the same pattern given by string pattern (one letter per word, one-to-one).",
    "params": [
      "pattern",
      "s"
    ],
    "starter": "function solve(pattern, s) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "abba",
          "dog cat cat dog"
        ],
        "expected": true
      },
      {
        "args": [
          "abba",
          "dog cat cat fish"
        ],
        "expected": false
      },
      {
        "args": [
          "aaaa",
          "dog cat cat dog"
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p27",
    "title": "First Unique Character",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "statement": "Return the index of the first character in the string that does not repeat, or -1 if none.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return index\n}",
    "testCases": [
      {
        "args": [
          "leetcode"
        ],
        "expected": 0
      },
      {
        "args": [
          "loveleetcode"
        ],
        "expected": 2
      },
      {
        "args": [
          "aabb"
        ],
        "expected": -1
      }
    ],
    "unordered": false
  },
  {
    "id": "p28",
    "title": "Container With Most Water",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Given heights of vertical lines, return the maximum area of water two lines can contain.",
    "params": [
      "height"
    ],
    "starter": "function solve(height) {\n  // return max area\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "args": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      }
    ],
    "unordered": false
  },
  {
    "id": "p29",
    "title": "3Sum",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Return all unique triplets in the array that sum to zero.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return array of triplets\n}",
    "testCases": [
      {
        "args": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      },
      {
        "args": [
          [
            0,
            1,
            1
          ]
        ],
        "expected": []
      },
      {
        "args": [
          [
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      }
    ],
    "unordered": true
  },
  {
    "id": "p30",
    "title": "Minimum Size Subarray Sum",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Sliding Window"
    ],
    "statement": "Return the length of the shortest contiguous subarray with sum >= target, or 0 if none exists.",
    "params": [
      "target",
      "nums"
    ],
    "starter": "function solve(target, nums) {\n  // return length\n}",
    "testCases": [
      {
        "args": [
          7,
          [
            2,
            3,
            1,
            2,
            4,
            3
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          4,
          [
            1,
            4,
            4
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          11,
          [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ]
        ],
        "expected": 0
      }
    ],
    "unordered": false
  },
  {
    "id": "p31",
    "title": "Longest Palindromic Substring",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Two Pointers"
    ],
    "statement": "Return the longest palindromic substring in s.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return longest palindromic substring\n}",
    "testCases": [
      {
        "args": [
          "babad"
        ],
        "expected": "ba"
      },
      {
        "args": [
          "cbbd"
        ],
        "expected": "b"
      },
      {
        "args": [
          "a"
        ],
        "expected": "a"
      }
    ],
    "unordered": false
  },
  {
    "id": "p32",
    "title": "Find the Duplicate Number",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Given n+1 integers where each is between 1 and n, find the one duplicate number (no modifying the array).",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return the duplicate\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            3,
            4,
            2,
            2
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            3,
            1,
            3,
            4,
            2
          ]
        ],
        "expected": 3
      }
    ],
    "unordered": false
  },
  {
    "id": "p33",
    "title": "Backspace String Compare",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Stack"
    ],
    "statement": "Given two strings containing letters and \"#\" (backspace), return true if they are equal after processing backspaces.",
    "params": [
      "s",
      "t"
    ],
    "starter": "function solve(s, t) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "ab#c",
          "ad#c"
        ],
        "expected": true
      },
      {
        "args": [
          "ab##",
          "c#d#"
        ],
        "expected": true
      },
      {
        "args": [
          "a#c",
          "b"
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p34",
    "title": "Evaluate Reverse Polish Notation",
    "difficulty": "Medium",
    "tags": [
      "Stack"
    ],
    "statement": "Evaluate an arithmetic expression given in Reverse Polish Notation (tokens array), return the integer result.",
    "params": [
      "tokens"
    ],
    "starter": "function solve(tokens) {\n  // return evaluated integer\n}",
    "testCases": [
      {
        "args": [
          [
            "2",
            "1",
            "+",
            "3",
            "*"
          ]
        ],
        "expected": 9
      },
      {
        "args": [
          [
            "4",
            "13",
            "5",
            "/",
            "+"
          ]
        ],
        "expected": 6
      }
    ],
    "unordered": false
  },
  {
    "id": "p35",
    "title": "Daily Temperatures",
    "difficulty": "Medium",
    "tags": [
      "Stack"
    ],
    "statement": "For each day, return how many days until a warmer temperature; 0 if none.",
    "params": [
      "temps"
    ],
    "starter": "function solve(temps) {\n  // return array of wait-days\n}",
    "testCases": [
      {
        "args": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "args": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p36",
    "title": "Next Greater Element",
    "difficulty": "Easy",
    "tags": [
      "Stack"
    ],
    "statement": "For nums1 (a subset of nums2), return the next greater element to the right in nums2 for each; -1 if none.",
    "params": [
      "nums1",
      "nums2"
    ],
    "starter": "function solve(nums1, nums2) {\n  // return array matching nums1\n}",
    "testCases": [
      {
        "args": [
          [
            4,
            1,
            2
          ],
          [
            1,
            3,
            4,
            2
          ]
        ],
        "expected": [
          -1,
          3,
          -1
        ]
      },
      {
        "args": [
          [
            2,
            4
          ],
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          3,
          -1
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p37",
    "title": "Simplify Path",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Stack"
    ],
    "statement": "Simplify a Unix-style absolute file path (handle \"..\", \".\", and duplicate slashes).",
    "params": [
      "path"
    ],
    "starter": "function solve(path) {\n  // return simplified path\n}",
    "testCases": [
      {
        "args": [
          "/home/"
        ],
        "expected": "/home"
      },
      {
        "args": [
          "/../"
        ],
        "expected": "/"
      },
      {
        "args": [
          "/home//foo/"
        ],
        "expected": "/home/foo"
      }
    ],
    "unordered": false
  },
  {
    "id": "p38",
    "title": "Implement Queue Using Two Stacks (Simulate)",
    "difficulty": "Easy",
    "tags": [
      "Stack",
      "Queue"
    ],
    "statement": "Given a sequence of enqueue operations (numbers) and a number of dequeue operations, return the values dequeued in order (FIFO).",
    "params": [
      "pushes",
      "popCount"
    ],
    "starter": "function solve(pushes, popCount) {\n  // return array of dequeued values\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            5,
            6,
            7
          ],
          3
        ],
        "expected": [
          5,
          6,
          7
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p39",
    "title": "Binary Search",
    "difficulty": "Easy",
    "tags": [
      "Binary Search"
    ],
    "statement": "Given a sorted array and a target, return its index, or -1 if not present.",
    "params": [
      "nums",
      "target"
    ],
    "starter": "function solve(nums, target) {\n  // return index or -1\n}",
    "testCases": [
      {
        "args": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "expected": 4
      },
      {
        "args": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "expected": -1
      }
    ],
    "unordered": false
  },
  {
    "id": "p40",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "Medium",
    "tags": [
      "Binary Search"
    ],
    "statement": "Given a rotated sorted array of unique numbers, return the index of target, or -1.",
    "params": [
      "nums",
      "target"
    ],
    "starter": "function solve(nums, target) {\n  // return index or -1\n}",
    "testCases": [
      {
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "args": [
          [
            1
          ],
          0
        ],
        "expected": -1
      }
    ],
    "unordered": false
  },
  {
    "id": "p41",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "Medium",
    "tags": [
      "Binary Search"
    ],
    "statement": "Return the minimum element in a rotated sorted array of unique numbers.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return minimum value\n}",
    "testCases": [
      {
        "args": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ],
    "unordered": false
  },
  {
    "id": "p42",
    "title": "Sqrt(x)",
    "difficulty": "Easy",
    "tags": [
      "Binary Search",
      "Math"
    ],
    "statement": "Return the integer square root of a non-negative integer x (floor of the real square root).",
    "params": [
      "x"
    ],
    "starter": "function solve(x) {\n  // return integer sqrt\n}",
    "testCases": [
      {
        "args": [
          4
        ],
        "expected": 2
      },
      {
        "args": [
          8
        ],
        "expected": 2
      },
      {
        "args": [
          0
        ],
        "expected": 0
      }
    ],
    "unordered": false
  },
  {
    "id": "p43",
    "title": "Search Insert Position",
    "difficulty": "Easy",
    "tags": [
      "Binary Search"
    ],
    "statement": "Given a sorted array and target, return the index if found, or the index where it would be inserted in order.",
    "params": [
      "nums",
      "target"
    ],
    "starter": "function solve(nums, target) {\n  // return index\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          5
        ],
        "expected": 2
      },
      {
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          2
        ],
        "expected": 1
      },
      {
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          7
        ],
        "expected": 4
      }
    ],
    "unordered": false
  },
  {
    "id": "p44",
    "title": "Peak Index in Mountain Array",
    "difficulty": "Medium",
    "tags": [
      "Binary Search"
    ],
    "statement": "Given a mountain array (strictly increasing then strictly decreasing), return the index of the peak.",
    "params": [
      "arr"
    ],
    "starter": "function solve(arr) {\n  // return peak index\n}",
    "testCases": [
      {
        "args": [
          [
            0,
            1,
            0
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            0,
            2,
            1,
            0
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            0,
            10,
            5,
            2
          ]
        ],
        "expected": 1
      }
    ],
    "unordered": false
  },
  {
    "id": "p45",
    "title": "Search a 2D Matrix",
    "difficulty": "Medium",
    "tags": [
      "Binary Search",
      "Matrix"
    ],
    "statement": "Each row of the matrix is sorted, and the first integer of each row is greater than the last of the previous row. Return true if target exists.",
    "params": [
      "matrix",
      "target"
    ],
    "starter": "function solve(matrix, target) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p46",
    "title": "Jump Game",
    "difficulty": "Medium",
    "tags": [
      "Greedy",
      "Array"
    ],
    "statement": "Each element is the max jump length from that position. Return true if you can reach the last index starting at index 0.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            1,
            1,
            4
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            3,
            2,
            1,
            0,
            4
          ]
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p47",
    "title": "Gas Station",
    "difficulty": "Medium",
    "tags": [
      "Greedy"
    ],
    "statement": "Given gas[i] and cost[i] to travel from station i to i+1 around a circle, return the starting index to complete the circuit, or -1 if impossible.",
    "params": [
      "gas",
      "cost"
    ],
    "starter": "function solve(gas, cost) {\n  // return starting index or -1\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            2,
            3,
            4
          ],
          [
            3,
            4,
            3
          ]
        ],
        "expected": -1
      }
    ],
    "unordered": false
  },
  {
    "id": "p48",
    "title": "Assign Cookies",
    "difficulty": "Easy",
    "tags": [
      "Greedy"
    ],
    "statement": "Given greed factors of children and cookie sizes, return the maximum number of children that can be satisfied (a cookie satisfies a child if its size >= greed).",
    "params": [
      "greed",
      "cookies"
    ],
    "starter": "function solve(greed, cookies) {\n  // return count satisfied\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3
          ],
          [
            1,
            1
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            1,
            2
          ],
          [
            1,
            2,
            3
          ]
        ],
        "expected": 2
      }
    ],
    "unordered": false
  },
  {
    "id": "p49",
    "title": "Merge Intervals",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "Intervals"
    ],
    "statement": "Merge all overlapping intervals and return the resulting non-overlapping intervals sorted by start.",
    "params": [
      "intervals"
    ],
    "starter": "function solve(intervals) {\n  // return merged intervals\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              3
            ],
            [
              2,
              6
            ],
            [
              8,
              10
            ],
            [
              15,
              18
            ]
          ]
        ],
        "expected": [
          [
            1,
            6
          ],
          [
            8,
            10
          ],
          [
            15,
            18
          ]
        ]
      },
      {
        "args": [
          [
            [
              1,
              4
            ],
            [
              4,
              5
            ]
          ]
        ],
        "expected": [
          [
            1,
            5
          ]
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p50",
    "title": "Insert Interval",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Intervals"
    ],
    "statement": "Insert a new interval into a sorted, non-overlapping list of intervals, merging as needed.",
    "params": [
      "intervals",
      "newInterval"
    ],
    "starter": "function solve(intervals, newInterval) {\n  // return updated intervals\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              3
            ],
            [
              6,
              9
            ]
          ],
          [
            2,
            5
          ]
        ],
        "expected": [
          [
            1,
            5
          ],
          [
            6,
            9
          ]
        ]
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              5
            ],
            [
              6,
              7
            ],
            [
              8,
              10
            ],
            [
              12,
              16
            ]
          ],
          [
            4,
            8
          ]
        ],
        "expected": [
          [
            1,
            2
          ],
          [
            3,
            10
          ],
          [
            12,
            16
          ]
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p51",
    "title": "Non-overlapping Intervals",
    "difficulty": "Medium",
    "tags": [
      "Greedy",
      "Intervals"
    ],
    "statement": "Return the minimum number of intervals to remove to make the rest non-overlapping.",
    "params": [
      "intervals"
    ],
    "starter": "function solve(intervals) {\n  // return count to remove\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              1,
              2
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      }
    ],
    "unordered": false
  },
  {
    "id": "p52",
    "title": "Climbing Stairs",
    "difficulty": "Easy",
    "tags": [
      "DP"
    ],
    "statement": "You can climb 1 or 2 steps at a time. Return the number of distinct ways to reach the top of n stairs.",
    "params": [
      "n"
    ],
    "starter": "function solve(n) {\n  // return number of ways\n}",
    "testCases": [
      {
        "args": [
          2
        ],
        "expected": 2
      },
      {
        "args": [
          3
        ],
        "expected": 3
      },
      {
        "args": [
          5
        ],
        "expected": 8
      }
    ],
    "unordered": false
  },
  {
    "id": "p53",
    "title": "House Robber",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "statement": "Given money in houses in a row, return the max sum obtainable without robbing two adjacent houses.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return max sum\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            2,
            7,
            9,
            3,
            1
          ]
        ],
        "expected": 12
      }
    ],
    "unordered": false
  },
  {
    "id": "p54",
    "title": "Coin Change",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "statement": "Given coin denominations and an amount, return the fewest coins needed to make that amount, or -1 if impossible.",
    "params": [
      "coins",
      "amount"
    ],
    "starter": "function solve(coins, amount) {\n  // return min coins or -1\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "args": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "args": [
          [
            1
          ],
          0
        ],
        "expected": 0
      }
    ],
    "unordered": false
  },
  {
    "id": "p55",
    "title": "Longest Increasing Subsequence",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "Binary Search"
    ],
    "statement": "Return the length of the longest strictly increasing subsequence.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return length\n}",
    "testCases": [
      {
        "args": [
          [
            10,
            9,
            2,
            5,
            3,
            7,
            101,
            18
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            0,
            1,
            0,
            3,
            2,
            3
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            7,
            7,
            7,
            7
          ]
        ],
        "expected": 1
      }
    ],
    "unordered": false
  },
  {
    "id": "p56",
    "title": "Word Break",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "String"
    ],
    "statement": "Given a string and a dictionary of words, return true if the string can be segmented into a space-separated sequence of dictionary words.",
    "params": [
      "s",
      "wordDict"
    ],
    "starter": "function solve(s, wordDict) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "leetcode",
          [
            "leet",
            "code"
          ]
        ],
        "expected": true
      },
      {
        "args": [
          "applepenapple",
          [
            "apple",
            "pen"
          ]
        ],
        "expected": true
      },
      {
        "args": [
          "catsandog",
          [
            "cats",
            "dog",
            "sand",
            "and",
            "cat"
          ]
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p57",
    "title": "Unique Paths",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "Matrix"
    ],
    "statement": "A robot starts top-left of an m x n grid and can only move right or down. Return the number of unique paths to the bottom-right.",
    "params": [
      "m",
      "n"
    ],
    "starter": "function solve(m, n) {\n  // return number of unique paths\n}",
    "testCases": [
      {
        "args": [
          3,
          7
        ],
        "expected": 28
      },
      {
        "args": [
          3,
          2
        ],
        "expected": 3
      }
    ],
    "unordered": false
  },
  {
    "id": "p58",
    "title": "Maximum Product Subarray",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "Array"
    ],
    "statement": "Return the largest product of any contiguous subarray.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return max product\n}",
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            -2,
            4
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            -2,
            0,
            -1
          ]
        ],
        "expected": 0
      }
    ],
    "unordered": false
  },
  {
    "id": "p59",
    "title": "Decode Ways",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "String"
    ],
    "statement": "A string of digits can be decoded as letters (A=1..Z=26). Return the number of ways to decode it.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return number of decodings\n}",
    "testCases": [
      {
        "args": [
          "12"
        ],
        "expected": 2
      },
      {
        "args": [
          "226"
        ],
        "expected": 3
      },
      {
        "args": [
          "06"
        ],
        "expected": 0
      }
    ],
    "unordered": false
  },
  {
    "id": "p60",
    "title": "Perfect Squares",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "Math"
    ],
    "statement": "Return the fewest number of perfect square numbers (1,4,9,...) that sum to n.",
    "params": [
      "n"
    ],
    "starter": "function solve(n) {\n  // return fewest count\n}",
    "testCases": [
      {
        "args": [
          12
        ],
        "expected": 3
      },
      {
        "args": [
          13
        ],
        "expected": 2
      }
    ],
    "unordered": false
  },
  {
    "id": "p61",
    "title": "Longest Common Subsequence",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "String"
    ],
    "statement": "Return the length of the longest common subsequence between two strings.",
    "params": [
      "a",
      "b"
    ],
    "starter": "function solve(a, b) {\n  // return length\n}",
    "testCases": [
      {
        "args": [
          "abcde",
          "ace"
        ],
        "expected": 3
      },
      {
        "args": [
          "abc",
          "abc"
        ],
        "expected": 3
      },
      {
        "args": [
          "abc",
          "def"
        ],
        "expected": 0
      }
    ],
    "unordered": false
  },
  {
    "id": "p62",
    "title": "Edit Distance",
    "difficulty": "Hard",
    "tags": [
      "DP",
      "String"
    ],
    "statement": "Return the minimum number of insert/delete/replace operations to convert word1 into word2.",
    "params": [
      "word1",
      "word2"
    ],
    "starter": "function solve(word1, word2) {\n  // return min operations\n}",
    "testCases": [
      {
        "args": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "args": [
          "intention",
          "execution"
        ],
        "expected": 5
      }
    ],
    "unordered": false
  },
  {
    "id": "p63",
    "title": "Counting Bits",
    "difficulty": "Easy",
    "tags": [
      "Bit Manipulation",
      "DP"
    ],
    "statement": "For every number from 0 to n, return the count of 1 bits in its binary representation.",
    "params": [
      "n"
    ],
    "starter": "function solve(n) {\n  // return array of bit counts\n}",
    "testCases": [
      {
        "args": [
          2
        ],
        "expected": [
          0,
          1,
          1
        ]
      },
      {
        "args": [
          5
        ],
        "expected": [
          0,
          1,
          1,
          2,
          1,
          2
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p64",
    "title": "Reverse Integer",
    "difficulty": "Medium",
    "tags": [
      "Math"
    ],
    "statement": "Reverse the digits of a 32-bit signed integer. Return 0 if it overflows the 32-bit signed range.",
    "params": [
      "x"
    ],
    "starter": "function solve(x) {\n  // return reversed integer\n}",
    "testCases": [
      {
        "args": [
          123
        ],
        "expected": 321
      },
      {
        "args": [
          -123
        ],
        "expected": -321
      },
      {
        "args": [
          120
        ],
        "expected": 21
      }
    ],
    "unordered": false
  },
  {
    "id": "p65",
    "title": "Power of Two",
    "difficulty": "Easy",
    "tags": [
      "Bit Manipulation",
      "Math"
    ],
    "statement": "Return true if n is a power of two.",
    "params": [
      "n"
    ],
    "starter": "function solve(n) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          1
        ],
        "expected": true
      },
      {
        "args": [
          16
        ],
        "expected": true
      },
      {
        "args": [
          3
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p66",
    "title": "Add Binary",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "Bit Manipulation"
    ],
    "statement": "Given two binary strings, return their sum as a binary string.",
    "params": [
      "a",
      "b"
    ],
    "starter": "function solve(a, b) {\n  // return binary sum string\n}",
    "testCases": [
      {
        "args": [
          "11",
          "1"
        ],
        "expected": "100"
      },
      {
        "args": [
          "1010",
          "1011"
        ],
        "expected": "10101"
      }
    ],
    "unordered": false
  },
  {
    "id": "p67",
    "title": "Hamming Distance",
    "difficulty": "Easy",
    "tags": [
      "Bit Manipulation"
    ],
    "statement": "Return the number of differing bits between the binary representations of two integers.",
    "params": [
      "x",
      "y"
    ],
    "starter": "function solve(x, y) {\n  // return hamming distance\n}",
    "testCases": [
      {
        "args": [
          1,
          4
        ],
        "expected": 2
      },
      {
        "args": [
          3,
          1
        ],
        "expected": 1
      }
    ],
    "unordered": false
  },
  {
    "id": "p68",
    "title": "Happy Number",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "Hash Map"
    ],
    "statement": "Repeatedly replace a number with the sum of the squares of its digits. Return true if this reaches 1.",
    "params": [
      "n"
    ],
    "starter": "function solve(n) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          19
        ],
        "expected": true
      },
      {
        "args": [
          2
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p69",
    "title": "Fizz Buzz",
    "difficulty": "Easy",
    "tags": [
      "Math"
    ],
    "statement": "Return an array of strings from 1 to n: \"FizzBuzz\" for multiples of 15, \"Fizz\" for 3, \"Buzz\" for 5, else the number as a string.",
    "params": [
      "n"
    ],
    "starter": "function solve(n) {\n  // return array of strings\n}",
    "testCases": [
      {
        "args": [
          5
        ],
        "expected": [
          "1",
          "2",
          "Fizz",
          "4",
          "Buzz"
        ]
      },
      {
        "args": [
          15
        ],
        "expected": [
          "1",
          "2",
          "Fizz",
          "4",
          "Buzz",
          "Fizz",
          "7",
          "8",
          "Fizz",
          "Buzz",
          "11",
          "Fizz",
          "13",
          "14",
          "FizzBuzz"
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p70",
    "title": "Pow(x, n)",
    "difficulty": "Medium",
    "tags": [
      "Math"
    ],
    "statement": "Implement pow(x, n) — x raised to the integer power n — without using the built-in power operator.",
    "params": [
      "x",
      "n"
    ],
    "starter": "function solve(x, n) {\n  // return x^n\n}",
    "testCases": [
      {
        "args": [
          2,
          10
        ],
        "expected": 1024
      },
      {
        "args": [
          2.1,
          3
        ],
        "expected": 9.261000000000001
      }
    ],
    "unordered": false
  },
  {
    "id": "p71",
    "title": "Excel Sheet Column Number",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "String"
    ],
    "statement": "Convert an Excel column title (like \"AB\") into its corresponding column number.",
    "params": [
      "s"
    ],
    "starter": "function solve(s) {\n  // return column number\n}",
    "testCases": [
      {
        "args": [
          "A"
        ],
        "expected": 1
      },
      {
        "args": [
          "AB"
        ],
        "expected": 28
      },
      {
        "args": [
          "ZY"
        ],
        "expected": 701
      }
    ],
    "unordered": false
  },
  {
    "id": "p72",
    "title": "Rotate Image",
    "difficulty": "Medium",
    "tags": [
      "Matrix"
    ],
    "statement": "Rotate an n x n matrix 90 degrees clockwise and return it.",
    "params": [
      "matrix"
    ],
    "starter": "function solve(matrix) {\n  // return rotated matrix\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          [
            7,
            4,
            1
          ],
          [
            8,
            5,
            2
          ],
          [
            9,
            6,
            3
          ]
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p73",
    "title": "Spiral Matrix",
    "difficulty": "Medium",
    "tags": [
      "Matrix"
    ],
    "statement": "Return all elements of the matrix in spiral order.",
    "params": [
      "matrix"
    ],
    "starter": "function solve(matrix) {\n  // return array in spiral order\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          6,
          9,
          8,
          7,
          4,
          5
        ]
      },
      {
        "args": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          8,
          12,
          11,
          10,
          9,
          5,
          6,
          7
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p74",
    "title": "Set Matrix Zeroes",
    "difficulty": "Medium",
    "tags": [
      "Matrix"
    ],
    "statement": "If an element in the matrix is 0, set its entire row and column to 0. Return the matrix.",
    "params": [
      "matrix"
    ],
    "starter": "function solve(matrix) {\n  // return updated matrix\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              0,
              1
            ],
            [
              1,
              1,
              1
            ]
          ]
        ],
        "expected": [
          [
            1,
            0,
            1
          ],
          [
            0,
            0,
            0
          ],
          [
            1,
            0,
            1
          ]
        ]
      },
      {
        "args": [
          [
            [
              0,
              1,
              2,
              0
            ],
            [
              3,
              4,
              5,
              2
            ],
            [
              1,
              3,
              1,
              5
            ]
          ]
        ],
        "expected": [
          [
            0,
            0,
            0,
            0
          ],
          [
            0,
            4,
            5,
            0
          ],
          [
            0,
            3,
            1,
            0
          ]
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p75",
    "title": "Valid Sudoku (Partial Check)",
    "difficulty": "Medium",
    "tags": [
      "Matrix",
      "Hash Map"
    ],
    "statement": "Given a 9x9 board (0 for empty), return true if the filled cells so far do not violate row, column, or 3x3 box rules.",
    "params": [
      "board"
    ],
    "starter": "function solve(board) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          [
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          ]
        ],
        "expected": true
      }
    ],
    "unordered": false
  },
  {
    "id": "p76",
    "title": "Flood Fill",
    "difficulty": "Easy",
    "tags": [
      "Matrix"
    ],
    "statement": "Given an image grid, a starting pixel, and a new color, flood-fill connected same-colored pixels with the new color.",
    "params": [
      "image",
      "sr",
      "sc",
      "color"
    ],
    "starter": "function solve(image, sr, sc, color) {\n  // return updated image\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              1,
              0,
              1
            ]
          ],
          1,
          1,
          2
        ],
        "expected": [
          [
            2,
            2,
            2
          ],
          [
            2,
            2,
            0
          ],
          [
            2,
            0,
            1
          ]
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p77",
    "title": "Number of Islands",
    "difficulty": "Medium",
    "tags": [
      "Matrix",
      "Graph"
    ],
    "statement": "Given a grid of '1' (land) and '0' (water), return the number of islands (connected land regions, 4-directionally).",
    "params": [
      "grid"
    ],
    "starter": "function solve(grid) {\n  // return number of islands\n}",
    "testCases": [
      {
        "args": [
          [
            [
              "1",
              "1",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1"
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "unordered": false
  },
  {
    "id": "p78",
    "title": "Course Schedule",
    "difficulty": "Medium",
    "tags": [
      "Graph"
    ],
    "statement": "Given numCourses and prerequisite pairs [a, b] (must take b before a), return true if all courses can be finished (no cycle).",
    "params": [
      "numCourses",
      "prerequisites"
    ],
    "starter": "function solve(numCourses, prerequisites) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p79",
    "title": "Find the Town Judge",
    "difficulty": "Easy",
    "tags": [
      "Graph"
    ],
    "statement": "In a town of n people, given trust pairs [a, b] meaning a trusts b, find the judge — someone trusted by everyone else who trusts nobody. Return -1 if none.",
    "params": [
      "n",
      "trust"
    ],
    "starter": "function solve(n, trust) {\n  // return judge id or -1\n}",
    "testCases": [
      {
        "args": [
          2,
          [
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          3,
          [
            [
              1,
              3
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          3,
          [
            [
              1,
              3
            ],
            [
              2,
              3
            ],
            [
              3,
              1
            ]
          ]
        ],
        "expected": -1
      }
    ],
    "unordered": false
  },
  {
    "id": "p80",
    "title": "Number of Provinces",
    "difficulty": "Medium",
    "tags": [
      "Graph"
    ],
    "statement": "Given an n x n adjacency matrix of cities (1 = connected), return the number of provinces (connected groups).",
    "params": [
      "isConnected"
    ],
    "starter": "function solve(isConnected) {\n  // return number of provinces\n}",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              1,
              0
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              0,
              0
            ],
            [
              0,
              1,
              0
            ],
            [
              0,
              0,
              1
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "unordered": false
  },
  {
    "id": "p81",
    "title": "Plus One",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Math"
    ],
    "statement": "Given a large integer represented as an array of digits, add one to it and return the resulting digit array.",
    "params": [
      "digits"
    ],
    "starter": "function solve(digits) {\n  // return updated digits\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          1,
          2,
          4
        ]
      },
      {
        "args": [
          [
            4,
            3,
            2,
            1
          ]
        ],
        "expected": [
          4,
          3,
          2,
          2
        ]
      },
      {
        "args": [
          [
            9,
            9
          ]
        ],
        "expected": [
          1,
          0,
          0
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p82",
    "title": "Pascal's Triangle",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "DP"
    ],
    "statement": "Return the first numRows rows of Pascal's Triangle.",
    "params": [
      "numRows"
    ],
    "starter": "function solve(numRows) {\n  // return array of rows\n}",
    "testCases": [
      {
        "args": [
          5
        ],
        "expected": [
          [
            1
          ],
          [
            1,
            1
          ],
          [
            1,
            2,
            1
          ],
          [
            1,
            3,
            3,
            1
          ],
          [
            1,
            4,
            6,
            4,
            1
          ]
        ]
      },
      {
        "args": [
          1
        ],
        "expected": [
          [
            1
          ]
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p83",
    "title": "Intersection of Two Arrays",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Return the unique elements present in both arrays.",
    "params": [
      "a",
      "b"
    ],
    "starter": "function solve(a, b) {\n  // return array of common unique elements\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            2,
            1
          ],
          [
            2,
            2
          ]
        ],
        "expected": [
          2
        ]
      },
      {
        "args": [
          [
            4,
            9,
            5
          ],
          [
            9,
            4,
            9,
            8,
            4
          ]
        ],
        "expected": [
          4,
          9
        ]
      }
    ],
    "unordered": true
  },
  {
    "id": "p84",
    "title": "K-th Largest Element",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Sorting"
    ],
    "statement": "Return the k-th largest element in an unsorted array (1st largest = maximum).",
    "params": [
      "nums",
      "k"
    ],
    "starter": "function solve(nums, k) {\n  // return kth largest\n}",
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            1,
            5,
            6,
            4
          ],
          2
        ],
        "expected": 5
      },
      {
        "args": [
          [
            3,
            2,
            3,
            1,
            2,
            4,
            5,
            5,
            6
          ],
          4
        ],
        "expected": 4
      }
    ],
    "unordered": false
  },
  {
    "id": "p85",
    "title": "Top K Frequent Elements",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Return the k most frequent elements in the array (any order among ties).",
    "params": [
      "nums",
      "k"
    ],
    "starter": "function solve(nums, k) {\n  // return array of top-k frequent elements\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ],
    "unordered": true
  },
  {
    "id": "p86",
    "title": "Sort Colors (Dutch Flag)",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "statement": "Given an array of only 0s, 1s, and 2s, sort it in-place and return it in one pass.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return sorted array\n}",
    "testCases": [
      {
        "args": [
          [
            2,
            0,
            2,
            1,
            1,
            0
          ]
        ],
        "expected": [
          0,
          0,
          1,
          1,
          2,
          2
        ]
      },
      {
        "args": [
          [
            2,
            0,
            1
          ]
        ],
        "expected": [
          0,
          1,
          2
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p87",
    "title": "Majority Element II",
    "difficulty": "Medium",
    "tags": [
      "Array"
    ],
    "statement": "Return all elements that appear more than n/3 times in the array (sorted ascending).",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return array of elements\n}",
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            3
          ]
        ],
        "expected": [
          3
        ]
      },
      {
        "args": [
          [
            1
          ]
        ],
        "expected": [
          1
        ]
      },
      {
        "args": [
          [
            1,
            2
          ]
        ],
        "expected": [
          1,
          2
        ]
      }
    ],
    "unordered": false
  },
  {
    "id": "p88",
    "title": "Rotate String Check",
    "difficulty": "Easy",
    "tags": [
      "String"
    ],
    "statement": "Return true if string B is a rotation of string A (same length, some rotation of A equals B).",
    "params": [
      "a",
      "b"
    ],
    "starter": "function solve(a, b) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          "abcde",
          "cdeab"
        ],
        "expected": true
      },
      {
        "args": [
          "abcde",
          "abced"
        ],
        "expected": false
      }
    ],
    "unordered": false
  },
  {
    "id": "p89",
    "title": "Longest Consecutive Sequence",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Return the length of the longest run of consecutive integers present in the array (order doesn't matter).",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return length\n}",
    "testCases": [
      {
        "args": [
          [
            100,
            4,
            200,
            1,
            3,
            2
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            0,
            3,
            7,
            2,
            5,
            8,
            4,
            6,
            0,
            1
          ]
        ],
        "expected": 9
      }
    ],
    "unordered": false
  },
  {
    "id": "p90",
    "title": "Subarray Sum Equals K",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Return the total number of contiguous subarrays whose sum equals k.",
    "params": [
      "nums",
      "k"
    ],
    "starter": "function solve(nums, k) {\n  // return count\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            1
          ],
          2
        ],
        "expected": 2
      },
      {
        "args": [
          [
            1,
            2,
            3
          ],
          3
        ],
        "expected": 2
      }
    ],
    "unordered": false
  },
  {
    "id": "p91",
    "title": "Meeting Rooms",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Intervals"
    ],
    "statement": "Given meeting time intervals, return true if a person could attend all of them (no overlaps).",
    "params": [
      "intervals"
    ],
    "starter": "function solve(intervals) {\n  // return boolean\n}",
    "testCases": [
      {
        "args": [
          [
            [
              0,
              30
            ],
            [
              5,
              10
            ],
            [
              15,
              20
            ]
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            [
              7,
              10
            ],
            [
              2,
              4
            ]
          ]
        ],
        "expected": true
      }
    ],
    "unordered": false
  },
  {
    "id": "p92",
    "title": "Meeting Rooms II",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Intervals",
      "Greedy"
    ],
    "statement": "Given meeting intervals, return the minimum number of meeting rooms required.",
    "params": [
      "intervals"
    ],
    "starter": "function solve(intervals) {\n  // return min rooms\n}",
    "testCases": [
      {
        "args": [
          [
            [
              0,
              30
            ],
            [
              5,
              10
            ],
            [
              15,
              20
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              7,
              10
            ],
            [
              2,
              4
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "unordered": false
  },
  {
    "id": "p93",
    "title": "Two Sum - All Pairs Count",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "Return the number of index pairs (i < j) where nums[i] + nums[j] equals target.",
    "params": [
      "nums",
      "target"
    ],
    "starter": "function solve(nums, target) {\n  // return count of pairs\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            2
          ],
          4
        ],
        "expected": 2
      },
      {
        "args": [
          [
            1,
            1,
            1
          ],
          2
        ],
        "expected": 3
      }
    ],
    "unordered": false
  },
  {
    "id": "p94",
    "title": "Max Consecutive Ones",
    "difficulty": "Easy",
    "tags": [
      "Array"
    ],
    "statement": "Return the maximum number of consecutive 1s in a binary array.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return max run of 1s\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            0,
            1,
            1,
            1
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            1,
            0,
            1,
            1,
            0,
            1
          ]
        ],
        "expected": 2
      }
    ],
    "unordered": false
  },
  {
    "id": "p95",
    "title": "Pivot Index",
    "difficulty": "Easy",
    "tags": [
      "Array"
    ],
    "statement": "Return the leftmost index where the sum of elements to the left equals the sum of elements to the right. -1 if none.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return pivot index\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            7,
            3,
            6,
            5,
            6
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": -1
      }
    ],
    "unordered": false
  },
  {
    "id": "p96",
    "title": "Kth Missing Positive Number",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "statement": "Given a strictly increasing array of positive integers, return the k-th positive integer that is missing from it.",
    "params": [
      "arr",
      "k"
    ],
    "starter": "function solve(arr, k) {\n  // return the kth missing number\n}",
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            4,
            7,
            11
          ],
          5
        ],
        "expected": 9
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ],
          2
        ],
        "expected": 6
      }
    ],
    "unordered": false
  },
  {
    "id": "p97",
    "title": "Degree of an Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "statement": "The degree of an array is the max frequency of any element. Return the length of the shortest contiguous subarray with the same degree.",
    "params": [
      "nums"
    ],
    "starter": "function solve(nums) {\n  // return length\n}",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            2,
            3,
            1
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            1,
            2,
            2,
            3,
            1,
            4,
            2
          ]
        ],
        "expected": 6
      }
    ],
    "unordered": false
  }
]

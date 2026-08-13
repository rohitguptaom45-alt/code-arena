import { problemApi } from './api.js'
export async function createProblemRemote(contestId, payload) {
  try {
    const res = await problemApi.create(contestId, payload)
    return {
      problem: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't create the problem.",
    }
  }
}
export async function updateProblemRemote(contestId, problemId, payload) {
  try {
    const res = await problemApi.update(contestId, problemId, payload)
    return {
      problem: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't update the problem.",
    }
  }
}
export async function addProblemLanguagesRemote(contestId, problemId, languageIds) {
  try {
    const res = await problemApi.addLanguages(contestId, problemId, languageIds)
    return {
      problem: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't add languages to the problem.",
    }
  }
}
export async function addProblemTestCasesRemote(contestId, problemId, testCases) {
  try {
    const res = await problemApi.addTestCases(contestId, problemId, testCases)
    return {
      testCases: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't add test cases.",
    }
  }
}
export async function addPreloadedCodeRemote(contestId, problemId, languageId, code) {
  try {
    const res = await problemApi.addPreloadedCode(contestId, problemId, languageId, code)
    return {
      preloadedCode: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't save starter code.",
    }
  }
}
export async function fetchProblemRemote(contestId, problemId) {
  try {
    const res = await problemApi.getSingle(contestId, problemId)
    return {
      problem: res?.data,
    }
  } catch (err) {
    return {
      problem: null,
      error: err.message,
    }
  }
}
export async function fetchContestProblemsRemote(contestId) {
  try {
    const res = await problemApi.getAll(contestId)
    return {
      problems: res?.data || [],
    }
  } catch (err) {
    return {
      problems: [],
      error: err.message,
    }
  }
}
export async function fetchProblemTestCasesRemote(contestId, problemId) {
  try {
    const res = await problemApi.getTestCases(contestId, problemId)
    return {
      testCases: res?.data || [],
    }
  } catch (err) {
    return {
      testCases: [],
      error: err.message,
    }
  }
}
export async function fetchProblemLanguagesRemote(contestId, problemId) {
  try {
    const res = await problemApi.getLanguages(contestId, problemId)
    return {
      languages: res?.data || [],
    }
  } catch (err) {
    return {
      languages: [],
      error: err.message,
    }
  }
}
export async function fetchPreloadedCodeRemote(contestId, problemId, languageId) {
  try {
    const res = await problemApi.getPreloadedCode(contestId, problemId, languageId)
    return {
      code: res?.data?.code || '',
    }
  } catch (err) {
    return {
      code: '',
      error: err.message,
    }
  }
}

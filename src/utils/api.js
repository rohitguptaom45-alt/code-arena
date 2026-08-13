const API_BASE = 'http://localhost:8000/api/v1'
const ACCESS_TOKEN_KEY = 'codearena_access_token'
const REFRESH_TOKEN_KEY = 'codearena_refresh_token'
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}
export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
async function request(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  }
  const token = getAccessToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new Error(`Can't reach the CodeArena backend at ${API_BASE} — is it running? (${err.message})`)
  }
  if (res.status === 401 && auth && retry) {
    try {
      const refreshed = await api.refreshToken()
      if (refreshed?.data?.accessToken) {
        setTokens({
          accessToken: refreshed.data.accessToken,
          refreshToken: refreshed.data.refreshToken,
        })
        return request(path, {
          method,
          body,
          auth,
          retry: false,
        })
      }
    } catch {
      clearTokens()
    }
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
export const api = {
  register: (payload) =>
    request('/users/register', {
      method: 'POST',
      body: payload,
      auth: false,
    }),
  login: (payload) =>
    request('/users/login', {
      method: 'POST',
      body: payload,
      auth: false,
    }),
  logout: () =>
    request('/users/logout', {
      method: 'POST',
    }),
  refreshToken: () =>
    request('/users/refresh-token', {
      method: 'POST',
      body: {
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      },
      auth: false,
      retry: false,
    }),
  currentUser: () => request('/users/current-user'),
  updateCurrentUser: (payload) =>
    request('/users/update-account', {
      method: 'PATCH',
      body: payload,
    }),
  changeAvatar: (payload) =>
    request('/users/avatar-change', {
      method: 'PATCH',
      body: payload,
    }),
  changePassword: (payload) =>
    request('/users/passchange', {
      method: 'PATCH',
      body: payload,
    }),
}
export const contestApi = {
  create: (payload) =>
    request('/contest/create', {
      method: 'POST',
      body: payload,
    }),
  updateDetails: (contestId, payload) =>
    request(`/contest/update/details/${contestId}`, {
      method: 'PATCH',
      body: payload,
    }),
  getAll: (page = 1) =>
    request(`/contest/getallcontest?page=${page}`, {
      auth: false,
    }),
  changePassword: (contestId, password) =>
    request(`/contest/changepass/${contestId}`, {
      method: 'PATCH',
      body: {
        password,
      },
    }),
  join: (contestId) =>
    request(`/contest/join/${contestId}`, {
      method: 'PATCH',
    }),
  leave: (contestId) =>
    request(`/contest/leave/${contestId}`, {
      method: 'PATCH',
    }),
  updateTime: (contestId, startingFrom, endingAt) =>
    request(`/contest/update/time/${contestId}`, {
      method: 'PATCH',
      body: {
        startingFrom,
        endingAt,
      },
    }),
  getParticipants: (contestId) =>
    request(`/contest/participants/${contestId}`, {
      auth: true,
    }),
  getRank: (contestId) =>
    request(`/contest/rank/${contestId}`, {
      auth: false,
    }),
  cancel: (contestId) =>
    request(`/contest/cancle/${contestId}`, {
      method: 'PATCH',
    }),
  remove: (contestId) =>
    request(`/contest/delete/${contestId}`, {
      method: 'DELETE',
    }),
}
export const followApi = {
  toggle: (userId) =>
    request(`/${userId}/follow`, {
      method: 'POST',
    }),
  getFollowers: (userId, page = 1) =>
    request(`/${userId}/follow/get/followers?page=${page}`, {
      auth: false,
    }),
  getFollowing: (userId, page = 1) =>
    request(`/${userId}/follow/get/followings?page=${page}`, {
      auth: false,
    }),
  getStatus: (userId) => request(`/${userId}/follow/get/status`),
}
export const likeApi = {
  toggleComment: (commentId) =>
    request(`/like/c/${commentId}`, {
      method: 'POST',
    }),
  toggleDiscussion: (discussionId) =>
    request(`/like/d/${discussionId}`, {
      method: 'POST',
    }),
  toggleContest: (contestId) =>
    request(`/like/contest/${contestId}`, {
      method: 'POST',
    }),
  toggleNestedComment: (commentId) =>
    request(`/like/nested/${commentId}`, {
      method: 'POST',
    }),
}
export const commentApi = {
  create: (contestId, content) =>
    request(`/comment/${contestId}`, {
      method: 'POST',
      body: {
        content,
      },
    }),
  remove: (commentId) =>
    request(`/comment/delete/${commentId}`, {
      method: 'DELETE',
    }),
  update: (commentId, content) =>
    request(`/comment/update/${commentId}`, {
      method: 'PATCH',
      body: {
        content,
      },
    }),
  getForContest: (contestId, page = 1) =>
    request(`/comment/${contestId}?page=${page}`, {
      auth: false,
    }),
  getById: (commentId) =>
    request(`/comment/get/${commentId}`, {
      auth: false,
    }),
  getReplies: (commentId, page = 1) =>
    request(`/comment/get/${commentId}/replies?page=${page}`, {
      auth: false,
    }),
}
export const discussionApi = {
  create: (content) =>
    request('/discussion', {
      method: 'POST',
      body: {
        content,
      },
    }),
  getAll: (page = 1) =>
    request(`/discussion?page=${page}`, {
      auth: false,
    }),
  getById: (discussionId) =>
    request(`/discussion/get/${discussionId}`, {
      auth: false,
    }),
  update: (discussionId, content) =>
    request(`/discussion/update/${discussionId}`, {
      method: 'PATCH',
      body: {
        content,
      },
    }),
  remove: (discussionId) =>
    request(`/discussion/delete/${discussionId}`, {
      method: 'DELETE',
    }),
  getReplies: (discussionId, page = 1) =>
    request(`/discussion/get/${discussionId}/replies?page=${page}`, {
      auth: false,
    }),
}
export const problemApi = {
  create: (contestId, payload) =>
    request(`/${contestId}/problem/create`, {
      method: 'POST',
      body: payload,
    }),
  update: (contestId, problemId, payload) =>
    request(`/${contestId}/problem/update/${problemId}`, {
      method: 'PATCH',
      body: payload,
    }),
  addLanguages: (contestId, problemId, languageIds) =>
    request(`/${contestId}/problem/add/l/${problemId}`, {
      method: 'PATCH',
      body: {
        languageIds,
      },
    }),
  addTestCases: (contestId, problemId, testCases) =>
    request(`/${contestId}/problem/add/t/${problemId}`, {
      method: 'PATCH',
      body: {
        testCases,
      },
    }),
  addPreloadedCode: (contestId, problemId, languageId, code) =>
    request(`/${contestId}/problem/add/code/${problemId}`, {
      method: 'PATCH',
      body: {
        languageId,
        code,
      },
    }),
  getSingle: (contestId, problemId) =>
    request(`/${contestId}/problem/get/single/${problemId}`, {
      auth: false,
    }),
  getAll: (contestId) =>
    request(`/${contestId}/problem/get`, {
      auth: false,
    }),
  getTestCases: (contestId, problemId) =>
    request(`/${contestId}/problem/get/testcases/${problemId}`, {
      auth: false,
    }),
  getLanguages: (contestId, problemId) =>
    request(`/${contestId}/problem/get/language/${problemId}`, {
      auth: false,
    }),
  getPreloadedCode: (contestId, problemId, languageId) =>
    request(`/${contestId}/problem/get/code/${problemId}/${languageId}`, {
      auth: false,
    }),
}
export const nestApi = {
  replyToComment: (commentId, content) =>
    request(`/nest/comments/${commentId}/replies`, {
      method: 'POST',
      body: { content },
    }),
  replyToDiscussion: (discussionId, content) =>
    request(`/nest/discussions/${discussionId}/replies`, {
      method: 'POST',
      body: { content },
    }),
  replyToReply: (replyId, content) =>
    request(`/nest/replies/${replyId}/replies`, {
      method: 'POST',
      body: { content },
    }),
  updateReply: (replyId, content) =>
    request(`/nest/replies/${replyId}`, {
      method: 'PATCH',
      body: { content },
    }),
  removeReply: (replyId) =>
    request(`/nest/replies/${replyId}`, {
      method: 'DELETE',
    }),
  getReplyReplies: (replyId, page = 1) =>
    request(`/nest/replies/${replyId}/replies?page=${page}`, {
      auth: true,
    }),
}

export const communityApi = {
  create: (payload) =>
    request('/community/create', {
      method: 'POST',
      body: payload,
    }),
  update: (communityId, payload) =>
    request(`/community/update/${communityId}`, {
      method: 'PATCH',
      body: payload,
    }),
  remove: (communityId) =>
    request(`/community/delete/${communityId}`, {
      method: 'DELETE',
    }),
  updateAvatar: (communityId, payload) =>
    request(`/community/update/avatar/${communityId}`, {
      method: 'POST',
      body: payload,
    }),
  updatePermissions: (communityId, payload) =>
    request(`/community/update/permissions/${communityId}`, {
      method: 'PATCH',
      body: payload,
    }),
  getById: (communityId) =>
    request(`/community/get/${communityId}`, {
      auth: false,
    }),
  getAll: (page = 1) =>
    request(`/community/getall?page=${page}`, {
      auth: false,
    }),
  search: (query, page = 1) =>
    request(`/community/search?q=${encodeURIComponent(query)}&page=${page}`, {
      auth: false,
    }),
  join: (communityId) =>
    request(`/community/join/${communityId}`, {
      method: 'POST',
    }),
  leave: (communityId) =>
    request(`/community/leave/${communityId}`, {
      method: 'POST',
    }),
  getMembers: (communityId, page = 1) =>
    request(`/community/members/${communityId}?page=${page}`, {
      auth: false,
    }),
  removeMember: (communityId, memberId) =>
    request(`/community/members/${communityId}/${memberId}`, {
      method: 'DELETE',
    }),
  getUserCommunities: () => request('/community/mine'),
  sendMessage: (communityId, content) =>
    request(`/community/message/${communityId}`, {
      method: 'POST',
      body: { content },
    }),
  getMessages: (communityId, page = 1) =>
    request(`/community/message/${communityId}?page=${page}`),
  updateMessage: (messageId, content) =>
    request(`/community/message/update/${messageId}`, {
      method: 'PATCH',
      body: { content },
    }),
  deleteMessage: (messageId) =>
    request(`/community/message/delete/${messageId}`, {
      method: 'DELETE',
    }),
  pinMessage: (messageId) =>
    request(`/community/message/pin/${messageId}`, {
      method: 'POST',
    }),
  unpinMessage: (messageId) =>
    request(`/community/message/unpin/${messageId}`, {
      method: 'POST',
    }),
}

export { API_BASE }

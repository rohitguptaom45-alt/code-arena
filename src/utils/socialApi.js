import { followApi, likeApi, commentApi, discussionApi, nestApi } from './api.js'
export async function toggleFollowRemote(userId) {
  try {
    const res = await followApi.toggle(userId)
    return {
      isFollowing: res?.data?.isFollowing,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't update follow status.",
    }
  }
}
export async function fetchFollowersRemote(userId, page = 1) {
  try {
    const res = await followApi.getFollowers(userId, page)
    return {
      followers: res?.data?.followers || [],
      pagination: res?.data?.pagination,
    }
  } catch (err) {
    return {
      followers: [],
      pagination: null,
      error: err.message,
    }
  }
}
export async function fetchFollowingRemote(userId, page = 1) {
  try {
    const res = await followApi.getFollowing(userId, page)
    return {
      following: res?.data?.following || [],
      pagination: res?.data?.pagination,
    }
  } catch (err) {
    return {
      following: [],
      pagination: null,
      error: err.message,
    }
  }
}
export async function fetchFollowStatusRemote(userId) {
  try {
    const res = await followApi.getStatus(userId)
    return {
      isFollowing: res?.data?.isFollowing,
      isOwnProfile: res?.data?.isOwnProfile,
    }
  } catch (err) {
    return {
      isFollowing: false,
      isOwnProfile: false,
      error: err.message,
    }
  }
}
export async function toggleCommentLikeRemote(commentId) {
  try {
    const res = await likeApi.toggleComment(commentId)
    return {
      isLiked: res?.data?.isLiked,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message,
    }
  }
}
export async function toggleDiscussionLikeRemote(discussionId) {
  try {
    const res = await likeApi.toggleDiscussion(discussionId)
    return {
      isLiked: res?.data?.isLiked,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message,
    }
  }
}
export async function toggleContestLikeRemote(contestId) {
  try {
    const res = await likeApi.toggleContest(contestId)
    return {
      isLiked: res?.data?.isLiked,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message,
    }
  }
}
export async function toggleNestedCommentLikeRemote(commentId) {
  try {
    const res = await likeApi.toggleNestedComment(commentId)
    return {
      isLiked: res?.data?.isLiked,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message,
    }
  }
}
export async function postCommentRemote(contestId, content) {
  try {
    const res = await commentApi.create(contestId, content)
    return {
      comment: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't post your comment.",
    }
  }
}
export async function updateCommentRemote(commentId, content) {
  try {
    const res = await commentApi.update(commentId, content)
    return {
      comment: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't update your comment.",
    }
  }
}
export async function deleteCommentRemote(commentId) {
  try {
    await commentApi.remove(commentId)
    return {
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't delete the comment.",
    }
  }
}
export async function fetchContestCommentsRemote(contestId, page = 1) {
  try {
    const res = await commentApi.getForContest(contestId, page)
    return {
      comments: res?.data?.comments || [],
      pagination: res?.data?.pagination,
    }
  } catch (err) {
    return {
      comments: [],
      pagination: null,
      error: err.message,
    }
  }
}
export async function fetchCommentRepliesRemote(commentId, page = 1) {
  try {
    const res = await commentApi.getReplies(commentId, page)
    return {
      replies: res?.data?.replies || [],
      pagination: res?.data?.pagination,
    }
  } catch (err) {
    return {
      replies: [],
      pagination: null,
      error: err.message,
    }
  }
}
export async function createDiscussionRemote(content) {
  try {
    const res = await discussionApi.create(content)
    return {
      discussion: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't reach the backend to post this.",
    }
  }
}
export async function updateDiscussionRemote(discussionId, content) {
  try {
    const res = await discussionApi.update(discussionId, content)
    return {
      discussion: res?.data,
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't update the post.",
    }
  }
}
export async function deleteDiscussionRemote(discussionId) {
  try {
    await discussionApi.remove(discussionId)
    return {
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't delete the post.",
    }
  }
}
export async function fetchDiscussionsRemote(page = 1) {
  try {
    const res = await discussionApi.getAll(page)
    return {
      discussions: res?.data?.discussions || [],
      pagination: res?.data?.pagination,
    }
  } catch (err) {
    return {
      discussions: [],
      pagination: null,
      error: err.message,
    }
  }
}
export async function fetchDiscussionRepliesRemote(discussionId, page = 1) {
  try {
    const res = await discussionApi.getReplies(discussionId, page)
    return {
      replies: res?.data?.replies || [],
      pagination: res?.data?.pagination,
    }
  } catch (err) {
    return {
      replies: [],
      pagination: null,
      error: err.message,
    }
  }
}
export async function replyToCommentRemote(commentId, content) {
  try {
    const res = await nestApi.replyToComment(commentId, content)
    return { reply: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't post your reply." }
  }
}
export async function replyToDiscussionRemote(discussionId, content) {
  try {
    const res = await nestApi.replyToDiscussion(discussionId, content)
    return { reply: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't post your reply." }
  }
}
export async function replyToReplyRemote(replyId, content) {
  try {
    const res = await nestApi.replyToReply(replyId, content)
    return { reply: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't post your reply." }
  }
}
export async function updateReplyRemote(replyId, content) {
  try {
    const res = await nestApi.updateReply(replyId, content)
    return { reply: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't update your reply." }
  }
}
export async function deleteReplyRemote(replyId) {
  try {
    await nestApi.removeReply(replyId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't delete that reply." }
  }
}
export async function fetchReplyOfReplyRemote(replyId, page = 1) {
  try {
    const res = await nestApi.getReplyReplies(replyId, page)
    return { replies: res?.data?.replies || [], pagination: res?.data?.pagination }
  } catch (err) {
    return { replies: [], pagination: null, error: err.message }
  }
}

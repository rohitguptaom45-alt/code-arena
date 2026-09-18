import { contestApi } from './api.js'
const BANNERS = [
  'from-accent to-accent-soft',
  'from-ink to-ink-soft',
  'from-accent-soft to-accent',
  'from-ink-soft to-accent',
]
function bannerFor(id) {
  let hash = 0
  for (const ch of String(id)) hash = (hash * 31 + ch.charCodeAt(0)) % 997
  return BANNERS[hash % BANNERS.length]
}
function difficultyFor(totalPoints) {
  if (totalPoints <= 300) return 'Easy'
  if (totalPoints <= 700) return 'Medium'
  return 'Hard'
}
function durationLabel(startingFrom, endingAt) {
  const ms = new Date(endingAt).getTime() - new Date(startingFrom).getTime()
  if (!Number.isFinite(ms) || ms <= 0) return '—'
  const hrs = ms / 3600000
  if (hrs < 1) return `${Math.round(ms / 60000)} min`
  if (hrs < 24) return `${Math.round(hrs)} hr${hrs >= 2 ? 's' : ''}`
  return `${Math.round(hrs / 24)} day${hrs >= 48 ? 's' : ''}`
}
export function normalizeRemoteContest(c) {
  const startsInSeconds = Math.max(0, Math.round((new Date(c.startingFrom).getTime() - Date.now()) / 1000))
  const resolvedOwnerId = c.ownerId || c.owner?.id
  const resolvedOwnerName = c.owner?.username || c.createdBy || c.ownerId
  return {
    id: c.id,
    remote: true,
    isCustom: true,
    name: c.title,
    tagline: c.description,
    difficulty: difficultyFor(c.totalPoints || 0),
    duration: durationLabel(c.startingFrom, c.endingAt),
    startsInSeconds,
    startingFrom: c.startingFrom,
    endingAt: c.endingAt,
    entryFee: c.isProtected ? '🔒 Password protected' : 'Free',
    prizePool: `${c.totalPoints ?? 0} pts`,
    totalPoints: c.totalPoints ?? 0,
    participants: c._count?.participants ?? c.participants?.length ?? 0,
    languages: c.languages && c.languages.length ? c.languages : ['Any'],
    banner: bannerFor(c.id),
    createdBy: resolvedOwnerName,
    ownerId: resolvedOwnerId,
    owner: c.owner,
    ownerAvatar: c.owner?.avatar,
    visibility: c.visibility,
    isProtected: Boolean(c.isProtected),
    isCancelled: Boolean(c.isCancelled),
    status: c.status,
    createdAt: c.createdAt,
    _count: {
      ...c._count,
      likes: c._count?.likes ?? c._count?.like ?? 0,
      like: c._count?.likes ?? c._count?.like ?? 0,
    },
    likesCount: c._count?.likes ?? c._count?.like ?? 0,
    isLikedByMe: Boolean(c.isLikedByMe),
  }
}
export async function fetchContestByIdRemote(contestId) {
  try {
    const res = await contestApi.getById(contestId)
    if (res?.data) {
      return {
        contest: normalizeRemoteContest(res.data),
        source: 'remote',
      }
    }
    return {
      error: 'Contest not found',
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't fetch contest details.",
    }
  }
}
export async function fetchContestsRemoteFirst(page = 1) {
  try {
    const res = await contestApi.getAll(page)
    const contests = res?.data?.contests || []
    return {
      contests: contests.map(normalizeRemoteContest),
      pagination: res?.data?.pagination,
      source: 'remote',
    }
  } catch (err) {
    return {
      contests: [],
      pagination: null,
      source: 'local',
      error: err.message,
    }
  }
}
export async function createContestRemoteFirst(payload) {
  try {
    const res = await contestApi.create(payload)
    return {
      contest: normalizeRemoteContest(res.data),
      source: 'remote',
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't reach the backend to create the contest.",
    }
  }
}
export async function joinContestRemoteFirst(contestId, password) {
  try {
    await contestApi.join(contestId, password)
    return {
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't reach the backend to join this contest.",
    }
  }
}
export async function leaveContestRemoteFirst(contestId) {
  try {
    await contestApi.leave(contestId)
    return {
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't reach the backend to leave this contest.",
    }
  }
}
export async function cancelContestRemoteFirst(contestId) {
  try {
    await contestApi.cancel(contestId)
    return {
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't cancel the contest.",
    }
  }
}
export async function deleteContestRemoteFirst(contestId) {
  try {
    await contestApi.remove(contestId)
    return {
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't delete the contest.",
    }
  }
}
export async function updateContestDetailsRemoteFirst(contestId, payload) {
  try {
    const res = await contestApi.updateDetails(contestId, payload)
    return {
      contest: normalizeRemoteContest(res.data),
      source: 'remote',
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't update the contest.",
    }
  }
}
export async function updateContestTimeRemoteFirst(contestId, startingFrom, endingAt) {
  try {
    const res = await contestApi.updateTime(contestId, startingFrom, endingAt)
    return {
      contest: normalizeRemoteContest(res.data),
      source: 'remote',
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't update the contest schedule.",
    }
  }
}
export async function changeContestPasswordRemoteFirst(contestId, password) {
  try {
    await contestApi.changePassword(contestId, password)
    return {
      success: true,
    }
  } catch (err) {
    return {
      error: err.message || "Couldn't update the contest password.",
    }
  }
}
export async function fetchContestParticipantsRemote(contestId) {
  try {
    const res = await contestApi.getParticipants(contestId)
    return {
      participants: res?.data?.participants || [],
      count: res?.data?._count?.participants ?? 0,
    }
  } catch (err) {
    return {
      participants: [],
      count: 0,
      error: err.message,
    }
  }
}
export async function fetchContestRankRemote(contestId) {
  try {
    const res = await contestApi.getRank(contestId)
    return {
      rank: res?.data || [],
    }
  } catch (err) {
    return {
      rank: [],
      error: err.message,
    }
  }
}

import { communityApi } from './api.js'

export function normalizeCommunity(c) {
  return {
    id: c.id,
    name: c.name || c.title,
    description: c.description || '',
    avatar: c.avatar,
    ownerId: c.ownerId,
    owner: c.owner,
    memberCount: c._count?.members ?? c.memberCount ?? 0,
    isMember: c.isMember ?? false,
    isPrivate: !!c.isPrivate,
    createdAt: c.createdAt,
  }
}

export async function createCommunityRemote(payload) {
  try {
    const res = await communityApi.create(payload)
    return { community: res?.data && normalizeCommunity(res.data), success: true }
  } catch (err) {
    return { error: err.message || "Couldn't create the community." }
  }
}

export async function updateCommunityRemote(communityId, payload) {
  try {
    const res = await communityApi.update(communityId, payload)
    return { community: res?.data && normalizeCommunity(res.data), success: true }
  } catch (err) {
    return { error: err.message || "Couldn't update the community." }
  }
}

export async function deleteCommunityRemote(communityId) {
  try {
    await communityApi.remove(communityId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't delete the community." }
  }
}

export async function updateCommunityAvatarRemote(communityId, payload) {
  try {
    const res = await communityApi.updateAvatar(communityId, payload)
    return { community: res?.data && normalizeCommunity(res.data), success: true }
  } catch (err) {
    return { error: err.message || "Couldn't update the avatar." }
  }
}

export async function updateCommunityPermissionsRemote(communityId, payload) {
  try {
    const res = await communityApi.updatePermissions(communityId, payload)
    return { community: res?.data && normalizeCommunity(res.data), success: true }
  } catch (err) {
    return { error: err.message || "Couldn't update permissions." }
  }
}

export async function fetchCommunityRemote(communityId) {
  try {
    const res = await communityApi.getById(communityId)
    return { community: res?.data && normalizeCommunity(res.data) }
  } catch (err) {
    return { community: null, error: err.message || "Couldn't load this community." }
  }
}

export async function fetchCommunitiesRemote(page = 1) {
  try {
    const res = await communityApi.getAll(page)
    const list = res?.data?.communities || res?.data || []
    return { communities: list.map(normalizeCommunity), pagination: res?.data?.pagination }
  } catch (err) {
    return { communities: [], pagination: null, error: err.message }
  }
}

export async function searchCommunitiesRemote(query, page = 1) {
  try {
    const res = await communityApi.search(query, page)
    const list = res?.data?.communities || res?.data || []
    return { communities: list.map(normalizeCommunity), pagination: res?.data?.pagination }
  } catch (err) {
    return { communities: [], pagination: null, error: err.message }
  }
}

export async function joinCommunityRemote(communityId) {
  try {
    const res = await communityApi.join(communityId)
    return { isMember: res?.data?.isMember ?? true, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't join this community." }
  }
}

export async function leaveCommunityRemote(communityId) {
  try {
    await communityApi.leave(communityId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't leave this community." }
  }
}

export async function fetchCommunityMembersRemote(communityId, page = 1) {
  try {
    const res = await communityApi.getMembers(communityId, page)
    return { members: res?.data?.members || [], pagination: res?.data?.pagination }
  } catch (err) {
    return { members: [], pagination: null, error: err.message }
  }
}

export async function removeCommunityMemberRemote(communityId, memberId) {
  try {
    await communityApi.removeMember(communityId, memberId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't remove that member." }
  }
}

export async function fetchUserCommunitiesRemote() {
  try {
    const res = await communityApi.getUserCommunities()
    const list = res?.data?.communities || res?.data || []
    return { communities: list.map(normalizeCommunity) }
  } catch (err) {
    return { communities: [], error: err.message }
  }
}

export async function sendCommunityMessageRemote(communityId, content) {
  try {
    const res = await communityApi.sendMessage(communityId, content)
    return { message: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't send that message." }
  }
}

export async function fetchCommunityMessagesRemote(communityId, page = 1) {
  try {
    const res = await communityApi.getMessages(communityId, page)
    return { messages: res?.data?.messages || [], pagination: res?.data?.pagination }
  } catch (err) {
    return { messages: [], pagination: null, error: err.message }
  }
}

export async function updateCommunityMessageRemote(messageId, content) {
  try {
    const res = await communityApi.updateMessage(messageId, content)
    return { message: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't update that message." }
  }
}

export async function deleteCommunityMessageRemote(messageId) {
  try {
    await communityApi.deleteMessage(messageId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't delete that message." }
  }
}

export async function pinCommunityMessageRemote(messageId) {
  try {
    await communityApi.pinMessage(messageId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't pin that message." }
  }
}

export async function unpinCommunityMessageRemote(messageId) {
  try {
    await communityApi.unpinMessage(messageId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't unpin that message." }
  }
}

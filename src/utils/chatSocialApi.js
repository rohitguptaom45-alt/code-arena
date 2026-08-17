import { friendApi, chatApi, notificationApi, userSearchApi } from './api.js'

export function normalizeChat(c, currentUserId) {
    if (!c) return c;
    

    const adminId = c.admin?.id ?? c.adminId;
    const chatMembers = c.members || [];
    // console.log("normalize",adminId)

    let members = [];

    if (c.isGroup) {
        // Group → all members
        members = chatMembers.map((m) => m.user);
    } else {
        // Single chat → only the other user
        const otherUser = chatMembers
            .map((m) => m.user)
            .find((u) => u && u.id !== currentUserId);

        if (otherUser) {
            members = [otherUser];
        } else if (c.userId) {
            // fallback if members isn't available
            members = [{
                id: c.userId,
                username: c.name,
                avatar: c.avatar
            }];
        }
    }
 

    return {
        ...c,
        adminId,
        members,
        isAdmin:
            !!currentUserId &&
            !!adminId &&
            adminId === currentUserId,
        memberCount: members.length || c._count?.members || 0,
    };
}

export async function searchUsersRemote(query) {
  try {
    const res = await userSearchApi.search(query)
    return { users: res?.data || [] }
  } catch (err) {
    return { users: [], error: err.message || "Couldn't search users." }
  }
}

export async function fetchUserProfileRemote(username) {
  try {
    const res = await userSearchApi.getProfile(username)
    return { profile: res?.data }
  } catch (err) {
    return { error: err.message || "Couldn't load that profile." }
  }
}

export async function fetchFriendsRemote(currentUserId) {
  try {
    const res = await chatApi.getMyChats()
    const friends = (res?.data || [])
      .filter((c) => !c.isGroup)
      .map((c) => ({ id: c.userId, username: c.name, avatar: c.avatar, chatId: c.id }))
    return { friends }
  } catch (err) {
    return { friends: [], error: err.message || "Couldn't load your friends." }
  }
}

export async function fetchPendingRequestsRemote() {
  try {
    const res = await friendApi.getPendingRequests()
    const requests = (res?.data || []).map((r) => ({
      id: r.id,
      status: r.status,
      username: r.sender?.username,
      avatar: r.sender?.avatar,
      fullName: r.sender?.fullName,
    }))
    return { requests }
  } catch (err) {
    return { requests: [], error: err.message || "Couldn't load requests." }
  }
}

export async function sendFriendRequestRemote(userId) {
  try {
    const res = await friendApi.send(userId)
    return { request: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't send that request." }
  }
}

export async function sendFriendRequestByUsernameRemote(username) {
  try {
    const profileRes = await userSearchApi.getProfile(username)
    const userId = profileRes?.data?.id
    if (!userId) return { error: "Couldn't find that user." }
    const res = await friendApi.send(userId)
    return { request: res?.data, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't send that request." }
  }
}

export async function respondFriendRequestRemote(requestId, accept, currentUserId) {
  try {
    console.log('respondFriendRequestRemote called with:', { requestId, accept, currentUserId });
    const res = await friendApi.respond(requestId, accept)
    return { chat: normalizeChat(res?.data, currentUserId), success: true }
  } catch (err) {
    return { error: err.message || "Couldn't respond to that request." }
  }
}

export async function fetchMyChatsRemote(currentUserId) {
  try {
    const res = await chatApi.getMyChats()
    
    const chats = (res?.data || []).map((c) => normalizeChat(c, currentUserId))
   
    return { chats }
  } catch (err) {
    return { chats: [], error: err.message || "Couldn't load your chats." }
  }
}

export async function fetchMyGroupsRemote() {
  try {
    const res = await chatApi.getMyGroups()
    return { groups: res?.data || [] }
  } catch (err) {
    return { groups: [], error: err.message || "Couldn't load your groups." }
  }
}

export async function fetchChatDetailsRemote(chatId, populate = true) {
  try {
    const res = await chatApi.getDetails(chatId, populate)
    
    return { chat: res?.community, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't load this chat." }
  }
}

export async function findExistingDirectChatRemote(userId, currentUserId) {
  try {
    const res = await chatApi.getMyChats()
    const match = (res?.data || []).find((c) => !c.isGroup && c.userId === userId)
    if (!match) return { error: 'No chat with this user yet — send a chat request first.' }
    return { chat: normalizeChat(match, currentUserId), success: true }
  } catch (err) {
    return { error: err.message || "Couldn't open this chat." }
  }
}

export async function createGroupChatRemote(name, memberIds, currentUserId, description, avatar) {
  try {
    const res = await chatApi.createGroup(name, memberIds, description, avatar)
    return { chat: normalizeChat(res?.data, currentUserId), success: true }
  } catch (err) {
    return { error: err.message || "Couldn't create the group." }
  }
}

export async function fetchMessagesRemote(chatId, page = 1) {
  try {
    const res = await chatApi.getMessages(chatId, page)
    return { messages: res?.data?.chat || [], pagination: res?.data?.pagination }
  } catch (err) {
    return { messages: [], pagination: null, error: err.message || "Couldn't load messages." }
  }
}

export async function fetchGroupMembersRemote(chatId) {
  try {
    const res = await chatApi.getDetails(chatId, true)
    const rows = res?.community?.members || []
    const members = rows.map((row) => ({
      id: row.user?.id,
      username: row.user?.username,
      fullName: row.user?.fullName,
      avatar: row.user?.avatar,
    }))
    return { members }
  } catch (err) {
    return { members: [], error: err.message || "Couldn't load members." }
  }
}

export async function addGroupMembersRemote(chatId, memberIds) {
  try {
    const res = await chatApi.addMembers(chatId, memberIds)
    if (res?.success === false) return { error: res?.message || "Couldn't add members." }
    return { success: true, added: res?.data || [] }
  } catch (err) {
    return { error: err.message || "Couldn't add members." }
  }
}

export async function removeGroupMemberRemote(chatId, memberId) {
  try {
    await chatApi.removeMember(chatId, memberId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't remove that member." }
  }
}

export async function renameGroupRemote(chatId, name) {
  try {
    const res = await chatApi.rename(chatId, name)
    return { chat: res?.community, success: true }
  } catch (err) {
    return { error: err.message || "Couldn't rename the group." }
  }
}

export async function leaveGroupRemote(chatId) {
  try {
    const res = await chatApi.leaveGroup(chatId)
    if (res?.success === false) return { error: res?.message || "Couldn't leave the group." }
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't leave the group." }
  }
}

export async function deleteGroupRemote(chatId) {
  try {
    await chatApi.deleteGroup(chatId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't delete the group." }
  }
}

export async function deleteChatRemote(chatId) {
  try {
    await chatApi.deleteChat(chatId)
    return { success: true }
  } catch (err) {
    return { error: err.message || "Couldn't delete this chat." }
  }
}

export async function fetchNotificationsRemote() {
  try {
    const res = await notificationApi.getAll()  //aab iske andar check karenge yahak socket nahi mila k
    const notifications = (res?.data || []).map((n) => ({
      id: n.id,
      status: n.status,
      username: n.sender?.username,
      avatar: n.sender?.avatar,
      fullName: n.sender?.fullName,
    }))
    return { notifications, unreadCount: notifications.length }
  } catch (err) {
    return { notifications: [], unreadCount: 0, error: err.message }
  }
}

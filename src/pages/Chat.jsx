import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { connectSocket, disconnectSocket, SOCKET_EVENTS } from '../utils/socket.js'
import {
  searchUsersRemote,
  fetchFriendsRemote,
  fetchPendingRequestsRemote,
  sendFriendRequestRemote,
  sendFriendRequestByUsernameRemote,
  respondFriendRequestRemote,
  fetchMyChatsRemote,
  findExistingDirectChatRemote,
  createGroupChatRemote,
  fetchMessagesRemote,
  fetchGroupMembersRemote,
  addGroupMembersRemote,
  removeGroupMemberRemote,
  renameGroupRemote,
  leaveGroupRemote,
  deleteGroupRemote,
  deleteChatRemote,
} from '../utils/chatSocialApi.js'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'
import { getOrSaveFromStorage } from '../lib/locals.js'
import { removeNewMessagesAlert, setNewMessagesAlert } from '../store/chatSlice.js'

function initials(name) {
  return (name || '?').replace(/[._]/g, ' ').trim()[0]?.toUpperCase() || '?'
}
function fmtTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function Avatar({
  name,
  size = "w-11 h-11",
  textSize = "text-sm",
  isOnline = true,
}) {
  return (
    <div className="relative shrink-0">
      <span
        className={`${size} rounded-full bg-accent-soft text-white grid place-items-center font-display font-bold ${textSize}`}
      >
        {initials(name)}
      </span>

      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
}

function CreateGroupModal({ friends, initialSelectedId, currentUserId, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(() => new Set(initialSelectedId ? [initialSelectedId] : []))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleCreate = async () => {
    if (!name.trim()) return setError('Give your group a name.')
    if (selected.size < 2) return setError('Pick at least 2 friends — a group needs a minimum of 3 members.')
    if (selected.size + 1 > 100) return setError('A group can have a maximum of 100 members.')
    setSaving(true)
    setError('')
    const res = await createGroupChatRemote(name.trim(), [...selected], currentUserId)
    setSaving(false)
    if (res.error) return setError(res.error)
    onCreated(res.chat)
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-soft max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display font-bold text-lg text-ink mb-4">Create a group</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-accent-soft"
        />
        <p className="text-xs text-ink-soft mb-2">
          Pick friends to add ({selected.size + 1}/100 members) — minimum 3 members total.
        </p>
        <div className="space-y-1.5 mb-3 max-h-64 overflow-y-auto">
          {friends.length === 0 && <p className="text-sm text-ink-soft text-center py-6">Add some friends first to start a group.</p>}
          {friends.map((f) => (
            <label key={f.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-soft cursor-pointer">
              <input type="checkbox" checked={selected.has(f.id)} onChange={() => toggle(f.id)} className="accent-accent w-4 h-4" />
              <Avatar name={f.fullName || f.username} size="w-8 h-8" textSize="text-xs" />
              <span className="text-sm text-ink">{f.fullName || f.username}</span>
            </label>
          ))}
        </div>
        {error && <p className="text-xs text-danger mb-3">{error}</p>}
        <button
          onClick={handleCreate}
          disabled={saving}
          className="w-full py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? 'Creating…' : 'Create group'}
        </button>
        <button onClick={onClose} className="w-full mt-3 text-xs text-ink-soft hover:text-ink">
          Close
        </button>
      </div>
    </div>
  )
}

function ManageGroupModal({ chat, friends, onClose, onUpdated, onDeleted,onLeave}) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState(chat.name)
  const [adding, setAdding] = useState(false)
  const [selectedToAdd, setSelectedToAdd] = useState(new Set())
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await fetchGroupMembersRemote(chat.id)
    setLoading(false)
    setMembers(res.members)
  }
  useEffect(() => {
    load()
  }, [])

  const memberIds = new Set(members.map((m) => m.id))
  const addableFriends = friends.filter((f) => !memberIds.has(f.id))

  const handleRename = async () => {
    if (!name.trim() || name.trim() === chat.name) return
    const res = await renameGroupRemote(chat.id, name.trim())
    if (!res.error) onUpdated(res.chat)
  }

  const handleRemove = async (memberId) => {
    if (!window.confirm('Remove this member from the group?')) return
    const res = await removeGroupMemberRemote(chat.id, memberId)
    if (!res.error) load()
    else setError(res.error)
  }

  const handleAdd = async () => {
    if (selectedToAdd.size === 0) return
    const res = await addGroupMembersRemote(chat.id, [...selectedToAdd])
    if (!res.error) {
      setSelectedToAdd(new Set())
      setAdding(false)
      load()
    } else setError(res.error)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this group permanently? This cannot be undone.')) return
    const res = await deleteGroupRemote(chat.id)
    if (!res.error) onDeleted()
  }
   async function handleLeaveGroup() {
    if (!window.confirm('Leave this group?')) return
    const res = await leaveGroupRemote(chat.id)
    if (!res.error) {
      onLeave();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-soft max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display font-bold text-lg text-ink mb-4">Manage group</h3>

        <label className="text-xs text-ink-soft mb-1 block">Group name</label>
        <div className="flex gap-2 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
          {chat.isAdmin ? (
            <button
              onClick={handleRename}
              className="px-3 py-2 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover"
            >
              Save
            </button>
          ):(
             <button
              onClick={handleLeaveGroup}
              className="px-3 py-2 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover"
            >
              Leave
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-ink-soft">Members ({members.length})</span>
          <button onClick={() => setAdding((v) => !v)} className="text-xs font-medium text-accent hover:underline">
            {adding ? 'Cancel' : '+ Add members'}
          </button>
        </div>

        {adding && (
          <div className="mb-3 border border-border rounded-2xl p-2 max-h-40 overflow-y-auto">
            {addableFriends.length === 0 && <p className="text-xs text-ink-soft text-center py-3">All your friends are already in this group.</p>}
            {addableFriends.map((f) => (
              <label key={f.id} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-bg-soft cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedToAdd.has(f.id)}
                  onChange={() =>
                    setSelectedToAdd((prev) => {
                      const next = new Set(prev)
                      next.has(f.id) ? next.delete(f.id) : next.add(f.id)
                      return next
                    })
                  }
                  className="accent-accent w-4 h-4"
                />
                {f.fullName || f.username}
              </label>
            ))}
            {addableFriends.length > 0 && (
              <button onClick={handleAdd} className="w-full mt-2 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover">
                Add selected
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-ink-soft text-center py-6">Loading…</p>
        ) : (
          <div className="space-y-1.5 mb-4 max-h-56 overflow-y-auto">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-soft">
                <Avatar name={m.fullName || m.username} size="w-8 h-8" textSize="text-xs" />
                <span className="flex-1 text-sm text-ink">
                  {m.fullName || m.username}
                  {m.id === chat.adminId && <span className="ml-2 text-[10px] font-semibold text-accent">ADMIN</span>}
                </span>
                {chat.isAdmin && m.id !== chat.adminId && (
  <button
    onClick={() => handleRemove(m.id)}
    className="text-xs text-danger hover:underline"
  >
    Remove
  </button>
)}
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-danger mb-3">{error}</p>}

        <button onClick={handleDelete} className="w-full py-2.5 rounded-2xl border border-danger/30 text-sm font-medium text-danger hover:bg-danger/5">
          Delete group
        </button>
        <button onClick={onClose} className="w-full mt-3 text-xs text-ink-soft hover:text-ink">
          Close
        </button>
      </div>
    </div>
  )
}












export default function Chat() {
  const user = useSelector((s) => s.auth.user)

  const [searchParams, setSearchParams] = useSearchParams()
  const deepLinkWithId = searchParams.get('with')
  const deepLinkGroupWithId = searchParams.get('newGroupWith')


  const [tab, setTab] = useState('chats') // chats | requests | find
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])      // this cariable hold the request model
  const [search, setSearch] = useState('')
  const [findQuery, setFindQuery] = useState('')   // possibel variable 
  const [findResults, setFindResults] = useState([])
  const [findSending, setFindSending] = useState({})
  const [findLoading, setFindLoading] = useState(false)
  const [draft, setDraft] = useState('')
  const [attachUrl, setAttachUrl] = useState('')
  const [showAttach, setShowAttach] = useState(false)
  const [mobileShowThread, setMobileShowThread] = useState(false)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [manageGroupOpen, setManageGroupOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const dispatch = useDispatch()
  const newMessagesAlert = useSelector(
    (state) => state.community.newMessagesAlert
  ) || [];

  useEffect(() => {
    getOrSaveFromStorage({
      key: SOCKET_EVENTS.NEW_MESSAGE_ALERT,
      value: newMessagesAlert,
      get: false,
    });
  }, [newMessagesAlert]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null

  const filteredChats = chats.filter((c) => (c.name || '').toLowerCase().includes(search.toLowerCase()))

  const loadChats = async () => {

    const res = await fetchMyChatsRemote(user?.remoteId);

    const updatedChats = res.chats.map((chat) => ({
      ...chat,
      isOnline: chat.members?.some((member) =>
        onlineUsers.has(member.id.toString())
      ) || false,
    }));

    setChats(updatedChats);
  };
  const loadFriends = async () => setFriends((await fetchFriendsRemote(user?.remoteId)).friends)
  const loadPending = async () => setPending((await fetchPendingRequestsRemote()).requests)   // this is the main API calling the request   

  useEffect(() => {
    if (!user) return
    loadChats()
    loadFriends()
    loadPending()
  }, [user])

  useEffect(() => {
    const handleLiveRequest = (request) => {

      loadPending()  // Refresh the pending requests list
    }
    const handleRefeching = (data) => {

      loadChats();
    }

    const s = connectSocket()
    s.on(SOCKET_EVENTS.NEW_REQUEST, handleLiveRequest)
    s.on(SOCKET_EVENTS.REFETCH_CHATS, handleRefeching)


    return () => {
      s.off(SOCKET_EVENTS.NEW_REQUEST, handleLiveRequest)
      s.off(SOCKET_EVENTS.REFETCH_CHATS, handleRefeching)
      // s.off(SOCKET_EVENTS.START_TYPING,handleTyping)
    }
  }, [])                                                    //  Maiin Live Chat Socket Event 

  useEffect(() => {
    const s = connectSocket();

    const handleStartTyping = ({ communityId }) => {
      if (communityId !== activeChatId) return;

      setIsTyping(true);
    };

    const handleStopTyping = ({ communityId }) => {
      if (communityId !== activeChatId) return;

      setIsTyping(false);
    };

    s.on(SOCKET_EVENTS.START_TYPING, handleStartTyping);
    s.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);

    return () => {
      s.off(SOCKET_EVENTS.START_TYPING, handleStartTyping);
      s.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
    };
  }, [activeChatId]);


  const typingTimeout = useRef(null);

  const handleDraftChange = (e) => {
    const value = e.target.value;

    setDraft(value);

    const socket = connectSocket();

    socket.emit(SOCKET_EVENTS.START_TYPING, {
      communityId: activeChatId,
      members: activeChat.members.map((member) => member.id),
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.STOP_TYPING, {
        communityId: activeChatId,
        members: activeChat.members.map((member) => member.id),
      });
    }, 1000);
  };

  useEffect(() => {
    if (!user || !deepLinkWithId) return
      ; (async () => {
        const res = await findExistingDirectChatRemote(deepLinkWithId, user.remoteId)
        if (res.chat) {
          setActiveChatId(res.chat.id)
          setTab('chats')
          setMobileShowThread(true)
        } else {
          // No chat with them yet — send a request instead so they can chat once it's accepted.
          await sendFriendRequestRemote(deepLinkWithId)
          setTab('requests')
        }
        searchParams.delete('with')
        setSearchParams(searchParams, { replace: true })
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, deepLinkWithId])

  const [pendingGroupWithId, setPendingGroupWithId] = useState(null)

  useEffect(() => {
    if (!user || !deepLinkGroupWithId) return
    setPendingGroupWithId(deepLinkGroupWithId)
    setCreateGroupOpen(true)
    searchParams.delete('newGroupWith')
    setSearchParams(searchParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, deepLinkGroupWithId])

  const loadMessages = async () => {
    if (!activeChatId) return
    const res = await fetchMessagesRemote(activeChatId)
    setMessages(res.messages)
  }
  useEffect(() => {
    loadMessages()
  }, [activeChatId])

  useEffect(() => {
    if (!user) return
    const s = connectSocket()
    const onMessage = ({ communityId, message }) => {
      const chatId = communityId
      if (chatId === activeChatId) {
        setMessages((prev) =>
          prev.some((m) => m.id === message.id)
            ? prev
            : [...prev, message]
        );
      } else {
        dispatch(
          setNewMessagesAlert({
            communityId: chatId,
          })
        );
      }
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.id === chatId)
        if (idx === -1) {
          loadChats()
          return prev
        }
        const updated = { ...prev[idx], lastMessage: message, updatedAt: message.createdAt }
        const rest = prev.filter((c) => c.id !== chatId)
        return [updated, ...rest]
      })
    }
    s.on(SOCKET_EVENTS.NEW_MESSAGE, onMessage)
    return () => {
      s.off(SOCKET_EVENTS.NEW_MESSAGE, onMessage)
    }
  }, [user, activeChatId])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages.length, activeChatId, isTyping])

  // useEffect(() => () => disconnectSocket(), [])

  function requireLogin(fn) {
    return (...args) => {
      if (!user) {
        setLoginModalOpen(true)
        return
      }
      return fn(...args)
    }
  }

  function selectChat(id) {
    setActiveChatId(id);

    dispatch(removeNewMessagesAlert(id));

    setMobileShowThread(true);
    setManageGroupOpen(false);
  }

  async function runFindSearch(e) {
    e?.preventDefault()
    if (!findQuery.trim()) return setFindResults([])
    setFindLoading(true)
    const res = await searchUsersRemote(findQuery.trim())
    const results = res.users.filter((u) => u.username !== user.username)
    setFindResults(results)
    setFindLoading(false)
  }

  async function handleSendRequest(username) {
    setFindSending((prev) => ({ ...prev, [username]: true }))
    const res = await sendFriendRequestByUsernameRemote(username)
    setFindSending((prev) => ({ ...prev, [username]: false }))
    if (!res.error) {
      setFindResults((prev) => prev.filter((u) => u.username !== username))
    }
  }
  async function handleMessageFriend(userId) {
    const res = await findExistingDirectChatRemote(userId, user.remoteId)
    if (!res.error) {
      selectChat(res.chat.id)
      setTab('chats')
    }
  }

  async function handleAccept(requestId) {
    const res = await respondFriendRequestRemote(requestId, true, user.remoteId)
    if (!res.error) {
      loadPending()
      loadFriends()
      loadChats()
    }
  }
  async function handleReject(requestId) {
    const res = await respondFriendRequestRemote(requestId, false)
    if (!res.error) loadPending()
  }
  async function handleRemoveFriend(userId, chatId) {
    if (!window.confirm('Delete this chat? This will remove the conversation.')) return
    const res = await deleteChatRemote(chatId)
    if (!res.error) {
      loadFriends()
      if (activeChat && !activeChat.isGroup && activeChat.otherUser?.id === userId) {
        setActiveChatId(null)
        setMobileShowThread(false)
      }
      loadChats()
    }
  }

  async function sendMessage(e) {
    e.preventDefault();

    const text = draft.trim();
    const attachment = attachUrl.trim();

    if (!text && !attachment) return;

    const chat = activeChat;
    if (!chat) return;

    // Clear input immediately
    setDraft("");
    setAttachUrl("");
    setShowAttach(false);

    const content = attachment
      ? `${text}${text ? "\n" : ""}${attachment}`
      : text;

    // members is now the same for both group and 1-to-1 chats
    const memberIds = (chat.members || [])
      .map((member) => member.id)
      .filter(Boolean);

    const s = connectSocket();

    // Optimistic message
    const localMessage = {
      id: `local-${Date.now()}`,
      content,
      senderId: user.remoteId,
      sender: {
        id: user.remoteId,
        username: user.username,
        fullName: user.fullName,
      },
      createdAt: new Date().toISOString(),
    };

    // Send message to backend
    s.emit(SOCKET_EVENTS.NEW_MESSAGE, {
      communityId: activeChatId,
      members: memberIds,
      message: content,
    });

    // Show message immediately in sender's UI
    setMessages((prev) => [...prev, localMessage]);

    // Update chat preview
    setChats((prev) => {
      const idx = prev.findIndex((c) => c.id === activeChatId);

      if (idx === -1) return prev;

      const updated = {
        ...prev[idx],
        lastMessage: localMessage,
        updatedAt: localMessage.createdAt,
      };

      return [
        updated,
        ...prev.filter((c) => c.id !== activeChatId),
      ];
    });
  }

 
  async function handleDeleteDirectChat() {
    if (!activeChat || !window.confirm('Delete this chat?')) return
    const res = await deleteChatRemote(activeChat.id)
    if (!res.error) {
      setChats((prev) => prev.filter((c) => c.id !== activeChat.id))
      setActiveChatId(null)
      setMobileShowThread(false)
    }
  }

  useEffect(() => {
    const s = connectSocket();

    const handleOnlineUsers = (users) => {


      const onlineSet = new Set(
        users.map((id) => id.toString())
      );

      setOnlineUsers(onlineSet);

      setChats((prevChats) =>
        prevChats.map((chat) => ({
          ...chat,
          isOnline: chat.members?.some((member) =>
            onlineSet.has(member.id.toString())
          ) || false,
        }))
      );
    };

    s.on(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);

    return () => {
      s.off(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
    };
  }, []);



  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-bg-soft grid place-items-center text-3xl mb-4">💬</div>
        <h2 className="font-display font-bold text-xl text-ink mb-2">Login to chat</h2>
        <p className="text-sm text-ink-soft mb-6">Login to add friends, start conversations and create groups.</p>
        <LoginRequiredModal open onClose={() => { }} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex border-x border-border">
      <aside className={`${mobileShowThread ? 'hidden' : 'flex'} sm:flex w-full sm:w-80 shrink-0 border-r border-border flex-col`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display font-bold text-xl text-ink">Chats</h1>
            <button
              onClick={requireLogin(() => setCreateGroupOpen(true))}
              className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover"
            >
              + Group
            </button>
          </div>
          <div className="flex gap-1 bg-bg-soft rounded-2xl p-1">
            {[
              ['chats', 'Chats'],
              ['requests', `Requests${pending.length ? ` (${pending.length})` : ''}`],
              ['find', 'Find people'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 px-2 py-1.5 rounded-xl text-xs font-medium transition-colors ${tab === key ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'chats' && (
          <>
            <div className="px-4 pt-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats…"
                className="w-full px-4 py-2 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredChats.length === 0 && (
                <p className="text-center text-sm text-ink-soft py-10 px-4">
                  No chats yet — add friends and start a conversation, or create a group.
                </p>
              )}
              {filteredChats.map((c) => {
                const unreadCount =
                  newMessagesAlert.find(
                    (item) => item.communityId === c.id
                  )?.count || 0;

                return (
                  <button
                    key={c.id}
                    onClick={() => selectChat(c.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-colors ${activeChatId === c.id
                      ? "bg-accent-soft/15"
                      : "hover:bg-bg-soft"
                      }`}
                  >
                    <Avatar
                      name={c.name}
                      isOnline={c.isOnline}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink truncate">
                        {c.isGroup && "# "}
                        {c.name}
                      </p>

                      <p className="text-xs text-ink-soft truncate">
                        {c.lastMessage
                          ? c.lastMessage.content || "📎 Attachment"
                          : c.isGroup
                            ? `${c.memberCount} members`
                            : "Say hi 👋"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {c.lastMessage && (
                        <span className="text-[11px] text-ink-soft/70">
                          {fmtTime(c.lastMessage.createdAt)}
                        </span>
                      )}

                      {unreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </>
        )}

        {tab === 'requests' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div>
              <p className="text-xs font-semibold text-ink-soft mb-2 px-1">Incoming</p>
              {pending.length === 0 && <p className="text-xs text-ink-soft px-1">No pending requests.</p>}
              <div className="space-y-1.5">
                {pending.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 p-2 rounded-2xl hover:bg-bg-soft">
                    <Avatar name={r.fullName || r.username} size="w-9 h-9" textSize="text-xs" />
                    <span className="flex-1 text-sm text-ink truncate">{r.fullName || r.username}</span>
                    <button onClick={() => handleAccept(r.id)} className="px-2 py-1 rounded-lg bg-accent text-white text-[11px] font-semibold hover:bg-accent-hover">
                      Accept
                    </button>
                    <button onClick={() => handleReject(r.id)} className="px-2 py-1 rounded-lg border border-border text-[11px] text-ink-soft hover:bg-white">
                      Reject
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-soft mb-2 px-1">Your friends</p>
              {friends.length === 0 && <p className="text-xs text-ink-soft px-1">No friends yet — find people and send a request.</p>}
              <div className="space-y-1.5">
                {friends.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 p-2 rounded-2xl hover:bg-bg-soft">
                    <Avatar name={f.username} size="w-9 h-9" textSize="text-xs" />
                    <span className="flex-1 text-sm text-ink truncate">{f.username}</span>
                    <button onClick={() => selectChat(f.chatId)} className="px-2 py-1 rounded-lg bg-accent text-white text-[11px] font-semibold hover:bg-accent-hover">
                      Message
                    </button>
                    <button onClick={() => handleRemoveFriend(f.id, f.chatId)} className="px-2 py-1 rounded-lg border border-border text-[11px] text-danger hover:bg-white">
                      Delete chat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'find' && (
          <div className="flex-1 overflow-y-auto p-3">
            <form onSubmit={runFindSearch} className="flex gap-2 mb-3">
              <input
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                placeholder="Search by username…"
                className="flex-1 px-4 py-2 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
              <button type="submit" className="px-3 py-2 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover">
                Search
              </button>
            </form>
            {findLoading && <p className="text-sm text-ink-soft text-center py-6">Searching…</p>}
            {!findLoading && findQuery && findResults.length === 0 && <p className="text-sm text-ink-soft text-center py-6">No users found.</p>}
            <div className="space-y-1.5">
              {findResults.map((u) => (
                <div key={u.username} className="flex items-center gap-2 p-2 rounded-2xl hover:bg-bg-soft">
                  <Avatar name={u.fullName || u.username} size="w-9 h-9" textSize="text-xs" />
                  <span className="flex-1 text-sm text-ink truncate">{u.fullName || u.username}</span>
                  <button
                    onClick={() => handleSendRequest(u.username)}
                    disabled={findSending[u.username]}
                    className="px-2 py-1 rounded-lg bg-accent text-white text-[11px] font-semibold hover:bg-accent-hover disabled:opacity-60"
                  >
                    {findSending[u.username] ? 'Sending…' : 'Add friend'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <section className={`${mobileShowThread ? 'flex' : 'hidden'} sm:flex flex-1 flex-col min-w-0`}>
        {activeChat ? (
          <>
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-border">
              <button onClick={() => setMobileShowThread(false)} className="sm:hidden text-ink-soft">
                ←
              </button>
              <Avatar name={activeChat.name} size="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-ink truncate">
                  {activeChat.isGroup && '# '}
                  {activeChat.name}
                </p>
                <p className="text-xs text-ink-soft">{activeChat.isGroup ? `${activeChat.memberCount} members` : 'Direct message'}</p>
              </div>
              {activeChat.isGroup ? (
                <button
                  onClick={() => setManageGroupOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-ink-soft hover:bg-bg-soft"
                >
                  Manage
                </button>
              ) : (
                <button
                  onClick={handleDeleteDirectChat}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-danger hover:bg-danger/5"
                >
                  Delete chat
                </button>
              )}
            </div>   {/* Chat Header */}

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-bg-soft/30"
            >
              {messages.length === 0 && !isTyping && (
                <p className="text-center text-sm text-ink-soft py-10">
                  No messages yet — say hi 👋
                </p>
              )}

              {messages.map((m) => {
                const isMe = m.senderId === user.remoteId;

                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-[65%] ${isMe ? "items-end" : "items-start"
                        } flex flex-col`}
                    >
                      {!isMe && activeChat.isGroup && (
                        <span className="text-[11px] font-medium text-accent mb-0.5 px-1">
                          {m.sender?.fullName || m.sender?.username}
                        </span>
                      )}

                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                          ? "bg-accent text-white rounded-br-md"
                          : "bg-white border border-border text-ink rounded-bl-md"
                          }`}
                      >
                        {m.content}
                      </div>

                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[11px] text-ink-soft/70">
                          {fmtTime(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator behaves like a new message */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 px-4 py-3 bg-white border border-border rounded-2xl rounded-bl-md">
                    <span className="w-2 h-2 bg-ink-soft rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-ink-soft rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-ink-soft rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>
            {showAttach && (
              <div className="px-4 sm:px-5 pt-2">
                <input
                  value={attachUrl}
                  onChange={(e) => setAttachUrl(e.target.value)}
                  placeholder="Paste an image URL to attach…"
                  className="w-full px-4 py-2 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
              </div>
            )}
            <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 sm:px-5 py-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAttach((v) => !v)}
                className="w-10 h-10 rounded-2xl border border-border grid place-items-center text-ink-soft hover:bg-bg-soft shrink-0"
                title="Attach an image URL"
              >
                📎
              </button>
              <input
                value={draft}
                onChange={handleDraftChange}
                placeholder={`Message ${activeChat.isGroup ? '#' + activeChat.name : activeChat.name}…`}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-border text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-accent-soft"
              />
              <button
                type="submit"
                disabled={!draft.trim() && !attachUrl.trim()}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-soft disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 grid place-items-center text-ink-soft text-sm text-center px-6">
            Select a conversation, or find people to start chatting.
          </div>
        )}
      </section>
      {/* {console.log(activeChat)} */}
      {createGroupOpen && (
        <CreateGroupModal
          friends={friends}
          initialSelectedId={pendingGroupWithId}
          currentUserId={user.remoteId}
          onClose={() => {
            setCreateGroupOpen(false)
            setPendingGroupWithId(null)
          }}
          onCreated={(chat) => {
            setCreateGroupOpen(false)
            setPendingGroupWithId(null)
            setChats((cs) => [{ ...chat }, ...cs])
            selectChat(chat.id)
            setTab('chats')
          }}
        />
      )}

      {manageGroupOpen && activeChat && (
        <ManageGroupModal
          chat={activeChat}
          friends={friends}
          onClose={() => setManageGroupOpen(false)}
          onUpdated={(chat) => {
            setChats((cs) => cs.map((c) => (c.id === chat.id ? { ...c, ...chat } : c)))
          }}
          onDeleted={() => {
            setManageGroupOpen(false)
            setChats((cs) => cs.filter((c) => c.id !== activeChat.id))
            setActiveChatId(null)
            setMobileShowThread(false)
          }}
          onLeave={()=>{
              setChats((prev) => prev.filter((c) => c.id !== activeChat.id))
      setActiveChatId(null)
      setMobileShowThread(false)
          }}

        />
      )}

      <LoginRequiredModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  )
}

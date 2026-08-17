function GroupDetails({ community, onlineUsers, currentUserId }) {
  if (!community) return null;

  const admin = community.members.find(
    (member) => member.userId === community.adminId
  );

  return (
    <div className="h-full flex flex-col bg-bg-soft/30">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex flex-col items-center text-center">
          <Avatar
            name={community.name}
            size="w-20 h-20"
            textSize="text-2xl"
          />

          <h2 className="mt-3 font-bold text-lg text-ink">
            {community.name}
          </h2>

          <p className="text-sm text-ink-soft mt-1">
            {community.members.length} members
          </p>

          {community.description && (
            <p className="text-sm text-ink-soft mt-3 max-w-md">
              {community.description}
            </p>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-ink">
            Members
          </h3>

          <span className="text-xs text-ink-soft">
            {community.members.length}
          </span>
        </div>

        <div className="space-y-1">
          {community.members.map((member) => {
            const user = member.user;

            const isOnline = onlineUsers?.has(
              user.id.toString()
            );

            const isAdmin =
              member.userId === community.adminId;

            return (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-soft transition-colors"
              >
                <Avatar
                  name={user.fullName || user.username}
                  isOnline={isOnline}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-ink truncate">
                      {user.fullName || user.username}
                    </p>

                    {user.id === currentUserId && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent-soft/20 text-accent font-medium">
                        You
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-ink-soft truncate">
                    @{user.username}
                  </p>
                </div>

                {isAdmin && (
                  <span className="text-[10px] px-2 py-1 rounded-md bg-accent-soft/20 text-accent font-semibold">
                    Admin
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
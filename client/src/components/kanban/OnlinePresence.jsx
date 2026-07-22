const OnlinePresence = ({ members = [] }) => {
  if (members.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-1.5">
        {members.slice(0, 4).map((m) => (
          <div
            key={m.user._id}
            title={`${m.user.name} is viewing`}
            className="relative w-6 h-6 rounded-full bg-violet-600 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          >
            {m.user.avatar
              ? <img src={m.user.avatar} alt={m.user.name} className="w-full h-full rounded-full object-cover" />
              : m.user.name?.[0]?.toUpperCase()
            }
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-gray-900 rounded-full" />
          </div>
        ))}
        {members.length > 4 && (
          <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-gray-300 text-xs font-semibold">
            +{members.length - 4}
          </div>
        )}
      </div>
      <span className="text-gray-500 text-xs hidden md:block">
        {members.length === 1 ? "1 other viewing" : `${members.length} others viewing`}
      </span>
    </div>
  );
};

export default OnlinePresence;
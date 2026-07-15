import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { UserPlus, Trash2, ShieldCheck } from "lucide-react";
import {
  useGetMembers,
  useInviteMember,
  useRemoveMember,
  useUpdateMemberRole,
} from "../hooks/useWorkspace.js";
import useAuthStore from "../store/authStore.js";
import { timeAgo } from "../utils/formatDate.js";
import { ROLE_COLORS } from "../utils/constants.js";

const ROLE_OPTIONS = ["admin", "member", "viewer"];

const MembersPage = () => {
  const { workspaceId } = useParams();
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const { data: members = [], isLoading } = useGetMembers(workspaceId);
  const { mutate: invite, isPending: inviting } = useInviteMember(workspaceId);
  const { mutate: removeMember, isPending: removing } = useRemoveMember(workspaceId);
  const { mutate: updateRole } = useUpdateMemberRole(workspaceId);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    invite(
      { email: email.trim(), role: inviteRole },
      { onSuccess: () => setEmail("") }
    );
  };

  const handleRoleChange = (member, newRole) => {
    if (newRole === member.role) return; // No change
    if (newRole === "admin") {
      if (!window.confirm(`Promote ${member.user?.name} to admin? Admins can manage members and projects.`)) return;
    }
    updateRole({ userId: member.user._id, role: newRole });
  };

  const handleRemove = (member) => {
    const isSelf = member.user?._id === user?._id;
    const message = isSelf
      ? "Leave this workspace? You will lose access immediately."
      : `Remove ${member.user?.name} from this workspace?`;
    if (!window.confirm(message)) return;
    removeMember(member.user._id);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-white mb-1">Members</h1>
        <p className="text-gray-400 text-sm">
          {members.length} member{members.length !== 1 ? "s" : ""} in this workspace
        </p>
      </motion.div>

      {/* Invite form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6"
      >
        <h2 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
          <UserPlus size={15} className="text-violet-400" />
          Invite a member
        </h2>
        <form onSubmit={handleInvite} className="flex gap-2 flex-wrap sm:flex-nowrap">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition flex-shrink-0"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={inviting || !email.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex-shrink-0"
          >
            {inviting ? "Inviting..." : "Invite"}
          </button>
        </form>
      </motion.div>

      {/* Members list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
      >
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="p-10 text-center">
            <ShieldCheck size={28} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No members yet. Invite your team above.</p>
          </div>
        ) : (
          <ul>
            {members.map((member, i) => {
              const isSelf = member.user?._id === user?._id;
              return (
                <motion.li
                  key={member._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-5 py-4 border-b border-gray-800 last:border-0 gap-4"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 text-sm font-semibold flex-shrink-0">
                      {member.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium flex items-center gap-1.5">
                        <span className="truncate">{member.user?.name}</span>
                        {isSelf && (
                          <span className="text-xs text-gray-500 flex-shrink-0">(you)</span>
                        )}
                      </p>
                      <p className="text-gray-500 text-xs truncate">{member.user?.email}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-gray-600 text-xs hidden md:block">
                      {timeAgo(member.createdAt)}
                    </span>

                    {/* Role selector */}
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member, e.target.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border border-transparent focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer font-medium transition-colors ${ROLE_COLORS[member.role]}`}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r} className="bg-gray-800 text-white">
                          {r}
                        </option>
                      ))}
                    </select>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(member)}
                      disabled={removing}
                      title={isSelf ? "Leave workspace" : "Remove member"}
                      className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default MembersPage;
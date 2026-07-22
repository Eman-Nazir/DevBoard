import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";
import { timeAgo } from "../../utils/formatDate.js";
import { getDotColor, describeActivity } from "../../utils/activityFormatters.js";
import Section from "../ui/Section.jsx";

const ActivityLogSection = ({ workspaceId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["workspace", "activity", workspaceId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/workspaces/${workspaceId}/activity`);
      return res.data.data;
    },
    enabled: !!workspaceId,
    staleTime: 30 * 1000,
  });

  const logs = data?.logs || [];

  return (
    <Section title="Activity log" description="Recent actions taken in this workspace">
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <History size={22} className="text-gray-700 mb-2" />
          <p className="text-gray-600 text-sm">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log._id} className="flex items-start gap-2.5 sm:gap-3">
              <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${getDotColor(log.action)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm break-words">{describeActivity(log)}</p>
                <p className="text-gray-600 text-xs mt-0.5">{timeAgo(log.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

export default ActivityLogSection;
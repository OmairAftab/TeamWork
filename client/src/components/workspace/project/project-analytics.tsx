import AnalyticsCard from "../common/analytics-card";
import { useParams } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getProjectAnalyticsQueryFn } from "@/lib/api";

const ProjectAnalytics = () => {
  const param = useParams();
  const projectId = param.projectId as string;
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["projectAnalytics", workspaceId, projectId],
    queryFn: () => getProjectAnalyticsQueryFn({ workspaceId, projectId }),
    enabled: !!workspaceId && !!projectId,
  });

  const analytics = data?.analytics;

  const analyticsList = [
    {
      id: "total-task",
      title: "Total Task",
      value: analytics?.totalTasks ?? 0,
    },
    {
      id: "overdue-task",
      title: "Overdue Task",
      value: analytics?.overdueTasks ?? 0,
    },
    {
      id: "completed-task",
      title: "Completed Task",
      value: analytics?.completedTasks ?? 0,
    },
  ];

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {analyticsList?.map((v) => (
        <AnalyticsCard
          isLoading={isLoading}
          title={v.title}
          value={v.value}
          key={v.id}
        />
      ))}
    </div>
  );
};

export default ProjectAnalytics;

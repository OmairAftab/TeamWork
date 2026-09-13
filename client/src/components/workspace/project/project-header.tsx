import { useParams } from "react-router-dom";
import CreateTaskDialog from "../task/create-task-dialog";
import EditProjectDialog from "./edit-project-dialog";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getProjectByIdQueryFn } from "@/lib/api";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import PermissionsGuard from "@/components/resuable/permission-guard";

const ProjectHeader = () => {
  const param = useParams();
  const projectId = param.projectId as string;
  const workspaceId = useWorkspaceId();
  const { hasPermission } = useAuthContext();

  const canEditProject = hasPermission(Permissions.EDIT_PROJECT);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", workspaceId, projectId],
    queryFn: () => getProjectByIdQueryFn({ workspaceId, projectId }),
    enabled: !!workspaceId && !!projectId,
  });

  const project = data?.project;

  const renderContent = () => {
    if (isLoading) return <span className="text-muted-foreground text-sm">Loading project...</span>;
    if (isError || !project) return <span className="text-destructive text-sm">Project not found</span>;
    return (
      <>
        <span>{project.emoji || "📊"}</span>
        <span>{project.name}</span>
      </>
    );
  };

  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">
          {renderContent()}
        </h2>
        {project && canEditProject && (
          <PermissionsGuard requiredPermission={Permissions.EDIT_PROJECT}>
            <EditProjectDialog project={project} />
          </PermissionsGuard>
        )}
      </div>
      <CreateTaskDialog projectId={projectId} />
    </div>
  );
};

export default ProjectHeader;

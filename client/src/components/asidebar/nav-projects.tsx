import { ArrowRight, Folder, Loader, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import { ConfirmDialog } from "../resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMutationFn, getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { ProjectType } from "@/types/api.type";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";

export function NavProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const queryClient = useQueryClient();

  const { onOpen } = useCreateProjectDialog();
  const { context, open, onOpenDialog, onCloseDialog } = useConfirmDialog();
  const workspaceId = useWorkspaceId();
  const { isMobile } = useSidebar();
  const { hasPermission } = useAuthContext();

  const canCreateProject = hasPermission(Permissions.CREATE_PROJECT);
  const canDeleteProject = hasPermission(Permissions.DELETE_PROJECT);

  const { data, isLoading } = useQuery({
    queryKey: ["workspaceProjects", workspaceId],
    queryFn: () => getProjectsInWorkspaceQueryFn({ workspaceId, pageSize: 50 }),
    enabled: !!workspaceId,
  });

  const projects = data?.projects || [];

  const { mutate: deleteProject, isPending: isDeleting } = useMutation({
    mutationFn: deleteProjectMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceProjects", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaceTasks", workspaceId] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      onCloseDialog();
      if (pathname.includes(`/project/${context?._id}`)) {
        navigate(`/workspace/${workspaceId}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleConfirm = () => {
    if (!context?._id || !workspaceId || isDeleting) return;
    deleteProject({
      workspaceId,
      projectId: context._id,
    });
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="w-full justify-between pr-0">
          <span>Projects</span>
          {canCreateProject && (
            <button
              onClick={onOpen}
              type="button"
              className="flex size-5 items-center justify-center rounded-full border"
            >
              <Plus className="size-3.5" />
            </button>
          )}
        </SidebarGroupLabel>
        <SidebarMenu className="max-h-[320px] scrollbar overflow-y-auto pb-2">
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin place-self-center my-4" />
          ) : projects.length === 0 ? (
            <div className="pl-3 py-2">
              <p className="text-xs text-muted-foreground">
                There are no projects in this Workspace yet.
              </p>
              {canCreateProject && (
                <Button
                  variant="link"
                  type="button"
                  className="h-0 p-0 text-[13px] underline font-semibold mt-4"
                  onClick={onOpen}
                >
                  Create a project
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              )}
            </div>
          ) : (
            projects.map((item: ProjectType) => {
              const projectUrl = `/workspace/${workspaceId}/project/${item._id}`;

              return (
                <SidebarMenuItem key={item._id}>
                  <SidebarMenuButton asChild isActive={projectUrl === pathname}>
                    <Link to={projectUrl}>
                      <span>{item.emoji || "📊"}</span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={() => navigate(`${projectUrl}`)}
                      >
                        <Folder className="text-muted-foreground mr-2 size-4" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      {canDeleteProject && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => onOpenDialog(item)}
                          >
                            <Trash2 className="text-destructive mr-2 size-4" />
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarGroup>

      <ConfirmDialog
        isOpen={open}
        isLoading={isDeleting}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete ${
          context?.name || "this project"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

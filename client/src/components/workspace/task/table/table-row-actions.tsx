import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { TaskType } from "@/types/api.type";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import EditTaskDialog from "../edit-task-dialog";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";

interface DataTableRowActionsProps {
  row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const { user, hasPermission } = useAuthContext();

  const isFullAdmin =
    hasPermission(Permissions.CREATE_PROJECT) ||
    hasPermission(Permissions.DELETE_TASK) ||
    hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS);

  const isAssignedToMe =
    !!user?._id && row.original.assignedTo?._id === user._id;

  // Members can only edit tasks assigned to them. Admins/Owners can edit any task.
  const canEditTask =
    isFullAdmin || (hasPermission(Permissions.EDIT_TASK) && isAssignedToMe);

  // Only Admins/Owners can delete tasks
  const canDeleteTask = hasPermission(Permissions.DELETE_TASK);

  const taskId = row.original._id as string;
  const taskCode = row.original.taskCode;

  const { mutate: deleteTask, isPending: isDeleting } = useMutation({
    mutationFn: deleteTaskMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceTasks", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaceAnalytics", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["projectAnalytics"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      setOpenDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const handleConfirm = () => {
    if (!taskId || !workspaceId || isDeleting) return;
    deleteTask({
      taskId,
      workspaceId,
    });
  };

  if (!canEditTask && !canDeleteTask) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {canEditTask && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenEditDialog(true)}
            >
              Edit Task
            </DropdownMenuItem>
          )}
          {canEditTask && canDeleteTask && <DropdownMenuSeparator />}
          {canDeleteTask && (
            <DropdownMenuItem
              className="!text-destructive cursor-pointer"
              onClick={() => setOpenDialog(true)}
            >
              Delete Task
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTaskDialog
        task={row.original}
        isOpen={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
      />

      <ConfirmDialog
        isOpen={openDeleteDialog}
        isLoading={isDeleting}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete ${taskCode || "this task"}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspaceMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PermissionsGuard from "@/components/resuable/permission-guard";

const DeleteWorkspaceCard = () => {
  const { workspace } = useAuthContext();
  const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkspaceMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast({
        title: "Success",
        description: "Workspace deleted successfully",
      });
      onCloseDialog();
      if (data?.currentWorkspace) {
        navigate(`/workspace/${data.currentWorkspace}`);
      } else {
        navigate("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete workspace",
        variant: "destructive",
      });
    },
  });

  const handleConfirm = () => {
    if (!workspace?._id || isPending) return;
    mutate(workspace._id);
  };

  return (
    <PermissionsGuard requiredPermission={Permissions.DELETE_WORKSPACE}>
      <div className="w-full">
        <div className="mb-5 border-b pb-2">
          <h1
            className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left text-destructive"
          >
            Delete Workspace
          </h1>
        </div>

        <div className="flex flex-col items-start justify-between py-0">
          <div className="flex-1 mb-2">
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is a permanent action and cannot be undone.
              Once you delete a workspace, all its associated data, including
              projects, tasks, and member roles, will be permanently removed.
              Please proceed with caution and ensure this action is intentional.
            </p>
          </div>
          <Button
            className="shrink-0 flex place-self-end h-[40px]"
            variant="destructive"
            onClick={onOpenDialog}
          >
            Delete Workspace
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={open}
        isLoading={isPending}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={`Delete ${workspace?.name || "Workspace"}`}
        description={`Are you sure you want to delete ${workspace?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </PermissionsGuard>
  );
};

export default DeleteWorkspaceCard;

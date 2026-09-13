import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "./create-task-form";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";

const CreateTaskDialog = (props: { projectId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasPermission } = useAuthContext();

  // Task creation is restricted to workspace Owner and Admin roles (not standard members)
  const canCreateTask =
    hasPermission(Permissions.CREATE_PROJECT) ||
    hasPermission(Permissions.DELETE_TASK) ||
    hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS);

  const onClose = () => {
    setIsOpen(false);
  };

  if (!canCreateTask) {
    return null;
  }

  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0 overflow-y-auto max-h-[90vh]">
          <CreateTaskForm projectId={props.projectId} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTaskDialog;

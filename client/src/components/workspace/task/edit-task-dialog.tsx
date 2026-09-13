import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditTaskForm from "./edit-task-form";
import { TaskType } from "@/types/api.type";

const EditTaskDialog = (props: {
  task: TaskType;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { task, isOpen, onClose } = props;

  return (
    <Dialog modal={true} open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0 overflow-y-auto max-h-[90vh]">
        <EditTaskForm task={task} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;

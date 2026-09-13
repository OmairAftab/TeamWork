import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  TaskPriorityEnum,
  TaskStatusEnum,
} from "@/constant";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformStatusEnum,
} from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getAllTasksQueryFn } from "@/lib/api";
import { format } from "date-fns";
import { Loader } from "lucide-react";

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["workspaceTasks", workspaceId],
    queryFn: () => getAllTasksQueryFn({ workspaceId, pageSize: 5 }),
    enabled: !!workspaceId,
  });

  const tasks = data?.tasks || [];

  if (isLoading) {
    return <Loader className="w-6 h-6 animate-spin place-self-center flex my-6" />;
  }

  if (tasks.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No tasks found in this workspace yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <ul role="list" className="divide-y divide-gray-200">
        {tasks.map((task) => {
          const assigneeName = task.assignedTo?.name || "Unassigned";
          const initials = getAvatarFallbackText(assigneeName);
          const avatarColor = getAvatarColor(assigneeName);
          const dueDateText = task.dueDate ? format(new Date(task.dueDate), "PPP") : "No due date";

          return (
            <li
              key={task._id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              {/* Task Info */}
              <div className="flex flex-col space-y-1 flex-grow">
                <span className="text-sm text-gray-600 font-medium">
                  {task.taskCode}
                </span>
                <p className="text-md font-semibold text-gray-800 truncate">
                  {task.title}
                </p>
                <span className="text-sm text-gray-500">
                  Due: {dueDateText}
                </span>
              </div>

              {/* Task Status */}
              <div className="text-sm font-medium">
                <Badge
                  variant={TaskStatusEnum[task.status]}
                  className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                >
                  <span>{transformStatusEnum(task.status)}</span>
                </Badge>
              </div>

              {/* Task Priority */}
              <div className="text-sm ml-2">
                <Badge
                  variant={TaskPriorityEnum[task.priority]}
                  className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                >
                  <span>{transformStatusEnum(task.priority)}</span>
                </Badge>
              </div>

              {/* Assignee */}
              <div className="flex items-center space-x-2 ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={task.assignedTo?.profilePicture || ""}
                    alt={assigneeName}
                  />
                  <AvatarFallback className={avatarColor}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentTasks;

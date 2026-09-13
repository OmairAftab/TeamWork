import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Info, Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { transformOptions } from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Permissions, TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllMembersInWorkspaceQueryFn,
  updateTaskMutationFn,
} from "@/lib/api";
import { TaskType } from "@/types/api.type";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useAuthContext } from "@/context/auth-provider";

export default function EditTaskForm(props: {
  task: TaskType;
  onClose: () => void;
}) {
  const { task, onClose } = props;
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuthContext();

  // Full admin check: Owners/Admins have CREATE_PROJECT / DELETE_TASK permissions
  const isFullAdmin =
    hasPermission(Permissions.CREATE_PROJECT) ||
    hasPermission(Permissions.DELETE_TASK) ||
    hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS);

  const projectId = task.project?._id || "";

  // Fetch members in workspace for assignedTo selection
  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getAllMembersInWorkspaceQueryFn(workspaceId),
    enabled: !!workspaceId && isFullAdmin,
  });

  const members = membersData?.members || [];

  const formSchema = z.object({
    title: z.string().trim().min(1, {
      message: "Title is required",
    }),
    description: z.string().trim(),
    status: z.enum(
      Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum],
      {
        required_error: "Status is required",
      }
    ),
    priority: z.enum(
      Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum],
      {
        required_error: "Priority is required",
      }
    ),
    assignedTo: z.string().trim().optional(),
    dueDate: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title || "",
      description: task.description || "",
      status: task.status || TaskStatusEnum.TODO,
      priority: task.priority || TaskPriorityEnum.MEDIUM,
      assignedTo: task.assignedTo?._id || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title || "",
        description: task.description || "",
        status: task.status || TaskStatusEnum.TODO,
        priority: task.priority || TaskPriorityEnum.MEDIUM,
        assignedTo: task.assignedTo?._id || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    }
  }, [task, form]);

  const taskStatusList = Object.values(TaskStatusEnum);
  const taskPriorityList = Object.values(TaskPriorityEnum);

  const statusOptions = transformOptions(taskStatusList);
  const priorityOptions = transformOptions(taskPriorityList);

  const { mutate, isPending } = useMutation({
    mutationFn: updateTaskMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceTasks", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaceAnalytics", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["projectAnalytics"] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!workspaceId || !task._id || isPending) return;

    mutate({
      taskId: task._id,
      projectId,
      workspaceId,
      data: {
        title: isFullAdmin ? values.title : task.title,
        description: isFullAdmin ? values.description : task.description,
        status: values.status,
        priority: isFullAdmin ? values.priority : task.priority,
        assignedTo: isFullAdmin ? values.assignedTo || null : task.assignedTo?._id || null,
        dueDate: isFullAdmin
          ? values.dueDate
            ? values.dueDate.toISOString()
            : undefined
          : task.dueDate
          ? new Date(task.dueDate).toISOString()
          : undefined,
      },
    });
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Edit Task
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            {isFullAdmin
              ? "Update task details, status, priority, or assignee"
              : "Update status for your assigned task"}
          </p>
        </div>

        {!isFullAdmin && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2 text-xs text-blue-700">
            <Info className="w-4 h-4 shrink-0" />
            <span>As a team member, you can update the status of tasks assigned to you.</span>
          </div>
        )}

        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Task title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Website Redesign"
                        className="!h-[48px]"
                        disabled={!isFullAdmin}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Task description
                      <span className="text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="Description"
                        disabled={!isFullAdmin}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Members AssigneeTo */}
            <div>
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={!isFullAdmin}
                    >
                      <FormControl>
                        <SelectTrigger disabled={!isFullAdmin}>
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isMembersLoading && (
                          <div className="my-2 flex justify-center">
                            <Loader className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                        {members.map((member) => (
                          <SelectItem
                            key={member.userId?._id}
                            value={member.userId?._id}
                          >
                            {member.userId?.name} ({member.userId?.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Due Date */}
            <div className="!mt-2">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild disabled={!isFullAdmin}>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!isFullAdmin}
                            className={cn(
                              "w-full flex-1 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status (ALWAYS EDITABLE FOR MEMBERS AND ADMINS) */}
            <div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-primary/50">
                          <SelectValue
                            className="!text-muted-foreground !capitalize"
                            placeholder="Select a status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions?.map((status) => (
                          <SelectItem
                            className="!capitalize"
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Priority */}
            <div>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isFullAdmin}
                    >
                      <FormControl>
                        <SelectTrigger disabled={!isFullAdmin}>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions?.map((priority) => (
                          <SelectItem
                            className="!capitalize"
                            key={priority.value}
                            value={priority.value}
                          >
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="flex place-self-end h-[40px] text-white font-semibold"
              disabled={isPending}
              type="submit"
            >
              {isPending && <Loader className="animate-spin mr-2 w-4 h-4" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

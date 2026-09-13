import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editWorkspaceMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export default function EditWorkspaceForm() {
  const { workspace, hasPermission } = useAuthContext();
  const queryClient = useQueryClient();

  const canEditWorkspace = hasPermission(Permissions.EDIT_WORKSPACE);

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Workspace name is required",
    }),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workspace?.name || "",
      description: workspace?.description || "",
    },
  });

  useEffect(() => {
    if (workspace) {
      form.reset({
        name: workspace.name || "",
        description: workspace.description || "",
      });
    }
  }, [workspace, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: editWorkspaceMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspace?._id] });
      queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
      toast({
        title: "Success",
        description: "Workspace updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update workspace",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!workspace?._id || isPending || !canEditWorkspace) return;
    mutate({
      workspaceId: workspace._id,
      data: values,
    });
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 border-b pb-2">
          <h1
            className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
          >
            Edit Workspace
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Workspace name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Taco's Co."
                        className="!h-[48px] disabled:opacity-90 disabled:pointer-events-none"
                        disabled={!canEditWorkspace}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Workspace description
                      <span className="text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        disabled={!canEditWorkspace}
                        className="disabled:opacity-90 disabled:pointer-events-none"
                        placeholder="Our team organizes marketing projects and tasks here."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {canEditWorkspace && (
              <Button
                className="flex place-self-end h-[40px] text-white font-semibold"
                disabled={isPending}
                type="submit"
              >
                {isPending && <Loader className="animate-spin mr-2 w-4 h-4" />}
                Update Workspace
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

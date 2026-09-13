import { ChevronDown, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeWorkspaceMemberRoleMutationFn,
  getAllMembersInWorkspaceQueryFn,
} from "@/lib/api";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const AllMembers = () => {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const { user: currentUser, hasPermission } = useAuthContext();

  const canChangeRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getAllMembersInWorkspaceQueryFn(workspaceId),
    enabled: !!workspaceId,
  });

  const members = data?.members || [];
  const roles = data?.roles || [];

  const { mutate: changeRole, isPending: isChangingRole } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceMembers", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      toast({
        title: "Success",
        description: "Member role changed successfully",
      });
      setOpenPopoverId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change member role",
        variant: "destructive",
      });
    },
  });

  const handleRoleChange = (memberId: string, roleId: string) => {
    if (isChangingRole || !workspaceId) return;
    changeRole({
      workspaceId,
      data: {
        memberId,
        roleId,
      },
    });
  };

  if (isLoading) {
    return <Loader className="w-8 h-8 animate-spin place-self-center flex my-6" />;
  }

  return (
    <div className="grid gap-6 pt-2">
      {members.map((member) => {
        const user = member.userId;
        const name = user?.name || "Unknown User";
        const email = user?.email || "";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        const isSelf = user?._id === currentUser?._id;
        const isOwnerRole = member.role?.name?.toUpperCase() === "OWNER";

        return (
          <div
            key={member._id}
            className="flex items-center justify-between space-x-4 p-2 rounded-lg border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture || ""} alt={name} />
                <AvatarFallback className={avatarColor}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {name} {isSelf && <span className="text-xs text-muted-foreground">(You)</span>}
                </p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {canChangeRole && !isOwnerRole && !isSelf ? (
                <Popover
                  open={openPopoverId === member._id}
                  onOpenChange={(open) => setOpenPopoverId(open ? member._id : null)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isChangingRole}
                      className="ml-auto min-w-24 capitalize"
                    >
                      {member.role?.name}{" "}
                      <ChevronDown className="text-muted-foreground ml-1 w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-56" align="end">
                    <Command>
                      <CommandInput placeholder="Select new role..." />
                      <CommandList>
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                          {roles
                            .filter((r) => r.name.toUpperCase() !== "OWNER")
                            .map((role) => (
                              <CommandItem
                                key={role._id}
                                onSelect={() => handleRoleChange(member._id, role._id)}
                                className="cursor-pointer flex flex-col items-start px-4 py-2"
                              >
                                <p className="font-medium capitalize">{role.name}</p>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="ml-auto min-w-24 capitalize disabled:opacity-90"
                >
                  {member.role?.name}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllMembers;

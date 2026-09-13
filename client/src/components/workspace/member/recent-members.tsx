import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getAllMembersInWorkspaceQueryFn } from "@/lib/api";
import { format } from "date-fns";
import { Loader } from "lucide-react";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getAllMembersInWorkspaceQueryFn(workspaceId),
    enabled: !!workspaceId,
  });

  const members = data?.members || [];

  if (isLoading) {
    return <Loader className="w-6 h-6 animate-spin place-self-center flex my-6" />;
  }

  if (members.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No members found in this workspace.
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-2">
      <ul role="list" className="space-y-3">
        {members.map((member) => {
          const user = member.userId;
          const name = user?.name || "Member";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          const joinedDate = member.joinedAt
            ? format(new Date(member.joinedAt), "PPP")
            : "Recently";

          return (
            <li
              key={member._id}
              role="listitem"
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-9 w-9 sm:flex">
                  <AvatarImage src={user?.profilePicture || ""} alt={name} />
                  <AvatarFallback className={avatarColor}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Member Details */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-500 capitalize">{member.role?.name}</p>
              </div>

              {/* Joined Date */}
              <div className="ml-auto text-sm text-gray-500 text-right">
                <p className="text-xs text-muted-foreground">Joined</p>
                <p>{joinedDate}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentMembers;

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { format } from "date-fns";
import { getAvatarFallbackText } from "@/lib/helper";
import { Loader } from "lucide-react";

const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["workspaceProjects", workspaceId],
    queryFn: () => getProjectsInWorkspaceQueryFn({ workspaceId, pageSize: 10 }),
    enabled: !!workspaceId,
  });

  const projects = data?.projects || [];

  if (isLoading) {
    return <Loader className="w-6 h-6 animate-spin place-self-center flex my-6" />;
  }

  if (projects.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No projects found in this workspace yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-2">
      <ul role="list" className="space-y-2">
        {projects.map((item) => {
          const creatorName = item.createdBy?.name || "Unknown";
          const initials = getAvatarFallbackText(creatorName);
          const date = item.createdAt
            ? format(new Date(item.createdAt), "PPP")
            : "";

          return (
            <li
              key={item._id}
              role="listitem"
              className="shadow-none cursor-pointer border-0 py-2 hover:bg-gray-50 transition-colors ease-in-out px-2 rounded-md"
            >
              <Link
                to={`/workspace/${workspaceId}/project/${item._id}`}
                className="grid gap-8 p-0"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl !leading-[1.4rem]">{item.emoji || "📊"}</div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{date}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-gray-500">Created by</span>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src={item.createdBy?.profilePicture || ""}
                        alt={creatorName}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentProjects;

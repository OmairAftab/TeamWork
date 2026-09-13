import { Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import useAuth from "@/hooks/api/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitedUserJoinWorkspaceMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const InviteUser = () => {
  const navigate = useNavigate();
  const param = useParams();
  const queryClient = useQueryClient();

  const inviteCode = param.inviteCode as string;

  const { data: authData, isLoading: isAuthLoading } = useAuth();
  const user = authData?.user;

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`
  );

  const { mutate: joinWorkspace, isPending: isJoining } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast({
        title: "Success",
        description: "Successfully joined the workspace!",
      });
      if (data?.workspaceId) {
        navigate(`/workspace/${data.workspaceId}`);
      } else {
        navigate("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join workspace",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode || isJoining) return;
    joinWorkspace(inviteCode);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          Team Work.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Hey there! You're invited to join a Team Work Workspace!
              </CardTitle>
              <CardDescription>
                {user
                  ? "Click below to join this workspace with your current account."
                  : "Looks like you need to be logged into your Team Work account to join this Workspace."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthLoading ? (
                <Loader className="!w-11 !h-11 animate-spin place-self-center flex my-6" />
              ) : (
                <div>
                  {user ? (
                    <div className="flex items-center justify-center my-3">
                      <form onSubmit={handleSubmit}>
                        <Button
                          type="submit"
                          disabled={isJoining}
                          className="!bg-green-500 hover:!bg-green-600 !text-white text-[18px] py-2 px-6 !h-auto flex items-center gap-2"
                        >
                          {isJoining && (
                            <Loader className="!w-5 !h-5 animate-spin" />
                          )}
                          Join the Workspace
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center gap-2 mt-4">
                      <Link
                        className="flex-1 text-base w-full"
                        to={`/sign-up?returnUrl=${returnUrl}`}
                      >
                        <Button className="w-full">Signup</Button>
                      </Link>
                      <Link
                        className="flex-1 text-base w-full"
                        to={`/?returnUrl=${returnUrl}`}
                      >
                        <Button variant="secondary" className="w-full border">
                          Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;

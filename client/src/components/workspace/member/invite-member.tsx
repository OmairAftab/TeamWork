import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "@/context/auth-provider";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";

const InviteMember = () => {
  const { workspace } = useAuthContext();
  const [copied, setCopied] = useState(false);

  const inviteUrl = workspace?.inviteCode
    ? `${window.location.origin}/invite/workspace/${workspace.inviteCode}/join`
    : "";

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopied(true);
        toast({
          title: "Copied",
          description: "Invite url copied to clipboard",
          variant: "success",
        });
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  return (
    <PermissionsGuard requiredPermission={Permissions.ADD_MEMBER}>
      <div className="flex flex-col pt-0.5 px-0 ">
        <h5 className="text-lg leading-[30px] font-semibold mb-1">
          Invite members to join you
        </h5>
        <p className="text-sm text-muted-foreground leading-tight">
          Anyone with an invite link can join this free Workspace. Share the link
          below with your team members.
        </p>

        <div className="flex py-3 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            disabled={true}
            className="disabled:opacity-100 disabled:pointer-events-none"
            value={inviteUrl}
            readOnly
          />
          <Button
            disabled={!inviteUrl}
            className="shrink-0"
            size="icon"
            onClick={handleCopy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
      </div>
    </PermissionsGuard>
  );
};

export default InviteMember;

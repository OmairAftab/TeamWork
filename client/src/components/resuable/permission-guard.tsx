import React from "react";
import { PermissionType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";

type PermissionsGuardProps = {
  requiredPermission: PermissionType;
  children: React.ReactNode;
  showMessage?: boolean;
  fallback?: React.ReactNode;
};

const PermissionsGuard: React.FC<PermissionsGuardProps> = ({
  requiredPermission,
  children,
  showMessage = false,
  fallback = null,
}) => {
  const { hasPermission } = useAuthContext();
  const hasAccess = hasPermission(requiredPermission);

  if (!hasAccess) {
    if (showMessage) {
      return (
        <div className="p-4 text-center text-sm text-red-500">
          You do not have permission to perform this action.
        </div>
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default PermissionsGuard;

import React from "react";
import { PermissionType } from "@/constant";
import PermissionsGuard from "@/components/resuable/permission-guard";

const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: PermissionType
) => {
  return function WithPermissionComponent(props: P) {
    return (
      <PermissionsGuard requiredPermission={requiredPermission}>
        <Component {...props} />
      </PermissionsGuard>
    );
  };
};

export default withPermission;

import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();  //Get the current URL .. For example, if the user is currently visiting:  .login then location.pathname will be "/login"
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  const _isAuthRoute = isAuthRoute(location.pathname);

  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />;  //If we're still checking whether the user is logged in, and they're trying to access a protected/dashboard route, show a loading skeleton.

  if (!user) return <Outlet />;

  return <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />;
};

export default AuthRoute;
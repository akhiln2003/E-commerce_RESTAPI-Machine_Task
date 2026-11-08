import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { useGetUser } from "@/hooks/useGetUser";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface AdminProtectedProps {
  children: ReactNode;
}

function AdminProtected({ children }: AdminProtectedProps) {
  const user = useGetUser();

  if (!user) {
    return <Navigate to={UserUrls.authenticate} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={UserUrls.home} replace />;
  }

  return children;
}

export default AdminProtected;

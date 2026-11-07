import { useDispatch } from "react-redux";
import { useGetUser } from "@/hooks/useGetUser";
import { addUser } from "@/redux/slices/userSlice";
import { NavbarUser } from "./ReusableNavbar";
import { showErrorToast, showSuccessToast } from "../ToastProvider/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useSignOutMutation } from "@/services/apis/AuthApis";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";

// Pass a role so an admin navbar never shows a customer's session (and vice versa)
export function useAuthUser(role?: string) {
  const dbUser = useGetUser();
  const dispatch = useDispatch();
  const [signOut] = useSignOutMutation();

  const isMatch = dbUser && (!role || dbUser.role === role);
  const user: NavbarUser | null = isMatch
    ? { id: dbUser.id, name: dbUser.name, email: dbUser.email }
    : null;

  const logout = async () => {
    try {
      const response: IAxiosResponse = await signOut();
      if (response && response.data) {
        dispatch(addUser(null));
        showSuccessToast({
          title: "Logged out successfully",
          description: response.data.message || "You have been logged out.",
        });
      } else {
        showErrorToast({
          title: "Logout failed!",
          description:
            getErrorMessage(response.error) ||
            "Unexpected response from server.",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);

      showErrorToast({
        title: "Logout failed!",
        description: getErrorMessage(error),
      });
    }
  };

  return { user, logout };
}

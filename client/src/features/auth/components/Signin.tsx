import { getErrorMessage } from "@/utils/errorHandler";
import { useSignInMutation } from "@/services/apis/AuthApis";
import type { SignInValues } from "../@types/SignInValues";
import { AuthForm } from "./Authform";
import { TextLink } from "./Textlink";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/ToastProvider/toast";
import { useNavigate } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/slices/userSlice";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";

interface SignInProps {
  onSwitch: () => void;
  onSubmit?: (values: SignInValues) => void;
}

export function SignIn({ onSwitch, onSubmit = () => {} }: SignInProps) {
  const [signIn] = useSignInMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  onSubmit = async (values: SignInValues) => {
    try {
      const { email, password } = values;

      const response = await signIn({
        email,
        password,
      });
      console.log("SignIn response:", response);

      const { user } = response.data;

      if (response.data && user) {
        showSuccessToast({
          title: "SignIn successful!",
          description: `${user.email} ${response.data.message}`,
        });

        dispatch(addUser(user));

        const navigateUrl =
          user.role === "admin" ? AdminUrls.profile : UserUrls.home;

        navigate(navigateUrl);
      } else if (response.error) {
        showErrorToast({
          title: "SignIn failed!",
          description: getErrorMessage(response.error),
        });
      }
    } catch (error: unknown) {
      console.log("Error during sign-in:", error);
      console.error("Signin error:", error);

      showErrorToast({
        title: "Signin failed!",
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <AuthForm<"email" | "password">
      title="Welcome back"
      subtitle="Sign in to continue"
      submitLabel="Sign In"
      onSubmit={onSubmit}
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "name@example.com",
          autoComplete: "email",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Required",
          autoComplete: "current-password",
        },
      ]}
      footer={
        <>
          New here? <TextLink onClick={onSwitch}>Create account</TextLink>
        </>
      }
    />
  );
}

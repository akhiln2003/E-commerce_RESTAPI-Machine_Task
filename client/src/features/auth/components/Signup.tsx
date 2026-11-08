import type { SignUpValues } from "../@types/SignUpValues";
import { AuthForm } from "./Authform";
import { TextLink } from "./Textlink";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/ToastProvider/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/slices/userSlice";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "@/services/apis/AuthApis";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";

interface SignUpProps {
  onSwitch: () => void;
  onSubmit?: (values: SignUpValues) => void;
}

export function SignUp({ onSwitch, onSubmit = () => {} }: SignUpProps) {
  const [signUp] = useSignUpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  onSubmit = async (values: SignUpValues) => {
    try {
      const { name, email, password } = values;

      const response: IAxiosResponse = await signUp({
        name,
        email,
        password,
      });
      const { user } = response.data;

      if (response.data && user) {
        showSuccessToast({
          title: "Signup successful!",
          description: user.email + " " + response.data.message,
        });
        dispatch(addUser(user));

        const navigateUrl =
          user.role === "admin" ? AdminUrls.profile : UserUrls.home;

        navigate(navigateUrl);
      } else if (response.error) {
        showErrorToast({
          title: "Signup failed!",
          description: getErrorMessage(response.error),
        });
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);

      showErrorToast({
        title: "Signup failed!",
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <AuthForm<"name" | "email" | "password">
      title="Create account"
      subtitle="It only takes a minute"
      submitLabel="Sign Up"
      onSubmit={onSubmit}
      fields={[
        {
          name: "name",
          label: "Name",
          placeholder: "Your full name",
          autoComplete: "name",
        },
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
          placeholder: "**********",
          autoComplete: "new-password",
        },
      ]}
      footer={
        <>
          Already have an account?{" "}
          <TextLink onClick={onSwitch}>Sign in</TextLink>
        </>
      }
    />
  );
}

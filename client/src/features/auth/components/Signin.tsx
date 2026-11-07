// import { getErrorMessage } from "@/utils/errorHandler";
import type { SignInValues } from "../@types/SignInValues";
import { AuthForm } from "./Authform";
import { TextLink } from "./Textlink";
// import { showErrorToast } from "@/components/ToastProvider/toast";
// import { Navigate } from "react-router-dom";
// import { UserUrls } from "@/@types/urlEnums/UserUrls";

interface SignInProps {
  onSwitch: () => void;
  onSubmit?: (values: SignInValues) => void;
}

export function SignIn({ onSwitch, onSubmit = () => {} }: SignInProps) {


  // onSubmit = async (values: SignUpValues) => {
  //   try {
  //     const { name, email, password } = values;

  //     const response = await signUp({
  //       name,
  //       email,
  //       password,
  //     });
  //     const { user } = response.data;

  //     if (response.data && user) {
  //       showSuccessToast({
  //         title: "Signup successful!",
  //         description: user.email + " " + response.data.message,
  //       });
  //       dispatch(addUser(user));

  //       Navigate(UserUrls.home);
  //     } else if (response.error) {
  //       showErrorToast({
  //         title: "Signup failed!",
  //         description: getErrorMessage(response.error),
  //       });
  //     }
  //   } catch (error: unknown) {
  //     console.error("Signup error:", error);

  //     showErrorToast({
  //       title: "Signup failed!",
  //       description: getErrorMessage(error),
  //     });
  //   }
  // };

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

import { useState } from "react";
import { TextLink } from "../components/Textlink";
import { User } from "../@types/User";
import { SignUp } from "../components/Signup";
import { SignIn } from "../components/Signin";


type Mode = "signin" | "signup";

export default function AuthPages() {
  const [mode, setMode] = useState<Mode>("signin");
  const [user, setUser] = useState<User | null>(null);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 p-6"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {user ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            You’re in{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mb-3 text-[15px] text-gray-500">{user.email}</p>
          <TextLink onClick={() => setUser(null)}>Sign out</TextLink>
        </div>
      ) : mode === "signin" ? (
        <SignIn onSwitch={() => setMode("signup")} onSubmit={setUser} />
      ) : (
        <SignUp onSwitch={() => setMode("signin")} onSubmit={setUser} />
      )}
    </div>
  );
}
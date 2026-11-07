import type { ComponentPropsWithoutRef } from "react";

export function TextLink({
  children,
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      {...rest}
      className="text-[15px] text-blue-500 hover:opacity-70"
    >
      {children}
    </button>
  );
}
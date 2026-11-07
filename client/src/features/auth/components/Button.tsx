import type { ComponentPropsWithoutRef } from "react";

export function Button({
  children,
  type = "button",
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      {...rest}
      className="h-[50px] w-full rounded-xl bg-blue-500 text-[17px] font-semibold text-white transition active:scale-[0.98] active:bg-blue-600 disabled:cursor-default disabled:opacity-40"
    >
      {children}
    </button>
  );
}
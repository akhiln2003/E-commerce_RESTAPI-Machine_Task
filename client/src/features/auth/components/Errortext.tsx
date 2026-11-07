import type { ReactNode } from "react";

export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mx-4 mt-2 text-[13px] text-red-500">{children}</p>;
}
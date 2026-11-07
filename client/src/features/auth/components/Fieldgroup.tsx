import type { ReactNode } from "react";

// iOS "inset grouped" block: one rounded card with hairline dividers
export function FieldGroup({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-xl bg-white">
      {children}
    </div>
  );
}
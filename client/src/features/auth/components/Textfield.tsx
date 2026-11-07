import { useState } from "react";
import type { HTMLInputTypeAttribute } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const [show, setShow] = useState<boolean>(false);
  const isPassword = type === "password";

  return (
    <label className="flex h-12 cursor-text items-center px-4">
      <span className="w-24 shrink-0 text-[17px] text-black">{label}</span>
      <input
        type={isPassword && show ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="min-w-0 flex-1 bg-transparent text-[17px] text-black placeholder-gray-400 outline-none"
      />
      {isPassword && (
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => !s)}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </label>
  );
}
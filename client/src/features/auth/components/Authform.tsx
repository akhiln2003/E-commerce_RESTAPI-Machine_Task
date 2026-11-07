import { useState } from "react";
import type { ReactNode } from "react";
import type { FieldName } from "../@types/FieldName";

import { Button } from "./Button";
import { FieldConfig } from "../@types/Fieldconfig";
import { AuthHeader } from "./Authheader";
import { FieldGroup } from "./Fieldgroup";
import { TextField } from "./Textfield";
import { ErrorText } from "./Errortext";

interface AuthFormProps<T extends FieldName> {
  title: string;
  subtitle: string;
  fields: FieldConfig<T>[];
  submitLabel: string;
  onSubmit: (values: Record<T, string>) => void;
  footer: ReactNode;
}

export function AuthForm<T extends FieldName>({
  title,
  subtitle,
  fields,
  submitLabel,
  onSubmit,
  footer,
}: AuthFormProps<T>) {
  const [values, setValues] = useState<Partial<Record<T, string>>>({});
  const [error, setError] = useState<string>("");

  const get = (key: FieldName): string =>
    (values as Partial<Record<FieldName, string>>)[key] ?? "";

  const set = (name: T) => (v: string) =>
    setValues((s) => ({ ...s, [name]: v }));

  const complete = fields.every((f) => get(f.name).trim() !== "");

  const submit = (): void => {
    if (!/^\S+@\S+\.\S+$/.test(get("email"))) {
      setError("Enter a valid email address.");
      return;
    }
    if (get("password").length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    onSubmit(values as Record<T, string>);
  };

  return (
    <div className="w-full max-w-sm">
      <AuthHeader title={title} subtitle={subtitle} />
      <FieldGroup>
        {fields.map(({ name, ...field }) => (
          <TextField
            key={name}
            {...field}
            value={get(name)}
            onChange={set(name)}
          />
        ))}
      </FieldGroup>
      <ErrorText>{error}</ErrorText>

      <div className="mt-5">
        <Button onClick={submit} disabled={!complete}>
          {submitLabel}
        </Button>
      </div>
      <p className="mt-6 text-center text-[15px] text-gray-500">{footer}</p>
    </div>
  );
}
import type { HTMLInputTypeAttribute } from "react";
import type { FieldName } from "./FieldName";

export interface FieldConfig<T extends FieldName = FieldName> {
  name: T;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
}
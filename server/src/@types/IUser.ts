export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

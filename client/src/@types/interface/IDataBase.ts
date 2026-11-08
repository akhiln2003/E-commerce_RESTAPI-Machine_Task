export interface IUserDB {
  id: string;
  email: string;
  isBlocked: boolean;
  name: string;
  role: "user" | "admin";
  updatedAt: string;
  createdAt: string;
}

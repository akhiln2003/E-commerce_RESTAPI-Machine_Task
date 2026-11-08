export interface ITokenPayload {
  userId: string;
  email: string;
  tokenType: "access" | "refresh";
  role: "user" | "admin";
}

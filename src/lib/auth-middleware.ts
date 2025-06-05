import { cookies } from "next/headers";
import { verifyJwt } from "./auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const user = verifyJwt(token) as null | {
    id: string;
    role: string;
    name: string;
    email: string;
  };

  return user;
}

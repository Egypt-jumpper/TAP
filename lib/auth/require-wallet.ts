import { cookies } from "next/headers";
import { readSession,sessionCookieName } from "./session";
export async function requireWallet(){
 const session=readSession((await cookies()).get(sessionCookieName)?.value);
 if(!session)throw new Error("AUTH_REQUIRED");
 return session.walletAddress;
}

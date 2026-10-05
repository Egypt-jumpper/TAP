import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE="tap_session";
const secret=()=>process.env.AUTH_SESSION_SECRET||"";
function b64(v:string){return Buffer.from(v).toString("base64url");}
export function createSession(walletAddress:string){
 const exp=Math.floor(Date.now()/1000)+60*60*24*7;
 const payload=b64(JSON.stringify({walletAddress:walletAddress.toLowerCase(),exp}));
 if(!secret())throw new Error("AUTH_SESSION_SECRET is not configured.");
 const sig=createHmac("sha256",secret()).update(payload).digest("base64url");
 return {value:payload+"."+sig,expires:new Date(exp*1000)};
}
export function readSession(value:string|undefined){
 if(!value||!secret())return null;
 const [payload,sig]=value.split(".");
 if(!payload||!sig)return null;
 const expected=createHmac("sha256",secret()).update(payload).digest("base64url");
 if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;
 try{const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));if(!data.walletAddress||data.exp<Date.now()/1000)return null;return data as {walletAddress:string;exp:number};}catch{return null;}
}
export const sessionCookieName=COOKIE;

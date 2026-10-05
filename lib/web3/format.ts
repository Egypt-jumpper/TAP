import { formatUnits, parseUnits } from "viem";
export function formatToken(value: bigint, decimals=18, maxFractionDigits=4){
 const raw=Number(formatUnits(value,decimals));
 return raw.toLocaleString(undefined,{maximumFractionDigits:maxFractionDigits});
}
export function parseToken(value:string, decimals=18){ return parseUnits(value || "0",decimals); }

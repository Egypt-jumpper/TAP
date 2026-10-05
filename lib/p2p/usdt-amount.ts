export function parseUsdt(value:string):bigint{
 const [whole,fraction=""]=value.trim().split(".");
 if(!/^\d+$/.test(whole)||!/^\d*$/.test(fraction)||fraction.length>6)throw new Error("Invalid USDT amount.");
 return BigInt(whole)*1000000n+BigInt((fraction+"000000").slice(0,6));
}
export function multiplyUsdt(price:string,sdaAmount:string):bigint{
 const p=parseUsdt(price), [w,f=""]=sdaAmount.trim().split(".");
 if(!/^\d+$/.test(w)||!/^\d*$/.test(f))throw new Error("Invalid SDA amount.");
 const a=BigInt(w)*1000000000000000000n+BigInt((f+"000000000000000000").slice(0,18));
 return (p*a)/1000000000000000000n;
}

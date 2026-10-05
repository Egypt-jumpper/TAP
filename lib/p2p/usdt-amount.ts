export function parseUsdt(value:string):bigint{
 const v=value.trim(); const [whole,fraction=""]=v.split(".");
 if(!/^\d+$/.test(whole)||!/^\d*$/.test(fraction)||fraction.length>6)throw new Error("Invalid USDT amount.");
 return BigInt(whole)*1000000n+BigInt((fraction+"000000").slice(0,6));
}
export function parseSda(value:string):bigint{
 const v=value.trim(); const [whole,fraction=""]=v.split(".");
 if(!/^\d+$/.test(whole)||!/^[0-9]*$/.test(fraction)||fraction.length>18)throw new Error("Invalid SDA amount.");
 return BigInt(whole)*1000000000000000000n+BigInt((fraction+"000000000000000000").slice(0,18));
}
export function formatUsdt(value:bigint){const w=value/1000000n;const f=(value%1000000n).toString().padStart(6,"0").replace(/0+$/,"");return f?`${w}.${f}`:`${w}`;}
export function formatSda(value:bigint){const w=value/1000000000000000000n;const f=(value%1000000000000000000n).toString().padStart(18,"0").replace(/0+$/,"");return f?`${w}.${f}`:`${w}`;}
export function multiplyUsdt(price:string,sdaAmount:string):bigint{return (parseUsdt(price)*parseSda(sdaAmount))/1000000000000000000n;}
export function addSda(a:string,b:string){return formatSda(parseSda(a)+parseSda(b));}
export function subSda(a:string,b:string){const x=parseSda(a),y=parseSda(b);if(y>x)throw new Error("Insufficient SDA liquidity.");return formatSda(x-y);}

import { describe,expect,it } from "vitest";
import { formatSda,formatUsdt,multiplyUsdt,parseSda,parseUsdt } from "@/lib/p2p/usdt-amount";

describe("precise P2P money math",()=>{
 it("parses and formats USDT without floating point loss",()=>{const v=parseUsdt("123.456789");expect(formatUsdt(v)).toBe("123.456789");});
 it("parses SDA to 18 decimals",()=>{expect(parseSda("1.5")).toBe(1500000000000000000n);expect(formatSda(parseSda("1.5"))).toBe("1.5");});
 it("calculates USDT payment from SDA amount",()=>{expect(formatUsdt(multiplyUsdt("2.5","4"))).toBe("10");});
});

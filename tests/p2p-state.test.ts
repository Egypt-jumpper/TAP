import { describe,expect,it } from "vitest";
import { canTransition } from "@/lib/p2p/state";

describe("P2P state machine",()=>{
 it("allows payment verification after a funded order",()=>expect(canTransition("FUNDED","PAYMENT_PENDING")).toBe(true));
 it("allows verified payment from a newly created order",()=>expect(canTransition("CREATED","PAYMENT_SENT")).toBe(true));
 it("allows verified payment from a funded order",()=>expect(canTransition("FUNDED","PAYMENT_SENT")).toBe(true));
 it("blocks completion without seller confirmation",()=>expect(canTransition("PAYMENT_SENT","COMPLETED")).toBe(false));
 it("makes terminal completion immutable",()=>expect(canTransition("COMPLETED","CANCELLED")).toBe(false));
});

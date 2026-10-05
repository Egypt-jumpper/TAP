import type { Address } from "viem";

export const TAP_TOKEN = "0x2b78034DBEA0cE70e662c9aA238db5CAF3CfE28F" as Address;
export const TREASURY = "0x8A783E73C086829bb4F478A45163D68D587a9378" as Address;
export const WSDA = "0xE4095a910209D7BE03B55D02F40d4554B1666182" as Address;
export const SIDRA_V3_POOL = "0xCB94460F967f49E3a955278f252Ca9D6056ecE75" as Address;

export const SDA_TOKEN = process.env.NEXT_PUBLIC_SDA_TOKEN_ADDRESS as Address | undefined;
export const USDT_TOKEN = process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS as Address | undefined;

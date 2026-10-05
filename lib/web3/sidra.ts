import { defineChain } from "viem";

export const sidraChain = defineChain({
  id: 97453,
  name: "Sidra Chain",
  nativeCurrency: { name: "Sidra", symbol: "SDA", decimals: 18 },
  rpcUrls: { default: { http: ["https://node.sidrachain.com/"] } },
  blockExplorers: { default: { name: "Sidra Explorer", url: "https://ledger.sidrachain.com" } },
});

export const ERC20_ABI = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{name:"account",type:"address"}], outputs:[{name:"",type:"uint256"}] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs:[{name:"",type:"uint8"}] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs:[{name:"",type:"string"}] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{name:"owner",type:"address"},{name:"spender",type:"address"}], outputs:[{name:"",type:"uint256"}] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{name:"spender",type:"address"},{name:"amount",type:"uint256"}], outputs:[{name:"",type:"bool"}] },
  { type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{name:"to",type:"address"},{name:"amount",type:"uint256"}], outputs:[{name:"",type:"bool"}] },
] as const;

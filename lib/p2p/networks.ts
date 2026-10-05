export type PaymentNetwork={id:string;name:string;chainId?:number;kind:"evm"|"tron";usdtContract?:string;rpcUrl?:string;confirmations:number;enabled:boolean};

export const USDT_NETWORKS:PaymentNetwork[]=[
 {id:"ethereum",name:"Ethereum",chainId:1,kind:"evm",usdtContract:"0xdAC17F958D2ee523a2206206994597C13D831ec7",rpcUrl:process.env.USDT_ETHEREUM_RPC_URL,confirmations:Number(process.env.USDT_ETHEREUM_CONFIRMATIONS||12),enabled:Boolean(process.env.USDT_ETHEREUM_RPC_URL)},
 {id:"bsc",name:"BNB Smart Chain",chainId:56,kind:"evm",usdtContract:process.env.NEXT_PUBLIC_USDT_BSC_ADDRESS,rpcUrl:process.env.USDT_BSC_RPC_URL,confirmations:Number(process.env.USDT_BSC_CONFIRMATIONS||15),enabled:Boolean(process.env.NEXT_PUBLIC_USDT_BSC_ADDRESS&&process.env.USDT_BSC_RPC_URL)},
 {id:"tron",name:"TRON",kind:"tron",usdtContract:"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",confirmations:Number(process.env.USDT_TRON_CONFIRMATIONS||20),enabled:false},
];
export function getPaymentNetwork(id:string){return USDT_NETWORKS.find(x=>x.id===id);}

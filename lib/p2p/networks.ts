export type PaymentNetwork={id:string;name:string;chainId?:number;kind:"evm"|"tron";usdtContract?:string;enabled:boolean};
export const USDT_NETWORKS:PaymentNetwork[]=[
 {id:"ethereum",name:"Ethereum",chainId:1,kind:"evm",usdtContract:"0xdAC17F958D2ee523a2206206994597C13D831ec7",enabled:true},
 {id:"bsc",name:"BNB Smart Chain",chainId:56,kind:"evm",usdtContract:process.env.NEXT_PUBLIC_USDT_BSC_ADDRESS,enabled:Boolean(process.env.NEXT_PUBLIC_USDT_BSC_ADDRESS)},
 {id:"tron",name:"TRON",kind:"tron",usdtContract:"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",enabled:true},
];
export function getPaymentNetwork(id:string){return USDT_NETWORKS.find(x=>x.id===id);}

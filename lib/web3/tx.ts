import type { Address, PublicClient, WalletClient } from "viem";
import { ERC20_ABI } from "./sidra";
export async function readTokenBalance(publicClient:PublicClient, token:Address, account:Address){
 return publicClient.readContract({address:token,abi:ERC20_ABI,functionName:"balanceOf",args:[account]});
}
export async function readAllowance(publicClient:PublicClient, token:Address, owner:Address, spender:Address){
 return publicClient.readContract({address:token,abi:ERC20_ABI,functionName:"allowance",args:[owner,spender]});
}
export async function approveToken(walletClient:WalletClient, token:Address, spender:Address, amount:bigint, account:Address){
 return walletClient.writeContract({address:token,abi:ERC20_ABI,functionName:"approve",args:[spender,amount],account});
}

import type { OrderStatus } from "@prisma/client";

const transitions:Record<OrderStatus,OrderStatus[]>={
 CREATED:["FUNDED","ACCEPTED","PAYMENT_PENDING","CANCELLED","EXPIRED"],
 FUNDED:["ACCEPTED","PAYMENT_PENDING","CANCELLED","EXPIRED","DISPUTED"],
 ACCEPTED:["PAYMENT_PENDING","CANCELLED","EXPIRED","DISPUTED"],
 PAYMENT_PENDING:["PAYMENT_SENT","CANCELLED","EXPIRED","DISPUTED"],
 PAYMENT_SENT:["SELLER_CONFIRMING","COMPLETED","DISPUTED"],
 SELLER_CONFIRMING:["COMPLETED","DISPUTED"],
 COMPLETED:[],CANCELLED:[],EXPIRED:[],DISPUTED:["REFUNDED","COMPLETED"],REFUNDED:[]
};
export function canTransition(from:OrderStatus,to:OrderStatus){return transitions[from]?.includes(to)??false;}
export function assertTransition(from:OrderStatus,to:OrderStatus){if(!canTransition(from,to))throw new Error(`Invalid order transition: ${from} -> ${to}`);}

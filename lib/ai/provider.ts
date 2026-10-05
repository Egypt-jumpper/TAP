export type ChatMessage={role:"system"|"user"|"assistant";content:string};

export async function generateChat(messages:ChatMessage[]){
 const key=process.env.AI_API_KEY; const url=process.env.AI_API_URL;
 if(!key||!url)throw new Error("AI provider is not configured.");
 const res=await fetch(url,{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+key},body:JSON.stringify({model:process.env.AI_MODEL||"gpt-4o-mini",messages,temperature:0.2}),cache:"no-store"});
 if(!res.ok)throw new Error("AI provider request failed with status "+res.status);
 const data=await res.json(); const content=data?.choices?.[0]?.message?.content;
 if(typeof content!=="string")throw new Error("AI provider returned an invalid response.");
 return {content,usage:data.usage||{}};
}

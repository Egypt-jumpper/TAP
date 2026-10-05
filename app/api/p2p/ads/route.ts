import { NextResponse } from "next/server";
export async function GET(){ return NextResponse.json({ads:[],source:"database",message:"No live ads exist yet."}); }
export async function POST(){ return NextResponse.json({error:"P2P database is not configured yet."},{status:503}); }

import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req){
    const {prompt}= await req.json();

    try {
        const result =await GenAiCode.sendMessage(prompt)
const resp = result
return NextResponse.json(resp)

    } catch (e) {
        return NextResponse.json({error:e})

    }
}
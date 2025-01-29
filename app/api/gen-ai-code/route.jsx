import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        const result = await GenAiCode.sendMessage(prompt);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message || "Unknown error" });
    }
}

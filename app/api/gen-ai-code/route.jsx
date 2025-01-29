import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        // Immediately respond with a processing message
        return NextResponse.json({ status: "processing", message: "AI is generating code" });

        // Process AI request asynchronously (store in DB or queue)
        setTimeout(async () => {
            const result = await GenAiCode.sendMessage(prompt);
            // Save result in DB (Firebase, Convex, etc.)
        }, 0); 

    } catch (error) {
        return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
    }
}

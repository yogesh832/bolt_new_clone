import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        // Set timeout limit (25 seconds)
        const result = await Promise.race([
            GenAiCode.sendMessage(prompt),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), 25000)
            ),
        ]);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in AI Code Generation:", error.message);

        // Return proper error response with status code
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: error.message === "Request timed out" ? 504 : 500 } // Use 504 for timeout, 500 for other errors
        );
    }
}

import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    // Send the prompt to the AI session
    const result = await chatSession.sendMessage(prompt) ;
console.log(chatSession);
    // Extract the AI response text
    const AIresp = result?.response || "";

    if (!AIresp) {
      throw new Error("AI response is empty or invalid");
    }

    // Return the AI response
    return NextResponse.json({ result: AIresp });
  } catch (err) {
    console.error("Error in AI response handler:", err);
    return NextResponse.json({ error: err.message });
  }
}

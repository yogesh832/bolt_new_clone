export async function POST(req) {
    try {
        const { prompt } = await req.json();
        if (!prompt) throw new Error("Prompt is required");

        console.log("Received prompt:", prompt);
        
        const result = await GenAiCode.sendMessage(prompt);

        console.log("AI Response:", result);
        return NextResponse.json(result);

    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}

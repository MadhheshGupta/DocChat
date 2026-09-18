import { NextResponse } from "next/server";

export const maxDuration = 60;

const endpoint = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: { message: "OpenRouter API key not configured" } },
      { status: 500 },
    );
  }

  const { documentText, question, history } = await req.json();

  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant. Answer questions based ONLY on the document provided. DOCUMENT: ${documentText}`,
    },
    ...(history ?? []).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: question },
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "openrouter/free",
      max_tokens: 2048,
      messages,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

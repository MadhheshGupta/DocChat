import type { Message } from "@/types";

const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const endpoint = "https://openrouter.ai/api/v1/chat/completions";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function askGemini(
  documentText: string,
  question: string,
  history: Message[],
): Promise<string> {
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant. Answer questions based ONLY on the document provided. DOCUMENT: ${documentText}`,
    },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: question },
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b:free",
      messages,
    }),
  });

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message || `OpenRouter API error ${response.status}: ${response.statusText}`,
    );
  }

  const message = data.choices?.[0]?.message;
  const content = message?.content || "";
  return content.trim() || "No response received";
}

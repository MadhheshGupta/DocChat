import type { Message } from "@/types";

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
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      documentText,
      question,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message || `API error ${response.status}: ${response.statusText}`,
    );
  }

  const content = data.choices?.[0]?.message?.content || "";
  return content.trim() || "No response received";
}
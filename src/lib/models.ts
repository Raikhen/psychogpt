import { ModelInfo } from "@/types";

export const MODELS: ModelInfo[] = [
  { id: "deepseek/deepseek-chat-v3-0324", label: "DeepSeek Chat v3", provider: "DeepSeek" },
  { id: "openai/chatgpt-4o-latest", label: "ChatGPT-4o", provider: "OpenAI" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google" },
  { id: "anthropic/claude-sonnet-4", label: "Claude Sonnet 4", provider: "Anthropic" },
  { id: "x-ai/grok-3", label: "Grok-3", provider: "xAI" },
  { id: "openai/gpt-5", label: "GPT-5", provider: "OpenAI" },
  { id: "moonshotai/kimi-k2", label: "Kimi K2", provider: "Moonshot" },
  { id: "deepseek/deepseek-r1", label: "DeepSeek R1", provider: "DeepSeek" },
];

export const SUGGESTION_MODEL = "x-ai/grok-3";

export function getModelLabel(modelId: string): string {
  return MODELS.find((m) => m.id === modelId)?.label ?? modelId;
}

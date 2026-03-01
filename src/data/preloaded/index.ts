import { PreloadedConversation } from "@/types";

import deepseekNathan from "./deepseek-nathan.json";
import deepseekEthan from "./deepseek-ethan.json";
import deepseekZara from "./deepseek-zara.json";
import deepseekRachel from "./deepseek-rachel.json";
import deepseekTim from "./deepseek-tim.json";
import chatgpt4oAdrian from "./chatgpt4o-adrian.json";
import gemini25proEthan from "./gemini25pro-ethan.json";
import gemini25proFrank from "./gemini25pro-frank.json";
import gemini25proMichelle from "./gemini25pro-michelle.json";

export const PRELOADED_CONVERSATIONS: PreloadedConversation[] = [
  deepseekEthan as PreloadedConversation,
  deepseekZara as PreloadedConversation,
  deepseekRachel as PreloadedConversation,
  deepseekNathan as PreloadedConversation,
  deepseekTim as PreloadedConversation,
  gemini25proEthan as PreloadedConversation,
  gemini25proMichelle as PreloadedConversation,
  chatgpt4oAdrian as PreloadedConversation,
  gemini25proFrank as PreloadedConversation,
];

export function getPreloadedConversation(
  id: string
): PreloadedConversation | undefined {
  return PRELOADED_CONVERSATIONS.find((c) => c.id === id);
}

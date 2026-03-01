import { Conversation } from "@/types";

import deepseekNathan from "./deepseek-nathan.json";
import deepseekEthan from "./deepseek-ethan.json";
import deepseekZara from "./deepseek-zara.json";
import deepseekRachel from "./deepseek-rachel.json";
import deepseekTim from "./deepseek-tim.json";
import deepseekJessica from "./deepseek-jessica.json";
import chatgpt4oAdrian from "./chatgpt4o-adrian.json";
import chatgpt4oColin from "./chatgpt4o-colin.json";
import gemini25proEthan from "./gemini25pro-ethan.json";
import gemini25proFrank from "./gemini25pro-frank.json";
import gemini25proMichelle from "./gemini25pro-michelle.json";

function asConversation(json: Record<string, unknown>): Conversation {
  return { ...json, createdAt: 0, updatedAt: 0 } as Conversation;
}

export const PRELOADED_CONVERSATIONS: Conversation[] = [
  asConversation(deepseekEthan),
  asConversation(deepseekZara),
  asConversation(deepseekRachel),
  asConversation(deepseekNathan),
  asConversation(deepseekTim),
  asConversation(deepseekJessica),
  asConversation(gemini25proEthan),
  asConversation(gemini25proMichelle),
  asConversation(chatgpt4oAdrian),
  asConversation(chatgpt4oColin),
  asConversation(gemini25proFrank),
];

export function getPreloadedConversation(
  id: string
): Conversation | undefined {
  return PRELOADED_CONVERSATIONS.find((c) => c.id === id);
}

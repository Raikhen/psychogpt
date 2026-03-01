export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export type DangerLevel = "critical" | "warning" | "safe";

export interface ModelInfo {
  id: string;
  label: string;
  provider: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  characterId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  /** Set when this conversation was forked from a preloaded transcript */
  preloadedOrigin?: string;
  dangerLevel?: DangerLevel;
  dangerReason?: string;
}

export interface PreloadedConversation {
  id: string;
  title: string;
  modelId: string;
  modelLabel: string;
  characterId: string;
  characterName: string;
  dangerLevel: DangerLevel;
  dangerReason: string;
  sourceUrl: string;
  messages: Message[];
}

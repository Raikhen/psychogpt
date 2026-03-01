export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface ModelInfo {
  id: string;
  label: string;
  provider: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  delusionLabel: string;
  description: string;
  systemPrompt: string;
  image?: string;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  modelLabel: string;
  characterId: string;
  characterName: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  /** Set when this conversation was forked from a preloaded transcript */
  preloadedOrigin?: string;
  /** URL to original research source (preloaded transcripts only) */
  sourceUrl?: string;
  /** AI-generated title replacing the default */
  aiTitle?: string;
}

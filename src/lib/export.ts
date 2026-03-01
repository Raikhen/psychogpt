import { Conversation } from "@/types";
import { getModelLabel } from "./models";
import { getDelusionLabel } from "./characters";

export function exportAsMarkdown(conversation: Conversation): string {
  const title = conversation.aiTitle ?? conversation.title;
  const model = conversation.modelLabel || getModelLabel(conversation.modelId);
  const delusion = getDelusionLabel(conversation.characterId);

  const lines: string[] = [
    `# ${title}`,
    "",
    `**Model:** ${model}`,
    `**Character:** ${conversation.characterName} (${delusion})`,
    `**Messages:** ${conversation.messages.length}`,
    "",
    "---",
    "",
  ];

  for (const msg of conversation.messages) {
    const label = msg.role === "user" ? "User" : model;
    lines.push(`**${label}:**`);
    lines.push("");
    lines.push(msg.content);
    lines.push("");
  }

  return lines.join("\n");
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

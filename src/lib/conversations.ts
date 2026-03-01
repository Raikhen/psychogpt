import { getModelLabel } from "./models";
import { getCharacter, getDelusionLabel } from "./characters";

export function buildConversationSubheader(
  modelId: string,
  characterId: string
): string {
  const model = getModelLabel(modelId);
  const character = getCharacter(characterId);
  const name = character?.name ?? characterId;
  const delusion = getDelusionLabel(characterId);
  return `${model} · ${name} (${delusion})`;
}

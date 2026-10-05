import { completeQuest } from "../../game/quest.service";

export async function completeQuestTool(gameId: string, questId: string) {
    return completeQuest(gameId, questId)
}
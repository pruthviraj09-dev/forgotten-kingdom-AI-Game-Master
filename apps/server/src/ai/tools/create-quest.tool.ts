import { createQuest } from "../../game/quest.service";


export async function createQuestTool(gameId: string, title: string, description: string, objectiveDescription: string, objectiveTarget: number) {
    return createQuest(gameId, title, description, objectiveDescription, objectiveTarget)
}
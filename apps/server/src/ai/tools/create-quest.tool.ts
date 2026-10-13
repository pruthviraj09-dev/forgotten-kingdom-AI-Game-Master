import { createQuest } from "../../game/quest.service";

export async function createQuestTool(
    gameId: string,
    title: string,
    description: string,
    objectiveDescription: string,
    objectiveType: string,
    targetLocationId: string
) {
    return createQuest(
        gameId,
        title,
        description,
        objectiveDescription,
        objectiveType,
        targetLocationId
    );
}
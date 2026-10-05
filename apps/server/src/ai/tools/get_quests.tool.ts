import { getQuests } from "../../game/quest.service";


export async function getQuestsTool(gameId: string) {
    return getQuests(gameId)
}
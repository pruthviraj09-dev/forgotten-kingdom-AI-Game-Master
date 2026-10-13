import { talkToNpc } from "../../game/npc.service";


export async function talkToNpcTool(gameId: string, npcId: string) {
    return talkToNpc(gameId, npcId)
}
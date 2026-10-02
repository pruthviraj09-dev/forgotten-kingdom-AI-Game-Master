import { getPlayer } from "../../game/player.service";


export async function getPlayerTool(gameId: string) {
    return getPlayer(gameId)
}
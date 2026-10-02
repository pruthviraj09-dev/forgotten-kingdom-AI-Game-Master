import { movePlayer } from "../../game/location.service";


export async function movePlayerTool(gameId: string, destinationId: string) {
    return movePlayer(gameId, destinationId)
}
import { getNearbyEnemies } from "../../game/enemy.service";


export async function getNearbyEnemiesTool(gameId: string) {
    return getNearbyEnemies(gameId)
}
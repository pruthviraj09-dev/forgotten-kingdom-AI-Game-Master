import { getNearbyLocations } from "../../game/location.service";


export async function getNearbyLocationsTool(gameId: string, locationId: string) {
    return getNearbyLocations(gameId, locationId)
}
import { getLocation } from "../../game/location.service";


export async function getLocationTool(gameId: string, locationId: string) {
    return getLocation(gameId, locationId)
}
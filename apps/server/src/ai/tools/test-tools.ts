import { db } from "@repo/db";

import { getPlayerTool } from "./get-player.tool";
import { getLocationTool } from "./get-location.tool";
import { getNearbyLocationsTool } from "./get-nearby-locations.tool";
import { getInventoryTool } from "./get-inventory.tool";
import { movePlayerTool } from "./move-player.tool";

async function main() {
    const game = await db.orm.public.Game.first();

    if (!game) {
        throw new Error("No game found. Run the seed first.");
    }

    console.log("\n=== GET PLAYER ===");

    const player = await getPlayerTool(game.id);

    console.log(player);

    console.log("\n=== GET LOCATION ===");

    const location = await getLocationTool(
        game.id,
        player.location.id
    );

    console.log(location);

    console.log("\n=== GET NEARBY LOCATIONS ===");

    const nearby = await getNearbyLocationsTool(
        game.id,
        player.location.id
    );

    console.log(nearby);

    console.log("\n=== GET INVENTORY ===");

    const inventory = await getInventoryTool(game.id);

    console.log(inventory);

    const destination = nearby.find(
        (location) => location.name === "Forest"
    );

    if (!destination) {
        throw new Error("Forest is not reachable.");
    }

    console.log("\n=== MOVE PLAYER ===");

    const result = await movePlayerTool(
        game.id,
        destination.id
    );

    console.log(result);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await db.close();
    });
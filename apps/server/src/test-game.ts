import { db } from "@repo/db";
import { getPlayer } from "./game/player.service";
import {
    getLocation,
    getNearbyLocations,
    movePlayer,
} from "./game/location.service";
import { getInventory } from "./game/inventory.service";

async function main() {
    const game = await db.orm.public.Game.first();

    if (!game) {
        throw new Error("No game found. Run the seed first.");
    }

    console.log("\n--- PLAYER ---");

    const player = await getPlayer(game.id);
    console.log(player);

    console.log("\n--- CURRENT LOCATION ---");

    const location = await getLocation(
        game.id,
        player.location.id
    );

    console.log(location);

    console.log("\n--- NEARBY LOCATIONS ---");

    const nearby = await getNearbyLocations(
        game.id,
        player.location.id
    );

    console.log(nearby);

    console.log("\n--- INVENTORY ---");

    const inventory = await getInventory(game.id);
    console.log(inventory);

    console.log("\n--- MOVE TO FOREST ---");

    const forest = nearby.find(
        (location) => location.name === "Forest"
    );

    if (!forest) {
        throw new Error("Forest not found");
    }

    const movement = await movePlayer(
        game.id,
        forest.id
    );

    console.log(movement);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await db.close();
    });
import { db } from "@repo/db";
import { runAgent } from "./agent";

async function main() {
    const game = await db.orm.public.Game.first();

    if (!game) {
        throw new Error("No game found. Run the seed first.");
    }

    const response = await runAgent({
        gameId: game.id,
        message: "Where am I, and what places can I travel to?",
    });

    console.log("\nGAME MASTER:\n");
    console.log(response.message);

    console.log("\nAGENT ACTIONS:\n");

    for (const action of response.actions) {
        console.log(`✓ ${action.tool}`);
        console.log("  arguments:", action.arguments);
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await db.close();
    });
import { db } from "@repo/db";
import { runAgent } from "./ai/agent.js";

async function main() {
    const game = await db.orm.public.Game.first();

    if (!game) {
        throw new Error("No game found. Run the seed first.");
    }

    const result = await runAgent({
        gameId: game.id,
        message:
            "What quests do I have currently?",
    });

    console.log("\nGAME MASTER:\n");
    console.log(result.message);

    console.log("\nAGENT ACTIONS:\n");

    for (const action of result.actions) {
        console.log(`✓ ${action.tool}`);
        console.log("  arguments:", action.arguments);
        console.log("  result:", action.result);
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
import { db } from "@repo/db";
import { gameTools } from "./ai/tools/index.js";

async function main() {
    const game = await db.orm.public.Game.first();

    if (!game) {
        throw new Error("No game found. Run the seed first.");
    }

    console.log("QUESTS BEFORE:");

    console.log(
        await gameTools.get_quests(game.id)
    );

    console.log("\nCREATING QUEST:");

    const quest = await gameTools.create_quest(
        game.id,
        "Investigate the Forest",
        "Find out why strange sounds have been heard in the forest."
    );

    console.log(quest);

    console.log("\nQUESTS AFTER:");

    console.log(
        await gameTools.get_quests(game.id)
    );

    console.log("\nCOMPLETING QUEST:");

    const completed = await gameTools.complete_quest(
        game.id,
        quest.id
    );

    console.log(completed);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await db.close();
    });
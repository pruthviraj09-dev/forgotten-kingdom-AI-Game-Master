import {
    createQuest,
    getQuests,
    completeQuest,
} from "./game/quest.service.js";
import { db } from "@repo/db";

async function main() {
    const game = await db.orm.public.Game.first();

    if (!game) {
        throw new Error("No game found. Run the seed first.");
    }

    console.log("Creating quest...");

    const quest = await createQuest(
        game.id,
        "Investigate the Forest",
        "Find out why strange sounds have been heard in the forest.",
        "Visit the forest"
    );

    console.log("\nCreated quest:");
    console.log(quest);

    console.log("\nAll quests:");

    const quests = await getQuests(game.id);

    console.log(quests);

    console.log("\nCompleting quest...");

    const completedQuest = await completeQuest(
        game.id,
        quest.id
    );

    console.log(completedQuest);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await db.close();
    });
import { movePlayer } from "./game/location.service.js";
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
        "Visit the Forest",
        "VISIT_LOCATION",
        "b21a7322-039f-4521-af0d-968ab033e1d6"
    );

    console.log("\nCreated quest:");
    console.log(quest);

    const movement = await movePlayer(
        game.id,
        "b21a7322-039f-4521-af0d-968ab033e1d6"
    );

    console.log("\nMOVEMENT RESULT:");
    console.log(movement);

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
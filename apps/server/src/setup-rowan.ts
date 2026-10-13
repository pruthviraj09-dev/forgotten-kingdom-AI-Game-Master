import { db } from "@repo/db"

async function main() {
    const game = await db.orm.public.Game.include("locations").first()

    if (!game) {
        throw new Error("No game found. Run the seed first.");
    }

    const village = game.locations.find(
        (location) => location.name === "Village"
    );

    const forest = game.locations.find(
        (location) => location.name === "Forest"
    );

    if (!village || !forest) {
        throw new Error("Village or Forest not found.");
    }

    const rowan = await db.orm.public.NPC.where({
        name: "Old Rowan",
        locationId: village.id,
    }).first();

    if (!rowan) {
        throw new Error("Old Rowan was not found in the Village.");
    }

    const updated = await db.orm.public.NPC.where({ id: rowan.id }).update({
        questOfferTitle: "Investigate the Forest",
        questOfferDescription:
            "Strange sounds have been heard among the trees. Rowan wants you to investigate.",
        questObjectiveDescription: "Visit the Forest",
        questObjectiveType: "VISIT_LOCATION",
        questTargetLocationId: forest.id,
    })

    if (!updated) {
        throw new Error("Failed to update Old Rowan.")
    }

    console.log("Old Rowan's mission configured:");
    console.log(updated.name, updated.questOfferTitle);
}

main()
    .catch(console.error)
    .finally(async () => {
        await db.close();
    });
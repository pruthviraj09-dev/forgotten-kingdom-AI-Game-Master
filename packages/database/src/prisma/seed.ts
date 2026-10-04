import { db } from "./db";

async function main() {
    console.log("Seeding Forgotten Kingdom...");

    // --------------------------------------------------
    // CLEAN DATABASE
    // --------------------------------------------------
    await db.orm.public.InventoryItem
        .where({})
        .deleteAll();

    await db.orm.public.Enemy
        .where({})
        .deleteAll();

    await db.orm.public.NPC
        .where({})
        .deleteAll();

    await db.orm.public.Item
        .where({})
        .deleteAll();

    await db.orm.public.LocationConnection
        .where({})
        .deleteAll();

    await db.orm.public.Player
        .where({})
        .deleteAll();

    await db.orm.public.Location
        .where({})
        .deleteAll();

    await db.orm.public.GameMessage
        .where({})
        .deleteAll();

    await db.orm.public.Game
        .where({})
        .deleteAll();


    // --------------------------------------------------
    // GAME
    // --------------------------------------------------

    const game = await db.orm.public.Game.create({
        name: "The Forgotten Kingdom",
    });

    // --------------------------------------------------
    // LOCATIONS
    // --------------------------------------------------

    const village = await db.orm.public.Location.create({
        name: "Village",
        description:
            "A small stone village surrounded by old wooden houses and quiet fields.",
        gameId: game.id,
    });

    const forest = await db.orm.public.Location.create({
        name: "Forest",
        description:
            "A dense forest filled with ancient trees. The paths disappear beneath thick moss.",
        gameId: game.id,
    });

    const cave = await db.orm.public.Location.create({
        name: "Cave",
        description:
            "A dark cave entrance opens beneath a rocky hill. Cold air drifts from within.",
        gameId: game.id,
    });

    // --------------------------------------------------
    // LOCATION CONNECTIONS
    // --------------------------------------------------

    await db.orm.public.LocationConnection.createAll([
        {
            fromLocationId: village.id,
            toLocationId: forest.id,
        },
        {
            fromLocationId: village.id,
            toLocationId: cave.id,
        },
        {
            fromLocationId: forest.id,
            toLocationId: village.id,
        },
        {
            fromLocationId: cave.id,
            toLocationId: village.id,
        },
    ]);

    // --------------------------------------------------
    // NPCS
    // --------------------------------------------------

    await db.orm.public.NPC.createAll([
        {
            name: "Old Rowan",
            description:
                "An elderly villager who has lived here for most of his life.",
            locationId: village.id,
        },
        {
            name: "Mira",
            description:
                "A traveling merchant who occasionally visits the village.",
            locationId: village.id,
        },
    ]);

    // --------------------------------------------------
    // ITEMS
    // --------------------------------------------------

    const sword = await db.orm.public.Item.create({
        name: "Sword",
        description: "A simple iron sword.",
    });

    await db.orm.public.Item.create({
        name: "Potion",
        description: "A small red potion that restores health.",
        locationId: forest.id
    });

    await db.orm.public.Item.create({
        name: "Gold",
        description: "A small collection of gold coins.",
        locationId: forest.id
    });

    // --------------------------------------------------
    // ENEMIES
    // --------------------------------------------------

    await db.orm.public.Enemy.create({
        name: "Goblin",
        description:
            "A small hostile creature carrying a crude wooden club.",
        hp: 40,
        maxHp: 40,
        locationId: forest.id,
    });

    await db.orm.public.Enemy.create({
        name: "Wolf",
        description:
            "A wild wolf prowling through the forest.",
        hp: 30,
        maxHp: 30,
        locationId: forest.id,
    });

    // --------------------------------------------------
    // PLAYER
    // --------------------------------------------------

    const player = await db.orm.public.Player.create({
        name: "Adventurer",
        hp: 100,
        maxHp: 100,
        level: 1,
        gold: 10,
        gameId: game.id,
        locationId: village.id,
    });

    // --------------------------------------------------
    // STARTING INVENTORY
    // --------------------------------------------------

    await db.orm.public.InventoryItem.create({
        playerId: player.id,
        itemId: sword.id,
        quantity: 1,
    });

    console.log("Seed complete!");
    console.log(`Game ID: ${game.id}`);
    console.log(`Player ID: ${player.id}`);
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await db.close();
    });

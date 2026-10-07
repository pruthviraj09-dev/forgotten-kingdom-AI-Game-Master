import { db } from "@repo/db";


export async function getQuests(gameId: string) {
    return db.orm.public.Quest.where({ gameId }).include("objectives").orderBy((q) => q.createdAt.asc()).all()
}

export async function createQuest(gameId: string, title: string, description: string,
    objectiveDescription: string,
    objectiveType: string,
    targetLocationId?: string,
    objectiveTarget = 1,
) {

    const game = await db.orm.public.Game.where({ id: gameId }).first()

    if (!game) {
        throw new Error("game not found")
    }

    if (objectiveType === "VISIT_LOCATION" && !targetLocationId) {
        throw new Error("VISIT_LOCATION objectives require a target location")
    }

    if (targetLocationId) {
        const location = await db.orm.public.Location.where({ id: targetLocationId }).where((l) => l.gameId.eq(gameId)).first()

        if (!location) {
            throw new Error("Target location not found in the game")
        }
    }

    return db.orm.public.Quest.include("objectives").create({
        title,
        description,
        gameId,
        status: "active",
        objectives: (objective) =>
            objective.create({
                description: objectiveDescription,
                target: objectiveTarget,
                type: objectiveType,
                targetLocationId: targetLocationId
            })
    })

}

export async function completeQuest(gameId: string, questId: string) {

    const quest = await db.orm.public.Quest.include("objectives").where({ gameId, id: questId }).first()

    if (!quest) {
        throw new Error("quest not found")
    }

    if (quest.status === "completed") {
        throw new Error("quest already completed")
    }

    const allObjectivesComplete = quest.objectives.length > 0 && quest.objectives.every((ob) => ob.completed);

    if (!allObjectivesComplete) {
        throw new Error("Quest objectives are not complete")
    }

    return db.orm.public.Quest.where({ id: quest.id }).include("objectives").update({ status: "completed" })
}


export async function updateQuestObjective(gameId: string, objectiveId: string, amount: number = 1) {

    const quest = await db.orm.public.Quest.where({ gameId }).first()

    const objective = quest
        ? await db.orm.public.QuestObjective
            .where((o) => o.id.eq(objectiveId))
            .where((o) => o.questId.eq(quest.id))
            .first()
        : null;

    if (!objective) {
        throw new Error("objective not found")
    }

    if (objective.completed) {
        return objective
    }

    const newProgress = Math.min(objective.progress + amount, objective.target)

    return db.orm.public.QuestObjective.where({ id: objective.id }).update({ completed: newProgress >= objective.target, progress: newProgress })
}

export async function updateLocationObjectives(
    gameId: string,
    locationId: string
) {

    const quest = await db.orm.public.Quest.include("objectives").where({ gameId }).first()

    if (!quest) {
        throw new Error("quest not found in game!")
    }

    if (quest.status != "active") {
        throw new Error("quest is already completed")
    }

    const objectives = await db.orm.public.QuestObjective.where({ type: "VISIT_LOCATION", targetLocationId: locationId, completed: false, questId: quest.id }).all()

    if (objectives.length === 0) {
        return [];
    }

    const updates = [];

    for (const objective of objectives) {
        const newProgress = Math.min(
            objective.progress + 1,
            objective.target
        );

        const updated = await db.orm.public.QuestObjective.where({ id: objective.id }).update({
            progress: newProgress,
            completed: newProgress >= objective.target,
        });

        updates.push(updated);
    }

    return updates;
}
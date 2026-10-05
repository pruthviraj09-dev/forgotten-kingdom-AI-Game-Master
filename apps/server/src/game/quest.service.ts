import { db } from "@repo/db";


export async function getQuests(gameId: string) {
    return db.orm.public.Quest.where({ gameId }).include("objectives").orderBy((q) => q.createdAt.asc()).all()
}

export async function createQuest(gameId: string, title: string, description: string,
    objectiveDescription: string,
    objectiveTarget = 1
) {

    const game = await db.orm.public.Game.where({ id: gameId }).first()

    if (!game) {
        throw new Error("game not found")
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
            })
    })

}

export async function completeQuest(gameId: string, questId: string) {

    const quest = await db.orm.public.Quest.where({ gameId, id: questId }).first()

    if (!quest) {
        throw new Error("quest not found")
    }

    if (quest.status === "completed") {
        throw new Error("quest already completed")
    }

    return db.orm.public.Quest.where({ id: quest.id }).update({ status: "completed" })
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
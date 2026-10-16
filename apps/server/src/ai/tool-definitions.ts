import { FunctionDeclaration, Type } from "@google/genai";

const toolDefinations: FunctionDeclaration[] = [
    {
        name: "get_player",
        description: "Get the player's current stats & location",
        parameters: {
            type: Type.OBJECT,
            properties: {},
        },
    },
    {
        name: "get_location",
        description: "Get information about a location, including its description, NPCs, enemies, and items",
        parameters: {
            type: Type.OBJECT,
            properties: {
                locationId: {
                    type: Type.STRING,
                    description: "The ID of the location to inspect."
                },
            },
            required: ["locationId"],
        },
    },
    {
        name: "get_nearby_locations",
        description: "Get the locations directly reachable from a location.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                locationId: {
                    type: Type.STRING,
                    description: "The ID of the current location",
                }
            },
            required: ["locationId"],
        },
    },
    {
        name: "move_player",
        description: "Move the player to a directly connected location.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                destinationId: {
                    type: Type.STRING,
                    description: "The ID of the destination location."
                },
            },
            required: ["destinationId"],
        },
    },
    {
        name: "get_inventory",
        description: "Get the player's current inventory",
        parameters: {
            type: Type.OBJECT,
            properties: {
            },
        },
    },
    {
        name: "pickup_item",
        description: "Pick up an item in the current location and adds it to the inventory.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                itemId: {
                    type: Type.STRING,
                    description: "The ID of the item to pickup."
                },
            },
            required: ["itemId"],
        },
    },
    {
        name: "drop_item",
        description: "Drop an item from the inventory to the current location.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                itemId: {
                    type: Type.STRING,
                    description: "The ID of the item to drop."
                },
            },
            required: ["itemId"],
        },
    },
    {
        name: "get_quests",
        description: "Get the quests currently associated with the game.",
        parameters: {
            type: Type.OBJECT,
            properties: {},
        },
    },
    {
        name: "create_quest",
        description: "Create a new quest when the game narrative establishes that the player has received or discovered a quest.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                title: {
                    type: Type.STRING,
                    description: "The quest title."
                },
                description: {
                    type: Type.STRING,
                    description: "A concise description of the quest objective."
                },
                objectiveDescription: {
                    type: Type.STRING,
                    description: "A concise description of the quest objective."
                },
                objectiveType: {
                    type: Type.STRING,
                    description: "The type of the quest objective."
                },
                targetLocationId: {
                    type: Type.STRING,
                    description: "The ID of the location to complete the quest."
                }
            },
            required: ["title", "description", "objectiveDescription", "objectiveType", "targetLocationId"]
        }
    },
    {
        name: "complete_quest",
        description: "Complete an existing quest when the game state establishes that its objective has been fulfilled.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                questId: {
                    type: Type.STRING,
                    description: "The ID of the quest to complete."
                }
            },
            required: ["questId"]
        }
    },
    {
        name: "talk_to_npc",
        description: "Talk to an NPC in the current location. This will provide additional details about the location and may offer quests or items to the player.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                npcId: {
                    type: Type.STRING,
                    description: "The ID of the NPC to talk to."
                },
            },
            required: ["npcId"]
        }
    },
    {
        name: "get_nearby_enemies",
        description: "Get the enemies at the player's current location, including their IDs and current health.",
        parameters: {
            type: Type.OBJECT,
            properties: {},
        }
    },
    {
        name: "start_combat",
        description: "Start a combat encounter with an enemy in the current location.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                enemyId: {
                    type: Type.STRING,
                    description: "The ID of the enemy to start combat with."
                }
            },
            required: ["enemyId"]
        }
    },
    {
        name: "attack_enemy",
        description:
            "Attack an enemy in the player's active combat encounter.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                enemyId: {
                    type: Type.STRING,
                    description: "The ID of the enemy being attacked.",
                },
            },
            required: ["enemyId"],
        },
    },
    {
        name: "flee_combat",
        description:
            "Attempt to escape an active combat encounter with an enemy.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                enemyId: {
                    type: Type.STRING,
                    description: "The ID of the enemy in the active encounter.",
                },
            },
            required: ["enemyId"],
        },
    }
]

const gameToolDeclarations = [
    {
        functionDeclarations: toolDefinations
    }
]

export {
    gameToolDeclarations,
    toolDefinations
}
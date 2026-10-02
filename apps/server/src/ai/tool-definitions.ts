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
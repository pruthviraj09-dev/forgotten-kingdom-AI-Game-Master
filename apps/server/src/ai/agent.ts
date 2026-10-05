import { addGameMessage, getGameMessages } from "../game/message.service";
import { ai } from "./client";
import { gameToolDeclarations } from "./tool-definitions";
import { executeTool } from "./tool-executor";
import { AgentAction, AgentResult } from "./types";

const SYSTEM_PROMPT = `
You are the Game Master for Forgotten Kingdom.

You control the narrative, but you do not control game state.

Always use tools to inspect or change game state.

Never invent:
- player statistics
- locations
- inventory items
- enemies
- movement results
- quests

Quest rules:

- Use get_quests when you need to know the player's current quests.
- Only create a quest when the game narrative establishes that the player has received or discovered one.
- Never invent quest completion.
- Only complete a quest when the game state establishes that its objective has been fulfilled.
- Never invent quest IDs.

The game engine and database are authoritative.

After tools return their results, describe what happened to the player in an engaging but concise way.
`;


type RunAgentOptions = {
    gameId: string;
    message: string;
};

export async function runAgent({ gameId, message }: RunAgentOptions): Promise<AgentResult> {
    const actions: AgentAction[] = []

    await addGameMessage(gameId, "player", message);

    const history = await getGameMessages(gameId)

    let input: any[] = [
        ...history.map((item) => ({
            role: item.role === "player" ? "user" : "assistant",
            content: item.content
        })),
    ]

    const chat = ai.chats.create({
        model: "gemini-3.5-flash-lite",
        config: { tools: gameToolDeclarations, systemInstruction: SYSTEM_PROMPT }
    });

    let response = await chat.sendMessage({
        message: message
    });

    while (true) {
        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const functionCalls = parts.filter(
            part => part.functionCall
        );

        if (functionCalls.length === 0) {
            await addGameMessage(
                gameId,
                "gm",
                parts?.map(part => part.text).join("") || ""
            );
            return { message: parts?.map(part => part.text).join("") || "", actions }
        }
        const functionResponses: any[] = [];

        for (const part of functionCalls) {
            const call = part.functionCall!

            try {
                const result = await executeTool(call.name as string, JSON.stringify(call.args), { gameId })

                actions.push({
                    arguments: call.args,
                    result: result,
                    tool: call.name as string,
                })

                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: {
                            result
                        },
                    },
                });


            } catch (error) {
                const message = error instanceof Error ? error.message : "Tool execution failed"
                actions.push({
                    arguments: call.args,
                    result: {
                        error: message,
                    },
                    tool: call.name as string,
                });
                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: { error: message },
                    },
                });
                continue;
            }
        }
        response = await chat.sendMessage({
            message: functionResponses,
        });
    }


}
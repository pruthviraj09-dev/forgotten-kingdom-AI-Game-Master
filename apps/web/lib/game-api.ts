const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type AgentAction = {
    tool: string;
    arguments: unknown;
    result: unknown;
};

export type GameMessageResponse = {
    message: string;
    actions: AgentAction[];
};

export type GameHistoryMessage = {
    id: string;
    role: "player" | "gm";
    content: string;
    createdAt: string;
};

export type PlayerState = {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    level: number;
    gold: number;
    location: {
        id: string;
        name: string;
    };
};

export type InventoryItem = {
    itemId: string;
    name: string;
    description: string;
    quantity: number;
};

export async function getInventory(
    gameId: string
): Promise<InventoryItem[]> {
    const response = await fetch(
        `${API_URL}/game/${gameId}/inventory`
    );

    if (!response.ok) {
        throw new Error("Failed to load inventory");
    }

    return response.json();
}

export async function sendGameMessage(
    gameId: string,
    message: string
): Promise<GameMessageResponse> {
    const response = await fetch(`${API_URL}/game/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gameId,
            message,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to send game message");
    }

    return response.json();
}

export async function getGameMessages(
    gameId: string
): Promise<GameHistoryMessage[]> {
    const response = await fetch(
        `${API_URL}/game/${gameId}/messages`
    );

    if (!response.ok) {
        throw new Error("Failed to load game messages");
    }

    return response.json();
}


export async function getPlayer(
    gameId: string
): Promise<PlayerState> {
    const response = await fetch(
        `${API_URL}/game/${gameId}/player`
    );

    if (!response.ok) {
        throw new Error("Failed to load player");
    }

    return response.json();
}

export type ChatMessage = {
    id: string;
    role: "player" | "gm";
    content: string;
};
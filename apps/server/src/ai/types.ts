

export type AgentAction = {
    tool: string;
    arguments: unknown;
    result: unknown;
};

export type AgentResult = {
    message: string;
    actions: AgentAction[];
};
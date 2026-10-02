import { Router } from "express";
import { runAgent } from "../ai/agent"
import { getGameMessages } from "../game/message.service";

const router = Router()

router.post("/message", async (req, res) => {
    try {
        const { gameId, message } = req.body

        if (typeof gameId !== "string" || typeof message !== "string") {
            return res.status(400).json({
                error: "gameId and message are required",
            });
        }

        const result = await runAgent({
            gameId,
            message
        })
        return res.json(result)
    } catch (error) {
        console.error("Error running AI agent:", error);
        return res.status(500).json({
            error: "Failed to run AI agent",
        });
    }

})

router.get("/:gameId/messages", async (req, res) => {
    try {
        const { gameId } = req.params

        if (!gameId) {
            res.status(400).json({
                "message": "game id is missing"
            })
            return
        }

        const messages = await getGameMessages(gameId);

        return res.status(200).json(messages)
    } catch (error) {
        console.error("Failed to load game messages:", error);

        return res.status(500).json({
            error: "Failed to load game messages",
        });
    }




})

export default router

import express from 'express'
import cors from 'cors'
import { db as prisma } from "@repo/db"

const app = express()

app.use(express.json())
app.use(cors())

app.get("/health", (req, res) => { res.json({ "status": "OK" }) })

app.post("/games", async (req, res) => {
    try {
        const { name } = req.body

        const game = await prisma.orm.public.Game.create({
            name
        })

        res.status(201).json({
            "message": "game created",
            "data": {
                game
            }
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            "message": "internal server error",
            "error": error
        })
    }
})

app.get("/games", async (req, res) => {
    try {
        const games = await prisma.orm.public.Game.all()

        res.status(200).json({
            data: {
                games
            }
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            "message": "internal server error",
            "error": error
        })
    }
})

app.listen(3000, () => {
    console.log("server is listening on port 3000");
})
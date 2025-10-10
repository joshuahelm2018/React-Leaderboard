require("dotenv").config();

const express = require("express");
const { connectDb } = require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let db;

connectDb().then(connection => {
    db = connection;
}).catch(err => console.error("DB connection failed:", err));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.get("/scores", async (req, res) => {
    const { mission_id } = req.query;
    try {
        const db = await connectDb();
        let query = "SELECT * FROM scores";
        let params = [];

        if (mission_id) {
            query += " WHERE mission_id = ?";
            params.push(mission_id);
        }

        query += " ORDER BY time_ms ASC";

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

app.post("/scores", async (req, res) => {
    try {
        const {player_name, time_ms } = req.body;
        if (!player_name || !time_ms) {
            return res.status(400).json({ error: "player_name and time_ms are required" })
        }
    
        const db = await connectDb();
        const [result] = await db.query(
            "INSERT INTO scores (player_name, time_ms) VALUES (?, ?)",
            [player_name, time_ms]
        );

        res.json({ id: result.insertId, player_name, time_ms});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to insert score" });
    }
});

app.get("/missions", async (req, res) => {
    try {
        const db = await connectDb();
        const [rows] = await db.query("SELECT * FROM missions ORDER BY id ASC");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch missions", err: err});
    }
});

app.listen(4000, () => {
    console.log("Backend running on port 4000");
});

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.post("/optimize", (req, res) => {
    console.log("✅ OPTIMIZE HIT");

    const { A, B, C, D } = req.body;

    if (A == null || B == null || C == null || D == null) {
        return res.status(400).json({ error: "Missing values" });
    }

    const exePath = path.join(__dirname, "traffic.exe");
    const command = `"${exePath}" ${A} ${B} ${C} ${D}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Execution failed" });
        }

        res.json({
            success: true,
            output: stdout
        });
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const pool = require('./db');

const PORT = process.env.PORT || 3000;

const auth = require("./auth");
auth(io);

app.use(express.json());

app.use(express.static(__dirname + "/static"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

app.get('/login/', (req, res) => {
    res.sendFile(__dirname + "/static/login.html");
});

app.get('/sign-up/', (req, res) => {
    res.sendFile(__dirname + "/static/register.html");
});

io.on("connection", async (socket) => {
    try {
        const result = await pool.query("SELECT * FROM messages ORDER BY id ASC");
        socket.emit("loadMessages", result.rows);
    } catch(err) {
        console.error("Load error:", err);
    }

    socket.on("chatMessage", async (data) => {
        console.log(data);

        try {
            // 1) Save message into DB
            await pool.query(
                "INSERT INTO messages (username, message) VALUES ($1, $2)",
                [data.username, data.message]
            );

            // 2) Send message to all connected clients
            io.emit("chatMessage", {
                username: data.username,
                message: data.message
            });

        } catch (err) {
            console.error("DB error:", err);
        }
    });
});

http.listen(PORT, () => {
    console.log("Server is running on port,", PORT);
});
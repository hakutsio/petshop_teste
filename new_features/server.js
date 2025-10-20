const express = require("express");
const path = require("path");
const cors = require("cors");
const { router: newApiRouter, setDatabase } = require("./api");
const { initializeDatabase } = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
// Allow browser-based frontends to call the API from other origins
app.use(cors());
// Serve a simple frontend from the project's `public/` folder
app.use(express.static(path.resolve(__dirname, "..", "public")));

const startServer = (callback) => {
    initializeDatabase((err, db) => {
        if (err) {
            console.error("Falha ao inicializar o banco de dados no servidor.", err);
            if (callback) callback(err);
            return;
        }
    setDatabase(db);
    app.use("/api", newApiRouter);

        if (process.env.NODE_ENV !== "test") {
            app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}`);
            });
        }
        if (callback) callback(null, app);
    });
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = { startServer, app };

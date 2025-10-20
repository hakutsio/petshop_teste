
const express = require("express");
const router = express.Router();

let dbInstance; 

function setDatabase(db) {
    dbInstance = db;
}

router.post("/products", (req, res) => {
    if (!dbInstance) {
        return res.status(500).json({ error: "Banco de dados não inicializado." });
    }
    const { name, price, stock } = req.body;
    if (!name || !price || !stock) {
        return res.status(400).json({ error: "Nome, preço e estoque são obrigatórios." });
    }
    dbInstance.run("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", [name, price, stock], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, price, stock });
    });
});

router.get("/products", (req, res) => {
    if (!dbInstance) {
        return res.status(500).json({ error: "Banco de dados não inicializado." });
    }
    dbInstance.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

router.post("/services", (req, res) => {
    if (!dbInstance) {
        return res.status(500).json({ error: "Banco de dados não inicializado." });
    }
    const { name, description, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: "Nome e preço são obrigatórios." });
    }
    dbInstance.run("INSERT INTO services (name, description, price) VALUES (?, ?, ?)", [name, description, price], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, description, price });
    });
});

router.get("/services", (req, res) => {
    if (!dbInstance) {
        return res.status(500).json({ error: "Banco de dados não inicializado." });
    }
    dbInstance.all("SELECT * FROM services", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

module.exports = { router, setDatabase };


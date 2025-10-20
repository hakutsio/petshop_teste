
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

let dbPath;
let dbInstance;

function initializeDatabase(callback) {
    if (process.env.NODE_ENV === "test") {
        dbInstance = new sqlite3.Database(":memory:", (err) => {
            if (err) {
                console.error("Erro ao abrir o banco de dados em memória:", err.message);
                if (callback) callback(err);
            } else {
                console.log("Conectado ao banco de dados SQLite em memória para testes.");
                dbInstance.serialize(() => {
                    dbInstance.run(`CREATE TABLE IF NOT EXISTS products (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        price REAL NOT NULL,
                        stock INTEGER NOT NULL
                    )`, (err) => {
                        if (err) console.error("Erro ao criar tabela products (testes):", err.message);
                    });
                    dbInstance.run(`CREATE TABLE IF NOT EXISTS services (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        description TEXT,
                        price REAL NOT NULL
                    )`, (err) => {
                        if (err) console.error("Erro ao criar tabela services (testes):", err.message);
                        if (callback) callback(null, dbInstance);
                    });
                });
            }
        });
    } else {
        dbPath = path.resolve(__dirname, "petshop.db");
        dbInstance = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error("Erro ao abrir o banco de dados:", err.message);
                if (callback) callback(err);
            } else {
                console.log("Conectado ao banco de dados SQLite.");
                dbInstance.serialize(() => {
                    dbInstance.run(`CREATE TABLE IF NOT EXISTS products (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        price REAL NOT NULL,
                        stock INTEGER NOT NULL
                    )`, (err) => {
                        if (err) console.error("Erro ao criar tabela products:", err.message);
                    });
                    dbInstance.run(`CREATE TABLE IF NOT EXISTS services (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        description TEXT,
                        price REAL NOT NULL
                    )`, (err) => {
                        if (err) console.error("Erro ao criar tabela services:", err.message);
                        if (callback) callback(null, dbInstance);
                    });
                });
            }
        });
    }
}

module.exports = { initializeDatabase, dbPath };


const mysql = require("mysql2/promise");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

async function connectDb() {
    const dbType = process.env.DB_TYPE || "sqlite";

    console.log(`dbType: ${dbType}, process.env.DB_TYPE: ${process.env.DB_TYPE}`);

    if (dbType === "mysql") {
        return mysql.createConnection({
            host: process.env.MYSQL_HOST || "mysql-db",
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASSWORD || "secret",
            database: process.env.MYSQL_DATABASE || "leaderboard"
        });
    } else {
        const dbPath = path.join(__dirname, "leaderboard.db");
        const db = new sqlite3.Database(dbPath);

        db.query = (sql, params = []) => {
            return new Promise((resolve, reject) => {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve([rows]);
                });
            });
        };

        return db;
    }
}

module.exports = { connectDb };

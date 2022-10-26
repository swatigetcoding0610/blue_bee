const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const app = express();

const db = new sqlite3.Database("./platform.db");

const mainSchema = () => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL DEFAULT 0,
        quantity INTEGER DEFAULT 0
    )`
  ).run();
  db.prepare(
    `CREATE TABLE IF NOT EXISTS userInfo (
        user_id INTEGER PRIMARY KEY,
        email TEXT NOT NULL,
        password TEXT DEFAULT 0,
        create_at INTEGER DEFAULT 0
    )`
  ).run();
  db.prepare(
    `CREATE TABLE IF NOT EXISTS userLoginInfo (
        user_id INTEGER PRIMARY KEY,
        password TEXT DEFAULT 0,
    )`
  ).run();
};

mainSchema();

app.use(express.static("public"));

const userRouter = require("./routes/users");

app.use("/users", userRouter);

app.listen(3001);

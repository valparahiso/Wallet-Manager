'use-strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './db/wallet_manager.sqlite';

const path = require('path')
const dbPath = path.resolve(__dirname, DBSOURCE)

const db = new sqlite.Database(dbPath, (err) => { 
    if(err) {
        console.error(err.message);
        throw err;
    }

});

// let foreign keys constraints work
db.get("PRAGMA foreign_keys = ON");

module.exports = db;
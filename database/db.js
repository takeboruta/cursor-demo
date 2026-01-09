const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'todo.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('データベース接続エラー:', err.message);
    } else {
        console.log('データベースに接続しました:', dbPath);
        initializeDatabase();
    }
});

// データベースの初期化
function initializeDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('スキーマ初期化エラー:', err.message);
        } else {
            console.log('データベーススキーマを初期化しました');
        }
    });
}

// Promise ラッパー関数
db.runAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
};

db.getAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

db.allAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = db;

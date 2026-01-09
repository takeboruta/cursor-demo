-- SQLiteスキーマ（参考用・ローカル開発用）
-- このファイルは参考用です。本番環境ではPostgreSQLを使用します。

-- 分類マスタテーブル
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#007AFF',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- タスクテーブル
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    category_id INTEGER,
    due_date DATETIME,
    priority INTEGER DEFAULT 2,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- サブタスクテーブル
CREATE TABLE IF NOT EXISTS subtasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 初期データ（分類マスタ）
INSERT OR IGNORE INTO categories (name, color) VALUES 
    ('仕事', '#007AFF'),
    ('プライベート', '#34C759'),
    ('勉強', '#FF9500'),
    ('その他', '#8E8E93');

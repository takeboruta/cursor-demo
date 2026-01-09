const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// 環境変数からデータベース接続情報を取得
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.warn('警告: DATABASE_URL環境変数が設定されていません。');
    console.warn('Supabaseの接続文字列を設定してください。');
    console.warn('例: postgresql://user:password@host:port/database');
}

// PostgreSQL接続プールを作成
// Vercelのサーバーレス環境では、接続プールを使用して効率的に接続を管理
const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl && databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : false,
    // サーバーレス環境での接続設定
    max: 1, // サーバーレス環境では接続数を最小限に
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// 接続エラーハンドリング
pool.on('error', (err) => {
    console.error('予期しないデータベース接続エラー:', err);
});

// スキーマファイルのパス
const schemaPath = path.join(__dirname, 'schema.sql');

// データベースの初期化（テーブルが存在しない場合に作成）
async function initializeDatabase() {
    try {
        // スキーマファイルを読み込む
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // スキーマを実行（IF NOT EXISTSを使用しているので、既存のテーブルには影響しない）
        const client = await pool.connect();
        try {
            await client.query(schema);
            console.log('データベーススキーマを確認/初期化しました');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('データベース初期化エラー:', error.message);
        // エラーが発生してもアプリは続行可能（テーブルが既に存在する可能性があるため）
    }
}

// 初回接続時にデータベースを初期化
let initialized = false;
async function ensureInitialized() {
    if (!initialized) {
        await initializeDatabase();
        initialized = true;
    }
}

// Promise ラッパー関数（既存のコードとの互換性のため）
const db = {
    // クエリ実行（SELECTなど、結果を返すクエリ）
    query: async (text, params) => {
        await ensureInitialized();
        const client = await pool.connect();
        try {
            const result = await client.query(text, params);
            return result.rows;
        } finally {
            client.release();
        }
    },
    
    // クエリ実行（INSERT, UPDATE, DELETEなど）
    runAsync: async (text, params = []) => {
        await ensureInitialized();
        const client = await pool.connect();
        try {
            const result = await client.query(text, params);
            // PostgreSQLでは、INSERTの場合はRETURNING句でIDを取得
            // 互換性のため、lastIDとchangesを返す
            return {
                id: result.rows[0]?.id || null,
                changes: result.rowCount || 0
            };
        } finally {
            client.release();
        }
    },
    
    // 単一行取得
    getAsync: async (text, params = []) => {
        await ensureInitialized();
        const client = await pool.connect();
        try {
            const result = await client.query(text, params);
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    },
    
    // 複数行取得
    allAsync: async (text, params = []) => {
        await ensureInitialized();
        const client = await pool.connect();
        try {
            const result = await client.query(text, params);
            return result.rows;
        } finally {
            client.release();
        }
    },
    
    // 接続プールへの直接アクセス（必要に応じて）
    pool: pool
};

module.exports = db;

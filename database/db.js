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
    connectionTimeoutMillis: 10000, // 接続タイムアウトを延長
});

// 接続エラーハンドリング
pool.on('error', (err) => {
    console.error('❌ 予期しないデータベース接続エラー:', err);
    console.error('エラー詳細:', err.stack);
});

// 接続テスト
if (databaseUrl) {
    pool.connect()
        .then(client => {
            console.log('✅ データベース接続成功');
            client.release();
        })
        .catch(err => {
            console.error('❌ データベース接続失敗:', err.message);
            console.error('接続文字列:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // パスワードをマスク
        });
}

// スキーマファイルのパス
const schemaPath = path.join(__dirname, 'schema.sql');

// データベースの初期化（テーブルが存在しない場合に作成）
async function initializeDatabase() {
    try {
        if (!databaseUrl) {
            throw new Error('DATABASE_URL環境変数が設定されていません');
        }
        
        // スキーマファイルを読み込む
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // スキーマを実行（IF NOT EXISTSを使用しているので、既存のテーブルには影響しない）
        const client = await pool.connect();
        try {
            await client.query(schema);
            console.log('✅ データベーススキーマを確認/初期化しました');
        } catch (error) {
            console.error('❌ データベース初期化エラー:', error.message);
            console.error('エラー詳細:', error);
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ データベース初期化エラー:', error.message);
        console.error('エラー詳細:', error);
        // エラーが発生してもアプリは続行可能（テーブルが既に存在する可能性があるため）
        // ただし、接続エラーの場合は致命的
        if (error.message.includes('DATABASE_URL') || error.message.includes('connection')) {
            throw error;
        }
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
        } catch (error) {
            console.error('データベースクエリエラー:', error.message);
            console.error('SQL:', text);
            console.error('パラメータ:', params);
            throw error;
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
        } catch (error) {
            console.error('データベースクエリエラー:', error.message);
            console.error('SQL:', text);
            console.error('パラメータ:', params);
            throw error;
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
        } catch (error) {
            console.error('データベースクエリエラー:', error.message);
            console.error('SQL:', text);
            console.error('パラメータ:', params);
            throw error;
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
        } catch (error) {
            console.error('データベースクエリエラー:', error.message);
            console.error('SQL:', text);
            console.error('パラメータ:', params);
            throw error;
        } finally {
            client.release();
        }
    },
    
    // 接続プールへの直接アクセス（必要に応じて）
    pool: pool
};

module.exports = db;

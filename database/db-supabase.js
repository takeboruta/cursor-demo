const supabase = require('./supabase-client');
const fs = require('fs');
const path = require('path');

// スキーマファイルのパス
const schemaPath = path.join(__dirname, 'schema.sql');

// データベースの初期化（テーブルが存在しない場合に作成）
async function initializeDatabase() {
    try {
        // Supabaseクライアントを使用してスキーマを実行
        // 注意: Supabaseクライアントでは直接SQLを実行できないため、
        // SupabaseダッシュボードのSQL Editorで手動実行する必要があります
        console.log('ℹ️  スキーマの初期化はSupabaseダッシュボードのSQL Editorで実行してください');
        console.log(`   ファイル: ${schemaPath}`);
    } catch (error) {
        console.error('❌ データベース初期化エラー:', error.message);
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

// Supabaseクライアントを使用したPromiseラッパー関数
const db = {
    // クエリ実行（SELECTなど、結果を返すクエリ）
    query: async (text, params) => {
        await ensureInitialized();
        // Supabaseクライアントでは直接SQLを実行できないため、
        // RPC関数を使用するか、テーブル操作を使用する必要があります
        throw new Error('Supabaseクライアントでは直接SQLクエリは実行できません。テーブル操作を使用してください。');
    },
    
    // クエリ実行（INSERT, UPDATE, DELETEなど）
    runAsync: async (text, params = []) => {
        await ensureInitialized();
        throw new Error('Supabaseクライアントでは直接SQLクエリは実行できません。テーブル操作を使用してください。');
    },
    
    // 単一行取得
    getAsync: async (text, params = []) => {
        await ensureInitialized();
        throw new Error('Supabaseクライアントでは直接SQLクエリは実行できません。テーブル操作を使用してください。');
    },
    
    // 複数行取得
    allAsync: async (text, params = []) => {
        await ensureInitialized();
        throw new Error('Supabaseクライアントでは直接SQLクエリは実行できません。テーブル操作を使用してください。');
    },
    
    // Supabaseクライアントへの直接アクセス
    supabase: supabase
};

module.exports = db;

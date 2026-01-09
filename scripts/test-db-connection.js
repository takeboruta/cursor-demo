require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ DATABASE_URL環境変数が設定されていません');
    process.exit(1);
}

console.log('🔍 データベース接続をテストしています...');
console.log('接続先:', databaseUrl.replace(/:[^:@]+@/, ':****@'));

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : false,
});

pool.connect()
    .then(async (client) => {
        console.log('✅ データベース接続成功！');
        
        try {
            // テーブルの存在確認
            const tablesResult = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            `);
            
            console.log('\n📊 存在するテーブル:');
            if (tablesResult.rows.length === 0) {
                console.log('  ⚠️  テーブルが存在しません');
            } else {
                tablesResult.rows.forEach(row => {
                    console.log(`  - ${row.table_name}`);
                });
            }
            
            // categoriesテーブルの確認
            if (tablesResult.rows.some(r => r.table_name === 'categories')) {
                const categoriesResult = await client.query('SELECT COUNT(*) as count FROM categories');
                console.log(`\n📁 categoriesテーブル: ${categoriesResult.rows[0].count}件のレコード`);
            }
            
            // tasksテーブルの確認
            if (tablesResult.rows.some(r => r.table_name === 'tasks')) {
                const tasksResult = await client.query('SELECT COUNT(*) as count FROM tasks');
                console.log(`📁 tasksテーブル: ${tasksResult.rows[0].count}件のレコード`);
            }
            
        } catch (error) {
            console.error('❌ クエリ実行エラー:', error.message);
            console.error('エラー詳細:', error);
        } finally {
            client.release();
            await pool.end();
        }
    })
    .catch((err) => {
        console.error('❌ データベース接続失敗:');
        console.error('エラーメッセージ:', err.message);
        console.error('エラー詳細:', err);
        process.exit(1);
    });

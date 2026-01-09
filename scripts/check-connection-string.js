require('dotenv').config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ DATABASE_URL環境変数が設定されていません');
    process.exit(1);
}

console.log('📋 接続文字列の解析:');
console.log('');

// 接続文字列を解析
const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
const match = databaseUrl.match(urlPattern);

if (match) {
    const [, user, password, host, port, database] = match;
    console.log('✅ 接続文字列の形式は正しいです');
    console.log('');
    console.log('接続情報:');
    console.log(`  ユーザー: ${user}`);
    console.log(`  パスワード: ${password.substring(0, 3)}...${password.substring(password.length - 3)}`);
    console.log(`  ホスト: ${host}`);
    console.log(`  ポート: ${port}`);
    console.log(`  データベース: ${database}`);
    console.log('');
    
    // ホスト名の形式チェック
    if (host.includes('supabase.co')) {
        console.log('ℹ️  Supabaseのホスト名が検出されました');
        if (host.startsWith('db.')) {
            console.log('   形式: 直接接続（Transaction mode）');
        } else if (host.includes('pooler.supabase.com')) {
            console.log('   形式: 接続プーラー経由（Session mode）');
        } else {
            console.log('   ⚠️  予期しないホスト名形式です');
        }
    }
    
    // DNS解決テスト
    const dns = require('dns');
    console.log('');
    console.log('🔍 DNS解決をテストしています...');
    dns.lookup(host, (err, address) => {
        if (err) {
            console.error(`❌ DNS解決失敗: ${err.message}`);
            console.error('');
            console.error('考えられる原因:');
            console.error('  1. ホスト名が間違っている');
            console.error('  2. ネットワーク接続の問題');
            console.error('  3. Supabaseプロジェクトが削除または停止されている');
            console.error('');
            console.error('解決方法:');
            console.error('  1. Supabaseダッシュボードで正しい接続文字列を確認');
            console.error('  2. プロジェクトがアクティブであることを確認');
            console.error('  3. 接続文字列の形式を確認（直接接続 vs 接続プーラー）');
        } else {
            console.log(`✅ DNS解決成功: ${host} → ${address}`);
        }
    });
} else {
    console.error('❌ 接続文字列の形式が正しくありません');
    console.error('');
    console.error('正しい形式:');
    console.error('  postgresql://user:password@host:port/database');
    console.error('');
    console.error('現在の接続文字列（マスク済み）:');
    console.error(`  ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
}

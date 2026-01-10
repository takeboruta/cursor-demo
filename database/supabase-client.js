const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// .env.localファイルが存在する場合は読み込む
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

// 環境変数からSupabaseの認証情報を取得
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ エラー: Supabaseの環境変数が設定されていません。');
    console.error('SUPABASE_URL と SUPABASE_ANON_KEY を設定してください。');
    console.error('');
    console.error('Supabaseダッシュボードの「Settings」→「API」から取得できます:');
    console.error('  - Project URL → SUPABASE_URL');
    console.error('  - anon public キー → SUPABASE_ANON_KEY');
    console.error('');
    console.error('現在の環境変数の状態:');
    console.error(`  SUPABASE_URL: ${supabaseUrl ? '設定済み' : '未設定'}`);
    console.error(`  SUPABASE_ANON_KEY: ${supabaseKey ? '設定済み' : '未設定'}`);
    
    // 環境変数が設定されていない場合は、エラーを投げる
    throw new Error('Supabaseの環境変数が設定されていません。.env.localファイルにSUPABASE_URLとSUPABASE_ANON_KEYを設定してください。');
}

// Supabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

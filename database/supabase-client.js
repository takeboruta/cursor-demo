const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 環境変数からSupabaseの認証情報を取得
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  警告: Supabaseの環境変数が設定されていません。');
    console.warn('SUPABASE_URL と SUPABASE_ANON_KEY を設定してください。');
    console.warn('');
    console.warn('Supabaseダッシュボードの「Settings」→「API」から取得できます:');
    console.warn('  - Project URL → SUPABASE_URL');
    console.warn('  - anon public キー → SUPABASE_ANON_KEY');
}

// Supabaseクライアントを作成
const supabase = createClient(
    supabaseUrl || 'https://your-project.supabase.co',
    supabaseKey || 'your-anon-key'
);

module.exports = supabase;

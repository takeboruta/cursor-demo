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

// デバッグ情報（Render環境でのトラブルシューティング用）
const isRender = process.env.RENDER === 'true' || process.env.RENDER_SERVICE_NAME || process.env.RENDER_SERVICE_ID;
if (isRender) {
    console.log('🔍 Render環境を検出しました');
    console.log(`  Render環境変数:`);
    console.log(`    RENDER: ${process.env.RENDER || '未設定'}`);
    console.log(`    RENDER_SERVICE_NAME: ${process.env.RENDER_SERVICE_NAME || '未設定'}`);
    console.log(`    RENDER_SERVICE_ID: ${process.env.RENDER_SERVICE_ID || '未設定'}`);
    console.log(`  Supabase環境変数の状態:`);
    console.log(`    SUPABASE_URL: ${supabaseUrl ? '設定済み (' + supabaseUrl.substring(0, 50) + '...)' : '未設定'}`);
    console.log(`    SUPABASE_ANON_KEY: ${supabaseKey ? '設定済み (' + supabaseKey.substring(0, 50) + '...)' : '未設定'}`);
    
    // 環境変数の実際の値を確認（プレースホルダー値の検出用）
    if (supabaseUrl) {
        if (supabaseUrl.includes('your-project') || supabaseUrl.includes('xxxxx')) {
            console.error(`    ⚠️ 警告: SUPABASE_URLにプレースホルダー値が設定されています: ${supabaseUrl}`);
        }
    }
    if (supabaseKey) {
        if (supabaseKey.includes('your-anon-key') || supabaseKey.includes('xxxxx')) {
            console.error(`    ⚠️ 警告: SUPABASE_ANON_KEYにプレースホルダー値が設定されています: ${supabaseKey.substring(0, 50)}...`);
        }
    }
    
    console.log(`    利用可能なSUPABASE関連の環境変数: ${Object.keys(process.env).filter(k => k.includes('SUPABASE')).join(', ') || 'なし'}`);
    console.log(`  すべての環境変数キー（最初の20個）: ${Object.keys(process.env).slice(0, 20).join(', ')}`);
}

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
    console.error('');
    
    // 環境変数の設定方法を環境に応じて表示
    if (isRender) {
        console.error('Render環境の場合:');
        console.error('  1. Renderダッシュボードの「Environment」セクションで環境変数を設定');
        console.error('  2. 「Save, rebuild, and deploy」ボタンをクリックして再デプロイ');
        console.error('  3. 環境変数のキー名が正確か確認（大文字小文字を含む）');
        throw new Error('Supabaseの環境変数が設定されていません。Renderダッシュボードの「Environment」セクションでSUPABASE_URLとSUPABASE_ANON_KEYを設定し、「Save, rebuild, and deploy」を実行してください。');
    } else {
        console.error('ローカル環境の場合:');
        console.error('  .env.localファイルにSUPABASE_URLとSUPABASE_ANON_KEYを設定してください。');
        throw new Error('Supabaseの環境変数が設定されていません。.env.localファイルにSUPABASE_URLとSUPABASE_ANON_KEYを設定してください。');
    }
}

// Supabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

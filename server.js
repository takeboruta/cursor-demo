const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 環境変数の読み込み（.env.local）
if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    require('dotenv').config({ path: '.env.local' });
}

// ミドルウェア
app.use(express.json());
app.use(express.static('public'));

// CORS設定
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

// Vercel API Routes形式のハンドラーをExpress形式に変換するラッパー
function wrapVercelHandler(handler) {
    return async (req, res) => {
        // Expressのreq.paramsをVercel形式のreq.queryに変換
        if (req.params.id && !req.query.id) {
            req.query.id = req.params.id;
        }
        if (req.params.taskId && !req.query.taskId) {
            req.query.taskId = req.params.taskId;
        }

        // ハンドラーを実行
        try {
            await handler(req, res);
        } catch (error) {
            console.error('API Error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
        }
    };
}

// タスクAPI
app.get('/api/tasks', wrapVercelHandler(require('./api/tasks/index.js')));
app.post('/api/tasks', wrapVercelHandler(require('./api/tasks/index.js')));
app.get('/api/tasks/:id', wrapVercelHandler(require('./api/tasks/[id].js')));
app.put('/api/tasks/:id', wrapVercelHandler(require('./api/tasks/[id].js')));
app.delete('/api/tasks/:id', wrapVercelHandler(require('./api/tasks/[id].js')));
app.patch('/api/tasks/:id/toggle', wrapVercelHandler(require('./api/tasks/[id]/toggle.js')));

// 分類API
app.get('/api/categories', wrapVercelHandler(require('./api/categories/index.js')));
app.post('/api/categories', wrapVercelHandler(require('./api/categories/index.js')));
app.get('/api/categories/:id', wrapVercelHandler(require('./api/categories/[id].js')));
app.put('/api/categories/:id', wrapVercelHandler(require('./api/categories/[id].js')));
app.delete('/api/categories/:id', wrapVercelHandler(require('./api/categories/[id].js')));

// サブタスクAPI
app.get('/api/subtasks', wrapVercelHandler(require('./api/subtasks/index.js')));
app.post('/api/subtasks', wrapVercelHandler(require('./api/subtasks/index.js')));
app.get('/api/subtasks/task/:taskId', wrapVercelHandler(require('./api/subtasks/task/[taskId].js')));
app.get('/api/subtasks/:id', wrapVercelHandler(require('./api/subtasks/[id].js')));
app.put('/api/subtasks/:id', wrapVercelHandler(require('./api/subtasks/[id].js')));
app.delete('/api/subtasks/:id', wrapVercelHandler(require('./api/subtasks/[id].js')));
app.patch('/api/subtasks/:id/toggle', wrapVercelHandler(require('./api/subtasks/[id]/toggle.js')));

// ルートパス
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        console.log(`📝 データベース: ✅ Supabaseクライアントが設定されています`);
        console.log(`   接続先: ${process.env.SUPABASE_URL}`);
    } else {
        console.log(`⚠️  警告: Supabaseの環境変数が設定されていません`);
        console.log(`   .env.localファイルにSUPABASE_URLとSUPABASE_ANON_KEYを設定してください`);
    }
});

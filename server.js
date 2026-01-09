const express = require('express');
const cors = require('cors');
const path = require('path');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供（publicディレクトリ）
app.use(express.static(path.join(__dirname, 'public')));

// APIルート
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

// ルートパスでindex.htmlを提供
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});

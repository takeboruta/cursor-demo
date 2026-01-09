const Category = require('../models/category');

const categoryController = {
    // 全分類を取得
    getAll: async (req, res) => {
        try {
            const categories = await Category.getAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // IDで分類を取得
    getById: async (req, res) => {
        try {
            const category = await Category.getById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: '分類が見つかりません' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 分類を作成
    create: async (req, res) => {
        try {
            const { name, color } = req.body;
            if (!name || name.trim() === '') {
                return res.status(400).json({ error: '分類名が必要です' });
            }
            const category = await Category.create(name.trim(), color || '#007AFF');
            res.status(201).json(category);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'この分類名は既に存在します' });
            }
            res.status(500).json({ error: error.message });
        }
    },

    // 分類を更新
    update: async (req, res) => {
        try {
            const { name, color } = req.body;
            if (!name || name.trim() === '') {
                return res.status(400).json({ error: '分類名が必要です' });
            }
            const category = await Category.update(
                req.params.id,
                name.trim(),
                color || '#007AFF'
            );
            if (!category) {
                return res.status(404).json({ error: '分類が見つかりません' });
            }
            res.json(category);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'この分類名は既に存在します' });
            }
            res.status(500).json({ error: error.message });
        }
    },

    // 分類を削除
    delete: async (req, res) => {
        try {
            const deleted = await Category.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: '分類が見つかりません' });
            }
            res.json({ message: '分類を削除しました' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = categoryController;

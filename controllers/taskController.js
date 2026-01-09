const Task = require('../models/task');

const taskController = {
    // 全タスクを取得
    getAll: async (req, res) => {
        try {
            const tasks = await Task.getAll();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // IDでタスクを取得
    getById: async (req, res) => {
        try {
            const task = await Task.getById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'タスクが見つかりません' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // タスクを作成
    create: async (req, res) => {
        try {
            const { text, category_id } = req.body;
            if (!text || text.trim() === '') {
                return res.status(400).json({ error: 'タスクのテキストが必要です' });
            }
            const task = await Task.create(text.trim(), category_id || null);
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // タスクを更新
    update: async (req, res) => {
        try {
            const { text, completed, category_id } = req.body;
            const task = await Task.update(
                req.params.id,
                text,
                completed,
                category_id
            );
            if (!task) {
                return res.status(404).json({ error: 'タスクが見つかりません' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // タスクの完了状態を切り替え
    toggleComplete: async (req, res) => {
        try {
            const task = await Task.toggleComplete(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'タスクが見つかりません' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // タスクを削除
    delete: async (req, res) => {
        try {
            const deleted = await Task.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'タスクが見つかりません' });
            }
            res.json({ message: 'タスクを削除しました' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = taskController;

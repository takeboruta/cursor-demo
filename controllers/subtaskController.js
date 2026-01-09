const Subtask = require('../models/subtask');

const subtaskController = {
    // タスクIDでサブタスクを全取得
    getByTaskId: async (req, res) => {
        try {
            const subtasks = await Subtask.getByTaskId(req.params.taskId);
            res.json(subtasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // IDでサブタスクを取得
    getById: async (req, res) => {
        try {
            const subtask = await Subtask.getById(req.params.id);
            if (!subtask) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json(subtask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // サブタスクを作成
    create: async (req, res) => {
        try {
            const { task_id, text } = req.body;
            if (!task_id) {
                return res.status(400).json({ error: 'タスクIDが必要です' });
            }
            if (!text || text.trim() === '') {
                return res.status(400).json({ error: 'サブタスクのテキストが必要です' });
            }
            const subtask = await Subtask.create(task_id, text.trim());
            res.status(201).json(subtask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // サブタスクを更新
    update: async (req, res) => {
        try {
            const { text, completed } = req.body;
            const subtask = await Subtask.update(
                req.params.id,
                text,
                completed
            );
            if (!subtask) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json(subtask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // サブタスクの完了状態を切り替え
    toggleComplete: async (req, res) => {
        try {
            const subtask = await Subtask.toggleComplete(req.params.id);
            if (!subtask) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json(subtask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // サブタスクを削除
    delete: async (req, res) => {
        try {
            const deleted = await Subtask.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json({ message: 'サブタスクを削除しました' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = subtaskController;

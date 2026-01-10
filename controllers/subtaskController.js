const Subtask = require('../models/subtask');

const subtaskController = {
    // タスクIDでサブタスクを全取得
    getByTaskId: async (req, res) => {
        try {
            const taskId = req.params.taskId || req.query.taskId;
            if (!taskId) {
                return res.status(400).json({ error: 'タスクIDが必要です' });
            }
            const subtasks = await Subtask.getByTaskId(taskId);
            res.json(subtasks);
        } catch (error) {
            console.error('サブタスク取得エラー:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // IDでサブタスクを取得
    getById: async (req, res) => {
        try {
            const id = req.params.id || req.query.id;
            const subtask = await Subtask.getById(id);
            if (!subtask) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json(subtask);
        } catch (error) {
            console.error('サブタスク取得エラー:', error);
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
            console.error('サブタスク作成エラー:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // サブタスクを更新
    update: async (req, res) => {
        try {
            const id = req.params.id || req.query.id;
            const { text, completed } = req.body;
            
            if (text !== undefined && (!text || text.trim() === '')) {
                return res.status(400).json({ error: 'サブタスクのテキストが必要です' });
            }
            
            const subtask = await Subtask.update(id, text, completed);
            if (!subtask) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json(subtask);
        } catch (error) {
            console.error('サブタスク更新エラー:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // サブタスクの完了状態を切り替え
    toggleComplete: async (req, res) => {
        try {
            const id = req.params.id || req.query.id;
            const subtask = await Subtask.toggleComplete(id);
            if (!subtask) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json(subtask);
        } catch (error) {
            console.error('サブタスク完了状態切り替えエラー:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // サブタスクを削除
    delete: async (req, res) => {
        try {
            const id = req.params.id || req.query.id;
            const deleted = await Subtask.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'サブタスクが見つかりません' });
            }
            res.json({ message: 'サブタスクを削除しました' });
        } catch (error) {
            console.error('サブタスク削除エラー:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = subtaskController;

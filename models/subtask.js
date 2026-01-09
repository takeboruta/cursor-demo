const db = require('../database/db');

class Subtask {
    // タスクIDでサブタスクを全取得
    static async getByTaskId(taskId) {
        try {
            const subtasks = await db.allAsync(
                'SELECT * FROM subtasks WHERE task_id = $1 ORDER BY created_at ASC',
                [taskId]
            );
            return subtasks;
        } catch (error) {
            throw error;
        }
    }

    // IDでサブタスクを取得
    static async getById(id) {
        try {
            const subtask = await db.getAsync(
                'SELECT * FROM subtasks WHERE id = $1',
                [id]
            );
            return subtask;
        } catch (error) {
            throw error;
        }
    }

    // サブタスクを作成
    static async create(taskId, text) {
        try {
            const result = await db.runAsync(
                'INSERT INTO subtasks (task_id, text) VALUES ($1, $2) RETURNING id',
                [taskId, text]
            );
            return await this.getById(result.id);
        } catch (error) {
            throw error;
        }
    }

    // サブタスクを更新
    static async update(id, text, completed) {
        try {
            await db.runAsync(
                'UPDATE subtasks SET text = $1, completed = $2 WHERE id = $3',
                [text, completed, id]
            );
            return await this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // サブタスクの完了状態を切り替え
    static async toggleComplete(id) {
        try {
            const subtask = await this.getById(id);
            if (!subtask) {
                throw new Error('サブタスクが見つかりません');
            }
            const newCompleted = !subtask.completed;
            await db.runAsync(
                'UPDATE subtasks SET completed = $1 WHERE id = $2',
                [newCompleted, id]
            );
            return await this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // サブタスクを削除
    static async delete(id) {
        try {
            const result = await db.runAsync(
                'DELETE FROM subtasks WHERE id = $1',
                [id]
            );
            return result.changes > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Subtask;

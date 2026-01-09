const db = require('../database/db');

class Task {
    // 全タスクを取得（分類情報も含む）
    static async getAll() {
        try {
            const tasks = await db.allAsync(`
                SELECT 
                    t.id,
                    t.text,
                    t.completed,
                    t.category_id,
                    t.created_at,
                    t.updated_at,
                    c.name as category_name,
                    c.color as category_color
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                ORDER BY t.created_at DESC
            `);
            return tasks.map(task => ({
                ...task,
                completed: task.completed === 1
            }));
        } catch (error) {
            throw error;
        }
    }

    // IDでタスクを取得
    static async getById(id) {
        try {
            const task = await db.getAsync(`
                SELECT 
                    t.id,
                    t.text,
                    t.completed,
                    t.category_id,
                    t.created_at,
                    t.updated_at,
                    c.name as category_name,
                    c.color as category_color
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.id = ?
            `, [id]);
            if (task) {
                task.completed = task.completed === 1;
            }
            return task;
        } catch (error) {
            throw error;
        }
    }

    // タスクを作成
    static async create(text, categoryId = null) {
        try {
            const result = await db.runAsync(
                'INSERT INTO tasks (text, category_id) VALUES (?, ?)',
                [text, categoryId]
            );
            return await this.getById(result.id);
        } catch (error) {
            throw error;
        }
    }

    // タスクを更新
    static async update(id, text, completed, categoryId) {
        try {
            await db.runAsync(
                'UPDATE tasks SET text = ?, completed = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [text, completed ? 1 : 0, categoryId, id]
            );
            return await this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // タスクの完了状態を切り替え
    static async toggleComplete(id) {
        try {
            const task = await this.getById(id);
            if (!task) {
                throw new Error('タスクが見つかりません');
            }
            const newCompleted = !task.completed;
            await db.runAsync(
                'UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [newCompleted ? 1 : 0, id]
            );
            return await this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // タスクを削除
    static async delete(id) {
        try {
            const result = await db.runAsync(
                'DELETE FROM tasks WHERE id = ?',
                [id]
            );
            return result.changes > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Task;

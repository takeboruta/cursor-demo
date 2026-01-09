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
                    t.due_date,
                    t.priority,
                    t.created_at,
                    t.updated_at,
                    c.name as category_name,
                    c.color as category_color
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                ORDER BY t.priority ASC, t.created_at DESC
            `);
            return tasks;
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
                    t.due_date,
                    t.priority,
                    t.created_at,
                    t.updated_at,
                    c.name as category_name,
                    c.color as category_color
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.id = $1
            `, [id]);
            return task;
        } catch (error) {
            throw error;
        }
    }

    // タスクを作成
    static async create(text, categoryId = null, dueDate = null, priority = 2) {
        try {
            const result = await db.runAsync(
                'INSERT INTO tasks (text, category_id, due_date, priority) VALUES ($1, $2, $3, $4) RETURNING id',
                [text, categoryId, dueDate, priority]
            );
            return await this.getById(result.id);
        } catch (error) {
            throw error;
        }
    }

    // タスクを更新
    static async update(id, text, completed, categoryId, dueDate = null, priority = 2) {
        try {
            await db.runAsync(
                'UPDATE tasks SET text = $1, completed = $2, category_id = $3, due_date = $4, priority = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
                [text, completed, categoryId, dueDate, priority, id]
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
                'UPDATE tasks SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [newCompleted, id]
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
                'DELETE FROM tasks WHERE id = $1',
                [id]
            );
            return result.changes > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Task;

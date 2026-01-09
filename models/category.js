const db = require('../database/db');

class Category {
    // 全分類を取得
    static async getAll() {
        try {
            const categories = await db.allAsync(
                'SELECT * FROM categories ORDER BY name ASC'
            );
            return categories;
        } catch (error) {
            throw error;
        }
    }

    // IDで分類を取得
    static async getById(id) {
        try {
            const category = await db.getAsync(
                'SELECT * FROM categories WHERE id = ?',
                [id]
            );
            return category;
        } catch (error) {
            throw error;
        }
    }

    // 分類を作成
    static async create(name, color = '#007AFF') {
        try {
            const result = await db.runAsync(
                'INSERT INTO categories (name, color) VALUES (?, ?)',
                [name, color]
            );
            return await this.getById(result.id);
        } catch (error) {
            throw error;
        }
    }

    // 分類を更新
    static async update(id, name, color) {
        try {
            await db.runAsync(
                'UPDATE categories SET name = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [name, color, id]
            );
            return await this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // 分類を削除
    static async delete(id) {
        try {
            const result = await db.runAsync(
                'DELETE FROM categories WHERE id = ?',
                [id]
            );
            return result.changes > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Category;

const supabase = require('../database/supabase-client');

class Task {
    // 全タスクを取得（分類情報も含む）
    static async getAll() {
        try {
            const { data: tasks, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .order('priority', { ascending: true })
                .order('created_at', { ascending: false });
            
            if (tasksError) throw tasksError;
            if (!tasks || tasks.length === 0) return [];
            
            // 分類情報を取得
            const categoryIds = [...new Set(tasks.map(t => t.category_id).filter(Boolean))];
            let categoriesMap = {};
            
            if (categoryIds.length > 0) {
                const { data: categories, error: categoriesError } = await supabase
                    .from('categories')
                    .select('id, name, color')
                    .in('id', categoryIds);
                
                if (categoriesError) throw categoriesError;
                categoriesMap = categories.reduce((acc, cat) => {
                    acc[cat.id] = cat;
                    return acc;
                }, {});
            }
            
            // タスクと分類情報を結合
            return tasks.map(task => ({
                id: task.id,
                text: task.text,
                completed: task.completed,
                category_id: task.category_id,
                due_date: task.due_date,
                priority: task.priority,
                created_at: task.created_at,
                updated_at: task.updated_at,
                category_name: task.category_id ? categoriesMap[task.category_id]?.name || null : null,
                category_color: task.category_id ? categoriesMap[task.category_id]?.color || null : null
            }));
        } catch (error) {
            throw error;
        }
    }

    // IDでタスクを取得
    static async getById(id) {
        try {
            const { data: task, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            if (!task) return null;
            
            // 分類情報を取得
            let category = null;
            if (task.category_id) {
                const { data: cat, error: catError } = await supabase
                    .from('categories')
                    .select('name, color')
                    .eq('id', task.category_id)
                    .single();
                
                if (!catError && cat) {
                    category = cat;
                }
            }
            
            return {
                id: task.id,
                text: task.text,
                completed: task.completed,
                category_id: task.category_id,
                due_date: task.due_date,
                priority: task.priority,
                created_at: task.created_at,
                updated_at: task.updated_at,
                category_name: category?.name || null,
                category_color: category?.color || null
            };
        } catch (error) {
            throw error;
        }
    }

    // タスクを作成
    static async create(text, categoryId = null, dueDate = null, priority = 2) {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    text,
                    category_id: categoryId,
                    due_date: dueDate,
                    priority
                })
                .select()
                .single();
            
            if (error) throw error;
            return await this.getById(data.id);
        } catch (error) {
            throw error;
        }
    }

    // タスクを更新
    static async update(id, text, completed, categoryId, dueDate = null, priority = 2) {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({
                    text,
                    completed,
                    category_id: categoryId,
                    due_date: dueDate,
                    priority,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return await this.getById(data.id);
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
            
            const { data, error } = await supabase
                .from('tasks')
                .update({
                    completed: newCompleted,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return await this.getById(data.id);
        } catch (error) {
            throw error;
        }
    }

    // タスクを削除
    static async delete(id) {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Task;

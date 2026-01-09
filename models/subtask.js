const supabase = require('../database/supabase-client');

class Subtask {
    // タスクIDでサブタスクを全取得
    static async getByTaskId(taskId) {
        try {
            const { data, error } = await supabase
                .from('subtasks')
                .select('*')
                .eq('task_id', taskId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }

    // IDでサブタスクを取得
    static async getById(id) {
        try {
            const { data, error } = await supabase
                .from('subtasks')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    // サブタスクを作成
    static async create(taskId, text) {
        try {
            const { data, error } = await supabase
                .from('subtasks')
                .insert({ task_id: taskId, text })
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    // サブタスクを更新
    static async update(id, text, completed) {
        try {
            const { data, error } = await supabase
                .from('subtasks')
                .update({ text, completed })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
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
            
            const { data, error } = await supabase
                .from('subtasks')
                .update({ completed: newCompleted })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    // サブタスクを削除
    static async delete(id) {
        try {
            const { error } = await supabase
                .from('subtasks')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Subtask;

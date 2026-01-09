const supabase = require('../database/supabase-client');

class Category {
    // 全分類を取得
    static async getAll() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }

    // IDで分類を取得
    static async getById(id) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    // 分類を作成
    static async create(name, color = '#007AFF') {
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name, color })
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    // 分類を更新
    static async update(id, name, color) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .update({ name, color, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    // 分類を削除
    static async delete(id) {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Category;

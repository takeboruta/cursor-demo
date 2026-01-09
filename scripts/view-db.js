const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'todo.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('データベース接続エラー:', err.message);
        process.exit(1);
    }
    console.log('データベースに接続しました:', dbPath);
    console.log('\n=== データベース内容 ===\n');
    
    // 分類テーブルの内容を表示
    db.all('SELECT * FROM categories ORDER BY id', [], (err, rows) => {
        if (err) {
            console.error('分類データの取得エラー:', err.message);
        } else {
            console.log('📁 分類マスタ:');
            if (rows.length === 0) {
                console.log('  (データなし)');
            } else {
                console.table(rows);
            }
            console.log('');
        }
        
        // タスクテーブルの内容を表示
        db.all(`
            SELECT 
                t.id,
                t.text,
                t.completed,
                t.category_id,
                c.name as category_name,
                t.created_at,
                t.updated_at
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            ORDER BY t.id
        `, [], (err, rows) => {
            if (err) {
                console.error('タスクデータの取得エラー:', err.message);
            } else {
                console.log('📝 タスク:');
                if (rows.length === 0) {
                    console.log('  (データなし)');
                } else {
                    const formattedRows = rows.map(row => ({
                        id: row.id,
                        text: row.text,
                        completed: row.completed === 1 ? '✓' : '✗',
                        category: row.category_name || '(なし)',
                        created_at: row.created_at
                    }));
                    console.table(formattedRows);
                }
            }
            
            // 統計情報
            db.get('SELECT COUNT(*) as count FROM tasks', [], (err, row) => {
                if (!err) {
                    const taskCount = row.count;
                    db.get('SELECT COUNT(*) as count FROM categories', [], (err, row2) => {
                        if (!err) {
                            const categoryCount = row2.count;
                            console.log('\n📊 統計:');
                            console.log(`  タスク数: ${taskCount}`);
                            console.log(`  分類数: ${categoryCount}`);
                        }
                        db.close();
                    });
                } else {
                    db.close();
                }
            });
        });
    });
});

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// 全タスクを取得
router.get('/', taskController.getAll);

// IDでタスクを取得
router.get('/:id', taskController.getById);

// タスクを作成
router.post('/', taskController.create);

// タスクを更新
router.put('/:id', taskController.update);

// タスクの完了状態を切り替え
router.patch('/:id/toggle', taskController.toggleComplete);

// タスクを削除
router.delete('/:id', taskController.delete);

module.exports = router;

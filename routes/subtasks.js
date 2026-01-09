const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');

// タスクIDでサブタスクを全取得
router.get('/task/:taskId', subtaskController.getByTaskId);

// IDでサブタスクを取得
router.get('/:id', subtaskController.getById);

// サブタスクを作成
router.post('/', subtaskController.create);

// サブタスクを更新
router.put('/:id', subtaskController.update);

// サブタスクの完了状態を切り替え
router.patch('/:id/toggle', subtaskController.toggleComplete);

// サブタスクを削除
router.delete('/:id', subtaskController.delete);

module.exports = router;

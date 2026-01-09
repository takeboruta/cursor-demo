const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// 全分類を取得
router.get('/', categoryController.getAll);

// IDで分類を取得
router.get('/:id', categoryController.getById);

// 分類を作成
router.post('/', categoryController.create);

// 分類を更新
router.put('/:id', categoryController.update);

// 分類を削除
router.delete('/:id', categoryController.delete);

module.exports = router;

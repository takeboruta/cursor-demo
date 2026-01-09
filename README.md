# Todo List App

タスク管理アプリケーション（データベース保存対応）

## 機能

- タスクの追加・完了・削除
- 分類マスタ管理
- タスクに分類を設定
- データベース保存（SQLite）

## セットアップ

```bash
# 依存関係のインストール
npm install

# サーバー起動
npm start

# 開発モード（自動再起動）
npm run dev
```

## データベースの確認方法

### 方法1: 管理スクリプトを使用（推奨）

```bash
npm run view-db
```

### 方法2: SQLiteコマンドラインツールを使用

```bash
# SQLiteがインストールされている場合
sqlite3 database/todo.db

# SQLite内で実行
.tables              # テーブル一覧
SELECT * FROM categories;  # 分類データ
SELECT * FROM tasks;       # タスクデータ
.quit                # 終了
```

### 方法3: データベースビューアーツール

以下のツールを使用できます：
- **DB Browser for SQLite** (https://sqlitebrowser.org/)
- **TablePlus** (https://tableplus.com/)
- **VS Code拡張機能**: SQLite Viewer

データベースファイルの場所: `database/todo.db`

## 開発フロー

### ブランチ戦略

1. **機能開発ブランチを作成**
   ```bash
   git checkout -b feature/機能名
   # 例: git checkout -b feature/add-search
   ```

2. **変更をコミット**
   ```bash
   git add .
   git commit -m "feat: 機能の説明"
   ```

3. **ブランチをプッシュ**
   ```bash
   git push origin feature/機能名
   ```

4. **GitHubでPull Requestを作成**
   - GitHubのリポジトリページで「Compare & pull request」をクリック
   - タイトルと説明を記入
   - レビュアーを指定（必要に応じて）
   - 「Create pull request」をクリック

5. **レビュー後、マージ**
   - レビューが承認されたら、mainブランチにマージ
   - マージ後、ローカルのmainブランチを更新
   ```bash
   git checkout main
   git pull origin main
   ```

## API エンドポイント

### タスク
- `GET /api/tasks` - 全タスク取得
- `GET /api/tasks/:id` - タスク取得
- `POST /api/tasks` - タスク作成
- `PUT /api/tasks/:id` - タスク更新
- `PATCH /api/tasks/:id/toggle` - 完了状態切り替え
- `DELETE /api/tasks/:id` - タスク削除

### 分類
- `GET /api/categories` - 全分類取得
- `GET /api/categories/:id` - 分類取得
- `POST /api/categories` - 分類作成
- `PUT /api/categories/:id` - 分類更新
- `DELETE /api/categories/:id` - 分類削除

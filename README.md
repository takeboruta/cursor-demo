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

## デプロイ方法

### Render（推奨）

1. **アカウント作成**
   - [Render](https://render.com/)にアクセスしてアカウントを作成
   - GitHubアカウントで連携可能

2. **新しいWebサービスを作成**
   - 「New」→「Web Service」を選択
   - GitHubリポジトリを選択: `takeboruta/cursor-demo`
   - 設定:
     - **Name**: `todo-app`（任意）
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free（無料プラン）

3. **デプロイ**
   - 「Create Web Service」をクリック
   - 自動的にビルドとデプロイが開始されます
   - デプロイ完了後、提供されるURLでアクセス可能

### Railway

1. **アカウント作成**
   - [Railway](https://railway.app/)にアクセス
   - GitHubアカウントで連携

2. **プロジェクト作成**
   - 「New Project」→「Deploy from GitHub repo」を選択
   - リポジトリを選択
   - 自動的にデプロイが開始されます

### Fly.io

1. **Fly CLIのインストール**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **デプロイ**
   ```bash
   fly launch
   fly deploy
   ```

### 注意点

- **データベース**: SQLiteファイルは一時ファイルシステムに保存されます（再起動時にリセットされる可能性あり）
- **本番環境**: 本番環境ではPostgreSQLなどの永続的なデータベースの使用を推奨
- **環境変数**: 各プラットフォームで環境変数を設定可能

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

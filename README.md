# Todo List App

タスク管理アプリケーション（Vercel + Supabase構成）

## 機能

- タスクの追加・完了・削除
- 分類マスタ管理
- タスクに分類を設定
- サブタスク機能
- 期限日・優先度設定
- カレンダー表示・リスト表示の切り替え
- 検索・フィルター機能
- データベース保存（Supabase PostgreSQL）

## セットアップ

### ローカル開発環境

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
# .env.local ファイルを作成し、以下を設定:
# DATABASE_URL=postgresql://user:password@host:port/database
# 
# Supabaseの場合、接続文字列は以下の形式:
# postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
# 
# Supabaseダッシュボードの「Settings」→「Database」→「Connection string」から取得可能

# 開発サーバー起動（Vercel CLI使用）
npm run dev
```

### Supabaseプロジェクトのセットアップ

1. **Supabaseプロジェクトを作成**
   - [Supabase](https://supabase.com/)にアクセス
   - 新しいプロジェクトを作成

2. **データベーススキーマの適用**
   - 方法1: アプリ起動時に自動的にテーブルが作成されます（`database/db.js`の`initializeDatabase`関数）
   - 方法2: 手動でスキーマを適用する場合
     - Supabaseダッシュボードの「SQL Editor」を開く
     - `database/schema.sql`の内容をコピー＆ペースト
     - 「Run」をクリックしてスキーマを適用

3. **環境変数の取得**
   - Supabaseダッシュボードの「Settings」→「Database」を開く
   - 「Connection string」セクションで「URI」を選択
   - 接続文字列をコピー（パスワード部分を実際のパスワードに置き換える）
   - `DATABASE_URL`環境変数として設定

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

## データベースの確認方法（Supabase）

### Supabaseダッシュボードを使用

1. **Supabaseダッシュボードにアクセス**
   - プロジェクトのダッシュボードを開く

2. **Table Editor**
   - 左メニューの「Table Editor」をクリック
   - テーブル一覧が表示され、データを確認・編集可能

3. **SQL Editor**
   - 左メニューの「SQL Editor」をクリック
   - SQLクエリを実行してデータを確認
   ```sql
   SELECT * FROM categories;
   SELECT * FROM tasks;
   SELECT * FROM subtasks;
   ```

## デプロイ方法（Render / Railway / Fly.io + Supabase）

### 1. Supabaseプロジェクトの準備

1. **Supabaseプロジェクトを作成**
   - [Supabase](https://supabase.com/)でプロジェクトを作成
   - `database/schema.sql`をSQL Editorで実行してスキーマを適用

2. **環境変数を取得**
   - Supabaseダッシュボードの「Settings」→「API」を開く
   - `Project URL` → `SUPABASE_URL`として使用
   - `anon public`キー → `SUPABASE_ANON_KEY`として使用

### 2. Renderへのデプロイ（推奨）

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

3. **環境変数を設定**
   - 「Environment」セクションで以下を追加:
     - `SUPABASE_URL`: `https://caugqusfzpbdrmlryffw.supabase.co`
     - `SUPABASE_ANON_KEY`: Supabaseのanon publicキー

4. **デプロイ**
   - 「Create Web Service」をクリック
   - 自動的にビルドとデプロイが開始されます
   - デプロイ完了後、提供されるURLでアクセス可能

### 3. Railwayへのデプロイ

1. **アカウント作成**
   - [Railway](https://railway.app/)にアクセス
   - GitHubアカウントで連携

2. **プロジェクト作成**
   - 「New Project」→「Deploy from GitHub repo」を選択
   - リポジトリを選択
   - 環境変数を設定:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
   - 自動的にデプロイが開始されます

### 4. Fly.ioへのデプロイ

1. **Fly CLIのインストール**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **ログイン**
   ```bash
   fly auth login
   ```

3. **デプロイ**
   ```bash
   fly launch
   fly secrets set SUPABASE_URL=https://caugqusfzpbdrmlryffw.supabase.co
   fly secrets set SUPABASE_ANON_KEY=your-anon-key
   fly deploy
   ```

### 注意点

- **データベース**: Supabase PostgreSQLを使用（永続的なデータベース）
- **環境変数**: 各プラットフォームで`SUPABASE_URL`と`SUPABASE_ANON_KEY`を設定
- **自動デプロイ**: GitHubにプッシュすると自動的にデプロイされます（Render/Railway）

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

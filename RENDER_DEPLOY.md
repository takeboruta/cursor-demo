# Renderへのデプロイ手順

このドキュメントでは、TodoアプリをRenderにデプロイする詳細な手順を説明します。

## 前提条件

- GitHubアカウント
- Renderアカウント（無料プランでOK）
- Supabaseプロジェクト（データベース用）

## ステップ1: Supabaseプロジェクトの準備

### 1.1 Supabaseプロジェクトを作成（まだの場合）

1. [Supabase](https://supabase.com/)にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力して作成

### 1.2 データベーススキーマの適用

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `database/schema.sql`の内容をコピー＆ペースト
3. 「Run」をクリックして実行

### 1.3 環境変数の取得

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の値をメモしておく：
   - **Project URL** → `SUPABASE_URL`として使用
   - **anon public**キー → `SUPABASE_ANON_KEY`として使用

## ステップ2: Renderアカウントの作成とGitHub連携

### 2.1 Renderアカウント作成

1. [Render](https://render.com/)にアクセス
2. 「Get Started for Free」をクリック
3. GitHubアカウントでサインアップ

### 2.2 GitHubリポジトリの確認

- このプロジェクトがGitHubにプッシュされていることを確認
- リポジトリのURLをメモしておく

## ステップ3: RenderでWebサービスを作成

### 3.1 新しいWebサービスの作成

1. Renderダッシュボードで「New +」→「Web Service」を選択
2. GitHubリポジトリを選択（または「Connect account」で連携）
3. リポジトリ `takeboruta/cursor-demo` を選択

### 3.2 サービス設定

以下の設定を入力：

- **Name**: `todo-app`（任意の名前）
- **Region**: 最寄りのリージョンを選択（例: `Singapore (ap-southeast-1)`）
- **Branch**: `main`（またはデプロイしたいブランチ）
- **Root Directory**: （空欄のまま）
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`（無料プラン）

### 3.3 環境変数の設定

「Environment Variables」セクションで以下の環境変数を追加：

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | SupabaseのProject URL（例: `https://xxxxx.supabase.co`） |
| `SUPABASE_ANON_KEY` | Supabaseのanon publicキー |
| `NODE_ENV` | `production`（オプション） |

**注意**: 
- `SUPABASE_URL`と`SUPABASE_ANON_KEY`は必須です
- 値に引用符（`"`）は不要です
- キー名は大文字小文字を正確に入力してください

### 3.4 デプロイの開始

1. 「Create Web Service」をクリック
2. 自動的にビルドとデプロイが開始されます
3. ログを確認してエラーがないか確認

## ステップ4: デプロイの確認

### 4.1 デプロイログの確認

- Renderダッシュボードの「Logs」タブでビルド・デプロイの進行状況を確認
- エラーがある場合はログを確認して修正

### 4.2 アプリケーションの動作確認

- デプロイ完了後、提供されるURL（例: `https://todo-app.onrender.com`）にアクセス
- アプリケーションが正常に動作するか確認
- タスクの作成・編集・削除ができるか確認

## ステップ5: 自動デプロイの設定（オプション）

Renderでは、GitHubにプッシュするたびに自動的にデプロイされます。

- **自動デプロイ**: 有効（デフォルト）
- **Manual Deploy**: 手動デプロイが必要な場合は「Manual Deploy」を選択

## トラブルシューティング

### ビルドエラー

**エラー**: `npm install`が失敗する
- **解決策**: `package.json`の依存関係を確認
- Node.jsのバージョンを確認（`engines.node`で指定）

**エラー**: モジュールが見つからない
- **解決策**: `package.json`に必要なパッケージが全て`dependencies`に含まれているか確認

### 起動エラー

**エラー**: サーバーが起動しない
- **解決策**: `server.js`が正しく存在するか確認
- `package.json`の`start`スクリプトが`node server.js`になっているか確認
- PORT環境変数が正しく設定されているか確認（Renderは自動設定）

**エラー**: データベース接続エラー
- **解決策**: 環境変数`SUPABASE_URL`と`SUPABASE_ANON_KEY`が正しく設定されているか確認
- Supabaseプロジェクトがアクティブか確認
- SupabaseのAPIキーが正しいか確認

### ランタイムエラー

**エラー**: ページが表示されない
- **解決策**: ログでエラー内容を確認
- 静的ファイル（`public`フォルダ）が正しく配置されているか確認
- `server.js`で静的ファイルの配信設定を確認

## Renderの無料プランの制限事項

- **スピンアップ時間**: 15分間の非アクセス後にスリープします
- **レスポンス時間**: 初回アクセス時に起動するため、30秒程度かかる場合があります
- **帯域幅**: 100GB/月
- **同時実行数**: 制限あり

**スリープを回避する方法**:
- 定期的にアクセスする（cron jobや外部サービスでpingを送る）
- 有料プランにアップグレード

## 次のステップ

- カスタムドメインの設定（Renderダッシュボードの「Settings」→「Custom Domain」）
- HTTPS証明書の自動更新（Renderが自動的に設定）
- 環境変数の追加（本番環境用の設定など）

## 参考リンク

- [Render公式ドキュメント](https://render.com/docs)
- [Render環境変数の設定](https://render.com/docs/environment-variables)
- [Supabase公式ドキュメント](https://supabase.com/docs)

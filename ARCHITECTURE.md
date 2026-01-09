# アーキテクチャ一覧

## プロジェクト構造

```
cursor-demo/
├── server.js                 # エントリーポイント（Expressサーバー）
├── package.json              # 依存関係とスクリプト定義
├── .gitignore               # Git除外設定
├── README.md                # プロジェクト説明
│
├── public/                  # フロントエンド（静的ファイル）
│   ├── index.html          # メインHTML
│   ├── script.js           # フロントエンドJavaScript
│   └── style.css           # スタイルシート
│
├── routes/                  # ルーティング層
│   ├── tasks.js            # タスクAPIルート
│   └── categories.js      # 分類APIルート
│
├── controllers/             # コントローラー層（ビジネスロジック）
│   ├── taskController.js   # タスクコントローラー
│   └── categoryController.js # 分類コントローラー
│
├── models/                 # モデル層（データアクセス）
│   ├── task.js            # タスクモデル
│   └── category.js        # 分類モデル
│
├── database/               # データベース層
│   ├── db.js              # データベース接続設定
│   └── schema.sql         # テーブル定義スキーマ
│
└── scripts/                # ユーティリティスクリプト
    └── view-db.js         # データベース確認スクリプト
```

## アーキテクチャパターン

### レイヤードアーキテクチャ（3層構造）

```
┌─────────────────────────────────────┐
│   Presentation Layer (フロントエンド) │
│   - public/index.html                │
│   - public/script.js                 │
│   - public/style.css                 │
└──────────────┬──────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────┐
│   Application Layer (API層)          │
│   ┌──────────┐    ┌──────────────┐  │
│   │ Routes   │───▶│ Controllers  │  │
│   │          │    │              │  │
│   └──────────┘    └──────┬───────┘  │
└──────────────────────────┼──────────┘
                           │
┌──────────────────────────▼──────────┐
│   Data Access Layer (データ層)      │
│   ┌──────────┐    ┌──────────────┐ │
│   │ Models   │───▶│ Database     │ │
│   │          │    │ (SQLite3)    │ │
│   └──────────┘    └──────────────┘ │
└─────────────────────────────────────┘
```

## 各レイヤーの役割

### 1. Presentation Layer（プレゼンテーション層）
**場所**: `public/`

- **index.html**: UI構造
- **script.js**: フロントエンドロジック、API呼び出し
- **style.css**: スタイリング

**責務**:
- ユーザーインターフェースの表示
- ユーザー操作の受付
- APIとの通信

### 2. Application Layer（アプリケーション層）

#### Routes（ルーティング層）
**場所**: `routes/`

- **tasks.js**: タスク関連のエンドポイント定義
- **categories.js**: 分類関連のエンドポイント定義

**責務**:
- HTTPリクエストのルーティング
- URLパターンマッチング
- コントローラーへの委譲

#### Controllers（コントローラー層）
**場所**: `controllers/`

- **taskController.js**: タスクのビジネスロジック
- **categoryController.js**: 分類のビジネスロジック

**責務**:
- リクエストの検証
- ビジネスロジックの実行
- モデル層への委譲
- HTTPレスポンスの生成

### 3. Data Access Layer（データアクセス層）

#### Models（モデル層）
**場所**: `models/`

- **task.js**: タスクデータの操作
- **category.js**: 分類データの操作

**責務**:
- データベースクエリの実行
- データの変換・整形
- データベース抽象化

#### Database（データベース層）
**場所**: `database/`

- **db.js**: SQLite3接続管理
- **schema.sql**: テーブル定義

**責務**:
- データベース接続の管理
- スキーマの初期化
- データの永続化

## データフロー

```
1. ユーザー操作
   ↓
2. Frontend (script.js)
   ↓ HTTP Request
3. Routes (routes/tasks.js)
   ↓
4. Controllers (controllers/taskController.js)
   ↓
5. Models (models/task.js)
   ↓ SQL Query
6. Database (database/db.js → SQLite3)
   ↓
7. Response (逆順で返る)
```

## API エンドポイント一覧

### タスク API (`/api/tasks`)

| Method | Endpoint | Controller | 説明 |
|--------|----------|------------|------|
| GET | `/api/tasks` | `getAll` | 全タスク取得 |
| GET | `/api/tasks/:id` | `getById` | タスク取得 |
| POST | `/api/tasks` | `create` | タスク作成 |
| PUT | `/api/tasks/:id` | `update` | タスク更新 |
| PATCH | `/api/tasks/:id/toggle` | `toggleComplete` | 完了状態切り替え |
| DELETE | `/api/tasks/:id` | `delete` | タスク削除 |

### 分類 API (`/api/categories`)

| Method | Endpoint | Controller | 説明 |
|--------|----------|------------|------|
| GET | `/api/categories` | `getAll` | 全分類取得 |
| GET | `/api/categories/:id` | `getById` | 分類取得 |
| POST | `/api/categories` | `create` | 分類作成 |
| PUT | `/api/categories/:id` | `update` | 分類更新 |
| DELETE | `/api/categories/:id` | `delete` | 分類削除 |

## データベーススキーマ

### categories テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | INTEGER | 主キー（自動増分） |
| name | TEXT | 分類名（ユニーク） |
| color | TEXT | 色コード（デフォルト: #007AFF） |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

### tasks テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | INTEGER | 主キー（自動増分） |
| text | TEXT | タスク内容 |
| completed | INTEGER | 完了フラグ（0/1） |
| category_id | INTEGER | 分類ID（外部キー） |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

**リレーション**: `tasks.category_id` → `categories.id` (LEFT JOIN)

## 技術スタック

### バックエンド
- **Node.js**: ランタイム環境
- **Express.js**: Webフレームワーク
- **SQLite3**: データベース
- **CORS**: クロスオリジンリソース共有

### フロントエンド
- **Vanilla JavaScript**: フレームワークなし
- **HTML5/CSS3**: マークアップ・スタイリング

### 開発ツール
- **nodemon**: 開発時の自動再起動
- **Git**: バージョン管理

## 依存関係

### 本番依存関係
```json
{
  "express": "^4.18.2",    // Webフレームワーク
  "cors": "^2.8.5",        // CORS設定
  "sqlite3": "^5.1.6"      // SQLiteデータベース
}
```

### 開発依存関係
```json
{
  "nodemon": "^3.0.1"      // 開発サーバー自動再起動
}
```

## 設計パターン

### 1. MVCパターン（変形版）
- **Model**: `models/` - データアクセス
- **View**: `public/` - プレゼンテーション
- **Controller**: `controllers/` - ビジネスロジック

### 2. RESTful API設計
- リソース指向のURL設計
- HTTPメソッドの適切な使用
- ステートレスな通信

### 3. レイヤー分離
- 各レイヤーの責務を明確化
- 疎結合な設計
- テスタビリティの向上

## ファイル構成の詳細

### server.js
- Expressアプリケーションの初期化
- ミドルウェア設定（CORS、JSONパーサー）
- ルート設定
- 静的ファイル提供
- エラーハンドリング
- サーバー起動

### routes/
各ルートファイルは対応するコントローラーをインポートし、HTTPメソッドとパスを定義。

### controllers/
各コントローラーは対応するモデルをインポートし、ビジネスロジックを実装。

### models/
各モデルはデータベース接続を使用し、SQLクエリを実行。

### database/
- **db.js**: データベース接続のシングルトン管理
- **schema.sql**: テーブル定義と初期データ

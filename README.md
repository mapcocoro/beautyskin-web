# 美肌コンシェルジュ

AIを活用したパーソナライズされた美容・スキンケアアドバイスWebアプリ

## URL

https://bihadaconcierge.cocoroai.co.jp/

## 概要

肌の悩みに合わせた専門的なケア方法を提案するWebアプリケーションです。
ユーザーが選択した肌悩みに対して、以下5つのカテゴリでアドバイスを提供します。

1. **症状分析** - 悩みの原因と共感
2. **美容レーザー** - クリニック治療の選択肢と費用目安
3. **デパコス** - デパートコスメのおすすめ商品
4. **ドラコス** - ドラッグストアコスメのおすすめ商品
5. **生活習慣** - 内側からのケアアドバイス

## 対応している肌悩み

- 乾燥
- シミ・そばかす
- ニキビ
- 毛穴
- しわ
- たるみ
- 敏感肌

## 特徴

- 各悩み×各カテゴリに10パターンのアドバイスを用意
- 毎回ランダムに表示されるため、飽きずに利用可能
- APIキー不要（ローカルデータで動作）
- アコーディオン形式のUIで見やすい
- スマホ対応のレスポンシブデザイン

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **フォント**: M PLUS Rounded 1c
- **ホスティング**: Vercel

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## ディレクトリ構成

```
beautyskin-web/
├── app/
│   ├── api/advice/     # アドバイスAPIルート
│   ├── layout.tsx      # レイアウト
│   ├── page.tsx        # メインページ
│   ├── icon.png        # ファビコン
│   └── apple-icon.png  # Appleアイコン
├── components/
│   ├── AgeInput.tsx    # 年齢入力
│   ├── ConcernSelection.tsx  # 悩み選択
│   ├── Logo.tsx        # ロゴ
│   └── Result.tsx      # 結果表示（アコーディオン）
├── lib/
│   └── adviceData.ts   # アドバイスデータ（10パターン×7悩み）
├── types/
│   └── index.ts        # 型定義
└── public/
    └── icon.png        # ロゴ画像
```

## ライセンス

Private

## 作者

ココロAI

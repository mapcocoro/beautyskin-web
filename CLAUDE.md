# 美肌コンシェルジュ

AIを活用したパーソナライズ美容・スキンケアアドバイスWebアプリ

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- フォント: M PLUS Rounded 1c

## 主な機能

肌悩みに対して5つのカテゴリでアドバイス：
1. 症状分析
2. 美容レーザー
3. デパコス
4. ドラコス
5. 生活習慣

## 対応している肌悩み

乾燥、シミ・そばかす、ニキビ、毛穴、しわ、たるみ、敏感肌

## ディレクトリ構成

```
beautyskin-web/
├── app/
│   ├── api/advice/     # アドバイスAPIルート
│   ├── page.tsx        # メインページ
├── components/         # UIコンポーネント
├── lib/adviceData.ts   # アドバイスデータ
└── types/              # 型定義
```

## デプロイ

- ホスティング: Vercel
- URL: https://bihadaconcierge.cocoroai.co.jp/
- 自動デプロイ: mainブランチへのpushで自動デプロイ

## 開発コマンド

```bash
npm install
npm run dev      # localhost:3000
npm run build
```

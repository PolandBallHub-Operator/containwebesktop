# WebContainer Desktop 配布対応

- [x] 元のHTML UIと既存機能を維持した `index.html` を配置する
- [x] GitHubのWebContainerで `npm run dev` により即時起動できる構成にする
- [x] Web App Manifestを追加し、PWAとしてインストール可能にする
- [x] 対象の静的リソースをService Workerでキャッシュする
- [x] CORS、COOP、COEP、CORPヘッダーを設定し、WebContainerのcross-origin isolation要件に対応する
- [x] fallbackページやSPA fallbackを追加しない
- [x] 起動、表示、既存機能、PWA、Service Worker、CORSを確認する

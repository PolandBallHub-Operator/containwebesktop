# WebContainer Desktop

元のUIを変更せずに、GitHubからWebContainerでそのまま起動できる静的Webアプリです。

> **重要:** WebContainer APIは `SharedArrayBuffer` を必要とするため、GitHub PagesでHTMLを直接配信すると接続できません。リポジトリをWebContainer環境へ取り込み、必ず `npm run dev` で `server.mjs` を起動してください。仮想FSへの自動フォールバックは実装していません。

## 起動

```bash
npm run dev
```

デフォルトでは `http://localhost:3000` で配信します。`PORT` 環境変数にも対応しています。

## 構成

- `index.html`: 元HTML UI本体。PWAメタデータとService Worker登録のみ追加
- `manifest.webmanifest`: PWA設定
- `sw.js`: coi-serviceworker v0.1.7を統合し、COOP/COEPを補い、WebContainer用の静的ファイルもキャッシュするService Worker
- `coi-serviceworker.js`: 同梱したcoi-serviceworker本体の参照コピー
- `server.mjs`: Node標準ライブラリだけで動作する静的サーバー。CORS/COOP/COEP/CORPを付与
- `_headers`: ヘッダー設定に対応する静的ホスティング向け設定
- `manus-routes.json`: ルート宣言
- `icons/`: PWAインストール用アイコン

未知のパスに対するSPA fallbackやfallbackページは実装していません。存在しないリソースは404になります。

## WebContainer要件

WebContainer APIはSharedArrayBufferを利用するため、配信元でcross-origin isolationが必要です。`server.mjs`、`_headers`、`coi-serviceworker.js`の3経路で次のヘッダーを設定しています。

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Resource-Policy: cross-origin`
- `Access-Control-Allow-Origin: *`

`coi-serviceworker.js`は [gzuidhof/coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker) v0.1.7（MIT License）を同梱し、WebContainer Desktop用のキャッシュ処理を統合しています。

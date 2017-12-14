# Mac TTS Server
## これは
Macの`say`コマンドを外から叩いて、  
吐き出されたデータをoggにして飛ばしてくれるサーバーです。

## 起動の前に
sayコマンドが吐いた`aiff`のピッチを変更するのに`sox`を使っています。  
`sox`へのパスを`config.js`へ指定しないと動きません。  
`global`に`sox`があれば、`soxPath`は`sox`で良いです。  
<https://sourceforge.net/projects/sox/>  
今回は↑の`sox-14.4.2`を使っています。  
また、任意のエンコーディングにするために、`ffmpeg`も使っています。  
`ffmpeg`のパスも同じく`config.js`へ指定して下さい。  
<https://www.ffmpeg.org/>
## config.js
```js
module.exports = {
    tmpDir: "./tmp/",// 生成した一時ファイル
    serverPort: 8080,// ポート
    defaultVoice: "otoya", // デフォルトの声
    defaultRate: "200", // デフォルトの速さ
    defaultText: "sample", // デフォルトのテキスト
    defaultPitch: "0", // デフォルトのピッチ
    defaultEncode: "ogg", // 出力のエンコーディング(ffmpegが対応するものであれば)
    soxPath: "./libs/sox-14.4.2/sox", // soxへのパス
    ffmpegPath: "./libs/ffmpeg", // ffmpegへのパス
}
```
## 起動
`node .`で起動。  
`config.js`で設定を変えられます。  
## 使い方
```
http://localhost:8080/?voice=otoya&rate=300&pitch=200&text=こんにちは
```
- *voice* : 声の種類です。`Otoya`と`Kyoko`には対応しています。
- *rate* : 声の速さです。
- *pitch* : 声の高さです。
- *text* : 読ませる文字です。
これでaiffが帰って来ます。
## 今後の予定
- ~~ピッチ変更。~~
- ~~好きな音声フォーマットで。~~
- 様々な声質を連結。
- tmpファイルは古いものから定期的に削除するように。
- ~~セキュリティの見直し。（外からの文字を引数にコマンドを叩くので心配）~~
## !!注意!!
<https://www.apple.com/legal/sla/>  
ここにある通りMacのTTSは個人ではいいが、商用はダメとのことです。

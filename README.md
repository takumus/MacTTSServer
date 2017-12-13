# Mac TTS Server
## これは
Macの`say`コマンドを外から叩いて、  
吐き出されたデータを飛ばしてくれるサーバーです。

## 起動
`node .`で起動。  
`index.js`の`config`で設定を変えられます。  
## 使い方
```
http://localhost:8080/?voice=otoya&rate=300&text=こんにちは
```
これでaiffが帰って来ます。
## 今後の予定
- ピッチ変更。
- 好きな音声フォーマットで。
- 様々な声質を連結。
- tmpファイルは古いものから定期的に削除するように。
- セキュリティの見直し。（外からの文字を引数にコマンドを叩くので心配）
## 注意
`https://www.apple.com/legal/sla/`  
ここにある通りMacのTTSは個人ではいいが、商用はダメとのことです。
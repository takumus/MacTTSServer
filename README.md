# Mac TTS Server
## これは
Macの`say`コマンドを外から叩いて、  
吐き出されたデータをoggにして飛ばしてくれるサーバーです。

## 起動の前に
sayコマンドが吐いた`aiff`を`ogg`へエンコードするのに、  
`sox`を使っています。  
`sox`へのパスを`config.js`へ指定しないと動きません。  
`global`に`sox`があれば、`soxPath`は`sox`で良いです。  
<https://sourceforge.net/projects/sox/>
今回は↑の`sox-14.4.2`を使っています。

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
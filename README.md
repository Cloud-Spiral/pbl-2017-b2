# Facitter
![facitter-f](https://user-images.githubusercontent.com/19528049/32894084-1663531e-cb1f-11e7-8811-9a146e97943b.png)

## 説明
Facitterとは、離れた人とでもファシリテーションを活用した会議が行えるように支援するためのWebアプリです
![all](https://user-images.githubusercontent.com/19528049/32894109-283fa75e-cb1f-11e7-8058-a06f83170f70.png)


## 機能
ログインした人同士でFacitterの機能を同期しながら使用することができます。
使用可能な機能は

- ホワイトボード
- ふせん
- 抽選
- タイマー
- ユーザー管理
- TODOリスト管理

です

## 使い方
### ログイン

### ツールバー
![tool_num](https://user-images.githubusercontent.com/19528049/32894600-988af44a-cb20-11e7-9477-f19b24a61290.png)
1. 現在のペンの文字サイズを表示
1. 文字サイズを小さくする
1. 文字サイズを大きくする
1. ペンをフリーハンドモードにする
1. ペンを直線モードにする
1. ペンの色を黒にする
1. ペンの色を赤にする
1. ペンの色を青にする
1. ペンを消しゴムモードにする
1. ひとつ戻る
1. ひとつ進む
1. ホワイトボードを白紙にする
1. 新しいふせんを作る
1. 全てのふせんサイズを変更する
1. ~~ふせんを整列する~~ FGOする

### ホワイトボード
![white](https://user-images.githubusercontent.com/19528049/32895293-e43f60b8-cb22-11e7-915c-d5a67282f92e.png)
ペンで線をかけます。  
ホワイトボード上にカーソルを合わせると現在のペンの状態（太さ、色）を半透明でカーソルの先に表示します。  
また、直線モードのときには始点をクリックしてから、終点でマウスを離すまでの間、描かれるであろう直線を半透明で表示します。

### ふせん
![husen](https://user-images.githubusercontent.com/19528049/32895357-2114c442-cb23-11e7-94cf-40d3b94e41db.png)
1. ふせんは新しいふせんを作るボタンから生成されます。
1. テキストエリアに文字が入力できます。
1. テキストエリアの内容はShift(Ctrl)+Enterで送信します。ふせんの選択をやめても送信されます。
1. Colorボタンを押すと色が変わります。6色あって、6回押すと元の色に戻ってきます．
1. Goodボタンを押すとGoodが増えます。どうやっても減りません。
1. Badボタンを押すとBadが増えます。どうやっても減りません。
1. 右上に×ボタンがあって押すと付箋が消えます。確認はないので、すっと消えます。
1. ふせんは移動できます。ほかの人の画面でも移動します。
1. ふせんは一括サイズ変更ができます。通常→小さい→小さい+半透明の順に変更されます。自分の画面のみです。
1. FGOボタンを押すと、FGOします。全ユーザの画面で行われます。

### TODOリスト
![todo_list](https://user-images.githubusercontent.com/19528049/32894622-a5e63410-cb20-11e7-9078-d2dfb2df1c09.png)  
![todo_close](https://user-images.githubusercontent.com/19528049/32894624-a7f7dcea-cb20-11e7-9196-88997232dd6e.png)  
投稿フォームからTODOを投稿できます。  
TODOは星のアイコンで1~5までの優先度を付けられます。  
投稿されたTODOは優先度・投稿時間でソートされます。  
TODOはopenとcloseの状態を持ち、ボタンで切り替えられます。  
TODOリストのタブでopenとcloseの表示を切り替えられます。  
TODOは投稿されてから約1分経過すると、シンボルが左側に表示されます。  
TODOリストの各TODOのタスク内容をクリックすると、編集用のフォームが出現し、ENTERキーを押すと入力した内容に変更されます。  

### ユーザーリストと抽選
![user_ist](https://user-images.githubusercontent.com/19528049/32894630-ac981a94-cb20-11e7-914f-91bb2f6fa90a.png)  
会議に参加しているユーザ名が表示されます。  
また、参加しているユーザから一人を選択する抽選機能もあり、抽選ボタンを押すと選ばれたユーザ名が表示されます。  
選ばれたユーザ名の履歴は▼ボタンを押すと表示されます。  

### タイマー
![timer](https://user-images.githubusercontent.com/19528049/32894631-ae337650-cb20-11e7-92a0-2342f651f42a.png)  
テキストボックスに計りたい時間の分，秒を半角数字で入力します．  
スタートボタンを押すとタイマーが作動し，秒数が減っていきます．  
タイマーが作動中にストップボタンを押すと，タイマーがストップします．  
リセットボタンを押すと，テキストボックスの中身が分，秒ともに0になります．  
半角数字以外も入力自体は可能ですが，スタートボタンを押すとリセットされ，タイマーは作動しません．  

## アクセス
以下のリンクから利用できます。  
[Facitter](https://team2017-2.spiral.cloud/facitter)

## author
瀬村雄一  
佐々木美和  
すぎ  
松崎継生  
よし  
横井昂典  


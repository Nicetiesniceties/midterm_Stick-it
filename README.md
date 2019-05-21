# midterm_Stick-it

https://github.com/Nicetiesniceties/midterm_Stick-it.git

![img](/Users/Njceties/Secrets/NTU Courses/NTU sixth semester/Web Programming/midterm_Stick-it/img.png)

![img1](/Users/Njceties/Secrets/NTU Courses/NTU sixth semester/Web Programming/midterm_Stick-it/img1.png)

### 簡介

這是一個自由的便條紙黏貼版，可以修改字型與

### 操作方式

1. `git clone https://github.com/Nicetiesniceties/midterm_Stick-it.git`
2. `cd stick-it`
3. `npm install`
4. 使用自己的mongodb 空間，請修改`server.js`中的URL
5. `node server.js`
6. `npm start`
7. go to  [http://localhost://3000](http://localhost/3000?fbclid=IwAR1DTfgc-gPT1TSlZbmZiHJD47wHIDlwwbYuoPZu_wqxjeq5m4-evT17yvg)

### APP功能

1. 按"+"可以選擇愈添加的便條紙顏色。
2. 選擇便條紙上的字體時，會跳出一個可以改變字體與排版的toolbar，方便自由修改外觀。
3. 透過拖曳便條紙的上部，可以自由移動便條紙，並且會將當前點擊的便條紙置頂。
4. 右上角有刪除鍵可以刪除便條紙。
5. 利用router的方式提供兩種不同的theme。
6. 後端儲存當前便條紙的狀態。

### 使用到的框架

1. 前端使用react.js
2. 後端使用express.js (node.js)
3. 使用socket.io來做前後端連接
4. 使用react-rnd實作可以拖曳（應該也可以縮放但未實做）
5. 使用draft.js修改字型排版
6. Mongodb當作database

### 參考

1. 後端的編寫參考老師的chatbox
2. 一些來自codepen的css https://codepen.io/neatnait/pen/awbqD
3. [draft.js](https://www.draft-js-plugins.com/plugin/inline-toolbar)教學
4. [react-rnd](https://github.com/bokuweb/react-rnd)教學

### 貢獻

- 除了draft.js和react-rnd的部分以外，其他皆為自己完成

### 心得

前端的部分實際上做起來花了很多時間在一些小feature上，比如說便條紙的拖曳桿和置頂等等，以及如何讓便條紙比較逼真，重疊起來不會太突兀。但總體來說我起步的時間太晚了，約莫是前一天的下午開始，因此其實很多地方應該檢討一下。很感謝老師的chatbox，讓我能迅速理解後端的溝通模式。

最後，draft.js真的是一個很神奇的套件，連插入圖片和貼圖都能做到，但由於我不知道怎麼儲存貼圖的部分，這次沒有實作出來。不過作為一個更全面的便條紙系統，這是一個值得繼續發展的feature。
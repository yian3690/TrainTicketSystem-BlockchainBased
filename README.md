# TrainTicketSystem-MadeByChainBlock

## 前置流程:
在專案資料夾中按右鍵開啟終端並輸入<br>
npm init -y <br>
npm install express mysql2 cors <br>

分別
建立 package.json
安裝後端用的套件（Express 網頁伺服器、MySQL 資料庫、CORS 跨來源存取）

## MetaMask與Ganache設置:
<img src="assets/usage-step-1.png" width="800"/>
<img src="assets/usage-step-2.png" width="800"/>
<img src="assets/usage-step-3.png" width="800"/>

## 使用方法:
1.先開啟xampp中的Apache及My SQL  <br>
2.在Remix中先編譯合約<br>
<img src="assets/compile-step-1.png" width="800"/>
<img src="assets/compile-step-2.png" width="800"/>
<img src="assets/compile-step-3.png" width="800"/><br>
3.開啟Gnache，在Remix中使用External Provider，將Gnache的網域貼上<br>
<img src="assets/compile-step-4.png" width="800"/><br>

4.MetaMask 連接區塊鏈的Private Key<br>
5.到 Epoch Converter - Unix Timestamp Converter:https://www.epochconverter.com/ 轉換合約結束時間<br>
6.連接 Ganache 中區塊鏈的合約擁有者<br>
7:建立完成後，到app.js修改合約位址<br>
<img src="assets/compile-step-5.png" width="800"/><br>
<img src="assets/compile-step-6.png" width="800"/><br>

在終端執行:<br>
1.node server.js<br>
2.python -m http.server<br>
在網頁輸入:http://localhost:8000/

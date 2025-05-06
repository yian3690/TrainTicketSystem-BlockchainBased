/*資料庫部分*/
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());




// 使用 XAMPP 預設帳號密碼：root 無密碼
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP 通常沒密碼
  database: 'train'
});

// 測試連線
db.connect(err => {
  if (err) {
    console.error('資料庫連線失敗:', err.message);
  } else {
    console.log('成功連線到 XAMPP MySQL');
  }
});

// API：讀取站點
app.get('/stations', (req, res) => {
  db.query('SELECT name FROM stations', (err, results) => {
    if (err) {
      res.status(500).json({ error: '資料讀取失敗' });
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log('伺服器已啟動：http://localhost:3000');
});



// API：查詢火車時刻表
app.get('/timeTable', (req, res) => {
  const { departure, destination } = req.query;

  const sql = `
    SELECT * FROM train_schedule
    WHERE origin = ? AND destination = ?
  `;

  db.query(sql, [departure, destination], (err, results) => {
    if (err) {
      console.error('查詢錯誤:', err.message);
      res.status(500).json({ error: '查詢失敗' });
    } else {
      res.json(results);
    }
  });
});


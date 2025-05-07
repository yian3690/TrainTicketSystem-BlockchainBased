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







//車次驗證 API
app.get('/timeTable', (req, res) => {
  const { departure, destination, train_number } = req.query;


  // === 情境 3：只提供 train_number（購票後查詢細節）
  if (train_number && !departure && !destination) {
    const sql = `
      SELECT * FROM train_schedule
      WHERE train_number = ?
    `;
    db.query(sql, [train_number], (err, results) => {
      if (err) {
        console.error('查詢錯誤:', err.message);
        return res.status(500).json({ found: false, error: '資料庫查詢錯誤' });
      }

      if (results.length > 0) {
        res.json({ found: true, train: results[0] });
      } else {
        res.json({ found: false });
      }
    });
  }

  // === 情境 1：用 train_number + departure + destination 驗證（購票時驗證）
  else if (train_number && departure && destination) {
    const sql = `
      SELECT * FROM train_schedule
      WHERE origin = ? AND destination = ? AND train_number = ?
    `;
    db.query(sql, [departure, destination, train_number], (err, results) => {
      if (err) {
        console.error('查詢錯誤:', err.message);
        return res.status(500).json({ found: false, error: '資料庫查詢錯誤' });
      }

      if (results.length > 0) {
        res.json({ found: true, train: results[0] });
      } else {
        res.json({ found: false });
      }
    });
  }

  // === 情境 2：查詢某路線的所有車次
  else if (departure && destination) {
    const sql = `
      SELECT * FROM train_schedule
      WHERE origin = ? AND destination = ?
    `;
    db.query(sql, [departure, destination], (err, results) => {
      if (err) {
        console.error('查詢錯誤:', err.message);
        res.status(500).json({ error: '查詢失敗' });
      } else {
        res.json(results); // 多筆資料直接回傳陣列
      }
    });
  }

  // === 錯誤處理：無效查詢參數 ===
  else {
    res.status(400).json({ error: '請提供正確的查詢參數' });
  }
});



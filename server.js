/*資料庫部分*/
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 新增這一行：讓 public 資料夾成為靜態網站根目錄
app.use(express.static('public'));


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
  // 從查詢參數中擷取三個可能的參數：出發地、目的地與車次編號
  const { departure, destination, train_number } = req.query;


  // === 情境 1：僅提供 train_number（購票後依車票查詢詳細資料）
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

  // === 情境 2：使用 train_number + departure + destination 驗證（購票前查詢價格與資訊）
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
        const train = results[0];

        // 檢查是否有 price 欄位
        if (!train.price) {
          console.warn('警告：該車次沒有設定票價');
          return res.json({ found: true, train, warning: '車次尚未設定票價' });
        }

        res.json({
          found: true,
          train: {
            origin: train.origin,
            destination: train.destination,
            train_number: train.train_number,
            price: train.price // 加入票價
          }
        });
      } else {
        res.json({ found: false });
      }
    });
  }


  // === 情境 3：查詢某路線的所有車次 departure + destination（例如：查詢從台北到高雄的所有班次）
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




// 購票時隨機選取尚未被購買的座位
// 取得一個尚未被佔用的座位，但不立刻鎖定
app.get('/getSeat', (req, res) => {
 const count = parseInt(req.query.count, 10);

  if (isNaN(count) || count <= 0) {
    return res.status(400).json({ error: '請提供有效的座位數量' });
  }

  const sql = 'SELECT seat_no FROM train_seat WHERE is_taken = 0 ORDER BY id ASC LIMIT ?';

  db.query(sql, [count], (err, results) => {
    if (err) {
      console.error('座位取得錯誤：', err);
      return res.status(500).json({ error: '座位取得錯誤' });
    }

    const seats = results.map(row => row.seat_no);
    res.json({ seats });
  });
});



app.post('/confirmSeats', (req, res) => {
  const seats = req.body.seats; // e.g., ["1A", "1B", "2C"]

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: '無效的座位資料' });
  }

  const placeholders = seats.map(() => '?').join(', ');
  const sql = `UPDATE train_seat SET is_taken = 1 WHERE seat_no IN (${placeholders})`;

  db.query(sql, seats, (err) => {
    if (err) {
      console.error('座位鎖定失敗：', err);
      res.status(500).json({ error: '座位鎖定失敗' });
    } else {
      res.json({ success: true });
    }
  });
});




// 釋放已被佔用的座位（退票時用）
app.post('/releaseSeat', (req, res) => {
  const { seat } = req.body;

  if (!seat) {
    return res.status(400).json({ error: '未提供座位編號' });
  }

  const sql = 'UPDATE train_seat SET is_taken = 0 WHERE seat_no = ?';

  db.query(sql, [seat], (err, result) => {
    if (err) {
      console.error('釋放座位錯誤：', err);
      return res.status(500).json({ error: '釋放座位失敗' });
    }

    res.json({ success: true });
  });
});

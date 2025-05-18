// 用於記錄當前正在輸入的欄位（departure 或 destination）
let currentInput = null;

// 控制車站清單是否顯示
let stationListVisible = false;

/**
 * 切換車站清單的顯示與隱藏狀態
 * @param {string} inputId 要填入站名的輸入欄位 ID（departure 或 destination）
 * @param {HTMLElement} buttonElement 按下的「選擇站點」按鈕，用來定位選單顯示位置
 */
function toggleStationList(inputId, buttonElement) {
  const list = document.getElementById('stationList'); // 取得車站選單元素

  // 如果車站清單已經打開，且是同一個欄位，再次點擊就關閉清單
  if (stationListVisible && currentInput === inputId) {
    list.classList.add('hidden'); // 隱藏車站清單
    stationListVisible = false;
    currentInput = null;
    return;
  }

  // 設定當前輸入欄位並顯示車站清單
  currentInput = inputId;
  stationListVisible = true;
  list.classList.remove('hidden'); // 顯示車站清單

  // 根據按鈕的位置來決定車站清單的顯示位置（定位到按鈕下方）
  const rect = buttonElement.getBoundingClientRect();
  list.style.top = `${rect.bottom + window.scrollY + 6}px`;
  list.style.left = `${rect.left + window.scrollX}px`;

  // 向 Node.js 後端請求所有車站資料
  fetch('http://localhost:3000/stations')
    .then(res => res.json())
    .then(data => {
      list.innerHTML = ''; // 清空原本的選單內容
      data.forEach(station => {
        const btn = document.createElement('button'); // 為每個車站建立一個按鈕
        btn.className = 'station-btn';
        btn.textContent = station.name;
        btn.onclick = () => selectStation(station.name); // 點選後設定對應欄位的值
        list.appendChild(btn); // 加入清單中
      });
    });
}

/**
 * 選擇某個站名後，將該名稱填入當前欄位，並隱藏車站清單
 * @param {string} name 選中的站名
 */
function selectStation(name) {
  if (currentInput) {
    document.getElementById(currentInput).value = name; // 設定輸入欄位的值為選中的站名
  }
  document.getElementById('stationList').classList.add('hidden'); // 隱藏清單
  stationListVisible = false;
  currentInput = null;
}

// 當點擊畫面上其他地方時，若不是選單或選單按鈕，就關閉選單
document.addEventListener('click', (e) => {
  const list = document.getElementById('stationList');
  // 如果點擊的不是清單本身，且不是呼叫 toggleStationList 的按鈕
  if (!list.contains(e.target) && !e.target.matches('button[onclick^="toggleStationList"]')) {
    list.classList.add('hidden'); // 隱藏清單
    stationListVisible = false;
    currentInput = null;
  }
});



// 查詢時刻表
// 監聽表單提交事件（查詢時刻表）
document.getElementById('timeTableForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // 阻止表單預設提交行為，避免頁面重新載入

  // 取得使用者輸入的出發站、到達站與出發日期
  const departure = document.getElementById('departure').value;
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('travelDate').value;

  // 發送 GET 請求到伺服器端的 timeTable API，查詢對應的列車資料
  const res = await fetch(`http://localhost:3000/timeTable?departure=${departure}&destination=${destination}`);
  const data = await res.json(); // 將回傳的 JSON 資料轉為 JavaScript 陣列

  // 清空時刻表查詢結果區域
  const results = document.getElementById('timeTableResults');
  results.innerHTML = '';
results.style.paddingBottom = '120px'; // 有查詢結果才加 padding

  // 建立表格元素
  const table = document.createElement('table');
  table.className = 'time-table';

  // 建立表頭
  table.innerHTML = `
    <thead>
      <tr>
        <th class="first-child">車種車次 (始發站 → 終點站)</th>
        <th>出發時間</th>
        <th>抵達時間</th>
        <th>行駛時間</th>
        <th>經由</th>
        <th>票價</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  // 建立每一筆列車資料列
  data.forEach(train => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="first-child">${train.train_type} ${train.train_number} ( ${train.origin} → ${train.destination} )</td>
      <td>${train.departure_time}</td>
      <td>${train.arrival_time}</td>
      <td>${train.duration}</td>
      <td>${train.route || '－'}</td>
      <td>$${train.price}</td>
    `;
    tbody.appendChild(row);
  });

  // 將表格加入畫面
  results.appendChild(table);
});



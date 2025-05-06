const contractAddress = '0x9Cfefa0CE19552c810280F15021e0A12633bbd3a'; // ← 替換成 Remix 部署後的地址

const contractABI = [
  // 合約ABI（從Remix編譯後獲取）
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_endTime",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "TicketPurchased",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "endTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyTickets",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "departure",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "destination",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "date",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"internalType": "struct TrainTicket.Ticket[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_departure",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_destination",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_date",
				"type": "string"
			}
		],
		"name": "purchaseTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "status",
		"outputs": [
			{
				"internalType": "enum TrainTicket.Status",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "string",
				"name": "departure",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "destination",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// 顯示合約地址於畫面上
document.addEventListener('DOMContentLoaded', () => {
  if (typeof contractAddress !== 'undefined') {
    const contractElement = document.getElementById('contractAddress');
    if (contractElement) {
      contractElement.textContent = `合約地址: ${contractAddress}`;
    } else {
      console.warn('無法找到 contractAddress 元素');
    }
  }
});

// 宣告全域變數
let provider, signer, contract;
let userAddress;


// 安全地取得 accountArea 元素
let accountArea = null;
document.addEventListener('DOMContentLoaded', () => {
  accountArea = document.getElementById('accountArea');
  if (!accountArea) {
    console.warn('無法找到 accountArea 元素');
  }
});

// 連接 MetaMask 錢包的函式
async function connectWallet() {
  try {
    // 檢查是否安裝 MetaMask
    if (typeof window.ethereum !== 'undefined') {
      // 要求使用者授權連接帳戶
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0]; // 取得第一個錢包地址
      accountArea.textContent = `已連接: ${userAddress}`; // 顯示已連接的地址

      // 建立 provider、signer 和 contract 實例
      provider = new ethers.providers.Web3Provider(window.ethereum); // 使用 ethers.js 建立 Web3 提供者
      signer = provider.getSigner(); // 獲取使用者的簽名者（代表使用者進行交易）
      contract = new ethers.Contract(contractAddress, contractABI, signer); // 連接合約實例

      // 載入使用者車票資料
      await loadTickets();

      // 如果 MetaMask 帳戶變更，自動重新整理頁面
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    } else {
      // 如果沒裝 MetaMask
      accountArea.textContent = '請安裝 MetaMask!';
    }
  } catch (err) {
    console.error(err);
    accountArea.textContent = `連接錯誤: ${err.message}`; // 錯誤處理顯示
  }
}


// 處理購票表單提交事件
document.getElementById('ticketForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // 防止表單預設提交行為

  // 取得使用者填入的出發地、目的地和日期
  const departure = document.getElementById('departure').value;
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('travelDate').value;

  try {
    // 呼叫合約函式 purchaseTicket 傳送交易
    const tx = await contract.purchaseTicket(departure, destination, date);
    await tx.wait(); // 等待交易確認
    alert('購票成功！');

    // 購票成功後重新載入票券資訊
    await loadTickets();
  } catch (err) {
    console.error(err);
    alert('交易失敗: ' + err.message); // 顯示錯誤訊息
  }
});


// 從合約中取得並顯示使用者購買的所有票券
async function loadTickets() {
  const tickets = await contract.getMyTickets(); // 呼叫合約函式取得票券清單
  const list = document.getElementById('myTickets'); // 顯示票券的區塊
  if (!list) {
    console.warn('無法找到 myTickets 元素');
    return;  // 中止函式執行，避免錯誤
  }
  
  list.innerHTML = ''; // 清空舊資料

  // 將每張票券資訊加入列表中
  tickets.forEach((t, idx) => {
    const li = document.createElement('li');
    li.textContent = `${t.date}：${t.departure} → ${t.destination}`;
    list.appendChild(li);
  });
}

// 若已經有 MetaMask，頁面載入時自動嘗試連接
if (typeof window.ethereum !== 'undefined') {
  connectWallet();
}




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




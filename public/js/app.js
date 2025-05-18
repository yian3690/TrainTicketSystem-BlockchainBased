const contractAddress = '0x2D91D8Bb08F96F1B7650A1DeF8C3c848d1dF2a6F'; // ← 替換成 Remix 部署後的地址

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
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TicketRefunded",
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
						"internalType": "string",
						"name": "trainNumber",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "seat",
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
		"name": "getMyTicketsWithIds",
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
						"internalType": "string",
						"name": "trainNumber",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "seat",
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
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
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
			},
			{
				"internalType": "string",
				"name": "_trainNumber",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_seats",
				"type": "string[]"
			},
			{
				"internalType": "uint256",
				"name": "expectedTotalPrice",
				"type": "uint256"
			}
		],
		"name": "purchaseTickets",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expectedPrice",
				"type": "uint256"
			}
		],
		"name": "refundTicket",
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
				"internalType": "string",
				"name": "trainNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "seat",
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


// 若已經有 MetaMask，頁面載入時自動嘗試連接
if (typeof window.ethereum !== 'undefined') {
  connectWallet();
}



// 處理購票表單提交事件
document.getElementById('ticketForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const departure = document.getElementById('departure').value;
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('travelDate').value;
  const trainNumber = document.getElementById('trainNumber').value;
  const ticketCount = parseInt(document.getElementById('ticketCount').value);

  try {
    // 查詢票價
    const res = await fetch(`http://localhost:3000/timeTable?departure=${departure}&destination=${destination}&train_number=${trainNumber}`);
    const result = await res.json();

    if (!result.found || !result.train.price) {
       await Swal.fire({
        icon: 'error',
        title: '查無車次',
        text: '查無此車次，請確認輸入正確車次',
        confirmButtonText: '知道了'
      });
      return;
    }

    const weiPerEth = 10n ** 18n;
    const fullPrice = BigInt(result.train.price);
    const singlePrice = fullPrice * weiPerEth / 10n;

	// 顯示處理中提示
    Swal.fire({
      title: '交易進行中',
      text: '請稍候，正在處理購票交易',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

     // ✅ 一次取得多個座位
    const seatRes = await fetch(`http://localhost:3000/getSeat?count=${ticketCount}`);
    const seatData = await seatRes.json();
    const seats = seatData.seats || [];

    if (seats.length === 0) {
      await Swal.fire({
        icon: 'error',
        title: '無可用座位',
        text: '請稍後再試',
        confirmButtonText: '知道了'
      });
      return;
    }

    if (seats.length < ticketCount) {
      await Swal.fire({
        icon: 'warning',
        title: '座位不足',
        text: `剩餘座位不足，僅取得 ${seats.length} 張座位`,
        confirmButtonText: '知道了'
      });
    }
    const totalPrice = singlePrice * BigInt(seats.length);

    // 呼叫合約一次購買多張票
    const tx = await contract.purchaseTickets(
      departure,
      destination,
      date,
      trainNumber,
      seats,
      totalPrice,
      { value: totalPrice }
    );

    await tx.wait();// ✅ 等交易成功

	// ✅ 再向後端確認座位（更新 is_taken）
	await fetch('http://localhost:3000/confirmSeats', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ seats })
	});
	
    await Swal.fire({
      icon: 'success',
      title: '購票成功',
      text: `成功購買 ${seats.length} 張票！`,
      confirmButtonText: '完成'
    });

    await loadTickets();

  } catch (err) {
    console.error(err);

    if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
       await Swal.fire({
        icon: 'info',
        title: '交易已取消',
        text: '您已取消此交易。',
        confirmButtonText: '知道了'
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: '交易失敗',
        text: err.message || '發生未知錯誤',
        confirmButtonText: '關閉'
      });
    }
  }
});









// 從合約中取得並顯示使用者購買的所有票券
async function loadTickets() {
  const [tickets, ticketIds] = await contract.getMyTicketsWithIds();  // 取回票券與 ID
  const list = document.getElementById('myTickets');
  if (!list) return;

  list.innerHTML = '';

  for (let i = 0; i < tickets.length; i++) {
    const t = tickets[i];
    const id = ticketIds[i];

	//取得車次
    try {
      const res = await fetch(`http://localhost:3000/timeTable?train_number=${encodeURIComponent(t.trainNumber)}`);
      if (!res.ok) throw new Error('資料查詢失敗');

      const result = await res.json();
      const ticketBlock = document.createElement('div');
      ticketBlock.className = 'ticket-block';

      if (result.found) {
        const train = result.train;
		const qrCodeId = `qrcode-${id}`;  // 每張票的 QR code 容器 ID
		const qrWrapperId = `qr-wrapper-${id}`;


        ticketBlock.innerHTML = `
          <div class="train-info">
		  	<div class="info-pair"><strong>日期：</strong><span>${t.date}</span></div>
			<div class="refund-button-container">
            	<div class="info-pair"><strong>票號：</strong><span>${id}</span></div>
			</div>
          </div>

		  <hr class="head-divider">

		  <div class = "time-center-container">
			<div class="train-info">
				<div class="time-pair"><strong>出發：</strong><span>${train.departure_time}</span></div>
				<div class="time-pair"><strong>抵達：</strong><span>${train.arrival_time}</span></div>
			</div>
		  </div>

		  <div class = "depature-and-destination-center-container">
			<div class="train-info">
				<div class="depature-and-destination-pair"><strong>起點：<span>${train.origin}</span></strong></div>
				<div class="arrow">→</div>
				<div class="depature-and-destination-pair"><strong>終點：<span>${train.destination}</span></strong></div>
			</div>
		  </div>

		  <hr class="custom-divider">

          <div class="train-info">
			<div class="info-pair"><strong>車種：</strong><span>${train.train_type}</span></div>
            <div class="info-pair"><strong>車次：</strong><span>${t.trainNumber}</span></div>
			<div class="info-pair"><strong>座位：</strong><span>${t.seat}</span></div>
            <div class="info-pair"><strong>票價：</strong><span>${train.price} 元</span></div>
            
			<div class="refund-button-container">
              <span><button type="button" class = "refund-button" onclick="refundTicket(${id}, '${t.departure}', '${t.destination}', '${t.trainNumber}', '${t.seat}')">退票</button></span>
            </div>
          </div>
          

		  <!-- QR code container -->
		  <!-- 展開 QR code 按鈕 -->
		  <div class="qr-button-wrapper">
		  	<button type="button" class="toggle-btn" onclick="toggleQRCode('${qrWrapperId}', this)">
				顯示 QR Code <span class="arrow-icon">▼</span>
			</button>
  		  </div>
		  
        `;

		// 先加入畫面
		list.appendChild(ticketBlock);

		// 新增 QR Code 區塊（放在票券下方）
		const qrWrapper = document.createElement('div');
		qrWrapper.id = qrWrapperId;
		qrWrapper.className = 'qr-wrapper';

		const qrContainer = document.createElement('div');
		qrContainer.id = qrCodeId;
		qrContainer.className = 'qrcode-container';

		qrWrapper.appendChild(qrContainer);

		// 插入 QR 容器在票券之後
		list.appendChild(qrWrapper);

		// 生成 QR code：用車次、票號及座位做為內容
     	const qrContent = `TrainNum#${t.trainNumber},ID#${id},Seat#${t.seat}`;

		new QRCode(document.getElementById(qrCodeId), {
			text: qrContent,
			width: 180,
			height: 180
		});

      } else {
        ticketBlock.textContent = `${t.date}：${t.departure} → ${t.destination} 車次:${t.trainNumber}（查無車次細節）`;
      }
    } catch (err) {
		console.error('查詢錯誤：', err);
		Swal.fire({
			icon: 'error',
			title: '資料查詢失敗',
			text: '無法載入車次資訊，請稍後再試。',
			confirmButtonText: '確定'
		});
	}
  }
}


//QR code按下顯示才顯示，否則隱藏
function toggleQRCode(wrapperId, btn) {
  const el = document.getElementById(wrapperId);
  const arrow = btn.querySelector('.arrow-icon');
  const isOpen = el.classList.contains('open');

  if (isOpen) {
    el.classList.remove('open');
    arrow.classList.remove('rotated');
  } else {
    el.classList.add('open');
    arrow.classList.add('rotated');
  }
}







/**
 * 切換車站清單的顯示與隱藏狀態
 * @param {string} inputId 要填入站名的輸入欄位 ID（departure 或 destination）
 * @param {HTMLElement} buttonElement 按下的「選擇站點」按鈕，用來定位選單顯示位置
 */

// 用於記錄當前正在輸入的欄位（departure 或 destination）
let currentInput = null;

// 控制車站清單是否顯示
let stationListVisible = false;

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










//車票退票
async function refundTicket(ticketId, departure, destination, trainNumber,seat) {
  // ➤ 退票前確認
  const confirmResult = await Swal.fire({
	title: '確認退票？',
		
	icon: 'warning',
	showCancelButton: true,
	confirmButtonText: '是，我要退票',
	cancelButtonText: '取消',
	reverseButtons: true
  });

  if (!confirmResult.isConfirmed) {
	// 使用者按了「取消」
	await Swal.fire({
	icon: 'info',
	title: '已取消操作',
	text: '本次退票未執行。',
	confirmButtonText: '知道了'
	});
	
	return;
  }


  //開始退票
  try {
    const res = await fetch(`http://localhost:3000/timeTable?departure=${departure}&destination=${destination}&train_number=${trainNumber}`);
    const result = await res.json();

    if (!result.found || !result.train.price) {
      await Swal.fire({
        icon: 'error',
        title: '查詢失敗',
        text: '查無此車次或價格未設定',
        confirmButtonText: '知道了'
      });
      return;
    }

    const weiPerEth = 10n ** 18n;		//Wei換算成ETH，1ETH = 10^18Wei
    const fullPrice = BigInt(result.train.price);
    const refundAmount = fullPrice * weiPerEth / 10n;

	 // 顯示處理中提示
    Swal.fire({
      title: '退票處理中',
      text: '正在釋放座位與退款，請稍候...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


	// 先釋放座位
    const releaseRes = await fetch('http://localhost:3000/releaseSeat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ seat })
    });

	/*
	console.log('ticketId:', ticketId);  // 除錯用 
	console.log('trainNumber:', trainNumber);  // 除錯用 
	console.log('refundAmount:', refundAmount);  // 除錯用 
 	*/

	const releaseResult = await releaseRes.json();

    if (!releaseResult.success) {
      await Swal.fire({
        icon: 'error',
        title: '座位釋放失敗',
        text: '請稍後再試或聯絡客服。',
        confirmButtonText: '了解'
      });
      return;
    }
    

    const tx = await contract.refundTicket(ticketId, refundAmount);
    await tx.wait();

    await Swal.fire({
      icon: 'success',
      title: '退票成功',
      text: `已成功退票（票號：${ticketId}）`,
      confirmButtonText: '完成'
    });

    await loadTickets();

  } catch (err) {
    console.error('退票錯誤:', err);

	//若在MetaMask 中按了「拒絕」或「取消」交易，顯示退票動作已取消
    if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
      await Swal.fire({
        icon: 'info',
        title: '退票已取消',
        text: '您已取消本次退票操作。',
        confirmButtonText: '知道了'
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: '退票失敗',
        text: err.message || '發生未知錯誤',
        confirmButtonText: '關閉'
      });
    }
  }
}




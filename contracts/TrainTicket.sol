// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17; // 指定 Solidity 編譯器版本為 ^0.8.17

import "@openzeppelin/contracts@4.9.3/access/Ownable.sol"; 
// 引入 OpenZeppelin 套件中的 Ownable 合約，用來實現擁有者權限控制功能

// 定義火車票智能合約，繼承 Ownable，只有合約擁有者可執行某些特殊操作
contract TrainTicket is Ownable {

    // 購票系統活動狀態
    enum Status { PENDING, ACTIVE, CLOSED } //定義購票系統的三種可能狀態 準備 活動 關閉
    Status public status;
    
    // 定義 Ticket 結構，代表一張火車票的資訊
    struct Ticket {
        string departure;      // 出發地
        string destination;    // 目的地
        string date;           // 出發日期
        string trainNumber;    // 車次
        string seat;           // 新增座位欄位
        address owner;         // 擁有該票的錢包地址
    }

    // 儲存所有已購買的車票（按陣列儲存）
    Ticket[] public tickets;

    // 當購票成功時發出的事件，記錄購買者地址與票券 ID
    event TicketPurchased(address indexed buyer, uint indexed ticketId);

    // 當退票成功時發出的事件，記錄購買者地址、票券 ID與價格
    event TicketRefunded(address indexed buyer, uint indexed ticketId, uint amount);
    

    // 活動參數
    uint256 public endTime;  //活動結束時間戳

     //構造函數在合約部署時執行
    constructor(
        uint256 _endTime,  //活動結束時間戳
        address initialOwner  //初始合約擁有者
    )payable  Ownable() {
        endTime = _endTime;
        status = Status.PENDING;
        _transferOwnership(initialOwner); 
    }





    // 使用者可呼叫此函式來購買車票，需提供出發地、目的地與日期
    function purchaseTickets(
        string memory _departure,
        string memory _destination,
        string memory _date,
        string memory _trainNumber,
        string[] memory _seats,           // 多個座位
        uint256 expectedTotalPrice        // 多張總價（單位 wei）
    ) external payable {
        // 驗證 ETH 足夠
        require(msg.value >= expectedTotalPrice, "money is not enough");

        // 檢查所有座位是否都未被購買
        for (uint i = 0; i < _seats.length; i++) {
            for (uint j = 0; j < tickets.length; j++) {
                if (
                    keccak256(bytes(tickets[j].trainNumber)) == keccak256(bytes(_trainNumber)) &&
                    keccak256(bytes(tickets[j].date)) == keccak256(bytes(_date)) &&
                    keccak256(bytes(tickets[j].seat)) == keccak256(bytes(_seats[i]))
                ) {
                    revert("One or more seats are already taken");
                }
            }
        }

        // 寫入所有票
        for (uint i = 0; i < _seats.length; i++) {
            tickets.push(Ticket({
                departure: _departure,
                destination: _destination,
                date: _date,
                trainNumber: _trainNumber,
                seat: _seats[i],
                owner: msg.sender
            }));
            emit TicketPurchased(msg.sender, tickets.length - 1);
        }
    }



    // 使用者可查詢自己購買的所有車票
    function getMyTickets() external view returns (Ticket[] memory) {
        uint count = 0;

        // 第一次迴圈：先統計呼叫者擁有幾張票
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == msg.sender) {
                count++;
            }
        }

        // 宣告一個記憶體中的 Ticket 陣列，大小為自己持有的票數
        Ticket[] memory myTickets = new Ticket[](count);
        uint index = 0;

        // 第二次迴圈：將屬於呼叫者的票複製到 myTickets 陣列中
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == msg.sender) {
                myTickets[index] = tickets[i];
                index++;
            }
        }

        // 回傳該使用者的所有車票資訊
        return myTickets;
    }





    //取得特定票的 ID
    function getMyTicketsWithIds() external view returns (Ticket[] memory, uint[] memory) {
        uint count = 0;

        // 第一次迴圈：計算使用者擁有幾張票
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == msg.sender) {
                count++;
            }
        }

        // 建立記憶體陣列，大小為該使用者擁有的票數
        Ticket[] memory myTickets = new Ticket[](count);
        uint[] memory myIds = new uint[](count);
        uint index = 0;

        // 第二次迴圈：把屬於使用者的票與其在 tickets 陣列中的 index 存進陣列
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].owner == msg.sender) {
                myTickets[index] = tickets[i]; // 票券資料
                myIds[index] = i;              // 對應的 ticketId（索引）
                index++;
            }
        }

        // 回傳票券陣列與對應的 ticketId 陣列
        return (myTickets, myIds);
    }



    //車票退票
    function refundTicket(uint ticketId, uint256 expectedPrice) external {
        // 檢查 ticketId 是否存在於 tickets 陣列中
        require(ticketId < tickets.length, "Invalid ticket ID");

        // 取得要退票的 Ticket，使用 storage 讓我們能夠修改原始資料
        Ticket storage ticket = tickets[ticketId];

        // 確保呼叫者是該票的擁有者
        require(ticket.owner == msg.sender, "You are not the owner");

        // 將 ETH 退還給使用者（以 expectedPrice 金額）
        (bool success, ) = msg.sender.call{value: expectedPrice}(""); 
        require(success, "Refund failed"); // 若轉帳失敗則 revert 整筆交易

        // 為了避免中間刪除造成資料破洞：若退票不是最後一張，則搬最後一張到該位置
        uint lastIndex = tickets.length - 1;
        if (ticketId != lastIndex) {
            tickets[ticketId] = tickets[lastIndex];
        }

        // 移除最後一張（無論是被搬走的或原本要刪的）
        tickets.pop();

        // 發出事件，供前端監聽退款成功
        emit TicketRefunded(msg.sender, ticketId, expectedPrice);
     }


}






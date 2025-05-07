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
        address owner;         // 擁有該票的錢包地址
    }

    // 儲存所有已購買的車票（按陣列儲存）
    Ticket[] public tickets;

    // 當購票成功時發出的事件，記錄購買者地址與票券 ID
    event TicketPurchased(address indexed buyer, uint indexed ticketId);

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
    function purchaseTicket(string memory _departure, string memory _destination, string memory _date, string memory _trainNumber) external {
        // 新增一張票到 tickets 陣列，擁有者設為目前呼叫者（msg.sender）
        tickets.push(Ticket({
            departure: _departure,
            destination: _destination,
            date: _date,
            trainNumber: _trainNumber,
            owner: msg.sender
        }));

        // 觸發事件，通知購票成功與該票的 ID（索引）
        emit TicketPurchased(msg.sender, tickets.length - 1);
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
}

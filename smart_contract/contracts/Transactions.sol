//SPDX-License-Identifier: UNLICENSED
//solidity version
pragma solidity ^0.8.19;

//create contract
contract Transactions {
    uint256 transactionCount;

    //create an event which can be later emitted
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    //create the structure of the Transfer event i.e the expected types of Transfer event
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    //define array of different transactions
    TransferStruct[] transactions;

    //create functions
    function addToBlockchain(address payable receiver, uint amount, string memory keyword, string memory message) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        //emit Transfer
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
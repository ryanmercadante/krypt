// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Transactions {
    uint256 transactionCounter;

    event Transfer(
        address from,
        address receiver,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain() public {}

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {}

    function getTransactionCount() public view returns (uint256) {}
}

/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract LogTransaction is Delegated {
    struct TransactionInfo {
        bool registerd_;
        address sender_;
        address receiver_;
        uint amount_;
        uint time_;
        bytes32 data_;
    }

    /* wallet(address) =>  transactions(address) */
    mapping(address => mapping(address => TransactionInfo)) public wallet_;

    constructor() public Delegated() {}

    function checkTransaction(address _wallet, address _transaction) internal constant {
        require(wallet_[_wallet][_transaction].registerd_);
    }

    function registerTransaction(address _wallet, address _transaction,
                             address _sender, address _receiver,
                             uint _amount, uint _time, bytes32 _data) public {
        checkDelegate(msg.sender, 1);

        wallet_[_wallet][_transaction].registerd_ = true;
        wallet_[_wallet][_transaction].sender_ = _sender;
        wallet_[_wallet][_transaction].receiver_ = _receiver;
        wallet_[_wallet][_transaction].amount_ = _amount;
        wallet_[_wallet][_transaction].time_ = _time;
        wallet_[_wallet][_transaction].data_ = _data;
    }

    function printTransaction(address _wallet, address _transaction) public view returns (string) {
        checkDelegate(msg.sender, 1);
        checkTransaction(_wallet, _transaction);

        string memory str;

        string memory sender = PlatString.addressToString(wallet_[_wallet][_transaction].sender_);
        str = PlatString.append("[sender]", sender, " ");

        string memory receiver = PlatString.addressToString(wallet_[_wallet][_transaction].receiver_);
        str = PlatString.append(str, "[receiver_]", receiver, " ");

        string memory amount = PlatString.uintToString(wallet_[_wallet][_transaction].amount_);
        str = PlatString.append(str, "[amount]", amount, " ");

        string memory time = PlatString.uintToString(wallet_[_wallet][_transaction].time_);
        str = PlatString.append(str, "[time]", time, " ");

        string memory data = PlatString.bytes32ToString(wallet_[_wallet][_transaction].data_);
        str = PlatString.append(str, "[data]", data, " ");

        return str;
    } 
}

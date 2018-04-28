/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./plat_math.sol";

contract SimulatorBase is Object {
    bool private started_;
    bool private running_ ;
    uint private endTime_ ;
    uint private probability_;   //from 0 to 1000
    uint private agrPrice_;
    uint private proLockedAmount_;
    bytes32 private tokeSymbol_;
    address private agrWalletAdr_ ;
    address private proWalletAdr_ ;
    address private recWalletAdr_;
    
    uint private randSeed = 0;

    constructor(bytes32 _name) public Object(_name) {
        running_ = false;
        started_ = false;
    }

    // Generates a random number
    // Original file at 
    // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
    function randGen(uint _min, uint _max, uint _seed) private constant returns (uint){
        require(_max > _min);
        uint randValue = uint(keccak256(blockhash(block.number-1), _seed ))%(_max - _min);
        randValue.add(_min);

        return randValue;
    }

    function startSimulation(uint _probLevel, uint _price, uint _end, uint _lockedAmount, address _agrWallet, address _proWallet, address _recWallet) public {
        checkDelegate(msg.sender, 1);

        require(_price != 0);
        require(_probLevel > 0 && _probLevel < 100);
        require(_agrWallet != address(0) && _proWallet != address(0) &&  _recWallet != address(0));

        probability_     = randGen(_probLevel, 100, now);
        started_         = true;
        running_         = true;
        endTime_         = _end;
        agrPrice_        = _price;
        proLockedAmount_ = _lockedAmount;
        agrWalletAdr_    = _agrWallet;
        proWalletAdr_    = _proWallet;
        recWalletAdr_    = _recWallet;
    }

    function doesFinished() public constant returns (bool) { 
        checkDelegate(msg.sender, 1);

        if (now > endTime_) {
            running_ = false;
        }
        return (started_ && !running_);
    } 

    function needClaim() public constant returns (bool) {
        checkDelegate(msg.sender, 1);

        uint rand = randGen(0, 100, now);
        if (rand < probability_) {
            return true;
        }
        return false;
    }

    function getAgreementPrice() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return agrPrice_;
    }

    function getProviderLockedAmount() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return proLockedAmount_;
    }

    function getWalletAddress(bytes32 _type) public constant returns (address) {
        checkDelegate(msg.sender, 1);

        if (_type == "proivder") {
            return proWalletAdr_;
        } else if (_type == "agreement") {
            return agrWalletAdr_;
        } else if (_type == "receiver") {
            return recWalletAdr_;
        } else {
            revert();
        }
    }
    
}

/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract SimulatorBase is Object {
    bool started_;
    bool running_ ;
    uint probability_;   //from 0 to 1000
    uint agrPrice_;
    uint proLockedAmount_;
    bytes32 tokeSymbol_;
    address agrWalletAdr_ ;
    address proWalletAdr_ ;
    address recWalletAdr_;
    
    uint private randSeed = 0;

    function SimulatorBase(bytes32 _name) public Object(_name) {
        running_ = false;
    }

    // Generates a random number
    // Original file at 
    // https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
    function randGen(uint _min, uint _max, uint _seed) private constant returns (uint){
        require(_max > _min);
        uint randValue = uint(keccak256(block.blockhash(block.number-1), _seed ))%(_max - _min);

        return (randValue + _min);
    }

    function startSimulation(uint _probLevel, uint _price, uint _lockedAmount, address _agrWallet, address _proWallet, address _recWallet) public only_delegate(1) {
        running_         = true;
        probability_     = randGen(_probLevel, 100, now);
        agrPrice_        = _price;
        proLockedAmount_ = _lockedAmount;
        agrWalletAdr_    = _agrWallet;
        proWalletAdr_    = _proWallet;
        recWalletAdr_    = _recWallet;
    }

    function doesStarted() public only_delegate(1) constant returns (bool) { 
        return started_;
    } 

    function doesFinished() public only_delegate(1) constant returns (bool) { 
        return (!running_);
    } 

    function needClaim() public only_delegate(1) constant returns (bool) {
        uint rand = randGen(0, 100, now);
        if (rand < probability_) {
            return true;
        }
        return false;
    }

    function getAgreementPrice() public only_delegate(1) constant returns (uint) {
        return agrPrice_;
    }

    function getProviderLockedAmount() public only_delegate(1) constant returns (uint) {
        return proLockedAmount_;
    }

    function getWalletAddress(bytes32 _type) public only_delegate(1) constant returns (address) {
        if (_type == "proivder") {
            return proWalletAdr_;
        } else if (_type == "agreement") {
            return agrWalletAdr_;
        } else if (_type == "receiver") {
            return recWalletAdr_;
        } else {
            return 0;
        }
    }
    
}

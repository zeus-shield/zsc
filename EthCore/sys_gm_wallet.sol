/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./sys_include_adv.sol";

contract SysGmWallet is SysGmBase {
    struct Erc20Token {
        bytes32 status_;
        bytes32 name_;  
        bytes32 symbol_ ;
        uint    decimals_;
        address tokenAdr_;
    }

    struct TokenHolder {
        bytes32 name_;
        address adr_;
        address binedEthWallet_;
        uint enabledTokenNos_;
        mapping(bytes32 => bool) enabledTokenSymbols_; // by index
    }

    uint holderNos_;
    TokenHolder tokenHolders_;

    // Constructor
    function SysGmWallet(bytes32 _name) public SysGmBase(_name) {
        holderNos_ = 0;
    } 
    
    function formatWalletName(bytes32 _userName, bytes32 _tokenSymbol) internal pure returns (bytes32) {
        string memory str;
        str = PlatString.append(_userName, "-", _tokenSymbol);
        return PlatString.tobytes32(str);
    }

    function enableWalletByUser(bytes32 _user, bytes32 _tokeSymbol, address _factoryAdr, address _tokenContractAdr) public returns (address) {
        checkDelegate(msg.sender, 1);
        
        require(_factoryAdr != address(0));
        if (_tokeSymbol != "ETH") {
            require(_tokenContractAdr != address(0));
        }

        address ndAdr = DBDatabase(getDatabase()).getNode(_user);
        require(ndAdr != address(0));
        
        bytes32 ndType = DBNode(ndAdr).getNodeType();
        require(ndType == "provider" || ndType == "receiver" || ndType == "staker" || ndType == "agreement");
        
        address walletAdr  = DBFactory(_factoryAdr).createNode(formatWalletName(_user, _tokeSymbol), ndAdr);
        require(walletAdr != 0);
    
        DBNode(walletAdr).setERC20TokenAddress(_tokenContractAdr);    
        return walletAdr;
      
        return address(0);
    }
    
    /*
    function conductPublishAgreement(bytes32 _userName, bytes32 _agrName, address _creator) public returns (uint) {
        checkDelegate(msg.sender, 1);

        address agrAdr = DBDatabase(getDatabase()).getNode(_agrName);
        bytes32 tokenSymbol = DBNode(agrAdr).getParameter("walletSymbol");
        address userWallet = DBDatabase(getDatabase()).getNode(formatWalletName(_userName, tokenSymbol));

        require(userWallet != address(0));
        string memory temp = PlatString.bytes32ToString(DBNode(agrAdr).getParameter("lockedAmount"));
        uint lockedAmount = PlatString.stringToUint(temp);

        address agrWallet = enableWalletByUser(_agrName, tokenSymbol, _creator);
        uint amount = DBNode(userWallet).executeTransaction(agrWallet, lockedAmount);
        require(amount > 0);

        DBNode(agrAdr).setAgreementStatus("PUBLISHED", "null");
        return amount;
    }

    function conductInformTransaction(bytes32 _enName, address _dest, uint256 _amount) public returns (bool) {
        checkDelegate(msg.sender, 1);

        address dbAdr       = getDatabase();
        //address destAdr     = DBDatabase(dbAdr).getNode(Object(_dest).name());
        bytes32 tokenSymbol = DBNode(_dest).getParameter("walletSymbol");
        address userWallet  = DBDatabase(dbAdr).getNode(formatWalletName(_enName, tokenSymbol));
        DBNode(_dest).informTransaction(userWallet, _dest, _amount);
        return true;
    }
    */
}

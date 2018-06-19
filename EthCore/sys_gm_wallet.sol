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
    function SysGmWallet() public SysComModule("zsc_wallet_manager") {
        holderNos_ = 0;
    } 

    /*
    function removeTokenContract(bytes32 _symbol) public {
        checkDelegate(msg.sender, 1);
        require(erc20TokenExists_[_symbol]);
        
        uint index = erc20TokenIndice_[_symbol];
        Erc20Token storage info = erc20Tokens_[tokenNos_ - 1];

        erc20TokenIndice_[_symbol] = index;

        delete erc20TokenIndice_[_symbol];
        delete erc20TokenExists_[_symbol];
        delete erc20Tokens_[tokenNos_ - 1];
        tokenNos_--;
    }*/

    function enableWalletByUser(bytes32 _user, bytes32 _tokeSymbol, address _creator) public returns (address) {
        checkDelegate(msg.sender, 1);

        address ndAdr = DBDatabase(getDatabase()).getNode(_user);
        require(ndAdr != address(0));
        
        bytes32 ndType = DBNode(ndAdr).getNodeType();
        if (ndType == "provider" || ndType == "receiver") {
            if (_tokeSymbol == "ZSC" || _tokeSymbol == "ETH") {
                address parentNode   = DBNode(ndAdr).getHandler("wallet");
                address erc20Address = 0; 
                bytes32 temp;
                bytes32 factoryType;
    
                temp = formatWalletName(_user, _tokeSymbol);

                if (_tokeSymbol == "ETH") {
                    factoryType = "wallet-eth";
                } else {
                    factoryType = "wallet-erc20";
                    erc20Address = getTokenContractAddress(_tokeSymbol);
                    require(erc20Address != 0);
                }
                address factoryGM   = SysOverlayer(getSysOverlayer()).getComponent("factory", "gm");
                address factoryAdr = FactoryManager(factoryGM).getAdr(factoryType);
                address walletAdr  = FactoryBase(factoryAdr).createNode(temp, parentNode, _creator);
                require(walletAdr != 0);
    
                DBNode(walletAdr).setERC20TokenAddress(erc20Address);    
                return walletAdr;
            }
        }
        return address(0);
    }


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
}

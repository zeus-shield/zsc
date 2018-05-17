/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_module.sol";

contract SysGmWallet is SysComModule {
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
        mapping(uint => bool) enabledTokens_; // by index
    }

    uint private tokenNos_;
    mapping(uint => Erc20Token) private erc20Tokens_;
    mapping(bytes32 => uint) private erc20TokenIndice_;
    mapping(bytes32 => bool) private erc20TokenExists_;

    // Constructor
    constructor() public SysComModule("zsc_wallet_manager") {
        tokenNos_ = 0;
    } 

    function formatWalletName(bytes32 _userName, bytes32 _tokenSymbol) internal pure returns (bytes32) {
        string memory str;
        bytes32 temp;
        if (_tokenSymbol == "ETH") {
            str = PlatString.append(_userName, "-ETH");
        } else {
            str = PlatString.append(_userName, "-", _tokenSymbol);
        }
        temp = PlatString.tobytes32(str);
    }

    function getTokenContractAddress(bytes32 _symbol) internal constant returns (address) {
        require(erc20TokenExists_[_symbol]);
        
        uint index = erc20TokenIndice_[_symbol];
        return erc20Tokens_[index].tokenAdr_;
    }

    function doesTokenContractExists(bytes32 _symbol) public constant returns (bool) {
        checkDelegate(msg.sender, 1);
        return erc20TokenExists_[_symbol];
    }

    function addTokenContract(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(!erc20TokenExists_[_symbol]);

        erc20TokenIndice_[_symbol] = tokenNos_;
        erc20Tokens_[tokenNos_] = Erc20Token("true", _name, _symbol, _decimals, _tokenAdr);
        tokenNos_++;
        return true;
    }

    function removeTokenContract(bytes32 _symbol) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(erc20TokenExists_[_symbol]);
        
        uint index = erc20TokenIndice_[_symbol];
        Erc20Token info = erc20Tokens_[tokenNos_ - 1];

        erc20TokenIndice_[endSymbol] = index;

        delete erc20TokenIndice_[_symbol];
        delete erc20TokenExists_[_symbol];
        delete erc20Tokens_[tokenNos_ - 1];
        tokenNos_--;
    }

    function disableTokenContract(bytes32 _symbol) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (!erc20TokenExists_[_symbol]) return false;
        
        uint index = erc20TokenIndice_[_symbol];
        erc20Tokens_[index].status_ = "false";
    }

    function numTokenContracts() public constant returns (uint) {
        return tokenNos_;
    }
    
    function getTokenInfoByIndex(uint _index) public constant returns (bytes32, bytes32, bytes32, uint, address) {
        checkDelegate(msg.sender, 1);

        require(_index < tokenNos_);
        return (erc20Tokens_[_index].status_,
                erc20Tokens_[_index].name_, 
                erc20Tokens_[_index].symbol_,
                erc20Tokens_[_index].decimals_,
                erc20Tokens_[_index].tokenAdr_);
    }

    function enableWalletByUser(bytes32 _user, bytes32 _tokeSymbol, address _creator) public returns (address) {
        checkDelegate(msg.sender, 1);

        address ndAdr = DBDatabase(getDatabase()).getNode(_user);
        require(ndAdr != address(0));
        
        bytes32 ndType = DBNode(_user).getNodeType();
        if (ndType == "provider" || ndType == "receiver") {
            if (_tokeSymbol == "ZSC" || _tokeSymbol == "ETH") {
                address parentNode = getDBNode(_user).getHandler("wallet");
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

                address systemGM   = getSystemManager();
                address factoryAdr = SystemManager(systemGM).getFactory(factoryType);
                address walletAdr  = DBFactory(factoryAdr).createNode(temp, parentNode, _creator);
                require(walletAdr != 0);
    
                DBNode(walletAdr).setERC20TokenAddress(erc20Address);    
                return walletAdr;
            }
        }
        return address(0);
    }

    function conductPurchaseAgreement(bool _isFirstSubmit, bytes32 _userName, bytes32 _agrName, address _sigAdr) internal returns (uint) {
        address argAdr = DBDatabase(getDatabase()).getNode(_agrName);

        bytes32 tokenSymbol = PlatString.tobytes32(DBNode(agrAdr).getParameter("walletSymbol"));
        uint price          = PlatString.stringToUint(DBNode(agrAdr).getParameter("price"));
        address recWallet   =  DBDatabase(getDatabase()).getNode(formatWalletName(_userName, tokenSymbol));
        address agrWallet   =  DBDatabase(getDatabase()).getNode(formatWalletName(_agrName, tokenSymbol));

        uint purchaseAount = 0;
        if (_isFirstSubmit) {
            purchaseAount = DBNode(recWallet).submitTransaction(agrWallet, price, "", _sigAdr);
        } else { 
            purchaseAount = DBNode(recWallet).confirmTransaction(_sigAdr);
        }
        return purchaseAount;
    }

    function conductPublishAgreement(bytes32 _userName, bytes32 _agrName, address _creator) internal returns (uint) {
        address argAdr = DBDatabase(getDatabase()).getNode(_agrName);
        bytes32 tokenSymbol = PlatString.tobytes32(DBNode(agrAdr).getParameter("walletSymbol"));
        address userWallet = DBDatabase(getDatabase()).getNode(formatWalletName(_userName, tokenSymbol));

        require(userWallet != address(0));
        uint lockedAmount = PlatString.stringToUint(PlatString.tobytes32(DBNode(_agrName).getParameter("lockedAmount"));

        address agrWallet = enableWalletByUser(_agrName, tokenSymbol, _creator);
        uint amount = DBNode(userWallet).executeTransaction(agrWallet, lockedAmount, "", _creator);
        require(amount > 0);

        DBNode(argAdr).setAgreementStatus("PUBLISHED", "null");
        return amount;
    }

    function conductInformTransaction(bytes32 _userName, bytes32 _enName, address _dest, uint256 _amount) internal returns (bool) {
        address destAdr = DBDatabase(getDatabase()).getNode(Object(_dest).name());
        bytes32 tokenSymbol = PlatString.tobytes32(DBNode(agrAdr).getParameter("walletSymbol"));
        address userWallet = DBDatabase(getDatabase()).getNode(formatWalletName(_enName, tokenSymbol));
        DBNode(_dest).informTransaction(userWallet, _dest, _amount);
        return true;
    }
}

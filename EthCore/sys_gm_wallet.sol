/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_module.sol";
import "./sys_include_adv.sol";

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
    function SysGmWallet() public SysComModule("zsc_wallet_manager") {
        tokenNos_ = 0;
    } 

    function getTokenContractAddress(bytes32 _symbol) internal constant returns (address) {
        require(erc20TokenExists_[_symbol]);
        
        uint index = erc20TokenIndice_[_symbol];
        return erc20Tokens_[index].tokenAdr_;
    }

    function formatWalletName(bytes32 _userName, bytes32 _tokenSymbol) public pure returns (bytes32) {
        string memory str;
        bytes32 temp;
        if (_tokenSymbol == "ETH") {
            str = PlatString.append(_userName, "-ETH");
        } else {
            str = PlatString.append(_userName, "-", _tokenSymbol);
        }
        temp = PlatString.tobytes32(str);
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

    function disableTokenContract(bytes32 _symbol) public {
        checkDelegate(msg.sender, 1);
        require(!erc20TokenExists_[_symbol]);
        
        uint index = erc20TokenIndice_[_symbol];
        erc20Tokens_[index].status_ = "false";
    }

    function numTokenContracts() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
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

    function conductPurchaseAgreement(bool _isFirstSubmit, bytes32 _userName, bytes32 _agrName, address _sigAdr) public returns (uint) {
        checkDelegate(msg.sender, 1);

        address agrAdr = DBDatabase(getDatabase()).getNode(_agrName);

        bytes32 tokenSymbol = DBNode(agrAdr).getParameter("walletSymbol");
        uint price          = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("price")));
        address recWallet   = DBDatabase(getDatabase()).getNode(formatWalletName(_userName, tokenSymbol));
        address agrWallet   = DBDatabase(getDatabase()).getNode(formatWalletName(_agrName, tokenSymbol));


        require(_isFirstSubmit);
        _sigAdr = address(0);
        return DBNode(recWallet).executeTransaction(agrWallet, price);

        /*
        uint purchaseAount = 0;
        if (_isFirstSubmit) {
            purchaseAount = DBNode(recWallet).submitTransaction(agrWallet, price, "", _sigAdr);
        } else { 
            purchaseAount = DBNode(recWallet).confirmTransaction(_sigAdr);
        }
        return purchaseAount;
        */
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

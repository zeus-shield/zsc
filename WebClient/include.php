<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class ZSCInclude {
    private $g_userType;

    public function __construct($type){
         $this->g_userType = $type;
    }

    public  function __destruct() {
    }
    
    private function loadPosHeader() {
        $text=
        '<table align="center" style="width:650px">'.
        ' <tr>'.
        '  <td align="center"><a href="index.php"> [Home] </a></td>'.
        '  <td align="center"><a href="user_wallet.php"> [Wallet] </a></td>'.
        '  <td align="center"><a href="pos_robot_users.php"> [Robots]</a></td>'.
        '  <td align="center"><a href="pos_robot_market.php"> [Robot-market] </a></td>'.
        ' </tr>'.
        '</table>';
        return $text;
    }

    private function loadInsuraProviderHeader() {
        $text=
        '<table align="center" style="width:650px">'.
        ' <tr>'.
        '  <td align="center"><a href="index.php"> [Home] </a></td>'.
        '  <td align="center"><a href="user_profile.php"> [User-profile] </a></td>'.
        '  <td align="center"><a href="user_wallet.php"> [User-wallet] </a></td>'.
        '  <td align="center"><a href="insura_tmp.php"> [Templats]</a></td>'.
        '  <td align="center"><a href="insura_agr_all.php"> [Market]</a></td>'.
        ' </tr>'.
        '</table>';
        return $text;
    }

    private function loadInsuraReceiverHeader() {
        $text=
        '<table align="center" style="width:650px">'.
        ' <tr>'.
        '  <td align="center"><a href="index.php"> [Home] </a></td>'.
        '  <td align="center"><a href="user_profile.php"> [User-profile] </a></td>'.
        '  <td align="center"><a href="user_wallet.php"> [User-wallet] </a></td>'.
        '  <td align="center"><a href="insura_agr_receiver.php"> [Agreements]</a></td>'.
        '  <td align="center"><a href="insura_agr_all.php"> [Market]</a></td>'.
        ' </tr>'.
        '</table>';
        return $text;
    }

    public function loadScriptFiles() {
        $text = '
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="./web3.js/dist/web3.js"></script>
        <script type="text/javascript" src="./common/web3js.js"></script>
        
        <script type="text/javascript" src="./common/userFunctions.js"></script>
        <script type="text/javascript" src="./common/basicFunctions.js"></script>
        
        <script type="text/javascript" src="./common/zsc_element.js"></script>
        <script type="text/javascript" src="./common/zsc_transactions.js"></script>
        <script type="text/javascript" src="./common/zsc_login.js"></script>
        <script type="text/javascript" src="./common/zsc_wallet.js"></script>
        <script type="text/javascript" src="./common/zsc_module_adrs.js"></script>
        
        <script type="text/javascript" src="./pos/pos_robot_all_briefs.js"></script>
        <script type="text/javascript" src="./pos/pos_robot_single_details.js"></script>

        <script type="text/javascript" src="./insura/zsc_agreements.js"></script>
        <script type="text/javascript" src="./insura/zsc_agreements_all.js"></script>
        <script type="text/javascript" src="./insura/zsc_agreements_provider.js"></script>
        <script type="text/javascript" src="./insura/zsc_agreements_receiver.js"></script>
        <script type="text/javascript" src="./insura/zsc_templates.js"></script>
        ';
        return $text;
    }

    public function loadAlert() {
        $text=
        "<i>Needs to install MetaMask extension</i>". 
        "<i> (需要安装MetaMask插件才能显示登录框以及其他相关页面)</i><br>".
        "<i>Both the FireFox and Chrome browsers are recommended</i>".
        "<i> (推荐使用火狐或者Chrome浏览器)</i>";  
        return $text;
    }

    public function loadHeader() {
        if ($this->g_userType == "provider") {
            return $this->loadInsuraProviderHeader();

        } else if ($this->g_userType == "receiver") {
            return $this->loadInsuraReceiverHeader();

        } else if ($this->g_userType == "staker") {
            return $this->loadPosHeader();

        } else {
            return 'user type:'.$this->g_userType;
        }
    }

    public function loadWeb3() {
        $text='
    var web3;
    if (doesLocalWeb3js()) { 
        web3 = setupWeb3js();
    } else { 
        web3 = new Web3(web3.currentProvider);
    } //Metamask
        ';
        return $text;
    }

    public function checkWeb3Account() {
        $text='
    function(callback){
        var userAccount = web3.eth.coinbase;
        var tag = true;
        if (userAccount == "null" || userAccount == null) {
            tag = false;
        } 
    
       if(tag){
            console.log(userAccount);
            callback(userAccount);
        } else {
            console.log(userAccount);
            var wait_callback = function(){
                checkeWeb3Account(callback);
            };
            setTimeout(wait_callback, 200);
        }
    }
    ';
        return $text;
    }

}
?>


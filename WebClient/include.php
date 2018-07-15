<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class ZSCInclude {
    public function __construct(){
    }

    public  function __destruct() {
    }
    
    public function loadScriptFiles() {
        $text = '
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="./web3.js/dist/web3.js"></script>
        <script type="text/javascript" src="./web3js.js"></script>
        
        <script type="text/javascript" src="./common/userFunctions.js"></script>
        <script type="text/javascript" src="./common/basicFunctions.js"></script>
        
        <script type="text/javascript" src="./common/zsc_element.js"></script>
        <script type="text/javascript" src="./common/zsc_transactions.js"></script>
        <script type="text/javascript" src="./common/zsc_user.js"></script>
        <script type="text/javascript" src="./common/zsc_wallet.js"></script>
        <script type="text/javascript" src="./common/zsc_module_adrs.js"></script>
        
        <script type="text/javascript" src="./pos/pos_robot_enhance.js"></script>
        <script type="text/javascript" src="./pos/pos_robot_gen0.js"></script>
        <script type="text/javascript" src="./pos/pos_robot_owned.js"></script>
        ';
        return $text;
    }

    public function loadWeb3() {
        $text='
        var web3;
        var zscUser = new ZSCUser();
        if (doesLocalWeb3js()) { web3 = setupWeb3js();} 
        else { web3 = new Web3(web3.currentProvider);} //Metamask
        ';
        return $text;
    }

    public function checkUserLogin() {
        $text='
        zscUser.tryLogin(function(ret) {
            var textBody;
            if(!ret) {
                window.location.href = "index.php"; 
            } 
        });
        ';
        return $text;
    }

    public function loadAlert() {
        $text=
        "<i>Needs to install MetaMask extension</i><br>". 
        "<i>(需要安装MetaMask插件才能显示登录框以其他相关页面)</i><br><br>".
        "<i>Both the FireFox and Chrome browsers are recommended</i><br>".
        "<i>(推荐使用火狐或者Chrome浏览器)</i>";  
        return $text;
    }

    public function loadPosHeader() {
        $text=
        '<table align="center" style="width:600px">'.
        ' <tr>'.
        '  <td align="center"><a href="user_profile.php">User Profile</a></td>'.
        '  <td align="center"><a href="pos_robot_gen0.php">Create Gen0 Robot</a></td>'.
        '  <td align="center"><a href="pos_robot_owned.php">Owned Market</a></td>'.
        '  <td align="center"><a href="pos_robot_market.php">Robot Market</a></td>'.
        ' </tr>'.
        '</table>';
        return $text;
    }
}
?>


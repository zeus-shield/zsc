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
        <script type="text/javascript" src="./common/zsc_login.js"></script>
        <script type="text/javascript" src="./common/zsc_wallet.js"></script>
        <script type="text/javascript" src="./common/zsc_module_adrs.js"></script>
        
        <script type="text/javascript" src="./pos/pos_robot_enhance.js"></script>
        <script type="text/javascript" src="./pos/pos_robot_gen0.js"></script>
        <script type="text/javascript" src="./pos/pos_robot_owned.js"></script>
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

    public function getAdmAdr() {
        $text = "'0x2d14d4d58b56407e8057bf96a36f3d9954506052'";
        return $text;
    } 

    public function getAdmAbi() {
        $text = '[{"constant":false,"inputs":[{"name":"_type","type":"bytes32"}],"name":"activeByUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getUserType","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getControlApisFullAbi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getControlApisAdr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tryLogin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getUserStatus","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}];';
        return $text;
    }
}
?>


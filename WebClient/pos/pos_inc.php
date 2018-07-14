<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class PosInc {
    public function __construct(){
        parent::__construct();
    }

    public  function __destruct() {
    }

    public function loadHeader() {
        $text='<br><br>
        <div align="center">
        <table align="center" style="width:800px">
           <tr>
            <td align="center"><a href="pos_staker_profile.php">Create contract</a></td>
            <td align="center"><a href="pos_robot_gen0.php">Init System Component</a></td>
            <td align="center"><a href="pos_robot_owned.php">Configure LogRecorder</a></td>
            <td align="center"><a href="pos_robot_market.php">Add Database</a></td>
          </tr>
        </table>
        </div>';
        return $text;
    }
    
    public function loadScriptFiles() {
        $text = '
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script type="text/javascript" src=".././web3.js/dist/web3.js"></script>
        <script type="text/javascript" src="../web3js.js"></script>
        
        <script type="text/javascript" src="../userFunctions.js"></script>
        <script type="text/javascript" src="../basicFunctions.js"></script>
        
        <script type="text/javascript" src="../zsc_element.js"></script>
        <script type="text/javascript" src="../zsc_transactions.js"></script>
        <script type="text/javascript" src="../zsc_user.js"></script>
        <script type="text/javascript" src="../zsc_wallet.js"></script>
        <script type="text/javascript" src="../zsc_module_adrs.js"></script>
        
        <script type="text/javascript" src="./js/zsc_element.js"></script>
        <script type="text/javascript" src="./js/zsc_transactions.js"></script>
        <script type="text/javascript" src="./js/zsc_user.js"></script>
        <script type="text/javascript" src="./js/zsc_wallet.js"></script>
        <script type="text/javascript" src="./js/zsc_module_adrs.js"></script>
        ';
        return $text;
    }
}
?>


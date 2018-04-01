
<?php

function includeHeader() {
    $databaseAdr = "dddd";
    $text='<br><br>
    <div align="center">
    <table align="center" style="width:400px;min-height:30px">
       <tr>
        <td align="center"><a href="adm_creat_contract.php">Create contract</a></td>
        <td align="center"><a href="adm_configure_logrecorder.php">Configure LogRecorder</a></td>
        <td align="center"><a href="adm_control_apis_adv.php">Control system</a></td>
        <td align="center"><a href="adm_main.php">Adm Main</a></td>
      </tr>
    </table>
    </div>';
    return $text;
}

function includeScriptFiles() {
    $text = '
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../WebClient/web3.js/dist/web3.js"></script>
    <script type="text/javascript" src="../WebClient/web3js.js"></script>

    <script type="text/javascript" src="./js/basicApis.js"></script>
    <script type="text/javascript" src="./js/createContract.js"></script>
    <script type="text/javascript" src="./js/setupFunctions.js"></script>
    
    <script type="text/javascript" src="./js/solc/compiled_database.js"></script>
    <script type="text/javascript" src="./js/solc/compiled_factory_pro.js"></script>
    <script type="text/javascript" src="./js/solc/compiled_apis.js"></script>
    <script type="text/javascript" src="./js/solc/compiled_loger.js"></script>';
    return $text;
}

?>


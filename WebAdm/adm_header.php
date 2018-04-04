
<?php

class zscModule { 
    public $moduleArray = array("LogRecorder", "AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");   
    
    function getModuleArray() { 
        return $moduleArray; 
    } 
} 


function getModuleArray() {
    return array("LogRecorder", "AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");
}

function getLogedModuleNameArrayInString() {
    return "['AdmAdv', 'DBDatabase', 'FactoryPro', 'FactoryTmp', 'FactoryAgr', 'ControlApisAdv']";
}

function readContent($file) {
    $myfile = fopen($file, "r");
    $text = fread($myfile,filesize($file));
    fclose($myfile);
    return $text;
}

function readModuleAddress($name) {
    return readContent('./adrs/'.$name.'.txt');
}

function writeContent($file, $text) {
    echo $file;
    $myfile = fopen($file, "wr") or die("Unable to open file!");
    fwrite($myfile, $text);
    fclose($myfile);
}


function writeModuleAddress($name, $adr) {
    writeContent('./adrs/'.$name.'.txt', $adr);
}

function getLogedModuleAddressArrayInString() {
    $logedModules = getModuleArray();
    $num = count($logedModules);

    $text = "";

    for($x = 0; $x < $num; $x++) {
        $name = $logedModules[$x];
        $text .= "['".readModuleAddress($name);
    }
    return $text;
}


function loadModuleAddress($doc, $suffix) {
    $system_modules = getModuleArray();
    $num = count($system_modules);

    for($x = 0; $x < $num; $x++) {
        $name = $system_modules[$x];
        $node = $doc->getElementById($name.$suffix);
        $node->nodeValue = $name.' Address: '.readModuleAddress($name);
    }
}


function getUrlSuffixForAdrs() {
    $system_modules = getModuleArray();
    $num = count($system_modules);
    $text = '?';
    for($x = 0; $x < $num; $x++) {
        $name = $system_modules[$x];
        $text .= $name.'='.readModuleAddress($name).'&';
    }
    return $text;
}

function includAllAdrs() {
    $text='<div class="well">';
    $system_modules = getModuleArray();
    $num = count($system_modules);

    for($x = 0; $x < $num; $x++) {
        $name = $system_modules[$x];
        $text .= '<text id = "'.$name.'">'..$name.': '.readModuleAddress($name).'</text> <br>';
    }    
    $text='</div>';
    return $text;
/*
<div class="well">
    <text id = "LogRecorderAdr">LogRecorder address: '.readModuleAddress("LogRecorder").'</text> <br>                   
    <text id = "AdvAdm">AdvAdm address: '.readModuleAddress('AdvAdm').'</text> <br>                   
    <text id = "DBDatabaseAdr">DBDatabase address: '.readModuleAddress('DBDatabase').'</text> <br>                   
    <text id = "FactoryProAdr">FactoryPro address: '.readModuleAddress('FactoryPro').'</text> <br>               
    <text id = "FactoryProAdr">FactoryTmp address: '.readModuleAddress('FactoryTmp').'</text> <br>               
    <text id = "FactoryProAdr">FactoryAgr address: '.readModuleAddress('FactoryAgr').'</text> <br>               
    <text id = "ControlApisAdvAdr">ControlApis address:'.readModuleAddress('ControlApisAdv').'</text>               
</div>';
*/
}

function includeHeader() {
    $databaseAdr = "dddd";
    $text='<br><br>
    <div align="center">
    <table align="center" style="width:400px;min-height:30px">
       <tr>
        <td align="center"><a href="adm_creat_contract.php">Create contract</a></td>
        <td align="center"><a href="adm_configure_logrecorder.php">Configure LogRecorder</a></td>
        <td align="center"><a href="adm_control_apis_adv.php">Control system</a></td>
        <td align="center"><a href="adm_manage_users.php">Users</a></td>
        <td align="center"><a href="adm_templates.php">Templats</a></td>
        <td align="center"><a href="adm_agreements.php">Templats</a></td>
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
    <script type="text/javascript" src="./js/createContract.js"></script>
    <script type="text/javascript" src="./js/setupFunctions.js"></script>
    <script type="text/javascript" src="./js/compiled_database.js"></script>
    <script type="text/javascript" src="./js/compiled_factory_pro.js"></script>
    <script type="text/javascript" src="./js/compiled_apis.js"></script>
    <script type="text/javascript" src="./js/compiled_loger.js"></script>';
    return $text;
}

function includeCreateContractHtml() {
    $modules = getModuleArray();
    $num = count($modules);

    $text = "";
    for($x = 0; $x < $num; $x++) {
        $name = $modules[$x];
        $text  = '<text>Step - '.$x.': Create '.$name.'</text>';
        $text .= '<div class="well">';
        $text .= '   <text> Name: </text>';
        $text .= '   <input type="text" id="'.$name.'Name" value = "zsc_'.$name.'loger"></input>';
        $text .= '   <button type="button" onClick="cC_setupContract(\''.$name.', '.$name.'Name\')">Create</button> <br>';
        $text .= '   <text id="'.$name.'Log"></text> <br>';
        $text .= '</div>';
    }
    return $text;
}
?>


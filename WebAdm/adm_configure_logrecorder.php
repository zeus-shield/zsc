<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>


<?php
include("adm_header.php");

$urlSuffixTag = false;

$htmlObjects= new ZSCHtmlObjects();

function recordSystemObjectAdrs($modules) {
    $system_modules = $modules->getObjectArray();
    $num = count($system_modules);
    
    for($x = 0; $x < $num; $x++) {
        $module = $system_modules[$x];
        $adr = $_GET[$module];

        if(!empty($adr)){
            $urlSuffixTag = true;
            $modules->writeObjectAddress($module, $adr);
        }
    }
}
recordSystemObjectAdrs($htmlObjects);
?>

<html>
<head>
<?php echo $htmlObjects->loadScriptFiles(); ?>
<script type="text/javascript">
    var web3;
    if (doesLocalWeb3js()) {
        web3 = setupWeb3js();
    } else {
        //Metamask
        web3 = new Web3(web3.currentProvider);
    }
    
    var recorderAdr = "<?php echo $htmlObjects->readObjectAddress('LogRecorder')?>";
    var timeStampAdr = "<?php echo $htmlObjects->readObjectAddress('TimeStamp')?>";
    var zscTokenAddress = "<?php echo $htmlObjects->readObjectAddress('TestToken')?>";
    var logedModuleAdrs = <?php echo $htmlObjects->getLogedObjectAddressArrayInString()?>;

    var zscSetup = new ZSCSetup(recorderAdr, timeStampAdr, zscTokenAddress, logedModuleAdrs);

    function getObjectAdr(module) {
        var adr;
        if (module == "TestToken") adr = "<?php echo $htmlObjects->readObjectAddress('TestToken')?>";        
        else if (module == "LogRecorder") adr = "<?php echo $htmlObjects->readObjectAddress('LogRecorder')?>";        

        else if (module == "DBDatabase") adr = "<?php echo $htmlObjects->readObjectAddress('DBDatabase')?>";
        else if (module == "AdmAdv") adr = "<?php echo $htmlObjects->readObjectAddress('AdmAdv')?>";        
        else if (module == "TokenManager") adr = "<?php echo $htmlObjects->readObjectAddress('TokenManager')?>";
        else if (module == "PosManager") adr = "<?php echo $htmlObjects->readObjectAddress('PosManager')?>";
        else if (module == "ControlApisAdv") adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        else if (module == "FactoryPro") adr = "<?php echo $htmlObjects->readObjectAddress('FactoryPro')?>";
        else if (module == "FactoryRec") adr = "<?php echo $htmlObjects->readObjectAddress('FactoryRec')?>";
        else if (module == "FactoryTmp") adr = "<?php echo $htmlObjects->readObjectAddress('FactoryTmp')?>";
        else if (module == "FactoryAgr") adr = "<?php echo $htmlObjects->readObjectAddress('FactoryAgr')?>";
        else if (module == "FactoryWalletAdv") adr = "<?php echo $htmlObjects->readObjectAddress('FactoryWalletAdv')?>";

        return adr;
    }
</script>
</head>
<body>
<script type="text/javascript">
    function registerToLogRecorder(module, elementId) {
        var logAdr = "<?php echo $htmlObjects->readObjectAddress('LogRecorder')?>";
        zscSetup.registerListenerToLogRecorder(getObjectAdr(module), module, elementId, function() {
            console.log("Ok");
        });
    }

    function setLogRecorderToListener(module, elementId) {
        var logAdr = "<?php echo $htmlObjects->readObjectAddress('LogRecorder')?>";
        zscSetup.setLogRecorderToListener(getObjectAdr(module), module, elementId, function() {
            console.log("Ok");
        });
    }

</script>

<?php echo $htmlObjects->loadHeader();?>

</head>
<body>
<?php
    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';

    echo $htmlObjects->loadRegisterLogRecorderHtml('registerToLogRecorder');
    
    echo $htmlObjects->loadSetLogRecorderHtml('setLogRecorderToListener');
?>
</body>
</html>


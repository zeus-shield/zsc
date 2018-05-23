<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>


<?php
include("adm_header.php");

$urlSuffixTag = false;

$htmlModules= new ZscHtmlModules();

function recordSystemModuleAdrs($modules) {
    $system_modules = $modules->getModuleArray();
    $num = count($system_modules);
    
    for($x = 0; $x < $num; $x++) {
        $module = $system_modules[$x];
        $adr = $_GET[$module];

        if(!empty($adr)){
            $urlSuffixTag = true;
            $modules->writeModuleAddress($module, $adr);
        }
    }
}
recordSystemModuleAdrs($htmlModules);
?>

<html>
<head>
<?php echo $htmlModules->loadScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function getObjectAdr(module) {
        var adr;
        if (module == "TestToken") adr = "<?php echo $htmlModules->readObjectAddress('TestToken')?>";        
        else if (module == "LogRecorder") adr = "<?php echo $htmlModules->readObjectAddress('LogRecorder')?>";        

        else if (module == "DBDatabase") adr = "<?php echo $htmlModules->readObjectAddress('DBDatabase')?>";
        else if (module == "AdmAdv") adr = "<?php echo $htmlModules->readObjectAddress('AdmAdv')?>";        
        else if (module == "PosAdv") adr = "<?php echo $htmlModules->readObjectAddress('PosAdv')?>";
        else if (module == "WalletManager") adr = "<?php echo $htmlModules->readObjectAddress('WalletManager')?>";
        else if (module == "SimulatorManager") adr = "<?php echo $htmlModules->readObjectAddress('SimulatorManager')?>";
        else if (module == "DatabaseManager") adr = "<?php echo $htmlModules->readObjectAddress('DatabaseManager')?>";
        else if (module == "FactoryManager") adr = "<?php echo $htmlModules->readObjectAddress('FactoryManager')?>";
        else if (module == "SystemOverlayer") adr = "<?php echo $htmlModules->readObjectAddress('SystemOverlayer')?>";
        else if (module == "ControlApisAdv") adr = "<?php echo $htmlModules->readObjectAddress('ControlApisAdv')?>";


        else if (module == "FactoryPro") adr = "<?php echo $htmlModules->readObjectAddress('FactoryPro')?>";
        else if (module == "FactoryRec") adr = "<?php echo $htmlModules->readObjectAddress('FactoryRec')?>";
        else if (module == "FactoryTmp") adr = "<?php echo $htmlModules->readObjectAddress('FactoryTmp')?>";
        else if (module == "FactoryAgr") adr = "<?php echo $htmlModules->readObjectAddress('FactoryAgr')?>";

        else if (module == "FactoryWalletEth") adr = "<?php echo $htmlModules->readObjectAddress('FactoryWalletEth')?>";
        else if (module == "FactoryWalletErc20") adr = "<?php echo $htmlModules->readObjectAddress('FactoryWalletErc20')?>";

        return adr;
    }

    function registerToLogRecorder(module, elementId) {
        logAdr = "<?php echo $htmlModules->readObjectAddress('LogRecorder')?>";
        sF_registerListenerToLogRecorder(logAdr,  getObjectAdr(module), module, elementId);
    }

    function setLogRecorderToListener(module, elementId) {
        logAdr = "<?php echo $htmlModules->readObjectAddress('LogRecorder')?>";
        sF_setLogRecorderToListener(logAdr,  getObjectAdr(module), module, elementId);
    }

</script>
</head>
<body>
<?php echo $htmlModules->loadHeader();?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
</script>
</head>
<body>
<?php echo $htmlModules->loadAllAdrs();
    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';

    echo $htmlModules->loadRegisterLogRecorderHtml('registerToLogRecorder');
    
    echo $htmlModules->loadSetLogRecorderHtml('setLogRecorderToListener');

    echo '<div class="well">
        <button type="button" onClick="window.location.href=\'./adm_control_apis_adv.php\'">Next: go to control page</button>
    </div>';
?>
</body>
</html>


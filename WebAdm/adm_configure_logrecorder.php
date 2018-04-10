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

    $extraModuleName = "zscTokenAddress";
    $extraModuleValue = $_GET[$extraModuleName];
    $modules->writeModuleAddress($extraModuleName, $extraModuleValue);
}
recordSystemModuleAdrs($htmlModules);
?>

<html>
<head>
<?php echo $htmlModules->loadScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function getModuleAdr(module) {
        var adr;
        if (module == "AdmAdv") adr = "<?php echo $htmlModules->readModuleAddress('AdmAdv')?>";        
        else if (module == "PosAdv") adr = "<?php echo $htmlModules->readModuleAddress('PosAdv')?>";
        else if (module == "DBDatabase") adr = "<?php echo $htmlModules->readModuleAddress('DBDatabase')?>";
        else if (module == "FactoryPro") adr = "<?php echo $htmlModules->readModuleAddress('FactoryPro')?>";
        else if (module == "FactoryRec") adr = "<?php echo $htmlModules->readModuleAddress('FactoryRec')?>";
        else if (module == "FactoryTmp") adr = "<?php echo $htmlModules->readModuleAddress('FactoryTmp')?>";
        else if (module == "FactoryAgr") adr = "<?php echo $htmlModules->readModuleAddress('FactoryAgr')?>";
        else if (module == "ControlApisAdv") adr = "<?php echo $htmlModules->readModuleAddress('ControlApisAdv')?>";
        return adr;
    }

    function registerToLogRecorder(module, elementId) {
        logAdr = "<?php echo $htmlModules->readModuleAddress('LogRecorder')?>";
        sF_registerListenerToLogRecorder(logAdr,  getModuleAdr(module), module, elementId);
    }

    function setLogRecorderToListener(module, elementId) {
        logAdr = "<?php echo $htmlModules->readModuleAddress('LogRecorder')?>";
        sF_setLogRecorderToListener(logAdr,  getModuleAdr(module), module, elementId);
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


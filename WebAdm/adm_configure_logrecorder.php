

<?php include("adm_header.php"); ?>

<?php
$urlSuffixTag = false;
function recordSystemModuleAdrs() {
    $system_modules = getModuleArray();
    $num = count($system_modules);
    
    for($x = 0; $x < $num; $x++) {
        $module = $system_modules[$x];
        $adr = $_GET[$module];

        if(!empty($adr)){
            $urlSuffixTag = true;
            writeModuleAddress($module, $adr);
        }
    }
}
recordSystemModuleAdrs();
?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function getModuleAdr(module) {
        var adr;
        if (module == "AdmAdv") adr = "<?php echo readModuleAddress('AdmAdv')?>";        
        else if (module == "DBDatabase") adr = "<?php echo readModuleAddress('DBDatabase')?>";
        else if (module == "FactoryPro") adr = "<?php echo readModuleAddress('FactoryPro')?>";
        else if (module == "FactoryTmp") adr = "<?php echo readModuleAddress('FactoryTmp')?>";
        else if (module == "FactoryAgr") adr = "<?php echo readModuleAddress('FactoryAgr')?>";
        else if (module == "ControlApisAdv") adr = "<?php echo readModuleAddress('ControlApisAdv')?>";
        return adr;
    }

    function registerToLogRecorder(module, elementId) {
        logAdr = "<?php echo readModuleAddress('LogRecorder')?>";
        sF_registerListenerToLogRecorder(logAdr,  getModuleAdr(module), module, elementId);
    }

    function setLogRecorderToListener(module, elementId) {
        logAdr = "<?php echo readModuleAddress('LogRecorder')?>";
        sF_setLogRecorderToListener(logAdr,  getModuleAdr(module), module, elementId);
    }

</script>
</head>
<body>
<?php echo includeHeader();?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
</script>
</head>
<body>
<?php echo includeHeader();
    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';

    echo includeRegisterLogRecorderHtml('registerToLogRecorder');
    
    echo includeSetLogRecorderHtml('setLogRecorderToListener');

    echo '<div class="well">
        <button type="button" onClick="window.location.href='./adm_control_apis_adv.php'">Next: go to control page</button>
    </div>';
?>
</body>
</html>


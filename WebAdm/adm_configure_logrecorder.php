

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
<?php echo includeHeader();?>
    <div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>
    <?php echo includAllAdrs();?>
    
    <div class="well">
        <button type="button" onClick="registerToLogRecorder('AdmAdv','RegisterAdmAdvHash')">Register AdmAdv</button> 
        <text id="RegisterAdmAdvHash"></text>
        <br> <br>
        <button type="button" onClick="registerToLogRecorder('DBDatabase','RegisterDBDatabaseHash')">Register DBDatabase</button> 
        <text id="RegisterDBDatabaseHash"></text>
        <br> <br>
        <button type="button" onClick="registerToLogRecorder('FactoryPro','RegisterFactoryProHash')">Register FactoryPro</button> 
        <text id="RegisterFactoryProHash"></text>
        <br> <br>
        <button type="button" onClick="registerToLogRecorder('FactoryPro','RegisterFactoryTmpHash')">Register FactoryTmp</button> 
        <text id="RegisterFactoryTmpHash"></text>
        <br> <br>
        <button type="button" onClick="registerToLogRecorder('FactoryPro','RegisterFactoryAgrHash')">Register FactoryPro</button> 
        <text id="RegisterFactoryAgrHash"></text>
        <br> <br>
        <button type="button" onClick="registerToLogRecorder('ControlApisAdv','RegisterControlApisAdvHash')">Register ControlApisAdv</button> 
        <text id="RegisterControlApisAdvHash"></text>
    </div>


    <div class="well">
        <button type="button" onClick="setLogRecorderToListener('AdmAdv','SetLogAdmAdvHash')">Set Loger to DBDatabase</button> 
        <text id="SetLogAdmAdvHash"></text>
        <br> <br>
        <button type="button" onClick="setLogRecorderToListener('DBDatabase','SetLogDBDatabaseHash')">Set Loger to DBDatabase</button> 
        <text id="SetLogDBDatabaseHash"></text>
        <br> <br>
        <button type="button" onClick="setLogRecorderToListener('FactoryPro','SetLogFactoryProHash')">Set Loger to FactoryPro</button> 
        <text id="SetLogFactoryProHash"></text>
        <br> <br>
        <button type="button" onClick="setLogRecorderToListener('FactoryTmp','SetLogFactoryTmpHash')">Set Loger to FactoryTmp</button> 
        <text id="SetLogFactoryTmpHash"></text>
        <br> <br>
        <button type="button" onClick="setLogRecorderToListener('FactoryAgr','SetLogFactoryAgrHash')">Set Loger to FactoryAgr</button> 
        <text id="SetLogFactoryAgrHash"></text>
        <br> <br>
        <button type="button" onClick="setLogRecorderToListener('ControlApisAdv','SetLogControlApisAdvHash')">Set Loger to ControlApisAdv</button> 
        <text id="SetLogControlApisAdvHash"></text>
    </div>
    <div class="well">
        <button type="button" onClick="window.location.href='./adm_control_apis_adv.php'">Next: go to control page</button>
    </div>

</body>
</html>


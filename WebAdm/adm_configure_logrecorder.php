

<?php include("adm_header.php"); ?>

<?php
$urlSuffixTag = false;
function storSystemModuleAdrs() {
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
storSystemModuleAdrs();
?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function registerToLogRecorder(module, elementId) {
        var adr;
        if (module == "DBDatabase") adr = "<?php echo readModuleAddress('DBDatabase')?>";
        else if (module == "FactoryPro") adr = "<?php echo readModuleAddress('FactoryPro')?>";
        else if (module == "ControlApisAdv") adr = "<?php echo readModuleAddress('ControlApisAdv')?>";
        sF_registerListenerToLogRecorder("<?php echo readModuleAddress('LogRecorder')?>",  adr, module, elementId);
    }

    function setLogRecorderToListener(module, elementId) {
        var adr;
        if (module == "DBDatabase") adr = "<?php echo readModuleAddress('DBDatabase')?>";
        else if (module == "FactoryPro") adr = "<?php echo readModuleAddress('FactoryPro')?>";
        else if (module == "ControlApisAdv") adr = "<?php echo readModuleAddress('ControlApisAdv')?>";
        sF_setLogRecorderToListener("<?php echo readModuleAddress('LogRecorder')?>",  adr, module, elementId);
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
            <button id="CreateDatabase" type="button" onClick="registerToLogRecorder('DBDatabase','RegisterDBDatabaseHash')">Register DBDatabase</button> 
            <text id="RegisterDBDatabaseHash"></text>
            <br> <br>
            <button id="CreateDatabase" type="button" onClick="registerToLogRecorder('FactoryPro','RegisterFactoryProHash')">Register FactoryPro</button> 
            <text id="RegisterFactoryProHash"></text>
            <br> <br>
            <button id="CreateDatabase" type="button" onClick="registerToLogRecorder('ControlApisAdv','RegisterControlApisAdvHash')">Register ControlApisAdv</button> 
            <text id="RegisterControlApisAdvHash"></text>
    </div>
</body>
</html>


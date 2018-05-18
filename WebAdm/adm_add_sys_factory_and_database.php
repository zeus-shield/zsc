<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<?php
include("adm_header.php");
$htmlModules = new ZscHtmlModules();
?>

<html>
<head>
<?php echo $htmlModules->loadScriptFiles(); ?>
<script type="text/javascript">
    var recorderAdr = "<?php echo $htmlModules->readModuleAddress('LogRecorder')?>";
    var zscTokenAddress = "<?php echo $htmlModules->readModuleAddress('zscTokenAddress')?>";
    var factoryModuleAdrs = <?php echo $htmlModules->getFactoryModuleAddressArrayInString()?>;

    var web3 = setupWeb3js(false);
    var zscSetup = new ZSCSetup(recorderAdr, zscTokenAddress, logedModuleAdrs);

    function addFactoryModule(module, elementId) {
        zscSetup.addFactoryModule(module, elementId);
    }

    function addDatabaseModule(module) {
    }

</script>
</head>
<body>
<?php 
    echo $htmlModules->loadHeader(); 
    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';
    echo $htmlModules->loadAllAdrs();
?>

    <div class="well">
        <?php echo $htmlModules->loadAddFactoryModules('addFactoryModule');?>
    </div>

    <div class="well">
        <button type="button" onClick="addDatabaseModule('DBDatabase')">Add ZSC database</button>;
    </div>

</body>
</html>


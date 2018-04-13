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
    var logedModuleAdrs = <?php echo $htmlModules->getLogedModuleAddressArrayInString()?>;

    var web3 = setupWeb3js(false);
    var zscSetup = new ZSCSetup(recorderAdr, zscTokenAddress, logedModuleAdrs);

    function initSystemModule(module, extraInfo, elementId) {
        var zscTokenAddress = "<?php echo $htmlModules->readModuleAddress('zscTokenAddress')?>";
        zscSetup.initSystemModule(module, extraInfo, elementId);
    }

    function setControlApisAdvAbi(elementId) {
        var adr = "<?php echo $htmlModules->readModuleAddress('ControlApisAdv')?>";
        sF_setControlAbisAdvAbi(adr, elementId);
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
        <text>Step - 0 </text>
        <button type="button" onClick="setControlApisAdvAbi('ControlApisAdvAbiHash', '0')">Set ControlApisAdv Abi</button> <br>
        <text id="ControlApisAdvAbiHash"></text> <br>
        <text id="ControlApisAdvAbi"> </text> <br>

        <?php echo $htmlModules->loadInitModules('initSystemModule');?>

    </div>
</body>
</html>


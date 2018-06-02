<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<?php
include("adm_header.php");
$htmlObjects = new ZSChtmlObjects();
?>

<html>
<head>
<?php echo $htmlObjects->loadScriptFiles(); ?>
<script type="text/javascript">
    var recorderAdr = "<?php echo $htmlObjects->readObjectAddress('LogRecorder')?>";
    var zscTokenAddress = "<?php echo $htmlObjects->readObjectAddress('TestToken')?>";
    var logedModuleAdrs = <?php echo $htmlObjects->getLogedObjectAddressArrayInString()?>;

    var web3 = setupWeb3js(false);
    var zscSetup = new ZSCSetup(recorderAdr, zscTokenAddress, logedModuleAdrs);

    function initSystemComponent(module, elementId) {
        zscSetup.initSystemModule(module, elementId);
    }

    function setControlApisAdvAbi(elementId) {
        var adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        zscSetup.setControlAbisAdvAbi(elementId);
    }

    function setTestZSCToUser(amountId, elementId) {
        var adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        zscSetup.setZSCAmountToUser(document.getElementById(amountId).value, elementId);
    }

</script>
</head>
<body>
<?php 
    echo $htmlObjects->loadHeader(); 
    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';
?>

    <div class="well">
        <text>Step - 0 - 1 </text>
        <button type="button" onClick="setControlApisAdvAbi('ControlApisAdvAbiHash')">Set ControlApisAdv Abi</button> <br>
        <text id="ControlApisAdvAbiHash"></text> <br>


        <text>Step - 0 - 2</text>
        <input type="text" id="AllocatedAmount" value="1000"></input> <br> 
        <button type="button" onClick="setTestZSCToUser('AllocatedAmount', 'setTestZSCToUserHash')">Set Amount of TestZSC allocated to alpha-test user</button> <br>
        <text id="setTestZSCToUserHash"></text> <br>


        <?php echo $htmlObjects->loadInitObjects('initSystemComponent');?>

    </div>
</body>
</html>


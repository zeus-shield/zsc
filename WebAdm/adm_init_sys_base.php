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

    var web3;
    if (doesLocalWeb3js()) {
        web3 = setupWeb3js();
    } else {
        //Metamask
        web3 = new Web3(web3.currentProvider);
    }
    
    var zscSetup = new ZSCSetup(recorderAdr, zscTokenAddress, logedModuleAdrs);

    function setControlApisAdvAbi(elementId) {
        var adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        zscSetup.setControlAbisAdvAbi(elementId);
    }

    function setAdmReadPass(admReadPassId, elementId) {
        var adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        var admReadPass = document.getElementById(admReadPassId).value;
        zscSetup.setAdmReadPass(admReadPass, elementId);
    }

    function setPosPaymentReceiver(receiverId, elementId) {
        var receiver = document.getElementById(receiverId).value;
        zscSetup.setPosPaymentReceiver(receiver, elementId);
    }

    function setTestTokenToUser(ethAmountId, tokenSymbolId, tokenAmountId, elementId) {
        var adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        var ethAmount = document.getElementById(ethAmountId).value;
        var tokenSymbol = document.getElementById(tokenSymbolId).value;
        var tokenAmount = document.getElementById(tokenAmountId).value;
        zscSetup.setTokenAmountToUser(ethAmount, tokenSymbol, tokenAmount, elementId);
    }

    function setModuleDelegate(selectedModuleId, gmAdrId, priorityId, elementId) {
        var selectedModule = document.getElementById(selectedModuleId).value;
        var gmAdr = document.getElementById(gmAdrId).value;
        var priority = document.getElementById(priorityId).value;
        zscSetup.setModuleDelegate(selectedModule, gmAdr, priority, elementId);
    }
</script>
</head>
<body>
<?php 
    echo $htmlObjects->loadHeader(); 
    echo '<div class="page-header"> <font size="5" color="blue" >Setup: Init. Base</font></div>';
?>

    <div class="well">
        <text>Step - 1 </text>
        <button type="button" onClick="setControlApisAdvAbi('ControlApisAdvAbiHash')">Set ControlApisAdv Abi</button> <br>
        <text id="ControlApisAdvAbiHash"></text><br><br>

        <text>Step -2 </text>
        <button type="button" onClick="setAdmReadPass('AdmReadPass', 'setAdmReadPassHash')">Set adm receiver</button><br>
        Adm Pass:  <input type="text" id="AdmReadPass" value="123456"></input> <br>
        <text id="setAdmReadPassHash"></text> <br><br>

        <text>Step -3 </text>
        <button type="button" onClick="setPosPaymentReceiver('PaymentReceiver', 'paymentReceiverHash')">Set payment receiver</button> <br>
        Payment Receiver: <input type="text" id="PaymentReceiver" value="0xA4a77EF86073641fB0fD110F19230215746874eC"></input> 
        <text id="paymentReceiverHash"></text> <br><br>

        <text>Step - 4</text>
        <button type="button" onClick="setTestTokenToUser('AllocatedEthAmount', 'AllocatedTokenSymbol', 'AllocatedTokenAmount', 'setTestTokenToUserHash')">Pre-allocate ETH & Token to tester</button> <br>
        ETH Amount: <input type="text" id="AllocatedEthAmount" value="0"></input> <br> 
        Token Symbol: <input type="text" id="AllocatedTokenSymbol" value="TestMYT"></input> <br> 
        Token Amount: <input type="text" id="AllocatedTokenAmount" value="50000"></input> <br> 
        <text id="setTestTokenToUserHash"></text> <br><br>

        <text>Step - 5</text>
        <button type="button" onClick="setModuleDelegate('SelectedModule', 'ModuleGM', 'Priority', 'setModuleDelegateHash')">Set AdmAdv Adm</button> <br>
        <select id = "SelectedModule" style="width:100px">
        <option value ="AdmAdv">AdmAdv</option>
        <option value ="ControlApisAdv">ControlApi</option>
        <option value="PosManager">PosGM</option>
        </select><br>
        <text>Module GM</text>  <input type="text" id="ModuleGM" value="0x"></input><br>
        <text>Priority</text>  <input type="text" id="Priority" value="0"></input><br>
        <text id="setModuleDelegateHash"></text> <br><br>

    </div>


<?php echo $htmlObjects->loadEthereumEnable(); ?>

</body>
</html>


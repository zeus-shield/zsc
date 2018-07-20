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
    var timeStampAdr = "<?php echo $htmlObjects->readObjectAddress('TimeStamp')?>";
    var zscTokenAddress = "<?php echo $htmlObjects->readObjectAddress('TestToken')?>";
    var logedModuleAdrs = <?php echo $htmlObjects->getLogedObjectAddressArrayInString()?>;

    var web3;
    if (doesLocalWeb3js()) {
        web3 = setupWeb3js();
    } else {
        //Metamask
        web3 = new Web3(web3.currentProvider);
    }
    
    var zscSetup = new ZSCSetup(recorderAdr, timeStampAdr, zscTokenAddress, logedModuleAdrs);

    function initSystemComponent(module, elementId) {
        zscSetup.initSystemModule(module, elementId);
    }

    function setControlApisAdvAbi(elementId) {
        var adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        zscSetup.setControlAbisAdvAbi(elementId);
    }

    function setPosPaymentReceiver(hash, receiverId) {
        var receiver = document.getElementById(receiverId).value;
        zscSetup.setPosPaymentReceiver(hash, receiver);
    }

    function setTestZSCToUser(ethAmountId, tokenSymbolId, tokenAmountId, elementId) {
        var adr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
        var ethAmount = document.getElementById(ethAmountId).value;
        var tokenSymbol = document.getElementById(tokenSymbolId).value;
        var tokenAmount = document.getElementById(tokenAmountId).value;
        zscSetup.setZSCAmountToUser(ethAmount, tokenSymbol, tokenAmount, elementId);
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

        <text>Step - 0 - 2 </text>
        <button type="button" onClick="setPosPaymentReceiver('paymentReceiverHash', 'PaymentReceiver')">Set receiver</button> <br>
        <text>Pos-payment receiver</text>  <input type="text" id="PaymentReceiver" value="0x0"></input> 
        <text id="paymentReceiverHash"></text> <br><br>

        <text>Step - 0 - 2</text>
        <button type="button" onClick="setTestZSCToUser('AllocatedEthAmount', 'AllocatedTokenSymbol', 'AllocatedTokenAmount', 'setTestZSCToUserHash')">Pre-allocate ETH & ZSC to tester</button> <br>
        ETH Amount: <input type="text" id="AllocatedEthAmount" value="0"></input> <br> 
        Token Symbol: <input type="text" id="AllocatedTokenSymbol" value="TestZSC"></input> <br> 
        Token Amount: <input type="text" id="AllocatedTokenAmount" value="50000"></input> <br> 
        <text id="setTestZSCToUserHash"></text> <br><br>


        <?php echo $htmlObjects->loadInitObjects('initSystemComponent');?>

    </div>
</body>
</html>


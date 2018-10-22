<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<html>
<head>
<?php 
include("adm_header.php");
$htmlObjects = new ZSCHtmlObjects();

echo $htmlObjects->loadScriptFiles();
?>
<script type="text/javascript">
    var web3;
    if (doesLocalWeb3js()) {
        web3 = setupWeb3js();
    } else {
        //Metamask
        web3 = new Web3(web3.currentProvider);
    }
    
    var ControlApisAdvAdr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
    var TokenManagerAdr = "<?php echo $htmlObjects->readObjectAddress('TokenManager')?>";
    var walletManager = new ZSCWalletMangement(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'), TokenManagerAdr, cC_getContractAbi('TokenManager'));

    function addTokenContract(nameId, symbolId, decimalsId, adrId, posableTagId, tradeableTagId) {
        walletManager.setTokenContractInfo("AddUserHash", nameId, symbolId, decimalsId, adrId, posableTagId, tradeableTagId, function() {
        	window.location.reload(true);
        });
    }

</script>
</head>
<body>

<?php echo $htmlObjects->loadHeader();?>

<div class="page-header"><font size="5" color="blue" >Manage Token Contracts</font></div>
    <div class="well">
        <text>Name</text>  <input type="text" id="TokenName" value="Ethereum"></input> <br>
        <text>Symbol</text>  <input type="text" id="TokenSymbol" value="ETH"></input> <br>
        <text>Decimals</text>  <input type="text" id="TokenDecimals" value="18"></input> <br>
        <text>Address</text>  <input type="text" id="TokenAddress" value="0x0"></input> <br>
        <text>Posable</text>  <input type="text" id="PosableTag" value="0"></input> <br>
        <text>Tradeable</text>  <input type="text" id="TradableTag" value="0"></input> <br>
        <button type="button" onClick="addTokenContract('TokenName', 'TokenSymbol', 'TokenDecimals', 'TokenAddress', 'PosableTag', 'TradableTag')">Add a token contract</button> <br>
        <text id="AddUserHash"></text>
    </div>

    <div class="well" id="WalletManagement"> </div>

<script type="text/javascript">
	walletManager.loadErcTokenContracts(function(){
		walletManager.loadWalletManagementHtml("WalletManagement");
	});
</script>

</body>
</html>
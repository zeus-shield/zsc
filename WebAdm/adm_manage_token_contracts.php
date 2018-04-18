<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<html>
<head>
<?php 
include("adm_header.php");
$htmlModules = new ZscHtmlModules();

echo $htmlModules->loadScriptFiles();
?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    var ControlApisAdvAdr = "<?php echo $htmlModules->readModuleAddress('ControlApisAdv')?>";
    var walletManager = new ZSCWalletMangement(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));

    function addTokenContract(nameId, symbolId, decimalsId, adrId, hashId) {
        walletManager.addTokenContractInfo(nameId, symbolId, decimalsId, adrId, hashId, function() {
        	window.location.reload(true);
        });
    }

</script>
</head>
<body>

<?php echo $htmlModules->loadHeader();?>

<div class="page-header"><font size="5" color="blue" >Manage Token Contracts</font></div>

<?php echo $htmlModules->loadAllAdrs();?>

    <div class="well">
        <text>Name</text>  <input type="text" id="TokenName" value="test"></input> <br>
        <text>Symbol</text>  <input type="text" id="TokenSymbol" value="test"></input> <br>
        <text>Decimals</text>  <input type="text" id="TokenDecimals" value="test"></input> <br>
        <text>Address</text>  <input type="text" id="TokenAddress" value="test"></input> <br>
        <button type="button" onClick="addTokenContract('TokenName', 'TokenSymbol', 'TokenDecimals', 'TokenAddress')">Add a token contract</button> <br>
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
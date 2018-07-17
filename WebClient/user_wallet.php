<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
session_start();
?>

<html>
<head>
<?php 
    include("include.php");
    $htmlObjects = new ZSCInclude($_SESSION["userType"]);
    echo $htmlObjects->loadScriptFiles(); 
?>
</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div class="well" id="PageAlert"><?php echo $htmlObjects->loadAlert(); ?></div>
        <div class="well" id="PageHeader"><?php echo $htmlObjects->loadHeader(); ?></div>
        <div class="well" id="PageBody"></div>
    </div>

<script type="text/javascript">
    /////////////////////////////
    <?php echo $htmlObjects->loadWeb3();?>
    var checkeWeb3Account = <?php echo $htmlObjects->checkWeb3Account();?>;
    var userLogin;
    var userWallet;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(function(ret) { if(!ret) { window.location.href = "index.php";} });

        userWallet = new ZSCWallet(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
        userWallet.loadTokenWallets();
    });
    /////////////////////////////

    function loadHtml(elementId, func1, func2, func3) {
        var transPrefix = func1 + "('"; 
        var transSuffix = "')";
    
        var showTransPrefix = func2 + "('";
        var showTransSuffix = "')";
    
        var enableWalletPrefix = func3 + "('";
        var enableWalletSuffix = "')";
    
        var symbol;
        var adr;
        var balance;
        var hashId;
    
        var titlle = userLogin.getUserType() + " [" + userLogin.getUserName() + "] - profile: " 
    
        text = '<div class="well"> <text> ' + titlle + ' </text></div>';
        text += '<div class="well">';

        if (userWallet.nomTokens)
    
        for (var i = 0; i < userWallet.tokenNos; ++i) {
            symbol = userWallet.tokenSymbol[i];
            adr = userWallet.tokenAddress[i];
            balance = userWallet.tokenBalance[i];
            hashId = symbol + "Hash";
            sentoId = symbol + "Dest";
            amountId = symbol + "Amount";
    
            text += '---------------</text><br>'
            if (userWallet.tokenStatus[i] == "false") {
                text += '<button type="button" onClick="' + enableWalletPrefix + 'EnableZSCWalletHash' + "', '" + hashId + enableWalletSuffix + '">Enable TestZSC Wallet</button><br>'
                text += '<text id="EnableZSCWalletHash" value = "log:"> </text> <br>';
                text += '<text>---------------</text><br>'
            } else {
                text += 'Symbol: <text>Test' + symbol + '</text><br>'
                text += 'Address: <text> <a href="https://rinkeby.etherscan.io/address/0x' + adr + '#tokentxns" target="_blank" >0x' + adr + '</a></text><br>'
                text += 'Balance: <text>' + balance + '</text><br><br>'
                text += '---------------</text><br>'
                text += 'Dest-adr<input id="' + sentoId + '"></input> <br> Amount:<input id="' + amountId + '"></input> <br>'
                text += '  <button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + transSuffix + '">  Transfer  </button> <br>'
                text += '<text id="'+ hashId + '" value = "log:"> </text> <br>';
                text += '<text>---------------</text><br>'
            }
    
        }
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

    function submitParameterProfileChanges(logID) {
        zscElement.setElementParameter(logID, function(){});
    }

    function loadTokenWallets() {
        userWallet.loadTokenWallets(function() {
            loadHtml("PageBody", "enableTransfer", "submitTransfer");
        });
    }
    
</script>

</body>
</html>

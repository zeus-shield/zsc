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
    var userWalletGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(function(ret) { 
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                userWalletGM = new ZSCWallet(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                userWalletGM.loadTokenWallets(function() {
                    loadHtml("PageBody", "enableUserWallet", "submitTransfer");
                });
            }
        });
    });
    /////////////////////////////
    function enableUserWallet(hashId) {
        userWalletGM.enableUserWallet(hashId, function() {                
            window.location.reload(true);
        });
    }

    function loadHtml(elementId, func1, func2) {
        var enableWalletPrefix = func1 + "('EnableWalletHash')";
 
        var transPrefix = func2 + "('"; 
        var transSuffix = "')";

        var symbol;
        var adr;
        var balance;
        var hashId;
        var tokenNos = userWalletGM.getTokenNos();
        var userWallet = userWalletGM.getWalletAddress();
    
        //var titlle = userLogin.getUserType() + " [" + userLogin.getUserName() + "] - profile: " 
        var titlle = "user wallet address: " + userWallet;
    
        text = '<div class="well"> <text> ' + titlle + ' </text></div>';
        text += '<div class="well">';

        if (userWallet == 0x0) {
            text += '<button type="button" onClick="' + enableWalletPrefix + '">Enable  Wallet</button><br>'
            text += '<text id="EnableWalletHash" value = "log:"> </text> <br>';
        } else {
    
            for (var i = 0; i < tokenNos; ++i) {
                symbol  = userWalletGM.getTokenSymbol[i];
                balance = userWalletGM.getTokenBalance[i];
                hashId  = symbol + "Hash";
                sentoId = symbol + "Dest";
                amountId= symbol + "Amount";
        
                text += '---------------</text><br>'
    
                text += 'Symbol: <text>Test' + symbol + '</text><br>'
                text += 'Address: <text> <a href="https://rinkeby.etherscan.io/address/0x' + adr + '#tokentxns" target="_blank" >0x' + adr + '</a></text><br>'
                text += 'Balance: <text>' + balance + '</text><br><br>'
                text += '---------------</text><br>'
                text += 'Dest-adr<input id="' + sentoId + '"></input> <br> Amount:<input id="' + amountId + '"></input> <br>'
                text += '  <button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + transSuffix + '    ">  Transfer  </button> <br>'
                text += '<text id="'+ hashId + '" value = "log:"> </text> <br>';
                text += '<text>---------------</text><br>'
            }
        }
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }
    
</script>

</body>
</html>

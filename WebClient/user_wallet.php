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
                    loadHtml("PageBody", "enableUserWallet", "submitTransferValue");
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

    function submitTransferValue(tokenSymbol, sentoId, amountId, hashId) {
        var sendto = document.getElementById(sentoId).value;
        var amount = document.getElementById(amountId).value;
        userWalletGM.submitTransferValue(tokenSymbol, sendto, amount, hashId, function() {
            window.location.reload(true);
        });
    }

    function loadHtml(elementId, func1, func2) {
        var enableWalletPrefix = func1 + "('EnableWalletHash')";
 
        var transPrefix = func2 + "('"; 
        var transSuffix = "','EnableWalletHash')";

        var symbol;
        var adr;
        var balance;
        var hashId;
        var tokenNos = userWalletGM.getTokenNos();
        var userWallet = userWalletGM.getWalletAddress();
    
        //var titlle = userLogin.getUserType() + " [" + userLogin.getUserName() + "] - profile: " 
        var titlle = 'user wallet address: <text> <a href="https://rinkeby.etherscan.io/address/0x' + userWallet + '#tokentxns" target="_blank" >' + userWallet + '</a></text>'

        text = '<div class="well" align="center" >' + titlle ;
        text += '<br> <br> <text id="EnableWalletHash" value = "log:"> </text> <br> </div>';

        text += '<div class="well">';

        if (userWallet == 0x0) {
            text += '<button type="button" onClick="' + enableWalletPrefix + '">Enable  Wallet</button><br>'
        } else {
            text += '<table align="center" style="width:600px;min-height:30px">'
            text += '<tr><text id="TrasferHash" value = "log:"> </text> <tr>';
            text += '<tr> <td>Token</td> <td>Balance</td> <td>Locked </td> <td>Dest-adr/Amount</td> <td>Transfer</td></tr> '
            text += '<tr> <td>------</td> <td>------</td> <td>------</td> <td>---</td> <td>---</td> </tr>'
            for (var i = 0; i < tokenNos; ++i) {
                symbol  = userWalletGM.getTokenSymbol(i);
                balance = userWalletGM.getTokenBalance(i);
                locked  = userWalletGM.getTokenLocked(i);
                hashId  = symbol + "Hash";
                sentoId = symbol + "Dest";
                amountId= symbol + "Amount";
    
                text += '<tr>'
                text += '   <td><text>' + symbol + '</text></td>'
                text += '   <td><text>' + balance + '</text></td>'
                text += '   <td><text>' + locked + '</text></td>'
                text += '   <td>DestAdr: <input style="width:120px" id="' + sentoId + '"></input><br>'
                text += '       Amount: <input style="width:120px" id="' + amountId + '"></input></td>'
                text += '   <td><button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + transSuffix + '">  Transfer  </button></td>'
                text += '</tr>'
                text += '<tr> <td>------</td> <td>------</td> <td>---</td> <td>---</td>  <td>---</td> </tr>'
            }
            text += '</table>'
        }
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }
    
</script>

</body>
</html>

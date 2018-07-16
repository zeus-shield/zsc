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

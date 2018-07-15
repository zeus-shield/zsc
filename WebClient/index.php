<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<?php
include("include.php");
$htmlObjects = new ZSCInclude();
?>

<html>
<head>
<?php echo $htmlObjects->loadScriptFiles(); ?>
</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div class="well" id="PageAlert"></div>
        <div class="well" id="PageHeader"></div>
        <div class="well" id="PageBody">
            <table align="center">
                <tr><td>
                    <button type="button" onClick="applyForZSCUser('provider', 'ApplyForProviderHash')">Apply for provider</button> <br><br>
                    <button type="button" onClick="applyForZSCUser('receiver', 'ApplyForProviderHash')">Apply for receiver</button> <br><br>
                    <button type="button" onClick="applyForZSCUser('staker',   'ApplyForProviderHash')">Apply for staker</button> <br>
                    <text id="ApplyForUserHash"></text>
                </td></tr>
            </table>
        </div>
    </div>
<script type="text/javascript">
    var web3;
    if (doesLocalWeb3js()) { web3 = setupWeb3js(); }
    else { web3 = new Web3(web3.currentProvider);} //Metamask

    var zscUser = new ZSCUser();
    var zscElement;
    var zscWalletGM;
    var zscTransGM;
    var zscPosGM;
    var zscModuleAdrGM;

    function htmlLoadLogin() {
        document.getElementById("PageAlert").innerHTML = <?php echo $htmlObjects->loadAlert(); ?>;  
        document.getElementById("PageHeader").innerHTML = <?php echo $htmlObjects->loadPosHeader(); ?>;  
    }

    function checkUser(adrId) { 
        zscUser.tryLogin(function(ret) {
            if(ret) {
                document.getElementById("PageBody").innerHTML = "<br><br><i>Welcome!</i><br><br>";  
            } 
        });
    }

    function applyForZSCUser(userType, hashId) {
        zscUser.activeByUser(userType, hashId);
    }

    htmlLoadLogin();
    checkUser();
</script>

</body>
</html>

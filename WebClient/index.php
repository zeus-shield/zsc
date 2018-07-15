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
            <button type="button" onClick="applyForZSCUser('provider', 'ApplyForProviderHash')">Apply for provider</button> <br><br>
            <button type="button" onClick="applyForZSCUser('receiver', 'ApplyForProviderHash')">Apply for receiver</button> <br><br>
            <button type="button" onClick="applyForZSCUser('staker',   'ApplyForProviderHash')">Apply for receiver</button> <br><br>
            <text id="ApplyForUserHash"></text>
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
        document.getElementById("PageAlert").innerHTML = ""
        + "<i>Needs to install MetaMask extension</i><br>" 
        + "<i>(需要安装MetaMask插件才能显示登录框以其他相关页面)</i><br><br>"
        + "<i>Both the FireFox and Chrome browsers are recommended</i><br>"
        + "<i>(推荐使用火狐或者Chrome浏览器)</i>";  
        document.getElementById("PageHeader").innerHTML = <?php echo $htmlObjects->loadPosHeader(); ?>;  
    }

    function checkUser(adrId) { 
        zscUser = new ZSCUser(admAdr);
        zscUser.tryLogin(function(ret) {
            if(ret) {
                document.getElementById("PageBody").innerHTML = "<br><br><i>Welcome! Need to </i><br><br>";  
            } else {
                
            }
        });
    }


    htmlLoadLogin();
</script>

</body>
</html>

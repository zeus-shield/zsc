<html>

<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script type="text/javascript" src=".././web3.js/dist/web3.js"></script>
<script type="text/javascript" src="../web3js.js"></script>

<script type="text/javascript" src="../userFunctions.js"></script>
<script type="text/javascript" src="../basicFunctions.js"></script>

<script type="text/javascript" src="../zsc_element.js"></script>
<script type="text/javascript" src="../zsc_transactions.js"></script>
<script type="text/javascript" src="../zsc_user.js"></script>
<script type="text/javascript" src="../zsc_wallet.js"></script>
<script type="text/javascript" src="../zsc_module_adrs.js"></script>

<script type="text/javascript" src="./js/zsc_element.js"></script>
<script type="text/javascript" src="./js/zsc_transactions.js"></script>
<script type="text/javascript" src="./js/zsc_user.js"></script>
<script type="text/javascript" src="./js/zsc_wallet.js"></script>
<script type="text/javascript" src="./js/zsc_module_adrs.js"></script>

<script type="text/javascript">

    var web3;
    if (doesLocalWeb3js()) {
        web3 = setupWeb3js();
    } else {
        //Metamask
        web3 = new Web3(web3.currentProvider);
    }
    
    var zscHtml = new ZSCInsura();
    var zscUser;
    var zscElement;
    var zscWalletGM;
    var zscTransGM;
    var zscPosGM;
    var zscModuleAdrGM;

    /*tag:
    logon, wallet, profile, templates, agreements
    */
    function htmlLoadLogin() {
        document.getElementById("PageHeader").innerHTML = ""
        + "<i>Needs to install MetaMask extension</i><br>" 
        + "<i>(需要安装MetaMask插件才能显示登录框以其他相关页面)</i><br><br>"
        + "<i>Both the FireFox and Chrome browsers are recommended</i><br>"
        + "<i>(推荐使用火狐或者Chrome浏览器)</i><br><br>";  
        document.getElementById("PageBody").innerHTML = "";  
        zscHtml.setHtmlContentIds( "PageHeader", "PageBody");
        zscHtml.loadPageBody("login", "checkUser");
    }

    function checkUser(adrId, userId, passId){
        var admAdr = document.getElementById(adrId).value; 
        var user = document.getElementById(userId).value; 
        var password = document.getElementById(passId).value; 

        zscUser = new ZSCUser(admAdr);
        zscUser.tryLogin(user, password, function(ret) {
            if(ret) {
                var userName = zscUser.getUserName();
                var fullAbi = zscUser.getControlApisFullAbi();
                var controlApisAdvAdr = zscUser.getControlApisAdr();
                zscElement   = new ZSCElement(userName, fullAbi, controlApisAdvAdr);
                zscWalletGM  = new ZSCWallet(userName, fullAbi, controlApisAdvAdr);
                zscTransGM  = new ZSCTransactions(userName, fullAbi, controlApisAdvAdr);
                zscModuleAdrGM = new ZSCModuleAdrs(userName, fullAbi, controlApisAdvAdr);
                loadHtmlPageBody("welecome");
            } else {
                alert("User name or password wrong!!");
            }
        });
    }

    function applyForUser(type, hashLogId) {
        zscUser.activeByUser(type, hashLogId);
    }

    function reFresh() {
        loadHtmlPageBody("apply");
    }

    function submitTransferValue(tokenSymbol, destAddressId, amountId, logId) {
        var destAddress = document.getElementById(destAddressId).value; 
        var amount = document.getElementById(amountId).value; 

        zscWalletGM.submitTransferValue(tokenSymbol, destAddress, amount, logId, function(){
            loadHtmlPageBody("wallet");
        });
    }

    function submitParameterProfileChanges(logID) {
        zscElement.setElementParameter(logID, function(){});
    }

    function showTransactions(tokenSymbol) {
        zscTransGM.setTokenSymbol(tokenSymbol);
        loadHtmlPageBody("transaction");
    }

    function enableTestZSCWallet(hashId) {
        zscWalletGM.enableUserWallet(hashId, function() {
            loadHtmlPageBody("wallet")
        });
    }

    function loadLocalPageHeader() {
        zscUser.getUserStatusFromAdm(function(status) {
            if (status == 0) {
                //Should not happen 
            } else if (status == "added") {
                zscHtml.loadPageHeader("loadHtmlPageBody", "null", false);
            } else if (status == "applied") {
                zscUser.getUserTypeFromAdm(function(type){
                    zscHtml.loadPageHeader("loadHtmlPageBody", type, true);
                    loadHtmlPageBody("applied");
                }); 
            } 
        }); 
    }

</script>
</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div id="PageHeader"></div>
        <div id="PageBody"></div>
    </div>
<script type="text/javascript">
    htmlLoadLogin();

    function loadHtmlPageBody(tag) {
        if (tag == "welecome") {
            zscHtml.loadPageBody("welecome");
            loadLocalPageHeader();

        } else if (tag == "apply-staker") {
            document.getElementById("PageHeader").innerHTML = "Applying... <br> Need to reload once succeeded";  
            document.getElementById("PageBody").innerHTML = '<div class="well"> <text id="ApplyForProviderHash"></text> </div>';
            applyForUser("provider", "ApplyForStakerHash");

        } else {
            switch(tag) {
                case "logout": 
                    window.location.reload(true);
                    break;
                
                case "module-adrs": 
                    zscModuleAdrGM.setUserType(zscUser.getUserType());
                    zscModuleAdrGM.setUserName(zscUser.getUserName());
                    zscModuleAdrGM.getModuleAdrs(function() {
                        zscModuleAdrGM.loadModuleAdrsHtml("PageBody");
                    });
                    break;

                case "wallet": 
                    zscWalletGM.setUserType(zscUser.getUserType());
                    zscWalletGM.setUserName(zscUser.getUserName());
                    zscWalletGM.loadTokenInfoByIndex(0, function() {
                        zscWalletGM.loadWalletsHtml("PageBody", "submitTransferValue", "showTransactions", "enableTestZSCWallet");
                    });
                    break;
                    
                case "parameter-profile":
                    zscElement.setElementName(zscUser.getUserName());
                    zscElement.setUserType(zscUser.getUserType());
                    zscElement.loadParameterNamesAndvalues(function() {
                        zscElement.loadParametersHtml("PageBody", "profile", "submitParameterProfileChanges");
                    });
                    break;

                case "transaction":
                    zscTransGM.loadTransactions(function() {
                        zscTransGM.loadTransactionsHtml("PageBody");
                    });
                    break;
                    
                default:
                    break;
            }
        }
    }
</script>
</body>
</html>

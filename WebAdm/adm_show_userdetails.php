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
    var web3 = setupWeb3js(false);
    var ControlApisAdvAdr = "<?php echo $htmlObjects->readObjectAddress('ControlApisAdv')?>";
    var userWallets = new ZSCShowUserWallets(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));
    var userAgrs    = new ZSCShowUserAgrs(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));
    var userTmps    = new ZSCShowUserTmps(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));
    var enObject    = new ZSCShowElement(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));
    var showType;
    var showUser;

    function parserHrefForUserDetails(func) {    
        var urlinfo = window.location.href; 
        var found1  = urlinfo.indexOf("?");
        var found2  = urlinfo.indexOf("=");
    
        if (found1 == -1 || found2 == -1) return false;

        var len        =urlinfo.length;
        var offset     =urlinfo.indexOf("?");
        var newsidinfo =urlinfo.substr(offset,len)
        var newsids    = newsidinfo.split("&");
    
        var detailInfo = newsids[0];
        var detailType = userName.split("=")[1];

        var nameInfo   = newsids[1];
        var userName   = userName.split("=")[1];

        func(detailType, userName);
    }  

    function showUserElement(userName, enName) {
        enObject.init(userName, enName);
        enObject.loadParameterNamesAndvalues(function() {
            enObject.loadParameterValueHtml("UserElement");
        });
    }

    function sloadUserWallets(userName) {
        userWallets.setUserNmae(userName);
        userWallets.loadUserWallets(function() {
            userWallets.loadWalletsHtml("showUserElement");
        });
    }

    function loadUserAgreements() {
        userAgrs.setUserNmae(userName);
        userAgrs.loadUserAgrs(function() {
            userWallets.loadUserAgrsHtml("UserDetails", "showUserElement");
        });
    }

    function loadUserTemplates() {
        userTmps.setUserNmae(userName);
        userTmps.loadUserTmps(function() {
            userWallets.loadUserTmpsHtml("UserDetails", "showUserElement");
        });
    }

    function loadUserInfos() {
        parserHrefForUserDetails(function(type, userName) {
            showType = type;
            showUser = userName;
            if (type == "wallets") {
                loadUserWallets(userName);
            } else if (type == "agreements") {
                loadUserAgreements(userName);
            } else if (type == "templates") {
                loadUserTemplates(userName);
            }
        });
    }

    function reloadUserInfos() {
        window.location.href="adm_show_userdetails.php?type=" + showType + "&uername=" + showUser + "&";   
    }
    
</script>
</head>
<body>

<?php echo $htmlObjects->loadHeader();?>
<?php echo $htmlObjects->loadAllAdrs();?>

<div class="page-header"><font size="5" color="blue">Show user details</font></div>
<div class="well">
    <button type="button" onClick="reloadUserInfos()">Wallets</button>
    <button type="button" onClick="reloadUserInfos()">Templates</button>
    <button type="button" onClick="reloadUserInfos()">Agreements</button>
</div>

    <div class="well" id="UserElement"> </div> <br><br>
    <div class="well" id="UserDetails"> </div>

<script type="text/javascript">
    window.addEventListener('load', function() {
        loadUserInfos();
    });  
</script>   
</body>
</html>

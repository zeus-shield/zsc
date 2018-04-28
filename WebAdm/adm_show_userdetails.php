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
    var userWallets = new ZSCShowUserWallets(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));
    var userAgrs = new ZSCShowUserAgrs(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));
    var userTmps = new ZSCShowUserTmps(ControlApisAdvAdr, cC_getContractAbi('ControlApisAdv'));

    function showUserWallets() {
        if (userWallets.parserUserName()) {
            userWallets.loadUserWallets(function() {
                userWallets.loadWalletHtml("UserWallets");
            });
        }
    }

    function showUserAgreements() {
        if (userAgrs.parserUserName()) {
            userAgrs.loadUserAgrs(function() {
            });
        }
    }

    function showUserTemplates() {
        if (userTmps.parserUserName()) {
            userTmps.loadUserTmps(function() {
            });
        }
    }

</script>
</head>
<body>

<?php echo $htmlModules->loadHeader();?>

<div class="page-header"><font size="5" color="blue" >Manage Token Contracts</font></div>

<?php echo $htmlModules->loadAllAdrs();?>

    <div class="well" id="UserWallets"> </div>

<script type="text/javascript">
    window.addEventListener('load', function() {
        showUserWallets();
        showUserAgreements();
        showUserTemplates();
    });  
</script>   
</body>
</html>
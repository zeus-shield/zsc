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
    var web3;
    if (doesLocalWeb3js()) {
        web3 = setupWeb3js();
    } else {
        //Metamask
        web3 = new Web3(web3.currentProvider);
    }
    
    var AdmAdvAdr = "<?php echo $htmlObjects->readObjectAddress('AdmAdv')?>";
    var userManager = new ZSCUserManagement(AdmAdvAdr, cC_getContractAbi('AdmAdv'));

    function setUserStatus(userName, status, elementId) {
        userManager.setUserActiveState(userName, status, elementId);   
    }

    function loadUserManager() {
        userManager.loadUsers(function(){
            userManager.loadUserManagementHtml( "setUserStatus", "UserManagement");
        });
    }

    function exportZSCUserInfo() {
        userManager.exportUserInfo();
    }

</script>
</head>
<body>

<?php echo $htmlObjects->loadHeader();?>

<div class="page-header"><font size="5" color="blue" >Manage ZSC users</font></div>

    <div class="well">
        <button type="button" onClick="exportZSCUserInfo()">Export ZSC User Info</button> <br>
    </div>

    <div class="well" id="UserManagement"> </div>

<script type="text/javascript">
    window.addEventListener('load', function() {
        loadUserManager();
    }); 


<?php echo $htmlObjects->loadEthereumEnable(); ?>

</script>

</body>
</html>

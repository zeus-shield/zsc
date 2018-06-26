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

    function addUser(usernameId, passwordId, elementId) {
        userManager.addUser(usernameId, passwordId, elementId);
    }

    function addUserRandom(prefixId, suffixLenId, passLenId, hashId) {
        userManager.addUserRandom(prefixId, suffixLenId, passLenId, hashId);
    }

    function setUserStatus(userName, status, elementId) {
        userManager.setUserActiveState(userName, status, elementId);   
    }

    function showUserDetails(showType, userName, elementId) {
        window.location.href="adm_show_userdetails.php?type=" + showType + "&uername=" + userName + "&";   
    }

    function loadUserManager() {
        userManager.loadUsers(function(){
            userManager.loadUserManagementHtml("showUserDetails", "setUserStatus", "UserManagement");
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
        <text>Username</text>  <input type="text" id="AddUsername" value="test"></input> <br>
        <text>Password</text>  <input type="text" id="AddPassword" value="test"></input> <br>
        <button type="button" onClick="addUser('AddUsername', 'AddPassword', 'AddUserhash')">Add a user</button> <br>
        <text id="AddUserhash"></text>
    </div>

    <div class="well">
        <text>Prefix</text>  <input type="text" id="UserPrefix" value="zsc-"></input> 
        <text>Suffix-length</text>  <input type="text" id="UserLength" value="4"></input> 
        <text>Pass-length</text>  <input type="text" id="PassLength" value="10"></input> <br>
        <button type="button" onClick="addUserRandom('UserPrefix', 'UserLength', 'PassLength', 'AddUserRandomhash')">Random add a user</button> <br>
        <text id="AddUserRandomhash"></text>
    </div>

    <div class="well">
        <button type="button" onClick="exportZSCUserInfo()">Export ZSC User Info</button> <br>
    </div>

    <div class="well" id="UserManagement"> </div>

<script type="text/javascript">
    window.addEventListener('load', function() {
        loadUserManager();
    }); 
</script>

</body>
</html>

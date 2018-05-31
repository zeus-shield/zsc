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
    var AdmAdvAdr = "<?php echo $htmlObjects->readObjectAddress('AdmAdv')?>";
    var userManager = new ZSCUserManagement(AdmAdvAdr, cC_getContractAbi('AdmAdv'));

    function addUser(usernameId, elementId) {
        userManager.addUser(usernameId, elementId);
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

</script>
</head>
<body>

<?php echo $htmlObjects->loadHeader();?>

<div class="page-header"><font size="5" color="blue" >Manage ZSC users</font></div>

    <div class="well">
        <text>Username</text>  <input type="text" id="AddUserName" value="test"></input> <br>
        <button type="button" onClick="addUser('AddUserName', 'AddUserHash')">Add a user</button> <br>
        <text id="AddUserHash"></text>
    </div>

    <div class="well" id="UserManagement"> </div>

<script type="text/javascript">
    window.addEventListener('load', function() {
        loadUserManager();
    }); 
</script>

</body>
</html>

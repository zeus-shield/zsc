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

    var AdmAdvAdr = "<?php echo $htmlModules->readModuleAddress('AdmAdv')?>";
   
    var userManager = new ZscUserManagement(AdmAdvAdr, cC_getContractAbi('AdmAdv'));

    function addUser(usernameId, elementId) {
        userManager.addUser(usernameId, elementId, function() {
        	window.location.reload(true);
        });
    }

    function approve(userName, elementId) {
        userManager.aproveUser(username, elementId, function() {
        	window.location.reload(true);
        });    
    }

</script>
</head>
<body>

<?php echo $htmlModules->loadHeader();?>

<div class="page-header"><font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>

<?php echo $htmlModules->loadAllAdrs();?>

    <div class="well">
        <text>Username</text>  <input type="text" id="AddUserName" value="test"></input> <br>
        <button type="button" onClick="addUser('AddUserName', 'AddUserHash')">Add a user</button> <br>
        <text id="AddUserHash"></text>
    </div>

    <div class="well" id="UserManagement"> </div>

<script type="text/javascript">
	userManager.loadUsers(function(){
		userManager.loadUserManagementHtml("approve", "UserManagement");
	});
</script>

</body>
</html>

adm_manage_users
adm_mange_users